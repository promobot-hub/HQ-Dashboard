// Charts (CPU/Memory Live) using Chart.js with dynamic loader
(function(){
  const CDN = 'https://cdn.jsdelivr.net/npm/chart.js';

  async function ensureChartJs(){
    if (window.Chart) return window.Chart;
    await new Promise((resolve, reject)=>{
      const s = document.createElement('script'); s.src = CDN; s.onload = resolve; s.onerror = reject; document.head.appendChild(s);
    });
    return window.Chart;
  }

  async function createLineChart(ctx, { label, color, initData }={}){
    const Chart = await ensureChartJs();
    const data = initData || Array.from({length:20}, (_,i)=> ({ x: i, y: Math.round(Math.random()*40)+5 }));
    return new Chart(ctx, {
      type: 'line',
      data: {
        datasets: [{
          label: label || 'Series',
          data: data,
          parsing: false,
          borderColor: color || '#22d3ee',
          backgroundColor: (color || '#22d3ee') + '33',
          fill: true,
          tension: 0.35,
          pointRadius: 0,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { mode: 'nearest', intersect: false } },
        scales: {
          x: { display: false },
          y: { display: false, min: 0, max: 100 }
        }
      }
    });
  }

  function pushData(chart, y){
    const ds = chart.data.datasets[0];
    const lastX = ds.data.length ? ds.data[ds.data.length-1].x : 0;
    ds.data.push({ x: lastX + 1, y });
    if (ds.data.length > 40) ds.data.shift();
    chart.update('none');
  }

  async function initCpuMemCharts({ cpuId='cpuChart', memId='memChart' }={}){
    const cpuEl = document.getElementById(cpuId);
    const memEl = document.getElementById(memId);
    if (!cpuEl || !memEl) return;
    const cpu = await createLineChart(cpuEl.getContext('2d'), { label: 'CPU', color: '#22d3ee' });
    const mem = await createLineChart(memEl.getContext('2d'), { label: 'Memory', color: '#a855f7' });
    // naive demo feed
    setInterval(()=> pushData(cpu, Math.max(5, Math.min(95, (Math.random()*18)+8))), 1500);
    setInterval(()=> pushData(mem, Math.max(5, Math.min(95, (Math.random()*22)+12))), 1700);
  }

  window.ClawCharts = { initCpuMemCharts };
})();
