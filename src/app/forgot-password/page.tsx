'use client';

import Link from 'next/link';
import { useState, type FormEvent } from 'react';
import { useAuth, getAuthErrorMessage } from '@/context/AuthContext';

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await resetPassword(email);
      setIsSent(true);
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="flex-1 flex items-center justify-center py-16 px-4 bg-white">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold uppercase tracking-tight text-[#1b1b1b] font-['Space_Grotesk',sans-serif] mb-2 text-center">
          Забыли пароль?
        </h1>
        <p className="text-[#6a7282] text-sm text-center mb-8">
          Укажите email — мы отправим ссылку для сброса пароля
        </p>

        {isSent ? (
          <div className="rounded-[4px] border border-green-200 bg-green-50 px-4 py-4 text-sm text-green-700 text-center">
            Письмо со ссылкой для сброса пароля отправлено на <b>{email}</b>.
            Проверьте почту (в т.ч. папку «Спам»).
          </div>
        ) : (
          <>
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

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 w-full rounded-[4px] bg-[#6960C5] text-white text-[14px] font-bold uppercase tracking-[1px] py-3 hover:opacity-85 transition-opacity disabled:opacity-50"
              >
                {isSubmitting ? 'Отправляем...' : 'Отправить ссылку'}
              </button>
            </form>
          </>
        )}

        <p className="text-center text-sm text-[#6a7282] mt-8">
          Вспомнили пароль?{' '}
          <Link href="/login" className="text-[#1b1b1b] font-bold hover:underline">
            Войти
          </Link>
        </p>
      </div>
    </section>
  );
}
