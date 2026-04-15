import { useState, useRef, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import SolutionCard from '../components/SolutionCard';
import JudgeVerdict from '../components/JudgeVerdict';
import axios from 'axios';


const TIPS = [
  'Write a binary search in Python',
  'Explain React hooks with examples',
  'SQL query for pagination',
];

export default function Dashboard() {
  const [input, setInput]           = useState('');
  const [battleData, setBattleData] = useState(null);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState('');
  const [battles, setBattles]       = useState([]);
  const textareaRef = useRef(null);
  const resultsRef  = useRef(null);


  

  // axios get history from backend on mount
  useEffect(() => {
    axios.get('http://localhost:3000/api/battles')
      .then(res => {
        const data = res.data;
        if (Array.isArray(data)) {
          setBattles(data);
          // If no battle is active, show the latest one if it exists
          if (data.length > 0 && !battleData) {
            setBattleData(data[0]);
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
    const currentBattleId = battleData?._id;
    // Don't clear battleData if we are continuing a battle
    if (!currentBattleId) setBattleData(null);
    setInput('');
    try {
      const response = await axios.post('http://localhost:3000/api/battle', {
        problem,
        battleId: currentBattleId
      });
      
      const data = response.data;
      setBattleData(data);
      
      // Update sidebar history
      setBattles((prev) => {
        const index = prev.findIndex(b => b._id === data._id);
        if (index > -1) {
          const updated = [...prev];
          updated[index] = data;
          return updated;
        }
        return [data, ...prev].slice(0, 15);
      });
      
      // Auto-scroll to bottom
      setTimeout(() => resultsRef.current?.scrollTo({ 
        top: resultsRef.current.scrollHeight, 
        behavior: 'smooth' 
      }), 100);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Battle failed. Please try again.');
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

  return (
    <div
      className="relative flex h-screen w-screen overflow-hidden bg-arena-bg text-on-surface antialiased"
      style={{ fontFamily: 'var(--font-body)' }}
    >
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(124,58,237,.045) 1px,transparent 1px),' +
            'linear-gradient(90deg,rgba(124,58,237,.045) 1px,transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <Sidebar 
        onNewBattle={handleNewBattle} 
        onSelectBattle={handleSelectBattle} 
        battles={battles} 
        activeId={battleData?._id}
      />

      <main className="relative z-10 flex flex-1 flex-col overflow-hidden min-w-0">
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
              {battleData ? (battleData.problem || 'Active Battle') : 'Start a New Battle'}
            </h1>
          </div>
        </header>

        <div ref={resultsRef} className="flex flex-1 flex-col gap-10 overflow-y-auto px-7 py-6">

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

          {/* Render Turns */}
          {battleData && (battleData.turns || []).map((turn, turnIndex) => (
            <div
              key={turnIndex}
              className="flex flex-col gap-5 pb-10 mb-5 border-b border-outline/10 last:border-0"
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
                <div className="flex flex-col gap-1">
                  <span
                    className="whitespace-nowrap pt-0.5 text-[0.62rem] font-bold uppercase tracking-widest text-primary-c"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    TURN {turnIndex + 1}
                  </span>
                  <span
                    className="whitespace-nowrap text-[0.68rem] font-bold uppercase tracking-widest text-outline"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    📋 Problem
                  </span>
                </div>
                <p className="text-[0.88rem] font-medium text-on-surface">{turn.problem}</p>
              </div>

              <div className="flex gap-4">
                <SolutionCard
                  index={1}
                  score={turn.judge.solution_1_score}
                  reasoning={turn.judge.solution_1_reasoning}
                  content={turn.solution_1}
                  isWinner={turn.judge.solution_1_score >= turn.judge.solution_2_score}
                  delay={0}
                />
                <SolutionCard
                  index={2}
                  score={turn.judge.solution_2_score}
                  reasoning={turn.judge.solution_2_reasoning}
                  content={turn.solution_2}
                  isWinner={turn.judge.solution_2_score > turn.judge.solution_1_score}
                  delay={120}
                />
              </div>

              <JudgeVerdict judge={turn.judge} />
            </div>
          ))}

          {/* Loading state for the NEXT turn */}
          {loading && (
            <div
              className="flex flex-col items-center justify-center py-10"
              style={{ animation: 'fade-in .3s ease' }}
            >
              <div className="flex flex-col items-center gap-5 text-center">
                <div className="relative flex h-14 w-14 items-center justify-center">
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{
                      border:          '2px solid transparent',
                      borderTopColor:  '#7c3aed',
                      borderRightColor:'#03b5d3',
                      animation:       'spin-cw 1.2s linear infinite',
                    }}
                  />
                  <span className="relative z-10 text-[1.2rem]">⚡</span>
                </div>
                <h2 className="text-[1.1rem] font-bold text-on-surface">Thinking...</h2>
              </div>
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
