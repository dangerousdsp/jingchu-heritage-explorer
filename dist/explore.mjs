import {initRoadmap} from './roadmap.mjs';
import {exhibits} from './content.mjs';
import {getJourney,updateJourney,moveStop} from './journey.mjs';
import {RUNTIME_BASE} from './runtime.mjs';
import {LEGACY_MEDIA_ENABLED} from './deployment.mjs';

export function mapProjection(features,width=800,height=510,padding=30) {
  const points=features.flatMap(f=>f.geometry.type==='MultiPolygon'?f.geometry.coordinates.flat(2):f.geometry.coordinates.flat());
  const mercator=([lon,lat])=>[lon,Math.log(Math.tan(Math.PI/4+lat*Math.PI/360))*180/Math.PI];
  const flat=points.map(mercator),xs=flat.map(p=>p[0]),ys=flat.map(p=>p[1]);
  const minX=Math.min(...xs),maxX=Math.max(...xs),minY=Math.min(...ys),maxY=Math.max(...ys);
  const scale=Math.min((width-padding*2)/(maxX-minX),(height-padding*2)/(maxY-minY));
  const left=(width-(maxX-minX)*scale)/2,top=(height-(maxY-minY)*scale)/2;
  return point=>{const [x,y]=mercator(point);return [left+(x-minX)*scale,top+(maxY-y)*scale];};
}
export function initExplore({openExhibit,notify,download}) {
  const $=selector=>document.querySelector(selector);
  const esc=value=>String(value).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  function renderRoute(){const route=getJourney().route;$('#route-count').textContent=`${route.length} 篇`;$('#route-list').innerHTML=route.length?route.map((id,index)=>{const item=exhibits.find(i=>i.id===id);return `<article class="route-stop"><span class="stop-index">${index+1}</span><div><button data-open="${id}">${esc(item.title)} ↗</button><span>${esc(item.city)}</span></div><div class="stop-controls"><button data-route-move="${id}" data-direction="-1" ${index===0?'disabled':''} aria-label="上移${esc(item.title)}">↑</button><button data-route-move="${id}" data-direction="1" ${index===route.length-1?'disabled':''} aria-label="下移${esc(item.title)}">↓</button><button data-route-remove="${id}" aria-label="移除${esc(item.title)}">×</button></div></article>`;}).join(''):'<p>可从图鉴加入想读的资料，参观行程请使用上方“我的文化行程”。</p>';}
  document.addEventListener('click',event=>{const add=event.target.closest('[data-route-add]');if(add){if(!getJourney().route.includes(add.dataset.routeAdd))updateJourney(data=>data.route.push(add.dataset.routeAdd));notify('已加入线上阅读清单。');add.textContent='✓ 已加入';}const move=event.target.closest('[data-route-move]');if(move)updateJourney(data=>{data.route=moveStop(data.route,move.dataset.routeMove,Number(move.dataset.direction));});const remove=event.target.closest('[data-route-remove]');if(remove)updateJourney(data=>{data.route=data.route.filter(id=>id!==remove.dataset.routeRemove);});});
  $('#suggest-route').addEventListener('click',()=>{const favorites=getJourney().favorites;updateJourney(data=>{data.route=[...new Set([...data.route,...(favorites.length?favorites:['pottery','wood','chime'])])];});});
  $('#export-route').addEventListener('click',()=>download({title:'荆楚非遗阅读清单',kind:'reading-list',items:getJourney().route.map(id=>{const item=exhibits.find(e=>e.id===id);return {id,title:item.title,sources:item.sources};})},'荆楚非遗-阅读清单.json'));
  window.addEventListener('heritage:journeychange',renderRoute);renderRoute();
  initRoadmap({openExhibit,notify}).catch(error=>{console.error('[Heritage map]',error);$('#map-health').textContent='地图暂未准备完成，可继续浏览图鉴或刷新后重试。';});
  const video=$('#heritage-video');let localURL=null;
  const originalURL=new URL('StreamingAssets/'+encodeURIComponent('花鼓戏视频.mp4'),RUNTIME_BASE).href;
  function setVideoSource(url){video.pause();video.src=url;video.load();video.playbackRate=Number($('#video-speed').value);}
  async function originalVideo(){
    if(!LEGACY_MEDIA_ENABLED){$('#video-status').textContent='公开演示未附带原视频，仍可选择自己的视频在本地预览。';return;}
    try{const response=await fetch(originalURL,{method:'HEAD'});if(!response.ok)throw Error('missing');if(localURL){URL.revokeObjectURL(localURL);localURL=null;}setVideoSource(originalURL);$('#restore-video').hidden=true;$('#local-video').value='';$('#load-video').textContent='重新打开项目视频';$('#video-status').textContent='花鼓戏视频 · 项目原存档。点击画面中的播放按钮开始。';}
    catch{$('#video-status').textContent='暂未找到原视频。请用本地启动器打开，或选择自己的视频预览。';}
  }
  $('#load-video').addEventListener('click',originalVideo);$('#restore-video').addEventListener('click',originalVideo);
  if(!LEGACY_MEDIA_ENABLED){$('#load-video').disabled=true;$('#load-video').textContent='原视频仅在本地资源版提供';$('#video-status').textContent='公开演示未附带原视频；可选择自己的视频预览，文件不会上传。';}
  $('#video-speed').addEventListener('change',()=>{video.playbackRate=Number($('#video-speed').value);});
  $('#local-video').addEventListener('change',event=>{const file=event.target.files?.[0];if(!file)return;if(!file.type.startsWith('video/')&&!/\.(mp4|webm|ogg|mov|m4v)$/i.test(file.name)){notify('请选择可播放的视频文件。');return;}if(localURL)URL.revokeObjectURL(localURL);localURL=URL.createObjectURL(file);setVideoSource(localURL);$('#video-status').textContent=`本地预览：${file.name}。文件没有上传。`;$('#restore-video').hidden=!LEGACY_MEDIA_ENABLED;});
  video.addEventListener('error',()=>{$('#video-status').textContent='视频未能播放，请检查文件格式或重新选择视频。';});
  window.addEventListener('pagehide',()=>{if(localURL)URL.revokeObjectURL(localURL);});
}
