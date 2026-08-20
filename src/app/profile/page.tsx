'use client';

import ProtectedRoute from '../components/protected-route/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

function ProfileContent() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const initial = (user?.displayName || user?.email || '?').charAt(0).toUpperCase();

  return (
    <section className="flex-1 py-32 px-4 bg-#F1F2F4 ">
      <div className="container max-w-2xl">
        <div className="flex items-center gap-5 mb-10">
          <div className="w-16 h-16 rounded-full bg-[#1b1b1b] text-white flex items-center justify-center text-2xl font-bold uppercase font-['Space_Grotesk',sans-serif]">
            {initial}
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold uppercase tracking-tight text-[#1b1b1b] font-['Space_Grotesk',sans-serif]">
              {user?.displayName || 'Без имени'}
            </h1>
            <p className="text-[#6a7282] text-sm">{user?.email}</p>
          </div>
        </div>

        <div className="rounded-[12px] border border-[#d1d5db] divide-y divide-[#e5e7eb] mb-10">
          <div className="flex items-center justify-between px-5 py-4">
            <span className="text-[12px] font-bold uppercase tracking-[1px] text-[#6a7282]">Email</span>
            <span className="text-sm text-[#1b1b1b]">{user?.email}</span>
          </div>
          <div className="flex items-center justify-between px-5 py-4">
            <span className="text-[12px] font-bold uppercase tracking-[1px] text-[#6a7282]">Email подтверждён</span>
            <span className="text-sm text-[#1b1b1b]">{user?.emailVerified ? 'Да' : 'Нет'}</span>
          </div>
          <div className="flex items-center justify-between px-5 py-4">
            <span className="text-[12px] font-bold uppercase tracking-[1px] text-[#6a7282]">ID пользователя</span>
            <span className="text-sm text-[#1b1b1b] truncate max-w-[220px]">{user?.uid}</span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="rounded-[12px] border border-[#1b1b1b] px-6 py-3 text-[14px] font-bold uppercase tracking-[1px] text-[#1b1b1b] hover:bg-[#1b1b1b] hover:text-white transition-colors"
        >
          Выйти из аккаунта
        </button>
      </div>
    </section>
  );
}

export default function Profile() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}
