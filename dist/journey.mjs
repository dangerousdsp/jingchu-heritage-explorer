import { exhibits } from './content.mjs';
export const JOURNEY_KEY='jingchu-heritage.journey.v1';
const ids=new Set(exhibits.map(i=>i.id));
export function normalizeJourney(raw) {
  const list=value=>[...new Set(Array.isArray(value)?value.filter(id=>ids.has(id)):[])];
  return {version:1,favorites:list(raw?.favorites),route:list(raw?.route)};
}
let storage;try{storage=window.localStorage;}catch{}
let value;try{value=normalizeJourney(JSON.parse(storage?.getItem(JOURNEY_KEY)||'null'));}catch{value=normalizeJourney(null);}
export const getJourney=()=>normalizeJourney(value);
export function updateJourney(mutator) {
  const next=getJourney();mutator(next);value=normalizeJourney(next);
  let persistent=true;try{if(!storage)throw Error('blocked');storage.setItem(JOURNEY_KEY,JSON.stringify(value));}catch{persistent=false;}
  if(typeof window!=='undefined')window.dispatchEvent(new CustomEvent('heritage:journeychange',{detail:{persistent}}));
  return persistent;
}
export function moveStop(route,id,direction) {
  const next=[...route],at=next.indexOf(id),to=at+direction;
  if(at>=0&&to>=0&&to<next.length)[next[at],next[to]]=[next[to],next[at]];
  return next;
}
