import { useState, useEffect, useRef, useCallback } from "react";

/* ─────────────────────────────────────────────────────────
   FONTS & BASE STYLES
───────────────────────────────────────────────────────── */
const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,700&family=Figtree:wght@300;400;500;600;700&family=Bebas+Neue&display=swap');`;

const CSS = `
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
html{scroll-behavior:smooth;}
body{background:#04030a;overflow-x:hidden;cursor:none;}
:root{
  --void:#04030a;
  --glow:#7c5cfc;
  --glow2:#fc5c7d;
  --paper:#f0ebe0;
  --text:#c8c2b8;
  --muted:#6b6470;
}
.c-dot{position:fixed;width:10px;height:10px;background:var(--glow);border-radius:50%;pointer-events:none;z-index:9999;mix-blend-mode:screen;transform:translate(-50%,-50%);transition:transform .15s,background .25s,width .2s,height .2s;}
.c-ring{position:fixed;width:36px;height:36px;border:1px solid rgba(124,92,252,.35);border-radius:50%;pointer-events:none;z-index:9998;mix-blend-mode:screen;transform:translate(-50%,-50%);}
.c-dot.hovered{width:16px;height:16px;background:var(--glow2);}
#story-progress{position:fixed;top:0;left:0;height:2px;background:linear-gradient(90deg,var(--glow),var(--glow2));z-index:1000;transition:width .1s;box-shadow:0 0 10px var(--glow);}
.ch-nav{position:fixed;right:1.8rem;top:50%;transform:translateY(-50%);z-index:500;display:flex;flex-direction:column;gap:.9rem;}
.ch-nav-dot{width:7px;height:7px;border-radius:50%;background:rgba(255,255,255,.12);cursor:pointer;transition:all .3s;position:relative;}
.ch-nav-dot::after{content:attr(data-label);position:absolute;right:1.6rem;top:50%;transform:translateY(-50%);font-size:.65rem;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);white-space:nowrap;opacity:0;transition:opacity .2s;font-family:'Figtree',sans-serif;}
.ch-nav-dot:hover::after,.ch-nav-dot.active::after{opacity:1;}
.ch-nav-dot.active{background:var(--glow);box-shadow:0 0 14px var(--glow);width:9px;height:9px;}
.ch-nav-dot:hover{background:rgba(124,92,252,.6);}
@keyframes twinkle{0%,100%{opacity:.07;transform:scale(1);}50%{opacity:.9;transform:scale(1.7);}}
@keyframes orbDrift{0%,100%{transform:translate(0,0) scale(1);}33%{transform:translate(25px,-18px) scale(1.04);}66%{transform:translate(-15px,12px) scale(.96);}}
.orb{position:absolute;border-radius:50%;filter:blur(100px);pointer-events:none;animation:orbDrift 10s ease-in-out infinite;}
@keyframes scanMove{0%{top:-20%;}100%{top:120%;}}
.scanline{position:absolute;left:0;right:0;height:100px;background:linear-gradient(to bottom,transparent,rgba(124,92,252,.02),transparent);pointer-events:none;animation:scanMove 8s linear infinite;z-index:0;}
.chapter{min-height:100vh;display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;padding:6rem 3rem;}
.reveal{opacity:0;transform:translateY(48px);transition:opacity .9s ease,transform .9s ease;}
.reveal.up{opacity:1;transform:translateY(0);}
.reveal-l{opacity:0;transform:translateX(-48px);transition:opacity .9s ease,transform .9s ease;}
.reveal-l.up{opacity:1;transform:translateX(0);}
.reveal-r{opacity:0;transform:translateX(48px);transition:opacity .9s ease,transform .9s ease;}
.reveal-r.up{opacity:1;transform:translateX(0);}
@keyframes fadeUp{from{opacity:0;transform:translateY(36px);}to{opacity:1;transform:translateY(0);}}
@keyframes fadeIn{from{opacity:0;}to{opacity:1;}}
@keyframes blink{0%,100%{opacity:1;}50%{opacity:0;}}
.cursor-blink{animation:blink 1s step-end infinite;color:var(--glow);}
@keyframes ticker{from{transform:translateX(0);}to{transform:translateX(-50%);}}
.ticker-track{display:flex;animation:ticker 22s linear infinite;width:max-content;}
.ticker-track:hover{animation-play-state:paused;}
@keyframes panelGlow{0%,100%{box-shadow:0 0 40px rgba(124,92,252,.15),0 30px 80px rgba(0,0,0,.6);}50%{box-shadow:0 0 80px rgba(124,92,252,.28),0 30px 80px rgba(0,0,0,.6);}}
@keyframes shimmer{0%{background-position:-600px 0;}100%{background-position:600px 0;}}
.shimmer-line{background:linear-gradient(90deg,rgba(255,255,255,.03) 25%,rgba(124,92,252,.1) 50%,rgba(255,255,255,.03) 75%);background-size:1200px 100%;animation:shimmer 1.8s infinite;border-radius:6px;height:14px;margin-bottom:10px;}
@keyframes spin{to{transform:rotate(360deg);}}
.spinner{width:14px;height:14px;border:2px solid rgba(255,255,255,.2);border-top-color:white;border-radius:50%;animation:spin .75s linear infinite;display:inline-block;}
@keyframes inkDrop{0%{transform:scale(0);opacity:.8;}100%{transform:scale(20);opacity:0;}}
.ink-drop{position:absolute;width:20px;height:20px;border-radius:50%;background:rgba(124,92,252,.25);animation:inkDrop .8s ease-out forwards;pointer-events:none;}
@keyframes chaos1{0%,100%{transform:translate(0,0) rotate(-3deg);}50%{transform:translate(6px,-8px) rotate(2deg);}}
@keyframes chaos2{0%,100%{transform:translate(0,0) rotate(2deg);}50%{transform:translate(-8px,5px) rotate(-4deg);}}
@keyframes chaos3{0%,100%{transform:translate(0,0) rotate(-1deg);}50%{transform:translate(10px,4px) rotate(3deg);}}
@keyframes pulseDot{0%,100%{opacity:1;transform:scale(1);}50%{opacity:.35;transform:scale(.55);}}
@keyframes countUp{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}
@keyframes floatTag{0%,100%{transform:translateY(0) rotate(-1deg);}50%{transform:translateY(-8px) rotate(1deg);}}
@keyframes scrollDown{0%{opacity:0;transform:translateY(-4px);}50%{opacity:1;}100%{opacity:0;transform:translateY(8px);}}
.story-divider{display:flex;align-items:center;gap:1.5rem;padding:2.5rem 4rem;position:relative;z-index:1;}
.div-line{flex:1;height:1px;background:linear-gradient(90deg,transparent,rgba(124,92,252,.3),transparent);}
.div-glyph{font-family:'Cormorant Garamond',serif;font-size:1.4rem;color:rgba(124,92,252,.45);font-style:italic;}
.ch-tag{font-family:'Bebas Neue',sans-serif;letter-spacing:.35em;font-size:.8rem;color:var(--glow);display:flex;align-items:center;gap:.8rem;margin-bottom:1.2rem;}
.ch-tag::before{content:'';width:28px;height:1px;background:var(--glow);}
.headline{font-family:'Cormorant Garamond',serif;font-size:clamp(2.4rem,5vw,4.2rem);font-weight:700;line-height:1.08;letter-spacing:-1px;color:var(--paper);}
.headline em{font-style:italic;color:var(--glow);}
.body-text{font-size:1rem;line-height:1.9;color:var(--muted);font-weight:300;font-family:'Figtree',sans-serif;}
.demo-panel{background:rgba(255,255,255,.022);border:1px solid rgba(124,92,252,.18);border-radius:14px;overflow:hidden;animation:panelGlow 5s ease-in-out infinite;}
.demo-panel:focus-within{border-color:rgba(124,92,252,.45);}
.panel-bar{background:rgba(124,92,252,.07);border-bottom:1px solid rgba(124,92,252,.1);padding:.75rem 1.3rem;display:flex;align-items:center;gap:.5rem;}
.panel-dot{width:10px;height:10px;border-radius:50%;}
textarea{width:100%;background:transparent;border:none;outline:none;resize:none;font-family:'Figtree',sans-serif;font-size:.9rem;line-height:1.85;color:rgba(240,235,224,.5);padding:1.5rem 1.8rem;}
textarea::placeholder{color:rgba(255,255,255,.15);}
.lvl-pill{padding:.32rem 1rem;border-radius:20px;border:1px solid;font-size:.7rem;font-weight:600;letter-spacing:.05em;cursor:pointer;transition:all .22s;font-family:'Figtree',sans-serif;background:transparent;}
.term-chip{font-size:.7rem;font-weight:600;padding:.25rem .72rem;border-radius:20px;background:rgba(124,92,252,.12);border:1px solid rgba(124,92,252,.28);color:#a990fd;letter-spacing:.04em;font-family:'Figtree',sans-serif;transition:all .2s;}
.term-chip:hover{background:rgba(124,92,252,.28);}
.simplify-btn{position:relative;overflow:hidden;background:linear-gradient(135deg,#7c5cfc,#5c3dfc);color:white;border:none;cursor:pointer;padding:.85rem 2.4rem;border-radius:8px;font-family:'Figtree',sans-serif;font-size:.9rem;font-weight:600;letter-spacing:.04em;transition:transform .2s,box-shadow .2s;box-shadow:0 4px 24px rgba(124,92,252,.4);}
.simplify-btn:hover{transform:translateY(-2px);box-shadow:0 10px 40px rgba(124,92,252,.6);}
.simplify-btn::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,.15),transparent);opacity:0;transition:opacity .2s;}
.simplify-btn:hover::before{opacity:1;}
.stat-card{padding:2rem 1.5rem;background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.06);border-radius:10px;text-align:center;transition:all .3s;}
.stat-card:hover{transform:translateY(-6px);background:rgba(124,92,252,.05);border-color:rgba(124,92,252,.2);box-shadow:0 20px 50px rgba(0,0,0,.4);}
.transform-bar{display:flex;align-items:center;gap:1rem;padding:.7rem 1.8rem;border-top:1px solid rgba(124,92,252,.08);border-bottom:1px solid rgba(124,92,252,.08);background:rgba(124,92,252,.03);font-family:'Bebas Neue',sans-serif;letter-spacing:.2em;font-size:.82rem;color:var(--glow);}
.transform-bar::before,.transform-bar::after{content:'';flex:1;height:1px;background:linear-gradient(90deg,transparent,rgba(124,92,252,.4),transparent);}
.output-area{padding:2.2rem 1.8rem;font-family:'Figtree',sans-serif;font-size:.95rem;line-height:1.85;color:var(--paper);min-height:110px;transition:all .4s;}
.chaos-word{position:absolute;font-family:'Cormorant Garamond',serif;font-style:italic;pointer-events:auto;user-select:none;white-space:nowrap;cursor:default;transition:opacity .25s,color .25s,text-shadow .25s,transform .25s,letter-spacing .25s;}
.chaos-word:hover{opacity:1!important;color:#ffffff!important;text-shadow:0 0 18px rgba(252,92,125,.9),0 0 40px rgba(252,92,125,.5),0 0 80px rgba(252,92,125,.25);transform:scale(1.18) rotate(0deg)!important;letter-spacing:.04em;animation-play-state:paused;z-index:10;}
@keyframes chaosHoverPop{0%{transform:scale(1);}50%{transform:scale(1.22);}100%{transform:scale(1.18);}}
.pipe-bubble{width:64px;height:64px;border-radius:50%;border:1px solid rgba(124,92,252,.28);background:rgba(124,92,252,.07);display:flex;align-items:center;justify-content:center;font-size:1.4rem;transition:all .3s;cursor:default;margin:0 auto 1.5rem;}
.pipe-bubble:hover{background:rgba(124,92,252,.2);box-shadow:0 0 30px rgba(124,92,252,.4);}
footer{background:#02020a;padding:2.2rem 3rem;display:flex;align-items:center;justify-content:space-between;border-top:1px solid rgba(255,255,255,.04);flex-wrap:wrap;gap:1rem;position:relative;z-index:1;}
@media(max-width:768px){
  .chapter{padding:5rem 1.5rem;}
  .two-col{grid-template-columns:1fr!important;}
  .ch-nav{display:none;}
  .stats-grid{grid-template-columns:repeat(2,1fr)!important;}
  .pipe-grid{grid-template-columns:1fr!important;}
  .ticker-track{animation-duration:12s;}
}
`;

/* ─────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────── */
const LEVELS = {
  elementary:   { label:"Elementary",    color:"#22c55e", result:"The mitochondria is like a tiny battery inside each cell. It takes in food and oxygen, then turns them into energy your body can use.", terms:["mitochondria","energy","cell","oxygen"], score:92 },
  high_school:  { label:"High School",   color:"#3b82f6", result:"Mitochondria produce ATP — the cell's energy molecule — by passing electrons through proteins that pump protons across a membrane, releasing stored energy.", terms:["ATP","electron transport","proton pump","membrane"], score:74 },
  undergraduate:{ label:"Undergraduate", color:"#7c5cfc", result:"The mitochondrial electron transport chain drives ATP synthesis by establishing a proton gradient across the inner membrane, powering ATP synthase — similar to water turning a turbine.", terms:["chemiosmosis","ATP synthase","ETC","phosphorylation"], score:61 },
  graduate:     { label:"Graduate",      color:"#f59e0b", result:"The ETC couples electron transfer from NADH/FADH₂ to O₂ with proton translocation, establishing proton-motive force that drives F₀F₁-ATP synthase catalysis.", terms:["NADH","proton-motive force","F₀F₁","redox coupling"], score:40 },
  expert:       { label:"Expert",        color:"#ec4899", result:"Complex I–IV catalyze coupled redox reactions with proton translocation stoichiometries of 4H⁺/2e⁻, driving Δψm and ΔpH components of the proton-motive force.", terms:["OXPHOS","Δψm","Complex I–IV","stoichiometry"], score:26 },
};

const DEFAULT_INPUT = `"The mitochondrial electron transport chain facilitates chemiosmotic synthesis of adenosine triphosphate through proton gradient-mediated phosphorylation across the inner mitochondrial membrane via the F₀F₁ ATP synthase complex."`;

const CHAOS_WORDS = [
  { text:"chemiosmotic?",  x:"8%",  y:"18%", size:"1.1rem", op:.55, anim:"chaos1 3.2s ease-in-out infinite" },
  { text:"phosphorylation?",x:"60%",y:"12%", size:"1.3rem", op:.45, anim:"chaos2 4s ease-in-out infinite .5s" },
  { text:"adenosine?",      x:"76%",y:"44%", size:"1rem",   op:.5,  anim:"chaos3 3.5s ease-in-out infinite 1s" },
  { text:"F₀F₁ complex??", x:"5%", y:"65%", size:"1.2rem", op:.6,  anim:"chaos1 4.5s ease-in-out infinite .8s" },
  { text:"proton gradient?",x:"55%",y:"72%", size:"1rem",   op:.4,  anim:"chaos2 3.8s ease-in-out infinite .3s" },
  { text:"WHAT IS THIS??", x:"28%",y:"80%", size:".95rem", op:.7,  anim:"chaos3 3s ease-in-out infinite 1.2s" },
  { text:"inner membrane?",x:"68%",y:"26%", size:".9rem",  op:.35, anim:"chaos1 5s ease-in-out infinite .6s" },
  { text:"ATP synthase?",  x:"20%",y:"50%", size:"1.1rem", op:.5,  anim:"chaos2 3.6s ease-in-out infinite .2s" },
];

const TICKER_ITEMS = ["Academic Simplification","NLP Pipeline","Text Complexity","Flesch-Kincaid","Knowledge Access","Machine Learning","Reading Levels","Transformer Models","Student Comprehension","Meaning Preserved"];

const CHAPTERS_NAV = [
  { id:"s-prelude",  label:"Prelude"  },
  { id:"s-problem",  label:"Problem"  },
  { id:"s-vision",   label:"Vision"   },
  { id:"s-how",      label:"Process"  },
  { id:"s-demo",     label:"Demo"     },
  { id:"s-epilogue", label:"Epilogue" },
];

/* ─────────────────────────────────────────────────────────
   HOOKS
───────────────────────────────────────────────────────── */
function useScrollReveal() {
  useEffect(() => {
    const targets = document.querySelectorAll(".reveal,.reveal-l,.reveal-r");
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("up"); });
    }, { threshold: 0.12 });
    targets.forEach(t => io.observe(t));
    return () => io.disconnect();
  }, []);
}

function useTypewriter(text, speed = 90, delay = 0) {
  const [shown, setShown] = useState("");
  const [done, setDone]   = useState(false);
  useEffect(() => {
    setShown(""); setDone(false);
    let i = 0;
    const t = setTimeout(() => {
      const iv = setInterval(() => {
        i++; setShown(text.slice(0, i));
        if (i >= text.length) { clearInterval(iv); setDone(true); }
      }, speed);
      return () => clearInterval(iv);
    }, delay);
    return () => clearTimeout(t);
  }, [text, speed, delay]);
  return { shown, done };
}

/* ─────────────────────────────────────────────────────────
   SHARED COMPONENTS
───────────────────────────────────────────────────────── */
function Stars({ count = 130 }) {
  const list = useRef(Array.from({ length: count }, () => ({
    l: Math.random()*100, t: Math.random()*100,
    d: 2+Math.random()*4, dl: -(Math.random()*4),
    s: Math.random()<.07?3:Math.random()<.22?2:1,
    o: Math.random()*.55+.05,
  }))).current;
  return (
    <div style={{ position:"absolute",inset:0,pointerEvents:"none" }}>
      {list.map((s,i) => (
        <div key={i} style={{ position:"absolute",left:`${s.l}%`,top:`${s.t}%`,width:`${s.s}px`,height:`${s.s}px`,background:"white",borderRadius:"50%",opacity:s.o,animation:`twinkle ${s.d}s ease-in-out ${s.dl}s infinite` }} />
      ))}
    </div>
  );
}

function InkDrop({ x, y, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 900); return () => clearTimeout(t); }, [onDone]);
  return <div className="ink-drop" style={{ left:x-10, top:y-10 }} />;
}

function Divider({ glyph="✦" }) {
  return (
    <div className="story-divider">
      <div className="div-line"/><span className="div-glyph">{glyph}</span><div className="div-line"/>
    </div>
  );
}

function Ticker() {
  const items = [...TICKER_ITEMS,...TICKER_ITEMS];
  return (
    <div style={{ overflow:"hidden",borderTop:"1px solid rgba(124,92,252,.1)",borderBottom:"1px solid rgba(124,92,252,.1)",background:"rgba(124,92,252,.03)",padding:".85rem 0",position:"relative",zIndex:1 }}>
      <div className="ticker-track">
        {items.map((item,i) => (
          <span key={i} style={{ fontFamily:"'Bebas Neue',sans-serif",letterSpacing:".2em",fontSize:".82rem",color:i%2===0?"var(--glow)":"var(--muted)",marginRight:"3rem",whiteSpace:"nowrap" }}>
            {item} {i%3===0?"✦":i%3===1?"◆":"▸"}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   NAV & CHROME
───────────────────────────────────────────────────────── */
function NavBar() {
  return (
    <nav style={{ position:"fixed",top:0,left:0,right:0,zIndex:100,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"1.1rem 3rem",background:"rgba(4,3,10,.82)",backdropFilter:"blur(16px)",borderBottom:"1px solid rgba(124,92,252,.1)",animation:"fadeUp .8s ease forwards",opacity:0 }}>
      <a href="#s-prelude" style={{ textDecoration:"none",display:"flex",alignItems:"center" }}>
        <span style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:"1.7rem",fontWeight:700,color:"#f0ebe0",letterSpacing:"-.5px" }}>Clari</span>
        <span style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:"1.7rem",fontWeight:700,color:"transparent",WebkitTextStroke:"1.5px #7c5cfc",letterSpacing:"-.5px" }}>Text</span>
      </a>
      <div style={{ display:"flex",gap:"2.5rem" }}>
        {[["s-problem","The Problem"],["s-how","Process"],["s-demo","Try It"]].map(([id,label]) => (
          <button key={id} onClick={() => document.getElementById(id)?.scrollIntoView({behavior:"smooth"})}
            style={{ background:"none",border:"none",cursor:"pointer",fontFamily:"'Figtree',sans-serif",fontSize:".85rem",fontWeight:500,color:"var(--muted)",transition:"color .2s" }}
            onMouseEnter={e=>e.target.style.color="var(--paper)"} onMouseLeave={e=>e.target.style.color="var(--muted)"}>
            {label}
          </button>
        ))}
      </div>
      <div style={{ display:"flex",alignItems:"center",gap:".5rem" }}>
        <span style={{ width:7,height:7,borderRadius:"50%",background:"#22c55e",boxShadow:"0 0 8px #22c55e",display:"inline-block",animation:"pulseDot 2s ease-in-out infinite" }} />
        <span style={{ fontSize:".78rem",color:"var(--muted)",fontFamily:"'Figtree',sans-serif",letterSpacing:".05em" }}>v1.0 Live</span>
      </div>
    </nav>
  );
}

function ProgressBar() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const fn = () => {
      const total = document.body.scrollHeight - window.innerHeight;
      setPct(total > 0 ? (window.scrollY / total) * 100 : 0);
    };
    window.addEventListener("scroll", fn, { passive:true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return <div id="story-progress" style={{ width:`${pct}%` }} />;
}

function ChapterNav() {
  const [active, setActive] = useState("s-prelude");
  useEffect(() => {
    const fn = () => {
      const mid = window.scrollY + window.innerHeight / 2;
      let found = CHAPTERS_NAV[0].id;
      CHAPTERS_NAV.forEach(c => { const el = document.getElementById(c.id); if (el && el.offsetTop <= mid) found = c.id; });
      setActive(found);
    };
    window.addEventListener("scroll", fn, { passive:true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return (
    <nav className="ch-nav">
      {CHAPTERS_NAV.map(c => (
        <div key={c.id} className={`ch-nav-dot${active===c.id?" active":""}`} data-label={c.label}
          onClick={() => document.getElementById(c.id)?.scrollIntoView({behavior:"smooth"})} />
      ))}
    </nav>
  );
}

function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const mouse = useRef({x:-100,y:-100});
  const ring  = useRef({x:-100,y:-100});
  const raf   = useRef(null);

  useEffect(() => {
    const mv = e => {
      mouse.current = {x:e.clientX,y:e.clientY};
      if (dotRef.current) { dotRef.current.style.left=e.clientX+"px"; dotRef.current.style.top=e.clientY+"px"; }
    };
    window.addEventListener("mousemove", mv);
    const sel = "a,button,.lvl-pill,.ch-nav-dot,.stat-card,.term-chip,.simplify-btn,.pipe-bubble";
    const over = () => dotRef.current?.classList.add("hovered");
    const out  = () => dotRef.current?.classList.remove("hovered");
    document.querySelectorAll(sel).forEach(el => { el.addEventListener("mouseenter",over); el.addEventListener("mouseleave",out); });
    const loop = () => {
      ring.current.x += (mouse.current.x - ring.current.x) * 0.11;
      ring.current.y += (mouse.current.y - ring.current.y) * 0.11;
      if (ringRef.current) { ringRef.current.style.left=ring.current.x+"px"; ringRef.current.style.top=ring.current.y+"px"; }
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => { window.removeEventListener("mousemove",mv); cancelAnimationFrame(raf.current); };
  }, []);

  return (<><div ref={dotRef} className="c-dot"/><div ref={ringRef} className="c-ring"/></>);
}

/* ─────────────────────────────────────────────────────────
   SECTION: PRELUDE
───────────────────────────────────────────────────────── */
function Prelude() {
  const { shown, done } = useTypewriter("ClariText", 90, 600);
  return (
    <section className="chapter" id="s-prelude" style={{ minHeight:"100vh",flexDirection:"column",textAlign:"center",background:"var(--void)" }}>
      <Stars count={160}/>
      <div className="orb" style={{ width:700,height:700,background:"rgba(124,92,252,.07)",top:"-10%",left:"-10%",animationDuration:"12s" }}/>
      <div className="orb" style={{ width:500,height:500,background:"rgba(252,92,125,.05)",bottom:"5%",right:"-8%",animationDelay:"-5s" }}/>
      <div className="scanline"/>

      {/* Ghost bg letters */}
      <div style={{ position:"absolute",fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(8rem,25vw,22rem)",fontWeight:900,color:"transparent",WebkitTextStroke:"1px rgba(124,92,252,.05)",top:"50%",left:"50%",transform:"translate(-50%,-50%)",pointerEvents:"none",userSelect:"none",whiteSpace:"nowrap",zIndex:0 }}>CT</div>

      <div style={{ position:"relative",zIndex:2 }}>
        {/* Eyebrow */}
        <div style={{ opacity:0,animation:"fadeUp .8s ease .2s forwards",display:"flex",alignItems:"center",gap:".6rem",justifyContent:"center",marginBottom:"2rem" }}>
          <span style={{ width:6,height:6,borderRadius:"50%",background:"#7c5cfc",display:"inline-block",animation:"pulseDot 2s ease-in-out infinite" }}/>
          <span style={{ fontFamily:"'Bebas Neue',sans-serif",letterSpacing:".35em",fontSize:".82rem",color:"var(--glow)" }}>A Story About Understanding</span>
          <span style={{ width:6,height:6,borderRadius:"50%",background:"#7c5cfc",display:"inline-block",animation:"pulseDot 2s ease-in-out .4s infinite" }}/>
        </div>

        {/* Typewriter title */}
        <h1 style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(5rem,15vw,12rem)",fontWeight:700,lineHeight:.92,letterSpacing:"-4px",whiteSpace:"nowrap" }}>
          <span style={{ color:"#f0ebe0" }}>{shown.slice(0,5)}</span>
          <span style={{ color:"transparent",WebkitTextStroke:"1.5px #7c5cfc" }}>{shown.slice(5)}</span>
          {!done && <span className="cursor-blink">|</span>}
        </h1>

        <p style={{ opacity:0,animation:"fadeUp .9s ease 1.4s forwards",fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(1.1rem,2.2vw,1.45rem)",fontStyle:"italic",fontWeight:300,color:"rgba(212,207,197,.6)",maxWidth:560,lineHeight:1.7,margin:"2rem auto" }}>
          Every student has stared at a wall of academic language and felt locked out. This is the story of how we tore it down.
        </p>

        {/* Decorative rule */}
        <div style={{ opacity:0,animation:"fadeUp .7s ease 1.8s forwards",display:"flex",alignItems:"center",gap:"1rem",justifyContent:"center",margin:"1.5rem 0" }}>
          <div style={{ width:60,height:1,background:"linear-gradient(90deg,transparent,rgba(124,92,252,.4))" }}/>
          <span style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:"1rem",color:"rgba(124,92,252,.4)",fontStyle:"italic" }}>Scroll to begin</span>
          <div style={{ width:60,height:1,background:"linear-gradient(90deg,rgba(124,92,252,.4),transparent)" }}/>
        </div>

        {/* Animated scroll arrows */}
        <div style={{ opacity:0,animation:"fadeUp .8s ease 2.1s forwards",marginTop:"1rem",display:"flex",flexDirection:"column",alignItems:"center",gap:"4px" }}>
          {[0,1,2].map(i => (
            <div key={i} style={{ width:2,height:8,background:"var(--glow)",borderRadius:2,opacity:.9-i*.28,animation:`scrollDown 1.6s ease-in-out ${i*.15}s infinite` }}/>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────
   SECTION: THE PROBLEM
───────────────────────────────────────────────────────── */
function TheProblem() {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  return (
    <section className="chapter" id="s-problem" style={{ background:"#080614",flexDirection:"column",paddingTop:"8rem",paddingBottom:"8rem" }}>
      <div className="orb" style={{ width:500,height:500,background:"rgba(252,92,125,.06)",top:"-5%",right:"-5%",animationDelay:"-3s" }}/>

      <div style={{ maxWidth:1100,width:"100%",position:"relative",zIndex:1 }}>
        <div className="ch-tag reveal" style={{ justifyContent:"center",marginBottom:"1.5rem" }}>Chapter One · The Problem</div>
        <h2 className="headline reveal" style={{ textAlign:"center",maxWidth:700,margin:"0 auto 1.5rem" }}>
          Students are <em>locked out</em><br/>by the language of knowledge
        </h2>
        <p className="body-text reveal" style={{ textAlign:"center",maxWidth:560,margin:"0 auto 5rem" }}>
          Textbooks, research papers, technical docs — written for experts, handed to learners. The barrier isn't intelligence. It's <span style={{ color:"var(--paper)",fontStyle:"italic" }}>vocabulary</span>.
        </p>

        {/* CHAOS BOX */}
        <div className="reveal" style={{ position:"relative",height:300,background:"rgba(255,255,255,.015)",border:"1px solid rgba(252,92,125,.15)",borderRadius:14,overflow:"hidden",marginBottom:"3rem" }}>
          <div style={{ position:"absolute",inset:0,background:"radial-gradient(ellipse at center,rgba(252,92,125,.04) 0%,transparent 70%)" }}/>

          {/* Central academic text — dims when a word is hovered */}
          <div style={{ position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",zIndex:2,maxWidth:580,padding:"1.5rem 2rem",textAlign:"center",transition:"opacity .3s",opacity:hoveredIdx!==null?0.18:1 }}>
            <div style={{ fontSize:".62rem",letterSpacing:".18em",textTransform:"uppercase",color:"rgba(252,92,125,.55)",fontFamily:"'Bebas Neue',sans-serif",marginBottom:".8rem" }}>Original Academic Text</div>
            <p style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:".98rem",lineHeight:1.8,color:"rgba(240,235,224,.32)",fontStyle:"italic" }}>
              "The mitochondrial electron transport chain facilitates chemiosmotic synthesis of adenosine triphosphate through proton gradient-mediated phosphorylation via the F₀F₁ ATP synthase complex."
            </p>
          </div>

          {/* Chaos floating words */}
          {CHAOS_WORDS.map((w,i) => {
            const isHovered = hoveredIdx === i;
            const otherHovered = hoveredIdx !== null && !isHovered;
            return (
              <span
                key={i}
                className="chaos-word"
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
                style={{
                  left: w.x,
                  top: w.y,
                  fontSize: isHovered ? `calc(${w.size} * 1.18)` : w.size,
                  opacity: otherHovered ? w.op * 0.25 : w.op,
                  color: isHovered
                    ? "#ffffff"
                    : `rgba(252,92,125,${w.op})`,
                  textShadow: isHovered
                    ? "0 0 18px rgba(252,92,125,1), 0 0 40px rgba(252,92,125,.7), 0 0 90px rgba(252,92,125,.35), 0 0 4px #fff"
                    : "none",
                  animation: isHovered ? "none" : w.anim,
                  transform: isHovered ? "scale(1.18) rotate(0deg)" : undefined,
                  letterSpacing: isHovered ? ".06em" : "normal",
                  zIndex: isHovered ? 10 : 1,
                  fontWeight: isHovered ? 600 : 400,
                  fontStyle: isHovered ? "normal" : "italic",
                  cursor: "default",
                  transition: "opacity .28s, color .22s, text-shadow .22s, font-size .22s, letter-spacing .22s, font-weight .22s",
                  // keep the drift going for non-hovered words but smoother
                  willChange: "transform, opacity",
                }}
              >
                {w.text}
              </span>
            );
          })}

          {/* Hover hint — fades out once user has hovered */}
          <div style={{
            position:"absolute", bottom:"0.7rem", right:"1.2rem",
            fontSize:".6rem", letterSpacing:".14em", textTransform:"uppercase",
            color:"rgba(252,92,125,.3)", fontFamily:"'Figtree',sans-serif",
            opacity: hoveredIdx !== null ? 0 : 1, transition:"opacity .4s",
            pointerEvents:"none",
          }}>
            Hover the words ↑
          </div>
        </div>

        <p className="body-text reveal" style={{ textAlign:"center",maxWidth:480,margin:"0 auto",color:"rgba(107,100,112,.65)",fontStyle:"italic" }}>
          Nine words in that sentence would stop the average undergraduate cold. ClariText was built to change that.
        </p>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────
   SECTION: VISION (parallax quote)
───────────────────────────────────────────────────────── */
function TheVision() {
  const ref = useRef(null);
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    const fn = () => { if (!ref.current) return; setOffset(ref.current.getBoundingClientRect().top * 0.12); };
    window.addEventListener("scroll", fn, { passive:true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <section ref={ref} className="chapter" id="s-vision" style={{ background:"#04030a",minHeight:"70vh",flexDirection:"column",textAlign:"center" }}>
      <Stars count={60}/>
      <div className="orb" style={{ width:600,height:300,background:"rgba(124,92,252,.06)",top:"50%",left:"50%",transform:`translate(-50%,-50%) translateY(${offset}px)`,animationDuration:"15s" }}/>
      <div style={{ position:"relative",zIndex:2,transform:`translateY(${offset*.5}px)`,transition:"transform .05s" }}>
        <span style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:"5rem",lineHeight:.5,color:"rgba(124,92,252,.2)",display:"block",marginBottom:"1rem" }} className="reveal">❝</span>
        <blockquote className="reveal" style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(1.6rem,3.5vw,2.8rem)",fontWeight:400,fontStyle:"italic",color:"rgba(240,235,224,.62)",maxWidth:860,margin:"0 auto",lineHeight:1.5 }}>
          The gap between <span style={{ color:"var(--paper)",fontStyle:"normal",fontWeight:600 }}>what is written</span> and <span style={{ color:"var(--paper)",fontStyle:"normal",fontWeight:600 }}>what is understood</span> is where students are lost forever — unless someone builds a bridge.
        </blockquote>
        <div className="reveal" style={{ marginTop:"2rem",fontSize:".78rem",letterSpacing:".15em",textTransform:"uppercase",color:"var(--glow)",fontFamily:"'Figtree',sans-serif" }}>— The ClariText Manifesto</div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────
   SECTION: HOW IT WORKS
───────────────────────────────────────────────────────── */
function HowItWorks() {
  const steps = [
    { icon:"📄", num:"01", title:"You bring the text",        body:"Paste, upload a PDF, or drop a URL. Research papers, textbooks, technical docs — any academic language." },
    { icon:"🔬", num:"02", title:"NLP reads between lines",   body:"spaCy and BERT scan sentence structure, jargon density, and domain terms to map complexity." },
    { icon:"⚙️", num:"03", title:"ML rewrites, not paraphrases",body:"Fine-tuned T5/BART models reconstruct at your chosen level — preserving every unit of meaning." },
    { icon:"🔑", num:"04", title:"Key terms surface",         body:"Technical vocabulary is extracted, highlighted, and given plain-language definitions inline." },
    { icon:"✅", num:"05", title:"Clarity delivered",          body:"Simplified text, readability score, and key terms arrive in under two seconds." },
  ];
  return (
    <section className="chapter" id="s-how" style={{ background:"#060410",flexDirection:"column" }}>
      <div className="orb" style={{ width:700,height:400,background:"rgba(124,92,252,.05)",top:"50%",left:"50%",transform:"translate(-50%,-50%)",animationDuration:"14s" }}/>
      <div style={{ maxWidth:1100,width:"100%",position:"relative",zIndex:1 }}>
        <div className="ch-tag reveal" style={{ justifyContent:"center" }}>Chapter Two · The Process</div>
        <h2 className="headline reveal" style={{ textAlign:"center",maxWidth:660,margin:"0 auto 1.2rem" }}>Five acts.<br/><em>One transformation.</em></h2>
        <p className="body-text reveal" style={{ textAlign:"center",maxWidth:480,margin:"0 auto 5rem" }}>Every sentence that enters ClariText goes through a precisely choreographed NLP pipeline.</p>

        {/* Connecting line */}
        <div style={{ position:"relative" }}>
          <div className="reveal" style={{ position:"absolute",top:32,left:"10%",right:"10%",height:1,background:"linear-gradient(90deg,rgba(124,92,252,.06),rgba(124,92,252,.4),rgba(252,92,125,.4),rgba(124,92,252,.06))" }}/>
          <div className="pipe-grid" style={{ display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:"1rem" }}>
            {steps.map((s,i) => (
              <div key={i} className="reveal" style={{ transitionDelay:`${i*.12}s`,textAlign:"center",padding:"0 .5rem" }}>
                <div style={{ position:"relative",display:"inline-flex",marginBottom:"1.5rem" }}>
                  <div className="pipe-bubble">{s.icon}</div>
                  <div style={{ position:"absolute",top:-8,right:-8,width:22,height:22,borderRadius:"50%",background:"var(--glow)",color:"white",fontSize:".62rem",fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Figtree',sans-serif" }}>{s.num}</div>
                </div>
                <div style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:"1.05rem",fontWeight:700,color:"var(--paper)",marginBottom:".5rem" }}>{s.title}</div>
                <div style={{ fontSize:".82rem",color:"var(--muted)",lineHeight:1.65,fontFamily:"'Figtree',sans-serif" }}>{s.body}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────
   SECTION: STATS
───────────────────────────────────────────────────────── */
function Stats() {
  const [vis, setVis] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const io = new IntersectionObserver(e => { if (e[0].isIntersecting) setVis(true); }, { threshold:.3 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  const items = [
    { num:"3×",  label:"Faster Comprehension", sub:"Average across 5 subjects" },
    { num:"5",   label:"Difficulty Levels",     sub:"Elementary to Expert" },
    { num:"<2s", label:"Response Time",         sub:"Sub-2 second inference" },
    { num:"98%", label:"Meaning Preserved",     sub:"Tested on academic papers" },
  ];
  return (
    <section ref={ref} style={{ background:"#080614",padding:"6rem 3rem",position:"relative",zIndex:1 }}>
      <div className="orb" style={{ width:500,height:500,background:"rgba(252,92,125,.04)",top:0,left:"50%",transform:"translateX(-50%)" }}/>
      <div style={{ maxWidth:1000,margin:"0 auto",position:"relative",zIndex:1 }}>
        <div className="reveal" style={{ textAlign:"center",fontFamily:"'Bebas Neue',sans-serif",letterSpacing:".35em",fontSize:".8rem",color:"var(--glow)",marginBottom:"3.5rem" }}>The Numbers Behind the Story</div>
        <div className="stats-grid" style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"1.5rem" }}>
          {items.map((item,i) => (
            <div key={i} className="stat-card reveal" style={{ transitionDelay:`${i*.12}s` }}>
              <div style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:"3.2rem",fontWeight:700,color:"var(--paper)",lineHeight:1,animation:vis?`countUp .8s ease ${i*.1}s both`:"none" }}>{item.num}</div>
              <div style={{ fontSize:".75rem",fontWeight:700,letterSpacing:".08em",textTransform:"uppercase",color:"var(--glow)",margin:".5rem 0 .3rem",fontFamily:"'Figtree',sans-serif" }}>{item.label}</div>
              <div style={{ fontSize:".78rem",color:"var(--muted)",fontFamily:"'Figtree',sans-serif" }}>{item.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────
   SECTION: THE DEMO
───────────────────────────────────────────────────────── */
function TheDemo() {
  const [level,   setLevel]   = useState("undergraduate");
  const [input,   setInput]   = useState(DEFAULT_INPUT);
  const [loading, setLoading] = useState(false);
  const [result,  setResult]  = useState(null);
  const [hasRun,  setHasRun]  = useState(false);
  const [drops,   setDrops]   = useState([]);
  const panelRef = useRef(null);

  const run = useCallback(() => {
    if (!input.trim()) return;
    setLoading(true); setResult(null);
    setTimeout(() => { setResult(LEVELS[level]); setLoading(false); setHasRun(true); }, 1100);
  }, [input, level]);

  const addDrop = useCallback(e => {
    if (!panelRef.current) return;
    const rect = panelRef.current.getBoundingClientRect();
    const id = Date.now();
    setDrops(d => [...d, { id, x:e.clientX-rect.left, y:e.clientY-rect.top }]);
  }, []);

  const lvl = LEVELS[level];

  return (
    <section className="chapter" id="s-demo" style={{ background:"#04030a",flexDirection:"column",paddingTop:"8rem",paddingBottom:"8rem" }}>
      <Stars count={80}/>
      <div className="orb" style={{ width:800,height:400,background:"rgba(124,92,252,.07)",top:"30%",left:"50%",transform:"translate(-50%,-50%)",animationDuration:"16s" }}/>

      <div style={{ maxWidth:980,width:"100%",position:"relative",zIndex:1 }}>
        {/* Heading */}
        <div style={{ textAlign:"center",marginBottom:"3.5rem" }}>
          <div className="ch-tag reveal" style={{ justifyContent:"center" }}>Chapter Three · The Climax</div>
          <h2 className="headline reveal" style={{ textAlign:"center" }}>This is where <em>understanding</em> begins</h2>
          <p className="body-text reveal" style={{ maxWidth:500,margin:"1rem auto 0",textAlign:"center" }}>
            Choose your level. Paste your text. Watch complexity dissolve into clarity.
          </p>
        </div>

        {/* Level pills */}
        <div className="reveal" style={{ display:"flex",gap:".5rem",justifyContent:"center",flexWrap:"wrap",marginBottom:"1.6rem" }}>
          {Object.entries(LEVELS).map(([key,d]) => (
            <button key={key} className="lvl-pill" onClick={() => setLevel(key)}
              style={{ borderColor:level===key?d.color:"rgba(255,255,255,.1)",color:level===key?d.color:"var(--muted)",background:level===key?`${d.color}14`:"transparent",transform:level===key?"translateY(-2px)":"none",boxShadow:level===key?`0 4px 20px ${d.color}30`:"none" }}>
              {d.label}
            </button>
          ))}
        </div>

        {/* PANEL */}
        <div className="demo-panel reveal" ref={panelRef} onClick={addDrop} style={{ position:"relative" }}>
          {drops.map(d => <InkDrop key={d.id} x={d.x} y={d.y} onDone={() => setDrops(p => p.filter(i => i.id!==d.id))} />)}

          {/* Bar */}
          <div className="panel-bar">
            <div className="panel-dot" style={{ background:"#ff5f57" }}/>
            <div className="panel-dot" style={{ background:"#febc2e" }}/>
            <div className="panel-dot" style={{ background:"#28c840" }}/>
            <span style={{ marginLeft:".8rem",fontSize:".7rem",color:"var(--muted)",letterSpacing:".06em",fontFamily:"'Figtree',sans-serif" }}>claritext.app — Academic Comprehension Engine</span>
            <span style={{ marginLeft:"auto",padding:".3rem .8rem",background:"rgba(124,92,252,.1)",border:"1px solid rgba(124,92,252,.25)",borderRadius:20,fontSize:".62rem",fontWeight:600,letterSpacing:".1em",textTransform:"uppercase",color:"#a990fd",fontFamily:"'Figtree',sans-serif",animation:"floatTag 4s ease-in-out infinite" }}>✦ NLP Live</span>
          </div>

          {/* Input */}
          <div style={{ position:"relative" }}>
            <div style={{ position:"absolute",top:"1rem",left:"1.4rem",fontFamily:"'Bebas Neue',sans-serif",fontSize:".7rem",letterSpacing:".15em",color:"rgba(252,92,125,.5)" }}>Input — Original Text</div>
            <textarea rows={5} value={input} onChange={e=>setInput(e.target.value)} placeholder="Paste your academic text…" style={{ paddingTop:"2.4rem" }} onClick={e=>e.stopPropagation()}/>
          </div>

          {/* Transform bar */}
          <div className="transform-bar"><span>ClariText Transforms ✦ {lvl.label} Mode Active</span></div>

          {/* Output */}
          <div style={{ position:"relative" }}>
            <div style={{ position:"absolute",top:"1rem",left:"1.4rem",fontFamily:"'Bebas Neue',sans-serif",fontSize:".7rem",letterSpacing:".15em",color:`${lvl.color}80` }}>Output — {lvl.label} Level</div>
            {loading ? (
              <div style={{ padding:"3rem 1.8rem",paddingTop:"3.2rem" }}>
                <div className="shimmer-line" style={{ width:"85%" }}/><div className="shimmer-line" style={{ width:"68%" }}/><div className="shimmer-line" style={{ width:"50%" }}/>
              </div>
            ) : result ? (
              <div className="output-area" style={{ paddingTop:"2.8rem",animation:"fadeUp .6s ease forwards" }}>
                <p style={{ marginBottom:"1.2rem" }}>{result.result}</p>
                <div style={{ display:"flex",flexWrap:"wrap",gap:".4rem",marginBottom:"1.2rem" }}>
                  {result.terms.map(t => <span key={t} className="term-chip">{t}</span>)}
                </div>
                <div style={{ display:"flex",alignItems:"center",gap:"1.5rem",paddingTop:".8rem",borderTop:"1px solid rgba(255,255,255,.05)" }}>
                  <span style={{ display:"flex",alignItems:"center",gap:".4rem",fontSize:".72rem",fontWeight:600,letterSpacing:".08em",textTransform:"uppercase",fontFamily:"'Figtree',sans-serif",color:result.score>70?"#22c55e":result.score>45?lvl.color:"#fc5c7d" }}>
                    <span style={{ width:6,height:6,borderRadius:"50%",background:"currentColor",display:"inline-block" }}/>
                    Flesch Score: {result.score}
                  </span>
                  <span style={{ fontSize:".72rem",color:"var(--muted)",fontFamily:"'Figtree',sans-serif" }}>{result.score>70?"Very Easy to Read":result.score>50?"Standard Readability":"Technical / Dense"}</span>
                </div>
              </div>
            ) : (
              <div className="output-area" style={{ paddingTop:"2.8rem",color:"rgba(255,255,255,.14)",fontStyle:"italic",display:"flex",alignItems:"center",gap:".8rem" }}>
                <span style={{ fontSize:"1.2rem" }}>✦</span> Your simplified text will appear here…
              </div>
            )}
          </div>

          {/* Action bar */}
          <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"1rem 1.8rem",borderTop:"1px solid rgba(124,92,252,.08)",background:"rgba(0,0,0,.2)",gap:"1rem",flexWrap:"wrap" }} onClick={e=>e.stopPropagation()}>
            <div style={{ display:"flex",alignItems:"center",gap:".5rem" }}>
              <div style={{ width:8,height:8,borderRadius:"50%",background:lvl.color,boxShadow:`0 0 8px ${lvl.color}` }}/>
              <span style={{ fontSize:".78rem",color:"var(--muted)",fontFamily:"'Figtree',sans-serif" }}>{lvl.label} mode · click panel for ink effect</span>
            </div>
            <button className="simplify-btn" onClick={run} disabled={loading}>
              {loading ? <span style={{ display:"flex",alignItems:"center",gap:".5rem" }}><span className="spinner"/>Simplifying…</span> : hasRun?"Simplify Again →":"Simplify Text →"}
            </button>
          </div>
        </div>

        {/* Hints */}
        <div style={{ display:"flex",gap:"2.5rem",justifyContent:"center",marginTop:"1.8rem",flexWrap:"wrap" }}>
          {["Paste any academic text","Choose your difficulty level","Instant AI simplification"].map((h,i) => (
            <span key={h} className="reveal" style={{ transitionDelay:`${i*.1}s`,fontSize:".78rem",color:"var(--muted)",display:"flex",alignItems:"center",gap:".4rem",fontFamily:"'Figtree',sans-serif" }}>
              <span style={{ color:"var(--glow)",fontSize:".7rem" }}>0{i+1}</span>{h}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────
   SECTION: EPILOGUE
───────────────────────────────────────────────────────── */
function Epilogue() {
  return (
    <section className="chapter" id="s-epilogue" style={{ background:"#04030a",flexDirection:"column",textAlign:"center",paddingTop:"9rem",paddingBottom:"9rem" }}>
      <Stars count={110}/>
      <div className="orb" style={{ width:700,height:700,background:"rgba(124,92,252,.08)",top:"50%",left:"50%",transform:"translate(-50%,-50%)",animationDuration:"18s" }}/>
      <div className="orb" style={{ width:400,height:400,background:"rgba(252,92,125,.06)",top:"20%",right:"10%",animationDelay:"-6s" }}/>
      <div className="scanline"/>

      <div style={{ maxWidth:680,position:"relative",zIndex:2 }}>
        <div className="ch-tag reveal" style={{ justifyContent:"center" }}>Epilogue · The Belief</div>
        <h2 className="headline reveal" style={{ fontSize:"clamp(3rem,7vw,5.5rem)",letterSpacing:"-2px",textAlign:"center",marginBottom:"1.5rem" }}>
          Understanding is a <em>right</em>,<br/>not a privilege
        </h2>
        <p className="body-text reveal" style={{ maxWidth:520,margin:"0 auto 3.5rem",textAlign:"center",fontSize:"1.05rem" }}>
          ClariText is more than an NLP project. It's a belief that every student — regardless of background or prior knowledge — deserves access to the ideas shaping our world.
        </p>
        <div className="reveal" style={{ display:"flex",gap:"1.2rem",justifyContent:"center",flexWrap:"wrap",marginBottom:"4rem" }}>
          <a href="#s-demo" style={{ padding:".9rem 2.4rem",borderRadius:8,background:"linear-gradient(135deg,#7c5cfc,#5c3dfc)",color:"white",textDecoration:"none",fontWeight:600,fontSize:".9rem",letterSpacing:".04em",fontFamily:"'Figtree',sans-serif",boxShadow:"0 4px 30px rgba(124,92,252,.4)",transition:"all .2s",display:"inline-block" }}
            onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 10px 40px rgba(124,92,252,.6)";}}
            onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="0 4px 30px rgba(124,92,252,.4)";}}>
            Begin Reading Clearly ✦
          </a>
          <a href="#s-prelude" style={{ padding:".9rem 2.4rem",borderRadius:8,background:"transparent",color:"var(--text)",textDecoration:"none",fontWeight:500,fontSize:".9rem",border:"1px solid rgba(124,92,252,.3)",fontFamily:"'Figtree',sans-serif",transition:"all .2s",display:"inline-block" }}
            onMouseEnter={e=>{e.currentTarget.style.borderColor="var(--glow)";e.currentTarget.style.color="var(--paper)";}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(124,92,252,.3)";e.currentTarget.style.color="var(--text)";}}>
            Read the Story Again
          </a>
        </div>

        {/* Final manifesto quote */}
        <div className="reveal" style={{ padding:"2rem 2.5rem",background:"rgba(124,92,252,.04)",border:"1px solid rgba(124,92,252,.12)",borderRadius:10 }}>
          <p style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:"1.2rem",fontStyle:"italic",color:"rgba(240,235,224,.5)",lineHeight:1.75 }}>
            "Not a summarizer. Not a paraphraser. A{" "}
            <span style={{ color:"var(--glow)",fontStyle:"normal",fontWeight:600 }}>precision comprehension engine</span>
            {" "}that transforms accessibility without touching meaning."
          </p>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────
   ROOT
───────────────────────────────────────────────────────── */
export default function App() {
  useScrollReveal();
  return (
    <>
      <style>{FONTS + CSS}</style>
      <Cursor/>
      <ProgressBar/>
      <ChapterNav/>
      <NavBar/>
      <main style={{ fontFamily:"'Figtree',sans-serif",color:"var(--text)",background:"var(--void)" }}>
        <Prelude/>
        <Ticker/>
        <TheProblem/>
        <Divider glyph="◆"/>
        <TheVision/>
        <Ticker/>
        <HowItWorks/>
        <Divider glyph="✦"/>
        <Stats/>
        <TheDemo/>
        <Divider glyph="❧"/>
        <Epilogue/>
        <footer>
          <span style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:"1.4rem",fontWeight:700,color:"#f0ebe0" }}>
            Clari<span style={{ color:"#7c5cfc" }}>Text</span>
          </span>
          <span style={{ fontSize:".8rem",color:"var(--muted)",fontFamily:"'Figtree',sans-serif" }}>AI Academic Text Simplification · NLP + ML · v1.0</span>
          <div style={{ display:"flex",gap:"1.8rem" }}>
            {["Docs","GitHub","Contact"].map(l => (
              <a key={l} href="#" style={{ fontSize:".8rem",color:"var(--muted)",textDecoration:"none",transition:"color .2s",fontFamily:"'Figtree',sans-serif" }}
                onMouseEnter={e=>e.currentTarget.style.color="#f0ebe0"} onMouseLeave={e=>e.currentTarget.style.color="var(--muted)"}>{l}</a>
            ))}
          </div>
        </footer>
      </main>
    </>
  );
}
