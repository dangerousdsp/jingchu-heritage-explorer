// Stable heritage IDs are shared with the collection; asset IDs identify objects.
export const SCENE_THEMES = Object.freeze({2:'pottery',3:'stone',4:'chime',5:'opera'});
export const themeOrder = ['pottery','chime','stone','relief'];
export const bilingual=(zh,en)=>({zh,en});
export const themes = {
  pottery:{id:'pottery',number:'01',title:bilingual('泥土成器','Earth into form'),name:bilingual('陶器与生活','Pottery and everyday life'),heritage:bilingual('竹溪毛家窑','Zhuxi Maojiayao pottery'),region:bilingual('十堰 · 竹溪','Zhuxi · Shiyan'),poster:'assets/pottery.webp',color:'#ad7450',description:bilingual('沿着口沿、器颈与器腹，读一件器物的形。','Follow the rim, neck and body to read the shape of a vessel.'),source:'https://www.rmlt.com.cn/2018/1023/531042.shtml',sourceTitle:bilingual('毛家窑陶文化背景','Maojiayao pottery background'),process:[bilingual('泥土与材料','Clay and materials'),bilingual('成型与器形','Shaping the vessel'),bilingual('干燥与烧制','Drying and firing'),bilingual('日常用途','Everyday use')],processNote:bilingual('这里是认识陶器的一般观察线索。毛家窑的具体工艺请结合专题与来源阅读。','These are general prompts for understanding pottery. Read the entry and its source for the local craft.'),points:[{title:bilingual('口沿','Rim'),body:bilingual('从上方观察开口。想一想：口沿的形状怎样影响取用、倾倒或储藏？','Look at the opening from above. How might the rim affect pouring, access or storage?'),position:[0,.89,.3]},{title:bilingual('器颈','Neck'),body:bilingual('从侧面观察颈部与器腹的连接，比较曲线和比例。','Look from the side at the transition from neck to body and compare the proportions.'),position:[.32,.68,.25]},{title:bilingual('器腹','Body'),body:bilingual('观察器腹的宽度与整体轮廓，把外形与用途联系起来。','Observe the width and outline of the body and consider its possible uses.'),position:[-.34,.35,.36]}]},
  wood:{id:'wood',number:'02',title:bilingual('木上生花','Stories in wood'),name:bilingual('木纹与雕刻','Woodgrain and carving'),heritage:bilingual('通山木雕','Tongshan woodcarving'),region:bilingual('咸宁 · 通山','Tongshan · Xianning'),poster:'assets/wood.webp',color:'#8b6545',description:bilingual('正面读图，侧面看层次，让木材的空间关系浮现。','Read the composition from the front and its depth from the side.'),source:'https://www.ihchina.cn/project_details/14141/',sourceTitle:bilingual('木雕（通山木雕）','Woodcarving (Tongshan woodcarving)'),process:[bilingual('认识木材','Understand the wood'),bilingual('观察构图','Read the composition'),bilingual('辨认雕刻层次','Explore carved depth'),bilingual('留意纹理与修整','Look at grain and finish')],processNote:bilingual('示意浮雕用于认识前后层次，不对应某件通山木雕实物。外部作品保留自己的作者与产地。','The relief study explains depth and is not a specific Tongshan object. External works keep their own makers and origins.'),points:[{title:bilingual('前后层次','Depth'),body:bilingual('切到侧向视角，看看前景与背景的高低差。','Choose a side view and compare the height of foreground and background.'),position:[-.27,.58,.34]},{title:bilingual('材料与木纹','Woodgrain'),body:bilingual('纹理和色彩也是作品的一部分。示意图案不代表某种传统纹样。','Grain and colour contribute to the work. The study pattern is not a documented traditional motif.'),position:[.3,.34,.32]},{title:bilingual('构图','Composition'),body:bilingual('沿着画面的疏密和留白寻找视觉线索，再回到专题认识地方题材。','Follow the arrangement and open spaces, then read the entry for local subjects and stories.'),position:[0,.86,.3]}]},
  chime:{id:'chime',number:'03',title:bilingual('青铜有声','Bronze and resonance'),name:bilingual('器形与铸造','Form and casting'),heritage:bilingual('青铜编钟制作技艺','Bronze chime-bell making'),region:bilingual('随州 · 曾都','Zengdu · Suizhou'),poster:'assets/chime.webp',color:'#637d67',description:bilingual('从钟体到纹饰，认识造型、铸造与校音的联系。','Explore how form, casting and tuning meet in a bell.'),source:'https://www.ihchina.cn/project_details/23564/',sourceTitle:bilingual('青铜编钟制作技艺','Bronze chime-bell making'),process:[bilingual('制模','Mould making'),bilingual('铸造','Casting'),bilingual('修整','Finishing'),bilingual('校音','Tuning')],processNote:bilingual('四个关键词帮助阅读制作技艺。造型示意不构成文物结构或声学复原。','These four terms introduce the craft. The form study is not an archaeological or acoustic reconstruction.'),points:[{title:bilingual('钟体轮廓','Outline'),body:bilingual('从正面和侧面比较钟体的轮廓，留意开口与悬挂的位置。','Compare the outline from the front and side, including the mouth and suspension.'),position:[-.27,.56,.28]},{title:bilingual('表面与纹饰','Surface'),body:bilingual('把装饰、材料质感和器形分开观察。示意凸点只说明表面层次。','Observe decoration, surface and form separately. The study bosses only illustrate surface depth.'),position:[.28,.4,.3]},{title:bilingual('制作与声音','Making and sound'),body:bilingual('校音连接器物制作与音乐表现。下方试听为合成音色示意。','Tuning connects making to musical expression. The listening study uses a synthesised tone.'),position:[0,.91,.15]}]},
  opera:{id:'opera',number:'04',title:bilingual('乡音入戏','Voices on stage'),name:bilingual('戏曲与影像','Opera and moving images'),heritage:bilingual('荆州花鼓戏','Jingzhou flower-drum opera'),region:bilingual('江汉平原','Jianghan Plain'),poster:'assets/opera.svg',color:'#a34432',description:bilingual('看一段戏，听一声乡音，把器物之外的表演也带进展厅。','Watch a scene and hear a local voice: performance belongs in the gallery too.'),source:'https://www.ihchina.cn/project_details/13279.html',sourceTitle:bilingual('荆州花鼓戏','Jingzhou flower-drum opera'),process:[bilingual('认识剧目','Read the scene'),bilingual('听地方声腔','Listen to local voices'),bilingual('看人物表演','Watch the performance'),bilingual('回到文化背景','Explore its context')],processNote:bilingual('影像区沿用现有《三官堂》节选与署名；简化戏台仅作为展陈空间。','The media area uses the existing credited Sanguantang excerpt. The simple stage is a display setting.'),points:[{title:bilingual('剧目','Scene'),body:bilingual('现有影像为《三官堂》节选，保留片头署名。','The existing Sanguantang excerpt retains its opening credits.'),position:[0,.65,.3]},{title:bilingual('声腔','Voice'),body:bilingual('留意唱词的地方语言、节奏和人物情绪。','Listen to local speech, rhythm and the character’s emotions.'),position:[-.35,.49,.25]},{title:bilingual('表演','Performance'),body:bilingual('让视频承载表演，三维舞台提供观察和导览入口。','Video carries the performance; the 3D stage provides a place to explore.'),position:[.35,.49,.25]}]}
};

export const studyAssets=Object.fromEntries(themeOrder.map(id=>[id,{id:`${id}-study`,themeId:id,kind:'study',title:bilingual(id==='opera'?'戏台展陈示意':'器形观察示意',id==='opera'?'Stage display study':'Form study'),scope:bilingual('网页原创几何示意','Original geometric study'),creator:bilingual('荆风楚韵 · 网页展陈','Jingchu Reverie · Web exhibition'),license:'Project study',url:null,sourceUrl:null,description:bilingual('用于观察与讲解，不对应具体文物或传承人作品。','An observation aid, not a specific artefact or a maker’s documented work.')} ]));

// Open model records are kept separate from the heritage subjects they illustrate.
const comparisonPoints=[
  {title:bilingual('整体造型','Overall form'),body:bilingual('先看完整轮廓，再从侧面比较各部分比例。模型依据官方三维数字化文件展示。','Study the outline, then compare the proportions from the side. This object uses the official digitisation file.'),position:[-.26,.73,.3]},
  {title:bilingual('表面细节','Surface details'),body:bilingual('缩放观察表面与装饰。数字化的光照和材质表现不等于原物在所有环境中的观感。','Zoom in on the surface and decoration. Digital lighting and materials do not reproduce every viewing condition of the original.'),position:[.28,.44,.32]},
  {title:bilingual('藏品来处','Provenance'),body:bilingual('打开“来处”查看馆藏名称、年代、产地与开放许可。这件对照藏品不是湖北非遗项目的实物。','Open Provenance for the name, date, origin and licence. This comparison object is not a specimen of the Hubei heritage project.'),position:[-.15,.24,.3]}
];
export const openAssets=[
  {id:'smithsonian-baluster-vase',themeId:'pottery',kind:'open',title:bilingual('青花人物纹盖瓶','Blue-and-white baluster vase'),fullTitle:bilingual('青花人物纹盖瓶（五供之一）','Baluster vase, from a five-piece garniture'),scope:bilingual('中国陶瓷对照 · 非毛家窑实物','Chinese ceramic comparison · not Maojiayao'),creator:bilingual('原作者未署名；数字化：Smithsonian Institution','Maker unidentified; digitisation: Smithsonian Institution'),institution:'National Museum of Asian Art, Smithsonian Institution',date:bilingual('清康熙（1662—1722）','1662–1722; Kangxi reign, Qing dynasty'),origin:bilingual('中国江西景德镇','Jingdezhen, Jiangxi, China'),record:'F1980.191a-c',license:'CC0 1.0',licenseUrl:'https://creativecommons.org/publicdomain/zero/1.0/',url:'assets/museum/models/smithsonian-baluster-vase.glb',poster:'assets/museum/posters/smithsonian-baluster-vase.jpg',sourceUrl:'https://asia.si.edu/object/F1980.191a-c/',modelSource:'https://3d-api.si.edu/voyager/3d_package:d8c6393a-4ebc-11ea-b77f-2e728ce88125',bytes:947044,triangles:99999,points:comparisonPoints,description:bilingual('来自史密森尼国立亚洲艺术博物馆的景德镇瓷器。作为中国陶瓷造型与表面装饰的对照，保留其真实产地与馆藏身份。','A Jingdezhen porcelain object in the Smithsonian National Museum of Asian Art. Its original identity and origin are retained in this comparison of ceramic form and decoration.')},
  {id:'smithsonian-boshan-incense-burner',themeId:'chime',kind:'open',title:bilingual('嵌金银及宝石博山香炉','Inlaid Boshan incense burner'),fullTitle:bilingual('嵌金银及宝石博山香炉','Lidded incense burner (xianglu) with geometric decoration and narrative scenes'),scope:bilingual('中国青铜工艺对照 · 非编钟','Chinese bronze comparison · not a chime bell'),creator:bilingual('原作者未署名；数字化：Smithsonian Institution','Maker unidentified; digitisation: Smithsonian Institution'),institution:'National Museum of Asian Art, Smithsonian Institution',date:bilingual('西汉早期（约公元前2世纪）','ca. 2nd century BCE; Early Western Han dynasty'),origin:bilingual('中国河南或河北','Henan or Hebei, China'),record:'F1947.15a-b',license:'CC0 1.0',licenseUrl:'https://creativecommons.org/publicdomain/zero/1.0/',url:'assets/museum/models/smithsonian-boshan-incense-burner.glb',poster:'assets/museum/posters/smithsonian-boshan-incense-burner.jpg',sourceUrl:'https://asia.si.edu/object/F1947.15a-b/',modelSource:'https://3d-api.si.edu/voyager/3d_package:ce850625-2cf1-4c6f-9086-0d5845d9a664',bytes:1470208,triangles:100000,points:comparisonPoints,description:bilingual('来自史密森尼国立亚洲艺术博物馆的青铜香炉，以金、银及宝石镶嵌。用于观察中国青铜工艺的造型与表面细节，它不是编钟。','A bronze incense burner in the Smithsonian National Museum of Asian Art, with gold, silver and gemstone inlay. It illustrates form and surface in Chinese bronze craftsmanship; it is not a chime bell.')}
];
export const projectAssets=[{
  id:'user-original-chime',themeId:'chime',kind:'project',title:bilingual('青铜钟 · 原项目模型','Bronze bell · Project model'),fullTitle:bilingual('青铜钟 · 原项目模型','Bronze bell · Original project model'),scope:bilingual('原项目编钟模型 · 外观观察','Original project bell · Visual observation'),creator:bilingual('原项目素材；原始作者署名待补充','Original project asset; original creator credit to be completed'),license:bilingual('原始权利保留，不另授开放许可','Original rights retained; no additional open licence'),url:'assets/museum/models/user-original-chime-low.glb',highUrl:'assets/museum/models/user-original-chime-high.glb',poster:'assets/museum/posters/user-original-chime.jpg',bytes:2946372,highBytes:4688808,triangles:60000,highTriangles:120000,
  description:bilingual('从原项目编钟模型转换而来，保留钟体、表面纹饰与顶部双兽形钮。用于器形观察；不认定为某件具体出土文物，也不构成声学复原。','Converted from the original project model, retaining the body, decoration and paired-animal suspension. For visual observation; not identified as a specific excavated artefact or an acoustic reconstruction.')
}];
themes.chime.poster='assets/museum/posters/user-original-chime.jpg';
projectAssets[0].version='dcbd8e150cf8c282';projectAssets[0].highVersion='bec0022f1f50db6e';
// Align the original model's lower rim for display; source geometry is unchanged.
projectAssets[0].orientationQuaternion=[0.0062326888,0,-0.2206881482,0.9753245074];
projectAssets[0].exposure=.88;
openAssets[0].version='436d590a787e5ba6';openAssets[1].version='59ddfb7ee98f86b2';

const stoneSource='https://wlt.hubei.gov.cn/hbsfwzwhycw/bhcc/fydt/hss/202005/t20200525_2295689.shtml';
themes.stone={id:'stone',exhibitId:'hb-1931',number:'03',title:bilingual('石上生花','Stories in stone'),name:bilingual('石雕 · 圆雕','Stone · Sculpture'),heritage:bilingual('石雕（大冶石雕）','Daye stone carving'),region:bilingual('黄石 · 大冶','Daye · Huangshi'),color:'#9a8f7d',description:bilingual('绕着雕刻走一圈，看轮廓、体量与一锤一錾留下的层次。','Explore outline, volume and the depth shaped by hammer and chisel.'),source:stoneSource,sourceTitle:bilingual('湖北省非遗保护中心 · 大冶石雕','Hubei Heritage Centre · Daye stone carving'),process:[bilingual('认识石材','Read the stone'),bilingual('观察体量','Explore volume'),bilingual('辨认层次','Observe depth'),bilingual('理解题材','Consider the subject')],processNote:bilingual('大冶石雕的地方技艺见湖北官方专题。这里的响堂山馆藏用于雕刻观察，保留其河北产地与真实馆藏身份。','Read the official Hubei source for Daye’s local craft. The Xiangtangshan comparison retains its Hebei origin and museum identity.'),points:comparisonPoints};
themes.relief={...themes.stone,id:'relief',number:'04',title:bilingual('一壁生境','A world in relief'),name:bilingual('石雕 · 浮雕','Stone · Relief'),description:bilingual('走近一面高浮雕，在前景与背景之间寻找空间关系。','Explore a carved surface and the space between foreground and background.')};
themes.chime.number='02';

openAssets.push(...[
  {
    "id": "smithsonian-winged-monster",
    "themeId": "stone",
    "kind": "open",
    "title": {
      "zh": "跪姿翼兽",
      "en": "Kneeling winged monster"
    },
    "fullTitle": {
      "zh": "跪姿翼兽·响堂山石雕",
      "en": "Kneeling winged monster"
    },
    "scope": {
      "zh": "中国石雕工艺对照 · 河北响堂山",
      "en": "Chinese stone-carving comparison · Xiangtangshan, Hebei"
    },
    "creator": {
      "zh": "原作者未署名；数字化：Smithsonian Institution",
      "en": "Original sculptor unidentified; digitization: Smithsonian Institution"
    },
    "institution": "National Museum of Asian Art, Smithsonian Institution",
    "date": {
      "zh": "北齐（550—577）",
      "en": "550-577; Period of Division, Northern Qi dynasty"
    },
    "origin": {
      "zh": "中国河北 · 北响堂山",
      "en": "Northern Xiangtangshan, Middle Cave, Hebei province, China"
    },
    "record": "F1916.345",
    "license": "CC0 1.0",
    "licenseUrl": "https://creativecommons.org/publicdomain/zero/1.0/",
    "url": "assets/museum/models/smithsonian-winged-monster.glb",
    "poster": "assets/museum/posters/smithsonian-winged-monster.jpg",
    "sourceUrl": "https://asia.si.edu/object/F1916.345/",
    "modelSource": "https://3d-api.si.edu/voyager/3d_package:0dc68216-3651-44c7-99cf-18e5d4d1eb9f",
    "bytes": 2089400,
    "triangles": 100000,
    "version": "1fd82dcc69cba007",
    "displayType": "sculpture",
    "exposure": 1,
    "description": {
      "zh": "北齐响堂山的石灰石圆雕，保留兽首、羽翼与蹲踞姿态的雕刻细节。结合大冶石雕专题，观察圆雕怎样组织体量与轮廓。",
      "en": "A Northern Qi limestone sculpture from Xiangtangshan. Observe its head, wings and crouching pose alongside the Daye stone-carving entry."
    }
  },
  {
    "id": "smithsonian-amitabha-relief",
    "themeId": "relief",
    "kind": "open",
    "title": {
      "zh": "西方净土高浮雕",
      "en": "Amitabha Pure Land relief"
    },
    "fullTitle": {
      "zh": "西方净土浮雕·响堂山石雕",
      "en": "Western Paradise of the Buddha Amitabha"
    },
    "scope": {
      "zh": "中国石雕工艺对照 · 河北响堂山",
      "en": "Chinese stone-carving comparison · Xiangtangshan, Hebei"
    },
    "creator": {
      "zh": "原作者未署名；数字化：Smithsonian Institution",
      "en": "Original sculptor unidentified; digitization: Smithsonian Institution"
    },
    "institution": "National Museum of Asian Art, Smithsonian Institution",
    "date": {
      "zh": "北齐（550—577）",
      "en": "550-577; Northern Qi dynasty"
    },
    "origin": {
      "zh": "中国河北 · 南响堂山",
      "en": "southern Xiangtangshan, Cave 2, Hebei province, China"
    },
    "record": "F1921.2",
    "license": "CC0 1.0",
    "licenseUrl": "https://creativecommons.org/publicdomain/zero/1.0/",
    "url": "assets/museum/models/smithsonian-amitabha-relief.glb",
    "poster": "assets/museum/posters/smithsonian-amitabha-relief.jpg",
    "sourceUrl": "https://asia.si.edu/object/F1921.2/",
    "modelSource": "https://3d-api.si.edu/voyager/3d_package:727b4bb6-ce87-40de-b07d-d492c1404221",
    "bytes": 2485428,
    "triangles": 149967,
    "version": "54f988525bf44d9c",
    "displayType": "relief",
    "exposure": 1,
    "description": {
      "zh": "北齐响堂山石灰石高浮雕，以多层人物与建筑构成丰富空间。结合大冶石雕专题，比较雕刻深浅与画面层次。",
      "en": "A Northern Qi limestone relief from Xiangtangshan, with layered figures and architecture. Explore carved depth alongside the Daye stone-carving entry."
    }
  }
]);
openAssets.find(a=>a.id==='smithsonian-boshan-incense-burner').curated=false;

for(const asset of [...projectAssets,...openAssets]){const lod=[{"parentModelUrl":"assets/museum/models/user-original-chime-low.glb","url":"assets/museum/models/user-original-chime-low-room.glb","version":"f3539e742ed088c0"},{"parentModelUrl":"assets/museum/models/smithsonian-baluster-vase.glb","url":"assets/museum/models/smithsonian-baluster-vase-room.glb","version":"e23805aa99f5bc88"},{"parentModelUrl":"assets/museum/models/smithsonian-boshan-incense-burner.glb","url":"assets/museum/models/smithsonian-boshan-incense-burner-room.glb","version":"e5c7b6d21afd6bf4"},{"parentModelUrl":"assets/museum/models/smithsonian-winged-monster.glb","url":"assets/museum/models/smithsonian-winged-monster-room.glb","version":"e34bf3ad77d6a23a"},{"parentModelUrl":"assets/museum/models/smithsonian-amitabha-relief.glb","url":"assets/museum/models/smithsonian-amitabha-relief-room.glb","version":"21494cce112f69bc"}].find(item=>item.parentModelUrl===asset.url);if(lod){asset.roomUrl=lod.url;asset.roomVersion=lod.version;}}
projectAssets[0].title=bilingual('青铜钟','Bronze bell');projectAssets[0].fullTitle=projectAssets[0].title;projectAssets[0].description=bilingual('钟身饰有凸起纹饰与纹带，顶部为双兽形钮。从正面与侧面细看器形和表面细节。','Raised decoration and bands cover the bell, with a paired-animal suspension above. Explore its form and surface from different sides.');projectAssets[0].relatedEntry='chime';
const vase=openAssets.find(a=>a.id==='smithsonian-baluster-vase');vase.title=bilingual('青花瓷瓶','Blue-and-white porcelain vase');vase.description=bilingual('青花纹饰环绕瓶身，细颈与丰肩形成修长轮廓。','Blue-and-white decoration surrounds the slender neck and broad shoulders.');
openAssets.find(a=>a.id==='smithsonian-winged-monster').description=bilingual('石灰石圆雕，兽首、羽翼与蹲踞的身体构成完整造型。','A limestone sculpture with a carefully carved head, wings and crouching body.');
openAssets.find(a=>a.id==='smithsonian-amitabha-relief').description=bilingual('石灰石高浮雕，群像、建筑与龛室分层展开。','Figures, architecture and niches unfold across several carved layers.');

themes.pottery.process=[bilingual('器形','Form'),bilingual('青花','Blue decoration'),bilingual('釉面','Glaze'),bilingual('纹饰','Motifs')];


const p=(zh,en,bodyZh,bodyEn,position)=>({title:bilingual(zh,en),body:bilingual(bodyZh,bodyEn),position});
vase.points=[p('瓶口与颈部','Rim and neck','留意瓶口的收放，以及颈部与肩部的过渡。','Observe the rim and the transition from neck to shoulders.',[0,.88,.32]),p('青花纹饰','Blue decoration','沿瓶身转动，观察纹饰如何围绕器形展开。','Turn the vase to follow its decoration around the form.',[.28,.53,.42]),p('瓶足','Foot','从较低视角观察瓶足与器身的比例。','Use a lower angle to compare the foot and body.',[-.2,.12,.32])];
themes.chime.points=[p('钟体轮廓','Bell outline','比较正面与侧面的轮廓，留意器口与悬挂位置。','Compare the front and side outlines, mouth and suspension.',[-.27,.56,.3]),p('钟身纹饰','Surface decoration','细看凸起纹饰与纹带之间的疏密和层次。','Look closely at the spacing and depth of the raised decoration and bands.',[.28,.4,.4]),p('双兽形钮','Paired-animal suspension','观察顶部形象的连接与转折。','Explore the joined forms at the top of the bell.',[0,.91,.18])];
openAssets.find(a=>a.id==='smithsonian-winged-monster').points=[p('兽首','Head','从侧前方看头部与身体的关系。','View the relationship between head and body from a front-side angle.',[.12,.81,.32]),p('羽翼','Wings','留意羽翼的轮廓与层叠线条。','Follow the wing outlines and layered lines.',[-.32,.52,.3]),p('蹲踞姿态','Crouching pose','比较前后肢如何支撑整体体量。','Compare how the limbs support the overall volume.',[.2,.19,.3])];
openAssets.find(a=>a.id==='smithsonian-amitabha-relief').points=[p('中央群像','Central figures','观察中央形象与两侧人物形成的主次。','Look at the hierarchy of central and surrounding figures.',[0,.57,.5]),p('前后层次','Carved depth','从侧面看人物与背景的高低差。','Use a side view to explore differences in carved depth.',[-.3,.35,.5]),p('建筑与龛室','Architecture and niches','沿着顶部与两侧，寻找画面的空间线索。','Follow the upper and side details to read the spatial structure.',[.3,.8,.5])];

export const modelAssets=[...projectAssets,...openAssets];
for(const id of themeOrder){const first=assetsFor(id)[0];if(first?.poster)themes[id].poster=first.poster;}
export const roomExhibits=themeOrder.map(themeId=>({themeId,asset:assetsFor(themeId)[0]}));
export function assetsFor(themeId){const selected=[...projectAssets.filter(asset=>asset.themeId===themeId),...openAssets.filter(asset=>asset.themeId===themeId&&asset.curated!==false)];return selected.length?selected:[studyAssets[themeId]].filter(Boolean);}
export function themeForExhibit(id){if(id==='wood')return 'stone';return themeOrder.find(theme=>theme===id||themes[theme].exhibitId===id);}
export function museumHref({exhibit,mode,lang='zh',asset}={}){const url=new URL(exhibit==='opera'?'index.html':'museum.html',import.meta.url);if(exhibit==='opera')url.hash='media';const theme=themeForExhibit(exhibit);if(theme)url.searchParams.set('exhibit',theme);if(mode==='room')url.searchParams.set('view','room');url.searchParams.set('lang',lang==='en'?'en':'zh');if(asset&&/^[a-z0-9-]+$/i.test(asset))url.searchParams.set('asset',asset);return url.href;}
