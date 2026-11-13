import {initLanguage,getLanguage} from './i18n.mjs';
import {themes,themeOrder,assetsFor,modelAssets,SCENE_THEMES,roomExhibits,themeForExhibit} from './museum-data.mjs';
import {readMuseumNotes,saveMuseumNote,readMuseumFavorites,toggleMuseumFavorite} from './museum-notes.mjs';

const $=selector=>document.querySelector(selector);
const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
initLanguage();
const strings={
  zh:{back:'返回网站',map:'非遗地图',title:'器物有形，技艺可寻。',intro:'旋转细看器形、纹饰与雕刻层次。',room:'展厅总览',object:'单件细看',expand:'放大画面',collapse:'收起画面',preparing:'正在准备器物…',loadingHint:'展品独立加载，资料随时可读。',retry:'重试当前展品',gesture:'拖动旋转 · 滚轮或双指缩放',roomHint:'点展位看器物 · 拖动调整总览',front:'正面',side:'侧面',top:'俯视',reset:'复位',hotspots:'观察点',rotate:'自动旋转',tourLead:'循着纹饰，细看匠心。',tour:'开启主题导览',endTour:'结束导览',next:'下一展 →',chooseAsset:'本次观察',observe:'细看',process:'技艺',source:'来源',listen:'敲击体验',playVideo:'播放《三官堂》节选',entry:'阅读非遗专题 ↗',save:'收藏展品',saved:'♥ 已收藏',noteTitle:'把这次发现，记下来',noteLabel:'我的观察',saveNote:'保存观察手记',exportNotes:'导出观察手记 ↓',footer:'从器物出发，回到人的技艺与生活。',notes:'学习手记',credits:'资料与来源',contact:'联系我们',study:'工艺示意',comparison:'开放藏品',allThemes:'器物馆 / 点选展品',roomScope:'展厅为轻量布景，展位使用造型示意',original:'作品与数字化',collection:'收藏机构',period:'年代',origin:'产地',licence:'使用许可',record:'馆藏编号',sourceLink:'原始藏品记录 ↗',modelLink:'官方三维来源 ↗',licenceLink:'开放许可 ↗',heritageSource:'非遗背景资料 ↗',studySource:'原创几何观察示意',studyDescription:'由网页几何体构成，帮助理解器形或展陈关系；不对应某件文物、传承人作品或完整制作过程。',studyCredit:'荆风楚韵 · 网页展陈',studyLicence:'项目原创示意；相关代码许可见项目说明',loadFailed:'这件器物暂未打开',loadFailureCopy:'可以重试当前展品，或先读旁边的观察提示与来源。',noWebGL:'当前设备暂不能显示三维',noWebGLCopy:'这里保留展品预览和完整资料。可以更换浏览器后重试。',contextLost:'三维画面已暂停',contextLostCopy:'图形资源暂不可用。请重试当前展品，资料和手记仍可使用。',download:'正在加载器物',localOnly:'观察保存在当前浏览器，可随时导出。',notePlaceholder:'例如：侧面看时，前景与背景的高低差更清楚了。',noteEmpty:'先写下一条自己的观察。',noteSaved:'观察已保存，可在本站手记导出文件中一并保留。',noteFailed:'浏览器未能保存，可复制文字或导出已有手记。',noNotes:'还没有保存观察手记。',audioUnavailable:'当前浏览器暂不能播放合成音。',videoCredit:'《三官堂》节选 · 湖北省花鼓戏艺术研究院；保留原片头署名。',videoLocal:'此部署未附带录像，请返回影音课堂查看可用资源。',videoFailure:'视频暂时未能播放，可返回网站影音课堂。',fullscreenFailure:'浏览器暂不支持放大画面。',downloadNote:'观察手记已导出。'},
  en:{back:'Back to website',map:'Heritage map',title:'Objects to see. Crafts to discover.',intro:'Choose an object and a new perspective. Turn a closer look into a discovery.',room:'Gallery overview',object:'Object view',expand:'Expand',collapse:'Exit full screen',preparing:'Preparing your object…',loadingHint:'Objects load individually. Reading is always available.',retry:'Retry this object',gesture:'Drag to orbit · Scroll or pinch to zoom',roomHint:'Select a display · Drag to orbit the room',front:'Front',side:'Side',top:'Above',reset:'Reset',hotspots:'Hotspots',rotate:'Auto rotate',tourLead:'A short journey through objects and crafts.',tour:'Start guided route',endTour:'End route',next:'Next display →',chooseAsset:'Viewing',observe:'Look',process:'Craft',source:'Sources',listen:'Try a bell tone',playVideo:'Play Sanguantang excerpt',entry:'Read heritage entry ↗',save:'Save object',saved:'♥ Saved',noteTitle:'Keep this discovery',noteLabel:'My observation',saveNote:'Save observation',exportNotes:'Export observations ↓',footer:'From objects to the people, crafts and lives behind them.',notes:'Learning notes',credits:'Sources and credits',contact:'Contact',study:'Form study',comparison:'Open collection',allThemes:'Object gallery / select a display',roomScope:'A lightweight display setting with geometric form studies',original:'Maker and digitisation',collection:'Collection',period:'Date',origin:'Origin',licence:'Licence',record:'Accession',sourceLink:'Original collection record ↗',modelLink:'Official 3D source ↗',licenceLink:'Open licence ↗',heritageSource:'Heritage background ↗',studySource:'Original geometric form study',studyDescription:'Built from geometric shapes to explore form and display. It is not a specific artefact, a maker’s documented work or a complete making process.',studyCredit:'Jingchu Reverie · Web exhibition',studyLicence:'Original project study; see the project scope for code terms.',loadFailed:'This object could not be opened',loadFailureCopy:'Retry this object or explore the observation prompts and sources alongside it.',noWebGL:'3D is unavailable on this device',noWebGLCopy:'The preview and reading remain available. Try another browser for 3D.',contextLost:'3D view paused',contextLostCopy:'Graphics resources are unavailable. Retry the object; reading and notes remain available.',download:'Loading object',localOnly:'Observations stay in this browser and can be exported.',notePlaceholder:'For example: the side view makes the difference in relief depth clearer.',noteEmpty:'Write an observation first.',noteSaved:'Observation saved. It will also be included when you export the website’s learning notes.',noteFailed:'The browser could not save this note. Copy your text or export existing notes.',noNotes:'No observations saved yet.',audioUnavailable:'Synthesised audio is unavailable in this browser.',videoCredit:'Sanguantang excerpt · Hubei Flower-Drum Opera Art Research Institute; original opening credits retained.',videoLocal:'This deployment does not include the recording. Visit the website media area for available resources.',videoFailure:'The recording could not be played. Try the website media area.',fullscreenFailure:'Full-screen viewing is unavailable in this browser.',downloadNote:'Observations exported.'}
};
const t=key=>strings[getLanguage()][key]||key;
const local=value=>typeof value==='string'?value:value?.[getLanguage()]||value?.zh||'';
const params=new URL(location.href).searchParams;
const linkedAsset=modelAssets.find(asset=>asset.id===params.get('asset'));
const requestedRaw=params.get('exhibit')||SCENE_THEMES[params.get('guideScene')];
const requested=themeForExhibit(requestedRaw);
const mediaRedirect=requestedRaw==='opera';
if(mediaRedirect)location.replace(new URL(`index.html?lang=${getLanguage()}#media`,import.meta.url).href);
const state={theme:themeOrder.includes(requested)?requested:linkedAsset?.themeId||'chime',asset:null,view:params.get('view')==='room'||(!requested&&!linkedAsset)?'room':'object',point:0,panel:'observe',tour:false,rotating:false,quality:params.get('quality')==='high'?'high':'low'};
state.asset=linkedAsset?.themeId===state.theme?linkedAsset:assetsFor(state.theme)[0];
let viewer=null,viewerPromise=null,loadGeneration=0,toastTimer=null,audio=null,audioTimer=null,closed=false,isLoading=false;
const points=()=>state.asset.points||themes[state.theme].points;
function toast(message){clearTimeout(toastTimer);$('#museum-toast').textContent=message;$('#museum-toast').hidden=false;toastTimer=setTimeout(()=>$('#museum-toast').hidden=true,4200);}
function updateUrl(){const url=new URL(location.href);url.searchParams.set('exhibit',state.theme);url.searchParams.set('lang',getLanguage());url.searchParams.set('view',state.view);if(state.asset.url)url.searchParams.set('asset',state.asset.id);else url.searchParams.delete('asset');if(state.quality==='high'&&state.asset.highUrl)url.searchParams.set('quality','high');else url.searchParams.delete('quality');history.replaceState(null,'',url);}
function homeUrl(hash,exhibit){const url=new URL('index.html',import.meta.url);url.searchParams.set('lang',getLanguage());if(exhibit)url.searchParams.set(hash==='atlas'?'guideMap':'exhibit',exhibit);url.hash=hash;return url.href;}
function renderFavorite(){const saved=readMuseumFavorites().includes(state.asset.id);$('#favorite').setAttribute('aria-pressed',String(saved));$('#favorite').textContent=t(saved?'saved':'save');}
function renderSources(){
  const asset=state.asset,theme=themes[state.theme];$('#source-title').textContent=asset.url?local(asset.fullTitle||asset.title):t('studySource');$('#source-description').textContent=asset.url?local(asset.description):t('studyDescription');
  const fields=asset.url?[[t('original'),local(asset.creator)],[t('collection'),asset.institution],[t('period'),local(asset.date)],[t('origin'),local(asset.origin)],[t('record'),asset.record],[t('licence'),local(asset.license)]].filter(([,value])=>value):[[t('original'),t('studyCredit')],[t('licence'),t('studyLicence')]];
  $('#source-details').innerHTML=fields.map(([key,value])=>`<dt>${esc(key)}</dt><dd>${esc(value||'—')}</dd>`).join('');
  const links=asset.url?[[t('sourceLink'),asset.sourceUrl],[t('modelLink'),asset.modelSource],[t('licenceLink'),asset.licenseUrl]]:[];links.push([t('heritageSource'),theme.source]);
  $('#source-links').innerHTML=links.filter(([,url])=>url).map(([label,url])=>`<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(label)}</a>`).join('');
}
function renderPoint(){
  const list=points();state.point=Math.max(0,Math.min(list.length-1,state.point));
  $('#point-list').innerHTML=list.map((point,index)=>`<button data-point="${index}" aria-pressed="${index===state.point}">${String(index+1).padStart(2,'0')} ${esc(local(point.title))}</button>`).join('');
  $('#point-title').textContent=`${String(state.point+1).padStart(2,'0')} · ${local(list[state.point].title)}`;$('#point-body').textContent=local(list[state.point].body);
  $('#hotspot-layer').querySelectorAll('[data-point]').forEach(button=>button.setAttribute('aria-pressed',String(Number(button.dataset.point)===state.point)));
}
function render(){
  document.documentElement.lang=getLanguage()==='en'?'en':'zh-CN';document.title=getLanguage()==='en'?'3D Object Gallery · Jingchu Reverie | 荆风楚韵':'三维器物展馆 · 荆风楚韵 | Jingchu Reverie';
  document.querySelectorAll('[data-i]').forEach(node=>node.textContent=t(node.dataset.i));
  const theme=themes[state.theme];$('#theme-region').textContent=state.asset.kind==='open'?[local(state.asset.date),local(state.asset.origin)].filter(Boolean).join(' · '):(getLanguage()==='en'?'BRONZE · FORM & DECORATION':'青铜 · 器形与纹饰');$('#theme-title').textContent=state.asset.url?local(state.asset.title):local(theme.title);$('#theme-description').textContent=state.asset.url?local(state.asset.description):local(theme.description);
  $('#visual-label').textContent=state.view==='room'?t('allThemes'):`${theme.number} / ${local(state.asset.url?state.asset.title:theme.name)}`;
  $('#input-hint').textContent=t(state.view==='room'?'roomHint':'gesture');
  $('#asset-select').innerHTML=assetsFor(state.theme).map(asset=>`<option value="${asset.id}" ${asset.id===state.asset.id?'selected':''}>${esc(local(asset.title))}</option>`).join('');
  
  $('#theme-list').innerHTML=themeOrder.map(id=>`<button class="theme-button" data-theme="${id}" aria-pressed="${state.theme===id}"><img src="${themes[id].poster}" alt="" width="150" height="105"><span><small>${themes[id].number}</small>${esc(local(themes[id].name))}</span></button>`).join('');
  $('#view-room').setAttribute('aria-pressed',String(state.view==='room'));$('#view-object').setAttribute('aria-pressed',String(state.view==='object'));$('#auto-rotate').setAttribute('aria-pressed',String(state.rotating));
  $('#tour-toggle').textContent=t(state.tour?'endTour':'tour');$('#tour-toggle').setAttribute('aria-pressed',String(state.tour));$('#tour-next').hidden=!state.tour;
  $('#process-list').innerHTML=theme.process.map(step=>`<li>${esc(local(step))}</li>`).join('');
  $('#listening').hidden=state.theme!=='chime'||state.asset.kind==='open';
  const related=state.asset.relatedEntry;const link=$('#heritage-link');link.href=related?homeUrl('collection',related):state.asset.sourceUrl;link.textContent=related?(getLanguage()==='en'?'Related craft entry ↗':'相关技艺专题 ↗'):(getLanguage()==='en'?'Collection record ↗':'馆藏资料 ↗');if(related){link.removeAttribute('target');link.removeAttribute('rel');}else{link.target='_blank';link.rel='noopener noreferrer';}$('#back-home').href=homeUrl('experience');$('#map-link').href=homeUrl('atlas');$('#learning-link').href=homeUrl('learn');$('#contact-link').href=homeUrl('contact');
  $('#observation-note').placeholder=t('notePlaceholder');renderSources();renderPoint();renderFavorite();renderQuality();selectPanel(state.panel);updateUrl();
}
function renderQuality(){const button=$('#model-quality');button.hidden=!state.asset.highUrl||state.view!=='object';button.disabled=isLoading;button.setAttribute('aria-pressed',String(state.quality==='high'));const en=getLanguage()==='en';button.textContent=isLoading&&state.quality==='high'?(en?'Loading finer detail…':'正在准备高清…'):state.quality==='high'?(en?'Standard detail':'标准画质'):(en?'Finer detail':'高清细看');}
function selectPanel(name){state.panel=name;for(const panel of ['observe','process','source']){const selected=panel===name;const button=$(`#tab-${panel}`);button.setAttribute('aria-selected',String(selected));button.tabIndex=selected?0:-1;$(`#panel-${panel}`).hidden=!selected;}}
function stopMedia(){if(audioTimer)clearTimeout(audioTimer);audioTimer=null;if(audio){audio.close().catch(()=>{});audio=null;}}
function fallback(type='loadFailed',detail='loadFailureCopy'){$('#stage-message').hidden=true;$('#stage-fallback').hidden=false;$('#fallback-poster').src=state.asset.poster||themes[state.theme].poster;$('#fallback-poster').alt=local(state.asset.title);$('#fallback-title').textContent=t(type);$('#fallback-copy').textContent=t(detail);$('#hotspot-layer').replaceChildren();}
async function ensureViewer(){
  if(viewer)return viewer;
  if(!viewerPromise)viewerPromise=import('./museum-stage.mjs').then(({createMuseumViewer})=>{
    if(closed)return null;
    viewer=createMuseumViewer({host:$('#canvas-host'),onPick:selection=>chooseAsset(selection.assetId),onLoading:fraction=>{if(fraction!==null)$('#stage-message h2').textContent=`${t('download')} ${Math.round(fraction*100)}%`;},onProject:project});
    return viewer;
  }).catch(error=>{viewerPromise=null;throw error;});
  return viewerPromise;
}
function project(markers){
  const layer=$('#hotspot-layer');const room=state.view==='room';const expected=room?themeOrder.length:points().length;
  if(layer.children.length!==expected||layer.dataset.mode!==state.view){layer.dataset.mode=state.view;layer.replaceChildren(...Array.from({length:expected},(_,index)=>{const button=document.createElement('button');button.type='button';button.className=room?'hotspot room-label':'hotspot';if(room)button.dataset.theme=themeOrder[index];else button.dataset.point=index;return button;}));}
  markers.forEach((marker,index)=>{const button=layer.children[index];if(!button)return;button.hidden=!marker.visible||(!room&&!$('#show-hotspots').checked);button.style.left=`${marker.x}px`;button.style.top=`${marker.y}px`;button.textContent=room?`${index+1} · ${local(themes[themeOrder[index]].name)}`:String(index+1);if(room){button.style.width='auto';button.style.padding='0 11px';button.style.borderRadius='5px';button.setAttribute('aria-label',local(themes[themeOrder[index]].name));}else{button.setAttribute('aria-label',local(points()[index].title));button.setAttribute('aria-pressed',String(index===state.point));}});
}
async function show({background=false}={}){
  const token=++loadGeneration;const previousQuality=state.quality==='high'?'low':'high';stopMedia();state.rotating=false;isLoading=true;render();if(!background){$('#stage-message').hidden=false;$('#hotspot-layer').replaceChildren();}$('#stage-message h2').textContent=t('preparing');$('#stage-fallback').hidden=true;
  try{const instance=await ensureViewer();if(closed||token!==loadGeneration||!instance)return;const high=state.quality==='high'&&state.asset.highUrl;const model={...state.asset,url:high?state.asset.highUrl:state.asset.url,version:high?state.asset.highVersion:state.asset.version,id:state.asset.id+(high?'-high':'')};const ready=await instance.show({theme:state.theme,asset:model,view:state.view,points:points(),keepCamera:background,roomItems:roomExhibits});if(ready&&token===loadGeneration)$('#stage-message').hidden=true;}
  catch(error){if(token!==loadGeneration||closed)return;console.warn('[Museum]',error);if(background){state.quality=previousQuality;render();toast(t('loadFailureCopy'));}else fallback(viewer?'loadFailed':'noWebGL',viewer?'loadFailureCopy':'noWebGLCopy');}
  finally{if(token===loadGeneration){isLoading=false;renderQuality();}}
}
function chooseAsset(assetId){const asset=modelAssets.find(item=>item.id===assetId);if(!asset)return;state.theme=asset.themeId;state.asset=asset;state.point=0;state.quality='low';state.view='object';state.panel='observe';show();}
function chooseTheme(id,{view='object'}={}){if(!themeOrder.includes(id))return;state.theme=id;state.asset=assetsFor(id)[0];state.quality='low';state.point=0;state.view=view;state.panel='observe';show();}
document.addEventListener('click',event=>{const theme=event.target.closest('[data-theme]');if(theme){chooseTheme(theme.dataset.theme);return;}const point=event.target.closest('[data-point]');if(point){state.point=Number(point.dataset.point);selectPanel('observe');renderPoint();viewer?.render();return;}const camera=event.target.closest('[data-camera]');if(camera)viewer?.setCamera(camera.dataset.camera);const panel=event.target.closest('[data-panel]');if(panel)selectPanel(panel.dataset.panel);});
$('.info-tabs').addEventListener('keydown',event=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;event.preventDefault();const names=['observe','process','source'];let index=names.indexOf(state.panel);index=event.key==='Home'?0:event.key==='End'?2:(index+(event.key==='ArrowRight'?1:2))%3;selectPanel(names[index]);$(`#tab-${names[index]}`).focus();});
$('#view-room').addEventListener('click',()=>{state.view='room';show();});$('#view-object').addEventListener('click',()=>{state.view='object';show();});
$('#asset-select').addEventListener('change',event=>{const asset=assetsFor(state.theme).find(item=>item.id===event.target.value);if(asset){state.asset=asset;state.quality='low';state.point=0;state.view='object';show();}});
$('#model-quality').addEventListener('click',()=>{state.quality=state.quality==='high'?'low':'high';show({background:true});});
$('#show-hotspots').addEventListener('change',()=>viewer?.render());
$('#auto-rotate').addEventListener('click',()=>{state.rotating=!state.rotating;viewer?.rotate(state.rotating);$('#auto-rotate').setAttribute('aria-pressed',String(state.rotating));});
$('#retry-model').addEventListener('click',()=>{viewer?.dispose();viewer=null;viewerPromise=null;show();});
$('#tour-toggle').addEventListener('click',()=>{state.tour=!state.tour;if(state.tour)chooseTheme('pottery');else render();});
$('#tour-next').addEventListener('click',()=>{const index=themeOrder.indexOf(state.theme);if(index===themeOrder.length-1)state.tour=false;chooseTheme(themeOrder[(index+1)%themeOrder.length]);});
$('#favorite').addEventListener('click',()=>{const result=toggleMuseumFavorite(state.asset.id);renderFavorite();if(!result.persistent)toast(t('noteFailed'));});
$('#save-note').addEventListener('click',()=>{const text=$('#observation-note').value;if(!text.trim()){toast(t('noteEmpty'));return;}const result=saveMuseumNote({exhibitId:state.asset.id,assetId:state.asset.id,point:local(points()[state.point].title),text});$('#note-status').textContent=t(result.ok?'noteSaved':'noteFailed');if(result.ok)$('#observation-note').value='';});
$('#export-notes').addEventListener('click',()=>{const notes=readMuseumNotes();if(!notes.length){toast(t('noNotes'));return;}const blob=new Blob([JSON.stringify({project:'荆风楚韵',exportedAt:new Date().toISOString(),observations:notes},null,2)],{type:'application/json;charset=utf-8'});const url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download='荆风楚韵-展馆观察.json';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);toast(t('downloadNote'));});
$('#play-tone').addEventListener('click',async()=>{
  stopMedia();try{const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)throw Error('no-audio');const context=new Audio();audio=context;await context.resume();if(audio!==context)return;const base=392,start=context.currentTime;for(const [ratio,strength] of [[1,.19],[2.76,.07],[5.4,.035]]){const oscillator=context.createOscillator(),gain=context.createGain();oscillator.frequency.value=base*ratio;oscillator.type='sine';gain.gain.setValueAtTime(0,start);gain.gain.linearRampToValueAtTime(strength,start+.008);gain.gain.exponentialRampToValueAtTime(.0001,start+2.2);oscillator.connect(gain).connect(context.destination);oscillator.start(start);oscillator.stop(start+2.3);}audioTimer=setTimeout(()=>{if(audio===context){audio=null;context.close().catch(()=>{});}},2500);}catch{toast(t('audioUnavailable'));}
});
$('#fullscreen').addEventListener('click',async()=>{try{await $('#canvas-stage').requestFullscreen();}catch{toast(t('fullscreenFailure'));}});
$('#exit-fullscreen').addEventListener('click',()=>document.exitFullscreen?.());
document.addEventListener('fullscreenchange',()=>{$('#exit-fullscreen').hidden=!document.fullscreenElement;viewer?.render();});
$('#canvas-host').addEventListener('museum:contextlost',()=>{++loadGeneration;stopMedia();fallback('contextLost','contextLostCopy');});
window.addEventListener('heritage:languagechange',()=>{render();viewer?.render();});
document.addEventListener('visibilitychange',()=>{if(document.hidden)stopMedia();});
window.addEventListener('pagehide',()=>{closed=true;++loadGeneration;stopMedia();viewer?.dispose();viewer=null;viewerPromise=null;clearTimeout(toastTimer);});
window.addEventListener('pageshow',event=>{if(event.persisted){closed=false;show();}});
// Read-only diagnostics for local performance checks; not a product control.
Object.defineProperty(window,'museumDiagnostics',{get:()=>({theme:state.theme,asset:state.asset.id,view:state.view,...viewer?.getMetrics()})});
if(!mediaRedirect){render();show();}
