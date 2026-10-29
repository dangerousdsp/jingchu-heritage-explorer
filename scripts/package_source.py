"""Package maintained source only; skip legacy build, local evidence and caches."""
from pathlib import Path
import zipfile,json,argparse
ROOT=Path(__file__).resolve().parents[1]
version=json.loads((ROOT/'package.json').read_text(encoding='utf-8'))['version']
parser=argparse.ArgumentParser()
parser.add_argument('--output',type=Path,default=ROOT/f'output/heritage-explorer-source-{version}.zip')
output=parser.parse_args().output.resolve()
if output.exists():raise SystemExit('Source package already exists. Preserve it or choose a new version.')
output.parent.mkdir(exist_ok=True)
allowed_roots={'dist','docs','scripts','tests','.github'}
allowed_files={'README.md','README.en.md','LICENSE_SCOPE.md','CONTRIBUTING.md','THIRD_PARTY_NOTICES.md','CHANGELOG.md','package.json','.gitignore','.gitattributes','start.ps1','启动展馆.cmd'}
files=[]
for p in sorted(ROOT.rglob('*')):
    rel=p.relative_to(ROOT)
    if not p.is_file() or '__pycache__' in rel.parts or p.suffix=='.pyc':continue
    if rel.parts[0] not in allowed_roots and str(rel) not in allowed_files:continue
    if rel.parts[:2]==('dist','runtime'):continue
    files.append((p,rel))
with zipfile.ZipFile(output,'w',compression=zipfile.ZIP_DEFLATED) as z:
    for p,rel in files:z.write(p,Path('heritage-explorer')/rel)
with zipfile.ZipFile(output) as z:
    bad=z.testzip()
    if bad:raise SystemExit(f'ZIP integrity failed: {bad}')
print(output)
print(f'{len(files)} files, {output.stat().st_size} bytes')
