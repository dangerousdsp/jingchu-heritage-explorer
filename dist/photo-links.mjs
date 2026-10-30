import {photos} from './photo-data.mjs';
const byId=new Map(photos.map(p=>[p.id,p]));
// Only associate a photograph when its named subject or explicit context is relevant.
const rules=[
 ['three-kingdoms',/三国/],['chu-opera',/楚剧/],['turquoise',/绿松石/],['huangmei',/黄梅戏/],
 ['lacquer',/漆器/],['wudang',/武当/],['shadow',/皮影/],['paper-cut',/剪纸/],['tea',/恩施玉露/],
 ['brick-tea-real',/黑茶|青砖|砖茶/],['weaving',/织锦|挑花/],['woodblock',/年画/],
 ['qu-yuan',/屈原|端午/],['guqin',/古琴/],['han-opera',/汉剧/],['chime',/编钟/],
 ['yangtze',/峡江号子/],['yellow-crane-photo',/黄鹤楼/],['shennong-photo',/神农|炎帝/],
 ['dragon-boat-real',/龙舟|龙船/],['stone-real',/大冶石雕/],
 ['enshi',/撒叶|撒尔|哭嫁|南曲|摆手舞|恩施灯戏|巴东堂戏|利川灯歌|长阳山歌|长阳南曲|长阳花鼓|建始丝弦/],
];
export function photoFor(item){const match=rules.find(([,pattern])=>pattern.test(item.title));return match?byId.get(match[0])||null:null;}
