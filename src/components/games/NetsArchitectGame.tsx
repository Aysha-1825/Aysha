import React, { useState } from 'react';
import { Box, Check, X, RotateCcw, Trophy, Sparkles, Timer, HelpCircle, Layers, ArrowRight } from 'lucide-react';
import { sound } from '../../utils/audio';

interface NetsArchitectGameProps {
  onEarnXp: (amount: number, reason: string) => void;
}

interface NetChallenge {
  id: number;
  solidName: string;
  solidEnglish: string;
  question: string;
  facesCount: number;
  expectedFaces: string;
  netType: 'valid' | 'invalid';
  reason: string;
  gridCells: { row: number; col: number; color?: string; label?: string }[];
  hint: string;
}

const CHALLENGES: NetChallenge[] = [
  {
    id: 1,
    solidName: 'مكعب مقفل (Cube)',
    solidEnglish: 'Cube',
    question: 'هل تمثل هذه الشبكة المستوية شبكة صالحة لطي مكعب مقفل سليم؟',
    facesCount: 6,
    expectedFaces: '6 أوجه مربعة متطابقة مرتبطة بالشكل القياسي T',
    netType: 'valid',
    reason: 'نعم! هذه شبكة صالحة للمكعب على شكل حرف T اللاتيني؛ عند طيها تلتقي الحواف دون تراكب وينغلق المكعب تماماً.',
    gridCells: [
      { row: 0, col: 1, color: '#3b82f6', label: 'أعلى' },
      { row: 1, col: 0, color: '#10b981', label: 'يسار' },
      { row: 1, col: 1, color: '#f59e0b', label: 'قاعدة' },
      { row: 1, col: 2, color: '#8b5cf6', label: 'يمين' },
      { row: 2, col: 1, color: '#ec4899', label: 'أمام' },
      { row: 3, col: 1, color: '#06b6d4', label: 'خلف' }
    ],
    hint: 'عدّ الأوجه (6 مربعات) وتأكد من توزيع الأجنحة الجانبية على صفين مختلفين.'
  },
  {
    id: 2,
    solidName: 'شبكة مكعب متراكبة (Invalid Cube Net)',
    solidEnglish: 'Faulty Cube Net',
    question: 'هل يمكن طي هذه الشبكة إلى مكعب مقفل دون تراكب أوجه؟',
    facesCount: 6,
    expectedFaces: '6 مربعات لكن مع وجهين متصلين بنفس الجانب',
    netType: 'invalid',
    reason: 'لا! هذه شبكة غير صالحة؛ لوجود وجهين متصلين بنفس الحافة الجانبية، مما يؤدي لتراكبهما عند الطي وترك جانب مفتوح.',
    gridCells: [
      { row: 0, col: 1, color: '#ef4444', label: '1' },
      { row: 0, col: 2, color: '#ef4444', label: '2' },
      { row: 1, col: 1, color: '#f59e0b', label: '3' },
      { row: 1, col: 2, color: '#ef4444', label: '4' },
      { row: 2, col: 1, color: '#8b5cf6', label: '5' },
      { row: 3, col: 1, color: '#06b6d4', label: '6' }
    ],
    hint: 'لاحظ المربعين (1 و 2) في الصف العلوي، إذا طُوي أحدهما سيتصادم مع الآخر مباشرة.'
  },
  {
    id: 3,
    solidName: 'منشور ثلاثي قائم (Triangular Prism)',
    solidEnglish: 'Triangular Prism',
    question: 'هل تكوّن هذه الشبكة منشوراً ثلاثياً قائماً مكتملاً؟',
    facesCount: 5,
    expectedFaces: 'قاعدتان مثلثتان متطابقتان و 3 أوجه مستطيلة',
    netType: 'valid',
    reason: 'نعم! تتكون من 3 مستطيلات جانبية متجاورة، ومثلثين متطابقين على جانبي المستطيل الأوسط كقاعدتين.',
    gridCells: [
      { row: 0, col: 1, color: '#10b981', label: 'قاعدة ▲' },
      { row: 1, col: 0, color: '#3b82f6', label: 'جانب 1' },
      { row: 1, col: 1, color: '#f59e0b', label: 'جانب 2' },
      { row: 1, col: 2, color: '#8b5cf6', label: 'جانب 3' },
      { row: 2, col: 1, color: '#10b981', label: 'قاعدة ▲' }
    ],
    hint: 'تحققي من وجود قاعدتين مثلثتين متطابقتين وثلاثة مستطيلات جانبية.'
  },
  {
    id: 4,
    solidName: 'هرم رباعي منتظم (Square-based Pyramid)',
    solidEnglish: 'Square Pyramid',
    question: 'هل تصلح هذه الشبكة لصنع هرم رباعي منتظم قاعدته مربعة؟',
    facesCount: 5,
    expectedFaces: 'قاعدة مربعة و 4 أوجه مثلثة متطابقة تحيط بها',
    netType: 'valid',
    reason: 'نعم! قاعدة مربعة مركزية تحيط بها 4 مثلثات متطابقة تلتقي رؤوسها في نقطة واحدة (رأس الهرم) عند الطي.',
    gridCells: [
      { row: 0, col: 1, color: '#ec4899', label: 'مثلث ▲' },
      { row: 1, col: 0, color: '#ec4899', label: 'مثلث ◀' },
      { row: 1, col: 1, color: '#f59e0b', label: 'قاعدة ■' },
      { row: 1, col: 2, color: '#ec4899', label: 'مثلث ▶' },
      { row: 2, col: 1, color: '#ec4899', label: 'مثلث ▼' }
    ],
    hint: 'كل ضلع من أضلاع المربع الأربعة متصل بمثلث يمثل وجهاً جانبياً.'
  },
  {
    id: 5,
    solidName: 'متوازي مستطيلات ناقص (Incomplete Cuboid)',
    solidEnglish: 'Incomplete Cuboid',
    question: 'هل تمثل هذه الشبكة متوازي مستطيلات كاملاً مقفلاً؟',
    facesCount: 5,
    expectedFaces: '5 أوجه فقط (ينقصها وجه سادس ليقفل المجسم)',
    netType: 'invalid',
    reason: 'لا! الشبكة تحتوي على 5 أوجه فقط بينما يحتاج متوازي المستطيلات إلى 6 أوجه مستطيلة ليصبح مقفلاً.',
    gridCells: [
      { row: 0, col: 1, color: '#3b82f6', label: 'غطاء' },
      { row: 1, col: 0, color: '#10b981', label: 'جانب' },
      { row: 1, col: 1, color: '#f59e0b', label: 'قاعدة' },
      { row: 1, col: 2, color: '#8b5cf6', label: 'جانب' },
      { row: 2, col: 1, color: '#06b6d4', label: 'أمام' }
    ],
    hint: 'عدّي الأوجه الموجودة في الشبكة وقارنيها بـ 6 أوجه لمتوازي المستطيلات.'
  }
];

export const NetsArchitectGame: React.FC<NetsArchitectGameProps> = ({ onEarnXp }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [isFolding, setIsFolding] = useState<boolean>(false);
  const [foldAngle, setFoldAngle] = useState<number>(0);
  const [userChoice, setUserChoice] = useState<'valid' | 'invalid' | null>(null);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const currentChallenge = CHALLENGES[currentIndex];

  // Animated folding preview
  const handleToggleFold = () => {
    sound.playClick();
    if (isFolding) {
      setIsFolding(false);
      setFoldAngle(0);
    } else {
      setIsFolding(true);
      let angle = 0;
      const interval = setInterval(() => {
        angle += 5;
        if (angle >= 85) {
          angle = 85;
          clearInterval(interval);
        }
        setFoldAngle(angle);
      }, 30);
    }
  };

  const handleAnswer = (choice: 'valid' | 'invalid') => {
    setUserChoice(choice);
    const isCorrect = choice === currentChallenge.netType;

    if (isCorrect) {
      sound.playCorrect();
      const earned = 30 + combo * 10;
      setScore((s) => s + earned);
      setCombo((c) => c + 1);
      setFeedback({
        isCorrect: true,
        text: `إجابة عبقرية صحيحة! (+${earned} نقطة) 🌟\n${currentChallenge.reason}`
      });
      onEarnXp(earned, `حل تحدي شبكة ${currentChallenge.solidName}`);
    } else {
      sound.playWrong();
      setCombo(0);
      setFeedback({
        isCorrect: false,
        text: `محاولة قريبة! الإجابة الصحيحة هي: ${
          currentChallenge.netType === 'valid' ? 'شبكة صالحة للطي' : 'شبكة غير صالحة'
        }.\n${currentChallenge.reason}`
      });
    }
  };

  const handleNext = () => {
    sound.playClick();
    setUserChoice(null);
    setFeedback(null);
    setShowHint(false);
    setIsFolding(false);
    setFoldAngle(0);

    if (currentIndex + 1 < CHALLENGES.length) {
      setCurrentIndex((i) => i + 1);
    } else {
      setIsCompleted(true);
      sound.playVictory();
    }
  };

  const handleRestart = () => {
    sound.playClick();
    setCurrentIndex(0);
    setScore(0);
    setCombo(0);
    setUserChoice(null);
    setFeedback(null);
    setShowHint(false);
    setIsFolding(false);
    setFoldAngle(0);
    setIsCompleted(false);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-5 sm:p-7 text-slate-800">
      {/* Top Game Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 font-black flex items-center justify-center text-xs border border-emerald-300">
              <Box className="w-4 h-4" />
            </span>
            <h3 className="text-lg font-black text-slate-900">
              تحدي مهندس شبكات المجسمات 3D (الدرس 3-1)
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            افحصي الشبكة المنبسطة، جربي الطي الافتراضي، وحددي هل تشكل مجسماً مقفلاً سليماً!
          </p>
        </div>

        {/* Meters */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200 text-xs font-mono">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span className="font-bold text-amber-900">{score} نقطة</span>
          </div>
          {combo > 1 && (
            <div className="flex items-center gap-1 bg-emerald-50 px-2.5 py-1.5 rounded-xl border border-emerald-200 text-xs text-emerald-800 font-bold animate-pulse">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>مضاعف ×{combo}</span>
            </div>
          )}
          <div className="bg-slate-100 px-3 py-1 rounded-lg text-xs font-bold text-slate-600">
            المرحلة {currentIndex + 1} / {CHALLENGES.length}
          </div>
        </div>
      </div>

      {!isCompleted ? (
        <div className="mt-6 space-y-6">
          {/* Challenge Question Header */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-200">
                المجسم المستهدف: {currentChallenge.solidName}
              </span>
              <h4 className="text-sm sm:text-base font-bold text-slate-800 mt-2">
                {currentChallenge.question}
              </h4>
            </div>

            <button
              onClick={handleToggleFold}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm shrink-0 ${
                isFolding
                  ? 'bg-amber-500 text-slate-950 font-black'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isFolding ? 'rotate-180' : ''}`} />
              <span>{isFolding ? 'إعادة البسط للشبكة المستوية' : 'تجربة الطي الافتراضي (Fold)'}</span>
            </button>
          </div>

          {/* Interactive Visual Canvas Area */}
          <div className="p-6 bg-gradient-to-b from-slate-900 to-slate-950 rounded-2xl border border-slate-800 text-white flex flex-col items-center justify-center min-h-[260px] relative overflow-hidden select-none">
            <div className="text-center mb-4">
              <span className="text-xs text-slate-400">
                زاوية الطي الحالية: <span className="font-mono text-amber-400 font-bold">{foldAngle}°</span>
              </span>
            </div>

            {/* Visual Net Grid */}
            <div
              className="grid gap-2 transition-transform duration-300"
              style={{
                gridTemplateColumns: 'repeat(4, 60px)',
                gridTemplateRows: 'repeat(4, 60px)',
                transform: `perspective(600px) rotateX(${foldAngle * 0.4}deg) scale(${
                  1 - (foldAngle / 90) * 0.15
                })`
              }}
            >
              {Array.from({ length: 16 }).map((_, idx) => {
                const r = Math.floor(idx / 4);
                const c = idx % 4;
                const cell = currentChallenge.gridCells.find((cl) => cl.row === r && cl.col === c);

                if (!cell) {
                  return (
                    <div
                      key={idx}
                      className="w-[60px] h-[60px] rounded-lg border border-slate-800/40 bg-slate-900/20"
                    />
                  );
                }

                return (
                  <div
                    key={idx}
                    style={{
                      backgroundColor: cell.color || '#3b82f6',
                      transform: isFolding ? `rotateY(${foldAngle * 0.2}deg)` : 'none'
                    }}
                    className="w-[60px] h-[60px] rounded-xl shadow-lg border-2 border-white/30 flex flex-col items-center justify-center text-[10px] font-bold text-white transition-all hover:scale-105"
                  >
                    <span>{cell.label || 'وجه'}</span>
                  </div>
                );
              })}
            </div>

            {/* Faces counter */}
            <div className="absolute bottom-3 right-4 text-[11px] text-slate-400 bg-slate-800/80 px-3 py-1 rounded-lg border border-slate-700">
              عدد الأوجه: <strong className="text-white">{currentChallenge.facesCount}</strong>
            </div>
          </div>

          {/* Action Decision Buttons */}
          {!userChoice ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => handleAnswer('valid')}
                className="p-4 bg-emerald-50 hover:bg-emerald-100 active:bg-emerald-200 border-2 border-emerald-400 text-emerald-950 font-bold rounded-2xl flex items-center justify-center gap-3 transition-all cursor-pointer shadow-sm text-sm"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                  <Check className="w-5 h-5" />
                </div>
                <span>نعم، شبكة صالحة تطوى لمجسم سليم</span>
              </button>

              <button
                onClick={() => handleAnswer('invalid')}
                className="p-4 bg-rose-50 hover:bg-rose-100 active:bg-rose-200 border-2 border-rose-400 text-rose-950 font-bold rounded-2xl flex items-center justify-center gap-3 transition-all cursor-pointer shadow-sm text-sm"
              >
                <div className="w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center">
                  <X className="w-5 h-5" />
                </div>
                <span>لا، شبكة غير صالحة (تراكب أو نقص)</span>
              </button>
            </div>
          ) : (
            /* Feedback card */
            <div
              className={`p-5 rounded-2xl border ${
                feedback?.isCorrect
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                  : 'bg-rose-50 border-rose-300 text-rose-950'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white ${
                    feedback?.isCorrect ? 'bg-emerald-600' : 'bg-rose-600'
                  }`}
                >
                  {feedback?.isCorrect ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
                </div>
                <div className="space-y-1.5 flex-1">
                  <h5 className="font-bold text-sm">
                    {feedback?.isCorrect ? 'أحسنتِ، استنتاج هندسي ممتاز!' : 'توضيح المفاهيم:'}
                  </h5>
                  <p className="text-xs leading-relaxed whitespace-pre-line">{feedback?.text}</p>
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleNext}
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <span>
                    {currentIndex + 1 < CHALLENGES.length ? 'المرحلة التالية' : 'إتمام التحدي وتتويج النتيجة'}
                  </span>
                  <ArrowRight className="w-4 h-4 rotate-180" />
                </button>
              </div>
            </div>
          )}

          {/* Hint Strip */}
          <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
            <button
              onClick={() => {
                setShowHint(!showHint);
                sound.playClick();
              }}
              className="text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <HelpCircle className="w-4 h-4" />
              <span>{showHint ? 'إخفاء التلميح' : 'طلب تلميح توجيهي'}</span>
            </button>
            {showHint && (
              <span className="text-amber-700 bg-amber-50 px-3 py-1 rounded-lg border border-amber-200">
                💡 {currentChallenge.hint}
              </span>
            )}
          </div>
        </div>
      ) : (
        /* Final Completion Screen */
        <div className="text-center py-10 space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-amber-400 text-slate-950 flex items-center justify-center mx-auto shadow-xl">
            <Trophy className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-black text-slate-900">
            مبارك! أتممتِ تحدي مهندس الشبكات 🏆
          </h3>
          <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
            لقد أتقنتِ بنجاح مهارات التمييز بين شبكات المكعب، متوازي المستطيلات، المنشور الثلاثي، والهرم الرباعي وفق معايير كامبريدج.
          </p>
          <div className="inline-block p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-950 font-bold text-sm">
            النتيجة النهائية: <span className="font-mono text-xl">{score} نقطة XP</span>
          </div>
          <div>
            <button
              onClick={handleRestart}
              className="mt-3 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>إعادة اللعبة لزيادة الإتقان</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
