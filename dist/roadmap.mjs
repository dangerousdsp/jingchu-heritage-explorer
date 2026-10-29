import {exhibits,categories} from './content.mjs';
import {normalizeTrip,orderedStops,optimizeStops,haversine,compass,amapRouteURL,amapSearchURL,TRAVEL_KEY} from './travel.mjs';
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const km=meters=>meters<1000?`${Math.round(meters)} 米`:`${(meters/1000).toFixed(1)} 公里`;
const time=seconds=>seconds>=3600?`${Math.floor(seconds/3600)} 小时 ${Math.round(seconds%3600/60)} 分钟`:`${Math.max(1,Math.round(seconds/60))} 分钟`;
function instruction(step){const m=step.maneuver||{},mod={'left':'左转','right':'右转','slight left':'稍向左','slight right':'稍向右','sharp left':'向左急转','sharp right':'向右急转','straight':'直行','uturn':'掉头'}[m.modifier]||'继续前行';const type={'depart':'出发','arrive':'抵达本段终点','roundabout':`进入环岛${m.exit?'，由第'+m.exit+'个出口驶出':''}`,'rotary':'进入环岛','merge':'汇入道路','on ramp':'驶入匝道','off ramp':'驶出匝道','fork':mod,'turn':mod,'continue':'继续前行','new name':'继续前行','end of road':mod}[m.type]||mod;return `${type}${step.name?' · '+step.name:''}`;}
export async function initRoadmap({openExhibit,notify}){
  const $=s=>document.querySelector(s),L=window.L;
  if(!L){$('#map-health').textContent='地图组件未能打开，请刷新；图鉴仍可使用。';return;}
  const response=await fetch('visit-places.json');if(!response.ok)throw Error('places missing');
  const places=await response.json(),byId=new Map(places.map(p=>[p.id,p]));
  let storage,trip;try{storage=window.localStorage;trip=normalizeTrip(JSON.parse(storage.getItem(TRAVEL_KEY)||'null'),places);}catch{trip=normalizeTrip(null,places);}
  let road=null,revision=0,loading=false,lastRequest=0;
  const roadCache=new Map();
  const map=L.map('travel-map',{scrollWheelZoom:false,minZoom:5,maxZoom:18}).setView([30.95,112.25],7);
  const distribution=L.layerGroup().addTo(map),visits=L.layerGroup().addTo(map),path=L.layerGroup().addTo(map),numbers=L.layerGroup().addTo(map);
  let tileLoads=0,tileErrors=0;
  const tiles=L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap contributors</a>',detectRetina:false});
  function health(){const refs=new Set(exhibits.filter(e=>e.locationReference).map(e=>e.locationReference.lon+','+e.locationReference.lat)).size;$('#map-health').textContent=tileErrors&&!tileLoads?'街道底图暂未连接，参考点和行程仍可使用；可逐站打开高德。':`可缩放街道地图 · ${refs} 组地区参考位置 · ${places.length} 个文化目的地`;}
  tiles.on('tileload',()=>{tileLoads++;health();});tiles.on('tileerror',()=>{tileErrors++;health();});tiles.addTo(map);health();
  for(const city of [...new Set(exhibits.map(e=>e.city))]){const o=document.createElement('option');o.value=city;o.textContent=city;$('#map-city').append(o);}
  for(const category of categories){const o=document.createElement('option');o.value=category;o.textContent=category;$('#map-category').append(o);}
  for(const place of places){const o=document.createElement('option');o.value=place.id;o.textContent=place.name;$('#travel-start').append(o);}
  $('#travel-start').value=trip.start;
  const matchingTopics=()=>exhibits.filter(e=>($('#map-city').value==='all'||e.city===$('#map-city').value)&&($('#map-category').value==='all'||e.category===$('#map-category').value));
  function placeCard(p){return `<article class="place-card"><p class="place-city">${esc(p.city)}</p><h4><button data-show-place="${p.id}">${esc(p.name)} ↗</button></h4><p>${esc(p.theme)}</p><button class="button compact" data-visit-add="${p.id}">${trip.stops.includes(p.id)?'✓ 已加入行程':'+ 加入行程'}</button></article>`;}
  function showTopics(items,title){$('#region-title').textContent=title;$('#region-summary').textContent=`${items.length} 条项目记录 · 此处标记为地区参考，不是场馆入口。`;$('#region-items').innerHTML=items.map(item=>`<article class="region-item"><div><span>${esc(item.category)}</span><button data-open="${item.id}">${esc(item.title)} ↗</button></div><button data-route-add="${item.id}" aria-label="将${esc(item.title)}加入阅读清单">+ 阅读</button></article>`).join('');}
  function showPlace(p,fly=true){
    if(!p)return;if(fly)map.setView([p.lat,p.lon],14);
    $('#region-title').textContent=p.name;$('#region-summary').textContent=p.city;
    const topics=exhibits.filter(e=>(p.topicFids||[]).map(String).includes(e.fid));
    $('#region-items').innerHTML=`<article class="place-detail"><p>${esc(p.theme)}</p><p class="place-address">${esc(p.address)}</p><p>${esc(p.visitNote)}</p><p class="place-coordinate-note">${esc(p.coordinateNote)}</p><div class="place-actions"><button class="button primary compact" data-visit-add="${p.id}">+ 加入行程</button><a class="button compact" href="${amapSearchURL(p)}" target="_blank" rel="noopener noreferrer">高德确认地点 ↗</a></div><div class="place-sources">${p.sources.map(s=>`<a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.title)} ↗</a>`).join('')}</div>${topics.length?'<h4>行前读一篇</h4>':''}${topics.map(e=>`<button class="text-link topic-link" data-open="${e.id}">${esc(e.title)} →</button>`).join('')}</article>`;
  }
  function renderDiscovery(){const city=$('#map-city').value,items=matchingTopics();const selected=places.filter(p=>city==='all'||p.city===city);$('#region-title').textContent=city==='all'?'挑一个想去的地方':city;$('#region-summary').textContent=`${items.length} 条项目与专题，${selected.length} 个已核实地址的文化目的地。`;$('#region-items').innerHTML=selected.length?selected.map(placeCard).join(''):'<p>本地区暂未收录参观地址，可以点击参考点认识项目，或切换地区。</p>'+items.slice(0,10).map(e=>`<button class="text-link topic-link" data-open="${e.id}">${esc(e.title)} →</button>`).join('');}
  function renderMarkers(fit=false){
    distribution.clearLayers();visits.clearLayers();const groups=new Map(),items=matchingTopics();
    for(const e of items){const ref=e.locationReference;if(!ref)continue;const key=ref.lon+','+ref.lat;if(!groups.has(key))groups.set(key,[]);groups.get(key).push(e);}
    const bounds=[];
    if($('#show-distribution').checked)for(const group of groups.values()){
      const ref=group[0].locationReference;bounds.push([ref.lat,ref.lon]);
      const marker=L.marker([ref.lat,ref.lon],{icon:L.divIcon({className:'distribution-marker',html:`<span>${group.length}</span>`,iconSize:[28,28]}),title:`${group[0].region}，${group.length}条地区项目`,keyboard:true});
      marker.on('click',()=>showTopics(group,group[0].region));marker.addTo(distribution);
    }
    const city=$('#map-city').value;
    if($('#show-visits').checked)for(const p of places.filter(p=>city==='all'||p.city===city)){
      bounds.push([p.lat,p.lon]);const marker=L.marker([p.lat,p.lon],{icon:L.divIcon({className:'visit-marker',html:'<span>◆</span>',iconSize:[32,32]}),title:p.name,keyboard:true});marker.bindTooltip(p.name,{direction:'top'}).on('click',()=>showPlace(p,false)).addTo(visits);
    }
    if(fit&&bounds.length)map.fitBounds(bounds,{padding:[28,28],maxZoom:11});renderDiscovery();
  }
  function save(){try{storage.setItem(TRAVEL_KEY,JSON.stringify(trip));}catch{notify('行程已更新，但当前浏览器无法保存。可打印行程保留。');}}
  function clearRoad(){revision++;road=null;path.clearLayers();$('#road-steps').replaceChildren();}
  function drawTrip(){
    numbers.clearLayers();const ordered=orderedStops(trip,places);
    ordered.forEach((p,i)=>L.marker([p.lat,p.lon],{icon:L.divIcon({className:'trip-marker',html:`<span>${i+1}</span>`,iconSize:[34,34]}),title:`第${i+1}站 ${p.name}`,zIndexOffset:1000}).on('click',()=>showPlace(p,false)).addTo(numbers));
    if(!road){path.clearLayers();if(ordered.length>1)L.polyline(ordered.map(p=>[p.lat,p.lon]),{color:'#a34a36',dashArray:'7 9',weight:3,opacity:.65}).addTo(path);}
  }
  function renderTrip(message='行程已更新，点击“生成道路路线”查看实际道路。'){
    const ordered=orderedStops(trip,places);$('#travel-count').textContent=`${ordered.length} 站`;$('#route-status').textContent=ordered.length?message:'选择一个推荐行程，或从地图加入目的地。';
    $('#travel-stops').innerHTML=ordered.length?ordered.map((p,i)=>{const prev=ordered[i-1];return `<article class="travel-stop"><span class="travel-number">${i+1}</span><div><h4><button data-show-place="${p.id}">${esc(p.name)}</button></h4><p>${esc(p.city)} · ${esc(p.address)}</p>${p.routingPoint?`<p class="travel-access">道路接驳：${esc(p.routingPoint.label)}</p>`:''}${prev?`<p class="travel-direction">↗ 向${compass(prev,p)} · 直线约 ${haversine(prev,p).toFixed(1)} 公里 <span>（虚线仅表示游览顺序）</span></p>`:'<p class="travel-direction">● 行程起点</p>'}<div class="stop-nav"><a href="${amapRouteURL(prev,p,'car')}" target="_blank" rel="noopener noreferrer">高德驾车 ↗</a><a href="${amapRouteURL(prev,p,'bus')}" target="_blank" rel="noopener noreferrer">公交 ↗</a><a href="${amapRouteURL(prev,p,'walk')}" target="_blank" rel="noopener noreferrer">步行 ↗</a></div></div><div class="stop-controls"><button data-trip-move="${p.id}" data-delta="-1" aria-label="上移${esc(p.name)}" ${i===0||p.id===trip.start?'disabled':''}>↑</button><button data-trip-move="${p.id}" data-delta="1" aria-label="下移${esc(p.name)}" ${i===ordered.length-1||p.id===trip.start?'disabled':''}>↓</button><button data-trip-remove="${p.id}" aria-label="移除${esc(p.name)}">×</button></div></article>`;}).join(''):'<p class="empty-state">还没有选择目的地。试试“武汉文化漫游”，或点击地图上的菱形标记。</p>';
    drawTrip();
  }
  function changed(){trip=normalizeTrip(trip,places);clearRoad();save();renderTrip();}
  function fitTrip(){const selected=orderedStops(trip,places);if(selected.length)map.fitBounds(selected.map(p=>[p.lat,p.lon]),{padding:[48,48],maxZoom:13});}
  async function plan(){
    if(loading)return;const selected=orderedStops(trip,places);if(selected.length<2){notify('请至少加入两个目的地。');return;}
    const cacheKey=selected.map(p=>p.id).join(','),cached=roadCache.get(cacheKey);
    const hit=cached&&Date.now()-cached.at<600000?cached.data:null;
    if(!hit&&Date.now()-lastRequest<1200){notify('请稍等一秒再查询新路线。');return;}
    if(!hit)lastRequest=Date.now();
    const token=revision;loading=true;$('#plan-trip').disabled=true;$('#route-status').textContent='正在查询道路路线…';
    try{
      let data=hit;
      if(!data){
      let res=await fetch('/api/route?'+new URLSearchParams({stops:cacheKey}),{signal:AbortSignal.timeout(23000)});
      if(res.status===404||res.status===405){
        // Static hosting has no local adapter. OSRM supports public browser requests.
        const coords=selected.map(p=>`${p.lon.toFixed(7)},${p.lat.toFixed(7)}`).join(';');
        res=await fetch('https://router.project-osrm.org/route/v1/driving/'+coords+'?overview=full&geometries=geojson&steps=true&radiuses='+selected.map(()=>'1500').join(';'),{signal:AbortSignal.timeout(23000)});
        const raw=await res.json();if(raw.code!=='Ok'||!raw.routes?.length)throw Error('道路服务暂时不可用');data=raw.routes[0];
      }else data=await res.json();
      if(!res.ok)throw Error(data.error||'道路服务暂时不可用');
      if(roadCache.size>30)roadCache.clear();roadCache.set(cacheKey,{at:Date.now(),data});
      }
      if(token!==revision)return;
      road=data;path.clearLayers();L.geoJSON(data.geometry,{style:{color:'#a34432',weight:5,opacity:.9}}).addTo(path);
      $('#route-status').textContent=`驾车道路全程 ${km(data.distance)} · 估算 ${time(data.duration)} · ${selected.length}站（未计游览停留与实时路况）`;
      $('#travel-stops').querySelectorAll('.travel-direction').forEach((node,index)=>{if(index>0){const leg=data.legs[index-1];node.textContent=`↗ 向${compass(selected[index-1],selected[index])} · 道路 ${km(leg.distance)} · 估算 ${time(leg.duration)}`;}});
      $('#road-steps').innerHTML=data.legs.map((leg,i)=>`<details class="road-leg" ${i===0?'open':''}><summary><span>${i+1}. ${esc(selected[i].name)} → ${esc(selected[i+1].name)}</span><strong>${km(leg.distance)} · ${time(leg.duration)}</strong></summary><ol>${leg.steps.map(step=>`<li><span>${esc(instruction(step))}</span><small>${km(step.distance)}</small></li>`).join('')}</ol><p>道路吸附点为地图估算，开放入口请在目的地官方渠道与导航中确认。</p><a class="text-link" href="${amapRouteURL(selected[i],selected[i+1])}" target="_blank" rel="noopener noreferrer">把这一段交给高德导航 ↗</a></details>`).join('');fitTrip();
    }catch(error){if(token===revision){$('#route-status').textContent=`${error.message?.startsWith('道路')?error.message:'道路服务暂时未连接。'} 虚线仍表示参观顺序；请逐站打开高德查看实际导航。`;}}
    finally{loading=false;$('#plan-trip').disabled=false;}
  }
  document.addEventListener('click',event=>{
    const show=event.target.closest('[data-show-place]');if(show)showPlace(byId.get(show.dataset.showPlace));
    const add=event.target.closest('[data-visit-add]');if(add){const id=add.dataset.visitAdd;if(!byId.has(id))return;if(trip.stops.includes(id)||trip.start===id){notify('目的地已在行程中。');return;}if(orderedStops(trip,places).length>=8){notify('一次行程最多安排8站。');return;}trip.stops.push(id);changed();notify('已加入文化行程，可在地图下方查看方向并规划道路。');add.textContent='✓ 已加入行程';}
    const remove=event.target.closest('[data-trip-remove]');if(remove){const id=remove.dataset.tripRemove;trip.stops=trip.stops.filter(i=>i!==id);if(trip.start===id){trip.start='';$('#travel-start').value='';}changed();}
    const move=event.target.closest('[data-trip-move]');if(move){const ids=orderedStops(trip,places).map(p=>p.id);const index=ids.indexOf(move.dataset.tripMove),to=index+Number(move.dataset.delta);if(index>=0&&to>=0&&to<ids.length&&!(trip.start&&to===0)){[ids[index],ids[to]]=[ids[to],ids[index]];trip.stops=ids.filter(id=>id!==trip.start);changed();}}
    const preset=event.target.closest('[data-preset]');if(preset){const ids=preset.dataset.preset==='wuhan'?['hubei-museum','yellow-crane','guiyuan']:['hubei-museum','jingzhou-museum','enshi-museum'];trip={start:'',stops:ids.filter(id=>byId.has(id))};$('#travel-start').value='';changed();fitTrip();$('#route-status').textContent='推荐行程已加入。点击“生成道路路线”查看道路与逐段方向。';}
    const find=event.target.closest('[data-find-visit]');if(find){const e=exhibits.find(e=>e.id===find.dataset.findVisit);document.querySelector('#exhibit-dialog').close();$('#atlas').scrollIntoView();const related=places.filter(p=>(p.topicFids||[]).map(String).includes(e?.fid));if(related.length)showPlace(related[0]);else{$('#map-city').value=e.city;renderMarkers(true);showTopics([e],e.title+' · 项目所属地区');}}
  });
  for(const id of ['map-city','map-category','show-distribution','show-visits'])$('#'+id).addEventListener('change',()=>renderMarkers(id==='map-city'));
  $('#map-reset').addEventListener('click',()=>{$('#map-city').value='all';$('#map-category').value='all';renderMarkers(true);});
  $('#travel-start').addEventListener('change',event=>{const id=event.target.value;if(id&&!trip.stops.includes(id)&&orderedStops(trip,places).length>=8){event.target.value=trip.start;notify('一次行程最多8站，请先移除一站再更换出发点。');return;}trip.start=id;changed();});
  $('#optimize-trip').addEventListener('click',()=>{trip=optimizeStops(trip,places);changed();fitTrip();notify('已按直线距离给出顺路顺序，不代表道路最短时间。');});
  $('#plan-trip').addEventListener('click',plan);$('#clear-trip').addEventListener('click',()=>{trip={stops:[],start:''};$('#travel-start').value='';changed();});
  $('#print-trip').addEventListener('click',()=>window.print());
  renderMarkers(true);renderTrip();new ResizeObserver(()=>map.invalidateSize()).observe($('#travel-map'));
}
