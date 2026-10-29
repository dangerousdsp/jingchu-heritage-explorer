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
    if manifest.get('profile')=='public':
        if manifest.get('includes_legacy_runtime') or (root/'runtime').exists():errors.append('Public profile contains legacy runtime')
        if 'LEGACY_MEDIA_ENABLED = false' not in (root/'deployment.mjs').read_text(encoding='utf-8-sig'):errors.append('Legacy inputs not disabled in public profile')
        if any(p.suffix.lower() in {'.mp4','.unityweb','.wasm','.docx','.xlsx'} for p in root.rglob('*')):errors.append('Unexpected archive/raw resource in public profile')
    return errors

def main():
    parser=argparse.ArgumentParser();parser.add_argument('directory',type=Path);args=parser.parse_args()
    errors=check_release(args.directory)
    if errors:raise SystemExit('\n'.join(errors))
    print('Release checks passed:',args.directory)
if __name__=='__main__':main()
