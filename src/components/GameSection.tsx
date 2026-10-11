import React, { useState } from 'react';
import { LessonId } from '../types';
import { IslamicGeometryPlatformer } from './games/IslamicGeometryPlatformer';
import { NetsArchitectGame } from './games/NetsArchitectGame';
import { AngleSniperGame } from './games/AngleSniperGame';
import { ProofCastleMazeGame } from './games/ProofCastleMazeGame';
import { Box, Compass, Shield, Gamepad2, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio';

interface GameSectionProps {
  lessonId: LessonId;
  onEarnXp: (amount: number, reason: string) => void;
}

export const GameSection: React.FC<GameSectionProps> = ({ lessonId, onEarnXp }) => {
  // Game mode: 'lesson_specific' (unique dedicated game for each lesson) or 'islamic_platformer' (Mario style in Islamic heritage theme)
  const [gameMode, setGameMode] = useState<'lesson_specific' | 'islamic_platformer'>('lesson_specific');

  const getLessonGameName = (id: LessonId) => {
    switch (id) {
      case 'lesson-1':
        return 'ورشة مهندس شبكات المجسمات 3D';
      case 'lesson-2':
        return 'قناص مبرهنات التوازي والمثلثات';
      case 'lesson-3':
        return 'متاهة قلعة البراهين الهندسية';
    }
  };

  const getLessonGameIcon = (id: LessonId) => {
    switch (id) {
      case 'lesson-1':
        return <Box className="w-4 h-4 text-emerald-500" />;
      case 'lesson-2':
        return <Compass className="w-4 h-4 text-indigo-500" />;
      case 'lesson-3':
        return <Shield className="w-4 h-4 text-purple-500" />;
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Game Mode Switcher Banner */}
      <div className="bg-slate-100 p-2 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2 px-2 text-xs font-bold text-slate-700">
          <Gamepad2 className="w-4 h-4 text-indigo-600" />
          <span>اختر نمط اللعب التعليمي:</span>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Button 1: Dedicated Lesson Game (لعبة مخصصة لكل درس) */}
          <button
            onClick={() => {
              setGameMode('lesson_specific');
              sound.playClick();
            }}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs ${
              gameMode === 'lesson_specific'
                ? 'bg-white text-indigo-900 border border-slate-200 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            {getLessonGameIcon(lessonId)}
            <span>لعبة الدرس التخصصية: {getLessonGameName(lessonId)}</span>
          </button>

          {/* Button 2: Islamic Heritage Mario-style Platformer Game */}
          <button
            onClick={() => {
              setGameMode('islamic_platformer');
              sound.playClick();
            }}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs ${
              gameMode === 'islamic_platformer'
                ? 'bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-black shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-950" />
            <span>مغامرة القلعة الإسلامية (نمط ماريو والمنصات) 🏰</span>
          </button>
        </div>
      </div>

      {/* Render Selected Game */}
      {gameMode === 'lesson_specific' ? (
        <div>
          {lessonId === 'lesson-1' && <NetsArchitectGame onEarnXp={onEarnXp} />}
          {lessonId === 'lesson-2' && <AngleSniperGame onEarnXp={onEarnXp} />}
          {lessonId === 'lesson-3' && <ProofCastleMazeGame onEarnXp={onEarnXp} />}
        </div>
      ) : (
        <div>
          <IslamicGeometryPlatformer lessonId={lessonId} onEarnXp={onEarnXp} />
        </div>
      )}
    </div>
  );
};
