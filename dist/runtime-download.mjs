export async function prepareRuntimeData(base,onProgress=()=>{}){
  const response=await fetch(new URL('runtime-manifest.json',base));
  if(response.status===404)return {url:new URL('Build/WebGL.data.unityweb',base).href,release(){}};
  if(!response.ok)throw Error('runtime-manifest');
  const manifest=await response.json();
  if(manifest.format!==1||manifest.compression!=='gzip'||!Array.isArray(manifest.parts)||manifest.parts.length>100)throw Error('invalid-runtime-manifest');
  const chunks=[];let loaded=0;
  for(const part of manifest.parts){
    if(!/^Build\/data-\d{2}\.bin$/.test(part.path)||!Number.isSafeInteger(part.bytes)||part.bytes<=0||part.bytes>25*1024*1024)throw Error('invalid-runtime-part');
    const res=await fetch(new URL(part.path,base));if(!res.ok)throw Error('runtime-part-download');
    const data=await res.arrayBuffer();if(data.byteLength!==part.bytes)throw Error('runtime-part-size');
    if(globalThis.crypto?.subtle){const digest=await crypto.subtle.digest('SHA-256',data);const hex=[...new Uint8Array(digest)].map(b=>b.toString(16).padStart(2,'0')).join('');if(hex!==part.sha256)throw Error('runtime-part-integrity');}
    chunks.push(data);loaded+=data.byteLength;onProgress(loaded/manifest.bytes);
  }
  if(loaded!==manifest.bytes)throw Error('runtime-data-size');
  const url=URL.createObjectURL(new Blob(chunks,{type:'application/octet-stream'}));
  return {url,release(){URL.revokeObjectURL(url);}};
}
