const SAMPLE_HISTORY = [
  { id: 1, title: 'Factorial Function in JS',    time: 'Just now' },
  { id: 2, title: 'Binary Search Algorithm',     time: '2h ago'   },
  { id: 3, title: 'React useEffect Hooks',        time: 'Yesterday' },
  { id: 4, title: 'SQL JOIN Optimization',        time: '2d ago'   },
];

export default function Sidebar({ onNewBattle, onSelectBattle, battles, activeId }) {
  const history = battles.length > 0
    ? battles.map((b) => ({ 
        id: b._id, 
        title: b.problem, 
        time: new Date(b.createdAt).toLocaleDateString() === new Date().toLocaleDateString() ? 'Today' : 'Past',
        data: b
      }))
    : SAMPLE_HISTORY;

  return (
    <aside
      className="flex flex-col gap-5 w-[268px] min-w-[268px] h-full overflow-hidden px-4 py-6 relative z-10"
      style={{ background: '#1a1a2b', borderRight: '1px solid rgba(74,68,85,.2)' }}
    >
      {/* ── Logo ─────────────────────────────── */}
      <div className="flex items-center gap-2.5 pb-4" style={{ borderBottom: '1px solid rgba(74,68,85,.15)' }}>
        <div
          className="w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0"
          style={{
            background: 'linear-gradient(135deg, #7c3aed, #4c1d95)',
            boxShadow: '0 0 20px rgba(124,58,237,.4)',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="url(#lg)" />
            <defs>
              <linearGradient id="lg" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#d2bbff" />
                <stop offset="100%" stopColor="#7c3aed" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div>
          <p className="text-[0.95rem] font-bold text-on-surface leading-tight font-display">
            AI Battle
          </p>
          <p className="text-[0.62rem] font-medium tracking-[.12em] uppercase text-primary font-display">
            Arena
          </p>
        </div>
      </div>

      {/* ── New Battle CTA ───────────────────── */}
      <button
        id="new-battle-btn"
        onClick={onNewBattle}
        className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl border-none text-white text-[0.78rem] font-bold tracking-[.08em] uppercase cursor-pointer transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5 active:translate-y-0 font-display"
        style={{
          background: 'linear-gradient(135deg, #d2bbff, #7c3aed)',
          boxShadow: '0 4px 20px rgba(124,58,237,.38)',
        }}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        New Battle
      </button>

      {/* ── History ──────────────────────────── */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <p className="text-[0.6rem] font-bold tracking-[.14em] uppercase text-outline mb-2.5 font-display">
          Battle History
        </p>
        <div className="flex flex-col gap-0.5 overflow-y-auto flex-1">
          {history.map((b, idx) => (
            <div
              key={b.id || idx}
              onClick={() => onSelectBattle && b.data && onSelectBattle(b.data)}
              className={`flex items-start gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer transition-colors duration-150 ${
                activeId === b.id ? 'bg-[rgba(124,58,237,.2)]' : 'hover:bg-[rgba(124,58,237,.1)]'
              }`}
            >
              <span
                className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                style={{
                  background: activeId === b.id ? '#7c3aed' : '#4a4455',
                  boxShadow: activeId === b.id ? '0 0 8px rgba(124,58,237,.6)' : 'none',
                }}
              />
              <div className="flex-1 min-w-0">
                <p
                  className="text-[0.82rem] font-medium truncate"
                  style={{ color: activeId === b.id ? '#e3e0f8' : '#ccc3d8' }}
                >
                  {b.title}
                </p>
                {b.time && (
                  <p className="text-[0.68rem] text-outline mt-0.5">{b.time}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── User footer ──────────────────────── */}
      <div className="flex items-center gap-2.5 rounded-xl px-2.5 py-3" style={{ background: '#333345' }}>
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-primary"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #4c1d95)' }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
          </svg>
        </div>
        <div>
          <p className="text-[0.83rem] font-semibold text-on-surface">Dev User</p>
          <p className="text-[0.66rem] text-primary-c">Pro Plan</p>
        </div>
      </div>
    </aside>
  );
}
