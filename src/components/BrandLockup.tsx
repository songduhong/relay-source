export function BrandLockup() {
  return (
    <>
      <span className="logo-mark" aria-hidden="true">
        <svg viewBox="0 0 64 64" focusable="false">
          <rect x="1" y="1" width="62" height="62" rx="16" fill="#0C2238" />
          <rect x="1.75" y="1.75" width="60.5" height="60.5" rx="15.25" fill="none" stroke="#294865" strokeWidth="1.5" />
          <path d="M35 15H25C19.48 15 15 19.48 15 25V35" fill="none" stroke="#F8F6F1" strokeWidth="4" strokeLinecap="round" />
          <path d="M29 49H39C44.52 49 49 44.52 49 39V29" fill="none" stroke="#67C6BA" strokeWidth="4" strokeLinecap="round" />
          <path d="M32 26L38 32L32 38L26 32Z" fill="#F8F6F1" />
        </svg>
      </span>
      <span className="brand-name">Sourcing<span className="brand-accent">Relay</span></span>
    </>
  );
}
