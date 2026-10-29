import {RUNTIME_BASE} from './runtime.mjs';
import {LEGACY_MEDIA_ENABLED} from './deployment.mjs';
import {attachCanvasInput} from './canvas-input.mjs';
export const SCENES=new Map([[2,'毛家窑陶器'],[3,'通山木雕'],[4,'曾都编钟'],[5,'戏台漫游']]);
// All six serialized scenes contain Enter on the GameObject named Canvas.
export const sceneMessage=id=>SCENES.has(Number(id))?`OnLoginButtonClick${Number(id)}`:null;
export function initPlayer({notify}) {
  const $=selector=>document.querySelector(selector);
  let unity=null,state='idle',selected=2,epoch=0,clock=null,busy=false;
  let releaseCanvasInput=()=>{};
  const lookMode=()=>$('#roam-look-mode').checked;
  const cameraHint=()=>lookMode()?'按住左键拖动调整视角':'点击交互模式 · 切回左键环视可转向';
  function tabs(){$('#roam-input-tip').hidden=selected!==5;document.querySelectorAll('[data-scene]').forEach(button=>{const active=Number(button.dataset.scene)===selected;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active));button.disabled=state==='stopping'||busy;});const hint=$('#scene-hint');hint.hidden=selected<4;hint.textContent=selected===4?'编钟沿用旧版场景，实测切换时曾出现卡顿。若长时间无响应，可关闭标签页后重新打开网页。':'戏台沿用旧版场景，仍有物理配置问题。建议先保存手记，使用电脑体验。';}
  function show(next) {
    state=next;
    $('#player-cover').hidden=next!=='idle';$('#player-loading').hidden=next!=='loading';$('#player-error').hidden=next!=='error';$('#canvas-host').hidden=next!=='ready';
    $('#fullscreen-player').disabled=next!=='ready';$('#stop-player').disabled=next!=='ready';
    $('#player-status').textContent=({idle:`尚未加载 · 已选${SCENES.get(selected)}`,loading:`正在准备${SCENES.get(selected)}…`,ready:`${SCENES.get(selected)} · ${selected===5?cameraHint():'用上方入口切换'}`,error:'加载未完成',stopping:'正在结束体验…'})[next];tabs();
    if(!LEGACY_MEDIA_ENABLED){$('#start-player').disabled=true;$('#player-status').textContent='公开演示版 · 三维资源需在本地单独配置';}
  }
  function focusMode(value) {
    $('#player-panel').classList.toggle('theater',value);$('#leave-theater').hidden=!value;
    $('#fullscreen-player').textContent=value?'⛶ 收起画面':'⛶ 放大体验';
    document.body.classList.toggle('gallery-focused',value);
  }
  async function switchScene() {
    releaseCanvasInput.release?.();
    if(!unity||state!=='ready'||busy)return;
    busy=true;tabs();
    try {
      $('#player-status').textContent=`正在打开${SCENES.get(selected)}…`;
      await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame);
      unity.SendMessage('Canvas',sceneMessage(selected));
      await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame);
      $('#player-status').textContent=`${SCENES.get(selected)} · ${selected===5?cameraHint():'用上方入口切换'}`;
    } catch(error){console.error(error);notify('场景暂时未切换，请结束体验后重试。');}
    finally{busy=false;tabs();}
  }
  async function load() {
    if(!LEGACY_MEDIA_ENABLED){notify('公开演示未附带原三维资源，使用方法见项目介绍。');return;}
    if(['loading','ready','stopping'].includes(state))return;
    const token=++epoch;show('loading');$('#load-progress').value=0;$('#slow-loading').hidden=true;
    const start=Date.now();clock=setInterval(()=>{const elapsed=Math.floor((Date.now()-start)/1000);$('#load-detail').textContent=`已等待 ${elapsed} 秒 · 正在下载资源或准备场景`;$('#slow-loading').hidden=elapsed<45;},1000);
    try {
      const response=await fetch(new URL('Build/WebGL.loader.js',RUNTIME_BASE),{method:'HEAD'});
      if(!response.ok)throw Error('missing-runtime');
      if(typeof window.createUnityInstance!=='function')await new Promise((resolve,reject)=>{const script=document.createElement('script');script.src=new URL('Build/WebGL.loader.js',RUNTIME_BASE);script.onload=resolve;script.onerror=()=>{script.remove();reject(Error('loader-failed'));};document.body.append(script);});
      if(token!==epoch)return;
      const canvas=document.createElement('canvas');canvas.id='unity-canvas';canvas.width=960;canvas.height=600;canvas.tabIndex=0;canvas.setAttribute('aria-label','非遗三维展馆画面，戏台左键环视模式下按住鼠标左键拖动调整视角');
      releaseCanvasInput();releaseCanvasInput=attachCanvasInput(canvas,{isRoaming:()=>selected===5,isLookMode:lookMode});
      $('#canvas-host').replaceChildren(canvas);
      const instance=await window.createUnityInstance(canvas,{
        dataUrl:new URL('Build/WebGL.data.unityweb',RUNTIME_BASE).href,
        frameworkUrl:new URL('Build/WebGL.framework.js.unityweb',RUNTIME_BASE).href,
        codeUrl:new URL('Build/WebGL.wasm.unityweb',RUNTIME_BASE).href,
        streamingAssetsUrl:new URL('StreamingAssets',RUNTIME_BASE).href,
        companyName:'DefaultCompany',productName:'My test',productVersion:'0.1',
        // Legacy UGUI uses fixed pixel geometry. Keep 960x600 internally and
        // scale the complete canvas in CSS rather than resize its render target.
        matchWebGLToCanvasSize:false,devicePixelRatio:1,
        showBanner:(message,type)=>console[type==='error'?'error':'warn']('[Unity]',message)
      },fraction=>{if(token!==epoch)return;const percent=Math.round(fraction*100);$('#load-progress').value=percent;$('#loading-title').textContent=percent>=90?'正在准备展品…':`正在加载资源 ${percent}%`;});
      if(token!==epoch){await instance.Quit();return;}
      unity=instance;
      // Bypass the old oversized Start/Selection menus using their existing API.
      unity.SendMessage('Canvas',sceneMessage(selected));
      await new Promise(requestAnimationFrame);await new Promise(requestAnimationFrame);
      clearInterval(clock);show('ready');canvas.focus();
    } catch(error) {
      if(token!==epoch)return;clearInterval(clock);console.error('[Heritage runtime]',error);
      $('#error-detail').textContent=error.message==='missing-runtime'?'没有找到三维资源。请通过本地启动器打开，或按使用说明配置 runtime 目录。资料、导览和学习功能仍可使用。':'加载未完成。请检查服务、网络与内存后重试。';show('error');
    }
  }
  async function selectScene(id,{scroll=true}={}) {
    const next=Number(id);if(!SCENES.has(next))return;
    selected=next;tabs();if(scroll)$('#experience').scrollIntoView({behavior:'smooth',block:'start'});
    if(state==='ready')await switchScene();else if(state!=='loading')await load();
  }
  async function stop() {
    if(state!=='ready')return;
    releaseCanvasInput.release?.();
    ++epoch;clearInterval(clock);focusMode(false);show('stopping');
    try{await unity.Quit();unity=null;releaseCanvasInput();$('#canvas-host').replaceChildren();show('idle');$('#start-player').focus();}
    catch(error){console.error(error);$('#error-detail').textContent='程序未能正常结束，请刷新页面。学习与路线记录会保留。';show('error');}
  }
  document.querySelectorAll('[data-scene]').forEach(b=>b.addEventListener('click',()=>{selected=Number(b.dataset.scene);tabs();if(state==='ready')switchScene();else if(state!=='loading'){show('idle');}}));
  $('#roam-look-mode').addEventListener('change',()=>{releaseCanvasInput.release?.();if(state==='ready')$('#player-status').textContent=`${SCENES.get(selected)} · ${cameraHint()}`;});
  $('#start-player').addEventListener('click',load);$('#retry-player').addEventListener('click',load);$('#stop-player').addEventListener('click',stop);
  $('#fullscreen-player').addEventListener('click',()=>focusMode(!$('#player-panel').classList.contains('theater')));
  $('#leave-theater').addEventListener('click',()=>{focusMode(false);$('#fullscreen-player').focus();});
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&$('#player-panel').classList.contains('theater')){focusMode(false);$('#fullscreen-player').focus();}});
  show('idle');return {selectScene,stop};
}
