import type {Question} from '../types/game';
import {QUESTIONS} from '../data/questions';
export const isCorrectAnswer=(q:Question,answerId:string)=>q.correctId===answerId;
export function pickGameQuestions(random=Math.random):Question[]{
 const selected=['easy','medium','hard'].flatMap(d=>{const pool=QUESTIONS.filter(q=>q.difficulty===d);const copy=[...pool];for(let i=copy.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[copy[i],copy[j]]=[copy[j],copy[i]];}return copy.slice(0,5);});
 return selected.map(q=>{const answers=[...q.answers];for(let i=answers.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[answers[i],answers[j]]=[answers[j],answers[i]];}return {...q,answers:answers.map((a,i)=>({...a,id:['A','B','C','D'][i]})),correctId:['A','B','C','D'][answers.findIndex(a=>a.id===q.correctId)]};});
}
export function fiftyOptions(q:Question,random=Math.random):string[]{const wrong=q.answers.filter(a=>a.id!==q.correctId);const keep=wrong[Math.floor(random()*wrong.length)]!;return [q.correctId,keep.id];}
export function audiencePoll(q:Question,allowed:string[],random=Math.random):Record<string,number>{
 const active=q.answers.map(a=>a.id).filter(id=>allowed.includes(id)); const votes=active.map(()=>2+Math.floor(random()*8));const correctIndex=active.indexOf(q.correctId);const boost=q.difficulty==='easy'?30:q.difficulty==='medium'?12:0;
 if(correctIndex>=0)votes[correctIndex]=(votes[correctIndex]??0)+boost;const total=votes.reduce((a,b)=>a+b,0)||1;const percentages=votes.map(v=>Math.floor(v*100/total));let remainder=100-percentages.reduce((a,b)=>a+b,0);for(let i=0;remainder>0;i=(i+1)%percentages.length,remainder--)percentages[i]!++;
 return Object.fromEntries(active.map((id,i)=>[id,percentages[i]??0]));
}
