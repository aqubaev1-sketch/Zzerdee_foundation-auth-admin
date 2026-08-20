'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }

    if (!user.emailVerified) {
      router.replace(`/verify-email?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [loading, user, router, pathname]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center py-24">
        <p className="text-[#6a7282] text-sm uppercase tracking-[1px]">Загрузка...</p>
      </div>
    );
  }

  if (!user || !user.emailVerified) {
    // Пока идёт редирект на /login или /verify-email, ничего не показываем
    return (
      <div className="flex-1 flex items-center justify-center py-24">
        <p className="text-[#6a7282] text-sm uppercase tracking-[1px]">Перенаправление...</p>
      </div>
    );
  }

  return <>{children}</>;
}
