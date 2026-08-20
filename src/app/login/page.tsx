'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState, type FormEvent } from 'react';
import { auth } from '@/lib/firebase';
import { useAuth, getAuthErrorMessage } from '@/context/AuthContext';

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
      <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
      <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
      <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
    </svg>
  );
}

function LoginForm() {
  const { login, loginWithGoogle } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/profile';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await login(email, password);
      if (auth.currentUser && !auth.currentUser.emailVerified) {
        router.push(`/verify-email?redirect=${encodeURIComponent(redirect)}`);
      } else {
        router.push(redirect);
      }
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    setError('');
    setIsGoogleSubmitting(true);
    try {
      await loginWithGoogle();
      if (auth.currentUser && !auth.currentUser.emailVerified) {
        router.push(`/verify-email?redirect=${encodeURIComponent(redirect)}`);
      } else {
        router.push(redirect);
      }
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setIsGoogleSubmitting(false);
    }
  };

  return (
    <section className="flex-1 flex items-center justify-center py-16 px-4 bg-white">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold uppercase tracking-tight text-[#1b1b1b] font-['Space_Grotesk',sans-serif] mb-2 text-center">
          Вход
        </h1>
        <p className="text-[#6a7282] text-sm text-center mb-8">
          Войдите, чтобы открыть профиль и другие разделы платформы
        </p>

        {error && (
          <div className="mb-5 rounded-[4px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="email" className="block text-[12px] font-bold uppercase tracking-[1px] text-[#6a7282] mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-[4px] border border-[#d1d5db] px-4 py-3 text-sm text-[#1b1b1b] outline-none focus:border-[#1b1b1b] transition-colors"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="password" className="block text-[12px] font-bold uppercase tracking-[1px] text-[#6a7282]">
                Пароль
              </label>
              <Link href="/forgot-password" className="text-[12px] text-[#6a7282] hover:text-[#1b1b1b] transition-colors">
                Забыли пароль?
              </Link>
            </div>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-[4px] border border-[#d1d5db] px-4 py-3 text-sm text-[#1b1b1b] outline-none focus:border-[#1b1b1b] transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 w-full rounded-[4px] bg-[#6960C5] text-white text-[14px] font-bold uppercase tracking-[1px] py-3 hover:opacity-85 transition-opacity disabled:opacity-50"
          >
            {isSubmitting ? 'Входим...' : 'Войти'}
          </button>
        </form>

        <div className="flex items-center gap-4 my-6">
          <div className="h-px flex-1 bg-[#e5e7eb]" />
          <span className="text-[12px] uppercase tracking-[1px] text-[#6a7282]">или</span>
          <div className="h-px flex-1 bg-[#e5e7eb]" />
        </div>

        <button
          type="button"
          onClick={handleGoogle}
          disabled={isGoogleSubmitting}
          className="w-full flex items-center justify-center gap-3 rounded-[4px] border border-[#6960C5] py-3 text-[14px] font-bold uppercase tracking-[1px] text-[#1b1b1b] hover:bg-[#f5f5f5] transition-colors disabled:opacity-50"
        >
          <GoogleIcon />
          {isGoogleSubmitting ? 'Подключаемся...' : 'Войти через Google'}
        </button>

        <p className="text-center text-sm text-[#6a7282] mt-8">
          Нет аккаунта?{' '}
          <Link href="/register" className="text-[#1b1b1b] font-bold hover:underline">
            Зарегистрироваться
          </Link>
        </p>
      </div>
    </section>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
