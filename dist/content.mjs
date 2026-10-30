import {photoFor} from './photo-links.mjs';
import {englishCatalog} from './english-content.mjs';
import {translateText} from './i18n.mjs';
import {exhibits as core,questions,fullQuestions,quizModes,filterExhibits} from './core-content.mjs';
import {catalogData} from './catalog-data.mjs';
export {questions,fullQuestions,quizModes,filterExhibits};
const bindings=new Map([['1957','wood'],['3250','chime'],['1098','opera'],['2364','lacquer'],['371','music']]);
export const exhibits=[...core];
for(const record of catalogData){
  const existing=exhibits.find(item=>item.id===bindings.get(record.fid));
  if(existing){
    // Keep the established IDs, personal history, 3D bindings and original preview art.
    Object.assign(existing,{fid:record.fid,year:record.year,unit:record.unit,projectNumber:record.projectNumber,sourceRow:record.sourceRow,locationReference:record.locationReference,researched:record.researched,detail:record.detail,observations:record.observations,sources:record.sources,sourceNote:record.sourceNote+(existing.scene?' 原项目模型用于外观观察。':'')});
  }else exhibits.push({...record,number:String(exhibits.length+1).padStart(2,'0'),alt:'',image:null});
}
for(const item of exhibits){item.photo=photoFor(item);if(item.photo){item.image=item.photo.src;item.alt=item.photo.title+' · '+item.photo.scope;}const english=englishCatalog[item.fid||item.id];item.english=english;item.searchEnglish=[english.title,english.detail,translateText(item.region,'en'),translateText(item.city,'en'),translateText(item.category,'en')].join(' ');}
export const categories=[...new Set(exhibits.map(i=>i.category))];
export function filterCollection(items,{category='all',query='',city='all',favoritesOnly=false,favorites=[]}={}){
  const q=query.trim().toLocaleLowerCase();
  return items.filter(item=>(category==='all'||item.category===category)&&(city==='all'||item.city===city)&&(!favoritesOnly||favorites.includes(item.id))&&(!q||[item.title,item.region,item.city,item.category,item.unit,item.detail,item.searchEnglish].filter(Boolean).join(' ').toLocaleLowerCase().includes(q)));
}
