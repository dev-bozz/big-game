export const PRIZES=[500,1000,2000,3000,5000,10000,15000,25000,50000,100000,200000,400000,800000,1500000,3000000] as const;
export const MILESTONES=[4,9] as const;
export const money=(n:number)=>new Intl.NumberFormat('ru-RU').format(n)+' ₽';
export function securedPrize(correctCount:number):number { return correctCount>=10?100000:correctCount>=5?5000:0; }
export function walkawayPrize(correctCount:number):number { return correctCount===0?0:PRIZES[correctCount-1]??0; }
export function lossPrize(correctCount:number):number { return securedPrize(correctCount); }
