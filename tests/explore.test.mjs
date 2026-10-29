import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {exhibits,fullQuestions,filterCollection} from '../dist/content.mjs';
import {normalizeJourney,moveStop} from '../dist/journey.mjs';
import {normalizeProgress,scoreQuiz} from '../dist/learning.mjs';
import {mapProjection} from '../dist/explore.mjs';
import {sceneMessage} from '../dist/player.mjs';

test('expanded catalog preserves only three available 3D objects',()=>{assert.equal(exhibits.length,146);assert.deepEqual(exhibits.filter(i=>i.scene).map(i=>i.scene),[2,3,4]);assert.equal(new Set(fullQuestions.map(i=>i.id)).size,10);});
test('city, category, search and saved favorites intersect correctly',()=>{assert.deepEqual(filterCollection(exhibits,{city:'宜昌市',category:'传统音乐',favoritesOnly:true,favorites:['music']}).map(i=>i.id),['music']);assert.equal(filterCollection(exhibits,{city:'宜昌市',category:'传统美术'}).length,0);assert.equal(filterCollection(exhibits,{favoritesOnly:true,favorites:[]}).length,0);});
test('route sanitation and movement preserve unique valid stops',()=>{assert.deepEqual(normalizeJourney({route:['wood','wood','bad','chime'],favorites:['opera',null]}),{version:1,route:['wood','chime'],favorites:['opera']});assert.deepEqual(moveStop(['wood','chime'],'chime',-1),['chime','wood']);assert.deepEqual(moveStop(['wood','chime'],'wood',-1),['wood','chime']);assert.deepEqual(moveStop(['wood'],'absent',1),['wood']);});
test('v0.2 reading and last quiz survive migration',()=>{const next=normalizeProgress({version:1,read:['wood'],lastQuiz:{answers:{material:0,woodgrain:0,tuning:2},score:3}});assert.deepEqual(next.read,['wood']);assert.equal(next.lastQuiz.total,3);assert.equal(next.lastQuiz.score,3);});
test('ten-question records recalculate scores and cap history',()=>{const answers=Object.fromEntries(fullQuestions.map(q=>[q.id,q.answer]));const raw={answers,questionIds:fullQuestions.map(q=>q.id),score:999,completedAt:'2026-10-29T01:00:00Z'};const next=normalizeProgress({lastQuiz:raw,attempts:Array(25).fill(raw)});assert.equal(next.lastQuiz.score,10);assert.equal(next.lastQuiz.total,10);assert.equal(next.attempts.length,20);assert.equal(scoreQuiz(answers,fullQuestions).score,10);});
test('map projection handles local MultiPolygon boundaries without invalid geometry',()=>{const geo=JSON.parse(readFileSync(new URL('../dist/assets/hubei.geojson',import.meta.url),'utf8'));assert.equal(geo.features.length,17);const project=mapProjection(geo.features);for(const feature of geo.features){const [x,y]=project(feature.properties.center);assert.ok(Number.isFinite(x)&&Number.isFinite(y));assert.ok(x>=0&&x<=800&&y>=0&&y<=510);}});
test('scene commands use verified existing methods and reject unsupported indices',()=>{assert.equal(sceneMessage(2),'OnLoginButtonClick2');assert.equal(sceneMessage('5'),'OnLoginButtonClick5');assert.equal(sceneMessage(0),null);assert.equal(sceneMessage('injection'),null);});
