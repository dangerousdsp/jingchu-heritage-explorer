import {initLanguage,getLanguage} from './i18n.mjs';
import {photos} from './photo-data.mjs';
import {modelAssets} from './museum-data.mjs';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
initLanguage();
function render(){document.querySelector('#photo-credits').innerHTML=photos.map(p=>`<article class="source-credit" data-no-i18n><h3>${esc(getLanguage()==='en'?p.titleEn:p.title)}</h3><p>© ${esc(p.author)} · <a href="${esc(p.source)}" target="_blank" rel="noopener noreferrer">Wikimedia Commons</a> · <a href="${esc(p.licenseURL)}" target="_blank" rel="noopener noreferrer">${esc(p.license)}</a></p></article>`).join('');}
window.addEventListener('heritage:languagechange',render);render();
function renderMuseumCredits(){
  const root=document.querySelector('#museum-credits');if(!root)return;
  const en=getLanguage()==='en',local=value=>typeof value==='string'?value:value?.[en?'en':'zh']||'';
  root.innerHTML=`<h2>${en?'3D objects and materials':'三维模型与素材'}</h2>`+modelAssets.filter(asset=>asset.curated!==false).map(asset=>`<article class="source-credit"><h3>${esc(local(asset.fullTitle||asset.title))}</h3><p>${esc(local(asset.creator))}</p><p>${esc(asset.institution||'')} ${esc(local(asset.date))} ${esc(local(asset.origin))}</p><p>${esc(local(asset.license))}${asset.sourceUrl?` · <a href="${esc(asset.sourceUrl)}" target="_blank" rel="noopener noreferrer">${en?'Collection record':'馆藏记录'}</a>`:''}${asset.licenseUrl?` · <a href="${esc(asset.licenseUrl)}" target="_blank" rel="noopener noreferrer">${en?'Licence':'许可说明'}</a>`:''}</p></article>`).join('')+`<p>${en?'The original bell retains its existing rights. Smithsonian objects and photographs use CC0. Poly Haven surface textures use CC0; room versions have reduced geometry and texture resolution.':'原项目青铜钟保留原权利。Smithsonian藏品及照片、Poly Haven材质采用CC0。展厅总览版本经过减面和贴图压缩。'}</p><p>Three.js 0.180.0 · MIT · <a href="vendor/three/LICENSE">${en?'Licence':'许可证'}</a> · <a href="assets/museum/models/SOURCES.json">${en?'Open object records':'开放藏品来源记录'}</a> · <a href="assets/museum/models/NEW_COLLECTION_SOURCES.json">新增藏品来源</a> · <a href="assets/museum/materials/MATERIAL_SOURCES.json">材质来源与作者</a></p>`;
}
window.addEventListener('heritage:languagechange',renderMuseumCredits);renderMuseumCredits();
