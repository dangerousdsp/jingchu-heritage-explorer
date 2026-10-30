"""Create a new static release directory. Never replaces an existing directory."""
from pathlib import Path
import argparse,shutil,json,hashlib
PROJECT=Path(__file__).resolve().parents[1]
VERSION=json.loads((PROJECT/'package.json').read_text(encoding='utf-8'))['version']

def build_public(destination):
    """Configure the generated public copy for the prepared asset profile."""
    webgl=(destination/'runtime/runtime-manifest.json').is_file()
    (destination/'deployment.mjs').write_text(f'export const LEGACY_MEDIA_ENABLED = {str(webgl).lower()};\nexport const LEGACY_VIDEO_ENABLED = false;\n',encoding='utf-8')
    (destination/'.nojekyll').touch()
    page=destination/'index.html'
    html=page.read_text(encoding='utf-8')
    if webgl:return
    html=html.replace('<h3>选一件器物，换一个视角</h3>','<h3>三维展馆 · 本地资源版</h3>')
    html=html.replace('模型观赏、文化介绍与戏台互动，都从这里进入。','本公开演示提供图鉴、街道地图、道路规划与学习功能。原Unity程序和视频单独保存在本地。')
    html=html.replace('<button class="button cream" id="start-player">进入三维体验 ↗</button>','<button class="button cream" id="start-player" disabled>三维资源未包含在公开演示中</button><a class="button cream" href="about.html">版本说明 / Editions ↗</a>')
    html=html.replace('首次需加载约 348 MiB 核心资源，建议电脑与稳定网络。','本地资源版核心约348 MiB；下载源码本身不包含Unity构建。')
    page.write_text(html,encoding='utf-8')
def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('--output',type=Path,default=PROJECT/f'output/site-{VERSION}')
    parser.add_argument('--include-runtime',action='store_true')
    parser.add_argument('--auto-webgl',action='store_true',help='Include prepared static runtime when present')
    parser.add_argument('--public',action='store_true',help='Pages profile; add --auto-webgl for prepared 3D assets')
    parser.add_argument('--runtime-dir',type=Path,default=PROJECT.parent/'WebGL')
    args=parser.parse_args();destination=args.output.resolve()
    if destination.exists():raise SystemExit('Output already exists. Choose another --output directory.')
    if args.public and args.include_runtime:raise SystemExit('--public cannot include the legacy runtime.')
    if args.include_runtime:
        for name in ('Build/WebGL.loader.js','Build/WebGL.data.unityweb','Build/WebGL.framework.js.unityweb','Build/WebGL.wasm.unityweb'):
            if not (args.runtime_dir/name).is_file():raise SystemExit(f'Missing required runtime file: {name}')
    shutil.copytree(PROJECT/'dist',destination,ignore=shutil.ignore_patterns('runtime') if not args.auto_webgl else None)
    if args.public:build_public(destination)
    if args.include_runtime:
        for folder in ('Build','StreamingAssets'):
            if (args.runtime_dir/folder).is_dir():shutil.copytree(args.runtime_dir/folder,destination/'runtime'/folder)
    manifest=[]
    for file in sorted(destination.rglob('*')):
        if not file.is_file():continue
        digest=hashlib.sha256()
        with file.open('rb') as f:
            for chunk in iter(lambda:f.read(8*1024*1024),b''):digest.update(chunk)
        manifest.append({'path':file.relative_to(destination).as_posix(),'bytes':file.stat().st_size,'sha256':digest.hexdigest()})
    (destination/'release-manifest.json').write_text(json.dumps({'version':VERSION,'profile':('public-webgl' if (destination/'runtime/runtime-manifest.json').is_file() else 'public') if args.public else 'local','includes_legacy_runtime':args.include_runtime or (destination/'runtime/runtime-manifest.json').is_file(),'files':manifest},ensure_ascii=False,indent=2),encoding='utf-8')
    print('Static release:',destination)
    print('Legacy runtime:',args.include_runtime or (destination/'runtime/runtime-manifest.json').is_file())
if __name__=='__main__':main()
