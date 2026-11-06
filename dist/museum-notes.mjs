import {modelAssets} from './museum-data.mjs';
export const MUSEUM_NOTES_KEY='jingchu-heritage.museum-notes.v1';
export const MUSEUM_FAVORITES_KEY='jingchu-heritage.museum-favorites.v1';
const objectIds=new Set(modelAssets.map(asset=>asset.id));
const allowed=new Set(['pottery','wood','chime','opera','hb-1931',...objectIds]);
function browserStorage(){try{return globalThis.localStorage;}catch{return undefined;}}
export function readMuseumNotes(storage=browserStorage()){
  try{const raw=JSON.parse(storage?.getItem(MUSEUM_NOTES_KEY)||'[]');return Array.isArray(raw)?raw.filter(item=>item&&allowed.has(item.exhibitId)&&typeof item.text==='string'&&typeof item.createdAt==='string').slice(-100).map(item=>({...item,text:item.text.slice(0,500)})):[];}catch{return [];}
}
export function saveMuseumNote({exhibitId,assetId,point,text},storage=browserStorage()){
  if(!allowed.has(exhibitId)||typeof text!=='string'||!text.trim())return {ok:false};
  const note={exhibitId,assetId:String(assetId||'').slice(0,100),point:String(point||'').slice(0,100),text:text.trim().slice(0,500),createdAt:new Date().toISOString()};
  const notes=[...readMuseumNotes(storage),note].slice(-100);
  try{storage.setItem(MUSEUM_NOTES_KEY,JSON.stringify(notes));return {ok:true,note,count:notes.length};}catch{return {ok:false,note};}
}
export function readMuseumFavorites(storage=browserStorage()){
  try{const raw=JSON.parse(storage?.getItem(MUSEUM_FAVORITES_KEY)||'[]');return Array.isArray(raw)?[...new Set(raw.filter(id=>objectIds.has(id)))]:[];}catch{return [];}
}
export function toggleMuseumFavorite(id,storage=browserStorage()){
  if(!objectIds.has(id))return {persistent:false,saved:false};const current=readMuseumFavorites(storage),saved=!current.includes(id);const next=saved?[...current,id]:current.filter(item=>item!==id);
  try{storage.setItem(MUSEUM_FAVORITES_KEY,JSON.stringify(next));return {persistent:true,saved};}catch{return {persistent:false,saved:false};}
}
