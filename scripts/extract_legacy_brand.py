"""Decode UI textures from the immutable legacy build for faithful logo recovery."""
from pathlib import Path
import json,struct,io
from PIL import Image,ImageOps,ImageDraw
ROOT=Path(__file__).resolve().parents[2]
OUT=ROOT/'heritage-explorer/qa/legacy-ui';OUT.mkdir(parents=True,exist_ok=True)
objects=json.loads((ROOT/'project_audit_20261029/windows_asset_objects_private.json').read_text(encoding='utf-8'))
def decode(o):
    p=ROOT/'Windows/My test_Data'/o['file']
    b=p.read_bytes()[o['offset']:o['offset']+o['bytes']]
    n=struct.unpack_from('<i',b)[0];pos=(4+n+3)//4*4
    w,h,size,mips_stripped,fmt,mips=struct.unpack_from('<iiiiii',b,pos+8)
    # StreamData is the last aligned path, preceded by UInt64 offset and UInt32 size.
    stream=None
    for i in range(pos+80,len(b)-4,4):
        length=struct.unpack_from('<i',b,i)[0]
        if 0<length<100 and b[i+4:i+4+length].endswith(b'.resS'):
            stream=(struct.unpack_from('<Q',b,i-12)[0],struct.unpack_from('<I',b,i-4)[0],b[i+4:i+4+length].decode());break
    if not stream:return
    offset,length,name=stream
    with (p.parent/name).open('rb') as f:f.seek(offset);raw=f.read(length)
    if fmt in (10,12):
        fourcc=b'DXT1' if fmt==10 else b'DXT5'
        header=struct.pack('<7I',124,0x81007,h,w,len(raw),0,1)+b'\0'*44+struct.pack('<II4sIIIII',32,4,fourcc,0,0,0,0,0)+struct.pack('<5I',0x1000,0,0,0,0)
        image=Image.open(io.BytesIO(b'DDS '+header+raw)).convert('RGBA')
    elif fmt==4:image=Image.frombytes('RGBA',(w,h),raw[:w*h*4])
    elif fmt==3:image=Image.frombytes('RGB',(w,h),raw[:w*h*3]).convert('RGBA')
    else:raise ValueError(fmt)
    return ImageOps.flip(image)
previews=[]
for o in objects:
    if o['class_id']!=28 or o['file'] not in ['sharedassets0.assets','sharedassets1.assets']:continue
    if 'Font' in o.get('name','') or 'Atlas' in o.get('name',''):continue
    try:
        image=decode(o)
        if image is None:continue
        name=f"{o['file']}-{o['path_id']}.png";image.save(OUT/name);previews.append((name,image))
        print(name,image.size)
    except Exception as e:print('skip',o['path_id'],e)
sheet=Image.new('RGB',(800,260*len(previews)),'#eee9dd');draw=ImageDraw.Draw(sheet)
for i,(name,im) in enumerate(previews):
    im=im.copy();im.thumbnail((780,225));sheet.paste(im,(10,i*260+25),im if im.mode=='RGBA' else None);draw.text((10,i*260+5),name,fill='black')
sheet.save(OUT/'contact-sheet.jpg')
