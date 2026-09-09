'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, loading, isAdmin, logout } = useAuth();
  const router = useRouter();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const isVerified = !!user && user.emailVerified;

  const handleProfileClick = (e: React.MouseEvent) => {
    closeMenu();
    if (!user) {
      e.preventDefault();
      router.push('/login?redirect=%2Fprofile');
    } else if (!user.emailVerified) {
      e.preventDefault();
      router.push('/verify-email?redirect=%2Fprofile');
    }
  };

  const handleLogout = async () => {
    closeMenu();
    await logout();
    router.push('/');
  };

  const navLinkClass =
    "block w-full text-center p-4 md:p-0 font-['Inter',sans-serif] text-[14px] font-bold uppercase tracking-[1px] text-[#535966] hover:text-[#1f1f1f] transition-colors";

  return (
    <>
      <header className="fixed top-5 left-1/2 -translate-x-1/2 w-[calc(100%-20px)] max-w-[1240px] pl-6 pr-1.5 h-[62px] rounded-[20px] z-50 flex items-center bg-white/60 backdrop-blur-md border border-white/40 shadow-[0_4px_30px_rgba(0,0,0,0.05)] transition-all duration-300">
        <div className="w-full h-full">
          <nav className="grid grid-cols-[auto_1fr_auto] items-center h-full uppercase">
            
            {/* 1. Логотип */}
            <Link href="/" className="inline-flex items-center text-[#252426] font-extrabold text-xl md:text-2xl tracking-tight no-underline pr-8">
              Zerde
            </Link>

            {/* 2. Навигациялық Мәзір  */}
            <div
              className={`
                absolute top-[calc(100%+14px)] left-0 w-full bg-white/95 backdrop-blur-lg rounded-[18px] border border-gray-100 shadow-xl flex flex-col items-center gap-0 overflow-hidden transition-all duration-300 z-50
                md:static md:w-auto md:bg-transparent! md:border-none! md:shadow-none! md:backdrop-blur-none md:flex-row md:justify-center md:overflow-visible
                ${isMenuOpen ? 'max-h-[80vh] opacity-100 visible py-5 md:py-0' : 'max-h-0 opacity-0 invisible md:max-h-none md:opacity-100 md:visible'}
              `}
            >
              <ul className="w-full flex flex-col items-center gap-0 m-0 p-0 list-none md:flex-row md:justify-center md:gap-10">
                {isVerified && (
                  <>
                    <li>
                      <Link href="/ai-chat" className={navLinkClass} onClick={closeMenu}>
                        AI Агент
                      </Link>
                    </li>
                    <li>
                      <Link href="/testEnt" className={navLinkClass} onClick={closeMenu}>
                        Тест
                      </Link>
                    </li>
                  </>
                )}

                {!!user && (
                  <li>
                    <Link href="/profile" className={navLinkClass} onClick={handleProfileClick}>
                      Профиль
                    </Link>
                  </li>
                )}

                {isAdmin && (
                  <li>
                    <Link href="/admin" className={navLinkClass} onClick={closeMenu}>
                      Админ-панель
                    </Link>
                  </li>
                )}
              </ul>

              {/* Мобильдік батырмалар */}
              <div className="flex flex-col items-center gap-[10px] w-full px-6 pt-4 md:hidden">
                {!loading && (
                  user ? (
                    <button
                      onClick={handleLogout}
                      className="w-full max-w-[260px] py-3 text-center text-[14px] font-bold uppercase text-white bg-[#6960C5] rounded-[18px] hover:opacity-90 transition-opacity font-['Inter',sans-serif]"
                    >
                      Выйти
                    </button>
                  ) : (
                    <>
                      <Link href="/login" className="w-full max-w-[260px] py-3 text-center text-[14px] font-bold uppercase text-[#6a7282] rounded-[18px]" onClick={closeMenu}>
                        Войти
                      </Link>
                      <Link href="/register" className="w-full max-w-[260px] py-3 text-center text-[14px] font-bold uppercase text-white bg-[#6960C5] rounded-[18px]" onClick={closeMenu}>
                        Регистрация
                      </Link>
                    </>
                  )
                )}
              </div>
            </div>

            {/* 3. Оң жақтағы батырмалар блогы */}
            <div className="hidden md:flex items-center justify-end gap-2 h-full">
              {!loading && (
                user ? (
                  <div className="flex items-center gap-3 h-full">
                    <span className="text-[14px] font-bold text-[#252426] normal-case">
                      {user.displayName || user.email}
                    </span>
                    <button
                      onClick={handleLogout}
                      className="inline-flex items-center justify-center px-6 h-[calc(100%-12px)] tracking-[1px] text-[14px] font-bold uppercase bg-[#6960C5] text-white rounded-[15px] hover:opacity-90 transition-opacity font-['Inter',sans-serif]"
                    >
                      Выйти
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 h-full">
                    <Link href="/login" className="text-[14px] font-bold uppercase text-[#6a7282] hover:text-[#1f1f1f] px-4 py-2 transition-all">
                      Войти
                    </Link>
                    <Link 
                      href="/register" 
                      className="inline-flex items-center justify-center px-6 h-[calc(100%-12px)] tracking-[1px] text-[14px] font-bold uppercase bg-[#6960C5] text-white rounded-[15px] hover:opacity-90 transition-opacity font-['Inter',sans-serif]"
                    >
                      Регистрация
                    </Link>
                  </div>
                )
              )}
            </div>

            {/* Мобильдік бургер батырмасы */}
            <button
              className="flex md:hidden flex-col gap-[5px] bg-transparent border-none cursor-pointer p-1 absolute right-5 top-1/2 -translate-y-1/2 z-50"
              onClick={toggleMenu}
              aria-label="Открыть меню"
              aria-expanded={isMenuOpen}
            >
              <span className={`w-[25px] h-[2px] bg-[#1b1b1b] transition-all duration-300 ${isMenuOpen ? 'translate-y-[7px] rotate-45' : ''}`}></span>
              <span className={`w-[25px] h-[2px] bg-[#1b1b1b] transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`w-[25px] h-[2px] bg-[#1b1b1b] transition-all duration-300 ${isMenuOpen ? '-translate-y-[7px] -rotate-45' : ''}`}></span>
            </button>
          </nav>
        </div>
      </header>

      {/* Оверлей */}
      <div 
        className={`fixed inset-0 bg-black/35 transition-opacity duration-300 z-40 md:hidden ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={closeMenu}
      ></div>
    </>
  );
}