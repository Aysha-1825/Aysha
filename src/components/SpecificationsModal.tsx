import React, { useState } from 'react';
import { PLATFORM_SPECIFICATIONS } from '../data/specificationsDoc';
import { X, Printer, Check, BookOpen, TrendingUp, Gamepad2, Layout, Cpu, Lock, Calendar, FileText } from 'lucide-react';
import { sound } from '../utils/audio';

interface SpecificationsModalProps {
  onClose: () => void;
}

export const SpecificationsModal: React.FC<SpecificationsModalProps> = ({ onClose }) => {
  const [activeSectionId, setActiveSectionId] = useState<string>('educational-specs');
  const [copied, setCopied] = useState<boolean>(false);

  const iconsMap: Record<string, React.ReactNode> = {
    BookOpen: <BookOpen className="w-4 h-4" />,
    TrendingUp: <TrendingUp className="w-4 h-4" />,
    Gamepad2: <Gamepad2 className="w-4 h-4" />,
    Layout: <Layout className="w-4 h-4" />,
    Cpu: <Cpu className="w-4 h-4" />,
    Lock: <Lock className="w-4 h-4" />,
    Calendar: <Calendar className="w-4 h-4" />
  };

  const handlePrint = () => {
    window.print();
  };

  const currentSection = PLATFORM_SPECIFICATIONS.sections.find((s) => s.id === activeSectionId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-5xl w-full h-[90vh] border border-slate-200 shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Topbar */}
        <div className="p-4 md:px-6 md:py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center border border-indigo-400/30">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base md:text-lg font-bold">
                {PLATFORM_SPECIFICATIONS.projectTitle}
              </h2>
              <div className="flex items-center gap-2 text-xs text-slate-300 mt-0.5">
                <span>{PLATFORM_SPECIFICATIONS.unitTitle}</span>
                <span>·</span>
                <span className="text-amber-300 font-semibold">{PLATFORM_SPECIFICATIONS.supervisor}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">طباعة الوثيقة</span>
            </button>
            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Left/Right Split */}
        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
          {/* Sidebar Tabs */}
          <div className="w-full md:w-72 bg-slate-50 border-b md:border-b-0 md:border-l border-slate-200 p-3 overflow-y-auto shrink-0 space-y-1">
            <div className="text-[11px] font-bold text-slate-400 px-3 py-1 uppercase tracking-wider">
              المحاور الهندسية والتربوية
            </div>
            {PLATFORM_SPECIFICATIONS.sections.map((sec) => {
              const isActive = sec.id === activeSectionId;
              return (
                <button
                  key={sec.id}
                  onClick={() => {
                    setActiveSectionId(sec.id);
                    sound.playClick();
                  }}
                  className={`w-full text-right p-3 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all ${
                    isActive
                      ? 'bg-white text-indigo-700 shadow-sm border border-slate-200/80 font-bold'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <span className={isActive ? 'text-indigo-600' : 'text-slate-400'}>
                    {iconsMap[sec.icon] || <FileText className="w-4 h-4" />}
                  </span>
                  <span className="truncate">{sec.title}</span>
                </button>
              );
            })}

            {/* Document metadata box */}
            <div className="mt-4 p-3 bg-white border border-slate-200 rounded-xl text-[11px] text-slate-500 space-y-1">
              <div><strong>المنهج:</strong> {PLATFORM_SPECIFICATIONS.curriculum}</div>
              <div><strong>الإشراف والتنفيذ:</strong> {PLATFORM_SPECIFICATIONS.supervisor}</div>
              <div><strong>الإصدار:</strong> {PLATFORM_SPECIFICATIONS.version}</div>
            </div>
          </div>

          {/* Main Document Content */}
          <div className="flex-1 p-6 md:p-8 overflow-y-auto space-y-6 text-slate-800">
            {currentSection && (
              <>
                <div className="border-b border-slate-100 pb-4">
                  <span className="text-xs font-bold text-indigo-600 tracking-wide">
                    المواصفات الفنية والتصميمية للوحدة
                  </span>
                  <h3 className="text-2xl font-black text-slate-900 mt-1">
                    {currentSection.title}
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">
                    {currentSection.subtitle}
                  </p>
                </div>

                {/* Main Paragraphs */}
                <div className="space-y-3 text-sm text-slate-700 leading-relaxed">
                  {currentSection.content.map((p, idx) => (
                    <p key={idx} className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-100">
                      {p}
                    </p>
                  ))}
                </div>

                {/* Subsections with bullet items */}
                {currentSection.subsections && (
                  <div className="space-y-6 pt-2">
                    {currentSection.subsections.map((sub, sIdx) => (
                      <div key={sIdx} className="space-y-3">
                        <h4 className="text-base font-bold text-slate-900 border-r-4 border-indigo-600 pr-3">
                          {sub.subtitle}
                        </h4>
                        <div className="space-y-2.5">
                          {sub.items.map((item, iIdx) => (
                            <div
                              key={iIdx}
                              className="text-xs md:text-sm text-slate-700 p-3 bg-white rounded-xl border border-slate-200/90 hover:border-indigo-300 transition-colors leading-relaxed"
                            >
                              {item}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
