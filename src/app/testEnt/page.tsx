'use client';

import React, { useState, useEffect, useCallback } from 'react';
import EnhancedFloatingCalculator from '../components/ui/EnhancedFloatingCalculator';
import ProtectedRoute from '../components/protected-route/ProtectedRoute';

/* =========================================================
   TYPES
========================================================= */

export interface Question {
  id: number;
  subjectId: 'history' | 'math' | 'reading';
  questionText: string;
  options: { id: string; text: string }[];
}

export interface Subject {
  id: 'history' | 'math' | 'reading';
  title: string;
  shortTitle: string;
  questionIds: number[];
}

/* =========================================================
   CONFIG & MOCK DATA
========================================================= */

const SUBJECTS: Subject[] = [
  {
    id: 'history',
    title: 'Қазақстан тарихы',
    shortTitle: 'Тарих',
    questionIds: Array.from({ length: 20 }, (_, i) => i + 1),
  },
  {
    id: 'math',
    title: 'Математикалық сауаттылық',
    shortTitle: 'Мат. сауат.',
    questionIds: Array.from({ length: 10 }, (_, i) => i + 21),
  },
  {
    id: 'reading',
    title: 'Оқу сауаттылығы',
    shortTitle: 'Оқу сауат.',
    questionIds: Array.from({ length: 10 }, (_, i) => i + 31),
  },
];

const MOCK_QUESTIONS: Record<number, Question> = {
  1: {
    id: 1,
    subjectId: 'history',
    questionText: 'Қазақ хандығының құрылған жылы?',
    options: [
      { id: 'a', text: '1465 ж.' },
      { id: 'b', text: '1885 ж.' },
      { id: 'c', text: '2025 ж.' },
      { id: 'd', text: '1865 ж.' },
    ],
  },
};

const TOTAL_SECONDS = 5400;

/* =========================================================
   HELPERS
========================================================= */

function formatTime(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

/* =========================================================
   MAIN CONTENT
========================================================= */

function TestEContent() {
  const [currentQuestionId, setCurrentQuestionId] = useState(1);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState(TOTAL_SECONDS);
  const [isFinished, setIsFinished] = useState(false);
  const [showFinishModal, setShowFinishModal] = useState(false);

  /* ---------------- TIMER ---------------- */
  useEffect(() => {
    if (isFinished) return;
    if (timeLeft <= 0) {
      handleConfirmFinish();
      return;
    }
    const t = setInterval(() => setTimeLeft((p) => p - 1), 1000);
    return () => clearInterval(t);
  }, [timeLeft, isFinished]);

  /* ---------------- CURRENT DATA ---------------- */
  const currentQuestion = MOCK_QUESTIONS[currentQuestionId] || {
    id: currentQuestionId,
    subjectId:
      currentQuestionId <= 20
        ? 'history'
        : currentQuestionId <= 30
        ? 'math'
        : 'reading',
    questionText: `${currentQuestionId}-сұрақ. Мұнда сұрақ мәтіні орналасады.`,
    options: [
      { id: 'a', text: 'A нұсқасы' },
      { id: 'b', text: 'B нұсқасы' },
      { id: 'c', text: 'C нұсқасы' },
      { id: 'd', text: 'D нұсқасы' },
    ],
  };

  const currentSubject = SUBJECTS.find(
    (s) => s.id === currentQuestion.subjectId
  );

  const answeredCount = Object.keys(answers).length;
  const progress = Math.round((answeredCount / 40) * 100);
  const isWarning = timeLeft <= 300;

  /* ---------------- HANDLERS ---------------- */
  const handleSelectOption = useCallback(
    (optionId: string) => {
      setAnswers((prev) => ({ ...prev, [currentQuestionId]: optionId }));
    },
    [currentQuestionId]
  );

  const handleNext = () => {
    if (currentQuestionId < 40) setCurrentQuestionId((p) => p + 1);
  };

  const handlePrev = () => {
    if (currentQuestionId > 1) setCurrentQuestionId((p) => p - 1);
  };

  const handleConfirmFinish = () => {
    setShowFinishModal(false);
    setIsFinished(true);
    console.log('Жіберілген жауаптар:', answers);
  };

  /* =========================================================
     RENDER
  ========================================================= */
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/40 font-sans text-slate-800 pt-32">
      {/* Плавающий калькулятор */}
      <EnhancedFloatingCalculator initialPosition={{ x: 30, y: 30 }} />

      {/* ============================= FLOATING TIMER ============================= */}
      <div className="fixed right-4 top-4 z-40 md:right-6 md:top-6">
        <div
          className={`flex items-center gap-3 rounded-2xl border px-4 py-2.5 backdrop-blur-lg transition-all ${
            isWarning
              ? 'animate-pulse border-red-200 bg-red-50/90 text-red-600 shadow-lg shadow-red-500/10'
              : 'border-slate-200/80 bg-white/90 text-slate-800 shadow-lg shadow-slate-200/50'
          }`}
        >
          <span
            className={`flex h-2 w-2 rounded-full ${
              isWarning ? 'bg-red-500' : 'bg-emerald-500'
            }`}
          />
          <div className="flex flex-col leading-none">
            <span className="text-[10px] uppercase tracking-wider text-slate-400">
              Уақыт
            </span>
            <span className="font-mono text-base font-bold tabular-nums md:text-lg">
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>
      </div>

      {/* ============================= MAIN ============================= */}
      <main className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-6 md:px-8 lg:grid-cols-12 lg:gap-8 lg:py-10">
        {/* ============================= QUESTION ============================= */}
        <section className="lg:col-span-7">
          {/* Subject chip + question counter */}
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
              {currentSubject?.title}
            </span>
            <span className="text-xs text-slate-400">
              Сұрақ {currentQuestionId} / 40
            </span>
          </div>

          {/* Card */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xl shadow-slate-200/40 md:p-8">
            {/* Question text */}
            <div className="mb-8 rounded-2xl bg-gradient-to-br from-slate-50 to-indigo-50/60 p-5 md:p-6">
              <p className="text-base font-medium leading-relaxed text-slate-800 md:text-lg">
                {currentQuestion.questionText}
              </p>
            </div>

            {/* Options */}
            <div className="space-y-3">
              {currentQuestion.options.map((opt) => {
                const isSelected = answers[currentQuestionId] === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectOption(opt.id)}
                    className={`group flex w-full items-center gap-4 rounded-2xl border-2 px-4 py-3.5 text-left transition-all duration-200 md:px-5 md:py-4 ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-50/70 shadow-md shadow-indigo-500/10'
                        : 'border-slate-200 bg-white hover:border-indigo-300 hover:bg-slate-50'
                    }`}
                  >
                    <span
                      className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-sm font-bold uppercase transition-all ${
                        isSelected
                          ? 'bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-500/30'
                          : 'bg-slate-100 text-slate-600 group-hover:bg-white'
                      }`}
                    >
                      {opt.id}
                    </span>

                    <span
                      className={`text-sm md:text-base ${
                        isSelected
                          ? 'font-semibold text-slate-900'
                          : 'text-slate-700'
                      }`}
                    >
                      {opt.text}
                    </span>

                    {isSelected && (
                      <span className="ml-auto flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500 text-xs text-white">
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Navigation */}
            <div className="mt-8 flex items-center justify-between gap-3 border-t border-slate-100 pt-6">
              <button
                onClick={handlePrev}
                disabled={currentQuestionId === 1}
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                ← Артқа
              </button>

              <button
                onClick={handleNext}
                disabled={currentQuestionId === 40}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/30 transition hover:shadow-lg hover:shadow-indigo-500/40 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Келесі →
              </button>
            </div>
          </div>
        </section>

        {/* ============================= SIDEBAR ============================= */}
        <aside className="lg:col-span-5">
          <div className="sticky top-6 space-y-5 rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xl shadow-slate-200/40 md:p-6">
            {/* Progress */}
            <div>
              <div className="mb-2 flex items-center justify-between text-xs font-medium text-slate-500">
                <span>Прогресс</span>
                <span className="tabular-nums text-slate-700">
                  {answeredCount} / 40
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Header */}
            <div className="flex items-center justify-between border-t border-slate-100 pt-5">
              <h3 className="text-sm font-bold tracking-tight text-slate-900">
                Сұрақтар картасы
              </h3>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium tabular-nums text-slate-600">
                {answeredCount}/40
              </span>
            </div>

            {/* Subjects */}
            <div className="space-y-5">
              {SUBJECTS.map((subject) => {
                const isActive = subject.id === currentQuestion.subjectId;
                return (
                  <div key={subject.id}>
                    <div className="mb-2 flex items-center gap-2">
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          isActive ? 'bg-indigo-500' : 'bg-slate-300'
                        }`}
                      />
                      <h4
                        className={`text-xs font-semibold uppercase tracking-wider ${
                          isActive ? 'text-indigo-600' : 'text-slate-500'
                        }`}
                      >
                        {subject.shortTitle}
                      </h4>
                    </div>

                    <div className="grid grid-cols-5 gap-2">
                      {subject.questionIds.map((qId, index) => {
                        const isAnswered = !!answers[qId];
                        const isCurrent = currentQuestionId === qId;
                        return (
                          <button
                            key={qId}
                            onClick={() => setCurrentQuestionId(qId)}
                            className={`relative flex h-10 items-center justify-center rounded-xl text-sm font-semibold transition-all duration-200 ${
                              isCurrent
                                ? 'bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-500/30'
                                : isAnswered
                                ? 'border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                : 'border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                            }`}
                          >
                            {index + 1}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="space-y-2 border-t border-slate-100 pt-4">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="h-3 w-3 rounded-md border border-slate-200 bg-white" />
                Жауап берілмеген
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="h-3 w-3 rounded-md border border-emerald-200 bg-emerald-50" />
                Жауап берілген
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="h-3 w-3 rounded-md bg-gradient-to-br from-indigo-500 to-violet-600" />
                Қазіргі сұрақ
              </div>
            </div>

            {/* Finish button */}
            <button
              onClick={() => setShowFinishModal(true)}
              className="w-full rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-500/30 transition hover:shadow-lg"
            >
              Тестті аяқтау
            </button>
          </div>
        </aside>
      </main>

      {/* ============================= FINISH MODAL ============================= */}
      {showFinishModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl md:p-7">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-2xl">
              ⚠️
            </div>

            <h3 className="text-lg font-bold tracking-tight text-slate-900">
              Тестті аяқтау?
            </h3>

            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              Аяқтағаннан кейін жауаптарды өзгерте алмайсыз. Нәтиже автоматты
              түрде есептеледі.
            </p>

            {answeredCount < 40 && (
              <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50/70 p-4">
                <p className="text-sm font-semibold text-amber-800">
                  Назар аударыңыз
                </p>
                <p className="mt-1 text-xs text-amber-700">
                  Сіз {40 - answeredCount} сұраққа жауап бермедіңіз.
                </p>
              </div>
            )}

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowFinishModal(false)}
                className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Жалғастыру
              </button>
              <button
                onClick={handleConfirmFinish}
                className="flex-1 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-500/30 transition hover:shadow-lg"
              >
                Аяқтау
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================= SUCCESS SCREEN ============================= */}
      {isFinished && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-violet-50 p-4">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-2xl">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-2xl text-white shadow-lg shadow-indigo-500/30">
              ✓
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Тест аяқталды!
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Жауаптарыңыз сәтті жіберілді. Нәтижені профильден көре аласыз.
            </p>

            <button
              onClick={() => (window.location.href = '/profile')}
              className="mt-6 w-full rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 px-5 py-3.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/30 transition hover:shadow-lg"
            >
              Профильге өту
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   PAGE WRAPPER
========================================================= */

export default function TestE() {
  return (
    <ProtectedRoute>
      <TestEContent />
    </ProtectedRoute>
  );
}