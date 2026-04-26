import { useAuthStore } from '../store/authStore.js';

export const useAuth = () => {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const loading = useAuthStore((state) => state.loading);
  const pendingAuth = useAuthStore((state) => state.pendingAuth);
  const register = useAuthStore((state) => state.register);
  const requestLoginOtp = useAuthStore((state) => state.requestLoginOtp);
  const verifyOtp = useAuthStore((state) => state.verifyOtp);
  const resendOtp = useAuthStore((state) => state.resendOtp);
  const logout = useAuthStore((state) => state.logout);
  const updateProfile = useAuthStore((state) => state.updateProfile);

  return { user, token, loading, pendingAuth, register, requestLoginOtp, verifyOtp, resendOtp, logout, updateProfile };
};

export default useAuth;
