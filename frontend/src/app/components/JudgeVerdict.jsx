export default function JudgeVerdict({ judge }) {
  const { solution_1_score, solution_2_score, solution_1_reasoning, solution_2_reasoning } = judge;
  const winner      = solution_1_score >= solution_2_score ? 1 : 2;
  const winnerModel = winner === 1 ? 'AI Model A' : 'AI Model B';

  const scoreClr = (s) => s >= 9 ? '#4ade80' : '#ffb784';

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(124,58,237,.1) 0%, rgba(76,215,246,.06) 100%)',
        border: '1px solid rgba(76,215,246,.3)',
        boxShadow: '0 0 60px rgba(124,58,237,.15), 0 0 0 1px rgba(76,215,246,.08)',
        animationName: 'winner-reveal',
        animationDuration: '0.7s',
        animationFillMode: 'both',
      }}
    >
      {/* ── Trophy banner ───────────────────────── */}
      <div
        className="flex items-center justify-between gap-4 px-6 py-5 flex-wrap"
        style={{ background: 'rgba(124,58,237,.15)', borderBottom: '1px solid rgba(76,215,246,.15)' }}
      >
        {/* Left: trophy + text */}
        <div className="flex items-center gap-4">
          <span
            className="text-[2rem]"
            style={{ filter: 'drop-shadow(0 0 12px rgba(251,191,36,.5))', animation: 'pulse-dot 2.5s ease infinite' }}
          >
            🏆
          </span>
          <div className="flex flex-col gap-0.5">
            <span className="text-[0.6rem] font-bold tracking-[.15em] uppercase text-outline font-display">
              JUDGE VERDICT
            </span>
            <span className="text-[1.05rem] font-semibold text-on-surface">
              Winner:{' '}
              <strong className="text-secondary">
                Solution {winner} — {winnerModel}
              </strong>
            </span>
          </div>
        </div>

        {/* Right: score pill */}
        <div
          className="flex items-center gap-4 rounded-xl px-5 py-2.5"
          style={{ background: 'rgba(10,10,26,.4)', border: '1px solid rgba(74,68,85,.3)' }}
        >
          <div className="flex flex-col items-center gap-0.5 font-display">
            <span className="text-[0.62rem] font-medium tracking-[.08em] uppercase text-outline">Sol. 1</span>
            <strong className="text-[1.2rem] font-bold" style={{ color: scoreClr(solution_1_score) }}>
              {solution_1_score}/10
            </strong>
          </div>
          <div className="w-px h-9" style={{ background: 'rgba(74,68,85,.4)' }} />
          <div className="flex flex-col items-center gap-0.5 font-display">
            <span className="text-[0.62rem] font-medium tracking-[.08em] uppercase text-outline">Sol. 2</span>
            <strong className="text-[1.2rem] font-bold" style={{ color: scoreClr(solution_2_score) }}>
              {solution_2_score}/10
            </strong>
          </div>
        </div>
      </div>

      {/* ── Reasoning grid ──────────────────────── */}
      <div className="grid grid-cols-2">
        {/* Solution 1 */}
        <div className="p-6" style={{ borderRight: '1px solid rgba(74,68,85,.2)' }}>
          <div className="flex items-center gap-2.5 mb-2.5">
            <span className="text-[0.67rem] font-bold tracking-widest uppercase text-primary font-display">
              Solution 1 Analysis
            </span>
            {winner === 1 && (
              <span className="text-[0.58rem] font-bold tracking-widest uppercase rounded-full px-2 py-0.5 font-display"
                style={{ background: 'rgba(124,58,237,.15)', color: '#d2bbff' }}>
                ✓ Winner
              </span>
            )}
          </div>
          <p className="text-[0.82rem] leading-relaxed text-primary">{solution_1_reasoning}</p>
        </div>

        {/* Solution 2 */}
        <div className="p-6">
          <div className="flex items-center gap-2.5 mb-2.5">
            <span className="text-[0.67rem] font-bold tracking-widest uppercase text-secondary font-display">
              Solution 2 Analysis
            </span>
            {winner === 2 && (
              <span className="text-[0.58rem] font-bold tracking-widest uppercase rounded-full px-2 py-0.5 font-display"
                style={{ background: 'rgba(76,215,246,.15)', color: '#4cd7f6' }}>
                ✓ Winner
              </span>
            )}
          </div>
          <p className="text-[0.82rem] leading-relaxed text-on-muted">{solution_2_reasoning}</p>
        </div>
      </div>
    </div>
  );
}
