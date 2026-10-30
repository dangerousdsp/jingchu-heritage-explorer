// Keep the map useful even when a public street-tile service is unreachable.
export async function fetchJSON(url,{timeout=15000,...options}={}){
  const controller=new AbortController();
  const timer=setTimeout(()=>controller.abort(),timeout);
  try{const response=await fetch(url,{...options,signal:controller.signal});if(!response.ok)throw Error(`HTTP ${response.status}`);return await response.json();}
  finally{clearTimeout(timer);}
}
export function groupByLocation(items){
  const groups=new Map();
  for(const item of items){const p=item.locationReference;if(!p||!Number.isFinite(p.lat)||!Number.isFinite(p.lon))continue;const key=`${p.lon},${p.lat}`;if(!groups.has(key))groups.set(key,[]);groups.get(key).push(item);}
  return [...groups.values()];
}
