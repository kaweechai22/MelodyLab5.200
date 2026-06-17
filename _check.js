(() => {
'use strict';
const $=id=>document.getElementById(id);
const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
const fmt=(n,d=2)=>Number(n).toFixed(d);
const state={playing:false,phase:0,last:0,raf:0,logs:[]};
function getNumber(id,fallback){const el=$(id);const n=el?Number(el.value):NaN;return Number.isFinite(n)?n:fallback;}
function params(){
  const d=getNumber('vizSeparation',.8),f=getNumber('vizFreq',600),T=getNumber('vizTemp',20),phaseDeg=getNumber('vizPhaseDiff',0),A=getNumber('vizAmp',.75),timeSpeed=getNumber('vizTimeSpeed',1);
  const v=331+.6*T,lambda=v/f,ratio=d/lambda,phase=phaseDeg*Math.PI/180,centerI=(1+Math.cos(phase))/2;
  let center='เสริมกันกลาง';
  if(centerI<.25) center='หักล้างกันกลาง';
  else if(centerI<.75) center='กึ่งเสริมกลาง';
  return{d,f,T,phaseDeg,phase,A,timeSpeed,v,lambda,ratio,centerI,center,showGuides:!!$('vizShowGuides')?.checked};
}
function setText(id,text){const el=$(id);if(el)el.textContent=text;}
function labels(p){
  setText('vizSeparationLabel',`${fmt(p.d,2)} m`);
  setText('vizFreqLabel',`${Math.round(p.f)} Hz`);
  setText('vizTempLabel',`${Math.round(p.T)} °C`);
  setText('vizPhaseDiffLabel',`${Math.round(p.phaseDeg)}°`);
  setText('vizAmpLabel',fmt(p.A,2));
  setText('vizTimeLabel',`${fmt(p.timeSpeed,1)}×`);
  setText('intSpeedLabel',`${fmt(p.v,1)} m/s`);
  setText('intLambdaLabel',`${fmt(p.lambda,2)} m`);
  setText('intRatioLabel',fmt(p.ratio,2));
  setText('intPhaseLabel',`${Math.round(p.phaseDeg)}°`);
  setText('intCenterLabel',p.center);
  setText('vizGuideLabel',p.showGuides?'เปิด':'ปิด');
}
function prep(canvas){
  const rect=canvas.getBoundingClientRect(),cssW=rect.width||canvas.width||1200,cssH=Math.max(280,cssW*(440/1200)),dpr=Math.max(1,Math.min(2.2,window.devicePixelRatio||1));
  canvas.style.height=`${cssH}px`;
  if(canvas.width!==Math.round(cssW*dpr)||canvas.height!==Math.round(cssH*dpr)){canvas.width=Math.round(cssW*dpr);canvas.height=Math.round(cssH*dpr);}
  const ctx=canvas.getContext('2d');ctx.setTransform(dpr,0,0,dpr,0,0);return{ctx,w:cssW,h:cssH};
}
function play(){if(state.playing)return;state.playing=true;state.last=performance.now();cancelAnimationFrame(state.raf);state.raf=requestAnimationFrame(loop);}
function pause(){state.playing=false;cancelAnimationFrame(state.raf);draw();}
function reset(){state.playing=false;state.phase=0;state.last=0;cancelAnimationFrame(state.raf);draw();}
function loop(now){if(!state.playing)return;const p=params();const dt=state.last?(now-state.last)/1000:0;state.last=now;state.phase+=dt*72*p.timeSpeed;draw();state.raf=requestAnimationFrame(loop);}
function draw(){
  const c=$('visualizerCanvas');if(!c)return;const p=params();labels(p);const {ctx,w,h}=prep(c);
  ctx.clearRect(0,0,w,h);background(ctx,w,h);
  const wallX=w*.44,cy=h*.52,top=h*.14,bottom=h*.86,slitHalf=clamp(h*.024,7,11),spacing=clamp(p.lambda*92,22,84),sep=clamp(p.d*h*.15,34,h*.42),phase=((state.phase%spacing)+spacing)%spacing;
  const speaker={x:w*.09,y:cy};
  const slit1={x:wallX,y:cy-sep/2},slit2={x:wallX,y:cy+sep/2};
  const screenX=w*.89;
  speakerDraw(ctx,speaker,p);
  incoming(ctx,speaker,wallX,top,bottom,spacing,phase,p,w,h);
  wallDraw(ctx,wallX,top,bottom,slit1.y,slit2.y,slitHalf);
  shadow(ctx,wallX,w,top,bottom,slit1.y,slit2.y,slitHalf);
  secondarySources(ctx,slit1,slit2,p);
  outgoing(ctx,slit1,spacing,phase,p,w,h,'rgba(45,212,191,');
  outgoing(ctx,slit2,spacing,phase,p,w,h,'rgba(110,231,183,');
  axis(ctx,cy,w);
  if(p.showGuides) guides(ctx,slit1,slit2,screenX,cy,h,p);
  receiver(ctx,screenX,top,bottom,slit1,slit2,p);
  miniBadge(ctx,w,h,p);
}
function background(ctx,w,h){
  const g=ctx.createLinearGradient(0,0,w,h);g.addColorStop(0,'#061422');g.addColorStop(.5,'#07111f');g.addColorStop(1,'#050a14');ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
  ctx.strokeStyle='rgba(148,163,184,.08)';ctx.lineWidth=1;
  for(let x=0;x<w;x+=42){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke();}
  for(let y=0;y<h;y+=42){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke();}
}
function speakerDraw(ctx,s,p){
  ctx.save();ctx.translate(s.x,s.y);
  ctx.fillStyle='#1e293b';rr(ctx,-36,-24,30,48,10,true,false);
  ctx.fillStyle='#38bdf8';ctx.beginPath();ctx.moveTo(-6,-17);ctx.lineTo(28,-33);ctx.lineTo(28,33);ctx.lineTo(-6,17);ctx.closePath();ctx.fill();
  ctx.strokeStyle='rgba(224,242,254,.78)';ctx.lineWidth=2;
  for(let i=1;i<=3;i++){ctx.globalAlpha=.18+p.A*.20;ctx.beginPath();ctx.arc(30,0,12+i*13,-.58,.58);ctx.stroke();}
  ctx.globalAlpha=1;ctx.fillStyle='#dbeafe';ctx.font='700 11px system-ui,sans-serif';ctx.textAlign='center';ctx.fillText('ลำโพง',-6,49);
  ctx.restore();
}
function incoming(ctx,speaker,wallX,top,bottom,spacing,phase,p,w,h){
  ctx.save();ctx.strokeStyle=`rgba(56,189,248,${.22+p.A*.32})`;ctx.lineWidth=2.2;
  const sx=speaker.x+26,sy=speaker.y,maxR=wallX-sx-18;
  for(let r=phase+spacing*.60;r<maxR;r+=spacing){ctx.beginPath();ctx.arc(sx,sy,r,-.72,.72);ctx.stroke();}
  ctx.strokeStyle='rgba(226,232,240,.70)';ctx.fillStyle='rgba(226,232,240,.70)';ctx.lineWidth=2;arrow(ctx,w*.18,top+18,w*.31,top+18);
  ctx.restore();
}
function wallDraw(ctx,x,top,bottom,y1,y2,slitHalf){
  const width=24;
  seg(ctx,x,top,y1-slitHalf,width);
  seg(ctx,x,y1+slitHalf,y2-slitHalf,width);
  seg(ctx,x,y2+slitHalf,bottom,width);
  ctx.save();ctx.fillStyle='rgba(226,232,240,.92)';ctx.font='800 12px system-ui,sans-serif';ctx.textAlign='center';ctx.fillText('ช่องแคบคู่',x,top-14);
  ctx.strokeStyle='#facc15';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x+20,y1);ctx.lineTo(x+20,y2);ctx.stroke();
  ctx.fillStyle='#fde68a';ctx.font='800 13px system-ui,sans-serif';ctx.textAlign='left';ctx.fillText('d',x+28,(y1+y2)/2+5);ctx.restore();
}
function seg(ctx,x,y1,y2,width){
  ctx.save();ctx.fillStyle='rgba(71,85,105,.96)';ctx.strokeStyle='rgba(148,163,184,.42)';ctx.lineWidth=1.1;
  rr(ctx,x-width/2,y1,width,y2-y1,11,true,true);
  ctx.restore();
}
function shadow(ctx,wallX,w,top,bottom,y1,y2,slitHalf){
  ctx.save();ctx.fillStyle='rgba(15,23,42,.14)';
  ctx.fillRect(wallX+16,top,w-wallX-140,Math.max(0,y1-slitHalf-top));
  ctx.fillRect(wallX+16,y1+slitHalf,w-wallX-140,Math.max(0,y2-y1-2*slitHalf));
  ctx.fillRect(wallX+16,y2+slitHalf,w-wallX-140,Math.max(0,bottom-y2-slitHalf));
  ctx.restore();
}
function secondarySources(ctx,s1,s2,p){
  ctx.save();
  [[s1,'S₁'],[s2,'S₂']].forEach(([s,label],i)=>{ctx.fillStyle=i===0?'#2dd4bf':'#6ee7b7';ctx.shadowColor=ctx.fillStyle;ctx.shadowBlur=10;ctx.beginPath();ctx.arc(s.x,s.y,4.2,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;ctx.fillStyle='rgba(226,232,240,.85)';ctx.font='700 10px system-ui,sans-serif';ctx.fillText(label,s.x+10,s.y-7);});
  ctx.restore();
}
function outgoing(ctx,s,spacing,phase,p,w,h,colorPrefix){
  ctx.save();ctx.lineWidth=2.0;const maxR=Math.hypot(w-s.x,h),base=.14+p.A*.26;
  for(let r=phase+spacing*.55;r<maxR;r+=spacing){const fade=clamp(1-r/(maxR*1.03),.08,1);ctx.strokeStyle=`${colorPrefix}${base*fade})`;ctx.beginPath();ctx.arc(s.x,s.y,r,-1.00,1.00);ctx.stroke();}
  ctx.restore();
}
function axis(ctx,cy,w){ctx.save();ctx.strokeStyle='rgba(226,232,240,.26)';ctx.setLineDash([5,7]);ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(w*.16,cy);ctx.lineTo(w*.87,cy);ctx.stroke();ctx.setLineDash([]);ctx.restore();}
function guides(ctx,s1,s2,screenX,cy,h,p){
  const sampleY=cy-h*.18;ctx.save();ctx.strokeStyle='rgba(248,250,252,.42)';ctx.lineWidth=1.6;ctx.setLineDash([6,7]);
  line(ctx,s1.x,s1.y,screenX,sampleY);line(ctx,s2.x,s2.y,screenX,sampleY);ctx.setLineDash([]);
  ctx.fillStyle='rgba(248,250,252,.92)';ctx.beginPath();ctx.arc(screenX,sampleY,3.5,0,Math.PI*2);ctx.fill();
  const r1=Math.hypot(screenX-s1.x,sampleY-s1.y),r2=Math.hypot(screenX-s2.x,sampleY-s2.y),dr=Math.abs(r2-r1);
  ctx.fillStyle='rgba(226,232,240,.78)';ctx.font='800 11px system-ui,sans-serif';ctx.fillText(`Δr≈${fmt(dr,2)} m`,screenX-90,sampleY-12);
  ctx.restore();
}
function receiver(ctx,x,top,bottom,s1,s2,p){
  ctx.save();ctx.strokeStyle='rgba(226,232,240,.44)';ctx.lineWidth=2;line(ctx,x,top,x,bottom);
  ctx.fillStyle='rgba(226,232,240,.82)';ctx.font='700 11px system-ui,sans-serif';ctx.textAlign='center';ctx.fillText('แนวผู้ฟัง',x,bottom+17);
  ctx.textAlign='left';ctx.fillStyle='rgba(216,180,254,.90)';ctx.fillText('I/I₀',x+12,top-8);
  for(let y=top;y<=bottom;y+=3){const I=relativeIntensity(x,y,s1,s2,p),alpha=clamp(I*p.A,.04,.92),wid=8+I*28;ctx.fillStyle=`rgba(167,139,250,${alpha})`;rr(ctx,x+7,y-1.15,wid,2.3,2,true,false);}ctx.restore();
}
function relativeIntensity(x,y,s1,s2,p){const r1=Math.hypot(x-s1.x,y-s1.y),r2=Math.hypot(x-s2.x,y-s2.y),delta=2*Math.PI*(r2-r1)/p.lambda+p.phase;return (1+Math.cos(delta))/2;}
function miniBadge(ctx,w,h,p){ctx.save();const x=16,y=h-50,bw=Math.min(w-32,470),bh=36;ctx.fillStyle='rgba(2,6,23,.58)';ctx.strokeStyle='rgba(148,163,184,.22)';rr(ctx,x,y,bw,bh,14,true,true);ctx.fillStyle='#e0f2fe';ctx.font='800 12px system-ui,sans-serif';ctx.fillText(`λ=${fmt(p.lambda,2)} m   d/λ=${fmt(p.ratio,2)}   Δφ=${Math.round(p.phaseDeg)}°   ${p.center}`,x+14,y+23);ctx.restore();}
function arrow(ctx,x1,y1,x2,y2){ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();const a=Math.atan2(y2-y1,x2-x1),h=8;ctx.beginPath();ctx.moveTo(x2,y2);ctx.lineTo(x2-h*Math.cos(a-Math.PI/6),y2-h*Math.sin(a-Math.PI/6));ctx.lineTo(x2-h*Math.cos(a+Math.PI/6),y2-h*Math.sin(a+Math.PI/6));ctx.closePath();ctx.fill();}
function line(ctx,x1,y1,x2,y2){ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();}
function rr(ctx,x,y,w,h,r,fill=true,stroke=false){const q=Math.min(r,Math.abs(w)/2,Math.abs(h)/2);ctx.beginPath();ctx.moveTo(x+q,y);ctx.arcTo(x+w,y,x+w,y+h,q);ctx.arcTo(x+w,y+h,x,y+h,q);ctx.arcTo(x,y+h,x,y,q);ctx.arcTo(x,y,x+w,y,q);ctx.closePath();if(fill)ctx.fill();if(stroke)ctx.stroke();}
function row(){const p=params();return{timestamp:new Date().toISOString(),topic:'Sound Interference',model:'double_slit',slit_separation_d_m:Number(fmt(p.d,3)),frequency_Hz:Math.round(p.f),temperature_C:Math.round(p.T),speed_m_s:Number(fmt(p.v,2)),wavelength_m:Number(fmt(p.lambda,4)),d_over_lambda:Number(fmt(p.ratio,3)),phase_difference_deg:Math.round(p.phaseDeg),center_condition:p.center,amplitude_display_A:Number(fmt(p.A,2)),show_guides:p.showGuides};}
function renderLog(){const head=document.querySelector('.localHead'),body=document.querySelector('.localBody');if(!head||!body)return;const sample=state.logs[0]||row(),keys=Object.keys(sample);head.innerHTML=keys.map(k=>`<th>${esc(k)}</th>`).join('');body.innerHTML=state.logs.map(r=>`<tr>${keys.map(k=>`<td>${esc(r[k]??'')}</td>`).join('')}</tr>`).join('');}
function downloadCsv(){if(!state.logs.length)state.logs.push(row());const keys=Object.keys(state.logs[0]),rows=[keys.join(',')].concat(state.logs.map(r=>keys.map(k=>csv(r[k])).join(',')));const blob=new Blob(['\ufeff'+rows.join('\n')],{type:'text/csv;charset=utf-8;'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`soundInterference_${new Date().toISOString().slice(0,19).replace(/[:T]/g,'-')}.csv`;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},500);renderLog();}
function savePng(){const c=$('visualizerCanvas');if(!c)return;draw();try{c.toBlob(blob=>{if(!blob)return;const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='soundInterference.png';document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},500);},'image/png');}catch(e){}}
function csv(v){const s=String(v??'');return /[",\n]/.test(s)?`"${s.replace(/"/g,'""')}"`:s;}
function esc(v){return String(v??'').replace(/[&<>\"]/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[ch]));}
document.addEventListener('DOMContentLoaded',()=>{
  ['vizSeparation','vizFreq','vizTemp','vizPhaseDiff','vizAmp','vizTimeSpeed','vizShowGuides'].forEach(id=>{$(id)?.addEventListener('input',draw);$(id)?.addEventListener('change',draw);});
  $('vizPlayBtn')?.addEventListener('click',play);$('vizPauseBtn')?.addEventListener('click',pause);$('vizResetBtn')?.addEventListener('click',reset);$('vizExportBtn')?.addEventListener('click',savePng);
  document.querySelector('.localCaptureBtn')?.addEventListener('click',()=>{state.logs.push(row());renderLog();});
  document.querySelector('.localDownloadBtn')?.addEventListener('click',downloadCsv);
  document.querySelector('.localClearBtn')?.addEventListener('click',()=>{state.logs=[];renderLog();});
  draw();renderLog();
});
})();