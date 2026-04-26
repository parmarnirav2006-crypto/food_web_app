import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth.js';

function Register() {
  const navigate = useNavigate();
  const { register, loading } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleSubmit = async (event) => {
    event.preventDefault();
    await register(form);
    navigate('/verify-otp');
  };

  return (
    <section className="container-app py-16">
      <div className="mx-auto max-w-lg card p-8">
        <h1 className="text-3xl font-black">Create your account</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Register with email and secure password. We will verify with OTP.</p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold">Full name</label>
            <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold">Email</label>
            <input className="input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold">Password</label>
            <input className="input" type="password" minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          </div>
          <button className="btn-primary w-full" disabled={loading} type="submit">
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>
        <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
          Already registered? <Link className="font-semibold text-primary" to="/login">Login</Link>
        </p>
      </div>
    </section>
  );
}

export default Register;
