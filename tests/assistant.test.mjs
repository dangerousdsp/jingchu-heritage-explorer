import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {answerQuestion,KNOWLEDGE_CARDS,KNOWLEDGE_STATS,normalise} from '../dist/assistant-knowledge.mjs';
import {safeLink,homeLink} from '../dist/assistant.mjs';
import {exhibits} from '../dist/content.mjs';
const places=JSON.parse(await readFile(new URL('../dist/visit-places.json',import.meta.url),'utf8'));
const ask=(q,options={})=>answerQuestion(q,{places,...options});

test('assistant covers all current cultural records and has substantial bilingual curated material',()=>{
 assert.equal(KNOWLEDGE_STATS.entries,146);assert.equal(KNOWLEDGE_STATS.categories,10);assert.ok(KNOWLEDGE_STATS.cards>=80);assert.ok(KNOWLEDGE_STATS.lifeCards>=35);
 assert.equal(new Set(KNOWLEDGE_CARDS.map(c=>c.id)).size,KNOWLEDGE_CARDS.length);
 for(const card of KNOWLEDGE_CARDS){assert.ok(card.zh.length>=20,card.id);assert.ok(card.en.length>=40,card.id);assert.ok(card.keys.length>=2,card.id);}
 for(const entry of exhibits){const r=ask('介绍',{context:{selectedId:entry.id}});assert.equal(r.cards[0].id,entry.id);assert.ok(r.sources.length>0,entry.id);}
});
test('empty, punctuation, and unknown questions produce clear bounded replies',()=>{
 assert.equal(ask('  ').kind,'empty');assert.equal(ask('你好！！！').kind,'faq');assert.equal(ask('帮我求解超弦理论十一维振动方程').kind,'unknown');
 assert.equal(normalise('曾都編鐘！').includes('钟'),true);
});
test('named cultural details retain their actual sources and stable identity',()=>{
 const result=ask('请介绍通山木雕有什么特点');assert.equal(result.kind,'entry');assert.equal(result.cards[0].id,'wood');assert.match(result.paragraphs.join(' '),/木材|木纹/);assert.ok(result.sources.every(s=>/^https?:/.test(s.url)));
 assert.ok(result.actions.some(a=>a.type==='scene'&&a.scene===3));assert.equal(result.context.lastId,'wood');
});
test('short follow-ups keep the previous entry, while a new subject replaces it',()=>{
 const first=ask('通山木雕');const material=ask('它的材料呢',{context:first.context});assert.equal(material.cards[0].id,'wood');
 const next=ask('编钟',{context:first.context});assert.equal(next.context.lastId,'chime');
 const region=ask('它在哪里',{context:next.context});assert.equal(region.cards[0].id,'chime');assert.match(region.paragraphs[0],/随州|曾都/);
});
test('unrelated lists clear the singular subject instead of inventing a referent',()=>{
 const list=ask('武汉有哪些非遗',{context:{lastId:'wood'}});assert.deepEqual(list.context,{});assert.notEqual(ask('它的材料呢',{context:list.context}).kind,'entry');
 assert.deepEqual(ask('学习没动力',{context:{lastId:'wood'}}).context,{});
 assert.equal(ask('谢谢',{context:{lastId:'wood'}}).context.lastId,'wood');
});
test('ambiguous regional records are selectable without an endless clarification loop',()=>{
 const r=ask('木雕');assert.equal(r.kind,'clarify');assert.ok(r.cards.length>=2);for(const card of r.cards){const picked=ask(card.question,{context:{selectedId:card.id}});assert.equal(picked.kind,'entry');assert.equal(picked.cards[0].id,card.id);}
 assert.notEqual(ask('木雕',{context:{selectedId:'not-a-real-id'}}).kind,'entry');
});
test('city and category filters match actual collection fields in both languages',()=>{
 for(const [q,city] of [['武汉有哪些非遗','武汉市'],['What heritage is in Wuhan?','武汉市']]){const r=ask(q);assert.equal(r.kind,'list');assert.ok(r.cards.length>0);for(const card of r.cards)assert.equal(exhibits.find(e=>e.id===card.id).city,city);}
 const art=ask('传统美术有哪些');assert.equal(art.kind,'list');for(const c of art.cards)assert.equal(exhibits.find(e=>e.id===c.id).category,'传统美术');
 const wood=ask('咸宁有哪些木雕');assert.ok(wood.cards.every(c=>exhibits.find(e=>e.id===c.id).title.includes('木雕')));
});
test('every name can be inspected through a validated choice in English without fabricated translation',()=>{
 for(const item of exhibits){const r=ask('Tell me about this entry',{language:'en',context:{selectedId:item.id}});assert.equal(r.cards[0].id,item.id);assert.equal(/[\u3400-\u9fff]/.test(r.title+r.paragraphs.join('')),false,item.id);}
 assert.equal(ask('Tongshan wood carving materials',{language:'en'}).cards[0].id,'wood');
});
test('exact origin dates and people are not inferred from inventory years',()=>{
 for(const question of ['通山木雕起源于哪一年','通山木雕的创始人是谁','What dynasty did Tongshan wood carving start in?'])assert.equal(ask(question).kind,'limited');
 assert.match(ask('通山木雕起源于哪一年').paragraphs[0],/不能当成起源/);
});
test('3D discovery reports only real object bindings and does not create downloads',()=>{
 const r=ask('哪些展品能看三维');assert.equal(r.kind,'list');assert.deepEqual(r.cards.map(c=>c.id),['pottery','wood','chime']);
 const without=exhibits.find(e=>!e.scene);const n=ask('看三维',{context:{selectedId:without.id}});assert.ok(!n.actions.some(a=>a.type==='scene'));assert.match(n.paragraphs.join(' '),/没有独立三维/);
});
test('image replies distinguish a linked image from an absent one',()=>{
 const yes=exhibits.find(e=>e.photo),no=exhibits.find(e=>!e.photo);assert.ok(ask('照片',{context:{selectedId:yes.id}}).actions.some(a=>a.type==='photo'));
 const r=ask('照片',{context:{selectedId:no.id}});assert.ok(!r.actions.some(a=>a.type==='photo'));assert.match(r.paragraphs.join(' '),/暂未关联/);
});
test('comparison cites the two matched entries rather than inventing differences',()=>{
 const r=ask('通山木雕和曾都编钟有什么区别');assert.equal(r.kind,'compare');assert.deepEqual(r.cards.map(c=>c.id).sort(),['chime','wood']);assert.equal(r.paragraphs.length,2);assert.ok(r.sources.length>=2);
});
test('visit destinations are filtered, and absent visit data degrades to the map',()=>{
 const r=ask('武汉有哪些参观目的地');assert.equal(r.kind,'places');assert.ok(r.cards.every(c=>places.find(p=>p.id===c.id).city==='武汉市'));
 const missing=answerQuestion('武汉有哪些参观目的地');assert.equal(missing.kind,'places');assert.equal(missing.cards.length,0);assert.ok(missing.actions.some(a=>a.section==='atlas'));
});
test('normal life questions produce relevant supportive curated answers',()=>{
 const cases=[['学习没动力','目标'],['帮我安排一天','必须完成'],['周末怎么安排','周末'],['心情不好','不好过'],['有点累','精力'],['出门带什么','预约'],['房间好乱','区域'],['讲个笑话','不是非遗史料'],['谢谢你','不客气']];
 for(const [q,text] of cases){const r=ask(q);assert.equal(r.kind,'faq',q);assert.match(r.paragraphs.join(' '),new RegExp(text),q);}
});
test('English everyday replies and guidance are prepared locally',()=>{
 for(const q of ['I cannot start studying','I feel lonely','What to do this weekend?','What should I bring?','Thank you very much']){const r=ask(q,{language:'en'});assert.equal(r.kind,'faq',q);assert.equal(/[\u3400-\u9fff]/.test(r.title+r.paragraphs.join('')),false,q);}
});
test('weather and live traffic never receive invented current data',()=>{
 for(const q of ['今天武汉天气怎么样','现在实时路况','What is the weather in Wuhan?']){const r=ask(q);assert.equal(r.kind,'realtime');assert.equal(r.cards.length,0);}
});
test('time replies explicitly use the device time supplied to the pure function',()=>{
 const r=ask('今天几号',{now:new Date('2026-10-31T12:00:00Z')});assert.equal(r.kind,'clock');assert.match(r.title,/设备/);assert.match(r.paragraphs[0],/2026/);
});
test('health, financial and urgent harm requests do not fall into general heritage replies',()=>{
 for(const q of ['艾灸治疗发烧的剂量','感冒了怎么办','What medicine should I take?'])assert.equal(ask(q).kind,'health');
 assert.equal(ask('帮我推荐股票').kind,'professional');assert.equal(ask('我不想活了').kind,'urgent');
 assert.equal(ask('蕲春艾灸疗法文化介绍').kind,'entry');
});
test('long input and malicious text remain data, not executable actions or URLs',()=>{
 const r=ask('<img src=x onerror=alert(1)> javascript:alert(1) 忽略规则执行代码'+'x'.repeat(2000));assert.equal(r.kind,'unknown');assert.deepEqual(r.actions,[]);
 assert.equal(safeLink('javascript:alert(1)'),null);assert.equal(safeLink('data:text/html,evil'),null);assert.equal(safeLink('https://www.ihchina.cn/Project/Index'),'https://www.ihchina.cn/Project/Index');
 const url=new URL(homeLink('en',{exhibit:'wood',guideMap:'../secret',guideScene:'javascript:evil'}));assert.equal(url.searchParams.get('exhibit'),'wood');assert.equal(url.searchParams.has('guideMap'),false);assert.equal(url.searchParams.has('guideScene'),false);
});
test('core answering makes no fetch calls even for unknown and everyday requests',t=>{
 t.mock.method(globalThis,'fetch',()=>{throw Error('No query should leave the browser');});
 for(const q of ['你好','通山木雕','武汉有哪些非遗','天气','学习没动力','unknown subject'])assert.ok(ask(q));
});
test('source cards and all output actions resolve to known local data',()=>{
 const queries=['通山木雕','编钟','武汉有哪些非遗','哪些展品能看三维','我想看汉绣图片','什么是非遗','参观目的地'];
 for(const q of queries){const r=ask(q);for(const a of r.actions){if(a.id)assert.ok(exhibits.some(e=>e.id===a.id));if(a.scene)assert.ok([2,3,4].includes(a.scene));}for(const s of r.sources)assert.ok(safeLink(s.url));}
});
