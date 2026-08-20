'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function VerifyBanner() {
  const { user, loading } = useAuth();
  const pathname = usePathname();

  if (loading || !user || user.emailVerified) return null;
  if (pathname === '/verify-email') return null;

  return (
    <div className="bg-[#1b1b1b] text-white text-center text-sm px-4 py-3">
      Подтвердите email, чтобы получить полный доступ к платформе.{' '}
      <Link
        href={`/verify-email?redirect=${encodeURIComponent(pathname)}`}
        className="font-bold underline hover:opacity-80"
      >
        Подтвердить сейчас
      </Link>
    </div>
  );
}
