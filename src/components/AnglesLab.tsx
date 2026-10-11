import React, { useState } from 'react';
import { Compass, CheckCircle2, Info, RefreshCw, Zap } from 'lucide-react';
import { sound } from '../utils/audio';

interface AnglesLabProps {
  onEarnXp: (amount: number, reason: string) => void;
}

type AngleMode = 'parallel' | 'triangle_proof' | 'exterior_angle';
type ParallelHighlight = 'all' | 'alternate' | 'corresponding' | 'co_interior' | 'vertically_opposite';

export const AnglesLab: React.FC<AnglesLabProps> = ({ onEarnXp }) => {
  const [mode, setMode] = useState<AngleMode>('parallel');
  const [transversalAngle, setTransversalAngle] = useState<number>(65); // degrees
  const [parallelHighlight, setParallelHighlight] = useState<ParallelHighlight>('alternate');

  // Triangle mode state
  const [triangleAngleA, setTriangleAngleA] = useState<number>(55);
  const [triangleAngleB, setTriangleAngleB] = useState<number>(65);

  const [hasInteracted, setHasInteracted] = useState<boolean>(false);

  const handleAngleChange = (val: number) => {
    setTransversalAngle(val);
    if (!hasInteracted) {
      setHasInteracted(true);
      sound.playCorrect();
      onEarnXp(20, 'استكشاف زوايا التوازي والمتحالفة ديناميكياً');
    }
  };

  const isDraggingCanvasRef = React.useRef(false);
  const lastXRef = React.useRef(0);

  const handleCanvasPointerDown = (e: React.PointerEvent) => {
    isDraggingCanvasRef.current = true;
    lastXRef.current = e.clientX;
  };

  const handleCanvasPointerMove = (e: React.PointerEvent) => {
    if (!isDraggingCanvasRef.current) return;
    const dx = e.clientX - lastXRef.current;
    if (Math.abs(dx) >= 2) {
      if (mode === 'parallel') {
        setTransversalAngle((prev) => Math.round(Math.max(25, Math.min(155, prev + dx * 0.4))));
      } else {
        setTriangleAngleA((prev) => Math.round(Math.max(20, Math.min(85, prev + dx * 0.3))));
      }
      lastXRef.current = e.clientX;
      if (!hasInteracted) {
        setHasInteracted(true);
        sound.playCorrect();
        onEarnXp(20, 'استكشاف الزوايا بالسحب واللمس المباشر');
      }
    }
  };

  const handleCanvasPointerUp = () => {
    isDraggingCanvasRef.current = false;
  };

  const acuteAngle = transversalAngle;
  const obtuseAngle = 180 - transversalAngle;

  const triangleAngleC = 180 - (triangleAngleA + triangleAngleB);
  const exteriorAngleC = triangleAngleA + triangleAngleB; // Exterior angle theorem

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 font-semibold text-sm mb-1">
            <Compass className="w-5 h-5" />
            <span>معمل الاستكشاف الهندسي: شرح واكتشاف خصائص الزوايا</span>
          </div>
          <h3 className="text-xl font-bold text-slate-800">
            مختبر الزوايا الديناميكي (Dynamic Angle Laboratory)
          </h3>
          <p className="text-sm text-slate-500 mt-0.5">
            تفاعلي مباشرة مع المستقيمات المتوازية والمثلثات واستكشفي البراهين الهندسية المعتمدة
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => {
              setMode('parallel');
              sound.playClick();
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              mode === 'parallel'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            مستقيمان متوازيان وقاطع
          </button>
          <button
            onClick={() => {
              setMode('triangle_proof');
              sound.playClick();
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              mode === 'triangle_proof'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            برهان زوايا المثلث (180°)
          </button>
          <button
            onClick={() => {
              setMode('exterior_angle');
              sound.playClick();
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              mode === 'exterior_angle'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            مبرهنة الزاوية الخارجة
          </button>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 items-stretch">
        {/* SVG Drawing Canvas */}
        <div
          onPointerDown={handleCanvasPointerDown}
          onPointerMove={handleCanvasPointerMove}
          onPointerUp={handleCanvasPointerUp}
          onPointerLeave={handleCanvasPointerUp}
          style={{ touchAction: 'none' }}
          className="lg:col-span-8 bg-slate-900 rounded-2xl p-6 relative flex flex-col items-center justify-center min-h-[440px] select-none cursor-ew-resize active:cursor-grabbing"
        >
          {/* Subtle Grid */}
          <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:20px_20px]" />

          {/* PARALLEL LINES MODE */}
          {mode === 'parallel' && (
            <div className="w-full h-full flex flex-col items-center justify-center relative">
              <svg viewBox="0 0 600 360" className="w-full max-w-[560px] h-auto drop-shadow-md">
                <defs>
                  {/* Arrow marker for parallel lines */}
                  <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 1 L 7 5 L 0 9 z" fill="#38bdf8" />
                  </marker>
                </defs>

                {/* Parallel Line 1 (Top) */}
                <line x1="40" y1="110" x2="560" y2="110" stroke="#38bdf8" strokeWidth="3.5" strokeLinecap="round" />
                {/* Parallel marker arrows (textbook convention) */}
                <path d="M 270 103 L 280 110 L 270 117 M 282 103 L 292 110 L 282 117" stroke="#38bdf8" strokeWidth="2.5" fill="none" />
                <text x="540" y="98" fill="#7dd3fc" fontSize="13" fontWeight="bold">المستقيم ل₁</text>

                {/* Parallel Line 2 (Bottom) */}
                <line x1="40" y1="230" x2="560" y2="230" stroke="#38bdf8" strokeWidth="3.5" strokeLinecap="round" />
                <path d="M 270 223 L 280 230 L 270 237 M 282 223 L 292 230 L 282 237" stroke="#38bdf8" strokeWidth="2.5" fill="none" />
                <text x="540" y="250" fill="#7dd3fc" fontSize="13" fontWeight="bold">المستقيم ل₂</text>

                {/* Transversal Line */}
                {/* Center of intersection 1: (300, 110), Center of intersection 2: (300 + dx, 230) */}
                {(() => {
                  const rad = (transversalAngle * Math.PI) / 180;
                  const dx = 120 / Math.tan(rad);
                  const p1x = 260;
                  const p1y = 110;
                  const p2x = p1x + dx;
                  const p2y = 230;

                  // Line extend
                  const extX1 = p1x - 70;
                  const extY1 = p1y - 70 * Math.tan(rad);
                  const extX2 = p2x + 70;
                  const extY2 = p2y + 70 * Math.tan(rad);

                  // Highlight Z (alternate) shape
                  const isZ = parallelHighlight === 'alternate';
                  const isF = parallelHighlight === 'corresponding';
                  const isC = parallelHighlight === 'co_interior';
                  const isX = parallelHighlight === 'vertically_opposite';

                  return (
                    <>
                      {/* Transversal */}
                      <line x1={extX1} y1={extY1} x2={extX2} y2={extY2} stroke="#f59e0b" strokeWidth="3.5" strokeLinecap="round" />
                      <text x={extX1 + 10} y={extY1 - 10} fill="#fbbf24" fontSize="13" fontWeight="bold">القاطع ق</text>

                      {/* Geometric Shape Guidelines overlay */}
                      {isZ && (
                        <path
                          d={`M ${p1x + 90} 110 L ${p1x} 110 L ${p2x} 230 L ${p2x - 90} 230`}
                          stroke="#ec4899"
                          strokeWidth="4"
                          strokeDasharray="6,4"
                          fill="none"
                        />
                      )}
                      {isF && (
                        <path
                          d={`M ${p1x} ${p1y - 40} L ${p2x} ${p2y + 40} M ${p1x} 110 L ${p1x + 80} 110 M ${p2x} 230 L ${p2x + 80} 230`}
                          stroke="#a855f7"
                          strokeWidth="3.5"
                          strokeDasharray="5,4"
                          fill="none"
                        />
                      )}
                      {isC && (
                        <path
                          d={`M ${p1x + 70} 110 L ${p1x} 110 L ${p2x} 230 L ${p2x + 70} 230`}
                          stroke="#10b981"
                          strokeWidth="4"
                          strokeDasharray="5,4"
                          fill="none"
                        />
                      )}

                      {/* Angle Arcs at P1 (Top) */}
                      {/* Acute angle 1: between transversal and left of L1 */}
                      <circle
                        cx={p1x}
                        cy={p1y}
                        r="26"
                        fill="transparent"
                        stroke={isZ || isF || parallelHighlight === 'all' ? '#10b981' : '#64748b'}
                        strokeWidth={isZ || isF ? '5' : '3'}
                        strokeDasharray="28 100"
                      />
                      <rect x={p1x + 12} y={p1y - 30} width="46" height="22" rx="4" fill="#0f172a" stroke="#10b981" strokeWidth="1.5" />
                      <text x={p1x + 35} y={p1y - 15} fill="#34d399" fontSize="12" fontWeight="bold" textAnchor="middle" fontFamily="Fira Code">
                        {acuteAngle}°
                      </text>

                      {/* Obtuse angle at P1 */}
                      <rect x={p1x - 65} y={p1y - 30} width="52" height="22" rx="4" fill="#0f172a" stroke="#f59e0b" strokeWidth="1.5" />
                      <text x={p1x - 39} y={p1y - 15} fill="#fbbf24" fontSize="12" fontWeight="bold" textAnchor="middle" fontFamily="Fira Code">
                        {obtuseAngle}°
                      </text>

                      {/* Angle Arcs at P2 (Bottom) */}
                      {/* Alternate angle to top right (Acute angle 2) */}
                      <circle
                        cx={p2x}
                        cy={p2y}
                        r="26"
                        fill="transparent"
                        stroke={isZ || isF || parallelHighlight === 'all' ? '#10b981' : '#64748b'}
                        strokeWidth={isZ || isF ? '5' : '3'}
                        strokeDasharray="28 100"
                        transform={`rotate(180, ${p2x}, ${p2y})`}
                      />
                      <rect x={p2x - 60} y={p2y + 12} width="46" height="22" rx="4" fill="#0f172a" stroke="#10b981" strokeWidth="1.5" />
                      <text x={p2x - 37} y={p2y + 27} fill="#34d399" fontSize="12" fontWeight="bold" textAnchor="middle" fontFamily="Fira Code">
                        {acuteAngle}°
                      </text>

                      {/* Corresponding / Co-interior angle at P2 */}
                      <rect x={p2x + 15} y={p2y + 12} width="52" height="22" rx="4" fill="#0f172a" stroke={isC ? '#10b981' : '#f59e0b'} strokeWidth={isC ? '2' : '1.5'} />
                      <text x={p2x + 41} y={p2y + 27} fill={isC ? '#34d399' : '#fbbf24'} fontSize="12" fontWeight="bold" textAnchor="middle" fontFamily="Fira Code">
                        {obtuseAngle}°
                      </text>
                    </>
                  );
                })()}
              </svg>

              {/* Real-time Indicator banner */}
              <div className="mt-3 flex flex-wrap items-center justify-center gap-3 text-xs bg-slate-800/90 border border-slate-700 px-4 py-2 rounded-xl text-slate-200">
                <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
                  الزاوية الحادة = {acuteAngle}°
                </span>
                <span className="text-slate-500">|</span>
                <span className="flex items-center gap-1.5 text-amber-400 font-bold">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
                  الزاوية المنفرجة = {obtuseAngle}°
                </span>
                <span className="text-slate-500">|</span>
                <span className="text-indigo-300 font-mono">
                  المجموع = {acuteAngle + obtuseAngle}° (زوايا متكاملة على خط مستقيم)
                </span>
              </div>
            </div>
          )}

          {/* TRIANGLE ANGLE SUM PROOF (Textbook Page 52/53) */}
          {mode === 'triangle_proof' && (
            <div className="w-full h-full flex flex-col items-center justify-center relative">
              <svg viewBox="0 0 600 360" className="w-full max-w-[560px] h-auto drop-shadow-md">
                {/* Triangle coordinates: A(300, 90), B(120, 270), C(480, 270) */}
                {/* Parallel line through A */}
                <line x1="50" y1="90" x2="550" y2="90" stroke="#a855f7" strokeWidth="3" strokeDasharray="6,4" />
                <path d="M 285 83 L 295 90 L 285 97 M 297 83 L 307 90 L 297 97" stroke="#a855f7" strokeWidth="2.5" fill="none" />
                <text x="50" y="80" fill="#c084fc" fontSize="12" fontWeight="bold">المستقيم الموازي لقاعدة المثلث</text>

                {/* Triangle Base BC */}
                <line x1="80" y1="270" x2="520" y2="270" stroke="#38bdf8" strokeWidth="3.5" />
                <path d="M 285 263 L 295 270 L 285 277 M 297 263 L 307 270 L 297 277" stroke="#38bdf8" strokeWidth="2.5" fill="none" />

                {/* Triangle Legs */}
                <polygon points="300,90 140,270 460,270" fill="rgba(56, 189, 248, 0.08)" stroke="#38bdf8" strokeWidth="3.5" />

                {/* Vertex Labels */}
                <circle cx="300" cy="90" r="5" fill="#f59e0b" />
                <text x="300" y="70" fill="#fbbf24" fontSize="16" fontWeight="bold" textAnchor="middle">الرأس أ ({triangleAngleA}°)</text>

                <circle cx="140" cy="270" r="5" fill="#10b981" />
                <text x="120" y="300" fill="#34d399" fontSize="16" fontWeight="bold" textAnchor="middle">الرأس ب ({triangleAngleB}°)</text>

                <circle cx="460" cy="270" r="5" fill="#ec4899" />
                <text x="480" y="300" fill="#f472b6" fontSize="16" fontWeight="bold" textAnchor="middle">الرأس ج ({triangleAngleC}°)</text>

                {/* Alternate angle proof highlights at top */}
                {/* Angle equal to B on left of line through A */}
                <path d="M 240 90 A 60 60 0 0 1 265 130" stroke="#10b981" strokeWidth="3" fill="none" />
                <text x="210" y="75" fill="#34d399" fontSize="12" fontWeight="bold">الزاوية ب بالتبادل ({triangleAngleB}°)</text>

                {/* Angle equal to C on right of line through A */}
                <path d="M 335 130 A 60 60 0 0 1 360 90" stroke="#ec4899" strokeWidth="3" fill="none" />
                <text x="390" y="75" fill="#f472b6" fontSize="12" fontWeight="bold">الزاوية ج بالتبادل ({triangleAngleC}°)</text>
              </svg>

              {/* Deductive Proof Walkthrough Card */}
              <div className="mt-2 bg-slate-800/90 border border-slate-700 p-3 rounded-xl max-w-xl text-center text-xs text-slate-200">
                <span className="font-bold text-amber-400 block mb-1">
                  مبرهنة إقليدس: مجموع زوايا المثلث = 180°
                </span>
                <span>
                  برسم مستقيم يمر بالرأس (أ) وموازٍ للقاعدة (ب ج): الزاوية يسار (أ) = ب (بالتبادل)، والزاوية يمين (أ) = ج (بالتبادل). وحيث أن الزوايا الثلاث تقع على خط مستقيم واحد: {triangleAngleA}° + {triangleAngleB}° + {triangleAngleC}° = 180°.
                </span>
              </div>
            </div>
          )}

          {/* EXTERIOR ANGLE THEOREM (Textbook Page 53) */}
          {mode === 'exterior_angle' && (
            <div className="w-full h-full flex flex-col items-center justify-center relative">
              <svg viewBox="0 0 600 360" className="w-full max-w-[560px] h-auto drop-shadow-md">
                {/* Triangle A(260, 90), B(120, 260), C(380, 260) with extended base to (530, 260) */}
                <line x1="80" y1="260" x2="540" y2="260" stroke="#64748b" strokeWidth="2.5" />
                {/* Base segment */}
                <line x1="120" y1="260" x2="380" y2="260" stroke="#38bdf8" strokeWidth="4" />
                {/* Legs */}
                <line x1="120" y1="260" x2="260" y2="90" stroke="#38bdf8" strokeWidth="4" />
                <line x1="260" y1="90" x2="380" y2="260" stroke="#38bdf8" strokeWidth="4" />

                {/* Triangle Fill */}
                <polygon points="260,90 120,260 380,260" fill="rgba(56, 189, 248, 0.12)" />

                {/* Vertex markers & text */}
                <text x="260" y="70" fill="#fbbf24" fontSize="15" fontWeight="bold" textAnchor="middle">أ ({triangleAngleA}°)</text>
                <text x="100" y="290" fill="#34d399" fontSize="15" fontWeight="bold" textAnchor="middle">ب ({triangleAngleB}°)</text>
                <text x="360" y="290" fill="#94a3b8" fontSize="14" fontWeight="bold" textAnchor="middle">ج ({triangleAngleC}°)</text>

                {/* Exterior Angle Arc at C */}
                <path d="M 430 260 A 50 50 0 0 0 350 220" stroke="#f43f5e" strokeWidth="4" fill="none" />
                <rect x="400" y="195" width="110" height="28" rx="6" fill="#0f172a" stroke="#f43f5e" strokeWidth="2" />
                <text x="455" y="214" fill="#fda4af" fontSize="13" fontWeight="bold" textAnchor="middle" fontFamily="Fira Code">
                  الخارجة = {exteriorAngleC}°
                </text>

                {/* Arrow pointing to exterior angle */}
                <path d="M 490 185 L 470 195" stroke="#fda4af" strokeWidth="2" />
              </svg>

              <div className="mt-2 bg-slate-800/90 border border-rose-900/60 p-3 rounded-xl max-w-xl text-center text-xs text-slate-200">
                <span className="font-bold text-rose-400 block mb-1">
                  مبرهنة الزاوية الخارجة للمثلث:
                </span>
                <span>
                  قياس أي زاوية خارجة للمثلث = مجموع قياسي الزاويتين الداخلتين المقابلتين لها:
                  <strong className="text-white mx-1.5 font-mono">{exteriorAngleC}° = {triangleAngleA}° + {triangleAngleB}°</strong>
                  (دون احتساب الزاوية المجاورة لها ج = {triangleAngleC}°).
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Controls Deck on Right */}
        <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
          {mode === 'parallel' && (
            <>
              {/* Slider for Transversal */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="trans-slider" className="text-sm font-bold text-slate-800">
                    ميل القاطع (ميل زاوية التوازي):
                  </label>
                  <span className="text-sm font-black text-indigo-600 font-mono">
                    {transversalAngle}°
                  </span>
                </div>
                <input
                  id="trans-slider"
                  type="range"
                  min="25"
                  max="155"
                  step="1"
                  value={transversalAngle}
                  onChange={(e) => handleAngleChange(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                  <span>25° (حادة جداً)</span>
                  <span>90° (عمودي)</span>
                  <span>155° (منفرجة)</span>
                </div>
              </div>

              {/* Theorem Filter Buttons */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2.5">
                <div className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>تسليط الضوء على المبرهنة:</span>
                  <Zap className="w-3.5 h-3.5 text-indigo-500" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setParallelHighlight('alternate');
                      sound.playClick();
                    }}
                    className={`p-2 text-xs rounded-lg text-right border transition-all ${
                      parallelHighlight === 'alternate'
                        ? 'bg-pink-50 border-pink-400 text-pink-900 font-bold shadow-sm'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <span className="block font-black text-pink-700">شكل Z (التبادل)</span>
                    <span className="text-[11px] text-slate-500">زاويتان متساويتان</span>
                  </button>
                  <button
                    onClick={() => {
                      setParallelHighlight('corresponding');
                      sound.playClick();
                    }}
                    className={`p-2 text-xs rounded-lg text-right border transition-all ${
                      parallelHighlight === 'corresponding'
                        ? 'bg-purple-50 border-purple-400 text-purple-900 font-bold shadow-sm'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <span className="block font-black text-purple-700">شكل F (التناظر)</span>
                    <span className="text-[11px] text-slate-500">زاويتان متساويتان</span>
                  </button>
                  <button
                    onClick={() => {
                      setParallelHighlight('co_interior');
                      sound.playClick();
                    }}
                    className={`p-2 text-xs rounded-lg text-right border transition-all ${
                      parallelHighlight === 'co_interior'
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-900 font-bold shadow-sm'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <span className="block font-black text-emerald-700">شكل C (الداخلتان)</span>
                    <span className="text-[11px] text-slate-500">مجموعهما = 180°</span>
                  </button>
                  <button
                    onClick={() => {
                      setParallelHighlight('vertically_opposite');
                      sound.playClick();
                    }}
                    className={`p-2 text-xs rounded-lg text-right border transition-all ${
                      parallelHighlight === 'vertically_opposite'
                        ? 'bg-amber-50 border-amber-400 text-amber-900 font-bold shadow-sm'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <span className="block font-black text-amber-700">شكل X (المتقابلتان)</span>
                    <span className="text-[11px] text-slate-500">متساويتان بالرأس</span>
                  </button>
                </div>
              </div>
            </>
          )}

          {/* TRIANGLE & EXTERIOR CONTROLS */}
          {(mode === 'triangle_proof' || mode === 'exterior_angle') && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-4">
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <label htmlFor="angle-a">قياس الزاوية أ:</label>
                  <span className="font-mono text-indigo-600">{triangleAngleA}°</span>
                </div>
                <input
                  id="angle-a"
                  type="range"
                  min="20"
                  max="100"
                  value={triangleAngleA}
                  onChange={(e) => {
                    const newA = Number(e.target.value);
                    if (newA + triangleAngleB < 170) setTriangleAngleA(newA);
                  }}
                  className="w-full accent-indigo-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <label htmlFor="angle-b">قياس الزاوية ب:</label>
                  <span className="font-mono text-emerald-600">{triangleAngleB}°</span>
                </div>
                <input
                  id="angle-b"
                  type="range"
                  min="20"
                  max="100"
                  value={triangleAngleB}
                  onChange={(e) => {
                    const newB = Number(e.target.value);
                    if (triangleAngleA + newB < 170) setTriangleAngleB(newB);
                  }}
                  className="w-full accent-emerald-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
              </div>

              <div className="p-3 bg-white border border-slate-200 rounded-lg text-xs space-y-1">
                <div className="flex justify-between text-slate-600">
                  <span>الزاوية ج (المتبقية):</span>
                  <span className="font-bold text-slate-800 font-mono">{triangleAngleC}°</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>الزاوية الخارجة عند ج:</span>
                  <span className="font-bold text-rose-600 font-mono">{exteriorAngleC}°</span>
                </div>
              </div>
            </div>
          )}

          {/* Quick Knowledge Tip */}
          <div className="p-4 bg-indigo-50/70 border border-indigo-200 rounded-xl text-slate-800 text-xs space-y-1.5">
            <div className="flex items-center gap-1.5 text-indigo-900 font-bold">
              <Info className="w-4 h-4 text-indigo-600" />
              <span>نصيحة المعلمة أ.عائشة السنيدية:</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              عند كتابة الحل في امتحانات كامبريدج، لا تكتفي بذكر الناتج الرقمي أبداً! اكتبي دائماً اسم المبرهنة بين قوسين (مثلاً: بالتبادل والتوازي، أو: بالتقابل بالرأس) لتحصلي على الدرجة الكاملة لمعيار الاستدلال الهندسي.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
