// Buildless local preview with only Node.js standard libraries. Loopback only.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawn} from 'node:child_process';

const project=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const dist=path.join(project,'dist'),args=process.argv.slice(2);
const option=(key,fallback)=>{const index=args.indexOf(key);return index<0?fallback:args[index+1]||fallback;};
const port=Number(option('--port','8767'));if(!Number.isInteger(port)||port<1024||port>65535)throw Error('Choose a port between 1024 and 65535.');
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'application/javascript; charset=utf-8','.mjs':'application/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.ico':'image/x-icon','.glb':'model/gltf-binary','.gltf':'model/gltf+json','.wasm':'application/wasm','.mp4':'video/mp4','.woff2':'font/woff2','.bin':'application/octet-stream'};
function confined(base,relative){const target=path.resolve(base,relative);if(target!==base&&!target.startsWith(base+path.sep))return null;try{const real=fs.realpathSync(target),root=fs.realpathSync(base);return real===root||real.startsWith(root+path.sep)?real:null;}catch{return null;}}
function json(res,status,value){const body=Buffer.from(JSON.stringify(value));res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Content-Length':body.length,'Cache-Control':'no-store'});res.end(body);}
const routeCache=new Map();let lastRoute=0;
async function route(url,res){
  const ids=(url.searchParams.get('stops')||'').split(',');const places=JSON.parse(fs.readFileSync(path.join(dist,'visit-places.json'),'utf8').replace(/^\uFEFF/,''));const byId=new Map(places.map(p=>[p.id,p]));
  if(ids.length<2||ids.length>8||new Set(ids).size!==ids.length||ids.some(id=>!byId.has(id))){json(res,400,{error:'请选择2至8个不同的已收录目的地。'});return;}
  const stops=ids.map(id=>{const p=byId.get(id);return {...p,...p.routingPoint};});
  if(stops.some(p=>p.coordinateSystem!=='WGS84'||!Number.isFinite(p.lon)||!Number.isFinite(p.lat)||p.lon<108||p.lon>117||p.lat<28||p.lat>34)){json(res,400,{error:'目的地坐标未通过校验。'});return;}
  const key=ids.join(','),now=Date.now(),cached=routeCache.get(key);if(cached&&now-cached.at<600000){json(res,200,cached.result);return;}
  if(now-lastRoute<1100){json(res,503,{error:'请求过快，请稍后再试。'});return;}lastRoute=now;
  try{
    const coordinates=stops.map(p=>`${p.lon.toFixed(7)},${p.lat.toFixed(7)}`).join(';');
    const endpoint=`https://router.project-osrm.org/route/v1/driving/${coordinates}?overview=full&geometries=geojson&steps=true&radiuses=${stops.map(()=>1500).join(';')}`;
    const response=await fetch(endpoint,{signal:AbortSignal.timeout(18000),headers:{Accept:'application/json','User-Agent':'JingchuHeritageExplorer/local'}});if(!response.ok)throw Error('route-http');
    const reader=response.body.getReader(),chunks=[];let size=0;while(true){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>4*1024*1024){await reader.cancel();throw Error('route-size');}chunks.push(value);}
    const payload=JSON.parse(Buffer.concat(chunks).toString('utf8')),r=payload.routes?.[0];if(payload.code!=='Ok'||!r||r.legs?.length!==stops.length-1||r.geometry?.type!=='LineString')throw Error('route-incomplete');
    const result={provider:'OSRM / OpenStreetMap',profile:'driving',includesLiveTraffic:false,distance:r.distance,duration:r.duration,geometry:r.geometry,stops:ids,snappingMeters:(payload.waypoints||[]).map(p=>p.distance||0),legs:r.legs.map(leg=>({distance:leg.distance,duration:leg.duration,steps:(leg.steps||[]).slice(0,300).map(step=>({name:String(step.name||'').slice(0,200),distance:step.distance,duration:step.duration,maneuver:Object.fromEntries(['type','modifier','exit','location'].map(k=>[k,step.maneuver?.[k]??null]))}))}))};
    if(routeCache.size>30)routeCache.clear();routeCache.set(key,{at:now,result});json(res,200,result);
  }catch{json(res,503,{error:'道路服务暂时不可用。可以查看行程顺序，并逐站打开高德导航。'});}
}
const server=http.createServer(async(req,res)=>{
  if(!['GET','HEAD'].includes(req.method)){res.writeHead(405);res.end();return;}
  let url,pathname;try{url=new URL(req.url,'http://localhost');pathname=decodeURIComponent(url.pathname);}catch{res.writeHead(400);res.end();return;}
  if(pathname.includes('\\')||pathname.includes('\0')){res.writeHead(400);res.end();return;}
  if(pathname==='/api/route'){if(req.method==='HEAD'){res.writeHead(405);res.end();return;}try{await route(url,res);}catch{json(res,503,{error:'道路服务暂时不可用。'});}return;}
  const target=confined(dist,pathname.slice(1)||'index.html');
  if(!target){res.writeHead(404);res.end('Resource unavailable');return;}
  const stat=fs.statSync(target);if(!stat.isFile()){res.writeHead(404);res.end();return;}
  const etag=`"${stat.size.toString(16)}-${Math.trunc(stat.mtimeMs).toString(16)}"`;
  const headers={'X-Content-Type-Options':'nosniff','Referrer-Policy':'strict-origin-when-cross-origin','Cache-Control':'no-cache','Last-Modified':stat.mtime.toUTCString(),ETag:etag};
  if(req.headers['if-none-match']===etag&&!req.headers.range){res.writeHead(304,headers);res.end();return;}
  let start=0,end=stat.size-1,status=200;
  if(target.endsWith('.mp4')){headers['Accept-Ranges']='bytes';if(req.headers.range){const match=/^bytes=(\d*)-(\d*)$/.exec(req.headers.range);if(!match||(!match[1]&&!match[2])){res.writeHead(416,{'Content-Range':`bytes */${stat.size}`});res.end();return;}if(match[1]){start=Number(match[1]);if(match[2])end=Math.min(end,Number(match[2]));}else start=Math.max(0,stat.size-Number(match[2]));if(start>=stat.size||end<start){res.writeHead(416,{'Content-Range':`bytes */${stat.size}`});res.end();return;}status=206;headers['Content-Range']=`bytes ${start}-${end}/${stat.size}`;}}
  headers['Content-Type']=types[path.extname(target).toLowerCase()]||'application/octet-stream';
  headers['Content-Length']=end-start+1;res.writeHead(status,headers);if(req.method==='HEAD'){res.end();return;}const stream=fs.createReadStream(target,{start,end});stream.on('error',()=>res.destroy());res.on('close',()=>stream.destroy());stream.pipe(res);
});
server.on('error',error=>{console.error(error.code==='EADDRINUSE'?`Port ${port} is in use. Try another --port.`:error.message);process.exitCode=1;});
server.listen(port,'127.0.0.1',()=>{const base=`http://127.0.0.1:${port}/`;const page=option('--page','index.html');const url=new URL(page,base);if(url.origin!==new URL(base).origin)throw Error('Preview page must be local.');console.log(`Jingchu Heritage Explorer\nLocal: ${url.href}\nPress Ctrl+C to stop.`);if(args.includes('--open')){const command=process.platform==='win32'?['rundll32.exe',['url.dll,FileProtocolHandler',url.href]]:process.platform==='darwin'?['open',[url.href]]:['xdg-open',[url.href]];const child=spawn(command[0],command[1],{detached:true,stdio:'ignore',windowsHide:true});child.on('error',()=>{});child.unref();}});
