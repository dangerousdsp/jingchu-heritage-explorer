// Extract exhibit previews from the original, locally captured runtime screenshots.
// The connected flat grey background is removed; no exhibit geometry is generated.
const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');
const project = path.resolve(__dirname, '..');
const source = process.argv[2] || path.resolve(project, '../project_audit_20261029');
const previews = [
  ['webgl_pottery.png', 'pottery.webp', { left: 345, top: 170, width: 205, height: 270 }],
  ['webgl_woodcarving.png', 'wood.webp', { left: 370, top: 125, width: 210, height: 490 }],
  ['webgl_chime.png', 'chime.webp', { left: 340, top: 245, width: 240, height: 320 }],
];
(async () => {
  for (const [file, name, crop] of previews) {
    const { data, info } = await sharp(path.join(source, file)).extract(crop).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const { width: w, height: h } = info;
    const bg = [data[0], data[1], data[2]], visited = new Uint8Array(w*h), queue = [];
    const push = i => {if (!visited[i]) {visited[i] = 1; queue.push(i);}};
    for (let x=0;x<w;x++){push(x);push((h-1)*w+x);}
    for (let y=0;y<h;y++){push(y*w);push(y*w+w-1);}
    for (let at=0;at<queue.length;at++) {
      const i=queue[at], p=i*4;
      if (Math.max(...bg.map((v,j)=>Math.abs(v-data[p+j]))) > 10) continue;
      data[p+3] = 0;
      if(i%w)push(i-1);if(i%w<w-1)push(i+1);if(i>=w)push(i-w);if(i<w*(h-1))push(i+w);
    }
    await sharp(data, { raw: { width:w, height:h, channels:4 } }).trim().resize({height:420}).webp({quality:92}).toFile(path.join(project, 'dist/assets', name));
    console.log(name);
  }
})();
