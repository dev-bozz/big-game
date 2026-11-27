import {create} from 'zustand';
import type {EndReason,GameStatus,Lifeline,Question} from '../types/game';
import {pickGameQuestions} from '../utils/gameLogic';
import {lossPrize,PRIZES,securedPrize,walkawayPrize} from '../data/moneyLadder';

interface GameState {
 status:GameStatus;questions:Question[];index:number;selected:string|null;hidden:string[];used:Record<Lifeline,boolean>;
 secured:number;result:number;reason:EndReason|null;best:number;sound:boolean;volume:number;timeLeft:number;
 start:()=>void;tick:()=>void;select:(id:string)=>void;answer:()=>void;nextQuestion:()=>void;setVolume:(volume:number)=>void;
 use:(life:Lifeline)=>boolean;hide:(ids:string[])=>void;walk:()=>void;toggleSound:()=>void;reset:()=>void;
}
const loadBest=()=>typeof localStorage==='undefined'?0:Number(localStorage.getItem('millionaire-best')||0);
const questionTime=(index:number)=>index<5?60:index<10?45:30;
const saveBest=(best:number)=>{if(typeof localStorage!=='undefined')localStorage.setItem('millionaire-best',String(best));};

export const useGame=create<GameState>((set,get)=>{
 const finish=(reason:EndReason,result:number,extra:Partial<GameState>={})=>{
  const best=Math.max(get().best,result);saveBest(best);set({status:'finished',reason,result,best,selected:null,...extra});
 };
 const answer=()=>{
  const s=get();if(s.status!=='playing'||!s.selected)return;
  const index=s.index;set({status:'revealing'});
  setTimeout(()=>{const now=get();if(now.status==='revealing'&&now.index===index)set({status:'answered'});},3000);
 };
 const nextQuestion=()=>{
  const s=get();if(s.status!=='answered')return;
  const q=s.questions[s.index];if(!q)return;
  if(s.selected!==q.correctId){finish('wrong',lossPrize(s.index));return;}
  const next=s.index+1;const secured=securedPrize(next);
  if(next===15){finish('won',PRIZES[14],{secured});return;}
  set({index:next,secured,status:'playing',selected:null,hidden:[],timeLeft:questionTime(next)});
 };
 return {
  status:'start',questions:[],index:0,selected:null,hidden:[],used:{fifty:false,phone:false,audience:false},
  secured:0,result:0,reason:null,best:loadBest(),sound:localStorage.getItem('millionaire-sound')!=='off',volume:typeof localStorage==='undefined'?70:Number(localStorage.getItem('millionaire-volume')??70),timeLeft:questionTime(0),
  start:()=>set({status:'playing',questions:pickGameQuestions(),index:0,selected:null,hidden:[],used:{fifty:false,phone:false,audience:false},secured:0,result:0,reason:null,timeLeft:questionTime(0)}),
  tick:()=>{const s=get();if(s.status!=='playing')return;if(s.timeLeft>1){set({timeLeft:s.timeLeft-1});return;}finish('timeout',lossPrize(s.index),{timeLeft:0});},
  select:id=>{const s=get();if(s.status==='playing'&&!s.hidden.includes(id))set({selected:id});},
  answer,nextQuestion,
  use:life=>{const s=get();if(s.status!=='playing'||s.used[life])return false;set({used:{...s.used,[life]:true}});return true;},
  hide:ids=>set({hidden:ids}),
  walk:()=>{const s=get();if(s.status==='playing')finish('walkaway',walkawayPrize(s.index));},
  setVolume:volume=>{const value=Math.max(0,Math.min(100,Math.round(volume)));localStorage.setItem('millionaire-volume',String(value));set({volume:value});},
  toggleSound:()=>{const sound=!get().sound;localStorage.setItem('millionaire-sound',sound?'on':'off');set({sound});},
  reset:()=>set({status:'start',questions:[],index:0,selected:null,hidden:[],used:{fifty:false,phone:false,audience:false},secured:0,result:0,reason:null,timeLeft:questionTime(0)})
 };
});
