import React from 'react';
import { LessonId } from '../types';
import { FileText, Trophy, Award } from 'lucide-react';
import { sound } from '../utils/audio';

interface NavbarProps {
  currentLessonId: LessonId;
  onSelectLesson: (id: LessonId) => void;
  totalXp: number;
  levelTitle: string;
  onOpenSpecs: () => void;
  onOpenReport: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLessonId,
  onSelectLesson,
  totalXp,
  levelTitle,
  onOpenSpecs,
  onOpenReport
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => {
              onSelectLesson('lesson-1');
              sound.playClick();
            }}
            className="text-lg font-black tracking-tight text-slate-900 whitespace-nowrap hover:text-indigo-600 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <span className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              ع
            </span>
            <span>منصة العُلا التعليمية</span>
          </button>
          <span className="hidden lg:inline text-xs text-slate-400 font-medium">· الوحدة 3: الشبكات والزوايا</span>
        </div>

        {/* Zone 2: 4-5 single-line navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-xs lg:text-sm font-semibold text-slate-600 shrink-0">
          <button
            onClick={() => {
              onSelectLesson('lesson-1');
              sound.playClick();
            }}
            className={`whitespace-nowrap transition-colors py-1 cursor-pointer ${
              currentLessonId === 'lesson-1'
                ? 'text-indigo-600 border-b-2 border-indigo-600 font-bold'
                : 'hover:text-slate-900'
            }`}
          >
            الشبكات (3-1)
          </button>
          <button
            onClick={() => {
              onSelectLesson('lesson-2');
              sound.playClick();
            }}
            className={`whitespace-nowrap transition-colors py-1 cursor-pointer ${
              currentLessonId === 'lesson-2'
                ? 'text-indigo-600 border-b-2 border-indigo-600 font-bold'
                : 'hover:text-slate-900'
            }`}
          >
            خصائص الزوايا (3-2)
          </button>
          <button
            onClick={() => {
              onSelectLesson('lesson-3');
              sound.playClick();
            }}
            className={`whitespace-nowrap transition-colors py-1 cursor-pointer ${
              currentLessonId === 'lesson-3'
                ? 'text-indigo-600 border-b-2 border-indigo-600 font-bold'
                : 'hover:text-slate-900'
            }`}
          >
            مسائل الزوايا (3-3)
          </button>
          <button
            onClick={() => {
              onOpenSpecs();
              sound.playClick();
            }}
            className="whitespace-nowrap text-purple-700 hover:text-purple-900 transition-colors py-1 flex items-center gap-1.5 cursor-pointer"
          >
            <FileText className="w-4 h-4 text-purple-600" />
            <span>وثيقة المواصفات</span>
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          {/* XP Ticker Pill */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 font-bold text-xs">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span className="font-mono tabular-nums">{totalXp} XP</span>
            <span className="hidden sm:inline text-[11px] text-amber-700">· {levelTitle}</span>
          </div>

          <button
            onClick={() => {
              onOpenReport();
              sound.playClick();
            }}
            className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5"
          >
            <Award className="w-3.5 h-3.5" />
            <span>تقرير الأداء</span>
          </button>
        </div>
      </div>
    </header>
  );
};
