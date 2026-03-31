/* ============================================================
   DESIGN YOUR FUTURE SELF — script.js
   ============================================================ */

/* ── Particle Background ── */
;(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  const ctx    = canvas.getContext('2d');
  let   W, H, particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor() { this.reset(true); }
    reset(rand) {
      this.x  = Math.random() * W;
      this.y  = rand ? Math.random() * H : H + 10;
      this.r  = Math.random() * 1.2 + 0.3;
      this.vx = (Math.random() - 0.5) * 0.25;
      this.vy = -(Math.random() * 0.5 + 0.15);
      this.life = 0;
      this.maxLife = Math.random() * 300 + 150;
      this.hue = Math.random() < 0.5 ? 185 : 270; // cyan or purple
    }
    update() {
      this.x += this.vx; this.y += this.vy; this.life++;
      if (this.life >= this.maxLife || this.y < -10) this.reset(false);
    }
    draw() {
      const alpha = Math.sin(Math.PI * this.life / this.maxLife) * 0.7;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue},100%,70%,${alpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < 120; i++) particles.push(new Particle());

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }
  loop();
})();

/* ── Ambient Sound (HTML <audio>) ── */
let soundOn = false;
const soundBtn  = document.getElementById('soundToggle');
const soundIcon = document.getElementById('soundIcon');
const ambientAudio = document.getElementById('ambientAudio');

if (soundBtn) {
  soundBtn.addEventListener('click', () => {
    if (!ambientAudio) return;
    if (soundOn) {
      ambientAudio.pause();
      soundIcon.textContent = '♪';
      soundBtn.style.borderColor = 'rgba(255,255,255,0.1)';
      soundBtn.style.boxShadow = 'none';
    } else {
      ambientAudio.volume = 0.4;
      ambientAudio.play().catch(() => {});
      soundIcon.textContent = '♬';
      soundBtn.style.borderColor = 'rgba(0,245,255,0.6)';
      soundBtn.style.boxShadow   = '0 0 16px rgba(0,245,255,0.4)';
    }
    soundOn = !soundOn;
  });
}

/* ── Slider Setup ── */
const traits  = ['intelligence', 'fitness', 'wealth', 'social'];
const sliders = {};

traits.forEach(t => {
  const input = document.getElementById(`slider-${t}`);
  const val   = document.getElementById(`val-${t}`);
  const item  = input.closest('.slider-item');
  sliders[t]  = input;

  function updateSlider() {
    const v = parseInt(input.value);
    val.textContent = v;
    val.style.color = v >= 70 ? '#39ff87' : v >= 40 ? '#00f5ff' : '#ff4f6b';
    item.classList.toggle('active', v > 60);
    updateBodyBg();
  }

  input.addEventListener('input', updateSlider);
  updateSlider();
});

function getValues() {
  return {
    intelligence: parseInt(sliders.intelligence.value),
    fitness:      parseInt(sliders.fitness.value),
    wealth:       parseInt(sliders.wealth.value),
    social:       parseInt(sliders.social.value),
  };
}

/* ── Dynamic Background ── */
function updateBodyBg() {
  const v = getValues();
  const avg = (v.intelligence + v.fitness + v.wealth + v.social) / 4;
  const h   = Math.floor(200 + (avg / 100) * 50); // 200–250 hue range
  document.body.style.background =
    `radial-gradient(ellipse at 30% 20%, hsl(${h},60%,5%) 0%, #050810 60%)`;
}
updateBodyBg();

/* ── Data Definitions ── */
const avatarData = [
  { min:0,  emoji:'😴', title:'The Drifter',        archetype:'LEVEL 1 EXISTENCE' },
  { min:25, emoji:'🌱', title:'The Late Bloomer',   archetype:'LEVEL 2 AWAKENING' },
  { min:40, emoji:'🔥', title:'The Grinder',        archetype:'LEVEL 3 HUSTLE'    },
  { min:55, emoji:'🚀', title:'The Achiever',       archetype:'LEVEL 4 ASCENT'    },
  { min:70, emoji:'⚡', title:'The Visionary',      archetype:'LEVEL 5 CATALYST'  },
  { min:85, emoji:'🌟', title:'The Legend',         archetype:'LEVEL 6 ICON'      },
];

const storyFragments = {
  intelligence: {
    low:  "You rely on gut instincts more than textbooks. Street-smart and adaptive, you navigate life through lived experience.",
    mid:  "Intellectually curious, you consume knowledge like fuel. Books, podcasts, and late-night rabbit holes define your mind.",
    high: "Your intellect is your superpower. You see patterns others miss, solve problems before they arise, and think decades ahead.",
  },
  fitness: {
    low:  "Physical activity isn't your priority — comfort and rest are your recharge modes.",
    mid:  "You balance effort and recovery. A few workouts a week keep you energized and clear-headed.",
    high: "Your body is a temple and a machine. Discipline at 5 AM shapes your entire philosophy of life.",
  },
  wealth: {
    low:  "Money is a constant puzzle. You live for experiences over assets, finding richness beyond the material.",
    mid:  "Financially stable, you invest wisely and live comfortably — neither flashy nor struggling.",
    high: "Your net worth opens doors most people never find. You move through the world with quiet, compounding power.",
  },
  social: {
    low:  "Solitude is your sanctuary. Deep one-on-one bonds matter more to you than a packed social calendar.",
    mid:  "You balance inner and outer worlds — enough connection to thrive, enough space to breathe.",
    high: "Your network is your net worth. Rooms light up when you enter, and your relationships fuel everything you build.",
  },
};

const timelineData = {
  age25: {
    high: [
      { i: "Graduated top of your class, published a research paper.", f: "Competing in your first national fitness event.", w: "Launched your first startup — angel-funded.", s: "Thrown a legendary rooftop party attended by 200+ people." },
    ],
    low:  [
      { i: "Still figuring out your path, one class at a time.", f: "Trying (again) to stick to a workout schedule.", w: "Side hustles are piling up.", s: "Finding your tribe." },
    ],
  },
  age35: {
    high: [
      { i: "Leading a team of 40 engineers at a unicorn startup.", f: "Completing your second marathon, coaching others.", w: "Seven-figure investment portfolio.", s: "Keynote speaker. Mentoring 12 rising stars." },
    ],
    low:  [
      { i: "Solid mid-level career, learning the system.", f: "Weekend warrior — inconsistent but improving.", w: "Homeowner, building equity slowly.", s: "Reliable friend group of 4–5 people." },
    ],
  },
  age50: {
    high: [
      { i: "CEO of an AI research institute. TED Talk with 20M views.", f: "Completed an Ironman. Your doc calls you 'unusually healthy'.", w: "Sold your company. Worth $80M. Working by choice.", s: "Your philanthropic foundation impacts 200,000 lives." },
    ],
    low:  [
      { i: "Respected expert in your niche. Writing a memoir.", f: "Active and mobile — grateful for every hike.", w: "Retirement is in sight. Kids are launched.", s: "Deep friendships that have lasted 30 years." },
    ],
  },
};

function pick(obj, score) { return score >= 60 ? obj.high[0] : obj.low[0]; }

/* ── Generate ── */
document.getElementById('generateBtn').addEventListener('click', generate);

function generate() {
  const v   = getValues();
  const avg = (v.intelligence + v.fitness + v.wealth + v.social) / 4;

  // Avatar
  const avatar = [...avatarData].reverse().find(a => avg >= a.min) || avatarData[0];
  document.getElementById('avatarDisplay').textContent   = avatar.emoji;
  document.getElementById('avatarTitle').textContent     = avatar.title;
  document.getElementById('avatarArchetype').textContent = avatar.archetype;
  document.getElementById('powerLevel').textContent      = `${Math.round(avg)}/100`;

  // Story
  function frag(t, val) {
    return val < 35 ? storyFragments[t].low : val < 68 ? storyFragments[t].mid : storyFragments[t].high;
  }
  const intro = avg >= 80
    ? "You are built different. The intersection of your choices paints a portrait of extraordinary potential."
    : avg >= 55
    ? "Your life story is one of deliberate evolution — steady, intentional, and quietly powerful."
    : "You are the underdog, and that's your origin story. Every great comeback starts exactly here.";

  document.getElementById('storyText').innerHTML =
    `<strong>${intro}</strong><br><br>` +
    `${frag('intelligence', v.intelligence)} ` +
    `${frag('fitness', v.fitness)}<br><br>` +
    `${frag('wealth', v.wealth)} ` +
    `${frag('social', v.social)}`;

  // Stats bars
  const statsGrid = document.getElementById('statsGrid');
  statsGrid.innerHTML = '';
  const statDefs = [
    { name:'🧠 INTELLIGENCE', val: v.intelligence, color:'#00f5ff' },
    { name:'💪 FITNESS',      val: v.fitness,      color:'#39ff87' },
    { name:'💎 WEALTH',       val: v.wealth,       color:'#ffd56b' },
    { name:'🌐 SOCIAL LIFE',  val: v.social,       color:'#c77dff' },
    { name:'⚡ OVERALL',      val: Math.round(avg),color:'linear-gradient(90deg,#00f5ff,#9b59ff)' },
    { name:'🎯 POTENTIAL',    val: Math.min(100, Math.round(avg * 1.12)), color:'#ff6eb4' },
  ];
  statDefs.forEach(s => {
    const el = document.createElement('div');
    el.className = 'stat-item';
    el.innerHTML = `
      <div class="stat-header">
        <span class="stat-name">${s.name}</span>
        <span class="stat-num" id="snum-${s.name.replace(/\W/g,'')}">${s.val}</span>
      </div>
      <div class="stat-bar-bg">
        <div class="stat-bar-fill" data-target="${s.val}" style="background:${s.color}"></div>
      </div>`;
    statsGrid.appendChild(el);
  });

  // Animate bars (defer so DOM renders)
  setTimeout(() => {
    document.querySelectorAll('.stat-bar-fill').forEach(bar => {
      bar.style.width = bar.dataset.target + '%';
    });
  }, 80);

  // Timeline
  const tl   = document.getElementById('timeline');
  tl.innerHTML = '';
  const ages = [
    { label:'AGE 25', key:'age25', colorIndex: v.intelligence },
    { label:'AGE 35', key:'age35', colorIndex: v.wealth       },
    { label:'AGE 50', key:'age50', colorIndex: v.social       },
  ];
  const keyMap = { age25:'i', age35:'f', age50:'w' };
  const traitPick = { age25: v.intelligence, age35: v.fitness, age50: v.wealth };

  ages.forEach(({ label, key }, idx) => {
    const d   = pick(timelineData[key], traitPick[key]);
    const keys = ['i','f','w','s'];
    const txt  = keys.map(k => d[k]).join(' ');
    const dot  = ['var(--cyan)','var(--purple)','var(--gold)'][idx];

    const ev = document.createElement('div');
    ev.className = 'timeline-event';
    ev.style.animationDelay = `${idx * 0.18}s`;
    ev.style.borderLeft = `2px solid transparent`;
    ev.innerHTML = `
      <div class="timeline-dot" style="border-color:${dot};box-shadow:0 0 12px ${dot}"></div>
      <div class="timeline-age" style="color:${dot}">${label}</div>
      <div class="timeline-title">${avatar.title} in Progress</div>
      <div class="timeline-desc">${txt}</div>`;
    tl.appendChild(ev);
  });

  // Show results
  const results = document.getElementById('results');
  results.style.display = 'block';
  results.scrollIntoView({ behavior: 'smooth', block: 'start' });

  // Confetti burst
  launchConfetti();
}

/* ── Mini Confetti ── */
function launchConfetti() {
  const canvas = document.getElementById('particleCanvas');
  const ctx    = canvas.getContext('2d');
  const pieces = [];
  const colors = ['#00f5ff','#9b59ff','#ffd56b','#ff4f6b','#39ff87'];

  for (let i = 0; i < 60; i++) {
    pieces.push({
      x:  Math.random() * canvas.width,
      y:  Math.random() * canvas.height * 0.4,
      vx: (Math.random() - 0.5) * 4,
      vy: Math.random() * 3 + 1,
      r:  Math.random() * 5 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: 0, maxLife: 90,
    });
  }

  let frame = 0;
  function draw() {
    pieces.forEach(p => {
      const a = 1 - p.life / p.maxLife;
      ctx.save();
      ctx.globalAlpha = a * 0.85;
      ctx.fillStyle   = p.color;
      ctx.beginPath();
      ctx.rect(p.x, p.y, p.r, p.r * 2.5);
      ctx.fill();
      ctx.restore();
      p.x += p.vx; p.y += p.vy; p.vy += 0.06; p.life++;
    });
    if (++frame < 90) requestAnimationFrame(draw);
  }
  draw();
}

/* ── Presets for quick profiles ── */
const presets = {
  balanced:     { intelligence: 65, fitness: 60, wealth: 60, social: 65 },
  grinder:      { intelligence: 70, fitness: 80, wealth: 75, social: 40 },
  socialLegend: { intelligence: 55, fitness: 55, wealth: 65, social: 90 },
  monkMode:     { intelligence: 85, fitness: 70, wealth: 55, social: 25 },
};

function applyPreset(name) {
  const config = presets[name];
  if (!config) return;
  Object.keys(config).forEach(trait => {
    const input = sliders[trait];
    if (!input) return;
    input.value = config[trait];
    input.dispatchEvent(new Event('input'));
  });
  generate();
}

document.querySelectorAll('[data-preset]').forEach(btn => {
  btn.addEventListener('click', () => {
    applyPreset(btn.dataset.preset);
  });
});
