// Keep cultural content separate from navigation and runtime code.
export const exhibits = [
  { id: 'pottery', number: '01', title: '竹溪毛家窑', subtitle: '泥土成器，烟火成诗。', category: '传统技艺', region: '十堰 · 竹溪', image: 'assets/pottery.webp', alt: '原项目中的毛家窑陶器模型', description: '以一件陶器为入口，观察器形与表面质感，认识与日常生活相连的陶器烧制技艺。', detail: '毛家窑是原项目收录的竹溪陶器主题。这个展品保留了陶器模型的轮廓与表面质感，你可以先观察口沿、器颈与器腹的关系，再进入三维展示旋转细看。器物的外形之外，制陶技艺也与当地的日常器用和生活记忆相连。', observations: ['看看器口、器颈与器腹的比例。', '比较模型表面在不同光线下的变化。', '想一想：一种器形可以怎样服务日常生活？'], sourceNote: '外观图来自原项目模型演示；文化背景参考下列资料。', sources: [{title:'人民论坛网 · 龙坝镇毛家窑陶文化考察与思考',url:'https://www.rmlt.com.cn/2018/1023/531042.shtml'}] },
  { id: 'wood', number: '02', title: '通山木雕', subtitle: '循着木纹，读一段故事。', category: '传统美术', region: '咸宁 · 通山', image: 'assets/wood.webp', alt: '原项目中的通山木雕模型', description: '从木材的纹理与雕刻的层次出发，看传统题材如何在一块木头上展开。', detail: '通山木雕流传于湖北通山及周边地区。其技艺善于利用木材自身的纹理与色彩，以浮雕等多种手法组织画面，题材与传统戏曲、民间故事和生活场景密切相关。观察一件木雕时，可以沿着前景与背景的关系，寻找雕刻如何形成空间层次。', observations: ['观察浮雕的深浅与前后层次。', '留意木材纹理如何参与画面。', '寻找构图中的人物、景物与故事线索。'], sourceNote: '文化内容据国家级非遗项目页面概述；预览模型沿用原项目。', sources: [{title:'中国非物质文化遗产网 · 木雕（通山木雕）',url:'https://www.ihchina.cn/project_details/14141/'}] },
  { id: 'chime', number: '03', title: '曾都编钟', subtitle: '铸一器青铜，听一声回响。', category: '传统技艺', region: '随州 · 曾都', image: 'assets/chime.webp', alt: '原项目中的青铜编钟模型', description: '从青铜的造型，到铸造与校音，认识器物工艺和音乐表现的相遇。', detail: '青铜编钟制作技艺以铜、锡、铅等为材料，涉及制模、铸造、修整与校音等工序。它把金属造型与音乐表现联系在一起。原项目中的编钟模型可作为外观观察入口；模型展示与音乐欣赏并不等同于对真实文物声学特性的复原。', observations: ['观察钟体轮廓与表面纹饰。', '想一想：造型、材料与声音有怎样的关系？', '认识“校音”在编钟制作过程中的作用。'], sourceNote: '文化内容据国家级非遗项目页面概述；预览模型沿用原项目。', sources: [{title:'中国非物质文化遗产网 · 青铜编钟制作技艺',url:'https://www.ihchina.cn/project_details/23564/'}] }
];

// Reference topics from the original proposal; no missing 3D asset is implied.
exhibits.push(
  {id:'opera',number:'04',title:'荆州花鼓戏',subtitle:'乡音入戏，唱出江汉烟火。',category:'传统戏剧',region:'潜江 · 江汉平原',city:'潜江市',image:'assets/opera.svg',alt:'花鼓戏专题图形',description:'从地方声腔与表演出发，认识扎根江汉平原的乡土戏曲。',detail:'荆州花鼓戏是湖北地方剧种之一，由江汉平原的民间演唱形式吸收其他剧种的声腔、剧目与表演逐渐发展而来。认识这一剧种，可以先留意语言、节奏和人物表演之间的关系，再通过剧目内容理解它与地方生活的联系。',observations:['留意唱词的地方语言特点。','观察人物如何通过动作和节奏表达情绪。','比较戏曲表演与日常说话的不同。'],sourceNote:'据国家级非遗项目页面概述；花鼓戏视频沿用原项目，具体剧目尚待核实。',sources:[{title:'中国非物质文化遗产网 · 荆州花鼓戏',url:'https://www.ihchina.cn/project_details/13279.html'}]},
  {id:'lacquer',number:'05',title:'楚式漆器髹饰技艺',subtitle:'以漆为色，以木为骨。',category:'传统技艺',region:'荆州',city:'荆州市',image:'assets/lacquer.svg',alt:'楚式漆器专题图形',description:'从木胎、榫卯和彩绘，走近楚式漆器的造型与装饰。',detail:'楚式漆器髹饰技艺在荆州地区传承。制作中涉及选料、雕刻、榫卯成型、髹漆与彩绘等工序，榫卯组合与丰富的图饰是值得观察的特点。认识一件漆器，可以同时关注器物结构、漆层与纹饰，而不只停留在表面的色彩。',observations:['区分器物结构与表面装饰。','认识榫卯组合在制作中的作用。','留意漆色与纹饰如何共同组织画面。'],sourceNote:'据国家级非遗项目页面概述；专题图形不是具体文物复原。',sources:[{title:'中国非物质文化遗产网 · 楚式漆器髹饰技艺',url:'https://www.ihchina.cn/project_details/14549/'}]},
  {id:'music',number:'06',title:'宜昌丝竹',subtitle:'丝弦与竹管，合一曲细乐。',category:'传统音乐',region:'宜昌 · 夷陵',city:'宜昌市',image:'assets/music.svg',alt:'宜昌丝竹专题图形',description:'从民间器乐合奏，认识宜昌地方音乐的声部与配合。',detail:'宜昌丝竹亦称“细乐”，是宜昌民间器乐的代表体裁，主要流行于夷陵区等地。理解器乐合奏时，可以从不同声部如何进入、呼应与衬托来听，也可以将乐曲的节奏与地方生活场景联系起来。',observations:['留意不同声部的进入与呼应。','区分旋律与伴奏的作用。','想一想：合奏如何形成共同的节奏？'],sourceNote:'据国家级非遗项目页面概述；尚未配置经核实的独立录音。',sources:[{title:'中国非物质文化遗产网 · 宜昌丝竹',url:'https://www.ihchina.cn/project_details/12549'}]}
);
Object.assign(exhibits[0],{city:'十堰市',scene:2});
Object.assign(exhibits[1],{city:'咸宁市',scene:3});
Object.assign(exhibits[2],{city:'随州市',scene:4});

export const questions = [
  {id:'material',title:'毛家窑主题的展品，主要让我们认识哪类器物？',options:['陶器','木器','铜器'],answer:0,explanation:'这件展品以陶器为入口。你可以从器形和表面质感观察制陶与生活的联系。',exhibitId:'pottery'},
  {id:'woodgrain',title:'欣赏通山木雕时，哪项是值得观察的技艺特征？',options:['木纹与浮雕层次','玻璃透光效果','金属校音方式'],answer:0,explanation:'通山木雕利用木材自身纹理与色彩，并通过浮雕等手法组织层次。',exhibitId:'wood'},
  {id:'tuning',title:'哪道工序体现了编钟制作与音乐表现的联系？',options:['纸张装订','织物染色','校音'],answer:2,explanation:'校音是编钟制作的重要工序，将器物制作与音高、音色等音乐表现联系起来。',exhibitId:'chime'}
];

export const fullQuestions = [...questions,
  {id:'opera-region',title:'荆州花鼓戏与哪一地区的民间演唱联系密切？',options:['江汉平原','青藏高原','珠江三角洲'],answer:0,explanation:'荆州花鼓戏在江汉平原民间演唱形式的基础上发展，具有鲜明的地方生活气息。',exhibitId:'opera'},
  {id:'lacquer-structure',title:'哪项是楚式漆器制作中值得关注的结构特点？',options:['玻璃吹制','榫卯组合','羊毛毡制'],answer:1,explanation:'榫卯组合是楚式漆器的特色之一。',exhibitId:'lacquer'},
  {id:'music-alias',title:'宜昌丝竹还被称为什么？',options:['大歌','高腔','细乐'],answer:2,explanation:'宜昌丝竹亦称“细乐”，是宜昌民间器乐的代表体裁。',exhibitId:'music'},
  {id:'wood-type',title:'通山木雕属于哪类非遗？',options:['传统音乐','传统美术','传统体育'],answer:1,explanation:'木雕（通山木雕）属于传统美术。',exhibitId:'wood'},
  {id:'chime-process',title:'编钟制作只关注外观，不涉及校音。这一说法是否正确？',options:['正确','不正确'],answer:1,explanation:'编钟制作涉及校音，将金属工艺与音乐表现结合起来。',exhibitId:'chime'},
  {id:'pottery-observe',title:'观察陶器外形时，可以关注哪组部位？',options:['口沿、器颈与器腹','弓弦、琴码与琴弓','键盘、屏幕与触板'],answer:0,explanation:'口沿、器颈与器腹的比例能帮助我们认识器形。',exhibitId:'pottery'},
  {id:'craft-observe',title:'认识漆器时，只看颜色就能理解全部制作技艺。这一说法是否正确？',options:['正确','不正确'],answer:1,explanation:'还应关注木胎、结构、髹饰与纹样等方面。',exhibitId:'lacquer'}
];
export const quizModes={intro:questions,full:fullQuestions};

export function filterCollection(items,{category='all',query='',city='all',favoritesOnly=false,favorites=[]}={}) {
  return filterExhibits(items,category,query).filter(item=>(city==='all'||item.city===city)&&(!favoritesOnly||favorites.includes(item.id)));
}

export function filterExhibits(items, category = 'all', query = '') {
  const key = query.trim().toLocaleLowerCase('zh-CN');
  return items.filter(item => (category === 'all' || item.category === category) && `${item.title} ${item.region} ${item.category} ${item.description}`.toLocaleLowerCase('zh-CN').includes(key));
}
