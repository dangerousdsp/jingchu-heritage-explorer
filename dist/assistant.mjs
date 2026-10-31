// Isolated, progressively enhanced UI for the no-model knowledge guide.
import {answerQuestion,KNOWLEDGE_STATS} from './assistant-knowledge.mjs';
import {exhibits,categories} from './content.mjs';
import {getLanguage} from './i18n.mjs';

const copy={
 zh:{name:'小楚 · 非遗助手',mode:'非遗导览 · 日常问答',open:'AI 小助手',close:'收起助手',clear:'清空对话',language:'EN',placeholder:'问非遗，也可以聊学习、出行和日常…',send:'发送',hint:'问题仅在本页处理，不上传。Enter 发送，Shift+Enter 换行。',welcome:'你好，我是小楚。想了解哪项非遗，或让今天的安排轻松一点？',intro:`从${KNOWLEDGE_STATS.entries}条文化资料里帮你找答案，也可以聊学习、出行和日常安排。资料没有说清的地方，我会告诉你。`,source:'资料依据',original:'原文来源',more:'查看专题',place:'查看目的地',choose:'了解这一条',copy:'复制回答',copied:'已复制',copyFail:'复制未成功，可直接选中文字。',waiting:'正在查找本地资料…',failure:'这一条暂时没能整理好，可以换个说法再试。',visitLoading:'参观地点资料仍在准备，请稍后重试。',mapNotReady:'地图还在准备，你可以先到地图区域稍等片刻。',sceneHint:'已选择展品。请在三维区域主动点击“进入三维体验”，首次核心下载约348 MiB。',sourceScope:'不知道从哪问起，可以点一个例子，也可以直接输入自己的问题。',exhibit:'查看专题',map:'在地图里看',photo:'相关图片',scene:'选择三维展品',filter:'到图鉴继续筛选',atlas:'打开地图与行程',collection:'浏览非遗图鉴',experience:'前往三维体验',gallery:'打开非遗影像',media:'打开影音课堂',learn:'打开学习手记',empty:'对话已清空；网站收藏和学习记录不受影响。',limit:'最多输入500个字符。',user:'你',assistant:'小楚',sourcesCount:'条来源',topicButtons:['什么是非遗？','武汉有哪些非遗？','哪些展品能看三维？','学习没动力','周末怎么安排？','陪我聊聊']},
 en:{name:'Xiaochu · Heritage guide',mode:'Heritage guidance · Everyday questions',open:'AI guide',close:'Minimise guide',clear:'Clear chat',language:'中文',placeholder:'Ask about heritage, study, visits or everyday plans…',send:'Send',hint:'Questions stay on this page. Enter sends; Shift+Enter adds a line.',welcome:'Hello, I am Xiaochu. What would you like to explore, or make a little easier today?',intro:`Find answers in ${KNOWLEDGE_STATS.entries} cultural entries, or ask about study, visits and everyday plans. I will tell you when the material is incomplete.`,source:'Sources',original:'Original source',more:'Read entry',place:'View destination',choose:'Choose this entry',copy:'Copy answer',copied:'Copied',copyFail:'Could not copy. You can select the text directly.',waiting:'Looking through local material…',failure:'I could not organise that answer. Please try a different wording.',visitLoading:'Visit records are still loading. Please try again shortly.',mapNotReady:'The map is still preparing. You can wait in the map area.',sceneHint:'Exhibit selected. Start explicitly in the 3D area; the first core download is about 348 MiB.',sourceScope:'Choose an example to get started, or type a question of your own.',exhibit:'Read entry',map:'See the map',photo:'Related photo',scene:'Select 3D exhibit',filter:'Continue in collection',atlas:'Open map and trips',collection:'Browse collection',experience:'Go to 3D experience',gallery:'Open photo gallery',media:'Open media area',learn:'Open learning notes',empty:'Chat cleared. Website favourites and learning records are unchanged.',limit:'Use at most 500 characters.',user:'You',assistant:'Xiaochu',sourcesCount:'sources',topicButtons:['What is intangible cultural heritage?','What heritage is in Wuhan?','Which exhibits have 3D?','I cannot start studying','What to do this weekend?','Chat with me']}
};
const CSS=`
:host{all:initial;position:fixed;right:24px;bottom:max(22px,env(safe-area-inset-bottom));z-index:1800;font:14px/1.7 'Microsoft YaHei','PingFang SC',system-ui,sans-serif;color:#253f36;pointer-events:none;color-scheme:light;--green:#235c49;--line:#dce6dc;--paper:#f7f7ef;--vp:100dvh}
*{box-sizing:border-box}button,textarea{font:inherit}button,a,textarea{-webkit-tap-highlight-color:transparent}button{cursor:pointer}button:focus-visible,a:focus-visible,textarea:focus-visible,summary:focus-visible{outline:3px solid #bd8b3e;outline-offset:3px}button{color:inherit}button:disabled{opacity:.5;cursor:default}[hidden]{display:none!important}a{color:var(--green);text-underline-offset:3px;overflow-wrap:anywhere}.launcher{pointer-events:auto;display:flex;align-items:center;justify-content:center;gap:9px;border:1px solid #b7cbb9;background:#f7f7ef;padding:5px;width:62px;height:62px;border-radius:50%;box-shadow:0 5px 25px #143a2326;min-height:56px;min-width:56px}.launcher img{width:50px;height:50px;object-fit:contain;background:transparent}.launcher span{position:absolute;right:74px;white-space:nowrap;border:1px solid #d8e2d1;border-radius:16px;background:#f8faf3;padding:4px 11px;font-size:12px;letter-spacing:.5px;font-weight:500;box-shadow:0 3px 12px #15352012}.launcher:hover{background:#edf3e7}.panel{pointer-events:auto;position:absolute;right:0;bottom:76px;width:400px;height:min(650px,calc(var(--vp) - 122px));max-height:calc(var(--vp) - 122px);display:flex;flex-direction:column;border:1px solid #bdd0be;background:#fff;border-radius:17px;overflow:hidden;box-shadow:0 16px 65px #173c2b30;min-height:280px}.header{display:flex;gap:11px;align-items:center;padding:15px 16px;background:#eef3e8;border-bottom:1px solid #dce6d7;flex:none}.header img{width:34px;height:34px;object-fit:contain}.heading{flex:1;min-width:0}.heading h2{font-size:16px;font-weight:650;line-height:1.5;margin:0}.heading p{margin:3px 0 0;color:#5d7565;font-size:10px}.header button{background:#fff9;border:1px solid #cdddc9;border-radius:7px;height:36px;min-width:36px;padding:5px 7px;font-size:12px}.header .minimise{font-size:23px;line-height:1}.chat{flex:1;min-height:0;overflow:auto;padding:18px 15px;overscroll-behavior:contain;scroll-behavior:auto;background:linear-gradient(180deg,#fbfcf7,#fff 240px)}.welcome{border:1px solid #dce7d7;background:#f3f6ed;border-radius:11px;padding:14px;margin:0 0 16px}.welcome p{margin:0 0 8px;font-size:14px}.welcome small{font-size:11px;line-height:1.8;color:#637b69}.chips{display:flex;gap:7px;flex-wrap:wrap;margin-top:13px}.chips button{border:1px solid #cddcc8;border-radius:16px;background:#fff;padding:6px 11px;font-size:12px;line-height:1.6;text-align:left;min-height:34px}.chips button:hover{background:#e9f1e3}.message{margin:18px 0}.speaker{font-size:10px;color:#6c8071;margin:0 0 5px;letter-spacing:.5px}.bubble{border:1px solid #e0e8dd;background:#fafcf7;border-radius:2px 12px 12px;padding:13px 14px;overflow-wrap:anywhere;line-height:1.85;font-size:14px}.user{margin-left:45px}.user .speaker{text-align:right}.user .bubble{background:#e8f0e2;border-color:#d1dfca;border-radius:12px 2px 12px 12px}.bubble h3{font-size:14px;line-height:1.6;margin:0 0 9px;font-weight:650;color:#244b36}.bubble p{margin:0 0 11px;white-space:pre-line}.bubble p:last-child{margin-bottom:0}.entry{display:flex;gap:10px;align-items:flex-start;width:100%;margin:10px 0;border:1px solid #dbe5d5;border-radius:9px;background:#fff;padding:10px;text-align:left}.entry:hover{border-color:#92b28f;background:#f6faf1}.entry img{width:54px;height:54px;border-radius:6px;object-fit:cover;flex:none;background:#f2f4eb}.entry .card-body{min-width:0;flex:1}.entry strong{display:block;line-height:1.6;font-size:13px;font-weight:650}.entry small{display:block;line-height:1.7;font-size:10px;color:#657965;margin-top:3px}.entry .card-link{font-size:10px;color:#2a6347;margin-top:5px}.actions{display:flex;gap:7px;flex-wrap:wrap;margin:12px 0 2px}.actions button{border:1px solid #b9d0b6;border-radius:6px;background:#eef4e8;padding:6px 9px;line-height:1.6;font-size:11px;min-height:34px}.sources{border-top:1px solid #e2e9dd;padding-top:9px;margin:12px 0 0;font-size:11px;color:#5d735e}.sources summary{cursor:pointer;min-height:28px}.sources a{display:block;margin:5px 0}.copy{border:0;padding:5px 0;background:transparent;font-size:10px;color:#637e67;min-height:28px}.status{font-size:11px;min-height:18px;color:#617a61;line-height:1.6;padding:0 16px;background:#fff;flex:none}.composer{padding:10px 13px 12px;border-top:1px solid #dde7d8;background:#fafcf6;flex:none}.composer form{display:flex;gap:8px;align-items:flex-end}.composer textarea{width:100%;min-width:0;resize:none;border:1px solid #c8d9c2;border-radius:9px;padding:10px 11px;line-height:1.6;background:#fff;color:#263d2f;font-size:13px;height:64px}.composer .send{background:var(--green);color:#fff;border:0;border-radius:8px;min-height:42px;min-width:49px;padding:10px 8px;font-size:12px}.composer .tools{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-top:7px}.composer .tools button{border:0;padding:4px 0;background:transparent;font-size:10px;color:#60785e;min-height:28px}.composer small{font-size:9px;line-height:1.65;color:#73836e;display:block}.composer .count{font-size:10px;color:#70816d}.footnote{margin-top:12px;font-size:10px;color:#788873;line-height:1.8}.answer-chips{margin:8px 0 0}.answer-chips button{font-size:11px}.loading{font-size:11px;color:#5d775d}
@media(max-width:600px){:host{right:14px;bottom:max(14px,env(safe-area-inset-bottom))}.launcher{padding:4px;width:58px;height:58px;min-height:52px;min-width:52px}.launcher img{width:48px;height:48px}.launcher span{position:absolute;right:62px;white-space:nowrap;border:1px solid #d8e2d1;border-radius:16px;background:#f8faf3;padding:4px 10px;font-size:11px;box-shadow:0 3px 12px #15352012}.panel{width:min(400px,calc(100vw - 28px));bottom:66px;height:min(600px,calc(var(--vp) - 104px));max-height:calc(var(--vp) - 104px);border-radius:14px}.header{padding:12px}.header .heading h2{font-size:15px}.chat{padding:14px 12px}.bubble{font-size:14px;padding:12px}.composer textarea{font-size:16px;height:65px}.composer small{font-size:9px}.message{margin:14px 0}.panel .header button{height:36px;min-width:36px}}
@media(prefers-reduced-motion:reduce){.chat{scroll-behavior:auto}}
@media print{:host{display:none!important}}
`;

export function safeLink(value){try{const url=new URL(value,import.meta.url);return ['http:','https:'].includes(url.protocol)?url.href:null;}catch{return null;}}
export function homeLink(language='zh',params={},hash='collection'){
 const url=new URL('index.html',import.meta.url);url.searchParams.set('lang',language==='en'?'en':'zh');
 for(const [key,value] of Object.entries(params))if(['exhibit','guideMap','guidePlace','guideScene'].includes(key)&&typeof value==='string'&&/^[a-z0-9-]+$/i.test(value))url.searchParams.set(key,value);
 if(exhibits.some(e=>e.city===params.guideCity))url.searchParams.set('guideCity',params.guideCity);
 if(categories.includes(params.guideCategory))url.searchParams.set('guideCategory',params.guideCategory);
 url.hash=['collection','atlas','experience','media','learn'].includes(hash)?hash:'collection';return url.href;
}

export function mountAssistant(){
 if(typeof document==='undefined'||!document.body||document.getElementById('jingchu-assistant'))return;
 const host=document.createElement('div');host.id='jingchu-assistant';host.setAttribute('data-no-i18n','');
 const root=host.attachShadow({mode:'open'}),style=document.createElement('style');style.textContent=CSS;root.append(style);
 const el=(tag,text='',className='')=>{const node=document.createElement(tag);if(text)node.textContent=text;if(className)node.className=className;return node;};
 const panel=el('section','','panel');panel.id='xiaochu-panel';panel.setAttribute('role','region');panel.setAttribute('aria-labelledby','xiaochu-title');panel.hidden=true;
 const header=el('header','','header'),logo=el('img');logo.src=new URL('assets/project-logo-transparent.png',import.meta.url).href;logo.alt='';logo.width=34;logo.height=34;
 const heading=el('div','','heading'),title=el('h2');title.id='xiaochu-title';const mode=el('p');mode.hidden=true;heading.append(title,mode);
 const languageButton=el('button'),minimise=el('button','−','minimise');languageButton.type=minimise.type='button';header.append(logo,heading,languageButton,minimise);
 const chat=el('div','','chat');chat.setAttribute('role','log');chat.setAttribute('aria-live','polite');chat.setAttribute('aria-relevant','additions');chat.tabIndex=0;
 const status=el('div','','status');status.setAttribute('role','status');
 const composer=el('div','','composer'),form=el('form'),input=el('textarea'),send=el('button','','send');input.rows=2;input.maxLength=500;input.autocomplete='off';send.type='submit';form.append(input,send);
 const tools=el('div','','tools'),clear=el('button'),count=el('span','0 / 500','count');clear.type='button';tools.append(clear,count);const hint=el('small');hint.hidden=true;composer.append(form,tools,hint);panel.append(header,chat,status,composer);
 const launcher=el('button','','launcher');launcher.type='button';launcher.setAttribute('aria-controls',panel.id);launcher.setAttribute('aria-expanded','false');
 const icon=logo.cloneNode();icon.width=44;icon.height=44;const launcherText=el('span');launcher.append(icon,launcherText);root.append(panel,launcher);document.body.append(host);
 let language=getLanguage()==='en'?'en':'zh',turns=[],context={},places=[],placesStarted=false,placesReady=Promise.resolve(),busy=false,opened=false,disposed=false,answerNumber=0;
 const t=()=>copy[language];
 function setStatus(text){status.textContent=text;}
 function scrollEnd(){requestAnimationFrame(()=>{if(!disposed)chat.scrollTop=chat.scrollHeight;});}
 function setOpen(open,focus=true){opened=open;panel.hidden=!open;launcher.setAttribute('aria-expanded',String(open));launcher.setAttribute('aria-label',open?t().close:t().open);if(open){launcherText.hidden=true;loadPlaces();if(focus)input.focus({preventScroll:true});scrollEnd();}else if(focus)launcher.focus({preventScroll:true});}
 function loadPlaces(){
   if(placesStarted)return;placesStarted=true;const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),5000);
   placesReady=fetch(new URL('visit-places.json',import.meta.url),{signal:controller.signal}).then(r=>{if(!r.ok)throw Error('places-unavailable');return r.json();}).then(data=>{if(Array.isArray(data))places=data.filter(p=>typeof p.id==='string'&&/^[a-z0-9-]+$/.test(p.id)&&typeof p.name==='string');}).catch(()=>{}).finally(()=>clearTimeout(timer));
 }
 function welcome(message=''){
   const box=el('div','','welcome');box.append(el('p',message||t().welcome));
   const chips=el('div','','chips');for(const text of t().topicButtons){const b=el('button',text);b.type='button';b.addEventListener('click',()=>ask(text));chips.append(b);}box.append(chips);chat.append(box);
 }
 function refreshLabels(){title.textContent=t().name;mode.textContent=t().mode;launcherText.textContent=t().open;launcher.setAttribute('aria-label',opened?t().close:t().open);minimise.setAttribute('aria-label',t().close);languageButton.textContent=t().language;languageButton.setAttribute('aria-label',language==='zh'?'Switch assistant to English':'将助手切换为中文');input.placeholder=t().placeholder;input.setAttribute('aria-label',t().placeholder);send.textContent=t().send;clear.textContent=t().clear;hint.textContent=t().hint;host.lang=language==='en'?'en':'zh-CN';chat.setAttribute('aria-label',t().name);}
 function retranslate(){refreshLabels();chat.replaceChildren();welcome();for(const turn of turns){renderUser(turn.query);renderAnswer(answerQuestion(turn.query,{language,context:turn.before,places,now:turn.at}));}setStatus('');scrollEnd();}
 function renderUser(query){const article=el('article','','message user');article.append(el('p',t().user,'speaker'),el('div',query,'bubble'));chat.append(article);}
 function sectionHere(section){return document.getElementById(section);}
 function legacyClick(attribute,value){const b=document.createElement('button');b.type='button';b.hidden=true;b.setAttribute(attribute,value);document.body.append(b);try{b.click();}finally{b.remove();}}
 function navigate(action){
   const item=action.id?exhibits.find(e=>e.id===action.id):null,isHome=Boolean(document.getElementById('exhibit-dialog'));
   if(['exhibit','map','scene','photo'].includes(action.type)&&!item)return;
   if(action.type==='exhibit'){
     if(isHome){setOpen(false,false);legacyClick('data-open',item.id);}else location.assign(homeLink(language,{exhibit:item.id}));return;
   }
   if(action.type==='scene'){
     if(![2,3,4].includes(item.scene))return;
     if(isHome){document.querySelector(`[data-scene="${item.scene}"]`)?.click();sectionHere('experience')?.scrollIntoView({behavior:'smooth',block:'start'});setStatus(t().sceneHint);}
     else location.assign(homeLink(language,{guideScene:String(item.scene)},'experience'));return;
   }
   if(action.type==='map'){
     if(isHome){if(document.querySelector('#region-items')?.childElementCount){legacyClick('data-find-visit',item.id);setOpen(false,false);}else{sectionHere('atlas')?.scrollIntoView();setStatus(t().mapNotReady);}}
     else location.assign(homeLink(language,{guideMap:item.id},'atlas'));return;
   }
   if(action.type==='photo'){
     if(!item.photo)return;const url=new URL('gallery.html',import.meta.url);url.searchParams.set('lang',language);url.searchParams.set('guidePhoto',item.photo.id);location.assign(url.href);return;
   }
   if(action.type==='place'){
     const place=places.find(p=>p.id===action.id);if(!place)return;
     if(isHome&&document.querySelector('#region-items')?.childElementCount){legacyClick('data-show-place',place.id);sectionHere('atlas')?.scrollIntoView();setOpen(false,false);}
     else location.assign(homeLink(language,{guidePlace:place.id},'atlas'));return;
   }
   if(action.type==='filter'){
     if(isHome){document.getElementById('clear-filters')?.click();for(const [id,value] of [['city-filter',action.city],['category-filter',action.category]]){const select=document.getElementById(id);if(select&&[...select.options].some(o=>o.value===value)){select.value=value;select.dispatchEvent(new Event('change',{bubbles:true}));}}sectionHere('collection')?.scrollIntoView();setOpen(false,false);}
     else location.assign(homeLink(language,{guideCity:action.city,guideCategory:action.category},'collection'));return;
   }
   if(action.type==='section'){
     const section=action.section;if(!['collection','atlas','experience','gallery','media','learn'].includes(section))return;
     if(section==='gallery'){const url=new URL('gallery.html',import.meta.url);url.searchParams.set('lang',language);location.assign(url.href);}
     else if(sectionHere(section)){sectionHere(section).scrollIntoView({behavior:'smooth',block:'start'});setOpen(false,false);}else location.assign(homeLink(language,{},section));
   }
 }
 function renderCard(card){
   const b=el('button','','entry');b.type='button';
   if(card.image){const src=safeLink(new URL(card.image,import.meta.url).href);if(src){const image=el('img');image.src=src;image.alt='';image.loading='lazy';image.width=image.height=54;b.append(image);}}
   const text=el('span','','card-body');text.append(el('strong',card.title),el('small',card.subtitle||''),el('span',card.type==='choice'?t().choose:card.type==='place'?t().place:t().more,'card-link'));b.append(text);
   b.addEventListener('click',()=>card.type==='choice'?ask(card.question,card.id):navigate({type:card.type==='place'?'place':'exhibit',id:card.id}));return b;
 }
 function renderAnswer(result){
   const article=el('article','','message assistant');article.dataset.answer=String(++answerNumber);article.append(el('p',t().assistant,'speaker'));const bubble=el('div','','bubble');bubble.append(el('h3',result.title));
   for(const paragraph of result.paragraphs)bubble.append(el('p',paragraph));for(const card of result.cards)bubble.append(renderCard(card));
   if(result.actions.length){const actions=el('div','','actions');for(const action of result.actions){const label=action.type==='section'?t()[action.section]:t()[action.type];if(!label)continue;const b=el('button',label);b.type='button';b.addEventListener('click',()=>navigate(action));actions.append(b);}bubble.append(actions);}
   const sources=result.sources.filter(s=>safeLink(s.url));if(sources.length){const detail=el('details','','sources');detail.open=true;detail.append(el('summary',`${t().source} · ${sources.length} ${t().sourcesCount}`));for(const source of sources){const a=el('a',source.title||t().original);a.href=safeLink(source.url);a.target='_blank';a.rel='noopener noreferrer';detail.append(a);}bubble.append(detail);}
   const copyButton=el('button',t().copy,'copy');copyButton.type='button';copyButton.addEventListener('click',async()=>{const text=[result.title,...result.paragraphs,...sources.map(s=>`${s.title}: ${s.url}`)].join('\n\n');try{await navigator.clipboard.writeText(text);copyButton.textContent=t().copied;}catch{setStatus(t().copyFail);}});bubble.append(copyButton);
   article.append(bubble);if(result.suggestions.length){const suggestions=el('div','','chips answer-chips');for(const suggestion of result.suggestions.slice(0,3)){const b=el('button',suggestion);b.type='button';b.addEventListener('click',()=>ask(suggestion));suggestions.append(b);}article.append(suggestions);}chat.append(article);
 }
 async function ask(value,selectedId=''){
   const query=String(value||'').trim();if(!query||busy)return;
   if(query.length>500){setStatus(t().limit);return;}
   if(/^(清空对话|清空聊天|\/clear|clear chat)$/i.test(query)){reset();return;}
   busy=true;send.disabled=true;input.value='';count.textContent='0 / 500';renderUser(query);setStatus(t().waiting);scrollEnd();
   const before={...context},at=new Date();if(exhibits.some(e=>e.id===selectedId))before.selectedId=selectedId;
   try{
     if(/参观|场馆|博物馆|目的地|visit|museum|destination/i.test(query)){loadPlaces();await placesReady;}
     const result=answerQuestion(query,{language,context:before,places,now:at});context=result.context||{};turns.push({query,before,at});
     if(turns.length>24){turns=turns.slice(-24);chat.replaceChildren();welcome();for(const turn of turns){renderUser(turn.query);renderAnswer(answerQuestion(turn.query,{language,context:turn.before,places,now:turn.at}));}}
     else renderAnswer(result);setStatus('');
   }catch{renderAnswer({title:t().name,paragraphs:[t().failure],cards:[],actions:[],sources:[],suggestions:[]});setStatus('');}
   finally{busy=false;send.disabled=false;if(opened)input.focus({preventScroll:true});scrollEnd();}
 }
 function reset(){turns=[];context={};answerNumber=0;chat.replaceChildren();welcome(t().empty);input.value='';count.textContent='0 / 500';setStatus('');input.focus({preventScroll:true});}
 launcher.addEventListener('click',()=>setOpen(!opened));minimise.addEventListener('click',()=>setOpen(false));clear.addEventListener('click',reset);
 form.addEventListener('submit',e=>{e.preventDefault();ask(input.value);});input.addEventListener('input',()=>{count.textContent=`${input.value.length} / 500`;});
 input.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey&&!e.isComposing&&e.keyCode!==229){e.preventDefault();ask(input.value);}});
 root.addEventListener('keydown',e=>{if(e.key==='Escape'&&opened){e.stopPropagation();setOpen(false);}});
 languageButton.addEventListener('click',()=>{language=language==='zh'?'en':'zh';retranslate();});
 window.addEventListener('heritage:languagechange',e=>{language=e.detail?.language==='en'?'en':'zh';retranslate();});
 const viewport=()=>{host.style.setProperty('--vp',`${window.visualViewport?.height||window.innerHeight}px`);};viewport();window.visualViewport?.addEventListener('resize',viewport);window.addEventListener('resize',viewport,{passive:true});
 const focusObserver=new MutationObserver(()=>{const focused=document.body.classList.contains('gallery-focused');host.hidden=focused;if(focused)setOpen(false,false);});focusObserver.observe(document.body,{attributes:true,attributeFilter:['class']});host.hidden=document.body.classList.contains('gallery-focused');
 window.addEventListener('pagehide',()=>{turns=[];context={};disposed=true;focusObserver.disconnect();},{once:true});
 window.addEventListener('pageshow',e=>{if(e.persisted){disposed=false;turns=[];context={};chat.replaceChildren();welcome();focusObserver.observe(document.body,{attributes:true,attributeFilter:['class']});host.hidden=document.body.classList.contains('gallery-focused');viewport();}});
 refreshLabels();welcome();
 let showHint=true;try{showHint=!sessionStorage.getItem('jingchu-heritage.guide-hint.v1');sessionStorage.setItem('jingchu-heritage.guide-hint.v1','1');}catch{}launcherText.hidden=!showHint;if(showHint)setTimeout(()=>{launcherText.hidden=true;},5500);
 // Cross-page actions are constrained to records and existing controls, never executable URLs.
 const params=new URL(location.href).searchParams,photo=params.get('guidePhoto'),scene=params.get('guideScene'),mapId=params.get('guideMap'),placeId=params.get('guidePlace');
 const filterCity=params.get('guideCity')||'',filterCategory=params.get('guideCategory')||'';
 if(document.getElementById('exhibit-dialog')&&(exhibits.some(e=>e.city===filterCity)||categories.includes(filterCategory)))navigate({type:'filter',city:filterCity,category:filterCategory});
 if(photo&&exhibits.some(e=>e.photo?.id===photo)){const b=[...document.querySelectorAll('[data-photo]')].find(b=>b.dataset.photo===photo);b?.click();}
 if(['2','3','4'].includes(scene)&&document.getElementById('experience')){document.querySelector(`[data-scene="${scene}"]`)?.click();sectionHere('experience').scrollIntoView();}
 if((mapId&&exhibits.some(e=>e.id===mapId))||placeId){loadPlaces();let attempts=0;const apply=()=>{if(disposed)return;if(document.querySelector('#region-items')?.childElementCount){if(mapId&&exhibits.some(e=>e.id===mapId))legacyClick('data-find-visit',mapId);else if(places.some(p=>p.id===placeId))legacyClick('data-show-place',placeId);sectionHere('atlas')?.scrollIntoView();}else if(attempts++<50)setTimeout(apply,200);};placesReady.then(apply);}
 return {host,ask,close:()=>setOpen(false),open:()=>setOpen(true)};
}
