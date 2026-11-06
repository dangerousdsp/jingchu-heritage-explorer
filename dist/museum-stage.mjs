import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {DRACOLoader} from 'three/addons/loaders/DRACOLoader.js';
import {MeshoptDecoder} from 'three/addons/libs/meshopt_decoder.module.js';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';

const surfaceFiles={
  walnut:['fine_grained_wood-diffuse.webp','fine_grained_wood-rough.webp','fine_grained_wood-nor_gl.webp'],
  floor:['wood_floor-diffuse.webp','wood_floor-rough.webp','wood_floor-nor_gl.webp'],
  plaster:['painted_plaster_wall-diffuse.webp','painted_plaster_wall-rough.webp']
};
function release(root){
  if(!root)return;const geometries=new Set(),materials=new Set(),textures=new Set();
  root.traverse(node=>{if(node.geometry)geometries.add(node.geometry);for(const material of Array.isArray(node.material)?node.material:node.material?[node.material]:[]){materials.add(material);for(const value of Object.values(material))if(value?.isTexture&&!value.userData.galleryShared)textures.add(value);}});
  for(const texture of textures){texture.dispose();const data=texture.source?.data;if(typeof data?.close==='function')data.close();}
  for(const material of materials)material.dispose();for(const geometry of geometries)geometry.dispose();root.removeFromParent();
}
const clamp=THREE.MathUtils.clamp;
function addMesh(parent,geometry,material,position=[0,0,0]){const node=new THREE.Mesh(geometry,material);node.position.set(...position);node.receiveShadow=true;parent.add(node);return node;}
function rounded(parent,size,material,position,radius=.035){return addMesh(parent,new RoundedBoxGeometry(...size,2,Math.min(radius,...size.map(value=>value/3))),material,position);}

export function createMuseumViewer({host,onPick=()=>{},onProject=()=>{},onLoading=()=>{},onMetrics=()=>{}}){
  const mobile=innerWidth<740;
  const renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'default'});
  renderer.setPixelRatio(Math.min(devicePixelRatio||1,mobile?1.25:1.5));renderer.setClearColor('#d4cfc5');
  renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;
  renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  renderer.domElement.tabIndex=0;renderer.domElement.setAttribute('aria-label','三维器物观察 / Interactive 3D object');host.replaceChildren(renderer.domElement);
  const scene=new THREE.Scene();scene.fog=new THREE.Fog('#d4cfc5',17,35);
  const camera=new THREE.PerspectiveCamera(38,1,.05,65),controls=new OrbitControls(camera,renderer.domElement);
  controls.enableDamping=true;controls.dampingFactor=.1;controls.enablePan=false;controls.autoRotateSpeed=.55;
  const generator=new THREE.PMREMGenerator(renderer),environmentScene=new RoomEnvironment(),environment=generator.fromScene(environmentScene,.07);environmentScene.dispose();generator.dispose();scene.environment=environment.texture;scene.environmentIntensity=.48;
  scene.add(new THREE.HemisphereLight('#fff9ed','#7d786c',.85));
  const key=new THREE.DirectionalLight('#fff1d9',2.6);key.position.set(-3.5,6,4);key.castShadow=true;key.shadow.mapSize.set(mobile?1024:1536,mobile?1024:1536);key.shadow.normalBias=.018;key.shadow.bias=-.00015;key.shadow.camera.near=.2;key.shadow.camera.far=25;scene.add(key);
  const fill=new THREE.DirectionalLight('#e7edf3',.65);fill.position.set(4,3,-1);scene.add(fill);
  const draco=new DRACOLoader().setDecoderPath(new URL('./vendor/three/examples/jsm/libs/draco/gltf/',import.meta.url).href);draco.setWorkerLimit(mobile?1:2);
  const loader=new GLTFLoader().setDRACOLoader(draco).setMeshoptDecoder(MeshoptDecoder),textureLoader=new THREE.TextureLoader();
  const sharedTextures=new Set(),surfaces={};let materialPromise=null;
  let display=null,mode='object',themeId='',assetId='',markers=[],frame=0,visible=true,disposed=false,contextLost=false,generation=0,abort=null,tween=null,roomPending=0;
  let focus={target:new THREE.Vector3(0,1.7,0),size:new THREE.Vector3(1.8,2.4,1.6)};
  const raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2();
  function requestRender(){if(!frame&&!disposed&&!document.hidden&&visible&&!contextLost)frame=requestAnimationFrame(draw);}
  function draw(time){frame=0;if(disposed||document.hidden||!visible||contextLost)return;
    if(tween){const p=Math.min(1,(time-tween.start)/450),s=1-(1-p)**3;camera.position.lerpVectors(tween.from,tween.to,s);controls.target.lerpVectors(tween.fromTarget,tween.toTarget,s);if(p===1)tween=null;}
    const changed=controls.update();renderer.render(scene,camera);const rect=host.getBoundingClientRect();
    onProject(markers.map(marker=>{const v=marker.position.clone().project(camera);return {...marker,x:(v.x*.5+.5)*rect.width,y:(-.5*v.y+.5)*rect.height,visible:v.z>-1&&v.z<1&&Math.abs(v.x)<.96&&Math.abs(v.y)<.94};}));
    onMetrics(metrics());if(changed||controls.autoRotate||tween)requestRender();
  }
  function metrics(){return {themeId,assetId,camera:camera.position.toArray(),calls:renderer.info.render.calls,triangles:renderer.info.render.triangles,geometries:renderer.info.memory.geometries,textures:renderer.info.memory.textures,roomPending};}
  controls.addEventListener('change',requestRender);
  function resize(){const bounds=host.getBoundingClientRect();if(!bounds.width||!bounds.height)return;renderer.setSize(bounds.width,bounds.height,false);camera.aspect=bounds.width/bounds.height;camera.updateProjectionMatrix();requestRender();}
  const observer=new ResizeObserver(resize);observer.observe(host);
  const intersection=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)requestRender();else if(frame){cancelAnimationFrame(frame);frame=0;}});intersection.observe(host);
  function visibility(){if(document.hidden&&frame){cancelAnimationFrame(frame);frame=0;}else requestRender();}document.addEventListener('visibilitychange',visibility);

  async function materials(){
    if(!materialPromise)materialPromise=Promise.all(Object.entries(surfaceFiles).map(async([role,names])=>{
      const maps=await Promise.all(names.map(async(name,index)=>{try{const texture=await textureLoader.loadAsync(new URL('assets/museum/materials/'+name,import.meta.url).href);if(disposed){texture.dispose();return null;}texture.wrapS=texture.wrapT=THREE.RepeatWrapping;texture.colorSpace=index===0?THREE.SRGBColorSpace:THREE.NoColorSpace;texture.anisotropy=Math.min(4,renderer.capabilities.getMaxAnisotropy());texture.userData.galleryShared=true;sharedTextures.add(texture);if(role==='floor')texture.repeat.set(5,4);else if(role==='plaster')texture.repeat.set(2.5,2);else texture.repeat.set(1.6,.85);return texture;}catch{return null;}}));surfaces[role]=maps;
    }));await materialPromise;
  }
  function material(role,color,options={}){const maps=surfaces[role]||[];return new THREE.MeshStandardMaterial({color,map:maps[0]||null,roughnessMap:maps[1]||null,normalMap:maps[2]||null,normalScale:new THREE.Vector2(.22,.22),roughness:.82,metalness:0,...options});}
  function plinth(parent,{width,depth,height=.56,x=0,z=0}){
    rounded(parent,[width,height-.06,depth],material('walnut','#74604b',{roughness:.68}),[x,(height-.06)/2,z],.045);
    rounded(parent,[width+.025,.018,depth+.025],new THREE.MeshStandardMaterial({color:'#8d7650',metalness:.7,roughness:.4}),[x,height-.05,z],.006);
    rounded(parent,[width+.06,.065,depth+.06],material('plaster','#c6c0b4',{roughness:.92}),[x,height-.018,z],.018);
    rounded(parent,[width*.92,.035,depth*.92],new THREE.MeshStandardMaterial({color:'#282b27',roughness:.92}),[x,.018,z],.012);
  }
  function fitObject(object,asset,{dimension=2.45,ground=.575}={}){
    if(asset.rotation)object.rotation.set(...asset.rotation);if(asset.orientationQuaternion)object.quaternion.premultiply(new THREE.Quaternion(...asset.orientationQuaternion));object.updateMatrixWorld(true);
    let bounds=new THREE.Box3().setFromObject(object,true),size=bounds.getSize(new THREE.Vector3()),largest=Math.max(size.x,size.y,size.z);if(!Number.isFinite(largest)||largest<=0)throw Error('invalid-model-bounds');
    object.scale.multiplyScalar(dimension/largest);object.updateMatrixWorld(true);bounds=new THREE.Box3().setFromObject(object,true);const centre=bounds.getCenter(new THREE.Vector3());object.position.x-=centre.x;object.position.z-=centre.z;object.position.y+=ground-bounds.min.y;
    object.traverse(node=>{if(node.isMesh){node.castShadow=true;node.receiveShadow=true;}});object.updateMatrixWorld(true);bounds=new THREE.Box3().setFromObject(object,true);return {object,bounds,size:bounds.getSize(new THREE.Vector3())};
  }
  function objectSet(fitted,asset,points){
    const group=new THREE.Group(),{object,bounds,size}=fitted;group.add(object);
    addMesh(group,new THREE.PlaneGeometry(22,22),material('plaster','#c4beb2',{roughness:.95})).rotation.x=-Math.PI/2;
    const backdrop=addMesh(group,new THREE.PlaneGeometry(16,8),material('plaster','#dad5ca'),[0,3.7,-3.4]);backdrop.receiveShadow=true;
    if(asset.displayType==='relief'){
      plinth(group,{width:size.x+.35,depth:.82,height:.72});
      rounded(group,[size.x+.22,size.y+.2,.11],material('walnut','#6a5742'),[0,bounds.min.y+size.y/2,-size.z/2-.09],.025);
      for(const x of [-size.x*.36,size.x*.36])rounded(group,[.035,size.y+.09,.05],new THREE.MeshStandardMaterial({color:'#967c4c',roughness:.48,metalness:.65}),[x,bounds.min.y+size.y/2,-size.z/2-.025],.009);
    }else plinth(group,{width:clamp(size.x+.38,1.1,3.25),depth:clamp(size.z+.38,.95,2.5),height:.56});
    focus={target:bounds.getCenter(new THREE.Vector3()),size:size.clone()};focus.target.y-=.06;
    markers=points.map((point,index)=>({index,position:new THREE.Vector3(point.position[0]*size.x,bounds.min.y+point.position[1]*size.y,point.position[2]*size.z)}));return group;
  }
  function roomSet(items){
    const room=new THREE.Group();addMesh(room,new THREE.BoxGeometry(10.4,.1,7.6),material('floor','#bba17f',{roughness:.75}),[0,-.06,0]);
    rounded(room,[10.4,3.5,.14],material('plaster','#ded8cb'),[0,1.7,-3.76],.025);rounded(room,[.14,3.5,7.6],material('plaster','#d3ccbf'),[-5.2,1.7,0],.025);
    rounded(room,[10.15,.075,.05],new THREE.MeshStandardMaterial({color:'#85714d',metalness:.6,roughness:.45}),[0,.11,-3.65],.012);
    for(const x of [-4.75,-4.53,-4.31])rounded(room,[.075,3.35,.12],material('walnut','#62513d'),[x,1.66,-3.6],.014);
    rounded(room,[8.1,.065,.07],new THREE.MeshStandardMaterial({color:'#333833',roughness:.65}),[0,3.28,-.15],.018);
    const locations=[[-2.25,1.45],[2.15,1.45],[-2.25,-1.85],[2.15,-2.35]];
    const slots=items.map((item,index)=>{
      const [x,z]=locations[index%locations.length],relief=item.asset.displayType==='relief',ground=relief?.755:.765;
      plinth(room,{x,z,width:relief?2.7:1.6,depth:relief?.68:1.45,height:relief?.74:.75});
      const container=new THREE.Group();container.position.set(x,0,z);room.add(container);
      if(relief)rounded(container,[2.7,1.6,.1],material('walnut','#6a5742'),[0,1.5,-.15],.03);
      rounded(room,[.045,.055,Math.abs(z+.8+.15)+.12],new THREE.MeshStandardMaterial({color:'#333833',roughness:.65}),[x-.4,3.28,(z+.8-.15)/2],.012);
      const spot=new THREE.SpotLight('#fff1d7',15,6,.58,.8,1.5);spot.position.set(x-.4,3.18,z+.8);spot.target.position.set(x,1.4,z);room.add(spot,spot.target);
      const lamp=addMesh(room,new THREE.CylinderGeometry(.075,.075,.22,16),new THREE.MeshStandardMaterial({color:'#383b35',roughness:.55}),[x-.4,3.2,z+.8]);lamp.rotation.x=.28;
      return {...item,container,x,z,ground,dimension:relief?2.48:item.themeId==='stone'?1.55:1.7,loaded:false,poster:null};
    });
    markers=slots.map((slot,index)=>({index,themeId:slot.themeId,assetId:slot.asset.id,position:new THREE.Vector3(slot.x,.56,slot.z+(slot.asset.displayType==='relief'?.55:.98))}));
    return {room,slots};
  }
  async function fetchObject(asset,token,signal){
    if(!asset.url)throw Error('no-model');const url=new URL(asset.url,import.meta.url);if(asset.version)url.searchParams.set('v',asset.version);
    const response=await fetch(url,{signal,cache:asset.version?'force-cache':'default'});if(!response.ok)throw Error(`model-http-${response.status}`);
    const total=Number(response.headers.get('Content-Length'))||0;if(total>20*1048576)throw Error('model-too-large');let data;
    if(response.body?.getReader){const reader=response.body.getReader(),chunks=[];let size=0;while(true){const {value,done}=await reader.read();if(done)break;size+=value.length;if(size>20*1048576){await reader.cancel();throw Error('model-too-large');}chunks.push(value);if(token===generation&&mode==='object')onLoading(total?size/total*.88:null);}const joined=new Uint8Array(size);let offset=0;for(const chunk of chunks){joined.set(chunk,offset);offset+=chunk.length;}data=joined.buffer;}else data=await response.arrayBuffer();
    if(disposed||token!==generation)throw new DOMException('Aborted','AbortError');const gltf=await loader.parseAsync(data,new URL('.',url).href);return gltf.scene;
  }
  function photoFor(slot,token){
    if(!slot.asset.poster)return;textureLoader.loadAsync(new URL(slot.asset.poster,import.meta.url).href).then(texture=>{
      if(disposed||token!==generation||slot.loaded){texture.dispose();return;}texture.colorSpace=THREE.SRGBColorSpace;const ratio=texture.image.width/texture.image.height,height=Math.min(1.25,1.3/ratio),width=height*ratio;const frame=new THREE.Group();
      rounded(frame,[width+.1,height+.1,.07],material('walnut','#5b4b3b'),[0,slot.ground+height/2,-.06],.025);
      addMesh(frame,new THREE.PlaneGeometry(width,height),new THREE.MeshBasicMaterial({map:texture,toneMapped:false}),[0,slot.ground+height/2,-.017]);slot.container.add(frame);slot.poster=frame;requestRender();
    }).catch(()=>{});
  }
  async function fillRoom(slots,token,signal){
    let index=0;roomPending=slots.length;slots.forEach(slot=>photoFor(slot,token));
    async function worker(){while(index<slots.length){const slot=slots[index++];try{
      const source={...slot.asset,url:slot.asset.roomUrl||slot.asset.url,version:slot.asset.roomVersion||slot.asset.version};const object=await fetchObject(source,token,signal);if(disposed||token!==generation){release(object);return;}
      const fitted=fitObject(object,source,{dimension:slot.dimension,ground:slot.ground});fitted.object.traverse(node=>{node.userData.themeId=slot.themeId;node.userData.assetId=slot.asset.id;});slot.container.add(fitted.object);slot.loaded=true;release(slot.poster);slot.poster=null;
    }catch(error){if(token!==generation||disposed)return;if(error.name!=='AbortError')console.warn('[Gallery object]',slot.asset.id,error.message);}finally{if(token===generation){roomPending=Math.max(0,roomPending-1);requestRender();}}}}
    await Promise.all([worker(),worker()]);
  }
  function setCamera(preset='reset',animate=true){
    const target=mode==='room'?new THREE.Vector3(0,1.3,-.35):focus.target.clone();let positions;
    if(mode==='room')positions={front:[0,5.5,11.2],side:[9.5,5.8,6],top:[.01,12,.01],reset:[8.2,6.3,10.8]};
    else{const size=focus.size,fit=Math.max(size.y,size.x/Math.max(.7,camera.aspect))/(2*Math.tan(THREE.MathUtils.degToRad(camera.fov/2)))*1.18+size.z*.55;const d=Math.max(3.7,fit);positions={front:[0,target.y+.08,d],side:[d,target.y+.35,.05],top:[.01,target.y+d,.01],reset:[d*.43,target.y+d*.18,d*.91]};}
    const destination=new THREE.Vector3(...(positions[preset]||positions.reset));controls.minDistance=mode==='room'?6:1.8;controls.maxDistance=mode==='room'?19:10;controls.maxPolarAngle=Math.PI*.49;
    if(animate&&!matchMedia('(prefers-reduced-motion: reduce)').matches)tween={from:camera.position.clone(),to:destination,fromTarget:controls.target.clone(),toTarget:target,start:performance.now()};else{tween=null;camera.position.copy(destination);controls.target.copy(target);}requestRender();
  }
  async function show({theme,asset,view='object',points=[],keepCamera=false,roomItems=[]}){
    const token=++generation;abort?.abort();abort=new AbortController();const signal=abort.signal;mode=view;themeId=theme;assetId=asset.id;controls.autoRotate=false;roomPending=0;
    renderer.toneMappingExposure=mode==='room'?1.08:asset.exposure||1.05;const extent=mode==='room'?7:4;Object.assign(key.shadow.camera,{left:-extent,right:extent,top:extent,bottom:-extent});key.shadow.camera.updateProjectionMatrix();
    await materials();if(disposed||token!==generation)return false;
    let next,slots;
    if(mode==='room'){const result=roomSet(roomItems);next=result.room;slots=result.slots;}
    else{const object=await fetchObject(asset,token,signal);if(disposed||token!==generation){release(object);return false;}const fitted=fitObject(object,asset,{dimension:asset.displayType==='relief'?3:2.45,ground:asset.displayType==='relief'?.735:.575});next=objectSet(fitted,asset,points);}
    if(disposed||token!==generation){release(next);return false;}release(display);display=next;scene.add(display);resize();if(!keepCamera)setCamera('reset',false);requestRender();if(slots)fillRoom(slots,token,signal);return true;
  }
  let down=null;
  function pointerDown(event){down={x:event.clientX,y:event.clientY};}
  function pointerUp(event){if(mode!=='room'||!down||Math.hypot(event.clientX-down.x,event.clientY-down.y)>6)return;const rect=renderer.domElement.getBoundingClientRect();pointer.set((event.clientX-rect.left)/rect.width*2-1,-(event.clientY-rect.top)/rect.height*2+1);raycaster.setFromCamera(pointer,camera);const hit=display&&raycaster.intersectObject(display,true).find(result=>result.object.userData.assetId);if(hit)onPick({themeId:hit.object.userData.themeId,assetId:hit.object.userData.assetId});down=null;}
  function lost(event){event.preventDefault();contextLost=true;host.dispatchEvent(new CustomEvent('museum:contextlost',{bubbles:true}));}
  renderer.domElement.addEventListener('pointerdown',pointerDown);renderer.domElement.addEventListener('pointerup',pointerUp);renderer.domElement.addEventListener('webglcontextlost',lost);resize();
  return {show,setCamera,render:requestRender,rotate(value){controls.autoRotate=value;requestRender();},getMetrics:metrics,dispose(){if(disposed)return;disposed=true;++generation;abort?.abort();if(frame)cancelAnimationFrame(frame);observer.disconnect();intersection.disconnect();document.removeEventListener('visibilitychange',visibility);controls.dispose();release(display);for(const texture of sharedTextures)texture.dispose();environment.dispose();key.shadow.dispose();draco.dispose();renderer.dispose();renderer.domElement.remove();}};
}
