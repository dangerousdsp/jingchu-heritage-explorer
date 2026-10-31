import {englishUI} from './english-ui.mjs';
export const LANGUAGE_KEY='jingchu-heritage.language.v1';
let language='zh';
export const getLanguage=()=>language;
const esc=value=>value.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
const terms=Object.keys(englishUI).filter(key=>key.length>1).sort((a,b)=>b.length-a.length);
const termsPattern=new RegExp(terms.map(esc).join('|'),'g');
const dynamic=[
  [/^找到 (\d+) 条地区项目与专题 · 全馆 (\d+) 条$/,(_,n,total)=>`${n} matching entries and topics · ${total} in the collection`],
  [/^已读 (\d+) \/ (\d+)$/,(_,n,total)=>`Read ${n} / ${total}`],
  [/^可缩放街道地图 · (\d+) 组地区参考位置 · (\d+) 个文化目的地$/,(_,n,total)=>`Zoomable street map · ${n} regional references · ${total} cultural destinations`],
  [/^(\d+) 条项目与专题，(\d+) 个已核实地址的文化目的地。$/,(_,n,total)=>`${n} entries and topics · ${total} cultural destinations with checked addresses.`],
  [/^(\d+) 条项目记录 · 此处标记为地区参考，不是场馆入口。$/,(_,n)=>`${n} regional records · Reference location, not a venue entrance.`],
  [/^(\d+) 站$/,(_,n)=>`${n} stops`],
  [/^(\d+) 篇$/,(_,n)=>`${n} entries`],
  [/^最佳正确率 (\d+)%$/,(_,n)=>`Best accuracy ${n}%`],
  [/^上次 (\d+) \/ (\d+)$/,(_,n,total)=>`Last attempt ${n} / ${total}`],
  [/^答对 (\d+) \/ (\d+)，正确率 (\d+)%[。.]$/,(_,n,total,pct)=>`${n} / ${total} correct · ${pct}% accuracy.`],
  [/^查看(.+)资料$/,(_,name)=>`Read about ${translateText(name,'en')}`],
  [/^(取消收藏|收藏)(.+)$/,(_,action,name)=>`${action==='收藏'?'Save':'Unsave'} ${translateText(name,'en')}`],
  [/^将(.+)加入阅读清单$/,(_,name)=>`Add ${translateText(name,'en')} to reading list`],
  [/^(上移|下移|移除)(.+)$/,(_,action,name)=>`${{'上移':'Move up','下移':'Move down','移除':'Remove'}[action]} ${translateText(name,'en')}`],
  [/^第(\d+)站 (.+)$/,(_,n,name)=>`Stop ${n}: ${translateText(name,'en')}`],
  [/^(.+)，(\d+)条地区项目$/,(_,name,n)=>`${translateText(name,'en')} · ${n} regional entries`],
  [/^本地预览：(.+)。文件没有上传。$/,(_,name)=>`Local preview: ${name}. The file is not uploaded.`],
  [/^已等待 (\d+) 秒 · 正在下载资源或准备场景$/,(_,n)=>`Waited ${n}s · Downloading resources or preparing the scene`],
  [/^驾车道路全程 (.+) · 估算 (.+) · (\d+)站（未计游览停留与实时路况）$/,(_,dist,dur,n)=>`Driving route ${translateText(dist,'en')} · Estimated ${translateText(dur,'en')} · ${n} stops (excludes visits and live traffic)`],
  [/^(.+) · 项目所属地区$/,(_,name)=>`${translateText(name,'en')} · Recorded region`],
  [/^湖北非遗互动展馆 · 浏览器改进版 (.+)$/,(_,version)=>`Hubei Heritage Explorer · Web edition ${version}`],
];
export function translateText(text,locale=language){
  if(locale!=='en'||typeof text!=='string')return text;
  const s=text.trim();if(!s)return text;
  let result=englishUI[s];
  if(result===undefined){for(const [pattern,replacement] of dynamic){if(pattern.test(s)){result=s.replace(pattern,replacement);break;}}}
  if(result===undefined)result=s.replace(termsPattern,matched=>englishUI[matched]);
  result=result.replace(/向(东北|东南|西南|西北|东|西|南|北)/g,(_,dir)=>`towards ${englishUI[dir]}`)
    .replace(/(\d(?:[\d.]*))\s*米/g,'$1 m').replace(/(\d+)秒/g,'$1s')
    .replace(/，由第(\d+)个出口驶出/g,', take exit $1')
    .replace(/向(NE|NW|SE|SW)/g,'towards $1').replace(/直线约\s*/g,'straight-line ~ ').replace(/ · 道路 /g,' · road ')
    .replace(/ · 估算 /g,' · estimated ').replace(/查看/g,'View ')
    .replace(/(\d+) 小时/g,'$1 h').replace(/(\d+) 分钟/g,'$1 min')
    .replace(/(\d+)月(\d+)日/g,'$1/$2');
  if(result!==s)result=result.replace(/。/g,'. ').replace(/，/g,', ').replace(/；/g,'; ').replace(/：/g,': ');
  return text.slice(0,text.indexOf(s))+result+text.slice(text.indexOf(s)+s.length);
}
export function initLanguage(){
  const select=document.querySelector('#language-select');
  if(!select)return;
  const query=new URLSearchParams(location.search).get('lang');
  let saved;try{saved=localStorage.getItem(LANGUAGE_KEY);}catch{}
  language=['zh','en'].includes(query)?query:['zh','en'].includes(saved)?saved:navigator.language?.toLowerCase().startsWith('zh')?'zh':'en';
  try{localStorage.setItem(LANGUAGE_KEY,language);}catch{}
  const originals=new WeakMap(),attributeOriginals=new WeakMap();
  const attributes=['aria-label','alt','title','placeholder'];
  let observer;
  const excluded=element=>element?.closest('script,style,[data-no-i18n],[data-original-record],canvas');
  function textNode(node){
    if(excluded(node.parentElement))return;
    let record=originals.get(node);
    if(!record||node.data!==record.output)record={source:node.data};
    record.output=translateText(record.source);originals.set(node,record);
    if(node.data!==record.output)node.data=record.output;
  }
  function elementAttributes(element){
    if(excluded(element))return;
    let record=attributeOriginals.get(element)||{};
    for(const attr of attributes){const current=element.getAttribute(attr);if(current===null)continue;let value=record[attr];if(!value||current!==value.output)value={source:current};value.output=translateText(value.source);record[attr]=value;if(current!==value.output)element.setAttribute(attr,value.output);}
    attributeOriginals.set(element,record);
  }
  function visit(root){
    if(root.nodeType===3){textNode(root);return;}
    if(root.nodeType!==1||excluded(root))return;
    elementAttributes(root);
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT|NodeFilter.SHOW_ELEMENT);
    let node;while((node=walker.nextNode())){if(node.nodeType===3)textNode(node);else elementAttributes(node);}
  }
  const options={subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:attributes};
  observer=new MutationObserver(records=>{
    observer.disconnect();
    const roots=new Set();for(const record of records){if(record.type==='childList')record.addedNodes.forEach(n=>roots.add(n));else roots.add(record.target);}
    roots.forEach(visit);observer.observe(document.documentElement,options);
  });
  function apply(){
    observer.disconnect();document.documentElement.lang=language==='en'?'en':'zh-CN';select.value=language;
    visit(document.documentElement);observer.observe(document.documentElement,options);
  }
  select.addEventListener('change',()=>{language=select.value==='en'?'en':'zh';try{const url=new URL(location.href);url.searchParams.set('lang',language);history.replaceState(null,'',url);}catch{}try{localStorage.setItem(LANGUAGE_KEY,language);}catch{}apply();window.dispatchEvent(new CustomEvent('heritage:languagechange',{detail:{language}}));});
  apply();
  // The three bilingual pages share this entry point. The optional guide never blocks translation.
  const startGuide=()=>{
    if(document.getElementById('jingchu-assistant'))return;
    import('./assistant.mjs').then(({mountAssistant})=>mountAssistant()).catch(()=>console.warn('Local heritage guide could not be loaded.'));
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',startGuide,{once:true});
  else queueMicrotask(startGuide);
  return ()=>observer.disconnect();
}
