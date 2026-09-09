'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Calculator from './Calculator';

interface Position {
  x: number;
  y: number;
}

interface WindowSize {
  width: number;
  height: number;
}

interface EnhancedFloatingCalculatorProps {
  initialPosition?: Position;
}

const BUTTON_SIZE = 48;
const CALC_WIDTH = 260;
const SCREEN_PADDING = 12;
const DRAG_THRESHOLD = 4;

export default function EnhancedFloatingCalculator({
  initialPosition = { x: 20, y: 20 },
}: EnhancedFloatingCalculatorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // 1. Инициализация сохраненной позиции
  const [position, setPosition] = useState<Position>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('floatingCalculatorPosition');
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return initialPosition;
  });

  // 2. Размеры экрана
  const [windowSize, setWindowSize] = useState<WindowSize>(() => {
    if (typeof window !== 'undefined') {
      return { width: window.innerWidth, height: window.innerHeight };
    }
    return { width: 0, height: 0 };
  });

  const dragOffsetRef = useRef<Position>({ x: 0, y: 0 });
  const startPosRef = useRef<Position>({ x: 0, y: 0 });
  const isMovedRef = useRef(false);
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem('floatingCalculatorPosition', JSON.stringify(position));
    } catch {}
  }, [position]);

  const clampPosition = useCallback((x: number, y: number): Position => {
    const maxX = window.innerWidth - BUTTON_SIZE - SCREEN_PADDING;
    const maxY = window.innerHeight - BUTTON_SIZE - SCREEN_PADDING;

    return {
      x: Math.max(SCREEN_PADDING, Math.min(x, maxX)),
      y: Math.max(SCREEN_PADDING, Math.min(y, maxY)),
    };
  }, []);

  const handleMove = useCallback(
    (clientX: number, clientY: number) => {
      const deltaX = Math.abs(clientX - startPosRef.current.x);
      const deltaY = Math.abs(clientY - startPosRef.current.y);

      if (deltaX > DRAG_THRESHOLD || deltaY > DRAG_THRESHOLD) {
        isMovedRef.current = true;
      }

      const targetX = clientX - dragOffsetRef.current.x;
      const targetY = clientY - dragOffsetRef.current.y;

      setPosition(clampPosition(targetX, targetY));
    },
    [clampPosition]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      handleMove(e.clientX, e.clientY);
    },
    [isDragging, handleMove]
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDragging) return;
      const touch = e.touches[0];
      if (touch) handleMove(touch.clientX, touch.clientY);
    },
    [isDragging, handleMove]
  );

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (!isDragging) return;

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleDragEnd);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleDragEnd);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleDragEnd);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleDragEnd);
    };
  }, [isDragging, handleMouseMove, handleTouchMove, handleDragEnd]);

  const handleStartDrag = (clientX: number, clientY: number) => {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (!rect) return;

    dragOffsetRef.current = {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
    startPosRef.current = { x: clientX, y: clientY };
    isMovedRef.current = false;
    setIsDragging(true);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    handleStartDrag(e.clientX, e.clientY);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    if (touch) handleStartDrag(touch.clientX, touch.clientY);
  };

  const toggleCalculator = () => {
    if (isMovedRef.current) return;
    setIsOpen((prev) => !prev);
    if (!isOpen) setIsMinimized(false);
  };

  // Вычисление безопасного положения окна
  const getCalculatorPosition = (): Position => {
    if (!windowSize.width) return position;

    let x = position.x + BUTTON_SIZE + 8;
    let y = position.y - 10;

    if (x + CALC_WIDTH > windowSize.width - SCREEN_PADDING) {
      x = position.x - CALC_WIDTH - 8;
    }

    if (x < SCREEN_PADDING) {
      x = Math.max(SCREEN_PADDING, (windowSize.width - CALC_WIDTH) / 2);
    }

    const calcHeight = isMinimized ? 36 : 380;
    if (y + calcHeight > windowSize.height - SCREEN_PADDING) {
      y = windowSize.height - calcHeight - SCREEN_PADDING;
    }

    if (y < SCREEN_PADDING) {
      y = SCREEN_PADDING;
    }

    return { x, y };
  };

  const calcPos = getCalculatorPosition();

  return (
    <>
      {/* Плавающая кнопка */}
      <div
        ref={buttonRef}
        className={`
          fixed z-50 cursor-grab select-none
          transition-transform duration-200 active:scale-95
          ${isDragging ? 'cursor-grabbing scale-105' : 'hover:scale-105'}
        `}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          touchAction: 'none',
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onClick={toggleCalculator}
      >
        <div
          className={`
            w-12 h-12 rounded-2xl
            bg-[#6960C5] hover:bg-[#5850b5]
            text-white text-lg font-medium
            flex items-center justify-center
            shadow-lg shadow-[#6960C5]/25 border border-white/20
            backdrop-blur-md transition-all duration-300
            ${isOpen ? 'rotate-90 bg-gray-800 shadow-gray-800/20' : 'rotate-0'}
          `}
        >
          {isOpen ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          )}
        </div>

        {!isOpen && (
          <span className="absolute top-0 right-0 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500" />
          </span>
        )}
      </div>

      {/* Модальное окно калькулятора */}
      {isOpen && (
        <div
          className="fixed z-40 transition-all duration-150 ease-out"
          style={{
            left: `${calcPos.x}px`,
            top: `${calcPos.y}px`,
            width: `${CALC_WIDTH}px`,
          }}
        >
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden text-gray-800">
            {/* Шапка */}
            <div className="flex items-center justify-between px-3 py-2 bg-gradient-to-r from-[#6960C5] to-[#8B83D4] text-white select-none">
              <div className="flex items-center gap-1.5 text-xs font-medium tracking-wide">
                <span>🧮</span>
                <span>Калькулятор</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMinimized((prev) => !prev);
                  }}
                  className="w-5 h-5 flex items-center justify-center hover:bg-white/20 rounded text-xs transition-colors"
                  title={isMinimized ? 'Развернуть' : 'Свернуть'}
                >
                  {isMinimized ? '□' : '−'}
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(false);
                    setIsMinimized(false);
                  }}
                  className="w-5 h-5 flex items-center justify-center hover:bg-white/20 rounded text-xs transition-colors"
                  title="Закрыть"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Тело */}
            {!isMinimized && (
              <div className="p-2.5">
                <Calculator />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}