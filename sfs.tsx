// import Image from 'next/image';
import { Plus } from 'lucide-react';
import { Unbounded } from 'next/font/google';
import Link from 'next/link';
import PracticeFeatureSlider from './components/card/PracticeFeatureSlider';



// cyrillic-ext обязателен: казахские буквы (ә, ғ, қ, ң, ө, ұ, ү, і, h)
// лежат именно в этом сабсете, обычного 'cyrillic' для них недостаточно.
const unbounded = Unbounded({
  subsets: ['cyrillic', 'cyrillic-ext', 'latin'],
  weight: ['700', '800', '900'],
  display: 'swap',
  variable: '--font-unbounded',
});

export default function Home() {
  return (
    <div className="container ">
      
    <section className="flex flex-col items-center justify-center text-center px-4 pt-[140px] pb-16 md:pt-[140px] md:pb-24 max-w-5xl mx-auto ">
      {/* 1. Верхний бейдж (Pill Badge) */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-gray-200/80 rounded-full shadow-xs mb-8">
        <span className="w-2 h-2 rounded-full bg-[#10B981] shrink-0" />
        
        {/* Иконка шапки выпускника (Graduation Cap) */}
        <svg
          className="w-4 h-4 text-[#5037ED]"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.26 10.147L12 14.6l7.74-4.453M12 4.5l8 4.615v6.27L12 20l-8-4.615v-6.27L12 4.5z"
          />
        </svg>

        <span className="text-xs md:text-sm font-medium text-gray-700 tracking-tight">
          QYZPU — Қазақ ұлттық қыздар педагогикалық университетінің ресми жобасы
        </span>
      </div>

      {/* 2. Главный заголовок (Heading) */}
      <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#0F172A] leading-[1.12] mb-6">
        ҰБТ-ға дайындықтың <br className="hidden sm:inline" />
        <span className="text-[#5037ED] relative inline-block underline decoration-[#5037ED]/30 decoration-4 underline-offset-8">
          интеллектуалды
        </span>{' '}
        AI <br className="hidden sm:inline" />
        платформасы
      </h1>

      {/* 3. Подзаголовок (Subtitle) */}
      <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl leading-relaxed mb-10">
        Жеке дайындық траекториясы, смарт-аналитика және QYZPU оқытушыларының AI-тьютор көмекшісі арқылы 140 баллға ұмтыл.
      </p>

      {/* 4. Кнопки (CTA Buttons) */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
        {/* Кнопка 1 (Primary) */}
        <Link
          href="/testEnt"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#5037ED] hover:bg-[#422bc7] text-white font-semibold text-base rounded-2xl transition-colors shadow-sm"
        >
          <span>Тест тренажерін бастау</span>
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
            />
          </svg>
        </Link>

        {/* Кнопка 2 (Secondary) */}
        <Link
          href="/ai-chat"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-[#0F172A] font-semibold text-base rounded-2xl transition-colors shadow-xs"
        >
          {/* Иконка Мозга / AI */}
          <svg
            className="w-5 h-5 text-[#5037ED]"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.32M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19 14.32M14.25 3.104c.251.023.501.05.75.082M19 14.32a8.001 8.001 0 01-14 0m14 0v1.43c0 1.257-.803 2.357-1.993 2.735l-2.007.639a6.002 6.002 0 01-3.6 0l-2.007-.639A2.872 2.872 0 013 15.75v-1.43"
            />
          </svg>
          <span>Тегін AI Диагностика</span>
        </Link>
      </div>
    </section>
    <PracticeFeatureSlider/>
    
    </div>
  );
}