let context:AudioContext|undefined;
const effects:Record<'correct'|'incorrect',HTMLAudioElement|undefined>={correct:undefined,incorrect:undefined};
let timerTick:HTMLAudioElement|undefined;
let masterVolume=.7;
let enabled=true;

export function setAudioVolume(volume:number){
 masterVolume=Math.max(0,Math.min(1,volume/100));
 for(const audio of Object.values(effects))if(audio)audio.volume=.8*masterVolume;
 if(timerTick)timerTick.volume=.25*masterVolume;
}
export function setAudioEnabled(value:boolean){
 enabled=value;
 if(!enabled){for(const audio of Object.values(effects))audio?.pause();timerTick?.pause();}
}
export function tone(frequency=440,duration=.12,type:OscillatorType='sine'){
 if(!enabled||masterVolume===0)return;
 try{context??=new AudioContext();const osc=context.createOscillator();const gain=context.createGain();osc.type=type;osc.frequency.value=frequency;gain.gain.setValueAtTime(.045*masterVolume,context.currentTime);gain.gain.exponentialRampToValueAtTime(.001,context.currentTime+duration);osc.connect(gain);gain.connect(context.destination);osc.start();osc.stop(context.currentTime+duration);}catch{/* Audio is optional when browser policy blocks it. */}
}
export function playGameSound(name:'correct'|'incorrect'){
 if(!enabled||masterVolume===0)return;
 try{const audio=effects[name]??new Audio(`/sounds/millionaire-${name}.mp3`);effects[name]=audio;audio.currentTime=0;audio.volume=.8*masterVolume;void audio.play().catch(()=>{});}catch{/* Audio is optional when browser policy blocks it. */}
}
export function playTimerTick(){
 if(!enabled||masterVolume===0)return;
 try{const audio=timerTick??new Audio('/sounds/timer-tick.wav');timerTick=audio;audio.currentTime=0;audio.volume=.25*masterVolume;void audio.play().catch(()=>{});}catch{/* Audio is optional when browser policy blocks it. */}
}
