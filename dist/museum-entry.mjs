import {getLanguage} from './i18n.mjs';
import {museumHref,SCENE_THEMES} from './museum-data.mjs';
export function initMuseumEntry(){
  const root=document.querySelector('#museum-entry');
  function render(){if(!root)return;const en=getLanguage()==='en';root.querySelectorAll('[data-zh][data-en]').forEach(node=>{node.textContent=node.dataset[en?'en':'zh'];});root.querySelectorAll('[data-museum-exhibit]').forEach(link=>link.href=museumHref({exhibit:link.dataset.museumExhibit,lang:getLanguage()}));root.querySelectorAll('[data-museum-asset]').forEach(link=>link.href=museumHref({asset:link.dataset.museumAsset,lang:getLanguage()}));const overview=root.querySelector('[data-museum-room]');if(overview)overview.href=museumHref({mode:'room',lang:getLanguage()});}
  render();window.addEventListener('heritage:languagechange',render);
  return {selectScene(scene){const id=SCENE_THEMES[Number(scene)];if(id)location.assign(museumHref({exhibit:id,lang:getLanguage()}));},stop(){}};
}
