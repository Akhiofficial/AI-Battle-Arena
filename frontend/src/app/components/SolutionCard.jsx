import MarkdownViewer from './MarkdownViewer';

function scoreColor(score) {
  if (score >= 9) return { text: '#4ade80', border: '#4ade80' };
  if (score >= 7) return { text: '#4cd7f6', border: '#4cd7f6' };
  if (score >= 5) return { text: '#ffb784', border: '#ffb784' };
  return { text: '#f87171', border: '#f87171' };
}

export default function SolutionCard({ index, score, reasoning, content, isWinner, delay = 0 }) {
  const label  = index === 1 ? 'AI Model A' : 'AI Model B';
  const accent = index === 1 ? '#7c3aed' : '#03b5d3';
  const clr    = scoreColor(score);

  return (
    <div
      className="flex flex-col flex-1 min-w-0 rounded-xl overflow-hidden transition-transform duration-200 hover:-translate-y-0.5"
      style={{
        animationName: 'slide-up',
        animationDuration: '0.5s',
        animationFillMode: 'both',
        animationDelay: `${delay}ms`,
        background: '#1e1e2f',
        border: isWinner
          ? '1px solid rgba(76,215,246,.45)'
          : '1px solid rgba(74,68,85,.2)',
        boxShadow: isWinner
          ? '0 0 40px rgba(76,215,246,.12), inset 0 0 40px rgba(76,215,246,.04)'
          : '0 8px 32px rgba(0,0,0,.3)',
      }}
    >
      {/* ── Header ───────────────────────────────── */}
      <div className="flex items-center gap-3 px-5 py-4 flex-wrap" style={{ background: '#333345' }}>
        {/* Title block */}
        <div className="flex flex-col gap-0.5 flex-1">
          <span
            className="text-[0.62rem] font-bold tracking-widest uppercase font-display"
            style={{ color: accent }}
          >
            Solution {index}
          </span>
          <span className="text-[0.95rem] font-bold text-on-surface font-display">
            {label}
          </span>
        </div>

        {/* Score badge */}
        <div
          className="flex items-baseline gap-px rounded-lg px-3 py-1 border-[1.5px]"
          style={{
            color: clr.text,
            borderColor: clr.border,
            animationName: 'score-pop',
            animationDuration: '0.6s',
            animationFillMode: 'both',
            animationDelay: `${delay + 300}ms`,
          }}
        >
          <span className="text-[1.4rem] font-bold leading-none font-display">
            {score}
          </span>
          <span className="text-[0.72rem] font-medium opacity-70 font-display">
            /10
          </span>
        </div>

        {/* Winner chip */}
        {isWinner && (
          <span className="flex items-center gap-1.5 text-[0.62rem] font-bold tracking-[.12em] uppercase text-secondary bg-[rgba(76,215,246,.1)] rounded-full px-2.5 py-1 font-display">
            <span
              className="w-1.5 h-1.5 rounded-full bg-secondary"
              style={{ animation: 'pulse-dot 1.5s ease infinite' }}
            />
            WINNER
          </span>
        )}
      </div>

      {/* ── Body (scrollable markdown) ─────────────── */}
      <div className="flex-1 overflow-hidden px-5">
        <div className="h-[340px] overflow-y-auto py-4 pr-1">
          <MarkdownViewer content={content} />
        </div>
      </div>

      {/* ── Reasoning footer ─────────────────────── */}
      <div
        className="px-5 py-3.5 border-t"
        style={{ background: 'rgba(10,10,26,.4)', borderColor: 'rgba(74,68,85,.15)' }}
      >
        <p className="text-[0.62rem] font-bold tracking-widest uppercase text-outline mb-1.5 font-display">
          Judge's Reasoning
        </p>
        <p className="text-[0.8rem] leading-relaxed text-on-muted">{reasoning}</p>
      </div>
    </div>
  );
}
