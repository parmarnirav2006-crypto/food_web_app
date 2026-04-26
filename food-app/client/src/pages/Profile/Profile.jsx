import { useMemo, useState } from 'react';
import useAuth from '../../hooks/useAuth.js';

function Profile() {
  const { user, updateProfile, loading } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    avatar: user?.avatar || '',
    addresses: user?.addresses?.length
      ? user.addresses
      : [{ label: 'Home', line1: '', line2: '', city: '', state: '', postalCode: '', country: 'India', contactNumber: '', isDefault: true }]
  });

  const defaultAddress = useMemo(() => form.addresses[0], [form.addresses]);

  const updateAddress = (key, value) => {
    const nextAddresses = [...form.addresses];
    nextAddresses[0] = { ...nextAddresses[0], [key]: value };
    setForm({ ...form, addresses: nextAddresses });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await updateProfile(form);
  };

  return (
    <section className="container-app py-12">
      <div className="mx-auto max-w-3xl card p-8">
        <h1 className="text-4xl font-black">Profile</h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400">Update your personal details and default delivery address.</p>
        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold">Name</label>
              <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold">Avatar URL</label>
              <input className="input" value={form.avatar} onChange={(e) => setForm({ ...form, avatar: e.target.value })} />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 p-5 dark:border-slate-700">
            <h2 className="text-xl font-bold">Default address</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <input className="input md:col-span-2" placeholder="Line 1" value={defaultAddress.line1} onChange={(e) => updateAddress('line1', e.target.value)} />
              <input className="input md:col-span-2" placeholder="Line 2" value={defaultAddress.line2} onChange={(e) => updateAddress('line2', e.target.value)} />
              <input className="input" placeholder="City" value={defaultAddress.city} onChange={(e) => updateAddress('city', e.target.value)} />
              <input className="input" placeholder="State" value={defaultAddress.state} onChange={(e) => updateAddress('state', e.target.value)} />
              <input className="input" placeholder="Postal code" value={defaultAddress.postalCode} onChange={(e) => updateAddress('postalCode', e.target.value)} />
              <input className="input" placeholder="Contact number" value={defaultAddress.contactNumber} onChange={(e) => updateAddress('contactNumber', e.target.value)} />
            </div>
          </div>
          <button className="btn-primary" type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save profile'}</button>
        </form>
      </div>
    </section>
  );
}

export default Profile;
