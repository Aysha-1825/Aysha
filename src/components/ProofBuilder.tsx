import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, HelpCircle, ArrowRight, Award } from 'lucide-react';
import { sound } from '../utils/audio';

interface ProofBuilderProps {
  onEarnXp: (amount: number, reason: string) => void;
}

interface ProofProblem {
  id: string;
  title: string;
  description: string;
  diagramNotes: string;
  targetConclusion: string;
  steps: {
    statement: string;
    correctReason: string;
    options: string[];
    explanation: string;
  }[];
}

const PROOF_PROBLEMS: ProofProblem[] = [
  {
    id: 'proof-1',
    title: 'برهان 1: إثبات مجموع زوايا متوازي الأضلاع = 360°',
    description: 'في الشكل المقابل، أ ب ج د متوازي أضلاع. نريد إثبات أن مجموع زواياه الأربع يساوي 360° باستخدام قطر يقسمه.',
    diagramNotes: 'رسم القطر (أ ج) يقسم متوازي الأضلاع إلى مثلثين: المثلث (أ ب ج) والمثلث (أ د ج).',
    targetConclusion: 'مجموع قياسات زوايا الشكل الرباعي = 360°',
    steps: [
      {
        statement: 'الخطوة 1: مجموع قياسات زوايا المثلث الأول (أ ب ج) = 180°',
        correctReason: 'مبرهنة مجموع زوايا المثلث = 180°',
        options: [
          'مبرهنة مجموع زوايا المثلث = 180°',
          'لأنهما زاويتان متقابلتان بالرأس',
          'بالتبادل والتوازي',
          'الزوايا على خط مستقيم'
        ],
        explanation: 'أي مثلث في المستوى الإقليدي يكون مجموع قياسات زواياه الداخلية دائماً 180°.'
      },
      {
        statement: 'الخطوة 2: مجموع قياسات زوايا المثلث الثاني (أ د ج) = 180°',
        correctReason: 'مبرهنة مجموع زوايا المثلث = 180°',
        options: [
          'مبرهنة مجموع زوايا المثلث = 180°',
          'بالتناظر والتوازي',
          'مبرهنة الزاوية الخارجة',
          'بالتقابل بالرأس'
        ],
        explanation: 'المثلث الثاني تنطبق عليه نفس المبرهنة العامة المستقلة.'
      },
      {
        statement: 'الخطوة 3: زوايا متوازي الأضلاع الأربع = زوايا المثلث الأول + زوايا المثلث الثاني = 180° + 180° = 360°',
        correctReason: 'خاصية جمع الزوايا المتجاورة المكونة للشكل الرباعي',
        options: [
          'خاصية جمع الزوايا المتجاورة المكونة للشكل الرباعي',
          'لأن الأضلاع متساوية في الطول',
          'مبرهنة فيثاغورس',
          'بالتبادل على حرف Z'
        ],
        explanation: 'اتحاد زوايا المثلثين الناتجين عن رسم القطر يشكل بالضبط الزوايا الأربع لمتوازي الأضلاع دون زيادة أو نقصان.'
      }
    ]
  },
  {
    id: 'proof-2',
    title: 'برهان 2: إثبات أن قياس الزاوية الخارجة = مجموع الداخلتين المقابلتين',
    description: 'في المثلث (أ ب ج)، تم مد الضلع (ب ج) على استقامته إلى النقطة (د) لتتكون زاوية خارجة (أ ج د).',
    diagramNotes: 'الزاوية (أ ج ب) والزاوية الخارجة (أ ج د) تقعان على نفس الخط المستقيم (ب ج د).',
    targetConclusion: 'ق(أ ج د) = ق(أ) + ق(ب)',
    steps: [
      {
        statement: 'الخطوة 1: ق(أ) + ق(ب) + ق(أ ج ب) = 180°',
        correctReason: 'مجموع قياسات زوايا المثلث = 180°',
        options: [
          'مجموع قياسات زوايا المثلث = 180°',
          'الزوايا المتناظرة بين متوازيين',
          'زاويتان متقابلتان بالرأس',
          'زاويتان متبادلتان'
        ],
        explanation: 'مجموع زوايا المثلث الداخلية الثلاث هو 180°.'
      },
      {
        statement: 'الخطوة 2: ق(أ ج ب) + ق(أ ج د) = 180°',
        correctReason: 'زاويتان متجاورتان على خط مستقيم واحد (متكاملتان)',
        options: [
          'زاويتان متجاورتان على خط مستقيم واحد (متكاملتان)',
          'مبرهنة التبادل والتوازي',
          'مجموع زوايا حول نقطة',
          'مبرهنة فيثاغورس'
        ],
        explanation: 'لأن المستقيم ب ج د مستقيم ممتد، والزاويتان تشكلان زاوية مستقيمة قياسها 180°.'
      },
      {
        statement: 'الخطوة 3: بحذف ق(أ ج ب) المشتركة من المعادلتين، نجد أن: ق(أ ج د) = ق(أ) + ق(ب)',
        correctReason: 'التعويض والحذف المنطقي بين معادلتي الـ 180°',
        options: [
          'التعويض والحذف المنطقي بين معادلتي الـ 180°',
          'لأن الأضلاع متوازية',
          'بالتقابل بالرأس',
          'بالتناظر على حرف F'
        ],
        explanation: 'كلا المقدارين يعادلان (180° - ق(أ ج ب))، لذا هما متساويان حتماً.'
      }
    ]
  }
];

export const ProofBuilder: React.FC<ProofBuilderProps> = ({ onEarnXp }) => {
  const [currentProblemIndex, setCurrentProblemIndex] = useState<number>(0);
  const [selectedReasons, setSelectedReasons] = useState<Record<number, string>>({});
  const [feedback, setFeedback] = useState<Record<number, boolean | null>>({});
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const problem = PROOF_PROBLEMS[currentProblemIndex];

  const handleSelectReason = (stepIndex: number, reason: string) => {
    setSelectedReasons((prev) => ({ ...prev, [stepIndex]: reason }));
    const isCorrect = reason === problem.steps[stepIndex].correctReason;
    setFeedback((prev) => ({ ...prev, [stepIndex]: isCorrect }));

    if (isCorrect) {
      sound.playCorrect();
      onEarnXp(15, `صياغة التبرير الرياضي للخطوة ${stepIndex + 1}`);

      // Check if all steps correct
      const allCorrect = problem.steps.every(
        (_, idx) => (idx === stepIndex ? isCorrect : feedback[idx] === true)
      );
      if (allCorrect) {
        setIsCompleted(true);
        sound.playCheckpoint();
        onEarnXp(40, `إنجاز البرهان الهندسي الكامل: ${problem.title}`);
      }
    } else {
      sound.playWrong();
    }
  };

  const resetProblem = () => {
    setSelectedReasons({});
    setFeedback({});
    setIsCompleted(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 text-purple-600 font-semibold text-sm mb-1">
            <ShieldCheck className="w-5 h-5" />
            <span>بناء الاستدلال والحجة الرياضية: حل مسائل الزوايا وبراهينها</span>
          </div>
          <h3 className="text-xl font-bold text-slate-800">
            مُنشئ البراهين الهندسية المنطقية (Geometric Proof Builder)
          </h3>
          <p className="text-sm text-slate-500 mt-0.5">
            اختاري السبب الهندسي المعتمد لكل خطوة استنتاجية لبناء برهان رياضي متماسك ومحكم
          </p>
        </div>

        {/* Problem selector */}
        <div className="flex items-center gap-2">
          {PROOF_PROBLEMS.map((p, idx) => (
            <button
              key={p.id}
              onClick={() => {
                setCurrentProblemIndex(idx);
                resetProblem();
                sound.playClick();
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                currentProblemIndex === idx
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              مسألة {idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Problem Card Overview */}
      <div className="bg-purple-50/70 border border-purple-200 rounded-xl p-4 mt-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h4 className="text-base font-bold text-purple-900">{problem.title}</h4>
            <p className="text-xs text-slate-700 mt-1 leading-relaxed">{problem.description}</p>
            <p className="text-xs text-purple-700 mt-1 font-medium bg-white/70 inline-block px-2 py-0.5 rounded border border-purple-200">
              📌 {problem.diagramNotes}
            </p>
          </div>
          <div className="shrink-0 text-left bg-white px-3 py-2 rounded-lg border border-purple-200 text-xs">
            <div className="text-slate-500 text-[10px]">المطلوب إثباته:</div>
            <div className="font-bold text-purple-800">{problem.targetConclusion}</div>
          </div>
        </div>
      </div>

      {/* Steps List */}
      <div className="space-y-4 mt-6">
        {problem.steps.map((step, idx) => {
          const isSelected = selectedReasons[idx] !== undefined;
          const isCorrect = feedback[idx] === true;
          const isWrong = feedback[idx] === false;

          return (
            <div
              key={idx}
              className={`p-4 rounded-xl border transition-all ${
                isCorrect
                  ? 'bg-emerald-50/60 border-emerald-300'
                  : isWrong
                  ? 'bg-rose-50/60 border-rose-300'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      isCorrect
                        ? 'bg-emerald-600 text-white'
                        : isWrong
                        ? 'bg-rose-600 text-white'
                        : 'bg-slate-300 text-slate-700'
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <span className="text-sm font-bold text-slate-800">{step.statement}</span>
                </div>

                {/* Reason Selection Dropdown */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-medium">السبب الهندسي:</span>
                  <select
                    value={selectedReasons[idx] || ''}
                    onChange={(e) => handleSelectReason(idx, e.target.value)}
                    disabled={isCorrect}
                    className={`text-xs p-2 rounded-lg border font-medium focus:ring-2 focus:ring-purple-400 outline-none ${
                      isCorrect
                        ? 'bg-emerald-100 text-emerald-900 border-emerald-400 font-bold'
                        : isWrong
                        ? 'bg-rose-100 text-rose-900 border-rose-400'
                        : 'bg-white text-slate-700 border-slate-300'
                    }`}
                  >
                    <option value="">-- اختاري السبب الرياضي المناسب --</option>
                    {step.options.map((opt, oIdx) => (
                      <option key={oIdx} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Step Explanation / Feedback */}
              {isSelected && (
                <div
                  className={`mt-3 pt-3 border-t text-xs flex items-center justify-between ${
                    isCorrect
                      ? 'border-emerald-200 text-emerald-800'
                      : 'border-rose-200 text-rose-800'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    {isCorrect ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <HelpCircle className="w-4 h-4 text-rose-600" />
                    )}
                    <span>{step.explanation}</span>
                  </div>
                  {isCorrect && (
                    <span className="font-bold text-emerald-700 bg-white px-2 py-0.5 rounded shadow-xs">
                      +15 XP
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Completion Banner */}
      {isCompleted && (
        <div className="mt-6 p-5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <Award className="w-6 h-6 text-yellow-300" />
            </div>
            <div>
              <h4 className="text-base font-bold">مبارك! أتممتِ صياغة البرهان الهندسي بنجاح 🌟</h4>
              <p className="text-xs text-purple-100 mt-0.5">
                تم اعتماد برهانكِ الرياضي وفق معايير كامبريدج الهندسية بنجاح (+40 نقطة إضافية).
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              if (currentProblemIndex < PROOF_PROBLEMS.length - 1) {
                setCurrentProblemIndex((prev) => prev + 1);
                resetProblem();
              } else {
                resetProblem();
              }
              sound.playClick();
            }}
            className="px-4 py-2 bg-white text-purple-700 font-bold text-xs rounded-lg hover:bg-purple-50 transition-colors shrink-0 flex items-center gap-1.5"
          >
            <span>{currentProblemIndex < PROOF_PROBLEMS.length - 1 ? 'المسألة التالية' : 'إعادة البرهان'}</span>
            <ArrowRight className="w-3.5 h-3.5 rotate-180" />
          </button>
        </div>
      )}
    </div>
  );
};
