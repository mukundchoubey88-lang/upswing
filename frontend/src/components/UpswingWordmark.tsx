const css = `
.uw{display:inline-flex;font-weight:700;letter-spacing:.06em;line-height:1.15}
.uw-up{display:flex;color:#2563eb;margin-right:-.06em}
[data-theme="dark"] .uw-up{color:#60a5fa}
.uw-sw{display:flex;letter-spacing:.02em}
.uw-up>span,.uw-sw>span{display:inline-block}
.uw-up>span{animation:uw-lift 2.4s ease-in-out infinite;animation-delay:calc(var(--i) * .12s)}
.uw-sw>span{transform-origin:50% 0;animation:uw-sway 2.4s ease-in-out infinite;animation-delay:calc(var(--i) * .1s)}
@keyframes uw-lift{0%,100%{transform:translateY(0)}40%{transform:translateY(-6px)}}
@keyframes uw-sway{0%,100%{transform:rotate(-6deg)}50%{transform:rotate(6deg)}}
@media (prefers-reduced-motion:reduce){.uw span{animation:none!important}}
`;

export default function UpswingWordmark({ className = "" }: { className?: string }) {
  return (
    <>
      <style>{css}</style>
      <span className={`uw ${className}`} aria-label="UPswing">
        <span className="uw-up">
          {"UP".split("").map((c, i) => <span key={i} style={{ "--i": i } as React.CSSProperties}>{c}</span>)}
        </span>
        <span className="uw-sw">
          {"swing".split("").map((c, i) => <span key={i} style={{ "--i": i + 2 } as React.CSSProperties}>{c}</span>)}
        </span>
      </span>
    </>
  );
}
