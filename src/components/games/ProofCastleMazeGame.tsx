import React, { useState } from 'react';
import { Shield, Key, Trophy, Sparkles, Check, X, ArrowRight, RotateCcw, Lock, Unlock } from 'lucide-react';
import { sound } from '../../utils/audio';

interface ProofCastleMazeGameProps {
  onEarnXp: (amount: number, reason: string) => void;
}

interface CastleRoom {
  id: number;
  name: string;
  badgeTitle: string;
  problemText: string;
  shapeDescription: string;
  step1: {
    prompt: string;
    options: string[];
    correct: number;
    explanation: string;
  };
  step2: {
    prompt: string;
    options: string[];
    correct: number;
    explanation: string;
  };
  rewardKey: string;
}

const ROOMS: CastleRoom[] = [
  {
    id: 1,
    name: 'قاعة متوازي الأضلاع التاريخية',
    badgeTitle: 'مفتاح الزمرد الهندسي',
    problemText: 'في متوازي الأضلاع أ ب جـ د، قياس الزاوية أ = 70°. المطلوب برهان قياس الزاويتين ب و جـ.',
    shapeDescription: 'متوازي أضلاع فيه كل ضلعين متقابلين متوازيان ومتطابقان.',
    step1: {
      prompt: 'الخطوة الأولى: ما قياس الزاوية ب المجاورة للزاوية أ وما التبرير؟',
      options: [
        'قياس ب = 110° لأن الزاويتين المتتاليتين متكاملتان (مجموعهما 180°)',
        'قياس ب = 70° بالتقابل',
        'قياس ب = 90° زاوية قائمة',
        'قياس ب = 140°'
      ],
      correct: 0,
      explanation: 'في متوازي الأضلاع، أي زاويتين متتاليتين داخليتين مجموعهما 180°: ب = 180 - 70 = 110°.'
    },
    step2: {
      prompt: 'الخطوة الثانية: ما قياس الزاوية جـ المقابلة للزاوية أ؟',
      options: [
        'قياس جـ = 70° لأن كل زاويتين متقابلتين في متوازي الأضلاع متساويتان',
        'قياس جـ = 110°',
        'قياس جـ = 180°',
        'قياس جـ = 35°'
      ],
      correct: 0,
      explanation: 'خاصية متوازي الأضلاع المعتمدة: كل زاويتين متقابلتين متساويتان في القياس، إذن زاوية جـ = زاوية أ = 70°.'
    },
    rewardKey: 'مفتاح الزمرد 🗝️'
  },
  {
    id: 2,
    name: 'قاعة المضلع السداسي والمرصد',
    badgeTitle: 'مفتاح الياقوت الرياضي',
    problemText: 'نريد حساب مجموع قياسات زوايا المضلع السداسي المنتظم، ثم قياس كل زاوية داخلية منه.',
    shapeDescription: 'مضلع سداسي له 6 أضلاع و 6 زوايا.',
    step1: {
      prompt: 'الخطوة الأولى: كيف نقسم السداسي من رأس واحد إلى مثلثات لحساب مجموع زواياه؟',
      options: [
        'ينقسم إلى 4 مثلثات: مجموع الزوايا = 4 × 180° = 720°',
        'ينقسم إلى 6 مثلثات = 1080°',
        'مجموع زواياه 360° دائماً',
        'ينقسم إلى مثلثين = 360°'
      ],
      correct: 0,
      explanation: 'القاعدة: عدد المثلثات = (ن - 2) = 6 - 2 = 4 مثلثات. مجموع الزوايا = 4 × 180° = 720°.'
    },
    step2: {
      prompt: 'الخطوة الثانية: بما أن السداسي منتظم، فما قياس كل زاوية داخلية واحدة؟',
      options: [
        '720° ÷ 6 = 120° لكل زاوية',
        '720° ÷ 4 = 180°',
        '360° ÷ 6 = 60°',
        '100°'
      ],
      correct: 0,
      explanation: 'لإيجاد قياس زاوية السداسي المنتظم نقسم المجموع الكلي على عدد الزوايا: 720° ÷ 6 = 120°.'
    },
    rewardKey: 'مفتاح الياقوت 🗝️'
  },
  {
    id: 3,
    name: 'قاعة البرهان الثلاثي ومثلث متساوي الساقين',
    badgeTitle: 'مفتاح الماس الملكي',
    problemText: 'في مثلث متساوي الساقين، زاوية الرأس = 40°. امتد أحد أضلاع القاعدة ليشكل زاوية خارجة س°.',
    shapeDescription: 'مثلث فيه ضلعان متطابقان وزاويتا القاعدة متساويتان.',
    step1: {
      prompt: 'الخطوة الأولى: ما قياس زاويتي القاعدة المتساويتين؟',
      options: [
        '(180 - 40) ÷ 2 = 140 ÷ 2 = 70° لكل زاوية قاعدة',
        '40° لكل زاوية',
        '90° لكل زاوية',
        '60°'
      ],
      correct: 0,
      explanation: 'مجموع زوايا المثلث 180°، نطرح زاوية الرأس 40° ونقسم الباقي 140° على 2 = 70° لكل زاوية قاعدة.'
    },
    step2: {
      prompt: 'الخطوة الثانية: ما قياس الزاوية الخارجة المجاورة لزاوية القاعدة 70°؟',
      options: [
        '180° - 70° = 110° (زوايا خط مستقيم)',
        '70° بالتبادل',
        '40° زاوية الرأس',
        '140°'
      ],
      correct: 0,
      explanation: 'الزاوية الخارجة وزاوية القاعدة تقعان على خط مستقيم ومجموعهما 180°: 180 - 70 = 110° (أو 40 + 70 = 110° الداخلتين المقابلتين).'
    },
    rewardKey: 'مفتاح الماس 💎'
  }
];

export const ProofCastleMazeGame: React.FC<ProofCastleMazeGameProps> = ({ onEarnXp }) => {
  const [currentRoomIndex, setCurrentRoomIndex] = useState<number>(0);
  const [activeStep, setActiveStep] = useState<1 | 2>(1);
  const [unlockedRooms, setUnlockedRooms] = useState<number[]>([]);
  const [collectedKeys, setCollectedKeys] = useState<string[]>([]);
  const [score, setScore] = useState<number>(0);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const currentRoom = ROOMS[currentRoomIndex];

  const handleChooseStepOption = (choiceIndex: number) => {
    sound.playClick();
    const currentStepData = activeStep === 1 ? currentRoom.step1 : currentRoom.step2;
    const isCorrect = choiceIndex === currentStepData.correct;

    if (isCorrect) {
      sound.playCorrect();
      if (activeStep === 1) {
        setScore((s) => s + 25);
        onEarnXp(25, `إنجاز الخطوة الأولى في ${currentRoom.name}`);
        setFeedback({
          isCorrect: true,
          text: `ممتاز! خطوة استنتاجية محكمة:\n${currentStepData.explanation}`
        });
      } else {
        // Completed Room
        sound.playVictory();
        const roomBonus = 50;
        setScore((s) => s + roomBonus);
        setUnlockedRooms((prev) => [...prev, currentRoom.id]);
        setCollectedKeys((prev) => [...prev, currentRoom.rewardKey]);
        onEarnXp(roomBonus, `فتح بوابة ${currentRoom.name}`);
        setFeedback({
          isCorrect: true,
          text: `تم فتح البوابة بنجاح! حصلتِ على ${currentRoom.rewardKey} (+${roomBonus} نقطة):\n${currentStepData.explanation}`
        });
      }
    } else {
      sound.playWrong();
      setFeedback({
        isCorrect: false,
        text: `تنبيه برهاني: الحجة الرياضية غير دقيقة، دعينا نراجع المنطق:\n${currentStepData.explanation}`
      });
    }
  };

  const handleProceed = () => {
    sound.playClick();
    setFeedback(null);
    if (activeStep === 1) {
      setActiveStep(2);
    } else {
      // Advance to next room or finish
      if (currentRoomIndex + 1 < ROOMS.length) {
        setCurrentRoomIndex((i) => i + 1);
        setActiveStep(1);
      } else {
        setIsCompleted(true);
        sound.playVictory();
      }
    }
  };

  const handleRestart = () => {
    sound.playClick();
    setCurrentRoomIndex(0);
    setActiveStep(1);
    setUnlockedRooms([]);
    setCollectedKeys([]);
    setScore(0);
    setFeedback(null);
    setIsCompleted(false);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-5 sm:p-7 text-slate-800">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-purple-100 text-purple-800 font-black flex items-center justify-center text-xs border border-purple-300">
              <Shield className="w-4 h-4 text-purple-700" />
            </span>
            <h3 className="text-lg font-black text-slate-900">
              متاهة قلعة البراهين الهندسية (الدرس 3-3)
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            افتحي بوابات القاعات الأثرية خطوة بخطوة بالاستدلال الهندسي المنطقي المعتمد!
          </p>
        </div>

        {/* Meters */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200 text-xs font-mono">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span className="font-bold text-amber-900">{score} نقطة</span>
          </div>

          <div className="flex items-center gap-1 bg-purple-50 px-3 py-1.5 rounded-xl border border-purple-200 text-xs font-bold text-purple-800">
            <Key className="w-4 h-4 text-purple-600" />
            <span>{collectedKeys.length} / 3 مفاتيح</span>
          </div>
        </div>
      </div>

      {!isCompleted ? (
        <div className="mt-6 space-y-6">
          {/* Castle Map Rooms Navigation */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {ROOMS.map((rm, idx) => {
              const isCurrent = idx === currentRoomIndex;
              const isUnlocked = unlockedRooms.includes(rm.id);

              return (
                <div
                  key={rm.id}
                  className={`p-3.5 rounded-2xl border text-right transition-all flex items-center justify-between ${
                    isCurrent
                      ? 'bg-purple-50 border-purple-400 ring-2 ring-purple-100 shadow-sm'
                      : isUnlocked
                      ? 'bg-emerald-50/70 border-emerald-300 text-emerald-900'
                      : 'bg-slate-50 border-slate-200 text-slate-400 opacity-80'
                  }`}
                >
                  <div>
                    <div className="text-[11px] font-bold">
                      {isUnlocked ? 'مفتوحة ✓' : isCurrent ? 'قيد التحدي ⚡' : 'موصدة 🔒'}
                    </div>
                    <div className="text-xs font-black text-slate-800 mt-0.5">{rm.name}</div>
                  </div>
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-white border border-slate-200 shadow-xs">
                    {isUnlocked ? (
                      <Unlock className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Lock className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Current Chamber Card */}
          <div className="bg-slate-900 text-white p-5 sm:p-6 rounded-2xl border border-slate-800 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold text-purple-300">
                قاعة القلعة: {currentRoom.name}
              </span>
              <span className="text-xs font-mono text-amber-400 font-bold">
                الخطوة {activeStep} من 2
              </span>
            </div>

            <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700 space-y-1">
              <h4 className="text-sm font-bold text-amber-300">نص المسألة الهندسية:</h4>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {currentRoom.problemText}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">{currentRoom.shapeDescription}</p>
            </div>

            {/* Current Step Question */}
            <div className="space-y-3 pt-2">
              <h5 className="text-xs sm:text-sm font-bold text-white">
                {activeStep === 1 ? currentRoom.step1.prompt : currentRoom.step2.prompt}
              </h5>

              {!feedback ? (
                <div className="space-y-2.5">
                  {(activeStep === 1 ? currentRoom.step1.options : currentRoom.step2.options).map(
                    (opt, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleChooseStepOption(idx)}
                        className="w-full p-3.5 bg-slate-800 hover:bg-purple-900/40 active:bg-purple-900/60 border border-slate-700 hover:border-purple-400 rounded-xl text-xs sm:text-sm font-semibold text-slate-100 text-right transition-all flex items-center justify-between cursor-pointer"
                      >
                        <span className="leading-relaxed">{opt}</span>
                        <span className="w-5 h-5 rounded-md bg-slate-700 flex items-center justify-center text-[11px] text-slate-300 shrink-0 mr-2">
                          {idx + 1}
                        </span>
                      </button>
                    )
                  )}
                </div>
              ) : (
                /* Step Feedback */
                <div
                  className={`p-4 rounded-xl border text-xs leading-relaxed ${
                    feedback.isCorrect
                      ? 'bg-emerald-950/70 border-emerald-500 text-emerald-200'
                      : 'bg-rose-950/70 border-rose-500 text-rose-200'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    {feedback.isCorrect ? (
                      <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                    ) : (
                      <X className="w-5 h-5 text-rose-400 shrink-0" />
                    )}
                    <div className="space-y-1">
                      <div className="font-bold text-sm">
                        {feedback.isCorrect ? 'خطوة صحيحة ومبرهنة!' : 'ملاحظة توجيهية:'}
                      </div>
                      <p className="whitespace-pre-line">{feedback.text}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={handleProceed}
                      className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <span>
                        {activeStep === 1
                          ? 'الانتقال للخطوة الثانية ◄'
                          : currentRoomIndex + 1 < ROOMS.length
                          ? 'فتح القاعة التالية ◄'
                          : 'تتويج بطلة البراهين 👑'}
                      </span>
                      <ArrowRight className="w-4 h-4 rotate-180" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Final Victory Screen */
        <div className="text-center py-10 space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-amber-400 text-slate-950 flex items-center justify-center mx-auto shadow-xl">
            <Trophy className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-black text-slate-900">
            مبارك! فتحتِ كافة بوابات قلعة البراهين 🏰
          </h3>
          <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
            تمكنتِ من صياغة الحجج والبراهين الرياضية الدقيقة في متوازي الأضلاع والمضلعات والمثلثات وفق معايير كامبريدج.
          </p>
          <div className="flex flex-wrap justify-center gap-2 pt-2">
            {collectedKeys.map((k, idx) => (
              <span
                key={idx}
                className="px-3.5 py-1.5 bg-purple-50 border border-purple-200 rounded-xl text-xs font-bold text-purple-900"
              >
                {k}
              </span>
            ))}
          </div>
          <div className="inline-block p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-950 font-bold text-sm mt-3">
            النتيجة النهائية: <span className="font-mono text-xl">{score} نقطة XP</span>
          </div>
          <div>
            <button
              onClick={handleRestart}
              className="mt-3 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>إعادة اللعبة لترسيخ البراهين</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
