import test from 'node:test';
import assert from 'node:assert/strict';
import {groupByLocation,fetchJSON} from '../dist/map-support.mjs';
import {prepareRuntimeData} from '../dist/runtime-download.mjs';
import {photos} from '../dist/photo-data.mjs';
import {exhibits} from '../dist/content.mjs';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
test('regional map grouping retains co-located topics and ignores invalid coordinates',()=>{
 const ref={lon:114,lat:30},a={id:'a',locationReference:ref},b={id:'b',locationReference:ref};
 assert.deepEqual(groupByLocation([a,b,{id:'missing'},{locationReference:{lon:NaN,lat:30}}]),[[a,b]]);
 assert.equal(groupByLocation(exhibits).length,73);
});
test('map requests reject HTTP failures and abort a stalled connection',async t=>{
 t.mock.method(globalThis,'fetch',async()=>new Response('',{status:404}));await assert.rejects(fetchJSON('https://example.invalid/'),/404/);
 globalThis.fetch=async(_url,{signal})=>new Promise((_resolve,reject)=>signal.addEventListener('abort',()=>reject(new Error('aborted'))));
 await assert.rejects(fetchJSON('https://example.invalid/',{timeout:5}),/aborted/);
});
test('split Unity payload is assembled in manifest order and releases its object URL',async t=>{
 const first=new Uint8Array([31,139,8]),second=new Uint8Array([1,2]);
 const parts=[first,second].map((data,i)=>({path:`Build/data-0${i}.bin`,bytes:data.length,sha256:createHash('sha256').update(data).digest('hex')}));
 const manifest={format:1,compression:'gzip',bytes:5,parts};let object;
 t.mock.method(globalThis,'fetch',async url=>String(url).endsWith('runtime-manifest.json')?Response.json(manifest):new Response(String(url).includes('data-00')?first:second));
 t.mock.method(URL,'createObjectURL',blob=>{object=blob;return 'blob:unit-test';});let released=false;t.mock.method(URL,'revokeObjectURL',()=>released=true);
 const values=[],result=await prepareRuntimeData('https://example.invalid/runtime/',v=>values.push(v));
 assert.deepEqual([...new Uint8Array(await object.arrayBuffer())],[31,139,8,1,2]);assert.equal(values.at(-1),1);result.release();assert.equal(released,true);
});
test('Unity loader rejects corrupt or escaping chunks and preserves local-export fallback',async t=>{
 t.mock.method(globalThis,'fetch',async()=>new Response('',{status:404}));
 const local=await prepareRuntimeData('https://example.invalid/runtime/');assert.match(local.url,/Build\/WebGL.data.unityweb$/);
 globalThis.fetch=async()=>Response.json({format:1,compression:'gzip',bytes:3,parts:[{path:'../secret',bytes:3}]});
 await assert.rejects(prepareRuntimeData('https://example.invalid/runtime/'),/invalid-runtime-part/);
 const bytes=new Uint8Array([1,2,3]);
 globalThis.fetch=async url=>String(url).endsWith('.json')?Response.json({format:1,compression:'gzip',bytes:3,parts:[{path:'Build/data-00.bin',bytes:3,sha256:'0'.repeat(64)}]}):new Response(bytes);
 await assert.rejects(prepareRuntimeData('https://example.invalid/runtime/'),/runtime-part-integrity/);
});
test('all selected photos have matching local files, attribution and subject scope',async()=>{
 assert.equal(photos.length,22);
 for(const p of photos){const bytes=await readFile(new URL('../dist/'+p.src,import.meta.url));assert.equal(createHash('sha256').update(bytes).digest('hex'),p.sha256);assert.ok(p.author&&p.source.startsWith('https://commons.wikimedia.org/')&&p.licenseURL.startsWith('http')&&p.scope&&p.scopeEn);}
 assert.ok(exhibits.filter(e=>e.photo).length>=40);
});
