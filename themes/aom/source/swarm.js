// A handful of drawing tools reassemble the visible content on page entry.
(() => {
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const replay = document.querySelector('.swarm-replay');
  if (!window.requestAnimationFrame || !Element.prototype.animate) return;
  const colors = ['#b5f584', '#85d7e7', '#ffc790', '#d1b1ff', '#fbadc6', '#85e7c4', '#f7df89'];
  const selector = '.heroin h1, .heroin p, .hero .primary, .page-title, .sectionhead, .tabs, .postrow, .indexitem, .panel, .bodycopy > *';
  let stop = () => {};
  const clamp = x => Math.max(0, Math.min(1, x));
  const mix = (a, b, t) => a + (b - a) * t;

  function play() {
    stop();
    if (document.hidden || motion.matches) return;
    const w = innerWidth, h = innerHeight;
    const compact = w < 720;
    const count = compact ? 5 : 7;
    const tasks = [];
    for (const element of document.querySelectorAll(selector)) {
      const box = element.getBoundingClientRect();
      if (!box.width || box.height < 4 || box.top < -2 || box.top > h - 20) continue;
      const typing = element.matches('h1,h2,h3,p');
      let width = box.width;
      if (typing) {
        const range = document.createRange();
        range.selectNodeContents(element);
        width = Math.min(width, Math.max(4, range.getBoundingClientRect().right - box.left + 2));
      }
      tasks.push({element, box, typing, width, height:Math.min(box.height, h - box.top)});
      if (tasks.length === count * 2) break;
    }
    if (!tasks.length) return;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.className = 'swarm-layer';
    canvas.setAttribute('aria-hidden', 'true');
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.scale(dpr, dpr);
    document.body.append(canvas);

    const duration = compact ? 285 : 390;
    const travel = compact ? 95 : 145;
    const animations = [];
    let frame;
    stop = () => {
      cancelAnimationFrame(frame);
      for (const animation of animations) animation.cancel();
      canvas.remove();
      stop = () => {};
    };
    for (const [i, task] of tasks.entries()) {
      task.start = travel + (i % count) * 25 + Math.floor(i / count) * (duration + travel);
      const {element, box, typing, width} = task;
      const endInset = typing ? Math.max(0, box.width - width) : 0;
      animations.push(element.animate([
        {clipPath:typing ? 'inset(0 100% 0 0)' : 'inset(0 100% 100% 0)'},
        {clipPath:'inset(0 ' + endInset + 'px 0 0)'}
      ], {duration, delay:task.start, easing:typing ? 'steps(16,end)' : 'linear', fill:'backwards'}));
    }

    function endpoint(task) {
      return [task.box.left + task.width, task.box.top + (task.typing ? Math.min(24,task.height / 2) : task.height)];
    }
    function cursor(x, y, color) {
      ctx.save();
      ctx.translate(x, y);
      ctx.fillStyle = '#101718';
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(0, 0); ctx.lineTo(4, 21); ctx.lineTo(9, 14); ctx.lineTo(19, 12); ctx.closePath();
      ctx.fill(); ctx.stroke(); ctx.restore();
    }

    const started = performance.now();
    function draw(now) {
      const time = now - started;
      ctx.clearRect(0, 0, w, h);
      for (let lane = 0; lane < Math.min(count, tasks.length); lane++) {
        const first = tasks[lane], next = tasks[lane + count];
        const second = next && time >= first.start + duration;
        const task = second ? next : first;
        const color = colors[lane];
        const angle = (lane / count) * Math.PI * 2;
        const from = second ? endpoint(first) : [w * .5 + 46 * Math.cos(angle), Math.min(h * .3, 180) + 32 * Math.sin(angle)];
        const x0 = task.box.left, y0 = task.box.top + (task.typing ? Math.min(24,task.height / 2) : 0);
        const t = clamp((time - task.start) / duration);
        const approach = clamp((time - (second ? first.start + duration : 0)) / (second ? travel : first.start));
        const end = endpoint(task);
        const x = t ? mix(x0,end[0],t) : mix(from[0],x0,approach);
        const y = t ? mix(y0,end[1],t) : mix(from[1],y0,approach) - 20 * Math.sin(Math.PI * approach);
        ctx.globalAlpha = 1 - clamp((time - task.start - duration) / 115);
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        if (t > 0 && t < 1) {
          if (task.typing) {
            ctx.fillStyle = color; ctx.fillRect(x, y0 - 9, 2, 18);
          } else {
            ctx.strokeRect(x0, y0, x - x0, y - y0);
            ctx.fillStyle = color; ctx.fillRect(x0 - 2, y0 - 2, 4, 4);
          }
        }
        cursor(x, y, color);
      }
      ctx.globalAlpha = 1;
      if (time < tasks[tasks.length - 1].start + duration + 125) frame = requestAnimationFrame(draw);
      else stop();
    }
    frame = requestAnimationFrame(draw);
  }

  function updatePreference() {
    stop();
    if (replay) replay.hidden = motion.matches;
  }
  updatePreference();
  replay?.addEventListener('click', play);
  for (const type of ['pointerdown','touchstart','wheel','scroll','resize','pagehide','keydown']) {
    window.addEventListener(type, () => stop(), {passive:true});
  }
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); });
  if (motion.addEventListener) motion.addEventListener('change', updatePreference);
  else motion.addListener(updatePreference);
  play();
})();
