"""Prepare the retained Unity export for ordinary static hosting; no Unity needed."""
from pathlib import Path
import argparse,hashlib,json,shutil
ROOT=Path(__file__).resolve().parents[1]
CHUNK_BYTES=20*1024*1024
def package(runtime,destination):
    runtime=Path(runtime).resolve();destination=Path(destination).resolve()
    if destination.exists():raise ValueError('Output exists; choose a new destination.')
    required=['WebGL.loader.js','WebGL.framework.js.unityweb','WebGL.wasm.unityweb','WebGL.data.unityweb']
    for name in required:
        if not (runtime/'Build'/name).is_file():raise ValueError('Missing '+name)
    build=destination/'Build';build.mkdir(parents=True)
    for name in required[:3]:shutil.copy2(runtime/'Build'/name,build/name)
    source=runtime/'Build/WebGL.data.unityweb';parts=[];full=hashlib.sha256()
    with source.open('rb') as stream:
        while chunk:=stream.read(CHUNK_BYTES):
            name=f'Build/data-{len(parts):02d}.bin';(destination/name).write_bytes(chunk);full.update(chunk)
            parts.append(dict(path=name,bytes=len(chunk),sha256=hashlib.sha256(chunk).hexdigest()))
    manifest=dict(format=1,compression='gzip',bytes=source.stat().st_size,sha256=full.hexdigest(),parts=parts)
    (destination/'runtime-manifest.json').write_text(json.dumps(manifest,indent=2)+'\n',encoding='utf-8')
    return manifest
if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('--runtime-dir',type=Path,default=ROOT.parent/'WebGL');parser.add_argument('--output',type=Path,default=ROOT/'dist/runtime');args=parser.parse_args()
    result=package(args.runtime_dir,args.output);print(f"Prepared {len(result['parts'])} parts; {result['bytes']} bytes; {result['sha256']}")
