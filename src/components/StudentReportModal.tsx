import { StudentState } from '../types';
import { BADGES, LESSONS } from '../data/curriculumData';
import { X, Printer, Award, CheckCircle2, User, School, Calendar, ShieldCheck } from 'lucide-react';
import { sound } from '../utils/audio';

interface StudentReportModalProps {
  student: StudentState;
  onClose: () => void;
  onUpdateName: (name: string, school: string) => void;
}

export const StudentReportModal: React.FC<StudentReportModalProps> = ({
  student,
  onClose,
  onUpdateName
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] border border-slate-200 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 md:px-6 md:py-4 bg-slate-900 text-white flex items-center justify-between shrink-0 print:hidden">
          <div className="flex items-center gap-2.5">
            <Award className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-sm md:text-base">تقرير أداء ومتابعة الطالبة</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>طباعة التقرير (Print PDF)</span>
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

        {/* Printable Certificate Body */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-6 text-slate-800 print:p-0">
          {/* Certificate Header Banner */}
          <div className="border-b-2 border-slate-900 pb-5 text-center">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span>وزارة التربية والتعليم - سلطنة عُمان</span>
              <span>سلسلة كامبريدج للرياضيات</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              كشف تقويم مهارات الوحدة الثالثة: الشبكات والزوايا
            </h1>
            <p className="text-xs text-slate-600 mt-1">
              منصة العُلا الإلكترونية التفاعلية · الصف الثامن الأساسي
            </p>
          </div>

          {/* Student Profile Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs">
            <div>
              <span className="text-slate-400 block mb-0.5">اسم الطالبة:</span>
              <input
                type="text"
                value={student.name}
                onChange={(e) => onUpdateName(e.target.value, student.school)}
                className="font-bold text-slate-800 bg-transparent border-b border-slate-300 focus:border-indigo-600 outline-none w-full"
                placeholder="أدخلي اسمكِ..."
              />
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">الصف والمدرسة:</span>
              <input
                type="text"
                value={student.school}
                onChange={(e) => onUpdateName(student.name, e.target.value)}
                className="font-bold text-slate-800 bg-transparent border-b border-slate-300 focus:border-indigo-600 outline-none w-full"
                placeholder="الصف والمدرسة..."
              />
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5">تاريخ التقييم:</span>
              <span className="font-bold text-slate-800">{new Date().toLocaleDateString('ar-OM')}</span>
            </div>
          </div>

          {/* Score & Mastery Metric Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-center">
              <span className="text-[11px] text-indigo-700 block">مجموع نقاط الخبرة (XP)</span>
              <span className="text-2xl font-black text-indigo-900 font-mono">{student.totalXp}</span>
            </div>
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
              <span className="text-[11px] text-emerald-700 block">المستوى والرتبة</span>
              <span className="text-sm font-bold text-emerald-900 block mt-1">{student.levelTitle}</span>
            </div>
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-center">
              <span className="text-[11px] text-amber-700 block">محطات العبور المجتازة</span>
              <span className="text-2xl font-black text-amber-900 font-mono">{student.solvedCheckpoints.length} / 3</span>
            </div>
            <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl text-center">
              <span className="text-[11px] text-purple-700 block">الأوسمة المحققة</span>
              <span className="text-2xl font-black text-purple-900 font-mono">{student.unlockedBadges.length} / 4</span>
            </div>
          </div>

          {/* Lessons Mastery Checklist */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>مؤشرات إتقان المعايير التعليمية (Cambridge Competencies)</span>
            </h4>
            <div className="space-y-2 text-xs">
              {LESSONS.map((lsn) => {
                const isCompleted = student.completedLessons.includes(lsn.id);
                return (
                  <div
                    key={lsn.id}
                    className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-slate-800">
                        الدرس {lsn.number}: {lsn.title}
                      </div>
                      <div className="text-[11px] text-slate-500">{lsn.subtitle} · كود المخرج: {lsn.cambridgeCode}</div>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${
                        isCompleted
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-amber-100 text-amber-800 border border-amber-300'
                      }`}
                    >
                      {isCompleted ? 'مكتمل ومتقن ✓' : 'قيد التدريب والتطبيق'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Teacher Signature & Supervisor */}
          <div className="pt-6 border-t-2 border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
            <div>
              <div className="font-semibold text-slate-400">تصميم وتنفيذ المنصة والإشراف الأكاديمي:</div>
              <div className="font-black text-sm text-slate-900 mt-0.5">أ. عائشة ناصر السنيدية</div>
              <div className="text-[11px] text-slate-500">معلمة الرياضيات - سلطنة عُمان</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
