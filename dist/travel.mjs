// Pure travel helpers. All points are public destinations; no device location is requested.
import {wgs84togcj02} from './vendor/coordtransform/transform.mjs';
export const TRAVEL_KEY='jingchu-heritage.travel.v1';
export function normalizeTrip(raw,places){const ids=new Set(places.map(p=>p.id));const start=ids.has(raw?.start)?raw.start:'';return {stops:[...new Set(Array.isArray(raw?.stops)?raw.stops.filter(id=>ids.has(id)&&id!==start):[])].slice(0,start?7:8),start};}
export function haversine(a,b){const rad=d=>d*Math.PI/180;const dLat=rad(b.lat-a.lat),dLon=rad(b.lon-a.lon);const h=Math.sin(dLat/2)**2+Math.cos(rad(a.lat))*Math.cos(rad(b.lat))*Math.sin(dLon/2)**2;return 6371*2*Math.asin(Math.min(1,Math.sqrt(h)));}
export function bearing(a,b){const rad=d=>d*Math.PI/180;const d=rad(b.lon-a.lon);return (Math.atan2(Math.sin(d)*Math.cos(rad(b.lat)),Math.cos(rad(a.lat))*Math.sin(rad(b.lat))-Math.sin(rad(a.lat))*Math.cos(rad(b.lat))*Math.cos(d))*180/Math.PI+360)%360;}
export function compass(a,b){return ['北','东北','东','东南','南','西南','西','西北'][Math.round(bearing(a,b)/45)%8];}
export function orderedStops(trip,places){const byId=new Map(places.map(p=>[p.id,p]));const ids=trip.start?[trip.start,...trip.stops.filter(id=>id!==trip.start)]:trip.stops;return ids.map(id=>byId.get(id)).filter(Boolean).map(place=>place.routingPoint?{...place,lon:place.routingPoint.lon,lat:place.routingPoint.lat}:place);}
export function optimizeStops(trip,places){const all=orderedStops(trip,places);if(all.length<3)return {...trip,stops:all.map(p=>p.id)};const route=[all.shift()];while(all.length){let at=0;for(let i=1;i<all.length;i++)if(haversine(route.at(-1),all[i])<haversine(route.at(-1),all[at]))at=i;route.push(all.splice(at,1)[0]);}return {...trip,stops:route.map(p=>p.id).filter(id=>id!==trip.start)};}
export function amapSearchURL(place){return 'https://uri.amap.com/search?'+new URLSearchParams({keyword:place.name,city:place.city,view:'map',src:'jingchu-heritage',callnative:'0'}).toString();}
export function amapRouteURL(from,to,mode='car'){
  const position=place=>[...wgs84togcj02(place.lon,place.lat).map(n=>n.toFixed(6)),place.name].join(',');
  return 'https://uri.amap.com/navigation?'+new URLSearchParams({from:from?position(from):'',to:position(to),mode:['car','bus','walk'].includes(mode)?mode:'car',policy:'0',src:'jingchu-heritage',callnative:'0'}).toString();
}
