'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import LuxuryButton from '@/components/LuxuryButton';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push('/admin');
      } else {
        setError(data.error || 'Invalid password');
      }
    } catch (err) {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0f0f0f] px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">INVERA</h1>
          <p className="text-[#c6a86b] uppercase tracking-wider text-sm">Admin Access</p>
        </div>

        <div className="bg-black/50 border border-[#c6a86b]/20 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-[#c6a86b] text-sm uppercase tracking-wider mb-2">
                Admin Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-6 py-4 bg-black/50 border border-[#c6a86b]/20 text-white placeholder-white/30 focus:outline-none focus:border-[#c6a86b] transition-colors"
                placeholder="Enter admin password"
              />
            </div>

            {error && (
              <div className="p-4 bg-red-500/20 border border-red-500 text-red-200 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full px-8 py-4 bg-[#c6a86b] text-black font-bold uppercase tracking-wider hover:bg-[#d4b97a] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Verifying...' : 'Login'}
            </button>
          </form>
        </div>

        <p className="text-center text-white/50 text-sm mt-8">
          Authorized access only
        </p>
      </div>
    </main>
  );
}
