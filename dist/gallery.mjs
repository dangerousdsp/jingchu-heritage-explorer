import {initLanguage,getLanguage} from './i18n.mjs';
import {photos} from './photo-data.mjs';
import {exhibits} from './content.mjs';
const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const $=s=>document.querySelector(s);
initLanguage();let selected;
const name=p=>getLanguage()==='en'?p.titleEn:p.title;
const scope=p=>getLanguage()==='en'?p.scopeEn:p.scope;
function credit(p){return `<span data-no-i18n>© ${esc(p.author)} · <a href="${esc(p.source)}" target="_blank" rel="noopener noreferrer">${getLanguage()==='en'?'Source':'图片来源'}</a> · <a href="${esc(p.licenseURL)}" target="_blank" rel="noopener noreferrer">${esc(p.license)}</a></span>`;}
function render(){
 $('#photo-grid').innerHTML=photos.map(p=>`<article class="photo-card"><button data-photo="${p.id}" aria-label="${esc(name(p))}"><img src="${p.src}" width="${p.width}" height="${p.height}" alt="${esc(name(p))}" loading="lazy"><span aria-hidden="true">↗</span></button><h2 data-no-i18n>${esc(name(p))}</h2><p data-no-i18n>${esc(scope(p))}</p><p class="photo-credit">${credit(p)}</p><div class="photo-topics">${exhibits.filter(e=>e.photo?.id===p.id).map(e=>`<a href="index.html?lang=${getLanguage()}&exhibit=${encodeURIComponent(e.id)}#collection">${esc(e.title)} · ${esc(e.region)} ↗</a>`).join('')}</div></article>`).join('');
 if($('#photo-dialog').open)show(selected);
}
function show(id){const p=photos.find(p=>p.id===id);if(!p)return;selected=id;$('#photo-detail').innerHTML=`<img src="${p.src}" width="${p.width}" height="${p.height}" alt="${esc(name(p))}"><h2 data-no-i18n>${esc(name(p))}</h2><p data-no-i18n>${esc(scope(p))}</p><p class="photo-credit">${credit(p)}</p>`;if(!$('#photo-dialog').open)$('#photo-dialog').showModal();}
document.addEventListener('click',event=>{const button=event.target.closest('[data-photo]');if(button)show(button.dataset.photo);});
$('#close-photo').addEventListener('click',()=>$('#photo-dialog').close());
$('#photo-dialog').addEventListener('click',event=>{if(event.target===event.currentTarget)event.currentTarget.close();});
window.addEventListener('heritage:languagechange',render);render();
