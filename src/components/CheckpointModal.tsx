import React, { useState } from 'react';
import { CheckpointQuestion } from '../types';
import { Award, CheckCircle2, XCircle, ArrowLeft, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio';

interface CheckpointModalProps {
  checkpoint: CheckpointQuestion;
  onSolve: (checkpointId: string, bonusXp: number) => void;
  onClose: () => void;
}

export const CheckpointModal: React.FC<CheckpointModalProps> = ({
  checkpoint,
  onSolve,
  onClose
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const handleSubmit = () => {
    if (selectedOption === null) return;
    const correct = selectedOption === checkpoint.correctAnswer;
    setIsCorrect(correct);
    setSubmitted(true);

    if (correct) {
      sound.playCheckpoint();
      onSolve(checkpoint.id, checkpoint.bonusPoints);
    } else {
      sound.playWrong();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden p-6 relative">
        {/* Top Glow & Badge Icon */}
        <div className="text-center pt-2 pb-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-300 text-amber-950 flex items-center justify-center mx-auto shadow-md mb-3">
            <Award className="w-8 h-8" />
          </div>
          <span className="text-xs font-bold text-amber-600 tracking-wider">
            محطة عبور المهارات الرياضية · {checkpoint.xpThreshold} XP
          </span>
          <h3 className="text-xl font-black text-slate-800 mt-1">{checkpoint.title}</h3>
          <p className="text-xs text-slate-500 mt-0.5">{checkpoint.subtitle}</p>
        </div>

        {/* Question Box */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 mb-5 text-sm font-semibold text-slate-800 leading-relaxed text-right">
          {checkpoint.questionText}
        </div>

        {/* Options */}
        <div className="space-y-2.5 mb-6">
          {checkpoint.options.map((opt, idx) => {
            const isSelected = selectedOption === idx;
            let btnStyle = 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50';

            if (submitted) {
              if (idx === checkpoint.correctAnswer) {
                btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold';
              } else if (isSelected && !isCorrect) {
                btnStyle = 'bg-rose-50 border-rose-300 text-rose-900';
              }
            } else if (isSelected) {
              btnStyle = 'bg-indigo-50 border-indigo-600 text-indigo-900 font-bold ring-2 ring-indigo-200';
            }

            return (
              <button
                key={idx}
                disabled={submitted}
                onClick={() => {
                  setSelectedOption(idx);
                  sound.playClick();
                }}
                className={`w-full p-3.5 text-right rounded-xl border text-xs leading-relaxed transition-all flex items-center justify-between ${btnStyle}`}
              >
                <span>{opt}</span>
                {submitted && idx === checkpoint.correctAnswer && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mr-2" />
                )}
                {submitted && isSelected && !isCorrect && (
                  <XCircle className="w-4 h-4 text-rose-600 shrink-0 mr-2" />
                )}
              </button>
            );
          })}
        </div>

        {/* Explanation on submission */}
        {submitted && (
          <div
            className={`p-4 rounded-xl border text-xs leading-relaxed mb-5 ${
              isCorrect
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : 'bg-rose-50 border-rose-300 text-rose-900'
            }`}
          >
            <div className="font-bold flex items-center gap-1.5 mb-1">
              <Sparkles className="w-4 h-4" />
              <span>{isCorrect ? `إجابة رائعة! ربحتِ وسام "${checkpoint.rewardBadges}" و +${checkpoint.bonusPoints} XP` : 'حاولي مراجعة التبرير الهندسي التالي:'}</span>
            </div>
            <p>{checkpoint.explanation}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs text-slate-500 hover:text-slate-800 font-medium"
          >
            تخطي ومتابعة
          </button>

          {!submitted ? (
            <button
              onClick={handleSubmit}
              disabled={selectedOption === null}
              className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 disabled:opacity-40 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
            >
              تأكيد إجابة محطة العبور
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5"
            >
              <span>متابعة التعلّم</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
