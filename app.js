const $=id=>document.getElementById(id);
const rebuiltTopicModes = new Set(["soundReflection","soundRefraction","soundDiffraction","soundInterference","superposition","beatsViz","standingAir","resonanceViz","resonanceAirHarmonics","dopplerViz","shockWave","soundIntensity","soundIntensityLevel","soundLevelHearing","harmonicsViz","noisePollution","applicationsSound"]);
const soundTopicModes = rebuiltTopicModes;

function vNum(id, fb){ const e=$(id); return e ? Number(e.value || fb) : fb; }
function vText(id, text){ if($(id)) $(id).textContent = text; }
function vSel(id, fb){ const e=$(id); return e ? (e.value || fb) : fb; }
function lim(x,a,b){ return Math.max(a, Math.min(b, x)); }

function coreArrow(ctx,x1,y1,x2,y2,color="#22d3ee",lw=3){
  ctx.save(); ctx.strokeStyle=color; ctx.fillStyle=color; ctx.lineWidth=lw; ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke();
  const a=Math.atan2(y2-y1,x2-x1), h=12;
  ctx.beginPath(); ctx.moveTo(x2,y2);
  ctx.lineTo(x2-h*Math.cos(a-Math.PI/6),y2-h*Math.sin(a-Math.PI/6));
  ctx.lineTo(x2-h*Math.cos(a+Math.PI/6),y2-h*Math.sin(a+Math.PI/6));
  ctx.closePath(); ctx.fill(); ctx.restore();
}
function corePanel(ctx,w,h,title){
  ctx.clearRect(0,0,w,h);
  const bg=ctx.createLinearGradient(0,0,w,h); bg.addColorStop(0,"#020817"); bg.addColorStop(1,"#06152e");
  ctx.fillStyle=bg; ctx.fillRect(0,0,w,h);
  ctx.strokeStyle="rgba(148,163,184,.10)"; ctx.lineWidth=1;
  for(let x=0;x<w;x+=78){ ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,h); ctx.stroke(); }
  for(let y=0;y<h;y+=52){ ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(w,y); ctx.stroke(); }
  const p={x:44,y:76,w:w-88,h:h-126};
  ctx.fillStyle="rgba(4,18,42,.74)"; ctx.strokeStyle="rgba(88,166,255,.32)"; ctx.lineWidth=1.6;
  roundRect(ctx,p.x,p.y,p.w,p.h,18); ctx.fill(); ctx.stroke();
  ctx.fillStyle="#e8f5ff"; ctx.font="bold 20px Sarabun, system-ui, sans-serif"; ctx.textAlign="left"; ctx.fillText(title,24,34);
  return p;
}
function coreDot(ctx,x,y,r=7,color="#ff4d6d"){
  ctx.save(); const g=ctx.createRadialGradient(x,y,2,x,y,r*3);
  g.addColorStop(0,color); g.addColorStop(1,"rgba(0,0,0,0)");
  ctx.fillStyle=g; ctx.beginPath(); ctx.arc(x,y,r*3,0,Math.PI*2); ctx.fill();
  ctx.fillStyle=color; ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill();
  ctx.strokeStyle="rgba(255,255,255,.9)"; ctx.lineWidth=1.3; ctx.beginPath(); ctx.arc(x,y,r+3,0,Math.PI*2); ctx.stroke();
  ctx.restore();
}
function coreWaveLine(ctx, pts, color="#22d3ee", lw=3){
  ctx.save(); ctx.strokeStyle=color; ctx.lineWidth=lw; ctx.beginPath(); pts.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1])); ctx.stroke(); ctx.restore();
}
function coreArcs(ctx,x,y,count,spacing,color,start,end,shift=0){
  ctx.save(); ctx.strokeStyle=color; ctx.lineWidth=2.3;
  for(let i=0;i<count;i++){
    const r=(i*spacing + shift)%(count*spacing);
    if(r<16) continue;
    ctx.globalAlpha=lim(.95-r/(count*spacing),.14,.9);
    ctx.beginPath(); ctx.arc(x,y,r,start,end); ctx.stroke();
  }
  ctx.restore();
}
function coreMetricCard(ctx,x,y,w,h,title,value,sub,color="#22d3ee"){
  ctx.save(); ctx.fillStyle="rgba(2,12,30,.78)"; ctx.strokeStyle="rgba(88,166,255,.32)"; ctx.lineWidth=1.3;
  roundRect(ctx,x,y,w,h,14); ctx.fill(); ctx.stroke();
  ctx.fillStyle="rgba(226,232,240,.80)"; ctx.font="13px Sarabun"; ctx.textAlign="left"; ctx.fillText(title,x+14,y+23);
  ctx.fillStyle=color; ctx.font="bold 22px Sarabun"; ctx.fillText(value,x+14,y+52);
  ctx.fillStyle="rgba(226,232,240,.68)"; ctx.font="12px Sarabun"; ctx.fillText(sub,x+14,y+74);
  ctx.restore();
}
function coreBar(ctx,x,y,w,h,ratio,color="#22d3ee"){
  ctx.save(); ctx.fillStyle="rgba(148,163,184,.16)"; roundRect(ctx,x,y,w,h,h/2); ctx.fill();
  ctx.fillStyle=color; roundRect(ctx,x,y,w*lim(ratio,0,1),h,h/2); ctx.fill(); ctx.restore();
}

function drawRebuiltTopic(ctx,c,p,w,h,mode){
  const time=vizState.t*0.035*(p.speed||1);
  vText("vizTimeLabel",(p.speed||1).toFixed(1)+"×");
  let panel, cx, cy;

  if(mode==="soundReflection"){
    const angle=vNum("vizAngle",25);
    const freq=1000; // reflection does not change frequency; keep fixed for teaching clarity
    const amp=vNum("vizAmp",0.80);
    const distance=vNum("vizDistance",10);
    const echoTime=2*distance/343;
    const echoOccurs=echoTime>=0.10;
    const wallType=vSel("vizWallType","vizRefractionMode","vizHotSide","rigid");
    const reflRatio = wallType==="rigid" ? 0.95 : 0.45;
    const reflAlpha = wallType==="rigid" ? 1.00 : 0.45;
    const incidentAlpha = lim(0.35 + amp*0.48, 0.35, 1.0);
    const incidentWidth = 1.8 + amp*2.6;
    const incidentWaveWidth = 0.9 + amp*2.2;
    const reflWidth = (wallType==="rigid" ? 1.8 : 1.0) + amp*2.6*reflRatio;
    // v5.124: ไม่แสดงเปอร์เซ็นต์ความเข้มเสียงสะท้อน เพื่อไม่ให้นักเรียนสับสนเรื่องความเข้มเสียง
  // const reflectedEnergy = Math.round(reflRatio * amp * amp * 100);
    vText("vizAngleLabel",angle.toFixed(0)+"°");
    vText("vizFreqLabel",freq.toFixed(0)+" Hz");
    vText("vizAmpLabel",amp.toFixed(2));
    vText("vizDistanceLabel",distance.toFixed(1)+" m");
    vText("vizWallTypeLabel",wallType==="rigid"?"Rigid":"Soft");
    vText("vizEchoAudioLabel",echoOccurs?"✅ เกิด Echo":"⚠️ ไม่เกิด Echo");
    panel=corePanel(ctx,w,h,"Sound Reflection (การสะท้อนของเสียง)");

    // Geometry: vertical wall => normal is horizontal through point of incidence.
    const srcX=panel.x+88, srcY=panel.y+panel.h*0.39;
    const speakerMouthX = srcX + 30;
    const wallX=panel.x+panel.w-150;
    const hitY=panel.y+panel.h*0.47;
    const topLimit = panel.y+72;
    const bottomLimit = panel.y+panel.h-126;

    const thetaReq = angle*Math.PI/180;
    let inX = speakerMouthX;
    let inY = hitY - Math.tan(thetaReq)*(wallX-inX);
    inY = lim(inY, topLimit, bottomLimit);
    const thetaUsed = Math.atan2(Math.abs(hitY-inY), Math.abs(wallX-inX));
    const thetaDeg = thetaUsed*180/Math.PI;

    let outX = panel.x+194;
    let outY = hitY + Math.tan(thetaUsed)*(wallX-outX);
    outY = lim(outY, topLimit, bottomLimit);
    outX = wallX - Math.abs((outY-hitY)/Math.tan(thetaUsed||0.0001));
    outX = Math.max(outX, panel.x+148);

    const rayColor=`rgba(255,92,171,${incidentAlpha})`;
    const reflColor = `rgba(124,255,124,${reflAlpha * lim(0.45+amp*0.55,0.35,1)})`;

    drawSpeaker(ctx,srcX,srcY,0.95);

    const waveShift=(time*38)%30;
    ctx.save();
    for(let i=0;i<13;i++){
      const r=34+i*26+waveShift;
      const alpha=lim((0.28 + amp*0.50)-i*0.034,0.04,0.78);
      ctx.strokeStyle=`rgba(0,170,255,${alpha})`;
      ctx.lineWidth=incidentWaveWidth;
      ctx.beginPath();
      ctx.arc(srcX+6,srcY,r,-0.92,0.92);
      ctx.stroke();
    }
    ctx.restore();

    // Wall body.
    ctx.save();
    const wallGrad=ctx.createLinearGradient(wallX-15,panel.y,wallX+24,panel.y);
    if(wallType==="rigid"){
      wallGrad.addColorStop(0,"rgba(255,255,255,.12)");
      wallGrad.addColorStop(.5,"rgba(255,255,255,.48)");
      wallGrad.addColorStop(1,"rgba(255,255,255,.10)");
    } else {
      wallGrad.addColorStop(0,"rgba(180,210,255,.08)");
      wallGrad.addColorStop(.5,"rgba(140,170,210,.22)");
      wallGrad.addColorStop(1,"rgba(180,210,255,.08)");
    }
    ctx.fillStyle=wallGrad;
    roundRect(ctx,wallX-12,panel.y+44,34,panel.h-150,4);
    ctx.fill();
    ctx.strokeStyle=wallType==="rigid"?"rgba(255,255,255,.42)":"rgba(160,190,220,.30)";
    ctx.lineWidth=1.4;
    for(let y=panel.y+50;y<panel.y+panel.h-118;y+=16){
      ctx.beginPath();
      ctx.moveTo(wallX-10,y+13);
      ctx.lineTo(wallX+18,y-5);
      ctx.stroke();
    }
    ctx.restore();

    // Normal line = line perpendicular to the wall, passing through point of incidence.
    ctx.save();
    ctx.setLineDash([7,7]);
    ctx.strokeStyle="rgba(255,255,255,.78)";
    ctx.lineWidth=2.2;
    ctx.beginPath(); ctx.moveTo(wallX-54,hitY); ctx.lineTo(wallX+122,hitY); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle="#e8f5ff";
    ctx.font="bold 13px Sarabun, system-ui";
    ctx.textAlign="center";
    ctx.fillText("Normal line",wallX+78,hitY-18);
    ctx.font="12px Sarabun, system-ui";
    ctx.fillText("(เส้นแนวฉาก)",wallX+78,hitY-2);
    ctx.restore();

    // Wall type label moved to the top of the wall.
    ctx.save();
    ctx.fillStyle="#e8f5ff";
    ctx.textAlign="center";
    ctx.font="bold 13px Sarabun, system-ui";
    ctx.fillText(wallType==="rigid"?"Rigid Wall":"Soft Wall", wallX+5, panel.y+28);
    ctx.font="12px Sarabun, system-ui";
    ctx.fillText(wallType==="rigid"?"(ผนังแข็ง)":"(ผนังดูดซับ)", wallX+5, panel.y+46);
    ctx.fillStyle=wallType==="rigid"?"rgba(124,255,124,.92)":"rgba(191,219,254,.85)";
    ctx.restore();

    // Rays.
    coreArrow(ctx,inX,inY,wallX,hitY,rayColor,incidentWidth);
    coreArrow(ctx,wallX,hitY,outX,outY,reflColor,reflWidth);

    // Reflected wavefronts should clearly extend beyond the incident ray boundary.
    ctx.save();
    const reflectedDir = Math.PI - thetaUsed;
    const reflectedSpread = 0.98;
    const reflectedShift = (time*34)%30;
    for(let i=0;i<11;i++){
      const rr = 30 + i*28 + reflectedShift;
      const alpha = lim((0.22 + amp*0.46 - i*0.032)*reflRatio, 0.018, 0.62);
      ctx.strokeStyle = `rgba(124,255,124,${alpha})`;
      ctx.lineWidth = Math.max(0.9, reflWidth*0.58);
      ctx.beginPath();
      ctx.arc(wallX, hitY, rr, reflectedDir-reflectedSpread, reflectedDir+reflectedSpread);
      ctx.stroke();
    }
    ctx.restore();

    // Compact label along reflected path.
    ctx.save();
    ctx.fillStyle = wallType==="rigid" ? "rgba(124,255,124,.95)" : "rgba(124,255,124,.62)";
    ctx.font = "bold 13px Sarabun, system-ui";
    ctx.textAlign = "center";
    const echoLabelX = wallX - Math.cos(thetaUsed)*225;
    const echoLabelY = hitY + Math.sin(thetaUsed)*225 + 4;
    ctx.fillText("แนวคลื่นสะท้อน", echoLabelX, echoLabelY);
    ctx.restore();

    // Distance guide.
    ctx.save();
    const dY = panel.y + panel.h - 98;
    ctx.strokeStyle = "rgba(255,255,255,.40)";
    ctx.setLineDash([6,6]);
    ctx.lineWidth = 1.8;
    ctx.beginPath(); ctx.moveTo(srcX+36,dY); ctx.lineTo(wallX,dY); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = "#e8f5ff";
    ctx.font = "bold 13px Sarabun, system-ui";
    ctx.textAlign = "center";
    ctx.fillText(`s = ${distance.toFixed(1)} m`, (srcX+wallX)/2, dY-13);
    ctx.font = "11px Sarabun, system-ui";
    ctx.fillStyle = "rgba(226,232,240,.88)";
    ctx.fillText("ระยะตั้งฉากถึงผนัง", (srcX+wallX)/2, dY+4);
    ctx.restore();

    // Moving packets.
    if(vizState.running){
      const u=(time*0.11)%1;
      coreDot(ctx,inX+(wallX-inX)*u,inY+(hitY-inY)*u,3+amp*5,"rgba(255,92,171,1)");
      coreDot(ctx,wallX+(outX-wallX)*u,hitY+(outY-hitY)*u,(2.5+amp*4.5)*reflRatio,`rgba(124,255,124,${lim(0.30+amp*0.55,0.25,0.9)*reflRatio})`);
    }else{
      coreDot(ctx,wallX,hitY,6,"rgba(255,92,171,1)");
    }

    // Angle arcs with numerical values in the scene.
    ctx.save();
    ctx.strokeStyle="rgba(255,160,210,.90)";
    ctx.lineWidth=2;
    ctx.beginPath(); ctx.arc(wallX,hitY,46,Math.PI,Math.PI+thetaUsed); ctx.stroke();
    ctx.beginPath(); ctx.arc(wallX,hitY,72,Math.PI-thetaUsed,Math.PI); ctx.stroke();
    ctx.fillStyle="#ffabd3";
    ctx.font="bold 15px Sarabun, system-ui";
    ctx.textAlign="center";
    ctx.fillText(`θᵢ = ${thetaDeg.toFixed(0)}°`,wallX-84,hitY-16);
    ctx.fillText(`θᵣ = ${thetaDeg.toFixed(0)}°`,wallX-84,hitY+48);
    ctx.restore();

    // Text labels.
    ctx.save();
    ctx.font="bold 13px Sarabun, system-ui";
    ctx.textAlign="left";
    ctx.fillStyle="#ff7cbc";
    ctx.fillText("Incident Ray",inX+16,Math.max(inY-22,panel.y+58));
    ctx.font="12px Sarabun, system-ui";
    ctx.fillText("(รังสีตกกระทบ)",inX+16,Math.max(inY-6,panel.y+74));
    ctx.fillStyle=wallType==="rigid"?"rgba(124,255,124,0.95)":"rgba(124,255,124,0.62)";
    ctx.font="bold 13px Sarabun, system-ui";
    ctx.fillText("Reflected Ray",outX+32,outY+1);
    ctx.font="12px Sarabun, system-ui";
    ctx.fillText("(รังสีสะท้อน)",outX+32,outY+17);
    ctx.restore();

    // Bottom cards reorganized to reduce clutter.
    const bottomY = panel.y + panel.h - 78;

    ctx.save();
    const noteX = panel.x + 24, noteW = 246, noteH = 58;
    ctx.fillStyle = "rgba(11,18,32,.72)";
    ctx.strokeStyle = "rgba(148,163,184,.28)";
    ctx.lineWidth = 1.2;
    roundRect(ctx, noteX, bottomY, noteW, noteH, 14); ctx.fill(); ctx.stroke();
    ctx.textAlign = "left";
    ctx.fillStyle = "#e8f5ff";
    ctx.font = "bold 13px Sarabun, system-ui";
    ctx.fillText("หมายเหตุ", noteX+14, bottomY+20);
    ctx.font = "12px Sarabun, system-ui";
    ctx.fillStyle = "rgba(226,232,240,.94)";
    ctx.fillText("s คือระยะตั้งฉากถึงผนัง", noteX+14, bottomY+38);
    ctx.fillText("t_echo = 2s/v", noteX+14, bottomY+54);
    ctx.restore();

    ctx.save();
    const fx = panel.x + panel.w/2 - 120, fw = 240, fh = 58;
    ctx.fillStyle="rgba(7,18,38,.84)";
    ctx.strokeStyle="rgba(88,166,255,.35)";
    ctx.lineWidth=1.3;
    roundRect(ctx,fx,bottomY,fw,fh,14); ctx.fill(); ctx.stroke();
    ctx.fillStyle="#e8f5ff";
    ctx.font="bold 22px Sarabun, system-ui";
    ctx.textAlign="center";
    ctx.fillText("θᵢ = θᵣ",fx+fw/2,bottomY+25);
    ctx.font="12px Sarabun, system-ui";
    ctx.fillText(`มุมตกกระทบ = มุมสะท้อน = ${thetaDeg.toFixed(0)}°`,fx+fw/2,bottomY+45);
    ctx.restore();

    ctx.save();
    const minEchoDistance = 343*0.10/2;
    const sx = panel.x + panel.w - 270, sw = 246, sh = 62;
    ctx.fillStyle = echoOccurs ? "rgba(22,101,52,.76)" : "rgba(120,53,15,.76)";
    ctx.strokeStyle = echoOccurs ? "rgba(74,222,128,.68)" : "rgba(251,191,36,.68)";
    ctx.lineWidth = 1.4;
    roundRect(ctx, sx, bottomY, sw, sh, 14); ctx.fill(); ctx.stroke();
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 15px Sarabun, system-ui";
    ctx.textAlign = "center";
    ctx.fillText(echoOccurs ? "✅ เกิด Echo" : "⚠️ ไม่เกิด Echo", sx+sw/2, bottomY+18);
    ctx.font = "12px Sarabun, system-ui";
    ctx.fillText(`t_echo ≈ ${echoTime.toFixed(3)} s    |    เกณฑ์ 0.10 s`, sx+sw/2, bottomY+37);
    ctx.fillText(`s เริ่มได้ยิน Echo ≈ ${minEchoDistance.toFixed(1)} m`, sx+sw/2, bottomY+54);
    ctx.restore();
  } else if(mode==="soundRefraction"){
    const freq=vNum("vizFreq",1000), tempTop=vNum("vizTempTop",30), tempBottom=vNum("vizTempBottom",10), angle=vNum("vizAngle",25);
    const profile=vSel("vizRefractionMode","layer");
    const preset=vSel("vizGradientPreset","auto");
    const layerCount=Math.round(vNum("vizLayerCount",6));
    const bendBoost=vNum("vizBendBoost",3.5);
    const vTop = 331 + 0.6*tempTop;
    const vBottom = 331 + 0.6*tempBottom;
    const lambdaTop = vTop / Math.max(freq,1);
    const lambdaBottom = vBottom / Math.max(freq,1);
    const theta1 = angle*Math.PI/180;
    const sinTheta2 = lim((vBottom/vTop)*Math.sin(theta1), -0.999, 0.999);
    const theta2 = Math.asin(sinTheta2);
    const theta1Deg = theta1*180/Math.PI;
    const theta2Deg = theta2*180/Math.PI;
    const noRefraction = Math.abs(vTop-vBottom) < 0.15;
    const topHotter = tempTop > tempBottom;
    const bottomHotter = tempBottom > tempTop;
    const relationLabel = topHotter ? "ด้านบนอุณหภูมิสูงกว่า" : bottomHotter ? "ด้านล่างอุณหภูมิสูงกว่า" : "อุณหภูมิเท่ากัน";
    const topTempLabel = noRefraction ? "ด้านบน" : (topHotter ? "ด้านบนอุณหภูมิสูงกว่า" : "ด้านบนอุณหภูมิต่ำกว่า");
    const bottomTempLabel = noRefraction ? "ด้านล่าง" : (bottomHotter ? "ด้านล่างอุณหภูมิสูงกว่า" : "ด้านล่างอุณหภูมิต่ำกว่า");
    const behaviorText = noRefraction ? "ไม่เกิดการหักเหสุทธิ" : (vTop > vBottom ? "หักเหเข้าหาเส้นแนวฉาก" : "หักเหออกจากเส้นแนวฉาก");
    const effectivePreset = preset==="day" ? "day" : preset==="night" ? "night" : (bottomHotter ? "day" : topHotter ? "night" : "auto");

    vText("vizFreqLabel",freq.toFixed(0)+" Hz");
    vText("vizTempTopLabel",tempTop.toFixed(0)+" °C");
    vText("vizTempBottomLabel",tempBottom.toFixed(0)+" °C");
    vText("vizAngleLabel",theta1Deg.toFixed(0)+"°");
    vText("vizRefractionModeLabel",profile==="gradient"?"อุณหภูมิไล่ระดับ":profile==="multilayer"?"หลายชั้น":"การหักเห");
    vText("vizLayerCountLabel",`${layerCount.toFixed(0)} ชั้น`);
    vText("vizBendBoostLabel",`×${bendBoost.toFixed(1)}`);
    vText("vizTempRelationLabel",relationLabel);
    vText("vizGradientPresetLabel", preset==="auto" ? "อัตโนมัติ" : preset==="day" ? "กลางวัน" : "กลางคืน");

    panel=corePanel(ctx,w,h,"Sound Refraction (การหักเหของเสียง)");
    const xL=panel.x+22, xR=panel.x+panel.w-22, top=panel.y+18, bottom=panel.y+panel.h-18;
    const boundaryY = panel.y + panel.h*0.54;
    const spacingTop = lim(lambdaTop*85, 12, 44);
    const spacingBottom = lim(lambdaBottom*85, 12, 44);

    const colorForTemp=(T,a=.16)=>{
      const t=lim(T/45,0,1);
      const r=Math.round(36 + t*205), g=Math.round(180 - t*48), b=Math.round(248 - t*154);
      return `rgba(${r},${g},${b},${a})`;
    };
    const drawWaveSeg=(cx,cy,dx,dy,len,color,width=2)=>{
      const L=Math.hypot(dx,dy)||1;
      const px=dy/L, py=-dx/L;
      ctx.save(); ctx.strokeStyle=color; ctx.lineWidth=width; ctx.lineCap="round";
      ctx.beginPath(); ctx.moveTo(cx-px*len*.5, cy-py*len*.5); ctx.lineTo(cx+px*len*.5, cy+py*len*.5); ctx.stroke(); ctx.restore();
    };
    const drawWaveCurve=(cx,cy,dx,dy,len,curve,color,width=2)=>{
      const L=Math.hypot(dx,dy)||1;
      const px=dy/L, py=-dx/L;
      const ux=dx/L, uy=dy/L;
      const x1=cx-px*len*.5, y1=cy-py*len*.5;
      const x2=cx+px*len*.5, y2=cy+py*len*.5;
      const mx=cx+ux*curve, my=cy+uy*curve;
      ctx.save(); ctx.strokeStyle=color; ctx.lineWidth=width; ctx.lineCap="round";
      ctx.beginPath(); ctx.moveTo(x1,y1); ctx.quadraticCurveTo(mx,my,x2,y2); ctx.stroke();
      ctx.restore();
    };
    const bezierPoint=(t,p0,p1,p2,p3)=>{const u=1-t, tt=t*t, uu=u*u; return {x:uu*u*p0.x + 3*uu*t*p1.x + 3*u*tt*p2.x + tt*t*p3.x, y:uu*u*p0.y + 3*uu*t*p1.y + 3*u*tt*p2.y + tt*t*p3.y};};
    const bezierTan=(t,p0,p1,p2,p3)=>{const u=1-t; return {x:3*u*u*(p1.x-p0.x) + 6*u*t*(p2.x-p1.x) + 3*t*t*(p3.x-p2.x), y:3*u*u*(p1.y-p0.y) + 6*u*t*(p2.y-p1.y) + 3*t*t*(p3.y-p2.y)};};
    const drawAngleArc=(cx,cy,startAng,endAng,r,color,label,lx,ly)=>{ctx.save(); ctx.strokeStyle=color; ctx.lineWidth=2.35; ctx.beginPath(); ctx.arc(cx,cy,r,startAng,endAng,false); ctx.stroke(); ctx.fillStyle=color; ctx.font="bold 17px Sarabun, system-ui"; ctx.textAlign="left"; ctx.fillText(label,lx,ly); ctx.restore();};
    const drawAngleBetween=(cx,cy,a1,a2,r,color,label)=>{let start=a1,end=a2; while(end<start) end+=Math.PI*2; if(end-start>Math.PI){const t=start; start=end; end=t+Math.PI*2;} const mid=(start+end)/2; ctx.save(); ctx.strokeStyle=color; ctx.lineWidth=2.35; ctx.beginPath(); ctx.arc(cx,cy,r,start,end,false); ctx.stroke(); ctx.fillStyle=color; ctx.font="bold 16px Sarabun, system-ui"; ctx.textAlign="center"; ctx.textBaseline="middle"; ctx.fillText(label,cx+Math.cos(mid)*(r+15),cy+Math.sin(mid)*(r+15)); ctx.restore();};
    const drawArcFront=(cx,cy,r,start,end,color,width=2)=>{ctx.save(); ctx.strokeStyle=color; ctx.lineWidth=width; ctx.beginPath(); ctx.arc(cx,cy,r,start,end); ctx.stroke(); ctx.restore();};
    const drawSun=(cx,cy,r)=>{ctx.save();ctx.fillStyle="rgba(255,196,44,.95)";for(let i=0;i<10;i++){const a=i*Math.PI*2/10;ctx.beginPath();ctx.moveTo(cx+Math.cos(a)*r*1.35, cy+Math.sin(a)*r*1.35);ctx.lineTo(cx+Math.cos(a+0.12)*r*2.05, cy+Math.sin(a+0.12)*r*2.05);ctx.lineTo(cx+Math.cos(a-0.12)*r*2.05, cy+Math.sin(a-0.12)*r*2.05);ctx.closePath();ctx.fill();}ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.fill();ctx.restore();};
    const drawMoon=(cx,cy,r)=>{ctx.save();ctx.fillStyle="rgba(255,233,90,.96)";ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.fill();ctx.globalCompositeOperation="destination-out";ctx.beginPath();ctx.arc(cx+r*0.45,cy-r*0.08,r*0.92,0,Math.PI*2);ctx.fill();ctx.restore();};
    const drawStar=(cx,cy,r)=>{ctx.save();ctx.fillStyle="rgba(255,255,220,.96)";ctx.beginPath();for(let i=0;i<5;i++){const a=-Math.PI/2 + i*Math.PI*2/5;const b=a+Math.PI/5;if(i===0) ctx.moveTo(cx+Math.cos(a)*r, cy+Math.sin(a)*r); else ctx.lineTo(cx+Math.cos(a)*r, cy+Math.sin(a)*r);ctx.lineTo(cx+Math.cos(b)*r*0.45, cy+Math.sin(b)*r*0.45);}ctx.closePath();ctx.fill();ctx.restore();};
    const drawBadge=(x,y,w,h,title,lines)=>{ctx.save(); ctx.fillStyle="rgba(13,26,53,.84)"; ctx.strokeStyle="rgba(96,165,250,.34)"; roundRect(ctx,x,y,w,h,16); ctx.fill(); ctx.stroke(); ctx.textAlign="center"; ctx.fillStyle="#ff9ed2"; ctx.font="bold 17px Sarabun, system-ui"; ctx.fillText(title, x+w/2, y+24); ctx.fillStyle="#dbeafe"; ctx.font="12px Sarabun, system-ui"; let yy=y+47; for(const line of lines){ ctx.fillText(line, x+w/2, yy); yy += 18; } ctx.restore();};

    if(profile==="layer"){
      // media background
      ctx.fillStyle=colorForTemp(tempTop,.19); ctx.fillRect(xL,top,xR-xL,boundaryY-top);
      ctx.fillStyle=colorForTemp(tempBottom,.19); ctx.fillRect(xL,boundaryY,xR-xL,bottom-boundaryY);
      ctx.strokeStyle="rgba(255,255,255,.24)"; ctx.setLineDash([8,7]); ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(xL,boundaryY); ctx.lineTo(xR,boundaryY); ctx.stroke(); ctx.setLineDash([]);

      // geometry
      const srcWaveX = xL + 118, srcWaveY = top + 126; drawSpeaker(ctx, xL+4, srcWaveY, .76);
      const rayStartX = srcWaveX + 94, rayStartY = srcWaveY - 16;
      const hitX = rayStartX + (boundaryY-rayStartY) * Math.tan(theta1);
      const hitY = boundaryY;
      const outLen = 220;
      const outX = hitX + outLen * Math.sin(theta2), outY = hitY + outLen * Math.cos(theta2);
      const incidentBackAngle = Math.atan2(rayStartY-hitY, rayStartX-hitX);
      const refractedAngle = Math.atan2(outY-hitY, outX-hitX);

      // incident wavefronts, styled like reflection section
      ctx.save(); ctx.beginPath(); ctx.rect(xL, top, xR-xL, boundaryY-top); ctx.clip();
      for(let r=34, idx=0; r<548 && idx<18; r+=spacingTop, idx++){
        const alpha = lim(0.48 - idx*0.018, 0.22, 0.48);
        drawArcFront(srcWaveX, srcWaveY, r, -0.98, 0.96, `rgba(29,150,255,${alpha})`, 1.9);
      }
      ctx.restore();

      // incident ray, undeviated guide, and refracted ray
      const straightX = hitX + outLen * Math.sin(theta1);
      const straightY = hitY + outLen * Math.cos(theta1);

      ctx.save();
      ctx.strokeStyle="rgba(255,255,255,.42)";
      ctx.setLineDash([8,8]);
      ctx.lineWidth=2.1;
      ctx.beginPath(); ctx.moveTo(hitX,hitY); ctx.lineTo(straightX,straightY); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle="rgba(235,245,255,.82)";
      ctx.font="12px Sarabun, system-ui";
      ctx.textAlign="left";
      ctx.fillText("แนวเดิม", straightX-48, straightY-12);
      ctx.restore();

      ctx.save();
      ctx.lineCap="round"; ctx.lineJoin="round";
      ctx.strokeStyle="rgba(255,92,171,.98)";
      ctx.lineWidth=4.2;
      ctx.beginPath(); ctx.moveTo(rayStartX,rayStartY); ctx.lineTo(hitX,hitY); ctx.stroke();ctx.strokeStyle="rgba(124,255,124,.98)";
      ctx.beginPath(); ctx.moveTo(hitX,hitY); ctx.lineTo(outX,outY); ctx.stroke();ctx.restore();
      coreDot(ctx, hitX, hitY, 6, "#ffffff");

      // refracted wavefronts using reflection-like repeated fronts, but physically perpendicular to refracted ray
      ctx.save(); ctx.beginPath(); ctx.rect(xL, boundaryY, xR-xL, bottom-boundaryY); ctx.clip();
      const dx2 = outX-hitX, dy2 = outY-hitY;
      for(let s=spacingBottom*0.95, i=0; s<outLen-6 && i<14; s+=spacingBottom, i++){
        const u = s/outLen;
        const alpha = lim(0.46 - i*0.026, 0.18, 0.46);
        const len = lim(46 + i*2.2, 46, 66);
        drawWaveCurve(hitX + dx2*u, hitY + dy2*u, dx2, dy2, len, 7, `rgba(124,255,124,${alpha})`, 2.0);
      }
      ctx.restore();

      // wavefront labels like reflection topic
      ctx.save();
      ctx.fillStyle = "rgba(67,201,255,.96)"; ctx.font = "bold 13px Sarabun, system-ui"; ctx.textAlign = "center";
      ctx.fillText("แนวคลื่นตกกระทบ", srcWaveX+118, top+34);
      ctx.fillStyle = "rgba(124,255,124,.95)";
      const wfLabelX = hitX + (outX-hitX)*0.60 + 24;
      const wfLabelY = hitY + (outY-hitY)*0.60 - 12;
      ctx.fillText("แนวคลื่นหักเห", wfLabelX, wfLabelY);
      ctx.restore();

      if(vizState.running){ const u=(time*.06)%1; const px = u<.44 ? rayStartX+(hitX-rayStartX)*(u/.44) : hitX+(outX-hitX)*((u-.44)/.56); const py = u<.44 ? rayStartY+(hitY-rayStartY)*(u/.44) : hitY+(outY-hitY)*((u-.44)/.56); coreDot(ctx,px,py,6,"#ff5cab"); }

      // normal and angle arcs
      ctx.save(); ctx.strokeStyle="rgba(235,245,255,.78)"; ctx.setLineDash([7,7]); ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(hitX,boundaryY-112); ctx.lineTo(hitX,boundaryY+112); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle="rgba(235,245,255,.95)"; ctx.textAlign="center"; ctx.font="bold 13px Sarabun, system-ui"; ctx.fillText("Normal", hitX, boundaryY-126); ctx.font="12px Sarabun, system-ui"; ctx.fillText("(เส้นแนวฉาก)", hitX, boundaryY-110);
      drawAngleBetween(hitX,hitY,incidentBackAngle,-Math.PI/2,28,"#f6d86b","θ₁");
      drawAngleBetween(hitX,hitY,refractedAngle,Math.PI/2,28,"#bfffd1","θ₂");
      ctx.restore();

      // compact physical labels
      ctx.save(); ctx.textAlign="left";
      ctx.font="bold 12px Sarabun, system-ui"; ctx.fillStyle= topHotter ? "#ff98a8" : "#4fdcff"; ctx.fillText(topTempLabel, xR-258, top+44);
      ctx.font="11px Sarabun, system-ui"; ctx.fillText(`v₁ ≈ ${vTop.toFixed(1)} m/s`, xR-258, top+64); ctx.fillText(`λ₁ ≈ ${lambdaTop.toFixed(3)} m`, xR-258, top+81);
      ctx.font="bold 12px Sarabun, system-ui"; ctx.fillStyle= bottomHotter ? "#ff98a8" : "#4fdcff"; ctx.fillText(bottomTempLabel, xL+86, bottom-66);
      ctx.font="11px Sarabun, system-ui"; ctx.fillText(`v₂ ≈ ${vBottom.toFixed(1)} m/s`, xL+86, bottom-47); ctx.fillText(`λ₂ ≈ ${lambdaBottom.toFixed(3)} m`, xL+86, bottom-31);
      ctx.restore();
      ctx.save(); ctx.fillStyle="rgba(10,22,50,.86)"; ctx.strokeStyle="rgba(96,165,250,.34)"; roundRect(ctx,panel.x+28,panel.y+26,124,30,12); ctx.fill(); ctx.stroke(); ctx.fillStyle="#dbeafe"; ctx.font="bold 14px Sarabun, system-ui"; ctx.textAlign="center"; ctx.fillText(`f = ${freq.toFixed(0)} Hz`, panel.x+90, panel.y+46); ctx.restore();
      ctx.save();
      ctx.font="bold 12px Sarabun, system-ui";
      ctx.fillStyle="#ff8fc2"; ctx.textAlign="left";
      ctx.fillText("Incident Ray", rayStartX-18, rayStartY-12);
      ctx.fillStyle="rgba(124,255,124,.96)";
      ctx.fillText("Refracted Ray", outX-92, outY-8);
      ctx.font="bold 13px Sarabun, system-ui";
      ctx.fillStyle= theta2Deg < theta1Deg ? "#bfffd1" : "#ffd166";
      ctx.fillText(theta2Deg < theta1Deg ? "เข้าหา Normal" : "ออกจาก Normal", hitX+34, hitY+32);
      ctx.restore();
      // angle summary cards: keep them away from the refracted ray
      const thetaCardW = 200, thetaCardH = 56;
      const thetaCardX = xR - thetaCardW - 16;
      const theta1CardY = top + 92;
      const theta2CardY = (theta2Deg > 36 || outX > xR - 170) ? top + 154 : bottom - 76;
      coreMetricCard(ctx, thetaCardX, theta1CardY, thetaCardW, thetaCardH, "มุมตกกระทบ", `θ₁ ≈ ${theta1Deg.toFixed(1)}°`, "วัดจากเส้นแนวฉาก", "#f6d86b");
      coreMetricCard(ctx, thetaCardX, theta2CardY, thetaCardW, thetaCardH, "มุมหักเห", noRefraction?"θ₂ = θ₁":`θ₂ ≈ ${theta2Deg.toFixed(1)}°`, "วัดจากเส้นแนวฉาก", "#9dffcb");

    } else if(profile==="multilayer"){
      // multilayer approximation: many thin horizontal layers, each pair causes a small refraction
      const groundH = 22, skyH = bottom-top-groundH;
      const N = Math.min(6, Math.max(3, Math.round(layerCount)));
      const layerH = skyH / N;
      const tempAtFrac = frac => tempTop + (tempBottom-tempTop)*frac;
      const speedAtFrac = frac => 331 + 0.6*tempAtFrac(frac);
      for(let i=0;i<N;i++){
        const frac0=i/N, frac1=(i+1)/N;
        const y0=top + frac0*skyH;
        ctx.fillStyle=colorForTemp(tempAtFrac((frac0+frac1)*0.5), .19);
        ctx.fillRect(xL, y0, xR-xL, layerH+1);
        ctx.strokeStyle="rgba(255,255,255,.12)";
        ctx.lineWidth=1;
        ctx.beginPath(); ctx.moveTo(xL, y0); ctx.lineTo(xR, y0); ctx.stroke();
      }
      ctx.fillStyle="rgba(110,72,56,.96)"; ctx.fillRect(xL,bottom-groundH,xR-xL,groundH);
      ctx.fillStyle="rgba(240,244,250,.86)"; ctx.font="bold 14px Sarabun, system-ui"; ctx.fillText("ground", xR-76, bottom-5);
      const srcX = xL+132, srcY = bottom-groundH-10; drawSpeaker(ctx, xL+6, srcY, .78);
      const startX = srcX, startY = srcY;
      const startFrac = 1 - ((srcY-top)/skyH); // closer to bottom => near 1
      const vStart = speedAtFrac(lim((srcY-top)/skyH,0,1));
      const cConst = Math.sin(theta1) / Math.max(vStart,1);
      const pts=[{x:startX,y:startY,theta:theta1,v:vStart,layer:N-1}];
      const noRefXEnd = startX + (startY-top) * Math.tan(theta1);
      const noRefYEnd = top;
      let currX=startX, currY=startY;
      // Build polyline upward through each interface
      for(let j=N-1;j>=0;j--){
        const yTopLayer = top + j*layerH;
        const fracMid = lim((j+0.5)/N,0,1);
        const vMid = speedAtFrac(fracMid);
        const sinLocal = lim(cConst * vMid, -0.999, 0.999);
        const thetaLocal = Math.asin(sinLocal);
        const dy = currY - yTopLayer;
        const dx = dy * Math.tan(thetaLocal);
        currX += dx;
        currY = yTopLayer;
        pts.push({x:currX, y:currY, theta:thetaLocal, v:vMid, layer:j});
      }
      const displayPts = pts.map(p=>{
        const straightAtY = startX + (startY-p.y) * Math.tan(theta1);
        return {...p, x: straightAtY + (p.x-straightAtY) * bendBoost};
      });
      // dashed guide if no refraction
      ctx.save();
      ctx.strokeStyle="rgba(255,255,255,.42)"; ctx.setLineDash([8,8]); ctx.lineWidth=2;
      ctx.beginPath(); ctx.moveTo(startX,startY); ctx.lineTo(noRefXEnd,noRefYEnd); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle="rgba(235,245,255,.82)"; ctx.font="12px Sarabun, system-ui"; ctx.textAlign="left";
      ctx.fillText("แนวเดิม", noRefXEnd-46, noRefYEnd+16);
      ctx.restore();
      // actual ray polyline
      ctx.save(); ctx.strokeStyle="rgba(255,92,171,.98)"; ctx.lineWidth=4.1; ctx.lineCap="round"; ctx.lineJoin="round";
      ctx.beginPath(); ctx.moveTo(displayPts[0].x, displayPts[0].y); for(let i=1;i<displayPts.length;i++) ctx.lineTo(displayPts[i].x, displayPts[i].y); ctx.stroke();
      const pA=displayPts[displayPts.length-2]||displayPts[0], pB=displayPts[displayPts.length-1];ctx.restore();
      // local-angle labels are intentionally hidden in final display to keep the canvas clean
      const sampleIdx=[];
      // wavefronts along selected segments
      for(let i=0;i<displayPts.length-1;i++){
        const p1=displayPts[i], p2=displayPts[i+1];
        const dx=p2.x-p1.x, dy=p2.y-p1.y, seg=Math.hypot(dx,dy)||1;
        const frac = lim((p1.y-top)/skyH, 0, 1);
        const lambdaLocal = speedAtFrac(frac) / Math.max(freq,1);
        const step = lim(lambdaLocal*95, 16, 42);
        for(let s=step*0.75; s<seg-8; s+=step){
          const u=s/seg; const cx=p1.x+dx*u, cy=p1.y+dy*u;
          const alpha=lim(0.44 - i*0.025, 0.14, 0.44);
          drawWaveCurve(cx,cy,dx,dy,44,5,`rgba(124,255,124,${alpha})`,1.9);
        }
      }
      // incident fronts near source
      for(let r=24, i=0; r<104 && i<6; r+=lim((speedAtFrac(0.92)/Math.max(freq,1))*95,16,42), i++){
        const alpha=lim(0.38-i*0.028,0.18,0.38);
        drawArcFront(startX-18, startY-8, r, -1.38, -0.10, `rgba(29,150,255,${alpha})`, 1.85);
      }
      // labels
      ctx.save(); ctx.textAlign="center"; ctx.font="bold 13px Sarabun, system-ui"; ctx.fillStyle="rgba(67,201,255,.96)"; ctx.fillText("แนวคลื่นเริ่มต้น", startX+96, startY-104); ctx.fillStyle="rgba(124,255,124,.95)"; const midIdx=Math.max(1,Math.floor((displayPts.length-1)*0.55)); const mid1=displayPts[midIdx-1], mid2=displayPts[midIdx]; ctx.fillText("แนวคลื่นจากการหักเหต่อเนื่อง", (mid1.x+mid2.x)/2 + 54, (mid1.y+mid2.y)/2 - 16); ctx.restore();
      if(vizState.running){ const nSeg=displayPts.length-1; const prog=(time*.05)%1; const fSeg=prog*nSeg; const idx=Math.min(nSeg-1, Math.floor(fSeg)); const u=fSeg-idx; const p1=displayPts[idx], p2=displayPts[idx+1]; coreDot(ctx,p1.x+(p2.x-p1.x)*u,p1.y+(p2.y-p1.y)*u,6,"#ff5cab"); }
      // side labels
      ctx.save(); ctx.textAlign="left";
      ctx.font="bold 12px Sarabun, system-ui"; ctx.fillStyle = topHotter ? "#ff98a8" : "#4fdcff"; ctx.fillText(topTempLabel, xR-290, top+56);
      ctx.font="11px Sarabun, system-ui"; ctx.fillText(`v ≈ ${vTop.toFixed(1)} m/s`, xR-290, top+80); ctx.fillText(`λ ≈ ${lambdaTop.toFixed(3)} m`, xR-290, top+101);
      ctx.font="bold 12px Sarabun, system-ui"; ctx.fillStyle = bottomHotter ? "#ff98a8" : "#4fdcff"; ctx.fillText(bottomTempLabel, xL+88, bottom-74);
      ctx.font="11px Sarabun, system-ui"; ctx.fillText(`v ≈ ${vBottom.toFixed(1)} m/s`, xL+88, bottom-52); ctx.fillText(`λ ≈ ${lambdaBottom.toFixed(3)} m`, xL+88, bottom-31); ctx.restore();
      ctx.save(); ctx.fillStyle="rgba(10,22,50,.86)"; ctx.strokeStyle="rgba(96,165,250,.34)"; roundRect(ctx,panel.x+28,panel.y+26,124,30,12); ctx.fill(); ctx.stroke(); ctx.fillStyle="#dbeafe"; ctx.font="bold 14px Sarabun, system-ui"; ctx.textAlign="center"; ctx.fillText(`f = ${freq.toFixed(0)} Hz`, panel.x+90, panel.y+46); ctx.restore();
      ctx.save(); ctx.fillStyle="rgba(13,26,53,.84)"; ctx.strokeStyle="rgba(251,191,36,.36)"; roundRect(ctx,panel.x+160,panel.y+26,236,30,12); ctx.fill(); ctx.stroke(); ctx.fillStyle="#ffd166"; ctx.font="bold 12px Sarabun, system-ui"; ctx.textAlign="center"; ctx.fillText(`ขยายภาพ ×${bendBoost.toFixed(1)} (ไม่ใช่ค่าจริง)`, panel.x+278, panel.y+46); ctx.restore();
      ctx.save(); ctx.font="bold 12px Sarabun, system-ui"; ctx.textAlign="left"; ctx.fillStyle="#ff8fc2"; ctx.fillText("Multi-layer Ray", startX-12, startY-18); ctx.restore();
      drawBadge(xR-218, top+44, 196, 106, `${N} ชั้น`, [`ΔT ≈ ${((Math.abs(tempBottom-tempTop))/Math.max(N-1,1)).toFixed(1)}°C/ชั้น`, bottomHotter ? "θ ลดลง → เข้าหา Normal" : topHotter ? "θ เพิ่มขึ้น → ออกจาก Normal" : "อุณหภูมิเท่ากัน", "ขยายภาพเพื่อการสอน"]);

    } else {
      // gradient scene
      const groundH = 22, skyH = bottom-top-groundH;
      for(let i=0;i<30;i++){
        const frac=i/29, T=tempTop + (tempBottom-tempTop)*frac, y=top + frac*skyH;
        ctx.fillStyle=colorForTemp(T,.20); ctx.fillRect(xL,y,xR-xL,skyH/29+2);
      }
      ctx.fillStyle="rgba(110,72,56,.96)"; ctx.fillRect(xL,bottom-groundH,xR-xL,groundH);
      ctx.save();
      ctx.fillStyle="rgba(10,22,50,.30)";
      ctx.fillRect(xL,top,xR-xL,58);
      ctx.fillStyle="#eefaff";
      ctx.font="bold 18px Sarabun, system-ui";
      ctx.textAlign="left";
      ctx.fillText(topHotter ? "Tบน สูงกว่า" : bottomHotter ? "Tล่าง สูงกว่า" : "T คงที่", xL+14, top+28);
      ctx.restore();
      ctx.fillStyle="rgba(240,244,250,.86)"; ctx.font="bold 14px Sarabun, system-ui"; ctx.fillText("ground", xR-76, bottom-5);
      const srcX = xL+132, srcY = bottom-groundH-10; drawSpeaker(ctx, xL+6, srcY, .78);
      const p0 = {x:srcX, y:srcY};
      const gradAmount = lim(Math.abs(tempBottom-tempTop)/45, 0, 1);
      const targetY = top + 82;
      const maxSteps = 30;
      const speedAtY = y => {
        const frac = lim((y-top)/skyH, 0, 1);
        return 331 + 0.6*(tempTop + (tempBottom-tempTop)*frac);
      };
      const straightAtY = y => p0.x + (p0.y-y)*Math.tan(theta1);
      const vStartGrad = Math.max(speedAtY(p0.y), 1);
      const snellConst = Math.sin(theta1) / vStartGrad;

      // Build the physical ray by treating the continuous temperature field as many very thin horizontal layers.
      // sin(theta)/v is conserved locally; theta is measured from the local normal.
      const rawPts = [{x:p0.x, y:p0.y, theta:theta1}];
      let currX = p0.x, currY = p0.y;
      const stepY = (p0.y-targetY) / maxSteps;
      for(let i=1;i<=maxSteps;i++){
        const nextY = p0.y - stepY*i;
        const midY = (currY + nextY) * 0.5;
        const vLocal = speedAtY(midY);
        const thetaLocal = noRefraction ? theta1 : Math.asin(lim(snellConst*vLocal, -0.98, 0.98));
        const dy = currY - nextY;
        currX += dy * Math.tan(thetaLocal);
        currY = nextY;
        rawPts.push({x:currX, y:currY, theta:thetaLocal});
        if(currX > xR-58) break;
      }

      // Keep the physically computed trend, but visually amplify only the deviation from the straight guide.
      const gradVisualBoost = noRefraction ? 1 : lim(1 + gradAmount*2.2, 1.25, 2.85);
      const displayPts = rawPts.map(p=>{
        const sx = straightAtY(p.y);
        return {x:lim(sx + (p.x-sx)*gradVisualBoost, xL+24, xR-36), y:p.y, theta:p.theta};
      });
      const lastPt = displayPts[displayPts.length-1];
      const guideEndX = straightAtY(lastPt.y);

      // straight guide so students can compare bending trend
      if(!noRefraction){
        ctx.save();
        ctx.strokeStyle="rgba(255,255,255,.34)";
        ctx.setLineDash([8,8]);
        ctx.lineWidth=2;
        ctx.beginPath();
        ctx.moveTo(p0.x,p0.y);
        ctx.lineTo(guideEndX,lastPt.y);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle="rgba(235,245,255,.78)";
        ctx.font="12px Sarabun, system-ui";
        ctx.textAlign="left";
        ctx.fillText("แนวเดิม", guideEndX-58, lastPt.y-10);
        ctx.restore();
      }

      // ray
      ctx.save();
      ctx.strokeStyle="rgba(255,92,171,.98)";
      ctx.lineWidth=4;
      ctx.lineCap="round";
      ctx.lineJoin="round";
      ctx.beginPath();
      ctx.moveTo(displayPts[0].x, displayPts[0].y);
      for(let i=1;i<displayPts.length;i++) ctx.lineTo(displayPts[i].x, displayPts[i].y);
      ctx.stroke();
      ctx.restore();

      // incident-style fronts near source
      for(let r=24, i=0; r<112 && i<7; r+=spacingBottom*0.95, i++){
        const alpha=lim(0.38-i*0.028,0.18,0.38);
        drawArcFront(srcX-18, srcY-8, r, -1.38, -0.10, `rgba(29,150,255,${alpha})`, 1.85);
      }

      // wavefronts along the ray, perpendicular to the local tangent
      for(let i=3;i<displayPts.length-1;i+=4){
        const a=displayPts[i-1], b=displayPts[i+1];
        const p=displayPts[i];
        const interp = lambdaBottom + (lambdaTop-lambdaBottom) * lim((p0.y-p.y)/(p0.y-targetY), 0, 1);
        const segLen = lim(42 + interp*28, 42, 58);
        const alpha=lim(0.44-i*0.014,0.17,0.44);
        drawWaveCurve(p.x,p.y,b.x-a.x,b.y-a.y,segLen,5,`rgba(124,255,124,${alpha})`,1.95);
      }

      // labels
      ctx.save();
      ctx.textAlign="center";
      ctx.font="bold 13px Sarabun, system-ui";
      ctx.fillStyle="rgba(67,201,255,.96)";
      ctx.fillText("แนวคลื่นเริ่มต้น", srcX+86, srcY-110);
      ctx.fillStyle="rgba(124,255,124,.95)";
      const mid = displayPts[Math.max(1, Math.floor(displayPts.length*0.58))];
      ctx.fillText(noRefraction ? "แนวคลื่นเสียง" : "แนวคลื่นหักเห", mid.x+34, mid.y-18);
      ctx.restore();

      if(vizState.running){
        const nSeg=displayPts.length-1;
        const prog=(time*.055)%1;
        const fSeg=prog*nSeg;
        const idx=Math.min(nSeg-1, Math.floor(fSeg));
        const u=fSeg-idx;
        const a=displayPts[idx], b=displayPts[idx+1];
        coreDot(ctx,a.x+(b.x-a.x)*u,a.y+(b.y-a.y)*u,6,"#ff5cab");
      }
      ctx.save();
      const topInfoX = xL + (xR-xL)*0.56;
      const bottomInfoX = xL + 216;
      ctx.textAlign="center";
      ctx.font="bold 12px Sarabun, system-ui";
      ctx.fillStyle = noRefraction ? "#dbeafe" : (topHotter ? "#ff98a8" : "#4fdcff");
      ctx.fillText(topTempLabel, topInfoX, top+50);
      ctx.font="11px Sarabun, system-ui";
      ctx.fillText(`v ≈ ${vTop.toFixed(1)} m/s`, topInfoX, top+70);
      ctx.fillText(`λ ≈ ${lambdaTop.toFixed(3)} m`, topInfoX, top+87);
      ctx.textAlign="left";
      ctx.font="bold 12px Sarabun, system-ui";
      ctx.fillStyle = noRefraction ? "#dbeafe" : (bottomHotter ? "#ff98a8" : "#4fdcff");
      ctx.fillText(bottomTempLabel, bottomInfoX, bottom-66);
      ctx.font="11px Sarabun, system-ui";
      ctx.fillText(`v ≈ ${vBottom.toFixed(1)} m/s`, bottomInfoX, bottom-47);
      ctx.fillText(`λ ≈ ${lambdaBottom.toFixed(3)} m`, bottomInfoX, bottom-30);
      ctx.restore();
      ctx.save(); ctx.fillStyle="rgba(10,22,50,.86)"; ctx.strokeStyle="rgba(96,165,250,.34)"; roundRect(ctx,panel.x+28,panel.y+26,124,30,12); ctx.fill(); ctx.stroke(); ctx.fillStyle="#dbeafe"; ctx.font="bold 14px Sarabun, system-ui"; ctx.textAlign="center"; ctx.fillText(`f = ${freq.toFixed(0)} Hz`, panel.x+90, panel.y+46); ctx.restore();
      const gradientBadgeLines = noRefraction
        ? ["อุณหภูมิเท่ากัน", "ไม่เกิดการหักเห", "แนวรังสีเป็นเส้นตรง"]
        : [topHotter ? "เบนเข้าหาด้านล่างที่ช้ากว่า" : "เบนเข้าหาด้านบนที่ช้ากว่า", "เส้นประ = แนวเดิม", "ภาพเชิงแนวคิด"];
      drawBadge(xR-206, top+44, 190, noRefraction?116:124, "อุณหภูมิไล่ระดับ", gradientBadgeLines);
    }

  } else if(mode==="soundDiffraction"){

    const slit=vNum("vizSlit",1), freq=vNum("vizFreq",600); vText("vizSlitLabel",slit.toFixed(1)+" λ"); vText("vizFreqLabel",freq.toFixed(0)+" Hz");
    panel=corePanel(ctx,w,h,"Sound Diffraction (การเลี้ยวเบนของเสียง)"); cx=w/2; cy=panel.y+panel.h*.52;
    const bx=cx-75, gap=lim(78*slit,34,190); drawSpeaker(ctx,panel.x+110,cy,.85);
    for(let i=0;i<8;i++){ const x=panel.x+160+i*38+((time*18)%38); ctx.strokeStyle=`rgba(34,211,238,${.78-i*.06})`; ctx.lineWidth=2.2; ctx.beginPath(); ctx.moveTo(x,cy-115); ctx.lineTo(x,cy+115); ctx.stroke(); }
    ctx.strokeStyle="rgba(255,255,255,.64)"; ctx.lineWidth=8; ctx.beginPath(); ctx.moveTo(bx,panel.y+45); ctx.lineTo(bx,cy-gap/2); ctx.stroke(); ctx.beginPath(); ctx.moveTo(bx,cy+gap/2); ctx.lineTo(bx,panel.y+panel.h-45); ctx.stroke();
    const spread=slit<.8?1.35:slit<1.5?1.05:.72; coreArcs(ctx,bx,cy,10,32,"rgba(255,92,171,.88)",-spread,spread,(time*18)%32);
    coreMetricCard(ctx,panel.x+38,panel.y+panel.h-100,230,76,"เงื่อนไขเห็นชัด",`a = ${slit.toFixed(1)}λ`,"เมื่อ a ≈ λ เลี้ยวเบนเด่น","#ff5cab");

  } else if(mode==="soundInterference"){
    const sep=vNum("vizSeparation",.8), ph=vNum("vizPhaseDiff",0); vText("vizSeparationLabel",sep.toFixed(2)+" m"); vText("vizPhaseDiffLabel",ph.toFixed(0)+"°");
    panel=corePanel(ctx,w,h,"Sound Interference (การแทรกสอดของเสียง)"); cx=w/2; cy=panel.y+panel.h*.52;
    const sx=panel.x+150, s1=cy-78*sep, s2=cy+78*sep; drawSpeaker(ctx,sx,s1,.7); drawSpeaker(ctx,sx,s2,.7);
    coreArcs(ctx,sx,s1,11,31,"rgba(34,211,238,.78)",-1.2,1.2,(time*20)%31); coreArcs(ctx,sx,s2,11,31,"rgba(255,92,171,.72)",-1.2,1.2,(time*20+ph/8)%31);
    for(let i=0;i<9;i++){ const x=cx-20+i*45, y=cy+Math.sin(i*1.7+ph*Math.PI/180)*95; coreDot(ctx,x,y,4,i%2?"#ff5cab":"#22d3ee"); }
    coreMetricCard(ctx,cx+85,cy-112,300,82,"เงื่อนไขเฟสตรงกัน","ดัง: Δr = mλ","ค่อย: Δr = (m+1/2)λ","#22d3ee");

  } else if(mode==="superposition"){
    const f=vNum("vizFreq",440), A=vNum("vizAmp",.8), ph=vNum("vizPhaseDiff",0)*Math.PI/180; vText("vizFreqLabel",f.toFixed(0)+" Hz"); vText("vizAmpLabel",A.toFixed(2)); vText("vizPhaseDiffLabel",(ph*180/Math.PI).toFixed(0)+"°");
    panel=corePanel(ctx,w,h,"Superposition (การซ้อนทับของคลื่น)"); const x0=panel.x+80,x1=panel.x+panel.w-70,y1=panel.y+110,y2=panel.y+205,y3=panel.y+300, W=x1-x0;
    function plot(ybase, phase, col, amp=A*28){ const pts=[]; for(let i=0;i<=W;i+=4){ const x=x0+i; const y=ybase-Math.sin(i/70-time*3+phase)*amp; pts.push([x,y]); } coreWaveLine(ctx,pts,col,2.6); }
    plot(y1,0,"#22d3ee"); plot(y2,ph,"#ff5cab");
    const pts=[]; for(let i=0;i<=W;i+=4){ const y=y3-(Math.sin(i/70-time*3)+Math.sin(i/70-time*3+ph))*A*22; pts.push([x0+i,y]); } coreWaveLine(ctx,pts,"#fbbf24",3.3);
    ctx.fillStyle="#e8f5ff"; ctx.font="bold 15px Sarabun"; ctx.fillText("คลื่น 1",x0,y1-42); ctx.fillText("คลื่น 2",x0,y2-42); ctx.fillText("ผลรวม y = y₁ + y₂",x0,y3-45);

  } else if(mode==="beatsViz"){
    const f1=vNum("vizFreq",440), f2=vNum("vizFreq2",444), A=vNum("vizAmp",.9), fb=Math.abs(f2-f1); vText("vizFreqLabel",f1.toFixed(0)+" Hz"); vText("vizFreq2Label",f2.toFixed(0)+" Hz"); vText("vizAmpLabel",A.toFixed(2));
    panel=corePanel(ctx,w,h,"Beats (บีตส์)"); const x0=panel.x+80,x1=panel.x+panel.w-80,y=panel.y+panel.h*.52,W=x1-x0;
    const pts=[], envTop=[], envBot=[]; for(let i=0;i<=W;i+=3){ const x=x0+i, t=i/90-time*2.0, env=Math.cos((f2-f1)*i/1600)*A*65; pts.push([x,y-Math.sin(t*f1/90)*env]); envTop.push([x,y-Math.abs(env)]); envBot.push([x,y+Math.abs(env)]); }
    coreWaveLine(ctx,envTop,"rgba(251,191,36,.8)",2); coreWaveLine(ctx,envBot,"rgba(251,191,36,.8)",2); coreWaveLine(ctx,pts,"#22d3ee",2.4);
    coreMetricCard(ctx,panel.x+38,panel.y+panel.h-104,220,78,"ความถี่บีต",`f_b = ${fb.toFixed(0)} Hz`,"|f₂ - f₁|","#fbbf24");

  } else if(mode==="standingAir"){
    const n=Math.round(vNum("vizTubeMode",2)), typ=vSel("vizSubMode","open"); vText("vizTubeModeLabel",String(n)); vText("vizSubModeLabel",typ);
    panel=corePanel(ctx,w,h,"Standing Wave (คลื่นนิ่ง)"); const left=panel.x+105,right=panel.x+panel.w-105,y=panel.y+panel.h*.50,W=right-left;
    ctx.strokeStyle="rgba(255,255,255,.44)"; ctx.lineWidth=3; roundRect(ctx,left,y-48,W,96,16); ctx.stroke();
    const pts=[]; for(let i=0;i<=W;i+=4){ const x=left+i, u=i/W; let shape=typ==="closed"?Math.sin((2*n-1)*Math.PI*u/2):Math.cos(n*Math.PI*u); pts.push([x,y-shape*55*Math.sin(time*3)]); } coreWaveLine(ctx,pts,"#22d3ee",3.2);
    for(let k=0;k<=n;k++){ const x=left+(k/n)*W; coreDot(ctx,x,y,4,k%2?"#ff5cab":"#22d3ee"); }
    coreMetricCard(ctx,panel.x+38,panel.y+panel.h-100,260,76,"โหมดคลื่นนิ่ง",`${typ}, n=${n}`,"กราฟนี้แสดงการกระจัดของอากาศ","#22d3ee");

  } else if(mode==="resonanceViz" || mode==="resonanceAirHarmonics"){
    const n=Math.round(vNum("vizTubeMode",1)), L=vNum("vizLength",.8), typ=vSel("vizSubMode","closed"), f=vNum("vizFreq",440);
    vText("vizTubeModeLabel",String(n)); vText("vizLengthLabel",L.toFixed(2)+" m"); vText("vizSubModeLabel",typ); vText("vizFreqLabel",f.toFixed(0)+" Hz");
    panel=corePanel(ctx,w,h,mode==="resonanceViz"?"Resonance in Air Column":"Resonance Harmonic Modes"); const left=panel.x+100,right=panel.x+panel.w-100,y=panel.y+panel.h*.46,W=right-left;
    ctx.strokeStyle="rgba(255,255,255,.44)"; ctx.lineWidth=4; roundRect(ctx,left,y-42,W,84,14); ctx.stroke(); if(typ==="closed"){ ctx.fillStyle="rgba(255,255,255,.55)"; ctx.fillRect(left-8,y-44,10,88); }
    let modeN = n;
    if(mode==="resonanceViz"){
      if(typ==="closed"){
        const oddIndex = Math.max(1, Math.round((4*L*f/343 + 1)/2));
        modeN = oddIndex;
      }else{
        modeN = Math.max(1, Math.round(2*L*f/343));
      }
    }
    const fn = typ==="closed" ? ((2*modeN-1)*343/(4*L)) : (modeN*343/(2*L));
    const pts=[]; for(let i=0;i<=W;i+=4){ const u=i/W; const k=typ==="closed"?(2*modeN-1)*Math.PI/2:modeN*Math.PI; const shape=typ==="closed"?Math.sin(k*u):Math.cos(k*u); pts.push([left+i,y-shape*54*Math.sin(time*3)]); } coreWaveLine(ctx,pts,"#22d3ee",3.2);
    const response=mode==="resonanceViz"?Math.exp(-Math.pow((f-fn)/(Math.max(18,fn*.10)),2)):.85; coreBar(ctx,panel.x+330,panel.y+panel.h-75,360,14,response,"#fbbf24");
    const formula = typ==="closed" ? "fₙ=(2n−1)v/4L" : "fₙ=nv/2L";
    coreMetricCard(ctx,panel.x+38,panel.y+panel.h-104,300,80,"โหมดในท่อ",`${formula}` ,`การกระจัดอากาศ: n=${modeN}, fₙ≈${fn.toFixed(0)} Hz`,"#fbbf24");

  } else if(mode==="dopplerViz"){
    const vs=vNum("vizSpeed",.35), f=vNum("vizFreq",520); vText("vizSpeedLabel",vs.toFixed(2)+" v"); vText("vizFreqLabel",f.toFixed(0)+" Hz");
    panel=corePanel(ctx,w,h,"Doppler Effect (ปรากฏการณ์ดอปเพลอร์)"); cx=panel.x+panel.w*.48; cy=panel.y+panel.h*.52; const sx=cx+Math.sin(time*.8)*55;
    ctx.fillStyle="#e8f5ff"; ctx.font="bold 34px Sarabun"; ctx.textAlign="center"; ctx.fillText("🚗",sx,cy+10); coreArrow(ctx,sx-90,cy,sx-20,cy,"#22d3ee",3);
    for(let i=1;i<13;i++){ const rr=i*(34-vs*14)+(time*18%30); ctx.strokeStyle=`rgba(34,211,238,${lim(.75-i*.045,.16,.75)})`; ctx.lineWidth=2; ctx.beginPath(); ctx.ellipse(sx+vs*rr*.65,cy,rr,rr*.7,0,0,Math.PI*2); ctx.stroke(); }
    const fFront = f/(1-Math.min(vs,.95));
    const fBack = f/(1+Math.min(vs,.95));
    coreMetricCard(ctx,panel.x+38,panel.y+panel.h-104,285,80,"Doppler: ผู้สังเกตนิ่ง",`หน้า ≈ ${fFront.toFixed(0)} Hz` ,`หลัง ≈ ${fBack.toFixed(0)} Hz; f′=f v/(v∓vₛ)`,"#22d3ee");

  } else if(mode==="shockWave"){
    const M=vNum("vizMach",1.5), v=vNum("vizSpeed",343); vText("vizMachLabel",M.toFixed(2)); vText("vizSpeedLabel",v.toFixed(0)+" m/s");
    panel=corePanel(ctx,w,h,"Shock Wave / Sonic Boom"); cx=w/2; cy=panel.y+panel.h*.52; const theta=Math.asin(1/Math.max(M,1.01)), sx=cx+105;
    coreArrow(ctx,panel.x+110,cy,sx,cy,"#22d3ee",3); ctx.fillStyle="#e8f5ff"; ctx.font="bold 34px Sarabun"; ctx.textAlign="center"; ctx.fillText("✈️",sx,cy+10);
    ctx.strokeStyle="#c084fc"; ctx.lineWidth=4; ctx.beginPath(); ctx.moveTo(sx,cy); ctx.lineTo(sx-360,cy-Math.tan(theta)*360); ctx.stroke(); ctx.beginPath(); ctx.moveTo(sx,cy); ctx.lineTo(sx-360,cy+Math.tan(theta)*360); ctx.stroke();
    coreArcs(ctx,sx,cy,9,30,"rgba(34,211,238,.42)",2.55,3.75,(time*18)%30);
    coreMetricCard(ctx,panel.x+38,panel.y+panel.h-104,245,80,"กรวยมัค",`sin θ = 1/M`,"เกิดเมื่อ M > 1","#c084fc");

  } else if(mode==="soundIntensity" || mode==="soundIntensityLevel"){
    const r=vNum("vizDistance",5), P=vNum("vizPower",1), logI=vNum("vizIntensity",-5); vText("vizDistanceLabel",r.toFixed(1)+" m"); vText("vizPowerLabel",P.toFixed(1)+" W"); vText("vizIntensityLabel",`1.0×10^${logI.toFixed(1)} W/m²`);
    const I=mode==="soundIntensityLevel"?Math.pow(10,logI):P/(4*Math.PI*r*r), beta=10*Math.log10(I/1e-12);
    panel=corePanel(ctx,w,h,mode==="soundIntensity"?"Sound Intensity (ความเข้มเสียง)":"Sound Intensity Level (ระดับความเข้มเสียง)"); cy=panel.y+panel.h*.48; const sx=panel.x+130; drawSpeaker(ctx,sx,cy,.9); coreArcs(ctx,sx,cy,10,42,"rgba(34,211,238,.65)",-.9,.9,(time*18)%42);
    const mx=sx+lim(r*38,80,panel.w-185); coreDot(ctx,mx,cy,7,"#ff5cab"); ctx.strokeStyle="rgba(255,92,171,.5)"; ctx.setLineDash([7,6]); ctx.beginPath(); ctx.moveTo(sx+30,cy+58); ctx.lineTo(mx,cy+58); ctx.stroke(); ctx.setLineDash([]);
    const title=mode==="soundIntensity"?"I = P/(4πr²)":`β ≈ ${beta.toFixed(0)} dB`; coreMetricCard(ctx,panel.x+38,panel.y+panel.h-104,260,80,mode==="soundIntensity"?"ความเข้มเสียง":"ระดับความเข้มเสียง",title,mode==="soundIntensity"?"ลดลงตาม 1/r²":"β = 10 log₁₀(I/I₀)","#ff5cab");
    coreBar(ctx,panel.x+340,panel.y+panel.h-70,380,14,lim(beta/130,0,1),"#fbbf24");

  } else if(mode==="soundLevelHearing"){
    const f=vNum("vizFreq",1000), level=vNum("vizLevel",60); vText("vizFreqLabel",f>=1000?(f/1000).toFixed(1)+" kHz":f.toFixed(0)+" Hz"); vText("vizLevelLabel",level.toFixed(0)+" dB");
    panel=corePanel(ctx,w,h,"Sound Level, Frequency and Hearing"); const x0=panel.x+90,y0=panel.y+panel.h-70,x1=panel.x+panel.w-80,y1=panel.y+65;
    ctx.strokeStyle="#22d3ee"; ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(x0,y0); ctx.lineTo(x0,y1); ctx.lineTo(x1,y1); ctx.stroke();
    ctx.fillStyle="rgba(34,211,238,.16)"; ctx.beginPath(); ctx.moveTo(x0+55,y0-20); ctx.bezierCurveTo(x0+125,y1+75,x1-160,y1+55,x1-65,y0-60); ctx.lineTo(x1-65,y1+35); ctx.bezierCurveTo(x1-180,y1+20,x0+150,y1+20,x0+55,y1+60); ctx.closePath(); ctx.fill();
    const lx=(Math.log10(lim(f,20,20000))-Math.log10(20))/(Math.log10(20000)-Math.log10(20)), px=x0+lx*(x1-x0), py=y0-(level/130)*(y0-y1); coreDot(ctx,px,py,8,"#ff5cab");
    coreMetricCard(ctx,panel.x+38,panel.y+panel.h-104,310,80,"การได้ยินมนุษย์","20 Hz – 20 kHz","ไวมากประมาณ 2–5 kHz","#22d3ee");

  } else if(mode==="harmonicsViz"){
    const f0=vNum("vizFreq",220), mix=vNum("vizHarmonicMix",.55), inst=vSel("vizInstrument","violin"); vText("vizFreqLabel",f0.toFixed(0)+" Hz"); vText("vizHarmonicMixLabel",mix.toFixed(2)); vText("vizInstrumentLabel",inst);
    panel=corePanel(ctx,w,h,"Harmonics and Timbre (ฮาร์มอนิกและคุณภาพเสียง)"); const x0=panel.x+80,x1=panel.x+panel.w-80,y=panel.y+142,W=x1-x0;
    const harmonics=inst==="sine"?[1,0,0,0]:inst==="clarinet"?[1,0,.55*mix,0,.32*mix]:inst==="square"?[1,0,.65*mix,0,.38*mix]:[1,.55*mix,.38*mix,.25*mix,.16*mix];
    const pts=[]; for(let i=0;i<=W;i+=3){ let yy=0; harmonics.forEach((a,k)=>{ if(a) yy+=a*Math.sin((i/75-time*2)*(k+1)); }); pts.push([x0+i,y-yy*28]); } coreWaveLine(ctx,pts,"#22d3ee",2.6);
    harmonics.forEach((a,k)=>{ const bx=x0+k*72, bh=a*110; ctx.fillStyle=k===0?"#22d3ee":"#ff5cab"; roundRect(ctx,bx,panel.y+panel.h-80-bh,34,bh,7); ctx.fill(); ctx.fillStyle="#e8f5ff"; ctx.font="12px Sarabun"; ctx.textAlign="center"; ctx.fillText(String(k+1),bx+17,panel.y+panel.h-55); });
    coreMetricCard(ctx,panel.x+38,panel.y+panel.h-104,245,80,"คุณภาพเสียง",inst,"ขึ้นกับ harmonic spectrum","#22d3ee");

  } else if(mode==="noisePollution"){
    const source=vNum("vizSourceLevel",85), prot=vNum("vizProtection",15), after=lim(source-prot,0,140); vText("vizSourceLevelLabel",source.toFixed(0)+" dB"); vText("vizProtectionLabel",prot.toFixed(0)+" dB");
    panel=corePanel(ctx,w,h,"Noise Pollution and Protection"); const base=panel.y+panel.h-88,left=panel.x+90,right=panel.x+panel.w-90;
    [50,70,85,100,115].forEach((lv,i)=>{ const x=left+i*(right-left)/4,bh=(lv-35)*2.2; ctx.fillStyle=lv>=90?"rgba(255,77,109,.75)":lv>=75?"rgba(251,191,36,.72)":"rgba(34,211,238,.65)"; roundRect(ctx,x-25,base-bh,50,bh,10); ctx.fill(); ctx.fillStyle="#e8f5ff"; ctx.font="13px Sarabun"; ctx.textAlign="center"; ctx.fillText(lv+" dB",x,base+22); });
    coreMetricCard(ctx,panel.x+38,panel.y+42,320,80,"ค่าจำลองเพื่อการเรียนรู้",`${source.toFixed(0)} dB → ${after.toFixed(0)} dB`,`ลดลง ${prot.toFixed(0)} dB จากการป้องกัน`,"#fbbf24");

  } else if(mode==="applicationsSound"){
    const cat=vSel("vizAppCategory","all"); vText("vizAppLabel",cat); panel=corePanel(ctx,w,h,"Applications of Sound");
    const cards=[["medical","อัลตราซาวด์","สร้างภาพทางการแพทย์","🏥"],["sonar","โซนาร์","ตรวจวัตถุใต้น้ำ","🌊"],["echo","Echolocation","สัตว์ใช้เสียงสะท้อน","🦇"],["industry","อุตสาหกรรม","ตรวจรอยร้าว/ความหนา","🏭"]];
    cards.forEach((card,i)=>{ if(cat!=="all" && card[0]!==cat) return; const j=cat==="all"?i:0, x=panel.x+70+(j%2)*(panel.w/2), y=panel.y+72+Math.floor(j/2)*118; ctx.fillStyle="rgba(7,18,38,.82)"; ctx.strokeStyle="rgba(34,211,238,.45)"; roundRect(ctx,x,y,panel.w/2-115,86,16); ctx.fill(); ctx.stroke(); ctx.fillStyle="#e8f5ff"; ctx.font="bold 28px Sarabun"; ctx.fillText(card[3],x+18,y+45); ctx.fillStyle="#22d3ee"; ctx.font="bold 17px Sarabun"; ctx.fillText(card[1],x+60,y+32); ctx.fillStyle="#e8f5ff"; ctx.font="14px Sarabun"; ctx.fillText(card[2],x+60,y+60); });
  }
}

let audioCtx,analyser,micSource,micStream,timeData,freqData,rafId,autoLogId;
let latest={fft:0,auto:0,main:0,rms:0,db:0,dbFast:0,dbSlow:0,period:0,zcr:0};
let history=[],ampHistory=[],logs=[],calLogs=[],peakHold=[],frozen=false,dbStats={min:Infinity,max:0,sum:0,n:0};
let exportCols=["time","run","preset","label","main","fft","auto","period","rms","db","zcr","top1","top2","top3","note"];
const colNames={time:"เวลา",run:"Run",preset:"Preset",label:"ป้ายกำกับ",main:"Main Hz",fft:"FFT Peak",auto:"Auto Hz",period:"Period",rms:"RMS",db:"dB",zcr:"ZCR",top1:"Peak 1",top2:"Peak 2",top3:"Peak 3",note:"หมายเหตุ"};
const canvases={},ctxs={};
["scope","spectrum","auto","history","amp","beat","resonance","spectrogram"].forEach(n=>{const c=$(n+"Canvas");if(c){canvases[n]=c;ctxs[n]=c.getContext("2d");}});
function drawGrid(ctx,c){if(!ctx||!c)return;ctx.clearRect(0,0,c.width,c.height);ctx.fillStyle="#020617";ctx.fillRect(0,0,c.width,c.height);ctx.strokeStyle="rgba(148,163,184,.12)";ctx.lineWidth=1;for(let x=0;x<c.width;x+=60){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,c.height);ctx.stroke();}for(let y=0;y<c.height;y+=40){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(c.width,y);ctx.stroke();}}
function rms(data){let s=0;for(let i=0;i<data.length;i++){const v=(data[i]-128)/128;s+=v*v;}return Math.sqrt(s/data.length);}
function dbFromRms(r){return Math.max(0,Math.min(130,20*Math.log10(Math.max(r,0.00001))+90+Number($("dbOffset").value||0)));}
function estimateFFT(arr,sr){const ny=sr/2,bin=ny/arr.length,minHz=Number($("minFreq").value||50),maxHz=Number($("maxFreq").value||5000);let a=Math.max(1,Math.floor(minHz/bin)),b=Math.min(arr.length-1,Math.floor(maxHz/bin)),mv=-1,idx=0;for(let i=a;i<=b;i++){if(arr[i]>mv){mv=arr[i];idx=i;}}return idx*bin;}
function acAt(buf,lag){let c=0;for(let i=0;i<buf.length-lag;i++)c+=buf[i]*buf[i+lag];return c/(buf.length-lag);}
function estimateAuto(bytes,sr){const n=bytes.length,buf=new Float32Array(n);let r=0;for(let i=0;i<n;i++){const v=(bytes[i]-128)/128;buf[i]=v;r+=v*v;}r=Math.sqrt(r/n);if(r<0.008)return 0;const minHz=Number($("minFreq").value||50),maxHz=Number($("maxFreq").value||5000),minLag=Math.max(2,Math.floor(sr/maxHz)),maxLag=Math.min(n-1,Math.floor(sr/minHz));let best=0,bc=-1;for(let lag=minLag;lag<=maxLag;lag++){let c=0;for(let i=0;i<n-lag;i++)c+=buf[i]*buf[i+lag];c/=(n-lag);if(c>bc){bc=c;best=lag;}}if(!best||bc<0.002)return 0;let ref=best;if(best>minLag&&best<maxLag){const c0=acAt(buf,best-1),c1=acAt(buf,best),c2=acAt(buf,best+1),d=c0-2*c1+c2;if(Math.abs(d)>1e-9)ref=best+0.5*(c0-c2)/d;}return sr/ref;}
function zcr(bytes,sr){let cr=0,p=bytes[0]-128;for(let i=1;i<bytes.length;i++){const c=bytes[i]-128;if((p<0&&c>=0)||(p>=0&&c<0))cr++;p=c;}return cr/(2*(bytes.length/sr));}
function topPeaks(arr,sr,n=3){const ny=sr/2,bin=ny/arr.length,minHz=Number($("minFreq").value||50),maxHz=Number($("maxFreq").value||5000),a=Math.max(2,Math.floor(minHz/bin)),b=Math.min(arr.length-2,Math.floor(maxHz/bin));let peaks=[];for(let i=a;i<=b;i++){if(arr[i]>arr[i-1]&&arr[i]>arr[i+1])peaks.push({hz:i*bin,val:arr[i]});}peaks.sort((x,y)=>y.val-x.val);let chosen=[];for(const p of peaks){if(chosen.every(q=>Math.abs(q.hz-p.hz)>35))chosen.push(p);if(chosen.length>=n)break;}return chosen;}
function mainFreq(){const p=$("preset").value;return ["tone","resonance","doppler"].includes(p)&&latest.auto?latest.auto:latest.fft;}
function set(id,v){const el=$(id);if(el)el.textContent=v;}
function updateStats(db){dbStats.min=Math.min(dbStats.min,db);dbStats.max=Math.max(dbStats.max,db);dbStats.sum+=db;dbStats.n++;}
function level(db){if(db<=30)return"เงียบมาก";if(db<=60)return"ปานกลาง";if(db<=85)return"ค่อนข้างดัง";return"ดังมาก";}
function updateReadouts(){latest.main=mainFreq();latest.period=latest.main?1000/latest.main:0;set("mainFreqOut",latest.main?latest.main.toFixed(1)+" Hz":"-- Hz");set("fftOut",latest.fft?latest.fft.toFixed(1)+" Hz":"-- Hz");set("autoOut",latest.auto?latest.auto.toFixed(1)+" Hz":"-- Hz");set("periodOut",latest.period?latest.period.toFixed(2)+" ms":"-- ms");set("dbOut",latest.db?latest.db.toFixed(1)+" dB":"-- dB");set("bigDb",latest.db?latest.db.toFixed(1):"--");set("dbLevel",latest.db?level(latest.db):"รอการวัด");set("dbStatsOut",dbStats.n?`${dbStats.min.toFixed(0)}/${dbStats.max.toFixed(0)}/${(dbStats.sum/dbStats.n).toFixed(0)} dB`:"--");}
function drawScope(){const ctx=ctxs.scope,c=canvases.scope;if(!ctx||!timeData)return;drawGrid(ctx,c);const g=ctx.createLinearGradient(0,0,c.width,0);g.addColorStop(0,"#22d3ee");g.addColorStop(.55,"#60a5fa");g.addColorStop(1,"#c084fc");ctx.strokeStyle=g;ctx.lineWidth=3;ctx.beginPath();const sl=c.width/timeData.length;for(let i=0;i<timeData.length;i++){const y=(timeData[i]/255)*c.height,x=i*sl;if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}ctx.stroke();}
function drawSpectrum(peaks){const ctx=ctxs.spectrum,c=canvases.spectrum;if(!ctx||!freqData)return;drawGrid(ctx,c);if(!peakHold.length)peakHold=new Array(freqData.length).fill(0);const bw=c.width/freqData.length*2.5;let x=0;for(let i=0;i<freqData.length;i++){peakHold[i]=Math.max(peakHold[i]||0,freqData[i]);const v=freqData[i]/255,h=v*c.height,ph=(peakHold[i]/255)*c.height,g=ctx.createLinearGradient(0,c.height-h,0,c.height);g.addColorStop(0,"#22d3ee");g.addColorStop(1,"#7c3aed");ctx.fillStyle=g;ctx.fillRect(x,c.height-h,bw,h);ctx.fillStyle="rgba(251,191,36,.6)";ctx.fillRect(x,c.height-ph,bw,2);x+=bw+1;if(x>c.width)break;}if(peaks){ctx.strokeStyle="#fbbf24";ctx.lineWidth=2;peaks.forEach(p=>{const xp=Math.min(c.width,(p.hz/(audioCtx.sampleRate/2))*c.width*2.5);ctx.beginPath();ctx.moveTo(xp,0);ctx.lineTo(xp,c.height);ctx.stroke();});}}
function drawAuto(){const ctx=ctxs.auto,c=canvases.auto;if(!ctx||!timeData)return;drawGrid(ctx,c);const n=timeData.length,buf=new Float32Array(n);for(let i=0;i<n;i++)buf[i]=(timeData[i]-128)/128;const maxLag=Math.min(700,n-1);ctx.strokeStyle="#34d399";ctx.lineWidth=2;ctx.beginPath();for(let lag=1;lag<maxLag;lag++){const corr=acAt(buf,lag),x=(lag/maxLag)*c.width,y=c.height/2-corr*c.height*1.7;if(lag===1)ctx.moveTo(x,y);else ctx.lineTo(x,y);}ctx.stroke();}
function drawHistory(){const ctx=ctxs.history,c=canvases.history;if(!ctx)return;drawGrid(ctx,c);const maxHz=Number($("maxFreq").value||5000);function line(k,col){ctx.strokeStyle=col;ctx.lineWidth=3;ctx.beginPath();history.forEach((p,i)=>{const x=(i/Math.max(1,history.length-1))*c.width,y=c.height-(Math.min(p[k]||0,maxHz)/maxHz)*c.height;if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);});ctx.stroke();}line("fft","#22d3ee");line("auto","#fbbf24");line("main","#34d399");ctx.fillStyle="#cfe9ff";ctx.font="18px Sarabun";ctx.fillText("ฟ้า=FFT เหลือง=Auto เขียว=Main",18,26);}
function drawAmp(){const ctx=ctxs.amp,c=canvases.amp;if(!ctx)return;drawGrid(ctx,c);ctx.strokeStyle="#fb7185";ctx.lineWidth=3;ctx.beginPath();ampHistory.forEach((db,i)=>{const x=(i/Math.max(1,ampHistory.length-1))*c.width,y=c.height-(Math.min(db,130)/130)*c.height;if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);});ctx.stroke();}
function drawSpectrogram(){const ctx=ctxs.spectrogram,c=canvases.spectrogram;if(!ctx||!freqData)return;const img=ctx.getImageData(1,0,c.width-1,c.height);ctx.putImageData(img,0,0);const maxBin=Math.min(freqData.length-1,Math.floor((Number($("maxFreq").value||5000)/(audioCtx.sampleRate/2))*freqData.length));for(let y=0;y<c.height;y++){const bin=Math.floor((1-y/c.height)*maxBin);const v=freqData[bin]/255;ctx.fillStyle=`rgb(${Math.floor(255*v)},${Math.floor(60+180*v)},${Math.floor(180+75*v)})`;ctx.fillRect(c.width-1,y,1,1);}}
function drawBeat(){const ctx=ctxs.beat,c=canvases.beat;if(!ctx)return;drawGrid(ctx,c);const f1=Number($("beatF1").value||440),f2=Number($("beatF2").value||444),beat=Math.abs(f1-f2);set("beatOut",beat.toFixed(2)+" Hz");ctx.strokeStyle="#22d3ee";ctx.lineWidth=2.5;ctx.beginPath();for(let x=0;x<c.width;x++){const t=x/c.width*.12,yv=(Math.sin(2*Math.PI*f1*t)+Math.sin(2*Math.PI*f2*t))/2,y=c.height/2-yv*c.height*.38;if(x===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}ctx.stroke();}
function drawResonance(){const ctx=ctxs.resonance,c=canvases.resonance;if(!ctx)return;drawGrid(ctx,c);const v=Number($("resV").value||343),L=Number($("resL").value||.25),mode=$("resMode").value,f1=L>0?(mode==="closed"?v/(4*L):v/(2*L)):0;set("resOut",f1?f1.toFixed(1)+" Hz":"-- Hz");const hs=mode==="closed"?[1,3,5,7].map(n=>(n*f1).toFixed(0)+" Hz"):[1,2,3,4].map(n=>(n*f1).toFixed(0)+" Hz");set("harmonicsOut",hs.join(", "));const maxF=Math.max(1000,f1*5);ctx.strokeStyle="#34d399";ctx.lineWidth=3;ctx.beginPath();for(let x=0;x<c.width;x++){const f=x/c.width*maxF;let amp=0;(mode==="closed"?[1,3,5,7]:[1,2,3,4,5]).forEach(n=>{const center=n*f1,w=Math.max(8,center*.018);amp+=Math.exp(-Math.pow((f-center)/w,2));});const y=c.height-Math.min(1,amp)*c.height*.75-20;if(x===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}ctx.stroke();}
function avg(arr,k){return arr.reduce((s,x)=>s+Number(x[k]||0),0)/arr.length;}
function loop(){if(!frozen){analyser.getByteTimeDomainData(timeData);analyser.getByteFrequencyData(freqData);latest.rms=rms(timeData);const d=dbFromRms(latest.rms);latest.dbFast=d;latest.dbSlow=latest.dbSlow?latest.dbSlow*.9+d*.1:d;latest.db=$("dbMode").value==="slow"?latest.dbSlow:latest.dbFast;latest.fft=estimateFFT(freqData,audioCtx.sampleRate);latest.auto=estimateAuto(timeData,audioCtx.sampleRate);latest.zcr=zcr(timeData,audioCtx.sampleRate);latest.main=mainFreq();latest.period=latest.main?1000/latest.main:0;updateStats(latest.db);const len=Number($("historyLength").value||220);history.push({t:Date.now(),fft:latest.fft||0,auto:latest.auto||0,main:latest.main||0});ampHistory.push(latest.db||0);while(history.length>len)history.shift();while(ampHistory.length>len)ampHistory.shift();const peaks=topPeaks(freqData,audioCtx.sampleRate,3);renderPeaks(peaks);updateReadouts();updateCalibrationUI();drawScope();drawSpectrum(peaks);drawAuto();drawHistory();drawAmp();drawSpectrogram();}rafId=requestAnimationFrame(loop);}
function renderPeaks(peaks){const ol=$("topPeaks");ol.innerHTML="";for(let i=0;i<3;i++){const li=document.createElement("li");li.textContent=peaks[i]?`${peaks[i].hz.toFixed(1)} Hz`:"-- Hz";ol.appendChild(li);}}
async function startMic(){try{audioCtx=new (window.AudioContext||window.webkitAudioContext)();micStream=await navigator.mediaDevices.getUserMedia({audio:true});analyser=audioCtx.createAnalyser();analyser.fftSize=Number($("fftSize").value||2048);analyser.smoothingTimeConstant=Number($("smoothing").value||.65);micSource=audioCtx.createMediaStreamSource(micStream);micSource.connect(analyser);timeData=new Uint8Array(analyser.fftSize);freqData=new Uint8Array(analyser.frequencyBinCount);$("startMic").disabled=true;$("stopMic").disabled=false;$("captureBtn").disabled=false;$("autoLogBtn").disabled=false;if($("captureCalBtn"))$("captureCalBtn").disabled=false;$("micDot").classList.add("on");$("micStatus").classList.add("hidden"); $("micStatus").textContent="";loop();}catch(e){$("micStatus").classList.remove("hidden"); $("micStatus").textContent="ไม่สามารถเปิดไมโครโฟนได้: "+e.message;}}
function stopMic(){if(rafId)cancelAnimationFrame(rafId);if(autoLogId)toggleAutoLog();if(micStream)micStream.getTracks().forEach(t=>t.stop());if(audioCtx)audioCtx.close();audioCtx=null;micStream=null;$("startMic").disabled=false;$("stopMic").disabled=true;$("captureBtn").disabled=true;$("autoLogBtn").disabled=true;if($("captureCalBtn"))$("captureCalBtn").disabled=true;$("micDot").classList.remove("on");$("micStatus").classList.add("hidden"); $("micStatus").textContent="";}
function capture(){const peaks=freqData&&audioCtx?topPeaks(freqData,audioCtx.sampleRate,3):[];logs.push({time:new Date().toLocaleString("th-TH"),run:$("runInput").value||"Run 1",preset:$("preset").value,label:$("labelInput").value||"ไม่ระบุ",main:latest.main?latest.main.toFixed(1):"",fft:latest.fft?latest.fft.toFixed(1):"",auto:latest.auto?latest.auto.toFixed(1):"",period:latest.period?latest.period.toFixed(2):"",rms:latest.rms?latest.rms.toFixed(4):"",db:latest.db?latest.db.toFixed(1):"",zcr:latest.zcr?latest.zcr.toFixed(1):"",top1:peaks[0]?peaks[0].hz.toFixed(1):"",top2:peaks[1]?peaks[1].hz.toFixed(1):"",top3:peaks[2]?peaks[2].hz.toFixed(1):"",note:`min=${$("minFreq").value} max=${$("maxFreq").value} offset=${$("dbOffset").value}`});renderLog();}
function renderLog(){const head=$("logHead"),body=$("logBody");head.innerHTML="";exportCols.forEach(c=>{const th=document.createElement("th");th.textContent=colNames[c];head.appendChild(th);});body.innerHTML="";logs.forEach(r=>{const tr=document.createElement("tr");exportCols.forEach(c=>{const td=document.createElement("td");td.textContent=r[c]??"";tr.appendChild(td);});body.appendChild(tr);});}
function downloadCsv(){const csv=[exportCols.map(c=>colNames[c]),...logs.map(r=>exportCols.map(c=>r[c]??""))].map(row=>row.map(v=>`"${String(v).replaceAll('"','""')}"`).join(",")).join("\n");const blob=new Blob(["\ufeff"+csv],{type:"text/csv;charset=utf-8"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download=makeTopicFileName("Data", "csv");a.click();URL.revokeObjectURL(url);}

function downloadExcel(){
  const headers = exportCols.map(c=>colNames[c]);
  const rows = logs.map(r=>exportCols.map(c=>r[c]??""));
  let html = '<html><head><meta charset="UTF-8"></head><body><table border="1">';
  html += '<tr>' + headers.map(h=>`<th>${h}</th>`).join('') + '</tr>';
  rows.forEach(row=>{
    html += '<tr>' + row.map(v=>`<td>${String(v).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;")}</td>`).join('') + '</tr>';
  });
  html += '</table></body></html>';
  const blob = new Blob(['\ufeff'+html], {type:'application/vnd.ms-excel;charset=utf-8'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = makeTopicFileName('Raw_Data', 'xls');
  a.click();
  URL.revokeObjectURL(url);
}


function updateCalibrationUI(){
  const refF = Number($("refFreq")?.value || 440);
  const measuredF = latest.main || latest.auto || latest.fft || 0;
  const refDb = Number($("refDb")?.value || 70);
  const measuredDb = latest.db || 0;
  if($("measuredFreqBox")) $("measuredFreqBox").value = measuredF ? measuredF.toFixed(1)+" Hz" : "-- Hz";
  if($("measuredDbBox")) $("measuredDbBox").value = measuredDb ? measuredDb.toFixed(1)+" dB" : "-- dB";
  if($("freqErrorOut")){
    if(measuredF){
      const err = measuredF - refF;
      const pct = refF ? (err/refF*100) : 0;
      $("freqErrorOut").textContent = `${err.toFixed(1)} Hz (${pct.toFixed(2)}%)`;
    }else $("freqErrorOut").textContent = "--";
  }
  if($("dbCalOut")){
    if(measuredDb){
      const off = refDb - measuredDb;
      $("dbCalOut").textContent = `${off.toFixed(1)} dB`;
    }else $("dbCalOut").textContent = "-- dB";
  }
}
function captureCalibration(){
  const refF = Number($("refFreq")?.value || 440);
  const measuredF = latest.main || latest.auto || latest.fft || 0;
  const refDb = Number($("refDb")?.value || 70);
  const measuredDb = latest.db || 0;
  const err = measuredF ? measuredF - refF : 0;
  const pct = measuredF && refF ? err/refF*100 : 0;
  const off = measuredDb ? refDb - measuredDb : 0;
  calLogs.push({
    time:new Date().toLocaleString("th-TH"),
    device:$("deviceModel")?.value || "",
    os:$("deviceOS")?.value || "",
    browser:$("browserName")?.value || "",
    distance:$("calDistance")?.value || "",
    refHz:refF.toFixed(1),
    measuredHz:measuredF ? measuredF.toFixed(1) : "",
    errorHz:measuredF ? err.toFixed(1) : "",
    errorPct:measuredF ? pct.toFixed(2) : "",
    refDb:refDb.toFixed(1),
    measuredDb:measuredDb ? measuredDb.toFixed(1) : "",
    dbOffset:measuredDb ? off.toFixed(1) : ""
  });
  renderCalibration();
}
function renderCalibration(){
  const body=$("calBody"); if(!body) return;
  body.innerHTML="";
  calLogs.forEach(r=>{
    const tr=document.createElement("tr");
    [r.time,r.device,r.os,r.browser,r.distance,r.refHz,r.measuredHz,r.errorHz,r.errorPct,r.refDb,r.measuredDb,r.dbOffset].forEach(v=>{
      const td=document.createElement("td"); td.textContent=v; tr.appendChild(td);
    });
    body.appendChild(tr);
  });
}
function downloadCalibrationCsv(){
  const header=["time","device","os","browser","distance","ref_Hz","measured_Hz","error_Hz","error_percent","ref_dB","measured_dB","db_offset"];
  const rows=calLogs.map(r=>[r.time,r.device,r.os,r.browser,r.distance,r.refHz,r.measuredHz,r.errorHz,r.errorPct,r.refDb,r.measuredDb,r.dbOffset]);
  const csv=[header,...rows].map(row=>row.map(v=>`"${String(v).replaceAll('"','""')}"`).join(",")).join("\n");
  const blob=new Blob(["\ufeff"+csv],{type:"text/csv;charset=utf-8"});
  const url=URL.createObjectURL(blob);
  const a=document.createElement("a"); a.href=url; a.download="PhySound_Calibration_Log.csv"; a.click(); URL.revokeObjectURL(url);
}
function applyDbCalibration(){
  const refDb = Number($("refDb")?.value || 70);
  const measuredDb = latest.db || 0;
  if(!measuredDb){ alert("ยังไม่มีค่า dB จากไมโครโฟน"); return; }
  const off = refDb - measuredDb + Number($("dbOffset").value || 0);
  $("dbOffset").value = off.toFixed(1);
  updateCalibrationUI();
}
function fillBrowserInfo(){
  if($("browserName") && !$("browserName").value){
    const ua=navigator.userAgent;
    let name="Browser";
    if(ua.includes("Chrome")) name="Chrome";
    if(ua.includes("Safari") && !ua.includes("Chrome")) name="Safari";
    if(ua.includes("Firefox")) name="Firefox";
    if(ua.includes("Edg")) name="Edge";
    $("browserName").value=name;
  }
}

function toggleAutoLog(){if(autoLogId){clearInterval(autoLogId);autoLogId=null;$("autoLogBtn").textContent="เริ่ม Auto Log";}else{autoLogId=setInterval(capture,Math.max(.2,Number($("logInterval").value||1))*1000);$("autoLogBtn").textContent="หยุด Auto Log";}}
function applyPreset(){const p=$("preset").value;const map={general:[50,5000,.65],tone:[100,2000,.55],voice:[80,4000,.75],beat:[100,1200,.65],resonance:[50,3000,.60],doppler:[100,3000,.55],environment:[20,10000,.85]};const m=map[p]||map.general;$("minFreq").value=m[0];$("maxFreq").value=m[1];$("smoothing").value=m[2];}
function applyMode(){const modeEl=$("userMode"); if(!modeEl) return; document.querySelectorAll(".teacherSetting").forEach(e=>e.classList.toggle("hidden",modeEl.value==="student"));}
function renderColumnToggles(){const box=$("columnToggles");box.innerHTML="";Object.keys(colNames).forEach(k=>{const b=document.createElement("button");b.className="secondary active";b.textContent=colNames[k];b.onclick=()=>{if(exportCols.includes(k)){exportCols=exportCols.filter(x=>x!==k);b.classList.remove("active");}else{exportCols.push(k);b.classList.add("active");}renderLog();};box.appendChild(b);});}
function saveSettings(){const keys=["preset","userMode","minFreq","maxFreq","dbOffset","dbMode","fftSize","smoothing","logInterval","historyLength"];localStorage.setItem("physound-settings",JSON.stringify(Object.fromEntries(keys.filter(k=>$(k)).map(k=>[k,$(k).value]))));alert("บันทึก Settings แล้ว");}
function loadSettings(){try{const s=JSON.parse(localStorage.getItem("physound-settings")||"{}");Object.entries(s).forEach(([k,v])=>{if($(k))$(k).value=v;});}catch(e){}applyMode();}
function resetSettings(){localStorage.removeItem("physound-settings");location.reload();}
function copyConfig(){const keys=["preset","minFreq","maxFreq","dbOffset","dbMode","fftSize","smoothing"];const q=new URLSearchParams(Object.fromEntries(keys.filter(k=>$(k)).map(k=>[k,$(k).value]))).toString();navigator.clipboard?.writeText(location.origin+location.pathname+"#"+q);alert("คัดลอก Config Link แล้ว");}
function readConfig(){if(location.hash.length>1){const q=new URLSearchParams(location.hash.slice(1));q.forEach((v,k)=>{if($(k))$(k).value=v;});}}
function saveGraphs(){["scope","spectrum","spectrogram","history"].forEach(n=>{const c=canvases[n];if(!c)return;const a=document.createElement("a");a.href=c.toDataURL("image/png");a.download=makeTopicFileName(n, "png");a.click();});}
let toneCtx,toneOsc,toneGain,noiseCtx,noiseSrc,noiseGain,beatCtx,beatOsc1,beatOsc2,beatGain;
function playTone(){stopTone();toneCtx=new (window.AudioContext||window.webkitAudioContext)();toneOsc=toneCtx.createOscillator();toneGain=toneCtx.createGain();toneOsc.type=$("toneType").value;toneOsc.frequency.value=Number($("toneFreq").value||440);toneGain.gain.value=Number($("toneVol").value||.06);toneOsc.connect(toneGain);toneGain.connect(toneCtx.destination);toneOsc.start();}
function stopTone(){if(toneCtx)toneCtx.close();toneCtx=toneOsc=toneGain=null;}
function playNoise(){stopNoise();noiseCtx=new (window.AudioContext||window.webkitAudioContext)();const size=noiseCtx.sampleRate*2,buf=noiseCtx.createBuffer(1,size,noiseCtx.sampleRate),data=buf.getChannelData(0);for(let i=0;i<size;i++)data[i]=Math.random()*2-1;noiseSrc=noiseCtx.createBufferSource();noiseSrc.buffer=buf;noiseSrc.loop=true;noiseGain=noiseCtx.createGain();noiseGain.gain.value=Number($("noiseVol").value||.03);noiseSrc.connect(noiseGain);noiseGain.connect(noiseCtx.destination);noiseSrc.start();}
function stopNoise(){if(noiseCtx)noiseCtx.close();noiseCtx=noiseSrc=noiseGain=null;}
function playBeat(){stopBeat();beatCtx=new (window.AudioContext||window.webkitAudioContext)();beatOsc1=beatCtx.createOscillator();beatOsc2=beatCtx.createOscillator();beatGain=beatCtx.createGain();beatOsc1.frequency.value=Number($("beatF1").value||440);beatOsc2.frequency.value=Number($("beatF2").value||444);beatGain.gain.value=Number($("beatVol").value||.06);beatOsc1.connect(beatGain);beatOsc2.connect(beatGain);beatGain.connect(beatCtx.destination);beatOsc1.start();beatOsc2.start();drawBeat();}
function stopBeat(){if(beatCtx)beatCtx.close();beatCtx=beatOsc1=beatOsc2=beatGain=null;}

let vizState = {mode:(window.__melodyLabVizMode||"longitudinal"), running:true, t:0, raf:null, echoSample:"physics"};
function getVizParams(){
  const f=Number($("vizFreq")?.value||440);
  const A=Number($("vizAmp")?.value||0.7);
  const v=Number($("vizSpeed")?.value||343);
  const speed=Number($("vizTimeSpeed")?.value||1);
  const phaseDeg=Number($("vizPhase")?.value||0);
  const phaseDiffDeg=Number($("vizPhaseDiff")?.value||90);
  const lambda=v/f;
  if($("vizFreqOut")) $("vizFreqOut").textContent=f.toFixed(0)+" Hz";
  if($("vizAmpOut")) $("vizAmpOut").textContent=A.toFixed(2);
  if($("vizSpeedOut")) $("vizSpeedOut").textContent=v.toFixed(0)+" m/s";
  if($("vizLambdaOut")) $("vizLambdaOut").textContent=lambda.toFixed(2)+" m";
  if($("vizFreqLabel")) $("vizFreqLabel").textContent = f.toFixed(0)+" Hz";
  if($("vizAmpLabel")) $("vizAmpLabel").textContent=A.toFixed(2);
  if($("vizSpeedLabel")) $("vizSpeedLabel").textContent=v.toFixed(0)+" m/s";
  if($("vizTimeLabel")) $("vizTimeLabel").textContent=speed.toFixed(1)+"×";
  if($("vizPhaseLabel")) $("vizPhaseLabel").textContent=phaseDeg.toFixed(0)+"°";
  if($("vizPhaseDiffLabel")) $("vizPhaseDiffLabel").textContent=phaseDiffDeg.toFixed(0)+"°";
  return {f,A,v,speed,lambda,sub:$("vizSubMode")?.value||"closed",phaseDeg,phase:phaseDeg*Math.PI/180,phaseDiffDeg,phaseDiff:phaseDiffDeg*Math.PI/180};
}
function vizGrid(ctx,c){
  ctx.clearRect(0,0,c.width,c.height);
  ctx.fillStyle="#020617"; ctx.fillRect(0,0,c.width,c.height);
  ctx.strokeStyle="rgba(148,163,184,.12)"; ctx.lineWidth=1;
  for(let x=0;x<c.width;x+=80){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,c.height);ctx.stroke();}
  for(let y=0;y<c.height;y+=60){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(c.width,y);ctx.stroke();}
}
function drawWaveLine(ctx, points, color="#22d3ee", width=3){
  ctx.strokeStyle=color; ctx.lineWidth=width; ctx.beginPath();
  points.forEach((p,i)=>{ if(i===0) ctx.moveTo(p[0],p[1]); else ctx.lineTo(p[0],p[1]); });
  ctx.stroke();
}

function drawVizAxis(ctx,c,mode){
  ctx.save();
  ctx.fillStyle="#cfe9ff";
  ctx.strokeStyle="rgba(207,233,255,.72)";
  ctx.lineWidth=1.4;
  ctx.font="16px Sarabun, system-ui, sans-serif";

  function axis(x1,y1,x2,y2,label){
    ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke();
    const ang=Math.atan2(y2-y1,x2-x1);
    const ah=9;
    ctx.beginPath();
    ctx.moveTo(x2,y2);
    ctx.lineTo(x2-ah*Math.cos(ang-Math.PI/6), y2-ah*Math.sin(ang-Math.PI/6));
    ctx.moveTo(x2,y2);
    ctx.lineTo(x2-ah*Math.cos(ang+Math.PI/6), y2-ah*Math.sin(ang+Math.PI/6));
    ctx.stroke();
    ctx.fillText(label,x2+8,y2+5);
  }
  function yLabel(text,x,y){
    ctx.save();
    ctx.translate(x,y);
    ctx.rotate(-Math.PI/2);
    ctx.fillText(text,0,0);
    ctx.restore();
  }

  if(mode==="longitudinal"){
    axis(70,c.height-52,c.width-80,c.height-52,"position x (m)");
    yLabel("particle displacement s (relative)",28,c.height/2+90);
  }else if(mode==="pressure"){
    axis(70,c.height-52,c.width-80,c.height-52,"position x (m)");
    yLabel("pressure variation ΔP (relative)",28,c.height/2+100);
  }else if(mode==="displacementPressure"){
    axis(70,245,c.width-80,245,"position x (m)");
    yLabel("displacement s (relative)",28,165);
    axis(70,c.height-42,c.width-80,c.height-42,"position x (m)");
    yLabel("pressure ΔP (relative)",28,380);
  }else if(mode==="transverseCompare"){
    axis(70,235,c.width-80,235,"position x (m)");
    yLabel("longitudinal displacement (relative)",28,170);
    axis(70,c.height-42,c.width-80,c.height-42,"position x (m)");
    yLabel("transverse displacement y (relative)",28,380);
  }else if(mode==="superposition" || mode==="beatsViz"){
    axis(70,c.height-42,c.width-80,c.height-42,"time t (s)");
    yLabel("relative amplitude",28,c.height/2+80);
  }else if(mode==="standingAir"){
    axis(90,c.height-52,c.width-90,c.height-52,"position along air column x (m)");
    yLabel("displacement relative amplitude",28,c.height/2+95);
  }else if(mode==="resonanceViz"){
    axis(80,c.height-58,c.width-80,c.height-58,"frequency f (Hz)");
    yLabel("response relative amplitude",28,c.height/2+90);
  }else if(mode==="harmonicsViz"){
    axis(100,c.height-58,c.width-80,c.height-58,"harmonic number n");
    yLabel("relative relative amplitude",28,c.height/2+90);
  }else if(mode==="dopplerViz"){
    axis(70,c.height-52,c.width-80,c.height-52,"position x (m)");
    yLabel("wavefront spacing / pressure pattern",28,c.height/2+100);
  }
  ctx.restore();
}
function drawVizScale(ctx,c,mode){
  ctx.save();
  ctx.fillStyle="rgba(207,233,255,.82)";
  ctx.font="14px Sarabun, system-ui, sans-serif";
  if(["longitudinal","pressure","standingAir","dopplerViz"].includes(mode)){
    ctx.fillText("0",72,c.height-30);
    ctx.fillText("x",c.width-72,c.height-30);
  }
  if(["superposition","beatsViz"].includes(mode)){
    ctx.fillText("0 s",72,c.height-22);
    ctx.fillText("t",c.width-72,c.height-22);
  }
  if(mode==="resonanceViz"){
    ctx.fillText("100 Hz",80,c.height-28);
    ctx.fillText("1000 Hz",c.width-150,c.height-28);
  }
  if(mode==="harmonicsViz"){
    ctx.fillText("1f",128,c.height-28);
    ctx.fillText("7f",c.width-150,c.height-28);
  }
  ctx.restore();
}


function drawTrackedParticle(ctx,x,y,label=""){
  ctx.save();
  ctx.fillStyle="#ff4d6d";
  ctx.strokeStyle="#ffffff";
  ctx.lineWidth=2;
  ctx.beginPath(); ctx.arc(x,y,8,0,Math.PI*2); ctx.fill(); ctx.stroke();
  if(label){
    ctx.strokeStyle="rgba(255,77,109,.8)";
    ctx.beginPath(); ctx.moveTo(x+12,y-12); ctx.lineTo(x+54,y-32); ctx.stroke();
    ctx.fillStyle="#ffd6de";
    ctx.font="15px Sarabun, system-ui, sans-serif";
    ctx.fillText(label,x+58,y-34);
  }
  ctx.restore();
}
function drawTrackedVertical(ctx,x,y1,y2){
  ctx.save();
  ctx.strokeStyle="rgba(255,77,109,.55)";
  ctx.setLineDash([6,6]);
  ctx.lineWidth=1.5;
  ctx.beginPath(); ctx.moveTo(x,y1); ctx.lineTo(x,y2); ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();
}
function drawLongitudinalAnnotations(ctx, x0, x, yBase){
  ctx.save();
  const centerY = yBase - 84;
  ctx.lineWidth = 1.8;

  // wave propagation arrow (top-left)
  ctx.strokeStyle = "rgba(56,189,248,.96)";
  ctx.beginPath();
  ctx.moveTo(96, 86);
  ctx.lineTo(220, 86);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(220, 86);
  ctx.lineTo(208, 79);
  ctx.moveTo(220, 86);
  ctx.lineTo(208, 93);
  ctx.stroke();

  // particle vibration double-arrow near tracked particle
  ctx.strokeStyle = "rgba(251,191,36,.98)";
  ctx.beginPath();
  ctx.moveTo(x0-30, yBase+56);
  ctx.lineTo(x0+30, yBase+56);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x0-30, yBase+56);
  ctx.lineTo(x0-20, yBase+50);
  ctx.moveTo(x0-30, yBase+56);
  ctx.lineTo(x0-20, yBase+62);
  ctx.moveTo(x0+30, yBase+56);
  ctx.lineTo(x0+20, yBase+50);
  ctx.moveTo(x0+30, yBase+56);
  ctx.lineTo(x0+20, yBase+62);
  ctx.stroke();

  // amplitude marker from equilibrium to current displacement
  ctx.strokeStyle = "rgba(167,139,250,.96)";
  ctx.setLineDash([5,4]);
  ctx.beginPath();
  ctx.moveTo(x0, centerY);
  ctx.lineTo(x, centerY);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.beginPath();
  ctx.moveTo(x0, centerY-8);
  ctx.lineTo(x0, centerY+8);
  ctx.moveTo(x, centerY-8);
  ctx.lineTo(x, centerY+8);
  ctx.stroke();
  ctx.fillStyle = "#ddd6fe";
  ctx.font = "bold 16px Sarabun, system-ui, sans-serif";
  ctx.fillText("A", ((x0 + x) / 2) - 5, centerY - 10);
  ctx.restore();
}


function drawParticleSphere(ctx,x,y,r,scheme="cyan"){
  ctx.save();
  ctx.shadowColor = scheme === "red" ? "rgba(255,76,132,.28)" : "rgba(34,211,238,.22)";
  ctx.shadowBlur = r * 1.2;
  ctx.shadowOffsetY = r * 0.22;

  const fill = ctx.createRadialGradient(x-r*0.42,y-r*0.48,r*0.18,x,y,r*1.02);
  if(scheme === "red"){
    fill.addColorStop(0,"#fff7fb");
    fill.addColorStop(0.28,"#ffb5cf");
    fill.addColorStop(0.58,"#ff5b98");
    fill.addColorStop(0.82,"#e83074");
    fill.addColorStop(1,"#9f124f");
  }else{
    fill.addColorStop(0,"#fbfeff");
    fill.addColorStop(0.26,"#bff7ff");
    fill.addColorStop(0.56,"#54d7ff");
    fill.addColorStop(0.84,"#1697ff");
    fill.addColorStop(1,"#0b4dbd");
  }
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.arc(x,y,r,0,Math.PI*2);
  ctx.fill();

  const gloss = ctx.createRadialGradient(x-r*0.45,y-r*0.52,0,x-r*0.35,y-r*0.42,r*0.72);
  gloss.addColorStop(0,"rgba(255,255,255,.92)");
  gloss.addColorStop(0.42,"rgba(255,255,255,.35)");
  gloss.addColorStop(1,"rgba(255,255,255,0)");
  ctx.fillStyle = gloss;
  ctx.beginPath();
  ctx.arc(x-r*0.18,y-r*0.18,r*0.56,0,Math.PI*2);
  ctx.fill();

  ctx.strokeStyle = "rgba(255,255,255,.24)";
  ctx.lineWidth = Math.max(1, r*0.13);
  ctx.beginPath();
  ctx.arc(x,y,r,0,Math.PI*2);
  ctx.stroke();
  ctx.restore();
}

function drawParticleShadow(ctx,x,y,r){
  ctx.save();
  const shadow = ctx.createRadialGradient(x,y+r*0.9,r*0.1,x,y+r*0.9,r*1.2);
  shadow.addColorStop(0,"rgba(2,8,23,.32)");
  shadow.addColorStop(1,"rgba(2,8,23,0)");
  ctx.fillStyle = shadow;
  ctx.beginPath();
  ctx.ellipse(x,y+r*0.95,r*0.95,r*0.35,0,0,Math.PI*2);
  ctx.fill();
  ctx.restore();
}

function drawSpeaker(ctx, x, y, scale){
  ctx.save();
  ctx.translate(x,y);
  ctx.scale(scale,scale);

  // Sound-wave rings
  for(let i=0;i<4;i++){
    ctx.beginPath();
    ctx.strokeStyle = `rgba(35,160,255,${0.46 - i*0.075})`;
    ctx.lineWidth = 3.2 - i*0.42;
    ctx.arc(14,0,38+i*18,-0.82,0.82);
    ctx.stroke();
  }

  // Back plate
  const plate = ctx.createLinearGradient(-76,-76,-18,76);
  plate.addColorStop(0,"#2d3d53");
  plate.addColorStop(.45,"#0b1728");
  plate.addColorStop(1,"#030816");
  ctx.fillStyle = plate;
  ctx.strokeStyle = "rgba(34,211,238,.55)";
  ctx.lineWidth = 1.6;
  roundRect(ctx,-88,-76,54,152,16);
  ctx.fill();
  ctx.stroke();

  // Main outer rim
  const outer = ctx.createRadialGradient(-30,-18,8,-30,0,62);
  outer.addColorStop(0,"#d9fbff");
  outer.addColorStop(.18,"#1ee8ff");
  outer.addColorStop(.42,"#1368ff");
  outer.addColorStop(.70,"#07142a");
  outer.addColorStop(1,"#020617");
  ctx.fillStyle = outer;
  ctx.beginPath();
  ctx.ellipse(-28,0,52,64,0,0,Math.PI*2);
  ctx.fill();

  ctx.strokeStyle="rgba(177,245,255,.78)";
  ctx.lineWidth=2.2;
  ctx.beginPath();
  ctx.ellipse(-28,0,52,64,0,0,Math.PI*2);
  ctx.stroke();

  // Inner cone
  const cone = ctx.createRadialGradient(-32,-16,4,-28,0,46);
  cone.addColorStop(0,"#bff6ff");
  cone.addColorStop(.28,"#21b8ff");
  cone.addColorStop(.62,"#08265d");
  cone.addColorStop(1,"#01040c");
  ctx.fillStyle = cone;
  ctx.beginPath();
  ctx.ellipse(-28,0,34,45,0,0,Math.PI*2);
  ctx.fill();

  // Central dome
  const dome = ctx.createRadialGradient(-36,-12,4,-28,0,22);
  dome.addColorStop(0,"#d7fbff");
  dome.addColorStop(.42,"#139dff");
  dome.addColorStop(1,"#020617");
  ctx.fillStyle = dome;
  ctx.beginPath();
  ctx.ellipse(-28,0,17,23,0,0,Math.PI*2);
  ctx.fill();

  // Neon highlight ring
  ctx.strokeStyle="rgba(34,211,238,.95)";
  ctx.lineWidth=3;
  ctx.beginPath();
  ctx.ellipse(-28,0,42,54,0,0,Math.PI*2);
  ctx.stroke();

  ctx.restore();
}

function roundRect(ctx,x,y,w,h,r){
  ctx.beginPath();
  ctx.moveTo(x+r,y);
  ctx.lineTo(x+w-r,y);
  ctx.quadraticCurveTo(x+w,y,x+w,y+r);
  ctx.lineTo(x+w,y+h-r);
  ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
  ctx.lineTo(x+r,y+h);
  ctx.quadraticCurveTo(x,y+h,x,y+h-r);
  ctx.lineTo(x,y+r);
  ctx.quadraticCurveTo(x,y,x+r,y);
}

function drawLongitudinalFinal(ctx, c, p, w, h){
  ctx.clearRect(0,0,w,h);

  const bg=ctx.createLinearGradient(0,0,w,h);
  bg.addColorStop(0,"#020817");
  bg.addColorStop(1,"#06152e");
  ctx.fillStyle=bg;
  ctx.fillRect(0,0,w,h);

  ctx.strokeStyle="rgba(148,163,184,.10)";
  ctx.lineWidth=1;
  for(let x=0;x<w;x+=78){ ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,h); ctx.stroke(); }
  for(let y=0;y<h;y+=52){ ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(w,y); ctx.stroke(); }

  const xMin = Math.max(118, w * 0.12);
  const xMax = w - 62;
  const titleY = 32;
  const arrowY = 68;
  const topY = 96;
  const bottomMargin = 34;
  const graphBottom = h - bottomMargin;
  const fieldTop = topY;
  const fieldH = Math.max(190, Math.min(h * 0.54, graphBottom - fieldTop - 92));
  const airTop = fieldTop + 44;
  const airBottom = airTop + fieldH;
  const graphY = Math.min(graphBottom - 38, airBottom + 56);
  const rows = 7;
  const cols = Math.max(20, Math.floor((xMax-xMin) / 34));
  const rowGap = fieldH / Math.max(1, rows - 1);
  const colGap = (xMax-xMin) / Math.max(1, cols - 1);
  const baseRadius = Math.max(4.6, Math.min(7.8, colGap * 0.16));
  const ampPx = Math.max(12, Math.min(34, colGap * 0.48)) * p.A;

  // v5.90: frequency and wave speed set the visual wavelength through λ = v/f.
  const referenceLambda = 343 / 440;
  const wavelengthPx = Math.max(150, Math.min(620, (p.lambda / referenceLambda) * 300));
  const k = 2 * Math.PI / wavelengthPx;
  const phase = vizState.t * 0.105 * p.speed;
  const displacementAt = (x)=> ampPx * Math.sin(k*(x-xMin) - phase);

  ctx.fillStyle="#d8efff";
  ctx.font="20px Sarabun, system-ui, sans-serif";
  ctx.textAlign="left";
  ctx.fillText("Longitudinal Wave (คลื่นตามยาว)", 24, titleY);

  ctx.save();
  ctx.strokeStyle="rgba(34,211,238,.96)";
  ctx.fillStyle="rgba(34,211,238,.96)";
  ctx.lineWidth=4;
  ctx.beginPath();
  ctx.moveTo(w*0.31, arrowY);
  ctx.lineTo(w*0.82, arrowY);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(w*0.82, arrowY);
  ctx.lineTo(w*0.795, arrowY-14);
  ctx.lineTo(w*0.795, arrowY+14);
  ctx.closePath();
  ctx.fill();
  ctx.font="bold 16px Sarabun, system-ui, sans-serif";
  ctx.textAlign="center";
  ctx.fillText("ทิศทางการเคลื่อนที่ของคลื่น", w*0.56, arrowY-16);
  ctx.restore();

  ctx.save();
  const panelGrad = ctx.createLinearGradient(xMin-36, fieldTop, xMax+36, airBottom+28);
  panelGrad.addColorStop(0,"rgba(4,18,42,.76)");
  panelGrad.addColorStop(1,"rgba(2,8,24,.36)");
  ctx.fillStyle=panelGrad;
  ctx.strokeStyle="rgba(88,166,255,.25)";
  ctx.lineWidth=1.4;
  roundRect(ctx, xMin-42, fieldTop, xMax-xMin+84, airBottom-fieldTop+34, 18);
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  const yBandTop = airTop - 28;
  const yBandH = (rows-1)*rowGap + 56;
  for(let x=xMin; x<xMax; x+=12){
    const density = -Math.cos(k*(x-xMin)-phase);
    if(density > 0.50 || density < -0.50){
      const alpha = Math.min(0.22, 0.08 + Math.abs(density) * 0.12);
      const color = density > 0 ? `rgba(34,211,238,${alpha})` : `rgba(168,85,247,${alpha})`;
      const g = ctx.createLinearGradient(x-28,0,x+28,0);
      g.addColorStop(0,"rgba(0,0,0,0)");
      g.addColorStop(.5,color);
      g.addColorStop(1,"rgba(0,0,0,0)");
      ctx.fillStyle=g;
      ctx.fillRect(x-28,yBandTop,56,yBandH);
    }
  }

  function wrapToRange(x){
    while(x < xMin + 60) x += wavelengthPx;
    while(x > xMax - 60) x -= wavelengthPx;
    return x;
  }
  const compX = wrapToRange(xMin + ((((phase + Math.PI) / k) % wavelengthPx) + wavelengthPx) % wavelengthPx);
  const rareX = wrapToRange(xMin + (((phase / k) % wavelengthPx) + wavelengthPx) % wavelengthPx);

  function drawSmallPill(cx, cy, text, stroke, fill){
    ctx.save();
    ctx.font="bold 13px Sarabun, system-ui, sans-serif";
    ctx.textAlign="center";
    const tw = ctx.measureText(text).width;
    const bw = tw + 26;
    ctx.fillStyle=fill;
    ctx.strokeStyle=stroke;
    ctx.lineWidth=1.4;
    roundRect(ctx, cx-bw/2, cy-15, bw, 30, 12);
    ctx.fill(); ctx.stroke();
    ctx.fillStyle="rgba(245,248,255,.96)";
    ctx.fillText(text, cx, cy+5);
    ctx.restore();
  }
  drawSmallPill(compX, fieldTop + 18, "ส่วนอัด", "rgba(34,211,238,.55)", "rgba(8,30,62,.80)");
  drawSmallPill(rareX, airBottom + 18, "ส่วนขยาย", "rgba(168,85,247,.55)", "rgba(23,16,55,.78)");

  const speakerX = Math.max(48, xMin - 88);
  const speakerY = airTop + (rows-1)*rowGap/2;
  drawSpeaker(ctx, speakerX, speakerY, 1.05);

  const obsCol = Math.floor(cols * 0.54);
  const obsRow = Math.floor(rows/2);
  let obsBaseX = xMin + obsCol * colGap;
  let obsActualX = obsBaseX + displacementAt(obsBaseX);
  let obsY = airTop + obsRow * rowGap;

  ctx.save();
  for(let r=0; r<rows; r++){
    const y = airTop + r * rowGap;
    for(let i=0; i<cols; i++){
      const baseX = xMin + i * colGap;
      const offset = displacementAt(baseX);
      const x = baseX + offset;
      const density = Math.max(0, Math.min(1, (1 - Math.cos(k*(baseX-xMin)-phase)) / 2));
      const radius = baseRadius * (0.92 + density * 0.32);

      ctx.beginPath();
      ctx.fillStyle="rgba(148,163,184,.22)";
      ctx.arc(baseX, y, Math.max(2.0, baseRadius*0.34), 0, Math.PI*2);
      ctx.fill();

      if(i % 3 === 0 && r === obsRow){
        ctx.strokeStyle="rgba(148,163,184,.20)";
        ctx.lineWidth=1;
        ctx.beginPath();
        ctx.moveTo(baseX, y);
        ctx.lineTo(x, y);
        ctx.stroke();
      }

      const grad=ctx.createRadialGradient(x-2,y-2,1,x,y,radius*2.8);
      grad.addColorStop(0,"rgba(255,255,255,.98)");
      grad.addColorStop(.40,"rgba(125,230,255,.92)");
      grad.addColorStop(1,"rgba(34,211,238,.18)");
      ctx.fillStyle=grad;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI*2);
      ctx.fill();
    }
  }
  ctx.restore();

  ctx.save();
  ctx.strokeStyle="rgba(255,77,109,.72)";
  ctx.setLineDash([8,8]);
  ctx.lineWidth=2;
  ctx.beginPath();
  ctx.moveTo(obsBaseX, fieldTop+4);
  ctx.lineTo(obsBaseX, graphY+10);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();

  drawTrackedParticle(ctx, obsActualX, obsY, "");

  ctx.save();
  ctx.strokeStyle="rgba(255,224,102,.95)";
  ctx.fillStyle="rgba(255,224,102,.95)";
  ctx.lineWidth=2.2;
  const arrY = obsY + Math.min(36, rowGap*0.52);
  ctx.beginPath();
  ctx.moveTo(obsBaseX-ampPx, arrY);
  ctx.lineTo(obsBaseX+ampPx, arrY);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(obsBaseX-ampPx, arrY);
  ctx.lineTo(obsBaseX-ampPx+9, arrY-5);
  ctx.moveTo(obsBaseX-ampPx, arrY);
  ctx.lineTo(obsBaseX-ampPx+9, arrY+5);
  ctx.moveTo(obsBaseX+ampPx, arrY);
  ctx.lineTo(obsBaseX+ampPx-9, arrY-5);
  ctx.moveTo(obsBaseX+ampPx, arrY);
  ctx.lineTo(obsBaseX+ampPx-9, arrY+5);
  ctx.stroke();
  ctx.font="12px Sarabun, system-ui, sans-serif";
  ctx.textAlign="center";
  ctx.fillText("การสั่นของอนุภาค", obsBaseX, arrY+18);
  ctx.restore();

  ctx.save();
  ctx.strokeStyle="rgba(255,255,255,.25)";
  ctx.lineWidth=1.4;
  ctx.beginPath(); ctx.moveTo(xMin, graphY); ctx.lineTo(xMax, graphY); ctx.stroke();
  ctx.fillStyle="rgba(207,233,255,.78)";
  ctx.font="13px Sarabun, system-ui, sans-serif";
  ctx.textAlign="center";
  ctx.fillText("ตำแหน่ง x", (xMin+xMax)/2, graphY+28);
  ctx.save();
  ctx.translate(xMin-54, graphY);
  ctx.rotate(-Math.PI/2);
  ctx.fillText("การกระจัด s", 0, 0);
  ctx.restore();

  const graphAmp = Math.min(42, Math.max(24, h * 0.075)) * p.A;
  const pts=[];
  for(let x=xMin; x<=xMax; x++){
    const y = graphY - graphAmp * Math.sin(k*(x-xMin)-phase);
    pts.push([x,y]);
  }
  drawWaveLine(ctx, pts, "#22d3ee", 3.2);
  const obsGraphY = graphY - graphAmp * Math.sin(k*(obsBaseX-xMin)-phase);
  drawTrackedParticle(ctx, obsBaseX, obsGraphY, "");
  ctx.restore();

  ctx.save();
  ctx.font="12px Sarabun, system-ui, sans-serif";
  ctx.textAlign="left";
  const lx = xMin;
  const ly = h - 12;
  ctx.fillStyle="rgba(148,163,184,.92)";
  ctx.beginPath(); ctx.arc(lx, ly-5, 3, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle="rgba(210,225,240,.88)";
  ctx.fillText("ตำแหน่งสมดุล", lx+10, ly);
  ctx.fillStyle="rgba(125,230,255,.92)";
  ctx.beginPath(); ctx.arc(lx+122, ly-5, 5, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle="rgba(210,225,240,.88)";
  ctx.fillText("ตำแหน่งจริงของอนุภาค", lx+134, ly);
  ctx.restore();
}

function drawDisplacementPressureFinal(ctx, c, p, w, h){
  ctx.clearRect(0,0,w,h);

  const bg=ctx.createLinearGradient(0,0,w,h);
  bg.addColorStop(0,"#020817");
  bg.addColorStop(1,"#081532");
  ctx.fillStyle=bg;
  ctx.fillRect(0,0,w,h);

  ctx.strokeStyle="rgba(148,163,184,.10)";
  ctx.lineWidth=1;
  for(let x=0;x<w;x+=78){ ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,h); ctx.stroke(); }
  for(let y=0;y<h;y+=52){ ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(w,y); ctx.stroke(); }

  const xMin = Math.max(110, w * 0.11);
  const xMax = w - 72;
  const obsX = w * 0.57;

  // v5.88: frequency and wave speed affect wavelength, while the graphs now fill the full vertical slot.
  // Reference: at 440 Hz and 343 m/s, wavelengthPx is about 270 px.
  const referenceLambda = 343 / 440;
  const wavelengthPx = Math.max(125, Math.min(560, (p.lambda / referenceLambda) * 270));
  const k = 2 * Math.PI / wavelengthPx;
  const phase = vizState.t * 0.105 * p.speed - p.phase;
  const phaseDiff = p.phaseDiff ?? Math.PI/2;
  const phaseDiffDeg = Math.round(p.phaseDiffDeg ?? 90);
  const phaseDistancePx = wavelengthPx * (phaseDiffDeg / 360);

  // v5.88: make both graphs consume the available vertical slot on mobile.
  const titleY = 32;
  const arrowY = 70;
  const topStartY = 94;
  const bottomMargin = 10;
  const gap = Math.max(32, Math.min(44, h * 0.055));
  const availableGraphH = Math.max(220, h - topStartY - bottomMargin - gap);
  const graphH = Math.max(108, availableGraphH / 2);
  const topCard = {x:xMin-24, y:topStartY, w:xMax-xMin+48, h:graphH};
  const bottomCard = {x:xMin-24, y:topCard.y + topCard.h + gap, w:xMax-xMin+48, h:graphH};
  const topMid = topCard.y + topCard.h/2;
  const bottomMid = bottomCard.y + bottomCard.h/2;
  const ampPx = Math.max(34, topCard.h * 0.36) * p.A;
  const pressureAmpPx = Math.max(34, bottomCard.h * 0.36) * p.A;

  ctx.fillStyle="#cfe9ff";
  ctx.font="20px Sarabun, system-ui, sans-serif";
  ctx.textAlign="left";
  ctx.fillText("Displacement and Pressure (คลื่นการกระจัดและคลื่นความดัน)", 24, titleY);

  ctx.save();
  ctx.strokeStyle="rgba(34,211,238,.96)";
  ctx.fillStyle="rgba(34,211,238,.96)";
  ctx.lineWidth=4;
  ctx.beginPath();
  ctx.moveTo(w*0.29,arrowY);
  ctx.lineTo(w*0.82,arrowY);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(w*0.82,arrowY);
  ctx.lineTo(w*0.795,arrowY-14);
  ctx.lineTo(w*0.795,arrowY+14);
  ctx.closePath();
  ctx.fill();
  ctx.font="bold 17px Sarabun, system-ui, sans-serif";
  ctx.textAlign="center";
  ctx.fillText("ทิศทางการเคลื่อนที่ของคลื่น", w*0.555, arrowY-16);
  ctx.restore();

  function drawPanel(card, strokeCol){
    ctx.save();
    const grad = ctx.createLinearGradient(card.x, card.y, card.x, card.y + card.h);
    grad.addColorStop(0,"rgba(4,18,42,.78)");
    grad.addColorStop(1,"rgba(2,8,24,.38)");
    ctx.fillStyle = grad;
    ctx.strokeStyle = strokeCol;
    ctx.lineWidth = 1.5;
    roundRect(ctx, card.x, card.y, card.w, card.h, 18);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }
  drawPanel(topCard, "rgba(95,185,255,.28)");
  drawPanel(bottomCard, "rgba(255,190,92,.28)");

  ctx.save();
  ctx.strokeStyle="rgba(255,255,255,.18)";
  ctx.setLineDash([6,6]);
  ctx.lineWidth=1.4;
  ctx.beginPath(); ctx.moveTo(xMin, topMid); ctx.lineTo(xMax, topMid); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(xMin, bottomMid); ctx.lineTo(xMax, bottomMid); ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();

  ctx.save();
  ctx.strokeStyle="rgba(255,77,109,.62)";
  ctx.setLineDash([8,8]);
  ctx.lineWidth=2;
  ctx.beginPath();
  ctx.moveTo(obsX, topCard.y-8);
  ctx.lineTo(obsX, bottomCard.y+bottomCard.h+8);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();

  const displacementAt = (x)=> Math.sin(k*(x-obsX)-phase);
  const pressureAt = (x)=> Math.sin(k*(x-obsX)-phase + phaseDiff);

  const topPts=[], bottomPts=[];
  for(let x=xMin; x<=xMax; x++){
    topPts.push([x, topMid - displacementAt(x) * ampPx]);
    bottomPts.push([x, bottomMid - pressureAt(x) * pressureAmpPx]);
  }

  drawWaveLine(ctx, topPts, "#22d3ee", 3.5);
  drawWaveLine(ctx, bottomPts, "#fbbf24", 3.5);

  ctx.save();
  ctx.textAlign="left";
  ctx.font="bold 16px Sarabun, system-ui, sans-serif";
  ctx.fillStyle="rgba(208,247,255,.95)";
  ctx.fillText("การกระจัด s", xMin, topCard.y - 16);
  ctx.fillStyle="rgba(255,234,179,.96)";
  ctx.fillText("ความดัน ΔP", xMin, bottomCard.y - 16);
  ctx.restore();

  function drawXAxis(y){
    ctx.save();
    ctx.strokeStyle="rgba(255,255,255,.22)";
    ctx.lineWidth=1.4;
    ctx.beginPath(); ctx.moveTo(xMin, y); ctx.lineTo(xMax, y); ctx.stroke();
    const ticks = 12;
    for(let i=0;i<ticks;i++){
      const tx = xMin + i * (xMax-xMin) / (ticks-1);
      ctx.beginPath(); ctx.moveTo(tx, y-6); ctx.lineTo(tx, y+6); ctx.stroke();
    }
    ctx.restore();
  }
  drawXAxis(topCard.y + topCard.h + 4);
  drawXAxis(bottomCard.y + bottomCard.h + 4);

  ctx.save();
  ctx.fillStyle="rgba(207,233,255,.78)";
  ctx.font="14px Sarabun, system-ui, sans-serif";
  ctx.textAlign="center";
  ctx.save(); ctx.translate(xMin-58, topMid); ctx.rotate(-Math.PI/2); ctx.fillText("การกระจัด s (สัมพัทธ์)", 0, 0); ctx.restore();
  ctx.save(); ctx.translate(xMin-58, bottomMid); ctx.rotate(-Math.PI/2); ctx.fillText("ความดัน ΔP (สัมพัทธ์)", 0, 0); ctx.restore();
  ctx.fillText("ตำแหน่ง x", w*0.53, topCard.y + topCard.h + 20);
  ctx.fillText("ตำแหน่ง x", w*0.53, bottomCard.y + bottomCard.h + 22);
  ctx.restore();

  ctx.save();
  ctx.font="bold 14px Sarabun, system-ui, sans-serif";
  ctx.textAlign="right";
  const phaseBadgeW = 270;
  const phaseBadgeH = 28;
  const phaseBadgeX = xMax - phaseBadgeW;
  const phaseBadgeY = topCard.y + 10; // v5.89: move below the blue direction arrow, inside graph panel
  ctx.fillStyle="rgba(15,34,66,.88)";
  ctx.strokeStyle="rgba(147,197,253,.40)";
  roundRect(ctx, phaseBadgeX, phaseBadgeY, phaseBadgeW, phaseBadgeH, 12);
  ctx.fill(); ctx.stroke();
  ctx.fillStyle="rgba(235,246,255,.96)";
  ctx.fillText(`Phase Difference: Δφ = ${phaseDiffDeg}°`, phaseBadgeX + phaseBadgeW - 14, phaseBadgeY + 19);
  ctx.restore();

  const phaseX1 = obsX;
  const phaseX2 = Math.min(xMax-10, obsX + phaseDistancePx);
  const phaseY = topCard.y + topCard.h + Math.min(26, gap - 8);
  if(phaseX2 - phaseX1 > 24 && phaseY < bottomCard.y - 8){
    ctx.save();
    ctx.strokeStyle="rgba(196,181,253,.94)";
    ctx.fillStyle="rgba(220,210,255,.96)";
    ctx.lineWidth=2;
    ctx.beginPath(); ctx.moveTo(phaseX1, phaseY); ctx.lineTo(phaseX2, phaseY); ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(phaseX1, phaseY);
    ctx.lineTo(phaseX1+10, phaseY-6);
    ctx.moveTo(phaseX1, phaseY);
    ctx.lineTo(phaseX1+10, phaseY+6);
    ctx.moveTo(phaseX2, phaseY);
    ctx.lineTo(phaseX2-10, phaseY-6);
    ctx.moveTo(phaseX2, phaseY);
    ctx.lineTo(phaseX2-10, phaseY+6);
    ctx.stroke();
    ctx.font="13px Sarabun, system-ui, sans-serif";
    ctx.textAlign="center";
    const frac = phaseDiffDeg===90 ? "λ/4" : `${phaseDiffDeg}/360 λ`;
    ctx.fillText(`${phaseDiffDeg}° ≈ ${frac}`, (phaseX1+phaseX2)/2, phaseY+17);
    ctx.restore();
  }

  const topY = topMid - displacementAt(obsX) * ampPx;
  const bottomY = bottomMid - pressureAt(obsX) * pressureAmpPx;
  drawTrackedParticle(ctx, obsX, topY, "");
  drawTrackedParticle(ctx, obsX, bottomY, "");

  ctx.save();
  ctx.fillStyle="rgba(255,255,255,.86)";
  ctx.font="14px Sarabun, system-ui, sans-serif";
  ctx.textAlign="right";
  ctx.fillText("จุดสังเกต", obsX - 12, topCard.y + 16);
  ctx.restore();
}

function drawPressureWaveFinal(ctx, c, p, w, h){
  ctx.clearRect(0,0,w,h);

  const bg=ctx.createLinearGradient(0,0,w,h);
  bg.addColorStop(0,"#020817");
  bg.addColorStop(1,"#081532");
  ctx.fillStyle=bg;
  ctx.fillRect(0,0,w,h);

  // Background grid
  ctx.strokeStyle="rgba(148,163,184,.10)";
  ctx.lineWidth=1;
  for(let x=0;x<w;x+=78){
    ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,h); ctx.stroke();
  }
  for(let y=0;y<h;y+=52){
    ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(w,y); ctx.stroke();
  }

  const xMin = Math.max(158, w * 0.155);
  const xMax = w - 76;
  const obsXBase = w * 0.555;        // fixed observation position
  const phase = vizState.t * 0.105 * p.speed;
  const wavelengthPx = 270;
  const k = 2 * Math.PI / wavelengthPx;

  const titleY = 34;
  const arrowY = 78;
  const particleTop = 116;
  const particleAxisY = Math.round(h * 0.52);
  const particleBottom = particleAxisY - 24;
  const curveTop = particleAxisY + 72;
  const curveBottom = h - 52;
  const curveMid = (curveTop + curveBottom) / 2;
  const curveAmp = Math.max(42, (curveBottom - curveTop) * 0.40);

  const speakerX = Math.max(66, xMin - 94);
  const speakerY = (particleTop + particleBottom) / 2;
  drawSpeaker(ctx, speakerX, speakerY, 1.12);

  ctx.fillStyle="#cfe9ff";
  ctx.font="20px Sarabun, system-ui, sans-serif";
  ctx.textAlign="left";
  ctx.fillText("Pressure Wave (คลื่นความดัน)", 24, titleY);

  // Direction arrow
  ctx.save();
  ctx.strokeStyle="rgba(34,211,238,.96)";
  ctx.fillStyle="rgba(34,211,238,.96)";
  ctx.lineWidth=4;
  ctx.beginPath();
  ctx.moveTo(w*0.32,arrowY);
  ctx.lineTo(w*0.82,arrowY);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(w*0.82,arrowY);
  ctx.lineTo(w*0.795,arrowY-14);
  ctx.lineTo(w*0.795,arrowY+14);
  ctx.closePath();
  ctx.fill();
  ctx.font="bold 17px Sarabun, system-ui, sans-serif";
  ctx.textAlign="center";
  ctx.fillText("ทิศทางการเคลื่อนที่ของคลื่น", w*0.57, arrowY-16);
  ctx.restore();

  // Same physical model for pressure and particles.
  // ΔP(x,t) ∝ cos(kx - ωt)
  // particle displacement u(x,t) ∝ -sin(kx - ωt)
  const pressureAt = (x)=>Math.cos(k*(x-obsXBase)-phase);
  const displacementAt = (x)=>-9.5 * p.A * Math.sin(k*(x-obsXBase)-phase);

  // Particle field frame
  ctx.save();
  const fieldX0 = xMin-24;
  const fieldY0 = particleTop-18;
  const fieldW = xMax - xMin + 48;
  const fieldH = particleBottom - particleTop + 36;
  const fieldGrad = ctx.createLinearGradient(fieldX0, fieldY0, fieldX0, fieldY0+fieldH);
  fieldGrad.addColorStop(0,"rgba(4,18,42,.78)");
  fieldGrad.addColorStop(1,"rgba(2,8,24,.28)");
  ctx.fillStyle = fieldGrad;
  ctx.strokeStyle = "rgba(95,185,255,.28)";
  ctx.lineWidth = 1.5;
  roundRect(ctx, fieldX0, fieldY0, fieldW, fieldH, 18);
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  // Pressure glow bands
  ctx.save();
  for(let x=xMin; x<=xMax; x+=6){
    const pr = pressureAt(x);
    const alpha = Math.abs(pr);
    const g = ctx.createLinearGradient(x-18,0,x+18,0);
    if(pr >= 0){
      g.addColorStop(0,"rgba(0,0,0,0)");
      g.addColorStop(.5,`rgba(34,211,238,${0.06 + 0.18*alpha})`);
      g.addColorStop(1,"rgba(0,0,0,0)");
    }else{
      g.addColorStop(0,"rgba(0,0,0,0)");
      g.addColorStop(.5,`rgba(168,85,247,${0.05 + 0.15*alpha})`);
      g.addColorStop(1,"rgba(0,0,0,0)");
    }
    ctx.fillStyle=g;
    ctx.fillRect(x-18, particleTop-14, 36, particleBottom-particleTop+28);
  }
  ctx.restore();

  // Natural particle cloud
  const particleHeight = particleBottom - particleTop;
  const densityXGap = Math.max(12, Math.min(17, w * 0.014));
  const densityYGap = Math.max(10, Math.min(14, particleHeight / 10));
  const particleR = Math.max(3.4, Math.min(5.0, w * 0.0048));
  const obsParticleY = (particleTop + particleBottom) / 2;

  function pseudoRand(a,b){
    return Math.abs(Math.sin(a*12.9898 + b*78.233) * 43758.5453) % 1;
  }
  function drawVisibleParticle(x,y,r,pr){
    const hot = pr >= 0;
    ctx.save();
    ctx.shadowColor = hot ? "rgba(76,210,255,.72)" : "rgba(170,110,255,.48)";
    ctx.shadowBlur = hot ? 8 : 6;
    const grad=ctx.createRadialGradient(x-r*.35,y-r*.45,r*.15,x,y,r);
    if(hot){
      grad.addColorStop(0,"rgba(255,255,255,.98)");
      grad.addColorStop(.45,"rgba(140,238,255,.96)");
      grad.addColorStop(1,"rgba(22,150,255,.86)");
    }else{
      grad.addColorStop(0,"rgba(235,250,255,.94)");
      grad.addColorStop(.55,"rgba(120,220,255,.80)");
      grad.addColorStop(1,"rgba(46,125,225,.62)");
    }
    ctx.fillStyle=grad;
    ctx.beginPath();
    ctx.arc(x,y,r,0,Math.PI*2);
    ctx.fill();
    ctx.restore();
  }

  for(let yy=particleTop+10, row=0; yy<=particleBottom-8; yy+=densityYGap, row++){
    for(let base=xMin+10, col=0; base<=xMax-8; base+=densityXGap, col++){
      const pr = pressureAt(base);
      const keepProbability = 0.72 + 0.22 * ((pr + 1) / 2);
      if(pseudoRand(col,row) > keepProbability) continue;

      const x = base + displacementAt(base) + (pseudoRand(col+91,row+7)-0.5) * densityXGap * 0.70;
      const y = yy + (pseudoRand(col+17,row+83)-0.5) * densityYGap * 0.70;

      // Leave room for red observed particle
      if(Math.abs(x-obsXBase) < 8 && Math.abs(y-obsParticleY) < 11) continue;

      const localR = particleR * (0.92 + 0.22 * ((pr + 1) / 2)) * (0.88 + pseudoRand(col+3,row+11)*0.28);
      drawVisibleParticle(x,y,localR,pr);
    }
  }

  // Fixed observation line: this is the x-position used by the pressure graph marker.
  ctx.save();
  ctx.strokeStyle="rgba(255,83,128,.92)";
  ctx.setLineDash([8,8]);
  ctx.lineWidth=2;
  ctx.beginPath();
  ctx.moveTo(obsXBase, particleTop - 20);
  ctx.lineTo(obsXBase, curveBottom + 4);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle="rgba(255,230,235,.98)";
  ctx.font="15px Sarabun, system-ui, sans-serif";
  ctx.textAlign="center";
  ctx.fillText("จุดสังเกต", obsXBase, particleTop-26);
  ctx.restore();

  // Red observed particle: moves left-right around the fixed observation position.
  const redParticleX = obsXBase + displacementAt(obsXBase);
  ctx.save();
  ctx.strokeStyle="rgba(255,190,210,.90)";
  ctx.lineWidth=3;
  ctx.beginPath();
  ctx.moveTo(obsXBase, obsParticleY);
  ctx.lineTo(redParticleX, obsParticleY);
  ctx.stroke();
  const dir = redParticleX >= obsXBase ? 1 : -1;
  ctx.fillStyle="rgba(255,190,210,.95)";
  ctx.beginPath();
  ctx.moveTo(redParticleX, obsParticleY);
  ctx.lineTo(redParticleX - dir*13, obsParticleY - 7);
  ctx.lineTo(redParticleX - dir*13, obsParticleY + 7);
  ctx.closePath();
  ctx.fill();
  drawParticleShadow(ctx,redParticleX,obsParticleY,8.5);
  drawParticleSphere(ctx,redParticleX,obsParticleY,8.5,"red");
  ctx.restore();

  // Labels
  ctx.save();
  ctx.font="bold 14px Sarabun, system-ui, sans-serif";
  ctx.textAlign="center";
  const labelY = particleTop - 4;
  const compressionText = "ส่วนอัด (Compression)";
  const rarefactionText = "ส่วนขยาย (Rarefaction)";
  let compressionX = obsXBase - wavelengthPx * 0.22;
  let rarefactionX = obsXBase + wavelengthPx * 0.62;

  const compressionW = ctx.measureText(compressionText).width;
  const rarefactionW = ctx.measureText(rarefactionText).width;
  const minGap = 28;

  compressionX = Math.max(xMin + compressionW/2 + 10, compressionX);
  rarefactionX = Math.min(xMax - rarefactionW/2 - 10, rarefactionX);

  if(compressionX + compressionW/2 + minGap > rarefactionX - rarefactionW/2){
    const mid = (compressionX + rarefactionX) / 2;
    compressionX = mid - (compressionW/2 + minGap/2);
    rarefactionX = mid + (rarefactionW/2 + minGap/2);
    compressionX = Math.max(xMin + compressionW/2 + 10, compressionX);
    rarefactionX = Math.min(xMax - rarefactionW/2 - 10, rarefactionX);
  }

  function drawLabelPill(cx, text, fill, stroke, textColor){
    const tw = ctx.measureText(text).width;
    const pillW = tw + 18;
    const pillH = 24;
    const px = cx - pillW/2;
    const py = labelY - 17;
    ctx.save();
    ctx.fillStyle = fill;
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 1;
    roundRect(ctx, px, py, pillW, pillH, 12);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = textColor;
    ctx.textBaseline = "middle";
    ctx.fillText(text, cx, py + pillH/2 + 1);
    ctx.restore();
  }

  drawLabelPill(compressionX, compressionText, "rgba(18,70,92,.70)", "rgba(80,235,255,.45)", "rgba(80,235,255,.98)");
  drawLabelPill(rarefactionX, rarefactionText, "rgba(70,34,92,.72)", "rgba(220,150,255,.42)", "rgba(220,150,255,.98)");
  ctx.restore();

  // x-axis under particle graph
  ctx.save();
  ctx.strokeStyle="rgba(255,245,220,.94)";
  ctx.fillStyle="rgba(255,255,255,.94)";
  ctx.lineWidth=2;
  ctx.beginPath();
  ctx.moveTo(xMin-34, particleAxisY);
  ctx.lineTo(w-46, particleAxisY);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(w-46, particleAxisY);
  ctx.lineTo(w-61, particleAxisY-9);
  ctx.moveTo(w-46, particleAxisY);
  ctx.lineTo(w-61, particleAxisY+9);
  ctx.stroke();
  for(let i=0;i<7;i++){
    const tx=(xMin-30)+i*((w-xMin-50)/(6));
    ctx.beginPath();
    ctx.moveTo(tx,particleAxisY-10);
    ctx.lineTo(tx,particleAxisY+10);
    ctx.stroke();
  }
  ctx.font="20px Sarabun, system-ui, sans-serif";
  ctx.fillText("x", w-36, particleAxisY+28);
  ctx.restore();

  // Lower pressure graph axes
  ctx.save();
  ctx.strokeStyle="rgba(255,245,220,.96)";
  ctx.fillStyle="rgba(255,255,255,.96)";
  ctx.lineWidth=2;

  ctx.beginPath();
  ctx.moveTo(xMin-34, curveMid);
  ctx.lineTo(w-46, curveMid);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(w-46, curveMid);
  ctx.lineTo(w-61, curveMid-9);
  ctx.moveTo(w-46, curveMid);
  ctx.lineTo(w-61, curveMid+9);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(xMin-34, curveBottom);
  ctx.lineTo(xMin-34, curveTop);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(xMin-34, curveTop);
  ctx.lineTo(xMin-43, curveTop+15);
  ctx.moveTo(xMin-34, curveTop);
  ctx.lineTo(xMin-25, curveTop+15);
  ctx.stroke();

  ctx.save();
  ctx.strokeStyle="rgba(255,255,255,.62)";
  ctx.setLineDash([6,7]);
  ctx.beginPath();
  ctx.moveTo(xMin-34, curveMid);
  ctx.lineTo(w-58, curveMid);
  ctx.stroke();
  ctx.restore();

  for(let i=0;i<7;i++){
    const tx=(xMin-30)+i*((w-xMin-50)/(6));
    ctx.beginPath();
    ctx.moveTo(tx,curveMid-8);
    ctx.lineTo(tx,curveMid+8);
    ctx.stroke();
  }
  for(let j=-1;j<=1;j++){
    const ty = curveMid - j*curveAmp;
    ctx.beginPath();
    ctx.moveTo(xMin-43,ty);
    ctx.lineTo(xMin-25,ty);
    ctx.stroke();
  }

  ctx.font="20px Sarabun, system-ui, sans-serif";
  ctx.fillText("x", w-36, curveMid+28);

  ctx.save();
  ctx.translate(xMin-78, curveMid);
  ctx.rotate(-Math.PI/2);
  ctx.font="bold 15px Sarabun, system-ui, sans-serif";
  ctx.fillStyle="rgba(255,255,255,.94)";
  ctx.textAlign="center";
  ctx.fillText("ความดัน ΔP", 0, 0);
  ctx.restore();

  ctx.font="14px Sarabun, system-ui, sans-serif";
  ctx.textAlign="left";
  ctx.fillText("สูง", xMin-85, curveTop+9);
  ctx.fillText("0", xMin-76, curveMid+5);
  ctx.fillText("ต่ำ", xMin-85, curveBottom+4);
  ctx.restore();

  // Pressure curve uses pressureAt(x). The red marker stays at the fixed observation x.
  const pts=[];
  for(let x=xMin; x<=xMax; x+=4){
    const y = curveMid - pressureAt(x) * curveAmp;
    pts.push([x,y]);
  }
  ctx.save();
  ctx.strokeStyle="rgba(74,222,128,.96)";
  ctx.lineWidth=4;
  ctx.shadowColor="rgba(74,222,128,.42)";
  ctx.shadowBlur=10;
  ctx.beginPath();
  pts.forEach(([x,y],i)=> i ? ctx.lineTo(x,y) : ctx.moveTo(x,y));
  ctx.stroke();
  ctx.restore();

  const graphMarkerX = obsXBase;
  const graphMarkerY = curveMid - pressureAt(graphMarkerX) * curveAmp;
  ctx.save();
  drawParticleShadow(ctx, graphMarkerX, graphMarkerY, 9.5);
  drawParticleSphere(ctx, graphMarkerX, graphMarkerY, 9.5, "red");
  ctx.restore();
}

function drawVizLegend(ctx,c){
  // legend hidden on longitudinal focus page to keep the graph clean
}



function getSpeedSoundParams(){
  const d = Number($("vizDistance")?.value || 5);
  const T = Number($("vizTemp")?.value || 20);
  const timeScale = Number($("vizTimeSpeed")?.value || 0.05);
  const v = 331 + 0.6 * T;
  const dt = d / v;
  if($("vizDistanceLabel")) $("vizDistanceLabel").textContent = d.toFixed(1) + " m";
  if($("vizTempLabel")) $("vizTempLabel").textContent = T.toFixed(0) + " °C";
  if($("vizSoundSpeedLabel")) $("vizSoundSpeedLabel").textContent = v.toFixed(1) + " m/s";
  if($("vizTravelTimeLabel")) $("vizTravelTimeLabel").textContent = (dt * 1000).toFixed(1) + " ms";
  if($("vizTimeLabel")) $("vizTimeLabel").textContent = timeScale.toFixed(2) + "×";
  return {d,T,v,dt,timeScale};
}

function drawMicIcon(ctx, x, y, s=1){
  ctx.save();
  ctx.translate(x,y);
  ctx.scale(s,s);
  ctx.fillStyle="rgba(10,16,30,.92)";
  ctx.strokeStyle="rgba(230,242,255,.78)";
  ctx.lineWidth=2;
  roundRect(ctx,-13,-22,26,32,12);
  ctx.fill();
  ctx.stroke();
  ctx.strokeStyle="rgba(125,230,255,.72)";
  ctx.lineWidth=1.2;
  for(let yy=-15; yy<=3; yy+=5){
    ctx.beginPath();
    ctx.moveTo(-7,yy);
    ctx.lineTo(7,yy);
    ctx.stroke();
  }
  ctx.strokeStyle="rgba(230,242,255,.82)";
  ctx.lineWidth=2;
  ctx.beginPath();
  ctx.moveTo(0,10);
  ctx.lineTo(0,28);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(-14,28);
  ctx.lineTo(14,28);
  ctx.stroke();
  const glow=ctx.createRadialGradient(0,0,2,0,0,38);
  glow.addColorStop(0,"rgba(125,230,255,.28)");
  glow.addColorStop(1,"rgba(125,230,255,0)");
  ctx.fillStyle=glow;
  ctx.beginPath();
  ctx.arc(0,0,38,0,Math.PI*2);
  ctx.fill();
  ctx.restore();
}

function drawTeachingBadge(ctx, x, y, w, h, title, value, stroke){
  ctx.save();
  ctx.fillStyle="rgba(7,18,38,.84)";
  ctx.strokeStyle=stroke;
  ctx.lineWidth=1.5;
  roundRect(ctx,x,y,w,h,14);
  ctx.fill(); ctx.stroke();
  ctx.fillStyle="rgba(185,205,232,.92)";
  ctx.font="13px Sarabun, system-ui, sans-serif";
  ctx.textAlign="left";
  ctx.fillText(title,x+16,y+20);
  ctx.fillStyle="rgba(245,248,255,.98)";
  ctx.font="bold 22px Sarabun, system-ui, sans-serif";
  ctx.fillText(value,x+16,y+48);
  ctx.restore();
}

function drawSpeedOfSoundTeachingFinal(ctx, c, pUnused, w, h){
  const p = getSpeedSoundParams();
  ctx.clearRect(0,0,w,h);

  const bg=ctx.createLinearGradient(0,0,w,h);
  bg.addColorStop(0,"#020817");
  bg.addColorStop(1,"#06152e");
  ctx.fillStyle=bg;
  ctx.fillRect(0,0,w,h);

  ctx.strokeStyle="rgba(148,163,184,.10)";
  ctx.lineWidth=1;
  for(let x=0;x<w;x+=78){ ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,h); ctx.stroke(); }
  for(let y=0;y<h;y+=52){ ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(w,y); ctx.stroke(); }

  const titleY = 34;
  const panelY = 92;
  const panelX = Math.max(34, w*0.045);
  const panelW = w - panelX*2;
  const panelH = Math.max(245, h - panelY - 68);
  const midY = panelY + panelH*0.42;
  const sourceX = panelX + 92;
  const micX = panelX + panelW - 92;
  const lineStart = sourceX + 42;
  const lineEnd = micX - 42;
  const pathW = lineEnd - lineStart;

  ctx.fillStyle="#d8efff";
  ctx.font="20px Sarabun, system-ui, sans-serif";
  ctx.textAlign="left";
  ctx.fillText("Speed of Sound (อัตราเร็วเสียง)", 24, titleY);

  ctx.save();
  ctx.fillStyle="rgba(4,18,42,.72)";
  ctx.strokeStyle="rgba(88,166,255,.32)";
  ctx.lineWidth=1.5;
  roundRect(ctx,panelX,panelY,panelW,panelH,18);
  ctx.fill(); ctx.stroke();
  ctx.restore();

  // direction arrow, same feeling as the three existing visualizer pages
  ctx.save();
  ctx.strokeStyle="rgba(34,211,238,.96)";
  ctx.fillStyle="rgba(34,211,238,.96)";
  ctx.lineWidth=4;
  ctx.beginPath();
  ctx.moveTo(w*0.36, panelY+44);
  ctx.lineTo(w*0.64, panelY+44);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(w*0.64, panelY+44);
  ctx.lineTo(w*0.62, panelY+32);
  ctx.lineTo(w*0.62, panelY+56);
  ctx.closePath();
  ctx.fill();
  ctx.font="bold 15px Sarabun, system-ui, sans-serif";
  ctx.textAlign="center";
  ctx.fillText("ทิศทางการเคลื่อนที่ของพัลส์เสียง", w*0.50, panelY+25);
  ctx.restore();

  ctx.save();
  ctx.strokeStyle="rgba(125,230,255,.42)";
  ctx.setLineDash([7,9]);
  ctx.lineWidth=2.2;
  ctx.beginPath();
  ctx.moveTo(lineStart,midY);
  ctx.lineTo(lineEnd,midY);
  ctx.stroke();
  ctx.restore();

  drawSpeaker(ctx, sourceX, midY, 1.02);
  drawMicIcon(ctx, micX, midY, 1.06);

  ctx.fillStyle="rgba(245,248,255,.96)";
  ctx.font="bold 14px Sarabun, system-ui, sans-serif";
  ctx.textAlign="center";
  ctx.fillText("แหล่งกำเนิดเสียง", sourceX, midY+64);
  ctx.fillText("ไมโครโฟน", micX, midY+64);

  const displaySlowFactor = 40; // v5.96 extra slow-motion display only; physics values stay real
  const elapsed = Math.min((vizState.t*0.016*p.timeScale)/displaySlowFactor, p.dt);
  const frac = Math.min(1, p.dt>0 ? elapsed/p.dt : 0);
  const pulseX = lineStart + pathW*frac;
  const reached = frac >= 0.999;

  const pulseBand = ctx.createLinearGradient(pulseX-40,0,pulseX+40,0);
  pulseBand.addColorStop(0,"rgba(0,0,0,0)");
  pulseBand.addColorStop(.45,"rgba(34,211,238,.16)");
  pulseBand.addColorStop(.5,"rgba(34,211,238,.68)");
  pulseBand.addColorStop(.55,"rgba(255,77,109,.28)");
  pulseBand.addColorStop(1,"rgba(0,0,0,0)");
  ctx.fillStyle=pulseBand;
  ctx.fillRect(pulseX-40, panelY+64, 80, panelH-154);

  for(let i=0;i<6;i++){
    const rx = Math.max(lineStart, pulseX - i*28 - (vizState.t%20)*0.7);
    if(rx < lineStart+6) continue;
    ctx.strokeStyle=`rgba(34,211,238,${0.42-i*0.045})`;
    ctx.lineWidth=2;
    ctx.beginPath();
    ctx.arc(rx,midY,32+i*5,-0.55,0.55);
    ctx.stroke();
  }

  ctx.fillStyle="rgba(255,77,109,.98)";
  ctx.beginPath();
  ctx.arc(pulseX, midY, 8.2, 0, Math.PI*2);
  ctx.fill();
  ctx.strokeStyle="rgba(255,255,255,.95)";
  ctx.lineWidth=2;
  ctx.beginPath();
  ctx.arc(pulseX, midY, 11.5, 0, Math.PI*2);
  ctx.stroke();

  const arrowY = panelY + panelH - 72;
  ctx.save();
  ctx.strokeStyle="rgba(255,210,55,.98)";
  ctx.fillStyle="rgba(255,210,55,.98)";
  ctx.lineWidth=2.4;
  ctx.beginPath();
  ctx.moveTo(lineStart,arrowY);
  ctx.lineTo(lineEnd,arrowY);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(lineStart,arrowY);
  ctx.lineTo(lineStart+11,arrowY-7);
  ctx.moveTo(lineStart,arrowY);
  ctx.lineTo(lineStart+11,arrowY+7);
  ctx.moveTo(lineEnd,arrowY);
  ctx.lineTo(lineEnd-11,arrowY-7);
  ctx.moveTo(lineEnd,arrowY);
  ctx.lineTo(lineEnd-11,arrowY+7);
  ctx.stroke();
  ctx.setLineDash([5,6]);
  ctx.beginPath(); ctx.moveTo(lineStart,panelY+74); ctx.lineTo(lineStart,arrowY+18); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(lineEnd,panelY+74); ctx.lineTo(lineEnd,arrowY+18); ctx.stroke();
  ctx.setLineDash([]);
  ctx.font="bold 18px Sarabun, system-ui, sans-serif";
  ctx.textAlign="center";
  ctx.fillText(`ระยะทาง s = ${p.d.toFixed(1)} m`, (lineStart+lineEnd)/2, arrowY+30);
  ctx.restore();

  const badgeY = panelY + panelH - 132;
  const bW = Math.min(180, (panelW-58)/3);
  drawTeachingBadge(ctx, panelX+24, badgeY, bW, 58, "เวลาที่วัดได้", `${(elapsed*1000).toFixed(1)} ms`, "rgba(34,211,238,.58)");
  drawTeachingBadge(ctx, panelX+34+bW, badgeY, bW, 58, "อัตราเร็วเสียง", `${p.v.toFixed(1)} m/s`, "rgba(52,211,153,.58)");
  drawTeachingBadge(ctx, panelX+44+bW*2, badgeY, bW, 58, "ความสัมพันธ์", "v = s / Δt", "rgba(168,85,247,.58)");

  if(reached){
    const glow=ctx.createRadialGradient(micX,midY,6,micX,midY,48);
    glow.addColorStop(0,"rgba(255,210,55,.55)");
    glow.addColorStop(1,"rgba(255,210,55,0)");
    ctx.fillStyle=glow;
    ctx.beginPath();
    ctx.arc(micX,midY,48,0,Math.PI*2);
    ctx.fill();
    ctx.fillStyle="rgba(255,230,160,.96)";
    ctx.font="bold 14px Sarabun, system-ui, sans-serif";
    ctx.textAlign="center";
    ctx.fillText("เสียงเดินทางถึงไมโครโฟน", micX, midY-44);
  }
}



function drawVisualizer(){
  const c=$("visualizerCanvas"); if(!c) return;
  const ctx=c.getContext("2d");
  const p=getVizParams();
  vizGrid(ctx,c);
  const W=c.width,H=c.height, mid=H/2;
  const phase=vizState.t*0.055*p.speed;
  const mode=vizState.mode;

  // v5.40: force Longitudinal Wave to use the custom final renderer before the old branch.
  if(mode==="longitudinal"){
    drawLongitudinalFinal(ctx,c,p,W,H);
    if(vizState.running) vizState.t += 1;
    vizState.raf=requestAnimationFrame(drawVisualizer);
    return;
  }

  if(mode==="pressure"){
    drawPressureWaveFinal(ctx,c,p,W,H);
    if(vizState.running) vizState.t += 1;
    vizState.raf=requestAnimationFrame(drawVisualizer);
    return;
  }

  if(mode==="speedSound"){
    drawSpeedOfSoundTeachingFinal(ctx,c,p,W,H);
    if(vizState.running){
      const ps = getSpeedSoundParams();
      const displaySlowFactor = 40;
      const elapsed = (vizState.t * 0.016 * ps.timeScale) / displaySlowFactor;
      const resetAt = Math.max(ps.dt + 0.45, 0.85);
      vizState.t = elapsed >= resetAt ? 0 : vizState.t + 1;
    }
    vizState.raf=requestAnimationFrame(drawVisualizer);
    return;
  }
  if(rebuiltTopicModes.has(mode)){
    drawRebuiltTopic(ctx,c,p,W,H,mode);
    if(vizState.running) vizState.t += 1;
    vizState.raf=requestAnimationFrame(drawVisualizer);
    return;
  }


if(mode==="displacementPressure"){

    drawDisplacementPressureFinal(ctx,c,p,W,H);
    if(vizState.running) vizState.t += 1;
    vizState.raf=requestAnimationFrame(drawVisualizer);
    return;
  }


  ctx.fillStyle="#cfe9ff"; ctx.font="20px Sarabun";
  ctx.fillText(modeLabel(mode),24,34);
  drawVizAxis(ctx,c,mode);
  drawVizScale(ctx,c,mode);
  if(c.dataset.vizMode!=="longitudinal") drawVizLegend(ctx,c);

  if(mode==="longitudinal" || mode==="pressure"){
    const trackedIndex = 30;
    const rows = mode==="longitudinal" ? [mid] : [mid-50, mid+50];
    for(const yBase of rows){
      for(let i=0;i<70;i++){
        const x0=70+i*(W-140)/69;
        const disp=Math.sin((i/69)*Math.PI*8-phase)*p.A*22;
        const x=x0+disp;
        const density=(Math.sin((i/69)*Math.PI*8-phase)+1)/2;
        const isTracked = i===trackedIndex;
        ctx.fillStyle=isTracked ? "#ff4d6d" : (mode==="pressure"?`rgba(34,211,238,${0.25+0.65*density})`:"#22d3ee");
        ctx.beginPath(); ctx.arc(x,yBase,isTracked?8:(mode==="pressure"?5+7*density:6),0,Math.PI*2); ctx.fill();
        if(isTracked){
          ctx.strokeStyle="#ffffff"; ctx.lineWidth=2;
          ctx.beginPath(); ctx.arc(x,yBase,(mode==="pressure"?5+7*density:6)+2,0,Math.PI*2); ctx.stroke();
        }
        if(mode==="longitudinal"){
          ctx.strokeStyle="rgba(255,255,255,.14)";
          ctx.lineWidth=1;
          ctx.beginPath(); ctx.moveTo(x0,yBase-35); ctx.lineTo(x0,yBase+35); ctx.stroke();
          if(isTracked){
            drawTrackedVertical(ctx,x0,yBase-42,yBase+42);
            drawTrackedParticle(ctx,x,yBase,"");
            drawLongitudinalAnnotations(ctx,x0,x,yBase);
          }
        }
        if(mode==="pressure" && isTracked && yBase===mid-50){
          drawTrackedParticle(ctx,x,yBase,"");
        }
      }
    }
    if(mode==="pressure"){
      for(let x=70;x<W-70;x+=4){
        const val=(Math.sin((x-70)/(W-140)*Math.PI*8-phase)+1)/2;
        ctx.fillStyle=`rgba(34,211,238,${0.05+0.55*val})`;
        ctx.fillRect(x,mid-140,4,280);
      }
    }
  }

  if(soundTopicModes.has(mode)){
    drawSoundTopicPlaceholder(ctx,c,p,W,H,mode);
    if(vizState.running) vizState.t += 1;
    vizState.raf=requestAnimationFrame(drawVisualizer);
    return;
  }

  if(mode==="displacementPressure"){
    const pts1=[], pts2=[];
    for(let x=60;x<W-60;x++){
      const u=(x-60)/(W-120)*Math.PI*8-phase;
      pts1.push([x,150-Math.sin(u)*p.A*55]);
      pts2.push([x,360-Math.cos(u)*p.A*55]);
    }
    const trackedIdx = Math.floor(pts1.length*0.42);
    ctx.fillStyle="#9fb3c8"; ctx.fillText("Displacement",70,85); ctx.fillText("Pressure",70,295);
    drawWaveLine(ctx,pts1,"#22d3ee",3); drawWaveLine(ctx,pts2,"#fbbf24",3);
    drawTrackedVertical(ctx,pts1[trackedIdx][0],105,415);
    drawTrackedParticle(ctx,pts1[trackedIdx][0],pts1[trackedIdx][1],"observation point");
    drawTrackedParticle(ctx,pts2[trackedIdx][0],pts2[trackedIdx][1],"same x-position");
  }

  if(mode==="transverseCompare"){
    const trackedIndex = 22;
    for(let i=0;i<60;i++){
      const x0=70+i*(W-140)/59;
      const disp=Math.sin((i/59)*Math.PI*8-phase)*p.A*20;
      const isTracked = i===trackedIndex;
      ctx.fillStyle=isTracked ? "#ff4d6d" : "#22d3ee";
      ctx.beginPath(); ctx.arc(x0+disp,160,isTracked?7:5,0,Math.PI*2); ctx.fill();
      if(isTracked){
        ctx.strokeStyle="#ffffff"; ctx.lineWidth=2;
        ctx.beginPath(); ctx.arc(x0+disp,160,9,0,Math.PI*2); ctx.stroke();
        drawTrackedParticle(ctx,x0+disp,160,"tracked particle");
      }
    }
    const pts=[];
    for(let x=60;x<W-60;x++){
      const y=365-Math.sin((x-60)/(W-120)*Math.PI*8-phase)*p.A*60;
      pts.push([x,y]);
    }
    const trackedCurveIdx = Math.floor(pts.length*0.42);
    ctx.fillStyle="#9fb3c8"; ctx.fillText("Longitudinal representation",70,95); ctx.fillText("Transverse representation",70,295);
    drawWaveLine(ctx,pts,"#fbbf24",3);
    drawTrackedParticle(ctx,pts[trackedCurveIdx][0],pts[trackedCurveIdx][1],"same wave position");
  }

  if(mode==="superposition" || mode==="beatsViz"){
    const ptsA=[], ptsB=[], ptsSum=[];
    const f2 = mode==="beatsViz" ? p.f+8 : p.f*1.35;
    for(let x=60;x<W-60;x++){
      const xx=(x-60)/(W-120);
      const y1=Math.sin(xx*Math.PI*8-phase)*p.A*45;
      const y2=Math.sin(xx*Math.PI*8*(f2/p.f)-phase*1.07)*p.A*45;
      ptsA.push([x,135-y1]); ptsB.push([x,250-y2]); ptsSum.push([x,385-(y1+y2)*0.72]);
    }
    const trackedIdx = Math.floor(ptsA.length*0.36);
    drawWaveLine(ctx,ptsA,"#22d3ee",2); drawWaveLine(ctx,ptsB,"#a855f7",2); drawWaveLine(ctx,ptsSum,"#fbbf24",4);
    ctx.fillStyle="#9fb3c8"; ctx.fillText("Wave A",70,80); ctx.fillText("Wave B",70,195); ctx.fillText("Result",70,330);
    drawTrackedVertical(ctx,ptsA[trackedIdx][0],85,405);
    drawTrackedParticle(ctx,ptsA[trackedIdx][0],ptsA[trackedIdx][1],"wave A point");
    drawTrackedParticle(ctx,ptsB[trackedIdx][0],ptsB[trackedIdx][1],"wave B point");
    drawTrackedParticle(ctx,ptsSum[trackedIdx][0],ptsSum[trackedIdx][1],"result point");
  }

  if(mode==="standingAir"){
    const closed=p.sub==="closed";
    const tubeX=90,tubeY=110,tubeW=W-180,tubeH=230;
    const trackedIndex = 10;
    ctx.strokeStyle="#cfe9ff"; ctx.lineWidth=5;
    ctx.strokeRect(tubeX,tubeY,tubeW,tubeH);
    if(closed){ctx.fillStyle="#cfe9ff";ctx.fillRect(tubeX-8,tubeY-5,12,tubeH+10);}
    const pts=[];
    for(let x=0;x<=tubeW;x++){
      const xx=x/tubeW;
      const shape=closed?Math.sin(xx*Math.PI/2):Math.sin(xx*Math.PI);
      const y=tubeY+tubeH/2-Math.sin(phase)*shape*p.A*95;
      pts.push([tubeX+x,y]);
    }
    drawWaveLine(ctx,pts,"#22d3ee",4);
    for(let i=0;i<18;i++){
      const x=tubeX+20+i*(tubeW-40)/17;
      const xx=(x-tubeX)/tubeW;
      const shape=closed?Math.sin(xx*Math.PI/2):Math.sin(xx*Math.PI);
      const y = tubeY+tubeH/2-Math.sin(phase)*shape*p.A*70;
      const isTracked = i===trackedIndex;
      ctx.fillStyle=isTracked ? "#ff4d6d" : "#fbbf24";
      ctx.beginPath();ctx.arc(x,y,isTracked?7:5,0,Math.PI*2);ctx.fill();
      if(isTracked){
        ctx.strokeStyle="#ffffff"; ctx.lineWidth=2;
        ctx.beginPath(); ctx.arc(x,y,9,0,Math.PI*2); ctx.stroke();
        drawTrackedParticle(ctx,x,y,"tracked air particle");
      }
    }
  }

  if(mode==="resonanceViz"){
    const f0=440, width=55;
    const pts=[];
    for(let x=80;x<W-80;x++){
      const freq=100+(x-80)/(W-160)*900;
      const amp=Math.exp(-Math.pow((freq-f0)/width,2));
      pts.push([x,H-80-amp*p.A*320]);
    }
    drawWaveLine(ctx,pts,"#34d399",4);
    ctx.strokeStyle="#fbbf24";ctx.lineWidth=2;const rx=80+(f0-100)/900*(W-160);ctx.beginPath();ctx.moveTo(rx,80);ctx.lineTo(rx,H-70);ctx.stroke();
    const peakY = H-80-1*p.A*320;
    drawTrackedParticle(ctx,rx,peakY,"resonance peak");
  }

  if(mode==="harmonicsViz"){
    const type=p.sub;
    const bars = type==="square" ? [1,0,0.33,0,0.2,0,0.14] : type==="sawtooth" ? [1,0.5,0.33,0.25,0.2,0.16,0.14] : [1,0,0,0,0,0,0];
    const baseX=140, baseY=H-90, gap=120;
    bars.forEach((a,i)=>{
      const h=a*330*p.A;
      ctx.fillStyle=i===0?"#ff4d6d":"#a855f7";
      ctx.fillRect(baseX+i*gap,baseY-h,55,h);
      if(i===0){
        ctx.strokeStyle="#ffffff"; ctx.lineWidth=2;
        ctx.strokeRect(baseX+i*gap-2,baseY-h-2,59,h+4);
        drawTrackedParticle(ctx,baseX+i*gap+27,baseY-h,"fundamental");
      }
      ctx.fillStyle="#cfe9ff";ctx.font="16px Sarabun";ctx.fillText(`${i+1}f`,baseX+i*gap+10,baseY+24);
    });
  }

  if(mode==="dopplerViz"){
    const sx=360+Math.sin(phase*0.18)*220, sy=mid;
    const ox = W-160, oy = mid-40;
    ctx.fillStyle="#fbbf24";ctx.beginPath();ctx.arc(sx,sy,14,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle="rgba(34,211,238,.65)";ctx.lineWidth=3;
    for(let r=40;r<520;r+=42){
      ctx.beginPath();ctx.arc(sx-r*0.18,sy,r,0,Math.PI*2);ctx.stroke();
    }
    ctx.fillStyle="#cfe9ff";ctx.font="18px Sarabun";ctx.fillText("source",sx+20,sy-18);
    drawTrackedParticle(ctx,ox,oy,"observer point");
  }

  if(vizState.running) vizState.t += 1;
  vizState.raf=requestAnimationFrame(drawVisualizer);
}
function modeLabel(mode){
  return {
    longitudinal:"Longitudinal Wave (คลื่นตามยาว)",
    pressure:"Pressure Variation",
    displacementPressure:"Displacement + Pressure",
    transverseCompare:"Longitudinal / Transverse",
    superposition:"Superposition",
    beatsViz:"Beats",
    standingAir:"Standing Wave in Air Column",
    resonanceViz:"Resonance",
    harmonicsViz:"Harmonics / Timbre",
    dopplerViz:"Doppler"
  }[mode] || mode;
}
function updateVizPlayerButtons(trigger){
  const play=$("vizPlayBtn"), pause=$("vizPauseBtn"), reset=$("vizResetBtn");
  if(play) play.classList.toggle("isActive", !!vizState.running);
  if(pause) pause.classList.toggle("isActive", !vizState.running);
  if(reset){
    reset.classList.remove("isPressed");
    if(trigger==="reset"){
      void reset.offsetWidth;
      reset.classList.add("isPressed");
      setTimeout(()=>reset.classList.remove("isPressed"), 420);
    }
  }
}


function playReflectionEchoDemo(){
  const distance = Number($("vizDistance")?.value || 10);
  const amp = Number($("vizAmp")?.value || 0.8);
  const wallType = $("vizWallType","vizRefractionMode","vizHotSide")?.value || "rigid";
  const echoDelay = 2*distance/343;
  const echoOccurs = echoDelay >= 0.10;
  const reflRatio = wallType === "rigid" ? 0.90 : 0.45;
  const label = $("vizEchoAudioLabel");
  const sample = vizState.echoSample || "physics";

  if(!("speechSynthesis" in window)){
    if(label) label.textContent = "ไม่รองรับเสียงพูด";
    alert("เบราว์เซอร์นี้ไม่รองรับเสียงพูดอัตโนมัติ");
    return;
  }

  const synth = window.speechSynthesis;
  const baseVolume = Math.max(0.55, Math.min(1, amp));
  const echo1Volume = Math.max(0.10, Math.min(0.62, baseVolume * reflRatio * 0.55));
  const echo2Volume = Math.max(0.05, Math.min(0.34, baseVolume * reflRatio * 0.28));
  const echo3Volume = Math.max(0.03, Math.min(0.18, baseVolume * reflRatio * 0.14));

  const chooseVoice = () => {
    const voices = synth.getVoices ? synth.getVoices() : [];
    return voices.find(v => /en-US/i.test(v.lang || ""))
      || voices.find(v => /^en/i.test(v.lang || ""))
      || voices[0]
      || null;
  };

  const speak = (text, delayMs, volume, rate=0.90, pitch=1.0) => {
    setTimeout(()=>{
      try{
        const u = new SpeechSynthesisUtterance(text);
        const voice = chooseVoice();
        u.lang = voice?.lang || "en-US";
        if(voice) u.voice = voice;
        u.volume = Math.max(0.02, Math.min(1, volume));
        u.rate = rate;
        u.pitch = pitch;
        synth.speak(u);
      }catch(err){
        if(label) label.textContent = "เล่นเสียงไม่ได้";
      }
    }, Math.max(0, delayMs));
  };

  const sampleConfigs = {
    physics: {
      direct: { text:"physics", rate:0.90, pitch:1.00 },
      echoes: [
        { text:"sics", rate:0.84, pitch:0.96 },
        { text:"sics", rate:0.80, pitch:0.94 },
        { text:"sics", rate:0.78, pitch:0.92 }
      ]
    },
    hello: {
      direct: { text:"hello", rate:0.92, pitch:1.00 },
      echoes: [
        { text:"lo", rate:0.86, pitch:0.97 },
        { text:"lo", rate:0.82, pitch:0.95 },
        { text:"lo", rate:0.80, pitch:0.93 }
      ]
    }
  };
  const cfg = sampleConfigs[sample] || sampleConfigs.physics;

  try{
    synth.cancel();
    synth.resume();
    speak(cfg.direct.text, 40, baseVolume, cfg.direct.rate, cfg.direct.pitch);

    if(echoOccurs){
      const d1 = Math.round(echoDelay*1000) + 40;
      speak(cfg.echoes[0].text, d1, echo1Volume, cfg.echoes[0].rate, cfg.echoes[0].pitch);
      speak(cfg.echoes[1].text, Math.round(echoDelay*2000) + 40, echo2Volume, cfg.echoes[1].rate, cfg.echoes[1].pitch);
      if(echoDelay >= 0.16){
        speak(cfg.echoes[2].text, Math.round(echoDelay*3000) + 40, echo3Volume, cfg.echoes[2].rate, cfg.echoes[2].pitch);
      }
      if(label) label.textContent = "✅ เกิด Echo";
    }else{
      if(label) label.textContent = "⚠️ ยังไม่เกิด Echo";
    }
  }catch(e){
    if(label) label.textContent = "เล่นเสียงไม่ได้";
  }
}

function setEchoSample(sample){
  vizState.echoSample = sample === "hello" ? "hello" : "physics";
  ["echoSamplePhysics","echoSampleHello"].forEach(id=>{
    const btn = $(id);
    if(!btn) return;
    const active = btn.dataset.echoSample === vizState.echoSample;
    btn.classList.toggle("active", active);
    btn.setAttribute("aria-pressed", active ? "true" : "false");
  });
}


function showCanvasImageSheet(dataUrl, filename){
  try{
    let sheet = document.getElementById("pngSaveSheet");
    if(!sheet){
      sheet = document.createElement("div");
      sheet.id = "pngSaveSheet";
      sheet.className = "pngSaveSheet";
      sheet.innerHTML = `
        <div class="pngSaveCard">
          <div class="pngSaveTitle">บันทึกภาพจำลอง</div>
          <div class="pngSaveHint">ถ้าปุ่มดาวน์โหลดไม่ทำงาน ให้แตะค้างที่ภาพแล้วเลือกบันทึกภาพ</div>
          <img alt="ภาพจำลองที่บันทึก" />
          <div class="pngSaveActions">
            <button type="button" class="secondary pngCloseBtn">ปิด</button>
          </div>
        </div>`;
      document.body.appendChild(sheet);
      const closeBtn = sheet.querySelector(".pngCloseBtn");
      if(closeBtn) closeBtn.onclick = ()=>sheet.classList.remove("show");
      sheet.addEventListener("click", e=>{ if(e.target===sheet) sheet.classList.remove("show"); });
    }
    const img = sheet.querySelector("img");
    if(img){
      img.src = dataUrl;
      img.setAttribute("download", filename || "melodylab-image.png");
    }
    sheet.classList.add("show");
  }catch(e){}
}

function saveVisualizerPng(){
  const c = $("visualizerCanvas");
  if(!c) return;
  try{
    // redraw the current frame first so the saved PNG matches the latest parameters
    if(vizState.raf) cancelAnimationFrame(vizState.raf);
    if(typeof drawVisualizer === "function") drawVisualizer();
  }catch(e){}
  const filename = makeTopicFileName("Image", "png");
  try{
    const dataUrl = c.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = filename;
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    setTimeout(()=>{ try{ a.remove(); }catch(e){} }, 800);
    // Always show an in-app fallback preview because some mobile browsers ignore download=
    showCanvasImageSheet(dataUrl, filename);
  }catch(err){
    alert("บันทึกภาพไม่ได้ในเบราว์เซอร์นี้ กรุณาใช้ปุ่มแคปหน้าจอของเครื่อง หรือเปิดใน Chrome/Safari");
  }
}


function initVisualizer(){
  if(!$("visualizerCanvas")) return;
  const activeVizSection=document.querySelector(".visualizerSinglePage[data-viz-mode]");
  if(activeVizSection?.dataset?.vizMode){ vizState.mode=activeVizSection.dataset.vizMode; }
  resizeVisualizerCanvas();
  document.querySelectorAll("[data-viz]").forEach(btn=>{
    btn.onclick=()=>{
      document.querySelectorAll("[data-viz]").forEach(b=>b.classList.remove("active"));
      btn.classList.add("active");
      vizState.mode=btn.dataset.viz;
    };
  });
  ["vizFreq","vizFreq2","vizAmp","vizSpeed","vizTimeSpeed","vizPhase","vizPhaseDiff","vizSubMode","vizDistance","vizTemp","vizAngle","vizTempDiff","vizTempTop","vizTempBottom","vizLayerCount","vizBendBoost","vizSlit","vizSeparation","vizTubeMode","vizLength","vizMach","vizPower","vizIntensity","vizLevel","vizSourceLevel","vizProtection","vizAppCategory","vizInstrument","vizHarmonicMix","vizWallType","vizRefractionMode","vizGradientPreset","vizHotSide"].forEach(id=>{
    const el=$(id);
    if(!el) return;
    const handler=()=>{ getVizParams(); if(typeof drawVisualizer === "function") drawVisualizer(); };
    el.addEventListener("input", handler);
    el.addEventListener("change", handler);
  });
  ["echoSamplePhysics","echoSampleHello"].forEach(id=>{
    const btn=$(id);
    if(!btn) return;
    btn.onclick=()=>setEchoSample(btn.dataset.echoSample || "physics");
  });
  setEchoSample(vizState.echoSample || "physics");
  function updateRefractionModeButtons(){
    const modeEl=$("vizRefractionMode");
    const current = modeEl ? modeEl.value : "layer";
    document.querySelectorAll("[data-ref-mode]").forEach(btn=>{
      const active = btn.dataset.refMode === current;
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-pressed", active ? "true" : "false");
    });
  }
  function syncRefractionControlUI(){
    const modeEl=$("vizRefractionMode"), presetEl=$("vizGradientPreset"), layerEl=$("vizLayerCount");
    if(!modeEl) return;
    const isMulti = modeEl.value === 'multilayer';
    const isGradient = modeEl.value === 'gradient';
    const showSwap = isMulti || isGradient;

    const layerRow = layerEl ? layerEl.closest('.layerCountRow') : null;
    const boostEl = $("vizBendBoost"), boostRow = boostEl ? boostEl.closest('.bendBoostRow') : null;
    const swapBtn = $("vizSwapTempBtn") || $("vizSwapTemp") || $("vizSwapRefractionSides");
    const swapRow = swapBtn ? swapBtn.closest('.neonParamRow') : null;
    const multiPresetRow = $("vizMultiDayBtn") ? $("vizMultiDayBtn").closest('.multiLayerPresetRow') : null;
    const quickRow = $("vizTowardNormalBtn") ? $("vizTowardNormalBtn").closest('.refractionQuickPresetRow') : null;
    const gradRow = presetEl ? presetEl.closest('.gradientPresetRow') : null;

    const setRow = (row, show) => {
      if(!row) return;
      row.style.display = show ? "" : "none";
      row.style.opacity = show ? "1" : "0.55";
    };

    setRow(swapRow, showSwap);
    setRow(layerRow, isMulti);
    setRow(boostRow, isMulti);
    setRow(multiPresetRow, false);
    setRow(quickRow, false);
    setRow(gradRow, false);

    if(presetEl) presetEl.disabled = true;
    if(layerEl) layerEl.disabled = !isMulti;
    if(boostEl) boostEl.disabled = !isMulti;
    updateRefractionModeButtons();
  }
  function applyGradientPresetUI(){
    const presetEl=$("vizGradientPreset");
    if(!presetEl) return;
    const topEl=$("vizTempTop"), bottomEl=$("vizTempBottom"), modeEl=$("vizRefractionMode");
    if(presetEl.value==="day"){
      if(modeEl) modeEl.value="gradient";
      if(topEl) topEl.value=18;
      if(bottomEl) bottomEl.value=35;
      if($("vizAngle")) $("vizAngle").value=25;
    } else if(presetEl.value==="night"){
      if(modeEl) modeEl.value="gradient";
      if(topEl) topEl.value=30;
      if(bottomEl) bottomEl.value=12;
      if($("vizAngle")) $("vizAngle").value=25;
    }
    syncRefractionControlUI();
    getVizParams();
    if(typeof drawVisualizer === "function") drawVisualizer();
  }
  document.querySelectorAll("[data-ref-mode]").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const modeEl=$("vizRefractionMode");
      if(modeEl) modeEl.value = btn.dataset.refMode || "layer";
      if($("vizGradientPreset")) $("vizGradientPreset").value = "auto";
      syncRefractionControlUI();
      getVizParams();
      if(typeof drawVisualizer === "function") drawVisualizer();
    });
  });
  if($("vizGradientPreset")) $("vizGradientPreset").addEventListener("change", applyGradientPresetUI);
  if($("vizRefractionMode")) $("vizRefractionMode").addEventListener("change", syncRefractionControlUI);
  syncRefractionControlUI();
  function applyRefractionQuickPreset(kind){
    const modeEl=$("vizRefractionMode"), presetEl=$("vizGradientPreset");
    const topEl=$("vizTempTop"), bottomEl=$("vizTempBottom"), angleEl=$("vizAngle"), freqEl=$("vizFreq");
    if(modeEl) modeEl.value="layer";
    if(presetEl) presetEl.value="auto";
    if(angleEl) angleEl.value=55;
    if(freqEl) freqEl.value=1600;
    if(kind==="toward"){
      if(topEl) topEl.value=45;
      if(bottomEl) bottomEl.value=0;
      vText("vizBendPresetLabel","เข้าหา Normal");
    }else{
      if(topEl) topEl.value=0;
      if(bottomEl) bottomEl.value=45;
      vText("vizBendPresetLabel","ออกจาก Normal");
    }
    syncRefractionControlUI();
    getVizParams();
    if(typeof drawVisualizer === "function") drawVisualizer();
  }
  if($("vizTowardNormalBtn")) $("vizTowardNormalBtn").onclick=()=>applyRefractionQuickPreset("toward");
  if($("vizAwayNormalBtn")) $("vizAwayNormalBtn").onclick=()=>applyRefractionQuickPreset("away");
  function applyMultiLayerPreset(kind){
    const modeEl=$("vizRefractionMode"), topEl=$("vizTempTop"), bottomEl=$("vizTempBottom");
    const layerEl=$("vizLayerCount"), boostEl=$("vizBendBoost"), freqEl=$("vizFreq"), angleEl=$("vizAngle"), gradEl=$("vizGradientPreset");
    if(modeEl) modeEl.value="multilayer";
    if(gradEl) gradEl.value="auto";
    if(layerEl) layerEl.value=6;
    if(boostEl) boostEl.value=2.5;
    if(freqEl) freqEl.value=1600;
    if(angleEl) angleEl.value=55;
    if(kind==="day"){
      if(topEl) topEl.value=10;
      if(bottomEl) bottomEl.value=35;
      vText("vizMultiPresetLabel","6 ชั้น กลางวัน");
    }else{
      if(topEl) topEl.value=35;
      if(bottomEl) bottomEl.value=10;
      vText("vizMultiPresetLabel","6 ชั้น กลางคืน");
    }
    syncRefractionControlUI();
    getVizParams();
    if(typeof drawVisualizer === "function") drawVisualizer();
  }
  if($("vizMultiDayBtn")) $("vizMultiDayBtn").onclick=()=>applyMultiLayerPreset("day");
  if($("vizMultiNightBtn")) $("vizMultiNightBtn").onclick=()=>applyMultiLayerPreset("night");
  if($("vizSwapTempBtn")) $("vizSwapTempBtn").onclick=()=>{
    const topEl=$("vizTempTop"), bottomEl=$("vizTempBottom"), modeEl=$("vizRefractionMode"), boostEl=$("vizBendBoost");
    if(topEl && bottomEl){
      const tmp=topEl.value;
      topEl.value=bottomEl.value;
      bottomEl.value=tmp;

      // In multilayer mode the real angle change is physically small, so keep the teaching-view boost high enough after swap.
      if(modeEl && modeEl.value==="multilayer" && boostEl && Number(boostEl.value) < 3.5){
        boostEl.value = 3.5;
      }

      vizState.t = 0;
      syncRefractionControlUI();
      getVizParams();
      if(typeof drawVisualizer === "function") drawVisualizer();
    }
  };
  if($("reflectSoundBtn")) $("reflectSoundBtn").onclick=playReflectionEchoDemo;
  if($("vizPlayBtn")) $("vizPlayBtn").onclick=()=>{vizState.running=true;updateVizPlayerButtons("play");if(vizState.raf) cancelAnimationFrame(vizState.raf);drawVisualizer();};
  if($("vizPauseBtn")) $("vizPauseBtn").onclick=()=>{vizState.running=false;updateVizPlayerButtons("pause");drawVisualizer();};
  if($("vizResetBtn")) $("vizResetBtn").onclick=()=>{vizState.t=0;vizState.running=false;updateVizPlayerButtons("reset");if(vizState.raf) cancelAnimationFrame(vizState.raf);drawVisualizer();};
  if($("vizScreenBtn")) $("vizScreenBtn").onclick=saveVisualizerPng;
  if($("vizExportBtn")) $("vizExportBtn").onclick=saveVisualizerPng;
  if(vizState.raf) cancelAnimationFrame(vizState.raf);
  updateVizPlayerButtons();
  drawVisualizer();
}

function init(){fillBrowserInfo();initVisualizer();initLocalExportCards();if("serviceWorker"in navigator){window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));}if(!$("startMic")) return;Object.entries(ctxs).forEach(([n,ctx])=>drawGrid(ctx,canvases[n]));drawBeat();drawResonance();renderColumnToggles();readConfig();loadSettings();renderLog();$("startMic").onclick=startMic;$("stopMic").onclick=stopMic;$("captureBtn").onclick=capture;$("downloadBtn").onclick=downloadCsv;$("downloadExcelBtn").onclick=downloadExcel;if($("captureCalBtn"))$("captureCalBtn").onclick=captureCalibration;if($("downloadCalBtn"))$("downloadCalBtn").onclick=downloadCalibrationCsv;if($("applyDbCalBtn"))$("applyDbCalBtn").onclick=applyDbCalibration;if($("playCalTone"))$("playCalTone").onclick=()=>{$("toneFreq").value=440;playTone();};if($("stopCalTone"))$("stopCalTone").onclick=stopTone;$("clearBtn").onclick=()=>{logs=[];renderLog();};$("autoLogBtn").onclick=toggleAutoLog;$("preset").onchange=()=>{applyPreset();};if($("userMode")) $("userMode").onchange=applyMode;$("freezeBtn").onclick=()=>{frozen=!frozen;$("freezeBtn").textContent=frozen?"Unfreeze Graph":"Freeze Graph";};$("resetPeakBtn").onclick=()=>{peakHold=[];};$("saveGraphsBtn").onclick=saveGraphs;$("saveSettingsBtn").onclick=saveSettings;$("resetSettingsBtn").onclick=resetSettings;$("configLinkBtn").onclick=copyConfig;$("playTone").onclick=playTone;$("stopTone").onclick=stopTone;$("playNoise").onclick=playNoise;$("stopNoise").onclick=stopNoise;$("playBeat").onclick=playBeat;$("stopBeat").onclick=stopBeat;["beatF1","beatF2","beatVol"].forEach(id=>$(id).addEventListener("input",()=>{if(beatOsc1)beatOsc1.frequency.value=Number($("beatF1").value||440);if(beatOsc2)beatOsc2.frequency.value=Number($("beatF2").value||444);if(beatGain)beatGain.gain.value=Number($("beatVol").value||.06);drawBeat();}));["resV","resL","resMode"].forEach(id=>$(id).addEventListener("input",drawResonance));["toneFreq","toneVol","toneType"].forEach(id=>$(id).addEventListener("input",()=>{if(toneOsc)toneOsc.frequency.value=Number($("toneFreq").value||440);if(toneGain)toneGain.gain.value=Number($("toneVol").value||.06);if(toneOsc)toneOsc.type=$("toneType").value;}));$("noiseVol").addEventListener("input",()=>{if(noiseGain)noiseGain.gain.value=Number($("noiseVol").value||.03);});if("serviceWorker"in navigator){window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));}}
document.addEventListener("DOMContentLoaded",init);


/* v5.10 local export per experiment page */
const localPageLogs = {};
function getActiveTopicTitle(){
  const activeTitle = document.querySelector("section.activeDetail h2")?.textContent?.trim();
  if(activeTitle) return activeTitle;
  const brandTitle = document.querySelector(".detailNav .brand span")?.textContent?.trim();
  if(brandTitle) return brandTitle;
  const card = document.querySelector(".localExportCard[data-export-name]");
  if(card?.dataset?.exportName) return card.dataset.exportName;
  return document.title || "MelodyLab";
}
function safeFileNamePart(text){
  return String(text || "MelodyLab")
    .normalize("NFC")
    .replace(/[\\/:*?"<>|]/g, "")
    .replace(/[\u0000-\u001f\u007f]/g, "")
    .replace(/[()\[\]{}]/g, "")
    .replace(/\s+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 90) || "MelodyLab";
}
function fileTimestamp(){
  const d = new Date();
  const pad = n => String(n).padStart(2, "0");
  return `${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}_${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
}
function makeTopicFileName(kind, ext){
  const topic = safeFileNamePart(getActiveTopicTitle());
  const suffix = kind ? "_" + safeFileNamePart(kind) : "";
  return `${topic}${suffix}_${fileTimestamp()}.${ext}`;
}
function getActiveExperimentName(){
  return getActiveTopicTitle();
}
function getLocalPageSnapshot(){
  const page = getActiveExperimentName();
  const now = new Date().toLocaleString("th-TH");
  const row = {time: now, page};

  // Visualizer values / current parameter settings
  if($("vizFreq")) row.parameter_frequency_hz = Number($("vizFreq").value || 0);
  if($("vizAmp")) row.parameter_amplitude_A = Number($("vizAmp").value || 0);
  if($("vizSpeed")) row.parameter_wave_speed_m_s = Number($("vizSpeed").value || 0);
  if($("vizTimeSpeed")) row.parameter_time_speed_x = Number($("vizTimeSpeed").value || 0);
  if($("vizPhase")) row.parameter_phase_deg = Number($("vizPhase").value || 0);
  if($("vizPhaseDiff")) row.parameter_phase_difference_deg = Number($("vizPhaseDiff").value || 0);
  if($("vizSubMode")) row.parameter_mode = $("vizSubMode").value || "";
  if($("vizDistance")) { row.parameter_distance_m = Number($("vizDistance").value || 0); row.parameter_path_length_s_m = Number($("vizDistance").value || 0); }
  if($("vizTemp")) row.parameter_temperature_c = Number($("vizTemp").value || 0);
  if($("vizAngle")) row.parameter_angle_deg = Number($("vizAngle").value || 0);
  if($("vizTempDiff")) row.parameter_temperature_difference_c = Number($("vizTempDiff").value || 0);
  if($("vizTempTop")) row.parameter_temp_top_c = Number($("vizTempTop").value || 0);
  if($("vizTempBottom")) row.parameter_temp_bottom_c = Number($("vizTempBottom").value || 0);
  if($("vizRefractionMode")) row.parameter_refraction_mode = $("vizRefractionMode").value || "";
  if($("vizGradientPreset")) row.parameter_gradient_preset = $("vizGradientPreset").value || "";
  if($("vizTempRelationLabel")) row.parameter_temperature_relation_display = $("vizTempRelationLabel").textContent || "";
  if($("vizTempTop") && $("vizTempBottom") && $("vizFreq")){
    const tempTop = Number($("vizTempTop").value || 0);
    const tempBottom = Number($("vizTempBottom").value || 0);
    const freq = Math.max(1, Number($("vizFreq").value || 1));
    const theta1Deg = Number($("vizAngle")?.value || 0);
    const v1 = 331 + 0.6 * tempTop;
    const v2 = 331 + 0.6 * tempBottom;
    const lambda1 = v1 / freq;
    const lambda2 = v2 / freq;
    const theta1Rad = theta1Deg * Math.PI / 180;
    const theta2Rad = Math.asin(lim((v2 / v1) * Math.sin(theta1Rad), -0.999, 0.999));
    const theta2Deg = theta2Rad * 180 / Math.PI;
    const deltaT = Math.abs(tempTop - tempBottom);
    const deltaV = Math.abs(v1 - v2);
    const noRefraction = Math.abs(v1 - v2) < 0.15;
    row.derived_delta_t_c = +deltaT.toFixed(2);
    row.derived_v1_top_m_s = +v1.toFixed(3);
    row.derived_v2_bottom_m_s = +v2.toFixed(3);
    row.derived_delta_v_m_s = +deltaV.toFixed(3);
    row.derived_lambda1_top_m = +lambda1.toFixed(5);
    row.derived_lambda2_bottom_m = +lambda2.toFixed(5);
    row.derived_theta1_deg = +theta1Deg.toFixed(3);
    row.derived_theta2_deg = +theta2Deg.toFixed(3);
    row.derived_refraction_behavior = noRefraction
      ? "ไม่เกิดการหักเหสุทธิ"
      : (v1 > v2 ? "หักเหเข้าหาแนวฉาก" : "หักเหออกจากแนวฉาก");
    const refModeForNote = $("vizRefractionMode")?.value || "layer";
    row.derived_model_note = refModeForNote === "gradient"
      ? "อุณหภูมิไล่ระดับต่อเนื่อง: ภาพเชิงแนวคิด ไม่มีมุมหักเหค่าเดียว"
      : refModeForNote === "multilayer"
        ? "หลายชั้น: ประมาณอากาศเป็นชั้นย่อย และใช้ sinθ/v คงที่ทีละชั้น"
        : "การหักเห: ใช้ sinθ1/v1 = sinθ2/v2";
  }
  if($("vizSlit")) row.parameter_slit_width_lambda = Number($("vizSlit").value || 0);
  if($("vizSeparation")) row.parameter_source_separation_m = Number($("vizSeparation").value || 0);
  if($("vizTubeMode")) row.parameter_tube_mode_n = Number($("vizTubeMode").value || 0);
  if($("vizLength")) row.parameter_length_m = Number($("vizLength").value || 0);
  if($("vizMach")) row.parameter_mach_number = Number($("vizMach").value || 0);
  if($("vizPower")) row.parameter_sound_power_w = Number($("vizPower").value || 0);
  if($("vizIntensity")) row.parameter_log_intensity = Number($("vizIntensity").value || 0);
  if($("vizLevel")) row.parameter_sound_level_db = Number($("vizLevel").value || 0);
  if($("vizSourceLevel")) row.parameter_source_level_db = Number($("vizSourceLevel").value || 0);
  if($("vizProtection")) row.parameter_protection_db = Number($("vizProtection").value || 0);
  if($("vizFreqLabel")) row.frequency_display = $("vizFreqLabel").textContent || "";
  if($("vizAmpLabel")) row.amplitude_display = $("vizAmpLabel").textContent || "";
  if($("vizSpeedLabel")) row.wave_speed_display = $("vizSpeedLabel").textContent || "";
  if($("vizDistanceLabel")) row.distance_display = $("vizDistanceLabel").textContent || "";
  if($("vizTempLabel")) row.temperature_display = $("vizTempLabel").textContent || "";
  if($("vizSoundSpeedLabel")) row.sound_speed_display = $("vizSoundSpeedLabel").textContent || "";
  if($("vizTravelTimeLabel")) row.travel_time_display = $("vizTravelTimeLabel").textContent || "";
  if($("vizTimeLabel")) row.time_speed_display = $("vizTimeLabel").textContent || "";
  if($("vizPhaseLabel")) row.phase_display = $("vizPhaseLabel").textContent || "";
  if($("vizPhaseDiffLabel")) row.phase_difference_display = $("vizPhaseDiffLabel").textContent || "";
  const freqVal = Number($("vizFreq")?.value || 0);
  const speedVal = Number($("vizSpeed")?.value || 0);
  if(freqVal > 0 && speedVal > 0) row.parameter_wavelength_m = +(speedVal / freqVal).toFixed(4);

  // Legacy Visualizer outputs (if present)
  if($("vizFreqOut")) row.frequency = $("vizFreqOut").textContent || "";
  if($("vizAmpOut")) row.amplitude = $("vizAmpOut").textContent || "";
  if($("vizSpeedOut")) row.wave_speed = $("vizSpeedOut").textContent || "";
  if($("vizLambdaOut")) row.wavelength = $("vizLambdaOut").textContent || "";

  // Analysis / measure readouts
  if($("mainFreqOut")) row.main_frequency = $("mainFreqOut").textContent || "";
  if($("fftOut")) row.fft_peak = $("fftOut").textContent || "";
  if($("autoOut")) row.autocorrelation = $("autoOut").textContent || "";
  if($("periodOut")) row.period = $("periodOut").textContent || "";
  if($("dbOut")) row.db = $("dbOut").textContent || "";
  if($("dbStatsOut")) row.db_stats = $("dbStatsOut").textContent || "";

  // Resonance
  if($("resOut")) row.fundamental_frequency = $("resOut").textContent || "";
  if($("harmonicsOut")) row.harmonics = $("harmonicsOut").textContent || "";

  // Spectrogram / canvas state
  if($("spectrogramCanvas")) row.graph = "spectrogram_canvas";
  if($("spectrumCanvas")) row.graph = row.graph ? row.graph + "; spectrum_canvas" : "spectrum_canvas";
  if($("historyCanvas")) row.graph = row.graph ? row.graph + "; frequency_history_canvas" : "frequency_history_canvas";

  // Generator
  if($("toneFreq")) row.tone_frequency_hz = $("toneFreq").value || "";
  if($("toneType")) row.waveform = $("toneType").value || "";
  if($("beatF1")) row.beat_f1_hz = $("beatF1").value || "";
  if($("beatF2")) row.beat_f2_hz = $("beatF2").value || "";
  if($("beatOut")) row.beat_frequency = $("beatOut").textContent || "";

  // Settings / labels
  if($("labelInput")) row.label = $("labelInput").value || "";
  if($("runInput")) row.run = $("runInput").value || "";
  if($("preset")) row.preset = $("preset").value || "";

  return row;
}
function renderLocalExport(){
  const page = getActiveExperimentName();
  const logs = localPageLogs[page] || [];
  document.querySelectorAll(".localExportCard").forEach(card=>{
    const head = card.querySelector(".localHead");
    const body = card.querySelector(".localBody");
    if(!head || !body) return;
    head.innerHTML = "";
    body.innerHTML = "";
    const keys = Array.from(new Set(logs.flatMap(r=>Object.keys(r))));
    keys.forEach(k=>{
      const th = document.createElement("th");
      th.textContent = k;
      head.appendChild(th);
    });
    logs.forEach(r=>{
      const tr = document.createElement("tr");
      keys.forEach(k=>{
        const td = document.createElement("td");
        td.textContent = r[k] ?? "";
        tr.appendChild(td);
      });
      body.appendChild(tr);
    });
  });
}
function captureLocalPageData(){
  const page = getActiveExperimentName();
  localPageLogs[page] ??= [];
  localPageLogs[page].push(getLocalPageSnapshot());
  renderLocalExport();
}
function downloadLocalPageCsv(){
  const page = getActiveExperimentName();
  const logs = localPageLogs[page] || [];
  const keys = Array.from(new Set(logs.flatMap(r=>Object.keys(r))));
  if(!logs.length){
    alert("ยังไม่มีข้อมูลที่บันทึกในหน้านี้");
    return;
  }
  const csv = [keys, ...logs.map(r=>keys.map(k=>r[k] ?? ""))]
    .map(row=>row.map(v=>`"${String(v).replaceAll('"','""')}"`).join(","))
    .join("\n");
  const blob = new Blob(["\ufeff"+csv], {type:"text/csv;charset=utf-8"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = makeTopicFileName("Data", "csv");
  a.click();
  URL.revokeObjectURL(url);
}
function clearLocalPageData(){
  const page = getActiveExperimentName();
  localPageLogs[page] = [];
  renderLocalExport();
}
function initLocalExportCards(){
  document.querySelectorAll(".localCaptureBtn").forEach(btn=>btn.onclick=captureLocalPageData);
  document.querySelectorAll(".localDownloadBtn").forEach(btn=>btn.onclick=downloadLocalPageCsv);
  document.querySelectorAll(".localClearBtn").forEach(btn=>btn.onclick=clearLocalPageData);
  renderLocalExport();
}



/* v5.14: redraw after orientation change to keep display consistent */
function refreshAfterOrientationChange(){
  setTimeout(()=>{
    if(typeof resizeVisualizerCanvas === "function") resizeVisualizerCanvas();
    if(typeof drawVisualizer === "function") drawVisualizer();
    if(typeof drawBeat === "function") drawBeat();
    if(typeof drawResonance === "function") drawResonance();
    document.querySelectorAll("canvas").forEach(c=>{
      c.style.width = "100%";
    });
  }, 250);
}
window.addEventListener("orientationchange", refreshAfterOrientationChange);
window.addEventListener("resize", refreshAfterOrientationChange);



/* v5.21 resize visualizer canvas for portrait/landscape */
function resizeVisualizerCanvas(){
  const canvas = $("visualizerCanvas");
  if(!canvas) return;

  const container = canvas.parentElement;
  if(!container) return;

  const rect = container.getBoundingClientRect();
  const cssW = Math.max(280, Math.floor(rect.width - 4));
  const isLandscape = window.matchMedia("(orientation: landscape)").matches;
  const isLongitudinal = !!document.querySelector(".visualizerSinglePage[data-viz-mode='longitudinal']");
  const isDisplacementPressure = !!document.querySelector(".visualizerSinglePage[data-viz-mode='displacementPressure']");
  const isSpeedSound = !!document.querySelector(".visualizerSinglePage[data-viz-mode='speedSound']");
  const isSoundTopic = !!document.querySelector('.visualizerSinglePage.soundTopicPage');

  let cssH;
  if(isLongitudinal || isDisplacementPressure || isSpeedSound || isSoundTopic){
    // v5.88: allow more vertical room on phones so the graph can visibly fill the slot.
    const vh = Math.max(640, window.innerHeight || 800);
    cssH = isLandscape ? Math.round(Math.min(vh * 0.66, cssW * 0.58)) : Math.round(vh * 0.52);
    cssH = Math.max(isLandscape ? 280 : 430, Math.min(cssH, isLandscape ? 420 : 620));
  }else{
    cssH = isLandscape ? Math.round(cssW * 0.42) : Math.round(cssW * 0.54);
    cssH = Math.max(isLandscape ? 180 : 220, Math.min(cssH, isLandscape ? 235 : 320));
  }

  const dpr = Math.max(1, window.devicePixelRatio || 1);

  canvas.style.width = cssW + "px";
  canvas.style.height = cssH + "px";
  canvas.width = Math.floor(cssW * dpr);
  canvas.height = Math.floor(cssH * dpr);
}

window.addEventListener("load", ()=>{ if(typeof resizeVisualizerCanvas === "function") resizeVisualizerCanvas(); });
