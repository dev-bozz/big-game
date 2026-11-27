import {create} from 'zustand';
import type {EndReason,GameStatus,Lifeline,Question} from '../types/game';
import {pickGameQuestions} from '../utils/gameLogic';
import {lossPrize,PRIZES,securedPrize,walkawayPrize} from '../data/moneyLadder';
interface GameState {status:GameStatus;questions:Question[];index:number;selected:string|null;hidden:string[];used:Record<Lifeline,boolean>;secured:number;result:number;reason:EndReason|null;best:number;sound:boolean;timeLeft:number;
 start:()=>void;tick:()=>void;select:(id:string)=>void;confirm:()=>void;cancelConfirm:()=>void;reveal:()=>void;use:(life:Lifeline)=>boolean;hide:(ids:string[])=>void;walk:()=>void;toggleSound:()=>void;reset:()=>void;}
const loadBest=()=>typeof localStorage==='undefined'?0:Number(localStorage.getItem('millionaire-best')||0);
const questionTime=(index:number)=>index<5?60:index<10?45:30;
export const useGame=create<GameState>((set,get)=>({status:'start',questions:[],index:0,selected:null,hidden:[],used:{fifty:false,phone:false,audience:false},secured:0,result:0,reason:null,best:loadBest(),sound:localStorage.getItem('millionaire-sound')!=='off',timeLeft:questionTime(0),
 start:()=>set({status:'playing',questions:pickGameQuestions(),index:0,selected:null,hidden:[],used:{fifty:false,phone:false,audience:false},secured:0,result:0,reason:null,timeLeft:questionTime(0)}),
 tick:()=>{const s=get();if(s.status!=='playing')return;if(s.timeLeft>1){set({timeLeft:s.timeLeft-1});return;}const result=lossPrize(s.index);const best=Math.max(s.best,result);if(typeof localStorage!=='undefined')localStorage.setItem('millionaire-best',String(best));set({status:'finished',reason:'timeout',result,best,selected:null,timeLeft:0});},
 select:id=>{const s=get();if(s.status==='playing'&&!s.hidden.includes(id))set({selected:id});},
 confirm:()=>{const s=get();if(s.status==='playing'&&s.selected)set({status:'confirming'});},cancelConfirm:()=>{if(get().status==='confirming')set({status:'playing'});},
 reveal:()=>{const s=get();if(s.status!=='confirming'||!s.selected)return;set({status:'revealing'});setTimeout(()=>{const now=get();if(now.status!=='revealing')return;const q=now.questions[now.index]!;if(now.selected===q.correctId){const next=now.index+1;const secured=securedPrize(next);if(next===15){const result=PRIZES[14];if(typeof localStorage!=='undefined')localStorage.setItem('millionaire-best',String(Math.max(now.best,result)));set({status:'finished',reason:'won',result,best:Math.max(now.best,result),secured,selected:null});}else set({index:next,secured,status:'playing',selected:null,hidden:[],timeLeft:questionTime(next)});}else{const result=lossPrize(now.index);if(typeof localStorage!=='undefined')localStorage.setItem('millionaire-best',String(Math.max(now.best,result)));set({status:'finished',reason:'wrong',result,best:Math.max(now.best,result),selected:null});}},1700);},
 use:life=>{const s=get();if(s.status!=='playing'||s.used[life])return false;set({used:{...s.used,[life]:true}});return true;},hide:ids=>set({hidden:ids}),
 walk:()=>{const s=get();if(s.status==='playing'){const result=walkawayPrize(s.index);if(typeof localStorage!=='undefined')localStorage.setItem('millionaire-best',String(Math.max(s.best,result)));set({status:'finished',reason:'walkaway',result,best:Math.max(s.best,result)});}},
 toggleSound:()=>{const sound=!get().sound;localStorage.setItem('millionaire-sound',sound?'on':'off');set({sound});},reset:()=>set({status:'start',questions:[],index:0,selected:null,hidden:[],used:{fifty:false,phone:false,audience:false},secured:0,result:0,reason:null,timeLeft:questionTime(0)})
}));
