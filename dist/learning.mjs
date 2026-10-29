import { exhibits, questions, fullQuestions } from './content.mjs';
export const STORAGE_KEY='jingchu-heritage.learning.v1'; // Preserve v0.2 records.
const byId=new Map(fullQuestions.map(q=>[q.id,q]));
export function scoreQuiz(answers,items=questions) {
  const details=items.map(q=>({id:q.id,correct:answers[q.id]===q.answer}));
  return {score:details.filter(q=>q.correct).length,total:items.length,details};
}
function normalizeQuiz(raw) {
  if(!raw||typeof raw!=='object')return null;
  const ids=Array.isArray(raw.questionIds)?[...new Set(raw.questionIds.filter(id=>byId.has(id)))]:questions.map(q=>q.id);
  if(!ids.length)return null;
  const items=ids.map(id=>byId.get(id));
  if(!items.every(q=>Number.isInteger(raw.answers?.[q.id])&&raw.answers[q.id]>=0&&raw.answers[q.id]<q.options.length))return null;
  const answers=Object.fromEntries(items.map(q=>[q.id,raw.answers[q.id]]));
  const result=scoreQuiz(answers,items);
  return {answers,questionIds:ids,score:result.score,total:result.total,completedAt:typeof raw.completedAt==='string'&&Number.isFinite(Date.parse(raw.completedAt))?raw.completedAt:null};
}
export function normalizeProgress(input) {
  const raw=input&&typeof input==='object'?input:{};
  const validIds=new Set(exhibits.map(item=>item.id));
  const read=[...new Set(Array.isArray(raw.read)?raw.read.filter(id=>validIds.has(id)):[])];
  const lastQuiz=normalizeQuiz(raw.lastQuiz);
  const attempts=(Array.isArray(raw.attempts)?raw.attempts:[]).map(normalizeQuiz).filter(Boolean).slice(-20);
  return {version:2,read,lastQuiz,attempts};
}
export function readProgress(storage) {
  try{return {data:normalizeProgress(JSON.parse(storage.getItem(STORAGE_KEY)||'null')),persistent:true};}
  catch{return {data:normalizeProgress(null),persistent:false};}
}
export function saveProgress(storage,data) {
  try{storage.setItem(STORAGE_KEY,JSON.stringify(normalizeProgress(data)));return true;}
  catch{return false;}
}
