import { useEffect, useState } from "react";

const css = `
.up-intro{position:fixed;inset:0;z-index:9999;background:radial-gradient(circle at 50% 42%, #ffffff 0%, #eef4ff 55%, #f8fafc 100%);color:#2563eb;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:28px;overflow:hidden}
.up-halo{position:absolute;width:min(520px,90vw);aspect-ratio:1;border-radius:50%;background:radial-gradient(circle,rgba(37,99,235,.16),transparent 62%);opacity:0}
.up-lock{position:relative;display:flex;align-items:center;gap:clamp(12px,2.4vw,26px)}
.up-mark{width:clamp(48px,11vw,96px);height:clamp(48px,11vw,96px);overflow:visible;filter:drop-shadow(0 0 8px rgba(37,99,235,.55))}
.up-line{stroke:currentColor;stroke-linecap:round;stroke-linejoin:round;fill:none;stroke-width:1.4;stroke-dasharray:1;stroke-dashoffset:1;opacity:0}
.up-word{display:flex;margin-right:-.32em;font:600 clamp(22px,5.2vw,44px)/1 Montserrat,Inter,system-ui,sans-serif;letter-spacing:.32em;color:#0f172a}
.up-word span{opacity:0;transform:translateY(10px);filter:blur(6px)}
.up-tag{position:relative;opacity:0;color:#64748b;font:500 clamp(10px,1.6vw,13px) Montserrat,Inter,system-ui,sans-serif;letter-spacing:.4em;text-transform:uppercase}
.up-static{width:var(--w,40px);height:var(--w,40px);filter:none}
.up-static .up-line{stroke-width:5;stroke-dashoffset:0;opacity:1}

.up-intro.run{animation:up-out .6s 5.1s ease forwards}
.run .up-halo{animation:up-halo 1.2s .1s ease forwards}
.run .up-line{animation:up-draw 1.3s .2s cubic-bezier(.65,0,.35,1) forwards,up-bold .7s 1.8s ease forwards}
.run .up-tip{animation:up-draw .35s 1.4s ease forwards,up-bold .7s 1.8s ease forwards}
.run .up-mark{animation:up-glow 1s 1.8s ease forwards}
.run .up-word span{animation:up-rise .6s ease forwards;animation-delay:calc(2.1s + var(--i) * .09s)}
.run .up-tag{animation:up-fade .8s 3.2s ease forwards}

@keyframes up-draw{0%{opacity:1;stroke-dashoffset:1}100%{opacity:1;stroke-dashoffset:0}}
@keyframes up-bold{to{stroke-width:5}}
@keyframes up-glow{to{filter:drop-shadow(0 0 2px rgba(37,99,235,.18)) drop-shadow(0 4px 12px rgba(37,99,235,.25))}}
@keyframes up-halo{0%{opacity:0;transform:scale(.7)}100%{opacity:1;transform:scale(1)}}
@keyframes up-rise{to{opacity:1;transform:none;filter:none}}
@keyframes up-fade{to{opacity:1}}
@keyframes up-out{to{opacity:0}}

/* Dark theme overrides */
[data-theme="dark"] .up-intro{background:radial-gradient(circle at 50% 42%, #0f172a 0%, #060a14 60%, #000 100%);color:#60a5fa}
[data-theme="dark"] .up-word{color:#f8fafc}
[data-theme="dark"] .up-tag{color:#94a3b8}
[data-theme="dark"] .up-halo{background:radial-gradient(circle,rgba(96,165,250,.18),transparent 62%)}
[data-theme="dark"] .up-mark{filter:drop-shadow(0 0 8px rgba(96,165,250,.7))}
[data-theme="dark"] .up-glow{filter:drop-shadow(0 0 2px rgba(96,165,250,.3))}
`;

const P1 = "M16 22V34C16 45 23 52 32 52C41 52 48 45 48 34V12";
const P2 = "M40 20L48 12L56 20";

/* Small static logo mark. Use it in the sidebar, header and favicon.
   Colour comes from the parent's text colour (currentColor). */
export function UpswingMark({ size = 40, className = "" }: { size?: number; className?: string }) {
  return (
    <>
      <style>{css}</style>
      <svg className={`up-mark up-static ${className}`} style={{ "--w": `${size}px` } as React.CSSProperties}
        viewBox="0 0 64 64" fill="none" aria-label="Upswing">
        <path className="up-line" pathLength={1} d={P1} />
        <path className="up-line up-tip" pathLength={1} d={P2} />
      </svg>
    </>
  );
}

/* Full-screen intro. Plays once, then calls onDone. Set loop for a preview. */
export default function UpswingIntro({ onDone, duration = 5800, loop = false }: { onDone?: () => void; duration?: number; loop?: boolean }) {
  const [run, setRun] = useState(false);
  const [n, setN] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      onDone && onDone();
      return;
    }
    setRun(false);
    const r = requestAnimationFrame(() => requestAnimationFrame(() => setRun(true)));
    const t = setTimeout(() => (loop ? setN((x) => x + 1) : onDone && onDone()), duration);
    return () => { cancelAnimationFrame(r); clearTimeout(t); };
  }, [n, onDone, duration, loop]);

  return (
    <>
      <style>{css}</style>
      <div className={`up-intro ${run ? "run" : ""}`} key={n}>
        <div className="up-halo" />
        <div className="up-lock">
          <svg className="up-mark" viewBox="0 0 64 64" fill="none" aria-label="Upswing">
            <path className="up-line" pathLength={1} d={P1} />
            <path className="up-line up-tip" pathLength={1} d={P2} />
          </svg>
          <div className="up-word" aria-label="UPswing">
            {"UPswing".split("").map((c, i) => (
              <span key={i} style={{ "--i": i } as React.CSSProperties}>{c}</span>
            ))}
          </div>
        </div>
        <div className="up-tag">Spot the dip. Fuel the upswing.</div>
      </div>
    </>
  );
}
