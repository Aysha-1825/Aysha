import React, { useState, useEffect } from 'react';
import { Compass, Zap, Trophy, Sparkles, Timer, RotateCcw, Check, X, ArrowRight, Shield } from 'lucide-react';
import { sound } from '../../utils/audio';

interface AngleSniperGameProps {
  onEarnXp: (amount: number, reason: string) => void;
}

interface SniperTarget {
  id: number;
  theoremName: string;
  theoremSymbol: string;
  diagramType: 'parallel_z' | 'parallel_f' | 'parallel_c' | 'vertically_opposite' | 'triangle_exterior';
  givenAngle: number;
  targetAngle: number;
  options: number[];
  reasonQuestion: string;
  reasonOptions: string[];
  correctReasonIndex: number;
  explanation: string;
}

const TARGETS: SniperTarget[] = [
  {
    id: 1,
    theoremName: 'الزوايا المتبادلة (Alternate Angles)',
    theoremSymbol: 'حرف Z',
    diagramType: 'parallel_z',
    givenAngle: 54,
    targetAngle: 54,
    options: [54, 126, 46, 90],
    reasonQuestion: 'ما هو التبرير الهندسي الصحيح لتساوي الزاويتين؟',
    reasonOptions: [
      'بالتبادل بين خطين متوازيين (Alternate angles)',
      'بالتناظر (Corresponding angles)',
      'لأنهما متكاملتان ومجموعهما 180°',
      'بالتقابل بالرأس (Vertically opposite)'
    ],
    correctReasonIndex: 0,
    explanation: 'الزاويتان تقعان في وضعي تبادل على شكل حرف Z بين مستقيمين متوازيين، لذا فهما متساويتان تماماً: س = 54°.'
  },
  {
    id: 2,
    theoremName: 'الزوايا المتناظرة (Corresponding Angles)',
    theoremSymbol: 'حرف F',
    diagramType: 'parallel_f',
    givenAngle: 118,
    targetAngle: 118,
    options: [62, 118, 120, 180],
    reasonQuestion: 'ما التبرير الهندسي لقيمة الزاوية س؟',
    reasonOptions: [
      'بالتناظر بين مستقيمين متوازيين (شكل F)',
      'بالتبادل (شكل Z)',
      'زوايا خط مستقيم',
      'مجموع زوايا المثلث'
    ],
    correctReasonIndex: 0,
    explanation: 'الزاويتان في نفس الموضع النسبي على شكل حرف F بالنسبة للقاطع والخطين المتوازيين، فهما متناظرتان ومتساويتان: س = 118°.'
  },
  {
    id: 3,
    theoremName: 'الزوايا الداخلية في جهة واحدة (Co-interior Angles)',
    theoremSymbol: 'حرف C',
    diagramType: 'parallel_c',
    givenAngle: 68,
    targetAngle: 112,
    options: [68, 112, 122, 90],
    reasonQuestion: 'كيف نبرر قياس الزاوية س = 112°؟',
    reasonOptions: [
      'زاويتان داخلتان في جهة واحدة ومجموعهما = 180°',
      'زاويتان متبادلتان ومتساويتان',
      'زاويتان متقابلتان بالرأس',
      'زوايا متتامة مجموعها 90°'
    ],
    correctReasonIndex: 0,
    explanation: 'الزاويتان الداخليتان المحصورتان بين مستقيمين متوازيين في جهة واحدة من القاطع متكاملتان: س = 180° - 68° = 112°.'
  },
  {
    id: 4,
    theoremName: 'الزوايا المتقابلة بالرأس (Vertically Opposite)',
    theoremSymbol: 'شكل X',
    diagramType: 'vertically_opposite',
    givenAngle: 142,
    targetAngle: 142,
    options: [38, 142, 180, 48],
    reasonQuestion: 'ما هو سبب تساوي الزاويتين المتقاطعتين؟',
    reasonOptions: [
      'متقابلتان بالرأس ناتجتان عن تقاطع مستقيمين',
      'بالتبادل بين خطين متوازيين',
      'مجموع زوايا حول نقطة',
      'بالتناظر'
    ],
    correctReasonIndex: 0,
    explanation: 'عند تقاطع أي مستقيمين، تكون الزاويتان المتقابلتان بالرأس متساويتين تماماً: س = 142°.'
  },
  {
    id: 5,
    theoremName: 'الزاوية الخارجة للمثلث (Exterior Angle Theorem)',
    theoremSymbol: 'المثلث والامتداد',
    diagramType: 'triangle_exterior',
    givenAngle: 45, // other is 75, so exterior is 120
    targetAngle: 120,
    options: [120, 60, 110, 135],
    reasonQuestion: 'ما هي المبرهنة الهندسية لحساب قياس الزاوية الخارجة؟',
    reasonOptions: [
      'الزاوية الخارجة للمثلث = مجموع الزاويتين الداخلتين المقابلتين',
      'الزاوية الخارجة = 180° دائماً',
      'بالتبادل مع رأس المثلث',
      'مجموع زوايا المثلث = 360°'
    ],
    correctReasonIndex: 0,
    explanation: 'مبرهنة كامبريدج: قياس الزاوية الخارجة لأي مثلث يساوي مجموع قياسي الزاويتين الداخلتين المقابلتين (45° + 75° = 120°).'
  }
];

export const AngleSniperGame: React.FC<AngleSniperGameProps> = ({ onEarnXp }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [step, setStep] = useState<'value' | 'reason' | 'result'>('value');
  const [selectedAngle, setSelectedAngle] = useState<number | null>(null);
  const [selectedReason, setSelectedReason] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(25);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [laserFired, setLaserFired] = useState<boolean>(false);

  const currentTarget = TARGETS[currentIndex];

  // Timer countdown
  useEffect(() => {
    if (isCompleted || step === 'result') return;
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          handleTimeOut();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [currentIndex, step, isCompleted]);

  const handleTimeOut = () => {
    sound.playWrong();
    setStep('result');
    setCombo(0);
  };

  const handleSelectAngle = (val: number) => {
    sound.playClick();
    setSelectedAngle(val);
    setLaserFired(true);
    setTimeout(() => setLaserFired(false), 500);

    if (val === currentTarget.targetAngle) {
      sound.playLaser();
      setStep('reason');
    } else {
      sound.playWrong();
      setCombo(0);
      setStep('result');
    }
  };

  const handleSelectReason = (idx: number) => {
    setSelectedReason(idx);
    const isCorrect = idx === currentTarget.correctReasonIndex && selectedAngle === currentTarget.targetAngle;

    if (isCorrect) {
      sound.playCorrect();
      const bonus = 40 + combo * 10 + Math.floor(timeLeft * 1.5);
      setScore((s) => s + bonus);
      setCombo((c) => c + 1);
      onEarnXp(bonus, `قنص مبرهنة ${currentTarget.theoremName}`);
    } else {
      sound.playWrong();
      setCombo(0);
    }
    setStep('result');
  };

  const handleNext = () => {
    sound.playClick();
    setSelectedAngle(null);
    setSelectedReason(null);
    setTimeLeft(25);
    setStep('value');

    if (currentIndex + 1 < TARGETS.length) {
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
    setSelectedAngle(null);
    setSelectedReason(null);
    setTimeLeft(25);
    setStep('value');
    setIsCompleted(false);
  };

  return (
    <div className="bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl p-5 sm:p-7 text-white select-none">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-indigo-500 text-white font-black flex items-center justify-center text-xs shadow-md">
              <Zap className="w-4 h-4 text-amber-300" />
            </span>
            <h3 className="text-lg font-black text-indigo-300">
              قناص مبرهنات التوازي والمثلثات السريع (الدرس 3-2)
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            احسبي الزاوية المجهولة س بدقة، وحددي السبب الهندسي المعتمد قبل نفاد المؤقت!
          </p>
        </div>

        {/* Meters */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700 text-xs font-mono">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="font-bold text-amber-300">{score} نقطة</span>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700 text-xs font-mono">
            <Timer className={`w-4 h-4 ${timeLeft < 8 ? 'text-rose-400 animate-spin' : 'text-emerald-400'}`} />
            <span className={`font-bold ${timeLeft < 8 ? 'text-rose-400' : 'text-emerald-300'}`}>
              {timeLeft} ث
            </span>
          </div>

          {combo > 1 && (
            <div className="flex items-center gap-1 bg-amber-500/20 px-2.5 py-1 rounded-xl border border-amber-400/40 text-xs text-amber-300 font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>×{combo} Combo</span>
            </div>
          )}

          <div className="bg-slate-800 px-2.5 py-1 rounded-lg text-xs font-bold text-slate-400 border border-slate-700">
            {currentIndex + 1} / {TARGETS.length}
          </div>
        </div>
      </div>

      {!isCompleted ? (
        <div className="mt-6 space-y-6">
          {/* Challenge Description */}
          <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/30">
                المبرهنة: {currentTarget.theoremName} ({currentTarget.theoremSymbol})
              </span>
              <h4 className="text-sm sm:text-base font-bold text-white mt-2">
                {step === 'value'
                  ? 'الخطوة 1: احسبي قياس الزاوية المجهولة س° واختاري القيمة المناسبة:'
                  : step === 'reason'
                  ? currentTarget.reasonQuestion
                  : 'تحليل وتأكيد النتيجة:'}
              </h4>
            </div>

            <div className="text-xs text-slate-400 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-700">
              الهدف: الزاوية س = ?
            </div>
          </div>

          {/* Dynamic Laser Diagram Canvas */}
          <div className="relative bg-slate-950 rounded-2xl border-2 border-indigo-500/30 p-6 flex flex-col items-center justify-center overflow-hidden min-h-[240px]">
            {laserFired && (
              <div className="absolute inset-0 bg-indigo-500/15 pointer-events-none animate-ping" />
            )}

            <svg viewBox="0 0 500 200" className="w-full max-w-lg h-auto">
              <defs>
                <linearGradient id="laserGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#818cf8" />
                  <stop offset="100%" stopColor="#38bdf8" />
                </linearGradient>
              </defs>

              {/* Diagram Renderers */}
              {currentTarget.diagramType.startsWith('parallel') && (
                <>
                  {/* Two Parallel lines */}
                  <line x1="40" y1="60" x2="460" y2="60" stroke="#64748b" strokeWidth="4" />
                  <line x1="40" y1="140" x2="460" y2="140" stroke="#64748b" strokeWidth="4" />
                  {/* Arrowheads for parallel */}
                  <polygon points="250,56 260,60 250,64" fill="#38bdf8" />
                  <polygon points="250,136 260,140 250,144" fill="#38bdf8" />

                  {/* Transversal Line */}
                  <line x1="120" y1="20" x2="380" y2="180" stroke="#f59e0b" strokeWidth="4" />

                  {/* Angles arcs and labels */}
                  {currentTarget.diagramType === 'parallel_z' && (
                    <>
                      {/* Top angle */}
                      <path d="M 200 60 A 30 30 0 0 1 185 85" fill="none" stroke="#10b981" strokeWidth="3" />
                      <text x="165" y="80" fill="#10b981" fontSize="14" fontWeight="bold">
                        {currentTarget.givenAngle}°
                      </text>

                      {/* Bottom angle (Alternate) */}
                      <path d="M 300 140 A 30 30 0 0 1 315 115" fill="none" stroke="#f43f5e" strokeWidth="3" />
                      <text x="325" y="130" fill="#f43f5e" fontSize="16" fontWeight="bold">
                        س°
                      </text>
                    </>
                  )}

                  {currentTarget.diagramType === 'parallel_f' && (
                    <>
                      {/* Top corresponding */}
                      <path d="M 210 60 A 30 30 0 0 0 185 45" fill="none" stroke="#10b981" strokeWidth="3" />
                      <text x="160" y="45" fill="#10b981" fontSize="14" fontWeight="bold">
                        {currentTarget.givenAngle}°
                      </text>

                      {/* Bottom corresponding */}
                      <path d="M 340 140 A 30 30 0 0 0 315 125" fill="none" stroke="#f43f5e" strokeWidth="3" />
                      <text x="290" y="125" fill="#f43f5e" fontSize="16" fontWeight="bold">
                        س°
                      </text>
                    </>
                  )}

                  {currentTarget.diagramType === 'parallel_c' && (
                    <>
                      {/* Interior 1 */}
                      <path d="M 200 60 A 30 30 0 0 1 185 85" fill="none" stroke="#10b981" strokeWidth="3" />
                      <text x="160" y="85" fill="#10b981" fontSize="14" fontWeight="bold">
                        {currentTarget.givenAngle}°
                      </text>

                      {/* Interior 2 (Co-interior) */}
                      <path d="M 280 140 A 30 30 0 0 0 295 115" fill="none" stroke="#f43f5e" strokeWidth="3" />
                      <text x="260" y="125" fill="#f43f5e" fontSize="16" fontWeight="bold">
                        س°
                      </text>
                    </>
                  )}
                </>
              )}

              {currentTarget.diagramType === 'vertically_opposite' && (
                <>
                  <line x1="80" y1="40" x2="420" y2="160" stroke="#64748b" strokeWidth="4" />
                  <line x1="80" y1="160" x2="420" y2="40" stroke="#f59e0b" strokeWidth="4" />

                  {/* Left angle */}
                  <text x="180" y="105" fill="#10b981" fontSize="15" fontWeight="bold">
                    {currentTarget.givenAngle}°
                  </text>
                  {/* Right angle */}
                  <text x="300" y="105" fill="#f43f5e" fontSize="17" fontWeight="bold">
                    س°
                  </text>
                </>
              )}

              {currentTarget.diagramType === 'triangle_exterior' && (
                <>
                  {/* Triangle with base extension */}
                  <line x1="100" y1="150" x2="440" y2="150" stroke="#64748b" strokeWidth="4" />
                  <line x1="100" y1="150" x2="250" y2="40" stroke="#64748b" strokeWidth="4" />
                  <line x1="250" y1="40" x2="330" y2="150" stroke="#64748b" strokeWidth="4" />

                  {/* Interior angles */}
                  <text x="135" y="140" fill="#10b981" fontSize="13" fontWeight="bold">
                    45°
                  </text>
                  <text x="240" y="70" fill="#38bdf8" fontSize="13" fontWeight="bold">
                    75°
                  </text>

                  {/* Exterior angle */}
                  <path d="M 350 150 A 24 24 0 0 0 335 125" fill="none" stroke="#f43f5e" strokeWidth="3" />
                  <text x="355" y="135" fill="#f43f5e" fontSize="16" fontWeight="bold">
                    س°
                  </text>
                </>
              )}
            </svg>
          </div>

          {/* Interactive Steps Controls */}
          {step === 'value' && (
            <div>
              <div className="text-xs text-slate-400 mb-3 text-right">
                انقري على قياس الزاوية س° لقنص الهدف فوراً:
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {currentTarget.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectAngle(opt)}
                    className="p-4 bg-slate-800 hover:bg-indigo-600 active:bg-indigo-700 border-2 border-slate-700 hover:border-indigo-400 rounded-2xl text-center font-black font-mono text-lg text-white transition-all cursor-pointer shadow-md"
                  >
                    {opt}°
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 'reason' && (
            <div className="space-y-3">
              <div className="text-xs text-amber-300 font-bold text-right flex items-center justify-between">
                <span>أحسنتِ في حساب الرقم! الآن اختاري التبرير الرياضي المعتمد:</span>
                <span className="font-mono text-emerald-400">س = {selectedAngle}° ✓</span>
              </div>
              <div className="space-y-2.5">
                {currentTarget.reasonOptions.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectReason(idx)}
                    className="w-full p-4 bg-slate-800 hover:bg-slate-750 active:bg-indigo-700 border border-slate-700 hover:border-indigo-400 rounded-xl text-xs sm:text-sm font-bold text-slate-100 text-right transition-all flex items-center justify-between cursor-pointer"
                  >
                    <span>{opt}</span>
                    <span className="w-6 h-6 rounded-lg bg-slate-700 flex items-center justify-center text-xs text-slate-300">
                      {idx + 1}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 'result' && (
            <div
              className={`p-5 rounded-2xl border ${
                selectedAngle === currentTarget.targetAngle &&
                selectedReason === currentTarget.correctReasonIndex
                  ? 'bg-emerald-950/60 border-emerald-500 text-emerald-100'
                  : 'bg-rose-950/60 border-rose-500 text-rose-100'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    selectedAngle === currentTarget.targetAngle &&
                    selectedReason === currentTarget.correctReasonIndex
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-rose-500 text-white'
                  }`}
                >
                  {selectedAngle === currentTarget.targetAngle &&
                  selectedReason === currentTarget.correctReasonIndex ? (
                    <Check className="w-5 h-5 font-black" />
                  ) : (
                    <X className="w-5 h-5 font-black" />
                  )}
                </div>
                <div className="space-y-2 flex-1">
                  <h5 className="font-black text-sm sm:text-base">
                    {selectedAngle === currentTarget.targetAngle &&
                    selectedReason === currentTarget.correctReasonIndex
                      ? 'إصابة دقيقة وتبرير هندسي سليم 100%!'
                      : 'تصحيح المبرهنة الهندسية:'}
                  </h5>
                  <p className="text-xs sm:text-sm leading-relaxed">{currentTarget.explanation}</p>
                </div>
              </div>

              <div className="mt-5 flex justify-end">
                <button
                  onClick={handleNext}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <span>
                    {currentIndex + 1 < TARGETS.length ? 'المبرهنة التالية ◄' : 'إنهاء الجولة وتتويج النتيجة'}
                  </span>
                  <ArrowRight className="w-4 h-4 rotate-180" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Victory Screen */
        <div className="text-center py-10 space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-amber-400 text-slate-950 flex items-center justify-center mx-auto shadow-xl">
            <Trophy className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-black text-amber-300">
            مبارك! لقد اجتزتِ جولة قناص الزوايا ببراعة 🌟
          </h3>
          <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
            تمكنتِ من توظيف مبرهنات التوازي (التبادل والتناظر والداخلة) ومبرهنة الزاوية الخارجة للمثلث بدقة متناهية.
          </p>
          <div className="inline-block p-4 bg-slate-800 border border-slate-700 rounded-2xl text-amber-300 font-bold text-sm">
            مجموع النقاط: <span className="font-mono text-xl">{score} نقطة XP</span>
          </div>
          <div>
            <button
              onClick={handleRestart}
              className="mt-3 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>جولة جديدة لكسر الرقم القياسي</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
