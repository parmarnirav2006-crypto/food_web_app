import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth.js';

function VerifyOTP() {
  const navigate = useNavigate();
  const { pendingAuth, verifyOtp, resendOtp, loading, user } = useAuth();
  const [otp, setOtp] = useState('');

  const email = useMemo(() => pendingAuth?.email || user?.email || '', [pendingAuth, user]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await verifyOtp({ email, otp });
    navigate(response.user?.role === 'admin' ? '/admin' : '/restaurants');
  };

  const handleResend = async () => {
    await resendOtp({ email, purpose: pendingAuth?.purpose || 'login' });
  };

  if (!email) {
    return (
      <section className="container-app py-16">
        <div className="mx-auto max-w-lg card p-8 text-center">
          <h1 className="text-3xl font-black">OTP session expired</h1>
          <p className="mt-3 text-slate-500 dark:text-slate-400">Please start again by logging in or registering.</p>
          <div className="mt-6 flex justify-center gap-3">
            <Link to="/login" className="btn-secondary">Login</Link>
            <Link to="/register" className="btn-primary">Register</Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="container-app py-16">
      <div className="mx-auto max-w-lg card p-8">
        <h1 className="text-3xl font-black">Verify your OTP</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Enter the 6-digit code sent to {email}</p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold">OTP code</label>
            <input className="input text-center text-2xl tracking-[0.5em]" value={otp} onChange={(e) => setOtp(e.target.value)} maxLength={6} required />
          </div>
          <button className="btn-primary w-full" disabled={loading} type="submit">
            {loading ? 'Verifying...' : 'Verify & continue'}
          </button>
        </form>
        <button type="button" className="mt-4 text-sm font-semibold text-primary" onClick={handleResend}>
          Resend OTP
        </button>
      </div>
    </section>
  );
}

export default VerifyOTP;
