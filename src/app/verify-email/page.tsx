'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { useAuth, getAuthErrorMessage } from '@/context/AuthContext';

const RESEND_COOLDOWN_SECONDS = 60;

function VerifyEmailContent() {
  const { user, loading, logout, sendVerificationEmail, refreshUser } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/profile';

  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  // Гостя без сессии отправляем на вход
  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [loading, user, router]);

  // Если email уже подтверждён — сразу пускаем дальше
  useEffect(() => {
    if (!loading && user?.emailVerified) {
      router.replace(redirect);
    }
  }, [loading, user, redirect, router]);

  // Периодически сами проверяем, не подтвердил ли пользователь email в другой вкладке
  useEffect(() => {
    if (!user || user.emailVerified) return;
    const interval = setInterval(async () => {
      const refreshed = await refreshUser();
      if (refreshed?.emailVerified) {
        router.replace(redirect);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [user, refreshUser, redirect, router]);

  // Таймер обратного отсчёта для повторной отправки письма
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleResend = async () => {
    setError('');
    setInfo('');
    setIsSending(true);
    try {
      await sendVerificationEmail();
      setInfo('Письмо отправлено повторно. Проверьте почту (и папку «Спам»).');
      setCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setIsSending(false);
    }
  };

  const handleCheck = async () => {
    setError('');
    setInfo('');
    setIsChecking(true);
    try {
      const refreshed = await refreshUser();
      if (refreshed?.emailVerified) {
        router.replace(redirect);
      } else {
        setInfo('Email пока не подтверждён. Перейдите по ссылке из письма и попробуйте снова.');
      }
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setIsChecking(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  if (loading || !user || user.emailVerified) {
    return (
      <div className="flex-1 flex items-center justify-center py-24">
        <p className="text-[#6a7282] text-sm uppercase tracking-[1px]">Загрузка...</p>
      </div>
    );
  }

  return (
    <section className="flex-1 flex items-center justify-center py-16 px-4 bg-white">
      <div className="w-full max-w-md text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#f5f5f5] flex items-center justify-center">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1b1b1b" strokeWidth="1.5">
            <path d="M3 7l9 6 9-6" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="3" y="5" width="18" height="14" rx="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <h1 className="text-3xl font-bold uppercase tracking-tight text-[#1b1b1b] font-['Space_Grotesk',sans-serif] mb-3">
          Подтвердите email
        </h1>
        <p className="text-[#6a7282] text-sm mb-8">
          Мы отправили письмо со ссылкой для подтверждения на{' '}
          <b className="text-[#1b1b1b]">{user.email}</b>. Перейдите по ссылке из письма,
          чтобы получить доступ к профилю и остальным разделам платформы.
        </p>

        {error && (
          <div className="mb-5 rounded-[4px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 text-left">
            {error}
          </div>
        )}
        {info && (
          <div className="mb-5 rounded-[4px] border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 text-left">
            {info}
          </div>
        )}

        <div className="flex flex-col gap-3">
          <button
            onClick={handleCheck}
            disabled={isChecking}
            className="w-full rounded-[4px] bg-[#1b1b1b] text-white text-[14px] font-bold uppercase tracking-[1px] py-3 hover:opacity-85 transition-opacity disabled:opacity-50"
          >
            {isChecking ? 'Проверяем...' : 'Я подтвердил(а), проверить'}
          </button>

          <button
            onClick={handleResend}
            disabled={isSending || cooldown > 0}
            className="w-full rounded-[4px] border border-[#d1d5db] py-3 text-[14px] font-bold uppercase tracking-[1px] text-[#1b1b1b] hover:bg-[#f5f5f5] transition-colors disabled:opacity-50"
          >
            {cooldown > 0
              ? `Отправить письмо повторно (${cooldown}с)`
              : isSending
              ? 'Отправляем...'
              : 'Отправить письмо повторно'}
          </button>
        </div>

        <p className="text-sm text-[#6a7282] mt-8">
          Ошиблись при регистрации?{' '}
          <button onClick={handleLogout} className="text-[#1b1b1b] font-bold hover:underline">
            Выйти
          </button>{' '}
          и попробовать снова, или{' '}
          <Link href="/" className="text-[#1b1b1b] font-bold hover:underline">
            вернуться на главную
          </Link>
          .
        </p>
      </div>
    </section>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailContent />
    </Suspense>
  );
}
