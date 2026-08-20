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
    <div style={{
    backgroundColor: 'hsla(193, 0%, 100%, 1)',
    backgroundImage: `
      radial-gradient(at 100% 10%, hsla(214, 54%, 60%, 0.78) 0px, transparent 50%),
      radial-gradient(at 0% 27%, hsla(240, 89%, 75%, 0.57) 0px, transparent 30%)
    `
  }}>
    <div className="container ">
      
    <section className="relative min-h-screen w-full  flex flex-col items-center justify-between px-4 pt-32 pb-16 overflow-hidden select-none">
      
      {/* 1. Жоғарғы басты ақпарат өрісі */}
      <div className="flex flex-col items-center text-center max-w-3xl z-10">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-gray-200/80 shadow-sm mb-6">
          <svg className="w-3.5 h-3.5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span className="text-xs font-semibold tracking-wide text-gray-800 uppercase">
            10M+ TASKS AUTOMATED EVERY MONTH
          </span>
        </div>

        {/* Title */}
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight leading-[1.1] mb-6">
          Your AI workforce for <br />
          every workflow
        </h1>

        {/* Subtitle */}
        <p className="text-base md:text-lg text-gray-600 max-w-2xl font-normal leading-relaxed mb-8">
          Connect apps, automate work, and let AI manage processes from customer requests to operations all in one workspace.
        </p>

        {/* Call to Action Buttons */}
        <div className="flex items-center gap-3">
          <button className="px-6 py-3 rounded-xl bg-black text-white font-medium text-sm hover:bg-gray-800 transition-colors flex items-center gap-2">
            Start Free Trial
            <span>&rarr;</span>
          </button>
          <button className="px-6 py-3 rounded-xl bg-white border border-gray-200 text-gray-800 font-medium text-sm hover:bg-gray-50 transition-colors shadow-sm">
            Book a Demo
          </button>
        </div>
      </div>

      {/* 2. Интерактивті Орбита / Графикалық элементтер */}
      <div className="relative w-full max-w-5xl h-[280px] my-8 flex items-center justify-center">
        {/* Доғалық сызықтар (SVG Curves) */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 300" fill="none">
          <path
            d="M 50 280 Q 500 50 950 280"
            stroke="#E2E8F0"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
          <path
            d="M 150 280 Q 500 110 850 280"
            stroke="#93C5FD"
            strokeWidth="1.5"
            opacity="0.6"
          />
        </svg>

        {/* Анимациялық/Интерактивті Нодалар (Icons & Badges) */}
        
        {/* Gmail Synced */}
        <div className="absolute left-[8%] bottom-[35%] flex items-center gap-2 px-3 py-1.5 bg-white rounded-xl border border-gray-200/80 shadow-md text-xs font-medium text-gray-700">
          <span className="text-gray-400">✉</span> Gmail Synced
        </div>

        {/* Checkmark 1 */}
        <div className="absolute left-[29%] top-[30%] w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-md text-emerald-500 font-bold text-xs">
          ✓
        </div>

        {/* AI Processing */}
        <div className="absolute left-[24%] bottom-[25%] flex items-center gap-2 px-3 py-1.5 bg-white rounded-xl border border-gray-200/80 shadow-md text-xs font-medium text-gray-700">
          <span className="text-purple-500">✦</span> AI Processing
        </div>

        {/* Workflow Running */}
        <div className="absolute left-[42%] top-[12%] flex items-center gap-2 px-3.5 py-1.5 bg-white rounded-xl border border-gray-200/80 shadow-md text-xs font-medium text-gray-700">
          <span className="animate-spin text-gray-400">⚙</span> Workflow Running
        </div>

        {/* Орталық Логотип (Central Icon) */}
        <div className="absolute left-[48%] top-[45%] -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-2xl bg-white border border-gray-200 shadow-xl flex items-center justify-center text-orange-600 font-bold text-2xl">
          ✱
        </div>

        {/* Meeting Scheduled */}
        <div className="absolute right-[21%] top-[25%] flex items-center gap-2 px-3.5 py-1.5 bg-white rounded-xl border border-gray-200/80 shadow-md text-xs font-medium text-gray-700">
          <span className="text-indigo-500">✦</span> Meeting Scheduled
        </div>

        {/* Checkmark 2 */}
        <div className="absolute right-[29%] bottom-[25%] w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-md text-emerald-500 font-bold text-xs">
          ✓
        </div>

        {/* Slack Logo */}
        <div className="absolute right-[12%] bottom-[32%] w-11 h-11 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-md">
          <span className="text-xl">#</span>
        </div>
      </div>

      {/* 3. Төменгі статистикалық блоктар (Stats) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl text-center z-10 pt-4">
        <div>
          <div className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-2">
            15M+
          </div>
          <p className="text-xs font-medium text-gray-500 leading-snug">
            Tasks Automated <br /> Every Month
          </p>
        </div>

        <div>
          <div className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-2">
            96%
          </div>
          <p className="text-xs font-medium text-gray-500 leading-snug">
            Reduction in Manual <br /> Work
          </p>
        </div>

        <div>
          <div className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-2">
            4.8×
          </div>
          <p className="text-xs font-medium text-gray-500 leading-snug">
            Average Team <br /> Productivity Increase
          </p>
        </div>
      </div>

    </section>
    <PracticeFeatureSlider/>
    
    </div>
    </div>
  );
}