"""Bounded routing adapter for public curated WGS84 destinations."""
from pathlib import Path
from urllib.request import urlopen,Request
from urllib.error import URLError
import json,time,threading,math
PLACES=Path(__file__).resolve().parents[1]/'dist/visit-places.json'
BASE='https://router.project-osrm.org/route/v1/driving/'
_cache={};_lock=threading.Lock();_last_request=0
class RoutingError(Exception):pass

def validated_points(stops):
    places={p['id']:p for p in json.loads(PLACES.read_text(encoding='utf-8-sig'))}
    ids=stops.split(',')
    if not 2<=len(ids)<=8 or len(ids)!=len(set(ids)) or any(i not in places for i in ids):raise ValueError('请选择2至8个不同的已收录目的地。')
    points=[dict(places[i],**{k:places[i]['routingPoint'][k] for k in ('lon','lat','coordinateSystem')}) if places[i].get('routingPoint') else places[i] for i in ids]
    if any(p.get('coordinateSystem')!='WGS84' or not isinstance(p['lon'],(int,float)) or not isinstance(p['lat'],(int,float)) or not 108<=p['lon']<=117 or not 28<=p['lat']<=34 for p in points):raise ValueError('目的地坐标未通过校验。')
    return points

def fetch_route(stops):
    global _last_request
    points=validated_points(stops)
    with _lock:
        hit=_cache.get(stops)
        if hit and time.monotonic()-hit[0]<600:return hit[1]
        if time.monotonic()-_last_request<1.1:raise RoutingError('请求过快，请稍后再试。')
        _last_request=time.monotonic()
    coordinates=';'.join(f"{p['lon']:.7f},{p['lat']:.7f}" for p in points)
    url=BASE+coordinates+'?overview=full&geometries=geojson&steps=true&radiuses='+';'.join('1500' for _ in points)
    try:
        req=Request(url,headers={'User-Agent':'JingchuHeritageExplorer/0.4 local-public-POI-prototype','Accept':'application/json'})
        with urlopen(req,timeout=18) as response:
            payload=response.read(4*1024*1024+1)
        if len(payload)>4*1024*1024:raise RoutingError('路线响应过大，请减少站点。')
        data=json.loads(payload)
        if data.get('code')!='Ok' or not data.get('routes'):raise RoutingError('这些目的地暂时没有可用道路路线。')
        route=data['routes'][0]
        result={'provider':'OSRM / OpenStreetMap','profile':'driving','includesLiveTraffic':False,'distance':route['distance'],'duration':route['duration'],'geometry':route['geometry'],'stops':[p['id'] for p in points],'snappingMeters':[p.get('distance',0) for p in data.get('waypoints',[])],'legs':[{'distance':leg['distance'],'duration':leg['duration'],'steps':[{'name':str(step.get('name',''))[:200],'distance':step['distance'],'duration':step['duration'],'maneuver':{k:step.get('maneuver',{}).get(k) for k in ['type','modifier','exit','location']}} for step in leg.get('steps',[])[:300]]} for leg in route['legs']]}
        if len(result['legs'])!=len(points)-1 or result['geometry'].get('type')!='LineString':raise RoutingError('路线数据不完整。')
    except (URLError,TimeoutError,OSError,json.JSONDecodeError,KeyError,TypeError) as error:raise RoutingError('道路服务暂时不可用。可以查看行程顺序，并逐站打开高德导航。') from error
    with _lock:
        if len(_cache)>30:_cache.clear()
        _cache[stops]=(time.monotonic(),result)
    return result
