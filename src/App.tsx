import React, { useState, useEffect } from 'react';
import { LessonId, TabType, StudentState } from './types';
import { LESSONS, QUESTIONS, CHECKPOINTS, BADGES } from './data/curriculumData';
import { Navbar } from './components/Navbar';
import { NetsSimulator } from './components/NetsSimulator';
import { AnglesLab } from './components/AnglesLab';
import { ProofBuilder } from './components/ProofBuilder';
import { QuizSection } from './components/QuizSection';
import { GameSection } from './components/GameSection';
import { CheckpointModal } from './components/CheckpointModal';
import { SpecificationsModal } from './components/SpecificationsModal';
import { StudentReportModal } from './components/StudentReportModal';
import { sound } from './utils/audio';
import {
  Box,
  Compass,
  ShieldCheck,
  Award,
  Sparkles,
  Layers,
  ArrowRight,
  BookOpen,
  Gamepad2,
  FileText,
  User,
  GraduationCap
} from 'lucide-react';

export default function App() {
  const [currentLessonId, setCurrentLessonId] = useState<LessonId>('lesson-1');
  const [activeTab, setActiveTab] = useState<TabType>('simulation');

  // Student State with local storage persistence
  const [student, setStudent] = useState<StudentState>(() => {
    const saved = localStorage.getItem('itqan_student_state_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback to default
      }
    }
    return {
      name: 'طالبة الصف الثامن المتميزة',
      grade: 'الصف الثامن الأساسي',
      school: 'مدرسة التعليم الأساسي (سلطنة عُمان)',
      totalXp: 40,
      level: 1,
      levelTitle: 'مبتدئة هندسية',
      completedLessons: [],
      answeredQuestions: {},
      solvedCheckpoints: [],
      gameHighScores: { game1: 0, game2: 0, game3: 0 },
      unlockedBadges: ['b1']
    };
  });

  // Modal states
  const [activeCheckpoint, setActiveCheckpoint] = useState<typeof CHECKPOINTS[0] | null>(null);
  const [showSpecsModal, setShowSpecsModal] = useState<boolean>(false);
  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Save student to local storage
  useEffect(() => {
    localStorage.setItem('itqan_student_state_v1', JSON.stringify(student));
  }, [student]);

  // Check if student qualifies for a new level
  const calculateLevel = (xp: number): { level: number; title: string } => {
    if (xp >= 650) return { level: 4, title: 'أستاذة البرهان الإقليدي 👑' };
    if (xp >= 380) return { level: 3, title: 'خبيرة المجسمات والزوايا 🌟' };
    if (xp >= 160) return { level: 2, title: 'باحثة الزوايا الهندسية ⚡' };
    return { level: 1, title: 'مبتدئة هندسية 🚀' };
  };

  // Check if an upcoming checkpoint is unlocked
  const checkForCheckpointUnlock = (newXp: number, currentSolved: string[]) => {
    const nextCp = CHECKPOINTS.find(
      (cp) => newXp >= cp.xpThreshold && !currentSolved.includes(cp.id)
    );
    if (nextCp) {
      setTimeout(() => {
        setActiveCheckpoint(nextCp);
        sound.playCheckpoint();
      }, 700);
    }
  };

  const handleEarnXp = (amount: number, reason: string) => {
    setStudent((prev) => {
      const nextXp = prev.totalXp + amount;
      const { level, title } = calculateLevel(nextXp);

      // Check badges
      const newBadges = [...prev.unlockedBadges];
      BADGES.forEach((b) => {
        if (nextXp >= b.xpRequired && !newBadges.includes(b.id)) {
          newBadges.push(b.id);
        }
      });

      checkForCheckpointUnlock(nextXp, prev.solvedCheckpoints);

      // Toast feedback
      setToastMessage(`+${amount} XP · ${reason}`);
      setTimeout(() => setToastMessage(null), 3500);

      return {
        ...prev,
        totalXp: nextXp,
        level,
        levelTitle: title,
        unlockedBadges: newBadges
      };
    });
  };

  const handleAnswerQuestion = (questionId: string, isCorrect: boolean, points: number) => {
    setStudent((prev) => {
      const updatedAnswered = { ...prev.answeredQuestions, [questionId]: isCorrect };
      const nextXp = isCorrect ? prev.totalXp + points : prev.totalXp;
      const { level, title } = calculateLevel(nextXp);

      // Check if lesson is completed (all questions answered)
      const currentLessonQuestions = QUESTIONS.filter((q) => q.lessonId === currentLessonId);
      const allDone = currentLessonQuestions.every((q) => updatedAnswered[q.id] === true);
      const completedLessons = [...prev.completedLessons];
      if (allDone && !completedLessons.includes(currentLessonId)) {
        completedLessons.push(currentLessonId);
      }

      if (isCorrect) {
        checkForCheckpointUnlock(nextXp, prev.solvedCheckpoints);
      }

      return {
        ...prev,
        totalXp: nextXp,
        level,
        levelTitle: title,
        answeredQuestions: updatedAnswered,
        completedLessons
      };
    });
  };

  const handleSolveCheckpoint = (checkpointId: string, bonusPoints: number) => {
    setStudent((prev) => {
      const nextXp = prev.totalXp + bonusPoints;
      const { level, title } = calculateLevel(nextXp);
      return {
        ...prev,
        totalXp: nextXp,
        level,
        levelTitle: title,
        solvedCheckpoints: [...prev.solvedCheckpoints, checkpointId]
      };
    });
    setToastMessage(`مبارك! اجتزتِ محطة العبور (+${bonusPoints} XP) 🏆`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const currentLesson = LESSONS.find((l) => l.id === currentLessonId) || LESSONS[0];
  const currentQuestions = QUESTIONS.filter((q) => q.lessonId === currentLessonId);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col antialiased selection:bg-indigo-500 selection:text-white">
      {/* Top Bar with Strict Contract */}
      <Navbar
        currentLessonId={currentLessonId}
        onSelectLesson={(id) => {
          setCurrentLessonId(id);
          setActiveTab('simulation');
        }}
        totalXp={student.totalXp}
        levelTitle={student.levelTitle}
        onOpenSpecs={() => setShowSpecsModal(true)}
        onOpenReport={() => setShowReportModal(true)}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 border border-slate-700 animate-in slide-in-from-bottom-2 duration-200">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Hero Banner Section */}
        <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-lg border border-slate-800">
          <div className="absolute -left-12 -top-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute right-0 bottom-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-300">
                <span>سلسلة كامبريدج للرياضيات · الصف الثامن</span>
                <span className="text-slate-500">·</span>
                <span className="text-amber-300">إشراف وتنفيذ: أ. عائشة ناصر السنيدية</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                منصة العُلا: الوحدة 3 (الشبكات والزوايا)
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                بيئة تعلم إلكترونية متطورة تدعم المحاكاة ثلاثية الأبعاد لطي الشبكات، معمل الزوايا الديناميكي، ومُنشئ البراهين المنطقية، مدعومة بنظام نقاط تفتيش ذكي وألعاب تعليمية هادفة.
              </p>
            </div>

            {/* Quick Actions & Milestone Strip */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
              <button
                onClick={() => {
                  setShowSpecsModal(true);
                  sound.playClick();
                }}
                className="px-5 py-2.5 bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <FileText className="w-4 h-4 text-purple-300" />
                <span>عرض وثيقة المواصفات الفنية الشاملة</span>
              </button>

              <button
                onClick={() => {
                  setShowReportModal(true);
                  sound.playClick();
                }}
                className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <Award className="w-4 h-4" />
                <span>كشف تقويم مهارات الطالبة</span>
              </button>
            </div>
          </div>

          {/* XP Checkpoints Progress Ribbon */}
          <div className="mt-6 pt-5 border-t border-white/10">
            <div className="flex items-center justify-between text-xs text-slate-300 mb-2">
              <span className="font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>مسار العبور المعرفي (Checkpoints Roadmap)</span>
              </span>
              <span className="font-mono text-amber-300 font-bold">
                {student.totalXp} XP محققة
              </span>
            </div>

            {/* Visual Milestones Bar */}
            <div className="relative w-full h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 via-indigo-500 to-amber-400 transition-all duration-500 rounded-full"
                style={{ width: `${Math.min(100, (student.totalXp / 700) * 100)}%` }}
              />
            </div>

            {/* Checkpoint Nodes */}
            <div className="flex justify-between text-[11px] text-slate-400 mt-2 font-medium">
              <span>البداية (0)</span>
              <span className={student.totalXp >= 120 ? 'text-emerald-400 font-bold' : ''}>
                محطة 1 (120 XP) {student.totalXp >= 120 ? '✓' : ''}
              </span>
              <span className={student.totalXp >= 280 ? 'text-indigo-400 font-bold' : ''}>
                محطة 2 (280 XP) {student.totalXp >= 280 ? '✓' : ''}
              </span>
              <span className={student.totalXp >= 500 ? 'text-amber-400 font-bold' : ''}>
                محطة 3 (500 XP) {student.totalXp >= 500 ? '✓' : ''}
              </span>
              <span>القمة (700 XP)</span>
            </div>
          </div>
        </div>

        {/* 3 Lesson Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {LESSONS.map((lsn) => {
            const isSelected = lsn.id === currentLessonId;
            const isCompleted = student.completedLessons.includes(lsn.id);

            return (
              <button
                key={lsn.id}
                onClick={() => {
                  setCurrentLessonId(lsn.id);
                  setActiveTab('simulation');
                  sound.playClick();
                }}
                className={`p-5 rounded-2xl border text-right transition-all flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-white border-indigo-500 shadow-md ring-2 ring-indigo-100'
                    : 'bg-white/80 border-slate-200 hover:border-slate-300 hover:bg-white shadow-xs'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200">
                      الدرس {lsn.number}
                    </span>
                    {isCompleted ? (
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        مكتمل ✓
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-400">{lsn.durationMinutes} دقيقة</span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{lsn.title}</h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {lsn.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
                  <span className={isSelected ? 'text-indigo-600' : 'text-slate-500'}>
                    {isSelected ? 'الدرس الحالي النشط' : 'انتقال إلى الدرس'}
                  </span>
                  <ArrowRight
                    className={`w-4 h-4 rotate-180 transition-transform ${
                      isSelected ? 'text-indigo-600 translate-x-1' : 'text-slate-400'
                    }`}
                  />
                </div>
              </button>
            );
          })}
        </div>

        {/* Current Lesson Workspace */}
        <div className="space-y-4">
          {/* Workspace Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-1.5 bg-slate-200/80 rounded-2xl">
            <div className="flex flex-wrap gap-1">
              <button
                onClick={() => {
                  setActiveTab('simulation');
                  sound.playClick();
                }}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === 'simulation'
                    ? 'bg-white text-indigo-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {currentLessonId === 'lesson-1' && <Box className="w-4 h-4 text-emerald-600" />}
                {currentLessonId === 'lesson-2' && <Compass className="w-4 h-4 text-indigo-600" />}
                {currentLessonId === 'lesson-3' && <ShieldCheck className="w-4 h-4 text-purple-600" />}
                <span>
                  {currentLessonId === 'lesson-1' && 'محاكاة طي وبسط الشبكات (3D)'}
                  {currentLessonId === 'lesson-2' && 'معمل الزوايا والمستقيمات التفاعلي'}
                  {currentLessonId === 'lesson-3' && 'مُنشئ البراهين الهندسية خطوة بخطوة'}
                </span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('quiz');
                  sound.playClick();
                }}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === 'quiz'
                    ? 'bg-white text-indigo-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Award className="w-4 h-4 text-amber-500" />
                <span>الأسئلة والتقييم الفوري ({currentQuestions.length})</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('game');
                  sound.playClick();
                }}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === 'game'
                    ? 'bg-white text-indigo-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Gamepad2 className="w-4 h-4 text-pink-600" />
                <span>اللعبة التعليمية</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('overview');
                  sound.playClick();
                }}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === 'overview'
                    ? 'bg-white text-indigo-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <BookOpen className="w-4 h-4 text-slate-600" />
                <span>مخرجات وأهداف الدرس</span>
              </button>
            </div>

            <div className="text-xs text-slate-500 px-3 hidden sm:block">
              الدرس: {currentLesson.title} ({currentLesson.cambridgeCode})
            </div>
          </div>

          {/* Active Tab Views */}
          {activeTab === 'simulation' && (
            <div>
              {currentLessonId === 'lesson-1' && <NetsSimulator onEarnXp={handleEarnXp} />}
              {currentLessonId === 'lesson-2' && <AnglesLab onEarnXp={handleEarnXp} />}
              {currentLessonId === 'lesson-3' && <ProofBuilder onEarnXp={handleEarnXp} />}
            </div>
          )}

          {activeTab === 'quiz' && (
            <QuizSection
              questions={currentQuestions}
              answeredQuestions={student.answeredQuestions}
              onAnswerQuestion={handleAnswerQuestion}
            />
          )}

          {activeTab === 'game' && (
            <GameSection lessonId={currentLessonId} onEarnXp={handleEarnXp} />
          )}

          {activeTab === 'overview' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <span className="text-xs font-bold text-indigo-600">
                  كود كامبريدج: {currentLesson.cambridgeCode}
                </span>
                <h3 className="text-lg font-bold text-slate-800 mt-1">
                  الدرس {currentLesson.number}: {currentLesson.title} - {currentLesson.subtitle}
                </h3>
                <p className="text-xs text-slate-600 mt-1">{currentLesson.description}</p>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-800 mb-2">مخرجات التعلم المستهدفة:</h4>
                <ul className="space-y-2 text-xs text-slate-700">
                  {currentLesson.learningOutcomes.map((outcome, idx) => (
                    <li key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{outcome}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2 text-xs text-slate-400 flex items-center justify-between">
                <span>الزمن الموصى به: {currentLesson.durationMinutes} دقيقة</span>
                <span>سلسلة كامبريدج - كتاب الطالب وكتاب النشاط</span>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
              ع
            </span>
            <span className="font-bold text-slate-700">منصة العُلا للتعلم الإلكتروني</span>
            <span>·</span>
            <span>تصميم وتنفيذ أ.عائشة ناصر السنيدية</span>
          </div>
          <div className="text-[11px] text-slate-400">
            مخصصة لمناهج كامبريدج في سلطنة عُمان · الصف الثامن (الوحدة الثالثة: الشبكات والزوايا)
          </div>
        </div>
      </footer>

      {/* Checkpoint Modal Popup */}
      {activeCheckpoint && (
        <CheckpointModal
          checkpoint={activeCheckpoint}
          onSolve={handleSolveCheckpoint}
          onClose={() => setActiveCheckpoint(null)}
        />
      )}

      {/* Specifications Document Modal */}
      {showSpecsModal && (
        <SpecificationsModal onClose={() => setShowSpecsModal(false)} />
      )}

      {/* Student Performance Certificate Report Modal */}
      {showReportModal && (
        <StudentReportModal
          student={student}
          onClose={() => setShowReportModal(false)}
          onUpdateName={(name, school) =>
            setStudent((prev) => ({ ...prev, name, school }))
          }
        />
      )}
    </div>
  );
}
