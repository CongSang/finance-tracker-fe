'use client'

import { Footer } from "@/components/Footer"
import { Input } from "@/components/Input"
import { PiggyBank, Wallet } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/context/AuthContext"
import { Suspense, useEffect, useState } from "react"
import { loginApi } from "@/services/index"
import { toastError, validateEmail, validatePassword } from "@/lib/index"
import { useRouter, useSearchParams } from "next/navigation"
import toast from "react-hot-toast"

const LoginHandle = () => {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!validateEmail(email)) {
        toast.error('Vui lòng nhập email hợp lệ.');
        return;
    }

    if (!validatePassword(password)) {
        toast.error('Mật khẩu phải có ít nhất 8 ký tự, bao gồm ít nhất một chữ cái và một số.');
        return;
    }

    setIsLoading(true);
    try {
      const data = await loginApi({ email, password });
      login(data);
      router.push('/');
    } catch (error: unknown) {
      console.error('Login failed', error);
      toastError(error, 'Login failed. Please check your credentials and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginWithGoogle = () => {
    router.push(`${process.env.NEXT_PUBLIC_API_BASE_URL}/oauth2/authorization/google`);
  }

  useEffect(() => {
    if (error === 'oauth2_cancelled') {
      toast.error('Bạn đã hủy đăng nhập bằng Google.');
      router.replace('/login');
    } else if (error === 'oauth2_failed') {
      toast.error('Đăng nhập Google thất bại. Vui lòng thử lại.');
      router.replace('/login');
    }

  }, [error, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center pt-12 px-4 font-sans">
      {/* Header Logo */}
      <div className="flex items-center gap-2 mb-8">
        <div className="bg-primary p-1.5 rounded-md">
          <Wallet size={18} className="text-white" />
        </div>
        <span className="text-xl font-bold tracking-tight text-primary">Finance Tracker</span>
      </div>

      <div
        className="w-full max-w-125 bg-white rounded-3xl shadow-md p-8 md:p-10"
      >
        <div className="flex flex-col items-center text-center">
          {/* Piggy Bank Icon */}
          <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-4">
            <PiggyBank size={32} className="text-primary" />
          </div>

          <h2 className="mb-2">Finance Tracker</h2>
          <p className="mb-6">Chào mừng bạn quay lại! Vui lòng đăng nhập.</p>

          {/* Form */}
          <form className="w-full space-y-4 text-left">
            <Input
              disabled={loading}
              value={email}
              label="Email Address" 
              placeholder="name@company.com" 
              type="email" 
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input 
              disabled={loading}
              value={password}
              label="Password" 
              placeholder="••••••••" 
              type="password" 
              onChange={(e) => setPassword(e.target.value)}
            />

            <button 
              type="button"
              disabled={loading}
              onClick={handleLogin}
              className="w-full btn-primary mt-4"
            >
              Sign In
            </button>
          </form>

          {/* Separator */}
          <div className="relative my-4 w-full">
            <div className="absolute inset-0 w-full flex items-center">
              <div className="w-full border-t border-gray-500 z-1"></div>
            </div>
            <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-widest z-2">
              <span className="bg-white px-4 text-[#3f627c]">or sign in with</span>
            </div>
          </div>

          {/* Social Provider */}
          <button 
            type="button"
            disabled={loading} 
            onClick={handleLoginWithGoogle}
            className="w-full text-sm max-sm:text-xs flex items-center justify-center gap-3 py-3 px-4 bg-white border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-primary shadow active:scale-[0.98]"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </button>

          <div className="mt-6 text-center">
            <p className="text-[#6B7280] opacity-80 text-sm">
              Don&apos;t have an account? <Link href="/register" className="font-bold text-primary hover:underline underline-offset-4 transition-colors">Sign Up</Link>
            </p>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  )
}

export default function Login() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Đang tải...</div>}>
      <LoginHandle />
    </Suspense>
  );
}
