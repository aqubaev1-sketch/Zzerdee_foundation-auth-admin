'use client';

import { useState } from 'react';

export default function PracticeFeatureSlider() {
  const slides = [
    {
      id: 1,
      title: 'Академиялық стандарт',
      description:
        'Университет профессорлары дайындаған ҰБТ 2026 талаптарына сай тестілер мен сараптамалық база.',
      previewTitle: '1.1 Сараптамалық тест базасы',
      goal: 'Профессорлар дайындаған шынайы ҰБТ 2026 тапсырмаларымен дайындалу.',
    },
    {
      id: 2,
      title: 'AI-репетитор 24/7',
      description:
        'Оқушының қатесін лезде талдап, күрделі сұрақтардың шешу жолын қадам-қадаммен түсіндіретін көмекші.',
      previewTitle: '2.1 AI Интерактивті көмекші',
      goal: 'Қателерді лезде талдап, күрделі сұрақтардың шешу жолын қадам-қадаммен меңгеру.',
    },
    {
      id: 3,
      title: 'Грант Болжамы',
      description:
        'Әлсіз тақырыптарды анықтау, апталық прогресс және QYZPU грантына түсу мүмкіндігін болжау.',
      previewTitle: '3.1 Аналитика және Грант статистикасы',
      goal: 'Әлсіз тақырыптарды жою және QYZPU грантына түсу мүмкіндігін арттыру.',
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const currentSlide = slides[currentIndex];

  return (
    <section className="w-full max-w-6xl mx-auto p-4 md:p-6">
      {/* Жоғарғы сипаттама блогы */}
      <div className="mb-8 max-w-3xl">
        <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-2">
          ZERDE ЖОБАСЫ ТУРАЛЫ
        </h3>
        <p className="text-gray-700 text-base md:text-lg leading-relaxed font-medium">
          <strong className="text-gray-900">ZERDE</strong> — Қазақ ұлттық қыздар педагогикалық университетінің (QYZPU) инновациялық цифрлық бастамасы. Жобаның мақсаты — мектеп түлектеріне ҰБТ-ға бейімделген жасанды интеллект көмегімен сапалы, тиімді және дербес дайындалуға қолжетімді мүмкіндік беру.
        </p>
      </div>

      {/* Сыртқы ақ контейнер */}
      <div className="bg-white border border-gray-200/80 rounded-[32px] p-6 sm:p-10 md:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-xs">
        
        {/* СОЛ ЖАҚ БАҒАН: Мәтін + Түймелер */}
        <div className="lg:col-span-5 flex flex-col justify-between h-full space-y-8">
          <div>
            {/* Тақырып */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
              {currentSlide.title}
            </h2>

            {/* Сипаттама */}
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              {currentSlide.description}
            </p>
          </div>

          {/* Ауыстыру батырмалары + Индикатор */}
          <div className="flex items-center gap-4 pt-2">
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                className="w-11 h-11 rounded-full border border-gray-900 flex items-center justify-center text-gray-900 hover:bg-gray-100 transition-colors active:scale-95 cursor-pointer"
                aria-label="Previous slide"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>

              <button
                onClick={handleNext}
                className="w-11 h-11 rounded-full border border-gray-900 flex items-center justify-center text-gray-900 hover:bg-gray-100 transition-colors active:scale-95 cursor-pointer"
                aria-label="Next slide"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </div>

            {/* 3 слайдқа арналған индикатор нүктелері */}
            <div className="flex items-center gap-1.5 ml-2">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2.5 rounded-full transition-all cursor-pointer ${
                    currentIndex === idx ? 'w-6 bg-[#5037ED]' : 'w-2.5 bg-gray-300'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ОҢ ЖАҚ БАҒАН: Интерфейс макеті бар баннер */}
        <div className="lg:col-span-7 relative">
          <div className="w-full h-[360px] sm:h-[420px] rounded-[24px] bg-gradient-to-br from-[#8D82F2] via-[#4A3AFF] to-[#1E0DB3] p-6 sm:p-10 flex items-center justify-center overflow-hidden relative shadow-inner">
            
            {/* Шұғыла фоны */}
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-blue-600/40 rounded-full blur-2xl pointer-events-none" />

            {/* Карточка макеті */}
            <div className="bg-white rounded-[20px] p-5 sm:p-6 shadow-2xl w-full h-full overflow-hidden flex flex-col justify-between transform transition-all duration-300 hover:scale-[1.01]">
              
              {/* Шапка */}
              <div>
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
                  <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                    <span className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center">←</span>
                    <span>QYZPU Zerde</span>
                  </div>
                  <span className="text-xs font-bold text-indigo-600">0{currentIndex + 1} / 03</span>
                </div>

                <h3 className="text-lg sm:text-xl font-extrabold text-gray-900 mb-3">
                  {currentSlide.previewTitle}
                </h3>

                <div className="space-y-2 text-xs sm:text-sm text-gray-600">
                  <p className="font-bold text-gray-800">Мақсаты:</p>
                  <p>{currentSlide.goal}</p>
                </div>
              </div>

              {/* Төменгі индикатор модульдері */}
              <div className="grid grid-cols-3 gap-2 pt-4">
                <div className="h-16 rounded-lg bg-indigo-50 border border-indigo-100 p-2 flex flex-col justify-between text-[10px] text-indigo-900 font-bold">
                  <span>ҰБТ 2026</span>
                  <span className="text-[9px] text-indigo-500 font-normal">Стандарт</span>
                </div>
                <div className="h-16 rounded-lg bg-purple-50 border border-purple-100 p-2 flex flex-col justify-between text-[10px] text-purple-900 font-bold">
                  <span>AI-Репетитор</span>
                  <span className="text-[9px] text-purple-500 font-normal">24/7 белсенді</span>
                </div>
                <div className="h-16 rounded-lg bg-emerald-50 border border-emerald-100 p-2 flex flex-col justify-between text-[10px] text-emerald-900 font-bold">
                  <span>QYZPU Грант</span>
                  <span className="text-[9px] text-emerald-600 font-normal">Болжам</span>
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}