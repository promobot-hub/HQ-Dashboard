// Neon particle background (max ~30fps)
(function(){
  const MAX_FPS = 30; const FRAME_MS = 1000/MAX_FPS;
  let canvas, ctx, last=0, w=0, h=0; let parts=[]; let rafId=0;
  function init(){
    canvas = document.getElementById('bg-particles');
    if (!canvas){ canvas = document.createElement('canvas'); canvas.id='bg-particles'; document.body.appendChild(canvas); }
    Object.assign(canvas.style, { position:'fixed', inset:'0', zIndex:'0', pointerEvents:'none' });
    ctx = canvas.getContext('2d');
    onResize(); window.addEventListener('resize', onResize);
    spawn(); loop(0);
  }
  function onResize(){ w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; }
  function spawn(){
    const count = Math.min(90, Math.floor((w*h)/40000));
    parts = Array.from({length:count}).map(()=>({
      x: Math.random()*w, y: Math.random()*h, r: 0.6+Math.random()*1.8,
      vx: (Math.random()-0.5)*0.25, vy: (Math.random()-0.5)*0.25,
      c: Math.random()>0.5? 'rgba(34,211,238,0.28)' : 'rgba(168,85,247,0.26)'
    }));
  }
  function step(dt){
    ctx.clearRect(0,0,w,h);
    for (const p of parts){
      p.x += p.vx * dt*0.06; p.y += p.vy * dt*0.06;
      if (p.x<0) p.x=w; if (p.x>w) p.x=0; if (p.y<0) p.y=h; if (p.y>h) p.y=0;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r*6);
      g.addColorStop(0, p.c); g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g; ctx.fill();
    }
  }
  function loop(ts){ const dt = ts-last; if (dt>=FRAME_MS){ last=ts; step(dt); } rafId = requestAnimationFrame(loop); }
  document.addEventListener('DOMContentLoaded', init);
})();
