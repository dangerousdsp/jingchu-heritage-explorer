"""Validate a generated public release without network access."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit,unquote
import argparse,hashlib,json,re
class References(HTMLParser):
    def __init__(self):super().__init__();self.refs=[]
    def handle_starttag(self,tag,attrs):
        for key,value in attrs:
            if key in {'href','src'} and value:self.refs.append(value)

def check_release(root):
    root=Path(root).resolve();errors=[]
    manifest_path=root/'release-manifest.json'
    if not manifest_path.is_file():return ['Missing release-manifest.json']
    manifest=json.loads(manifest_path.read_text(encoding='utf-8'))
    expected=set()
    for entry in manifest['files']:
        relative=entry['path'];target=(root/relative).resolve();expected.add(relative)
        if not target.is_relative_to(root):errors.append('Escaping manifest path: '+relative);continue
        if not target.is_file():errors.append('Missing file: '+relative);continue
        if target.stat().st_size!=entry['bytes'] or hashlib.sha256(target.read_bytes()).hexdigest()!=entry['sha256']:errors.append('Hash/size mismatch: '+relative)
    actual={p.relative_to(root).as_posix() for p in root.rglob('*') if p.is_file()}-{'release-manifest.json'}
    if actual!=expected:errors.append('Manifest and actual files differ')
    for path in root.rglob('*.html'):
        parser=References();parser.feed(path.read_text(encoding='utf-8'))
        for ref in parser.refs:
            url=urlsplit(ref)
            if url.scheme or url.netloc or not url.path:continue
            target=(path.parent/unquote(url.path)).resolve()
            if not target.is_relative_to(root) or not target.is_file():errors.append(f'Broken reference: {path.name}: {ref}')
    for path in root.rglob('*.mjs'):
        text=path.read_text(encoding='utf-8-sig')
        for ref in re.findall(r"(?:from\s*|import\s*)['\"]([^'\"]+)['\"]",text):
            if ref.startswith('.') and not (path.parent/ref).is_file():errors.append(f'Missing module: {path.name}: {ref}')
    if manifest.get('profile') in {'public','public-webgl'}:
        webgl=manifest['profile']=='public-webgl'
        if not webgl and (manifest.get('includes_legacy_runtime') or (root/'runtime').exists()):errors.append('Public profile contains legacy runtime')
        config=(root/'deployment.mjs').read_text(encoding='utf-8-sig')
        if f'LEGACY_MEDIA_ENABLED = {str(webgl).lower()}' not in config:errors.append('Incorrect 3D profile setting')
        if 'LEGACY_VIDEO_ENABLED = false' not in config:errors.append('Archived video must not be enabled in public profile')
        forbidden={'.mp4','.wasm','.docx','.xlsx'}|({'.unityweb'} if not webgl else set())
        if any(p.suffix.lower() in forbidden for p in root.rglob('*')):errors.append('Unexpected archive/raw resource in public profile')
        if webgl:
            try:
                runtime=root/'runtime';data=json.loads((runtime/'runtime-manifest.json').read_text(encoding='utf-8'))
                full=hashlib.sha256();size=0
                for part in data['parts']:
                    target=(runtime/part['path']).resolve()
                    if not target.is_relative_to(runtime.resolve()) or not target.is_file():raise ValueError('Invalid runtime part path')
                    content=target.read_bytes();full.update(content);size+=len(content)
                    if len(content)!=part['bytes'] or hashlib.sha256(content).hexdigest()!=part['sha256']:raise ValueError('Runtime part mismatch')
                if size!=data['bytes'] or full.hexdigest()!=data['sha256']:raise ValueError('Runtime reassembly mismatch')
                if any(p.stat().st_size>=25*1024*1024 for p in runtime.rglob('*') if p.is_file()):raise ValueError('Runtime file exceeds browser upload limit')
                if (runtime/'Build/WebGL.data.unityweb').exists():raise ValueError('Unsplit data file included')
            except (ValueError,KeyError,OSError) as error:errors.append('Invalid prepared runtime: '+str(error))
    return errors

def main():
    parser=argparse.ArgumentParser();parser.add_argument('directory',type=Path);args=parser.parse_args()
    errors=check_release(args.directory)
    if errors:raise SystemExit('\n'.join(errors))
    print('Release checks passed:',args.directory)
if __name__=='__main__':main()
