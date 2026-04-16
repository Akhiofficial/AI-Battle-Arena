import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(username, email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-arena-bg px-4 relative overflow-hidden">
      {/* Background Decor */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(124,58,237,.06) 1px,transparent 1px),' +
            'linear-gradient(90deg,rgba(124,58,237,.06) 1px,transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
      
      <div className="relative z-10 w-full max-w-md animate-[slide-up_0.6s_ease-out]">
        <div className="mb-8 text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary/20 text-3xl shadow-[0_0_30px_rgba(76,215,246,0.3)] mb-4">
            🛡️
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-on-surface font-display">
             Join the Arena
          </h2>
          <p className="mt-2 text-on-muted">Create an account to track your AI battles</p>
        </div>

        <div className="rounded-3xl border border-outline-dim bg-surface/80 p-8 backdrop-blur-xl shadow-2xl">
          {error && (
            <div className="mb-6 flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
               <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-outline font-display">
                Username
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-xl border border-outline-dim bg-surface-low px-4 py-3 text-on-surface outline-none transition-all focus:border-secondary focus:ring-4 focus:ring-secondary/10"
                placeholder="arena_master"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-outline font-display">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-outline-dim bg-surface-low px-4 py-3 text-on-surface outline-none transition-all focus:border-secondary focus:ring-4 focus:ring-secondary/10"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-outline font-display">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-outline-dim bg-surface-low px-4 py-3 text-on-surface outline-none transition-all focus:border-secondary focus:ring-4 focus:ring-secondary/10"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full overflow-hidden rounded-xl bg-primary-c py-4 font-bold text-white transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 font-display"
              style={{ boxShadow: '0 8px 30px rgba(124,58,237,0.4)' }}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                ) : 'Become a Challenger'}
              </span>
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-on-muted">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-secondary hover:underline decoration-2 underline-offset-4">
              Sign In here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
