import React, { useState } from 'react';
import { Question } from '../types';
import { CheckCircle2, XCircle, Lightbulb, HelpCircle, Check, ArrowRight } from 'lucide-react';
import { sound } from '../utils/audio';

interface QuizSectionProps {
  questions: Question[];
  answeredQuestions: Record<string, boolean>;
  onAnswerQuestion: (questionId: string, isCorrect: boolean, points: number) => void;
}

export const QuizSection: React.FC<QuizSectionProps> = ({
  questions,
  answeredQuestions,
  onAnswerQuestion
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [fillValue, setFillValue] = useState<string>('');
  const [showHint, setShowHint] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const currentQ = questions[currentIndex];
  if (!currentQ) return null;

  const hasAlreadyAnswered = answeredQuestions[currentQ.id];

  const handleSubmit = () => {
    let correct = false;
    if (currentQ.type === 'mcq') {
      correct = selectedOption === currentQ.correctAnswer;
    } else if (currentQ.type === 'fill') {
      const cleanInput = fillValue.trim();
      correct = Number(cleanInput) === Number(currentQ.correctAnswer);
    }

    setIsCorrect(correct);
    setSubmitted(true);

    if (correct) {
      sound.playCorrect();
      onAnswerQuestion(currentQ.id, true, currentQ.points);
    } else {
      sound.playWrong();
      onAnswerQuestion(currentQ.id, false, 0);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption('');
      setFillValue('');
      setShowHint(false);
      setSubmitted(false);
      setIsCorrect(null);
      sound.playClick();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setSelectedOption('');
      setFillValue('');
      setShowHint(false);
      setSubmitted(false);
      setIsCorrect(null);
      sound.playClick();
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
      {/* Quiz Progress & Question Tracker */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500">
            السؤال {currentIndex + 1} من {questions.length}
          </span>
          <span className="text-slate-300">·</span>
          <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
            +{currentQ.points} نقطة XP
          </span>
        </div>

        {/* Question Selector Dots */}
        <div className="flex items-center gap-1.5">
          {questions.map((q, idx) => {
            const isDone = answeredQuestions[q.id];
            const isCurr = idx === currentIndex;
            return (
              <button
                key={q.id}
                onClick={() => {
                  setCurrentIndex(idx);
                  setSelectedOption('');
                  setFillValue('');
                  setShowHint(false);
                  setSubmitted(false);
                  setIsCorrect(null);
                  sound.playClick();
                }}
                className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                  isCurr
                    ? 'bg-slate-900 text-white'
                    : isDone
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Question Content */}
      <div className="mt-6">
        <h3 className="text-base font-bold text-slate-800 leading-relaxed">
          {currentQ.questionText}
        </h3>

        {/* MCQ Mode */}
        {currentQ.type === 'mcq' && currentQ.options && (
          <div className="space-y-2.5 mt-5">
            {currentQ.options.map((option, idx) => {
              const isSelected = selectedOption === option;
              let itemStyle = 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700';

              if (submitted) {
                if (option === currentQ.correctAnswer) {
                  itemStyle = 'bg-emerald-50 border-emerald-400 text-emerald-900 font-bold';
                } else if (isSelected && !isCorrect) {
                  itemStyle = 'bg-rose-50 border-rose-300 text-rose-800';
                }
              } else if (isSelected) {
                itemStyle = 'bg-indigo-50 border-indigo-500 text-indigo-900 font-bold ring-2 ring-indigo-200';
              }

              return (
                <button
                  key={idx}
                  onClick={() => {
                    if (!submitted) {
                      setSelectedOption(option);
                      sound.playClick();
                    }
                  }}
                  disabled={submitted}
                  className={`w-full p-3.5 text-right rounded-xl border text-sm flex items-center justify-between transition-all ${itemStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-md bg-white border border-slate-300 flex items-center justify-center text-xs font-bold text-slate-600 shrink-0">
                      {String.fromCharCode(1571 + idx)}
                    </span>
                    <span>{option}</span>
                  </div>
                  {submitted && option === currentQ.correctAnswer && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  )}
                  {submitted && isSelected && !isCorrect && (
                    <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Fill-in numerical Mode */}
        {currentQ.type === 'fill' && (
          <div className="mt-5 max-w-sm">
            <label htmlFor="fill-input" className="block text-xs font-bold text-slate-600 mb-2">
              اكتبي القيمة العددية الصحيحة (بالدرجات أو الوحدات المربعة):
            </label>
            <div className="flex gap-2">
              <input
                id="fill-input"
                type="number"
                placeholder="أدخلي الناتج..."
                value={fillValue}
                onChange={(e) => setFillValue(e.target.value)}
                disabled={submitted}
                className="w-full p-2.5 border border-slate-300 rounded-xl text-center font-mono text-base font-bold text-slate-800 focus:ring-2 focus:ring-indigo-400 outline-none"
              />
              {!submitted && (
                <button
                  onClick={handleSubmit}
                  disabled={!fillValue.trim()}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition-colors shrink-0"
                >
                  تحقق
                </button>
              )}
            </div>
          </div>
        )}

        {/* Hint Box Toggle */}
        <div className="mt-4 flex items-center justify-between">
          <button
            onClick={() => {
              setShowHint(!showHint);
              sound.playClick();
            }}
            className="flex items-center gap-1.5 text-xs text-amber-600 hover:text-amber-700 font-semibold cursor-pointer"
          >
            <Lightbulb className="w-4 h-4" />
            <span>{showHint ? 'إخفاء التلميح' : 'احتاج إلى تلميح توجيهي؟'}</span>
          </button>

          {!submitted && currentQ.type === 'mcq' && (
            <button
              onClick={handleSubmit}
              disabled={!selectedOption}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition-colors"
            >
              تأكيد الإجابة
            </button>
          )}
        </div>

        {/* Hint text */}
        {showHint && (
          <div className="mt-2.5 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2">
            <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>{currentQ.hint}</span>
          </div>
        )}

        {/* Feedback Card after submit */}
        {submitted && (
          <div
            className={`mt-5 p-4 rounded-xl border text-xs leading-relaxed ${
              isCorrect
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : 'bg-rose-50 border-rose-300 text-rose-900'
            }`}
          >
            <div className="flex items-center gap-2 font-bold text-sm mb-1">
              {isCorrect ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>إجابة ممتازة وصحيحة! (+{currentQ.points} XP) 🎉</span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-rose-600" />
                  <span>إجابة غير دقيقة، دعينا نتعلّم السبب الهندسي:</span>
                </>
              )}
            </div>
            <p className="mt-1">{currentQ.explanation}</p>

            {currentQ.geometricReason && (
              <div className="mt-2 pt-2 border-t border-slate-200/60 font-semibold flex items-center gap-1.5 text-slate-800">
                <span className="text-[11px] text-slate-500">التبرير الهندسي المعتمد في كامبريدج:</span>
                <span className="bg-white px-2 py-0.5 rounded border border-slate-300 text-[11px]">
                  {currentQ.geometricReason}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Navigation bottom */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="px-4 py-2 border border-slate-200 hover:bg-slate-50 disabled:opacity-30 rounded-xl text-xs font-semibold text-slate-600"
          >
            السؤال السابق
          </button>

          <button
            onClick={handleNext}
            disabled={currentIndex === questions.length - 1}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-30 rounded-xl text-xs font-semibold text-white flex items-center gap-1.5"
          >
            <span>السؤال التالي</span>
            <ArrowRight className="w-3.5 h-3.5 rotate-180" />
          </button>
        </div>
      </div>
    </div>
  );
};
