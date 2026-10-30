import {initLanguage,getLanguage} from './i18n.mjs';
import {photos} from './photo-data.mjs';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
initLanguage();
function render(){document.querySelector('#photo-credits').innerHTML=photos.map(p=>`<article class="source-credit" data-no-i18n><h3>${esc(getLanguage()==='en'?p.titleEn:p.title)}</h3><p>© ${esc(p.author)} · <a href="${esc(p.source)}" target="_blank" rel="noopener noreferrer">Wikimedia Commons</a> · <a href="${esc(p.licenseURL)}" target="_blank" rel="noopener noreferrer">${esc(p.license)}</a></p></article>`).join('');}
window.addEventListener('heritage:languagechange',render);render();
