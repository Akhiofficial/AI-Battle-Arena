import { useState, useRef, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import SolutionCard from './components/SolutionCard';
import JudgeVerdict from './components/JudgeVerdict';

/* ── Sample data shown on first load ──────────────────────────── */
const SAMPLE_DATA = {
  problem: "Write a code for factorial function in js",
  solution_1: "Here's a simple implementation of a factorial function in JavaScript using both **iterative** and **recursive** approaches:\n\n### 1. **Iterative Approach (Using a Loop)**\n```javascript\nfunction factorialIterative(n) {\n    if (n < 0) return NaN;\n    let result = 1;\n    for (let i = 2; i <= n; i++) {\n        result *= i;\n    }\n    return result;\n}\n\nconsole.log(factorialIterative(5)); // Output: 120\n```\n\n### 2. **Recursive Approach**\n```javascript\nfunction factorialRecursive(n) {\n    if (n < 0) return NaN;\n    if (n === 0 || n === 1) return 1;\n    return n * factorialRecursive(n - 1);\n}\n\nconsole.log(factorialRecursive(5)); // Output: 120\n```\n\n### 3. **Using `reduce` (Functional Approach)**\n```javascript\nfunction factorialReduce(n) {\n    if (n < 0) return NaN;\n    return Array.from({ length: n }, (_, i) => i + 1)\n                 .reduce((acc, val) => acc * val, 1);\n}\n\nconsole.log(factorialReduce(5)); // Output: 120\n```\n\n### **Key Notes:**\n- **Factorial of 0** is `1` (`0! = 1`).\n- **Negative numbers** have no factorial (returns `NaN`).\n- **Recursion** can cause a stack overflow for very large `n`.\n- **Iterative approach** is generally safer for large numbers.",
  solution_2: "Certainly! Below is a simple implementation of a factorial function in JavaScript:\n\n### Iterative Approach:\n```javascript\nfunction factorialIterative(n) {\n    if (n < 0) return undefined;\n    let result = 1;\n    for (let i = 1; i <= n; i++) {\n        result *= i;\n    }\n    return result;\n}\n\nconsole.log(factorialIterative(5)); // Output: 120\n```\n\n### Recursive Approach:\n```javascript\nfunction factorialRecursive(n) {\n    if (n < 0) return undefined;\n    if (n === 0 || n === 1) return 1;\n    return n * factorialRecursive(n - 1);\n}\n\nconsole.log(factorialRecursive(5)); // Output: 120\n```\n\n### Explanation:\n- **Iterative Approach**: Uses a loop to multiply numbers from 1 to `n`.\n- **Recursive Approach**: Calls itself until the base case is reached.\n\nBoth functions handle negative numbers by returning `undefined`.\n\nChoose the approach that best fits your needs!",
  judge: {
    solution_1_score: 10,
    solution_2_score: 9,
    solution_1_reasoning: "Solution 1 is exceptionally thorough. It provides three distinct implementations (iterative, recursive, and functional using reduce), correctly identifies edge cases, and includes insightful notes regarding recursion stack limits and BigInt for large numbers.",
    solution_2_reasoning: "Solution 2 is accurate, clean, and provides the most common approaches. It handles negative inputs acceptably, though NaN is typically more appropriate than undefined for numeric operations. Lacks the extra functional approach and large number context.",
  },
};

const TIPS = [
  'Write a binary search in Python',
  'Explain React hooks with examples',
  'SQL query for pagination',
];

export default function App() {
  const [input, setInput]           = useState('');
  const [battleData, setBattleData] = useState(SAMPLE_DATA);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState('');
  const [battles, setBattles]       = useState([]);
  const textareaRef = useRef(null);
  const resultsRef  = useRef(null);

  // Fetch history from backend on mount
  useEffect(() => {
    fetch('/api/battles')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setBattles(data);
          // If no battle is active, show the latest one if it exists
          if (data.length > 0) {
            // setBattleData(data[0]); // Optional: auto-load latest
          }
        }
      })
      .catch(err => console.error("Failed to fetch history:", err));
  }, []);

  /* Auto-resize textarea */
  useEffect(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = 'auto';
    textareaRef.current.style.height =
      Math.min(textareaRef.current.scrollHeight, 160) + 'px';
  }, [input]);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    const problem = input.trim();
    if (!problem) return;
    setLoading(true);
    setError('');
    setBattleData(null);
    setInput('');
    try {
      const res = await fetch('/api/battle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problem }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Battle failed. Please try again.');
      }
      const data = await res.json();
      setBattleData(data);
      // Backend already saved it, let's just prepend to local list
      setBattles((prev) => [data, ...prev].slice(0, 15));
      setTimeout(() => resultsRef.current?.scrollTo({ top: 0, behavior: 'smooth' }), 100);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNewBattle = () => {
    setBattleData(null);
    setError('');
    setTimeout(() => textareaRef.current?.focus(), 50);
  };

  const handleSelectBattle = (battle) => {
    setBattleData(battle);
    setError('');
    setTimeout(() => resultsRef.current?.scrollTo({ top: 0, behavior: 'smooth' }), 100);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleSubmit();
  };

  const winner = battleData
    ? (battleData.judge.solution_1_score >= battleData.judge.solution_2_score ? 1 : 2)
    : null;

  return (
    /*
      Root: full-screen dark shell
      - bg-[#0a0a1a]  → arena background
      - antialiased   → smooth fonts
      - font-[…]      → Manrope body font
    */
    <div
      className="relative flex h-screen w-screen overflow-hidden bg-arena-bg text-on-surface antialiased"
      style={{ fontFamily: 'var(--font-body)' }}
    >
      {/* ── Dot-grid overlay (replaces body::before) ──────── */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(124,58,237,.045) 1px,transparent 1px),' +
            'linear-gradient(90deg,rgba(124,58,237,.045) 1px,transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* Sidebar */}
      <Sidebar 
        onNewBattle={handleNewBattle} 
        onSelectBattle={handleSelectBattle} 
        battles={battles} 
        activeId={battleData?._id}
      />

      {/* ── Main panel ──────────────────────────────────────── */}
      <main className="relative z-10 flex flex-1 flex-col overflow-hidden min-w-0">

        {/* ── Header ────────────────────────────────────────── */}
        <header
          className="flex shrink-0 items-center justify-between gap-4 px-7 py-[18px] z-10"
          style={{
            background:    'rgba(18,18,34,.88)',
            backdropFilter:'blur(14px)',
            borderBottom:  '1px solid rgba(74,68,85,.2)',
          }}
        >
          <div className="flex min-w-0 flex-col gap-0.5">
            {battleData && (
              <span
                className="text-[0.6rem] font-bold tracking-[.15em] uppercase text-primary-c"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                ACTIVE BATTLE
              </span>
            )}
            <h1
              className="max-w-[600px] truncate text-[1.05rem] font-bold text-on-surface"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {battleData ? battleData.problem : 'Start a New Battle'}
            </h1>
          </div>

          {battleData && winner && (
            <div
              className="flex shrink-0 items-center gap-2 rounded-full px-3.5 py-1.5 text-[0.7rem] font-bold tracking-[.08em] text-secondary"
              style={{
                fontFamily: 'var(--font-display)',
                background: 'rgba(76,215,246,.1)',
                border:     '1px solid rgba(76,215,246,.25)',
              }}
            >
              <span
                className="h-1.5 w-1.5 rounded-full bg-secondary"
                style={{ animation: 'pulse-dot 1.5s ease infinite' }}
              />
              Solution {winner} Wins
            </div>
          )}
        </header>

        {/* ── Scrollable results ──────────────────────────────── */}
        <div ref={resultsRef} className="flex flex-1 flex-col gap-5 overflow-y-auto px-7 py-6">

          {/* Empty state */}
          {!battleData && !loading && (
            <div
              className="flex flex-1 flex-col items-center justify-center gap-4 text-center"
              style={{ minHeight: 420, animation: 'fade-in .4s ease' }}
            >
              <span
                className="text-[3.2rem]"
                style={{
                  filter:    'drop-shadow(0 0 22px rgba(124,58,237,.45))',
                  animation: 'pulse-dot 3s ease infinite',
                }}
              >
                ⚔️
              </span>
              <h2
                className="text-[1.75rem] font-bold"
                style={{
                  fontFamily:             'var(--font-display)',
                  background:             'linear-gradient(135deg,#e3e0f8,#d2bbff)',
                  WebkitBackgroundClip:   'text',
                  WebkitTextFillColor:    'transparent',
                  backgroundClip:         'text',
                }}
              >
                Enter the Arena
              </h2>
              <p className="max-w-[420px] text-[0.88rem] leading-relaxed text-on-muted">
                Type a coding problem below and watch two AI models battle it out.<br />
                A judge will score and recommend the best solution.
              </p>
              <div className="mt-2 flex flex-wrap justify-center gap-2.5">
                {TIPS.map((tip) => (
                  <button
                    key={tip}
                    onClick={() => setInput(tip)}
                    className="cursor-pointer rounded-full px-4 py-2 text-[0.76rem] text-primary transition-all duration-200 hover:-translate-y-0.5 hover:brightness-125"
                    style={{
                      background: 'rgba(124,58,237,.12)',
                      border:     '1px solid rgba(124,58,237,.28)',
                    }}
                  >
                    {tip}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Loading state */}
          {loading && (
            <div
              className="flex flex-1 items-center justify-center"
              style={{ minHeight: 420, animation: 'fade-in .3s ease' }}
            >
              <div className="flex flex-col items-center gap-5 text-center">
                {/* Dual spinner */}
                <div className="relative flex h-20 w-20 items-center justify-center">
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{
                      border:          '2px solid transparent',
                      borderTopColor:  '#7c3aed',
                      borderRightColor:'#03b5d3',
                      animation:       'spin-cw 1.2s linear infinite',
                    }}
                  />
                  <div
                    className="absolute inset-3 rounded-full"
                    style={{
                      border:             '2px solid transparent',
                      borderBottomColor:  '#d2bbff',
                      animation:          'spin-ccw .8s linear infinite',
                    }}
                  />
                  <span className="relative z-10 text-[1.8rem]">⚡</span>
                </div>
                <h2
                  className="text-[1.35rem] font-bold text-on-surface"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Battle in Progress
                </h2>
                <p className="text-[0.87rem] text-on-muted">
                  Two AI models are generating solutions…
                </p>
                <div className="mt-1 flex flex-col gap-2.5">
                  {[
                    { color: '#7c3aed', label: 'AI Model A crafting solution' },
                    { color: '#03b5d3', label: 'AI Model B crafting solution' },
                    { color: '#4a4455', label: 'Judge evaluating responses'   },
                  ].map(({ color, label }) => (
                    <div key={label} className="flex items-center gap-2.5 text-[0.82rem] text-on-muted">
                      <span
                        className="h-2 w-2 shrink-0 rounded-full"
                        style={{ background: color, animation: 'pulse-dot 1.5s ease infinite' }}
                      />
                      {label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Error banner */}
          {error && (
            <div
              className="flex items-center gap-2.5 rounded-xl px-4 py-3 text-[0.87rem] text-[#fca5a5]"
              style={{
                background: 'rgba(248,113,113,.1)',
                border:     '1px solid rgba(248,113,113,.3)',
              }}
            >
              <span>⚠️</span>
              <span className="flex-1">{error}</span>
              <button
                onClick={() => setError('')}
                className="cursor-pointer border-none bg-transparent px-1 text-sm text-[#fca5a5] opacity-70 transition-opacity hover:opacity-100"
              >
                ✕
              </button>
            </div>
          )}

          {/* Battle results */}
          {battleData && !loading && (
            <div
              className="flex flex-col gap-5 pb-2"
              style={{ animation: 'slide-up .5s ease' }}
            >
              {/* Problem card */}
              <div
                className="flex items-start gap-3 rounded-xl px-5 py-4"
                style={{
                  background: '#29283a',
                  border:     '1px solid rgba(74,68,85,.25)',
                }}
              >
                <span
                  className="whitespace-nowrap pt-0.5 text-[0.68rem] font-bold uppercase tracking-widest text-outline"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  📋 Problem Statement
                </span>
                <p className="text-[0.88rem] font-medium text-on-surface">{battleData.problem}</p>
              </div>

              {/* Solutions side-by-side */}
              <div className="flex gap-4">
                <SolutionCard
                  index={1}
                  score={battleData.judge.solution_1_score}
                  reasoning={battleData.judge.solution_1_reasoning}
                  content={battleData.solution_1}
                  isWinner={battleData.judge.solution_1_score >= battleData.judge.solution_2_score}
                  delay={0}
                />
                <SolutionCard
                  index={2}
                  score={battleData.judge.solution_2_score}
                  reasoning={battleData.judge.solution_2_reasoning}
                  content={battleData.solution_2}
                  isWinner={battleData.judge.solution_2_score > battleData.judge.solution_1_score}
                  delay={120}
                />
              </div>

              {/* Judge verdict */}
              <JudgeVerdict judge={battleData.judge} />
            </div>
          )}
        </div>

        {/* ── Chat input footer ────────────────────────────── */}
        <div
          className="shrink-0 px-7 pb-5 pt-4"
          style={{
            background:    'rgba(18,18,34,.92)',
            backdropFilter:'blur(16px)',
            borderTop:     '1px solid rgba(74,68,85,.2)',
          }}
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <div className="flex items-end gap-3">
              <textarea
                id="battle-input"
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading}
                rows={1}
                placeholder="Type a coding problem or question… (Ctrl+Enter to send)"
                className="min-h-[52px] max-h-[160px] flex-1 resize-none rounded-xl px-[18px] py-[14px] text-[0.9rem] leading-relaxed text-on-surface outline-none transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50"
                style={{
                  fontFamily:  'var(--font-body)',
                  background:  '#1a1a2b',
                  border:      '1px solid rgba(74,68,85,.38)',
                  caretColor:  '#7c3aed',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#7c3aed';
                  e.target.style.boxShadow   = '0 0 0 3px rgba(124,58,237,.18),0 0 20px rgba(124,58,237,.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(74,68,85,.38)';
                  e.target.style.boxShadow   = 'none';
                }}
              />

              <button
                id="start-battle-btn"
                type="submit"
                disabled={loading || !input.trim()}
                className="flex h-[52px] shrink-0 cursor-pointer items-center gap-2 whitespace-nowrap rounded-xl border-none px-5 text-[0.82rem] font-bold tracking-[.06em] text-white transition-all duration-200 hover:not-disabled:opacity-90 hover:not-disabled:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40"
                style={{
                  fontFamily: 'var(--font-display)',
                  background: 'linear-gradient(135deg,#d2bbff,#7c3aed)',
                  boxShadow:  '0 4px 20px rgba(124,58,237,.38)',
                }}
              >
                {loading ? (
                  <span
                    className="h-4 w-4 shrink-0 rounded-full"
                    style={{
                      border:         '2px solid rgba(255,255,255,.3)',
                      borderTopColor: '#fff',
                      animation:      'spin-cw .7s linear infinite',
                    }}
                  />
                ) : (
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                )}
                {loading ? 'Fighting…' : 'Start Battle'}
              </button>
            </div>

            <p className="text-center text-[0.68rem] tracking-[.02em] text-outline">
              Ctrl+Enter to send &nbsp;·&nbsp; Two AI models will battle &nbsp;·&nbsp; Judge picks the winner
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}
