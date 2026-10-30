import {initLanguage,getLanguage} from './i18n.mjs';
import {exhibits,questions,quizModes,filterCollection,categories} from './content.mjs';
import {normalizeProgress,readProgress,saveProgress,scoreQuiz} from './learning.mjs';
import {getJourney,updateJourney} from './journey.mjs';
import {initPlayer} from './player.mjs';
import {initExplore} from './explore.mjs';
import {TRAVEL_KEY} from './travel.mjs';
const $=selector=>document.querySelector(selector);
const esc=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
let storage;try{storage=window.localStorage;}catch{}
let {data:progress,persistent}=readProgress(storage);
let category='all',currentExhibit=null,toastTimer;
let activeQuestions=questions;
let page=1;const pageSize=12;
function notify(message){clearTimeout(toastTimer);$('#toast').textContent=message;$('#toast').hidden=false;toastTimer=setTimeout(()=>$('#toast').hidden=true,4500);}
function persist(){persistent=saveProgress(storage,progress);renderProgress();if(!persistent)notify('浏览器暂时无法保存记录，可以导出手记保留。');}
initLanguage();
const player=initPlayer({notify});
for(const city of [...new Set(exhibits.map(i=>i.city))]){const option=document.createElement('option');option.value=city;option.textContent=city;$('#city-filter').append(option);}
for(const name of categories){const option=document.createElement('option');option.value=name;option.textContent=name;$('#category-filter').append(option);}
$('#reading-total').textContent=exhibits.length;$('#reading-progress').max=exhibits.length;
function cardVisual(item){const alt=item.photo?(getLanguage()==='en'?item.photo.titleEn+' · '+item.photo.scopeEn:item.photo.title+' · '+item.photo.scope):item.alt;return item.image?`<img src="${item.image}" alt="${esc(alt)}" ${item.photo?'data-no-i18n':''} width="300" height="420" loading="lazy">${item.photo?`<span class="photo-type">${/参考/.test(item.photo.scope)?'参考影像':/环境/.test(item.photo.scope)?'文化风景':'非遗影像'}</span>`:''}`:`<div class="catalog-art" data-category="${esc(item.category)}"><span>${esc(item.category)}</span><strong>${esc(item.title)}</strong><i aria-hidden="true">荆楚百艺</i></div>`;}

function renderCollection() {
  const journey=getJourney();
  const items=filterCollection(exhibits,{category,query:$('#search').value,city:$('#city-filter').value,favoritesOnly:$('#favorites-only').checked,favorites:journey.favorites});
  const pages=Math.max(1,Math.ceil(items.length/pageSize));page=Math.min(page,pages);
  $('#exhibit-grid').innerHTML=items.slice((page-1)*pageSize,page*pageSize).map(item=>`<article class="exhibit-card"><button class="exhibit-image-button" data-open="${item.id}" aria-label="查看${esc(item.title)}资料"><span class="image-index">${item.number} / ${item.scene?'三维展品':item.researched?'项目详解':'名录资料'}</span>${cardVisual(item)}<span class="image-open" aria-hidden="true">↗</span></button><div class="card-meta"><span>${esc(item.category)}</span><span>${esc(item.region)}</span></div><h3>${esc(item.title)}</h3><p>${esc(item.description)}</p><div class="card-actions"><button class="card-link" data-open="${item.id}">查看专题 →</button><button class="favorite-button" data-favorite="${item.id}" aria-label="${journey.favorites.includes(item.id)?'取消收藏':'收藏'}${esc(item.title)}" aria-pressed="${journey.favorites.includes(item.id)}">${journey.favorites.includes(item.id)?'♥ 已收藏':'♡ 收藏'}</button></div>${progress.read.includes(item.id)?'<span class="read-badge">✓ 已阅读</span>':''}</article>`).join('');
  $('#empty-results').hidden=items.length>0;$('#collection-status').textContent=`找到 ${items.length} 条地区项目与专题 · 全馆 ${exhibits.length} 条`;
  $('#page-status').textContent=`${page} / ${pages}`;$('#previous-page').disabled=page===1;$('#next-page').disabled=page===pages;
}
$('#previous-page').addEventListener('click',()=>{page--;renderCollection();$('#collection').scrollIntoView();});
$('#next-page').addEventListener('click',()=>{page++;renderCollection();$('#collection').scrollIntoView();});
$('#category-filter').addEventListener('change',event=>{category=event.target.value;page=1;renderCollection();});
function renderProgress() {
  $('#header-progress').textContent=`已读 ${progress.read.length} / ${exhibits.length}`;$('#read-count').textContent=progress.read.length;$('#reading-progress').value=progress.read.length;
  $('#reading-list').innerHTML=exhibits.map(item=>`<li><span>${progress.read.includes(item.id)?'✓':'○'} ${esc(item.title)}<small>${esc(item.region)}</small></span><button data-open="${item.id}">${progress.read.includes(item.id)?'再读一次':'查看资料'} ↗</button></li>`).join('');
  $('#storage-note').textContent=persistent?'阅读和答题记录保存在当前浏览器。':'浏览器无法持久保存记录，可以导出手记保留。';
  $('#quiz-record').textContent=progress.lastQuiz?`上次 ${progress.lastQuiz.score} / ${progress.lastQuiz.total}`:'等你落笔';
  const attempts=progress.attempts||[];
  const best=attempts.reduce((best,item)=>!best||item.score/item.total>best.score/best.total?item:best,null);
  $('#personal-best').textContent=best?`最佳正确率 ${Math.round(best.score/best.total*100)}%`:'尚无成绩';
  $('#quiz-history-list').innerHTML=attempts.length?[...attempts].reverse().slice(0,5).map(item=>`<li><span>${item.total===10?'十题挑战':'三题入门'} · ${item.completedAt?new Date(item.completedAt).toLocaleString(getLanguage()==='en'?'en-GB':'zh-CN',{month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit'}):'历史记录'}</span><strong>${item.score} / ${item.total}</strong></li>`).join(''):'<li>完成一次练习，记录会出现在这里。</li>';
  renderCollection();
}
function detailHTML(item) {
  const index=exhibits.indexOf(item),read=progress.read.includes(item.id),route=getJourney().route.includes(item.id);
  return `<div class="detail-layout"><div class="detail-visual">${cardVisual(item)}<span>${item.photo?'非遗影像':item.scene?'三维模型预览':item.image?'专题图形示意':'文化项目资料'} · ${item.number} / ${exhibits.length}</span>${item.photo?`<p class="detail-photo-caption" data-no-i18n>${esc(getLanguage()==='en'?item.photo.titleEn:item.photo.title)} · ${esc(getLanguage()==='en'?item.photo.scopeEn:item.photo.scope)}<br>© ${esc(item.photo.author)} · <a href="${esc(item.photo.source)}" target="_blank" rel="noopener noreferrer">${getLanguage()==='en'?'Source':'图片来源'}</a> · <a href="${esc(item.photo.licenseURL)}" target="_blank" rel="noopener noreferrer">${esc(item.photo.license)}</a></p>`:''}</div><div class="detail-text"><p class="eyebrow">${esc(item.region)} / ${esc(item.category)}</p><h2 id="detail-title">${esc(item.title)}</h2><p>${esc(item.detail)}</p><ul>${item.observations.map(line=>`<li>${esc(line)}</li>`).join('')}</ul>${item.year?`<dl class="project-meta"><div><dt>记录年份</dt><dd>${item.year}</dd></div><div><dt>保护单位（原表记录）</dt><dd data-original-record lang="zh-CN">${esc(item.unit)}</dd></div></dl>`:''}<div class="detail-sources"><p>${esc(item.sourceNote)}</p>${item.sources.map(source=>`<a href="${esc(source.url)}" target="_blank" rel="noopener noreferrer">${esc(source.title)} ↗</a>`).join('')}</div><div class="detail-actions"><button class="button primary compact" data-mark="${item.id}">${read?'✓ 已记入手记':'读完，记入手记'}</button><button class="button compact" data-route-add="${item.id}">${route?'✓ 已加入清单':'加入阅读清单'}</button>${item.scene?`<button class="button compact" data-go-scene="${item.scene}">在三维中查看 ↗</button>`:''}</div><button class="text-link find-place" data-find-visit="${item.id}">在地图中寻找相关目的地 →</button><div class="detail-next"><button data-detail-nav="${exhibits[(index+exhibits.length-1)%exhibits.length].id}">← 上一篇</button><button data-detail-nav="${exhibits[(index+1)%exhibits.length].id}">下一篇 →</button></div></div></div>`;
}
function openExhibit(id){const item=exhibits.find(i=>i.id===id);if(!item)return;currentExhibit=id;$('#detail-content').innerHTML=detailHTML(item);if(!$('#exhibit-dialog').open)$('#exhibit-dialog').showModal();$('#exhibit-dialog').scrollTop=0;$('.dialog-close').focus();}
document.addEventListener('click',event=>{
  const open=event.target.closest('[data-open]');if(open)openExhibit(open.dataset.open);
  const next=event.target.closest('[data-detail-nav]');if(next)openExhibit(next.dataset.detailNav);
  const mark=event.target.closest('[data-mark]');if(mark){if(!progress.read.includes(mark.dataset.mark))progress.read.push(mark.dataset.mark);persist();mark.textContent='✓ 已记入手记';notify('已记下这次阅读。');}
  const favorite=event.target.closest('[data-favorite]');if(favorite){const id=favorite.dataset.favorite;updateJourney(data=>{data.favorites=data.favorites.includes(id)?data.favorites.filter(v=>v!==id):[...data.favorites,id];});}
  const scene=event.target.closest('[data-go-scene]');if(scene){$('#exhibit-dialog').close();player.selectScene(scene.dataset.goScene);}
});
$('.dialog-close').addEventListener('click',()=>$('#exhibit-dialog').close());
$('#exhibit-dialog').addEventListener('close',()=>document.querySelector(`[data-open="${currentExhibit}"]`)?.focus());
$('#exhibit-dialog').addEventListener('click',event=>{if(event.target!==event.currentTarget)return;const r=event.currentTarget.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)event.currentTarget.close();});
function resetFilters(){category='all';page=1;$('#category-filter').value='all';$('#search').value='';$('#city-filter').value='all';$('#favorites-only').checked=false;document.querySelectorAll('[data-filter]').forEach(b=>{const active=b.dataset.filter==='all';b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});renderCollection();}
document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{category=button.dataset.filter;document.querySelectorAll('[data-filter]').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button));});renderCollection();}));
$('#search').addEventListener('input',()=>{page=1;renderCollection();});$('#city-filter').addEventListener('change',()=>{page=1;renderCollection();});$('#favorites-only').addEventListener('change',()=>{page=1;renderCollection();});$('#clear-filters').addEventListener('click',resetFilters);
window.addEventListener('heritage:journeychange',event=>{renderCollection();if(!event.detail.persistent)notify('路线已更新，但浏览器未能保存。请导出保留。');});
function renderQuiz(mode,restore=false){activeQuestions=quizModes[mode]||questions;$('#quiz-questions').innerHTML=activeQuestions.map((q,i)=>`<fieldset><legend><span class="question-number">${String(i+1).padStart(2,'0')}</span>${q.title}</legend><div class="quiz-options">${q.options.map((option,index)=>`<label><input type="radio" name="${q.id}" value="${index}" required>${option}</label>`).join('')}</div><p class="question-feedback" id="feedback-${q.id}" hidden></p></fieldset>`).join('');$('#quiz-result').textContent='';if(restore&&progress.lastQuiz)activeQuestions.forEach(q=>{const input=document.querySelector(`input[name="${q.id}"][value="${progress.lastQuiz.answers[q.id]}"]`);if(input)input.checked=true;});}
$('#quiz-mode').value=progress.lastQuiz?.total===10?'full':'intro';renderQuiz($('#quiz-mode').value,true);
$('#quiz-mode').addEventListener('change',()=>renderQuiz($('#quiz-mode').value));
$('#quiz-form').addEventListener('submit',event=>{event.preventDefault();const form=new FormData(event.currentTarget);const answers=Object.fromEntries(activeQuestions.map(q=>[q.id,Number(form.get(q.id))]));const result=scoreQuiz(answers,activeQuestions);activeQuestions.forEach((q,i)=>{const line=$(`#feedback-${q.id}`);line.textContent=`${result.details[i].correct?'✓ 回答正确':'正确答案：'+q.options[q.answer]}。${q.explanation}`;line.classList.toggle('incorrect',!result.details[i].correct);line.hidden=false;});$('#quiz-result').textContent=`答对 ${result.score} / ${result.total}，正确率 ${Math.round(result.score/result.total*100)}%。`;progress.lastQuiz={answers,questionIds:activeQuestions.map(q=>q.id),score:result.score,total:result.total,completedAt:new Date().toISOString()};progress.attempts=[...(progress.attempts||[]),progress.lastQuiz].slice(-20);persist();});
$('#quiz-form').addEventListener('change',()=>{$('#quiz-result').textContent='答案已调整，重新提交后查看解析。';document.querySelectorAll('.question-feedback').forEach(e=>e.hidden=true);});
function download(data,name){const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
$('#export-progress').addEventListener('click',()=>{download({project:'荆楚非遗',exportedAt:new Date().toISOString(),learning:progress,journey:getJourney(),travel:(()=>{try{return JSON.parse(storage?.getItem(TRAVEL_KEY)||'null');}catch{return null;}})()},'荆楚非遗-学习手记.json');notify('学习手记已导出。');});
$('#reset-progress').addEventListener('click',()=>$('#reset-dialog').showModal());$('#cancel-reset').addEventListener('click',()=>$('#reset-dialog').close());$('#confirm-reset').addEventListener('click',()=>{progress=normalizeProgress(null);persist();renderQuiz($('#quiz-mode').value);$('#reset-dialog').close();notify('阅读和答题记录已清空，收藏与路线继续保留。');});
window.addEventListener('heritage:languagechange',()=>{renderProgress();if($('#exhibit-dialog').open)$('#detail-content').innerHTML=detailHTML(exhibits.find(e=>e.id===currentExhibit));});
initExplore({openExhibit,notify,download});renderProgress();

const linkedExhibit=new URL(location.href).searchParams.get('exhibit');if(linkedExhibit)openExhibit(linkedExhibit);
