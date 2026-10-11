import React, { useState, useRef } from 'react';
import { Box, RotateCw, CheckCircle2, AlertTriangle, Sparkles, Layers } from 'lucide-react';
import { sound } from '../utils/audio';

interface NetsSimulatorProps {
  onEarnXp: (amount: number, reason: string) => void;
}

type ShapeType = 'cube' | 'cuboid' | 'triangular_prism' | 'pyramid';

export const NetsSimulator: React.FC<NetsSimulatorProps> = ({ onEarnXp }) => {
  const [selectedShape, setSelectedShape] = useState<ShapeType>('cube');
  const [foldProgress, setFoldProgress] = useState<number>(0); // 0 = completely flat, 100 = folded 3D
  const [rotationX, setRotationX] = useState<number>(-20);
  const [rotationY, setRotationY] = useState<number>(35);
  const [showFaceLabels, setShowFaceLabels] = useState<boolean>(true);
  const [testedNetType, setTestedNetType] = useState<'valid' | 'invalid'>('valid');
  const [hasExplored, setHasExplored] = useState<boolean>(false);

  const isDraggingRef = useRef(false);
  const lastPosRef = useRef({ x: 0, y: 0 });

  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    lastPosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - lastPosRef.current.x;
    const dy = e.clientY - lastPosRef.current.y;
    setRotationY((prev) => prev + dx * 0.8);
    setRotationX((prev) => Math.max(-85, Math.min(85, prev - dy * 0.8)));
    lastPosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  const handleFoldChange = (val: number) => {
    setFoldProgress(val);
    if (val >= 90 && !hasExplored) {
      setHasExplored(true);
      sound.playCorrect();
      onEarnXp(20, 'استكشاف طيّ المجسم ثلاثي الأبعاد بالكامل');
    }
  };

  const shapesInfo: Record<ShapeType, { name: string; desc: string; faces: string; edges: string; vertices: string }> = {
    cube: {
      name: 'المكعب المنتظم',
      desc: 'مجسم ثلاثي الأبعاد يتكون من 6 أوجه مربعة متطابقة، و12 حافة متساوية، و8 رؤوس.',
      faces: '6 أوجه مربعة',
      edges: '12 حافة',
      vertices: '8 رؤوس'
    },
    cuboid: {
      name: 'متوازي المستطيلات',
      desc: 'مجسم ثلاثي الأبعاد أوجهه الستة مستطيلات، وكل وجهين متقابلين متطابقان ومتوازيان تماماً.',
      faces: '6 أوجه مستطيلة (3 أزواج متطابقة)',
      edges: '12 حافة',
      vertices: '8 رؤوس'
    },
    triangular_prism: {
      name: 'المنشور الثلاثي القائم',
      desc: 'مجسم قاعدتاه مثلثتان متطابقتان، وله 3 أوجه جانبية مستطيلة تربط بين أضلاع القاعدتين.',
      faces: 'وجهان مثلثان + 3 مستطيلات (5 أوجه)',
      edges: '9 حواف',
      vertices: '6 رؤوس'
    },
    pyramid: {
      name: 'الهرم الرباعي المنتظم',
      desc: 'مجسم قاعدته مربعة وأوجهه الجانبية أربعة مثلثات متطابقة تلتقي جميعها في رأس واحد.',
      faces: 'قاعدة مربعة + 4 مثلثات (5 أوجه)',
      edges: '8 حواف',
      vertices: '5 رؤوس'
    }
  };

  // Fold angle in radians / degrees
  const foldAngle = (foldProgress / 100) * 90;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6">
      {/* Header & Shape Selection */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 text-emerald-600 font-semibold text-sm mb-1">
            <Box className="w-5 h-5" />
            <span>معمل المحاكاة التفاعلية: طي وبسط الشبكات ثلاثية الأبعاد</span>
          </div>
          <h3 className="text-xl font-bold text-slate-800">
            مستكشف شبكات المجسمات الهندسية (3D Nets Explorer)
          </h3>
          <p className="text-sm text-slate-500 mt-0.5">
            حركي مقبض الطي وشاهدي كيف يتحول المخطط ثنائي الأبعاد إلى مجسم مقفل متكامل
          </p>
        </div>

        {/* Shape Switcher */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
          {(['cube', 'cuboid', 'triangular_prism', 'pyramid'] as ShapeType[]).map((st) => (
            <button
              key={st}
              onClick={() => {
                setSelectedShape(st);
                setFoldProgress(0);
                sound.playClick();
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                selectedShape === st
                  ? 'bg-white text-emerald-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {shapesInfo[st].name}
            </button>
          ))}
        </div>
      </div>

      {/* Grid: 3D Stage on Left/Center, Controls on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 items-stretch">
        {/* Visual Stage */}
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          style={{ touchAction: 'none' }}
          className="lg:col-span-8 bg-gradient-to-b from-slate-900 to-slate-800 rounded-2xl p-6 relative flex flex-col items-center justify-center min-h-[420px] overflow-hidden select-none cursor-grab active:cursor-grabbing"
        >
          {/* Subtle Stage Grid */}
          <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:16px_16px]" />

          {/* View Mode Tag */}
          <div className="absolute top-4 right-4 flex items-center gap-2 text-xs text-slate-300 bg-slate-800/80 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-700">
            <span>نسبة الطي: {foldProgress}%</span>
            <span className="text-slate-500">·</span>
            <span>{foldProgress === 0 ? 'شبكة مستوية (2D)' : foldProgress === 100 ? 'مجسم مقفل (3D)' : 'طور الطي المرحلي'}</span>
          </div>

          {/* Net Type Toggle (for testing valid vs invalid nets) */}
          <div className="absolute top-4 left-4 flex items-center gap-1 bg-slate-800/80 backdrop-blur p-1 rounded-lg border border-slate-700">
            <button
              onClick={() => {
                setTestedNetType('valid');
                sound.playClick();
              }}
              className={`px-2.5 py-1 text-xs rounded transition-colors ${
                testedNetType === 'valid'
                  ? 'bg-emerald-600 text-white font-medium'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              شبكة نظامية صالحة
            </button>
            <button
              onClick={() => {
                setTestedNetType('invalid');
                sound.playClick();
              }}
              className={`px-2.5 py-1 text-xs rounded transition-colors ${
                testedNetType === 'invalid'
                  ? 'bg-rose-600 text-white font-medium'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              شبكة خاطئة (تراكب)
            </button>
          </div>

          {/* 3D Perspective Canvas Container */}
          <div
            className="w-full h-full flex items-center justify-center py-8"
            style={{ perspective: '1100px' }}
          >
            <div
              className="relative transition-transform duration-100 ease-out"
              style={{
                transformStyle: 'preserve-3d',
                transform: `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`,
                width: '180px',
                height: '180px'
              }}
            >
              {/* CUBE IMPLEMENTATION */}
              {selectedShape === 'cube' && (
                <div className="relative w-full h-full" style={{ transformStyle: 'preserve-3d' }}>
                  {/* Base Face (Center) */}
                  <div
                    className="absolute inset-0 bg-emerald-500/85 border-2 border-emerald-300 text-white font-bold text-xs flex flex-col items-center justify-center shadow-lg rounded-sm"
                    style={{ transform: 'translateZ(0px)' }}
                  >
                    <span>القاعدة</span>
                    {showFaceLabels && <span className="text-[10px] text-emerald-100">وجه 1 (الأسفل)</span>}
                  </div>

                  {/* Top Flap (folds backward or forward) */}
                  <div
                    className={`absolute inset-0 ${
                      testedNetType === 'invalid' ? 'bg-rose-500/85 border-rose-300' : 'bg-emerald-600/85 border-emerald-300'
                    } border-2 text-white font-bold text-xs flex flex-col items-center justify-center shadow-lg origin-bottom transition-all rounded-sm`}
                    style={{
                      transform:
                        testedNetType === 'invalid'
                          ? `translateY(-180px) rotateX(${foldAngle}deg)` // faulty placement overlaps top
                          : `translateY(-180px) rotateX(${foldAngle}deg)`
                    }}
                  >
                    <span>الوجه الشمالي</span>
                    {showFaceLabels && <span className="text-[10px] text-emerald-100">وجه 2</span>}

                    {/* Extended Face attached to Top Flap (folds to become Top lid) */}
                    {testedNetType === 'valid' ? (
                      <div
                        className="absolute inset-0 bg-teal-500/90 border-2 border-teal-200 text-white font-bold text-xs flex flex-col items-center justify-center origin-bottom shadow-lg rounded-sm"
                        style={{
                          transform: `translateY(-180px) rotateX(${foldAngle}deg)`
                        }}
                      >
                        <span>الغطاء العلوي</span>
                        {showFaceLabels && <span className="text-[10px] text-teal-100">وجه 6 (يقابل القاعدة)</span>}
                      </div>
                    ) : (
                      /* Overlapping faulty face that collides with side */
                      <div
                        className="absolute inset-0 bg-rose-600/90 border-2 border-amber-300 text-white font-bold text-xs flex flex-col items-center justify-center origin-right shadow-lg rounded-sm"
                        style={{
                          transform: `translateX(180px) rotateY(${foldAngle}deg)`
                        }}
                      >
                        <span className="text-amber-200 font-black">وجه متراكب!</span>
                        <span className="text-[9px]">يتصادم ويترك جهة مفتوحة</span>
                      </div>
                    )}
                  </div>

                  {/* Bottom Flap */}
                  <div
                    className="absolute inset-0 bg-emerald-600/85 border-2 border-emerald-300 text-white font-bold text-xs flex flex-col items-center justify-center shadow-lg origin-top transition-all rounded-sm"
                    style={{
                      transform: `translateY(180px) rotateX(${-foldAngle}deg)`
                    }}
                  >
                    <span>الوجه الجنوبي</span>
                    {showFaceLabels && <span className="text-[10px] text-emerald-100">وجه 3</span>}
                  </div>

                  {/* Left Flap */}
                  <div
                    className="absolute inset-0 bg-emerald-500/85 border-2 border-emerald-300 text-white font-bold text-xs flex flex-col items-center justify-center shadow-lg origin-right transition-all rounded-sm"
                    style={{
                      transform: `translateX(-180px) rotateY(${foldAngle}deg)`
                    }}
                  >
                    <span>الوجه الغربي</span>
                    {showFaceLabels && <span className="text-[10px] text-emerald-100">وجه 4</span>}
                  </div>

                  {/* Right Flap */}
                  <div
                    className="absolute inset-0 bg-emerald-500/85 border-2 border-emerald-300 text-white font-bold text-xs flex flex-col items-center justify-center shadow-lg origin-left transition-all rounded-sm"
                    style={{
                      transform: `translateX(180px) rotateY(${-foldAngle}deg)`
                    }}
                  >
                    <span>الوجه الشرقي</span>
                    {showFaceLabels && <span className="text-[10px] text-emerald-100">وجه 5</span>}
                  </div>
                </div>
              )}

              {/* CUBOID IMPLEMENTATION */}
              {selectedShape === 'cuboid' && (
                <div className="relative w-full h-full" style={{ transformStyle: 'preserve-3d' }}>
                  {/* Base (3x5 ratio) */}
                  <div
                    className="absolute inset-0 bg-indigo-500/85 border-2 border-indigo-300 text-white font-bold text-xs flex flex-col items-center justify-center shadow-lg rounded-sm"
                    style={{ transform: 'translateZ(0px)', height: '140px', width: '200px', top: '20px', left: '-10px' }}
                  >
                    <span>القاعدة السفلية (أ)</span>
                    <span className="text-[10px] text-indigo-100">5 سم × 4 سم</span>
                  </div>

                  {/* Top side (height 3cm) */}
                  <div
                    className="absolute bg-sky-500/85 border-2 border-sky-300 text-white font-bold text-xs flex flex-col items-center justify-center shadow-lg origin-bottom rounded-sm"
                    style={{
                      height: '90px',
                      width: '200px',
                      left: '-10px',
                      top: '20px',
                      transform: `translateY(-90px) rotateX(${foldAngle}deg)`
                    }}
                  >
                    <span>وجه جانبي (ب)</span>
                    <span className="text-[10px] text-sky-100">5 سم × 3 سم</span>

                    {/* Attached Top matching Base */}
                    <div
                      className="absolute bg-indigo-600/90 border-2 border-indigo-200 text-white font-bold text-xs flex flex-col items-center justify-center origin-bottom shadow-lg rounded-sm"
                      style={{
                        height: '140px',
                        width: '200px',
                        top: '0px',
                        transform: `translateY(-140px) rotateX(${foldAngle}deg)`
                      }}
                    >
                      <span>الغطاء العلوي (يقابل أ)</span>
                      <span className="text-[10px] text-indigo-200">5 سم × 4 سم (مطابق للقاعدة)</span>
                    </div>
                  </div>

                  {/* Bottom side (height 3cm) */}
                  <div
                    className="absolute bg-sky-500/85 border-2 border-sky-300 text-white font-bold text-xs flex flex-col items-center justify-center shadow-lg origin-top rounded-sm"
                    style={{
                      height: '90px',
                      width: '200px',
                      left: '-10px',
                      top: '160px',
                      transform: `rotateX(${-foldAngle}deg)`
                    }}
                  >
                    <span>وجه جانبي (يقابل ب)</span>
                    <span className="text-[10px] text-sky-100">5 سم × 3 سم</span>
                  </div>

                  {/* Left Side (width 3cm, length 4cm) */}
                  <div
                    className="absolute bg-violet-500/85 border-2 border-violet-300 text-white font-bold text-xs flex flex-col items-center justify-center shadow-lg origin-right rounded-sm"
                    style={{
                      width: '90px',
                      height: '140px',
                      left: '-10px',
                      top: '20px',
                      transform: `translateX(-90px) rotateY(${foldAngle}deg)`
                    }}
                  >
                    <span>وجه جانبي (ج)</span>
                    <span className="text-[10px] text-violet-100">4 سم × 3 سم</span>
                  </div>

                  {/* Right Side (width 3cm, length 4cm) */}
                  <div
                    className="absolute bg-violet-500/85 border-2 border-violet-300 text-white font-bold text-xs flex flex-col items-center justify-center shadow-lg origin-left rounded-sm"
                    style={{
                      width: '90px',
                      height: '140px',
                      left: '190px',
                      top: '20px',
                      transform: `rotateY(${-foldAngle}deg)`
                    }}
                  >
                    <span>وجه جانبي (يقابل ج)</span>
                    <span className="text-[10px] text-violet-100">4 سم × 3 سم</span>
                  </div>
                </div>
              )}

              {/* TRIANGULAR PRISM */}
              {selectedShape === 'triangular_prism' && (
                <div className="relative w-full h-full" style={{ transformStyle: 'preserve-3d' }}>
                  {/* Central Rectangle Base */}
                  <div
                    className="absolute inset-0 bg-amber-500/85 border-2 border-amber-300 text-white font-bold text-xs flex flex-col items-center justify-center shadow-lg rounded-sm"
                    style={{ transform: 'translateZ(0px)', width: '160px', height: '140px', left: '10px', top: '20px' }}
                  >
                    <span>المستطيل المركزي</span>
                    <span className="text-[10px] text-amber-100">قاعدة المنشور</span>
                  </div>

                  {/* Left Rectangle Wall */}
                  <div
                    className="absolute bg-amber-600/85 border-2 border-amber-300 text-white font-bold text-xs flex flex-col items-center justify-center shadow-lg origin-right rounded-sm"
                    style={{
                      width: '120px',
                      height: '140px',
                      left: '10px',
                      top: '20px',
                      transform: `translateX(-120px) rotateY(${foldAngle * 0.65}deg)`
                    }}
                  >
                    <span>مستطيل جانبي 1</span>
                  </div>

                  {/* Right Rectangle Wall */}
                  <div
                    className="absolute bg-amber-600/85 border-2 border-amber-300 text-white font-bold text-xs flex flex-col items-center justify-center shadow-lg origin-left rounded-sm"
                    style={{
                      width: '120px',
                      height: '140px',
                      left: '170px',
                      top: '20px',
                      transform: `rotateY(${-foldAngle * 0.65}deg)`
                    }}
                  >
                    <span>مستطيل جانبي 2</span>
                  </div>

                  {/* Top Triangle Base */}
                  <div
                    className="absolute flex items-center justify-center text-white font-bold text-xs origin-bottom"
                    style={{
                      width: '160px',
                      height: '90px',
                      left: '10px',
                      top: '20px',
                      transform: `translateY(-90px) rotateX(${foldAngle}deg)`
                    }}
                  >
                    <div
                      className="w-full h-full bg-orange-500/90 border-2 border-orange-300 flex items-center justify-center text-center shadow-md"
                      style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}
                    >
                      <span className="mt-8 text-[11px]">مثلث علوي</span>
                    </div>
                  </div>

                  {/* Bottom Triangle Base */}
                  <div
                    className="absolute flex items-center justify-center text-white font-bold text-xs origin-top"
                    style={{
                      width: '160px',
                      height: '90px',
                      left: '10px',
                      top: '160px',
                      transform: `rotateX(${-foldAngle}deg)`
                    }}
                  >
                    <div
                      className="w-full h-full bg-orange-500/90 border-2 border-orange-300 flex items-center justify-center text-center shadow-md"
                      style={{ clipPath: 'polygon(50% 100%, 0% 0%, 100% 0%)' }}
                    >
                      <span className="mb-8 text-[11px]">مثلث سفلي</span>
                    </div>
                  </div>
                </div>
              )}

              {/* SQUARE PYRAMID */}
              {selectedShape === 'pyramid' && (
                <div className="relative w-full h-full" style={{ transformStyle: 'preserve-3d' }}>
                  {/* Square Base */}
                  <div
                    className="absolute inset-0 bg-rose-500/85 border-2 border-rose-300 text-white font-bold text-xs flex flex-col items-center justify-center shadow-lg rounded-sm"
                    style={{ transform: 'translateZ(0px)' }}
                  >
                    <span>قاعدة مربعة</span>
                    <span className="text-[10px] text-rose-100">أساس الهرم</span>
                  </div>

                  {/* Top Triangle Flap */}
                  <div
                    className="absolute inset-0 origin-bottom flex items-center justify-center text-white font-bold text-xs"
                    style={{
                      transform: `translateY(-180px) rotateX(${foldAngle * 0.75}deg)`
                    }}
                  >
                    <div
                      className="w-full h-full bg-rose-600/90 border-2 border-rose-300 flex items-center justify-center text-center shadow-md"
                      style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}
                    >
                      <span className="mt-14 text-[10px]">وجه مثلث 1</span>
                    </div>
                  </div>

                  {/* Bottom Triangle Flap */}
                  <div
                    className="absolute inset-0 origin-top flex items-center justify-center text-white font-bold text-xs"
                    style={{
                      transform: `translateY(180px) rotateX(${-foldAngle * 0.75}deg)`
                    }}
                  >
                    <div
                      className="w-full h-full bg-rose-600/90 border-2 border-rose-300 flex items-center justify-center text-center shadow-md"
                      style={{ clipPath: 'polygon(50% 100%, 0% 0%, 100% 0%)' }}
                    >
                      <span className="mb-14 text-[10px]">وجه مثلث 2</span>
                    </div>
                  </div>

                  {/* Left Triangle Flap */}
                  <div
                    className="absolute inset-0 origin-right flex items-center justify-center text-white font-bold text-xs"
                    style={{
                      transform: `translateX(-180px) rotateY(${foldAngle * 0.75}deg)`
                    }}
                  >
                    <div
                      className="w-full h-full bg-rose-600/90 border-2 border-rose-300 flex items-center justify-center text-center shadow-md"
                      style={{ clipPath: 'polygon(0% 50%, 100% 0%, 100% 100%)' }}
                    >
                      <span className="mr-14 text-[10px]">وجه مثلث 3</span>
                    </div>
                  </div>

                  {/* Right Triangle Flap */}
                  <div
                    className="absolute inset-0 origin-left flex items-center justify-center text-white font-bold text-xs"
                    style={{
                      transform: `translateX(180px) rotateY(${-foldAngle * 0.75}deg)`
                    }}
                  >
                    <div
                      className="w-full h-full bg-rose-600/90 border-2 border-rose-300 flex items-center justify-center text-center shadow-md"
                      style={{ clipPath: 'polygon(100% 50%, 0% 0%, 0% 100%)' }}
                    >
                      <span className="ml-14 text-[10px]">وجه مثلث 4</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Interactive Drag & Rotate Guidance */}
          <div className="absolute bottom-4 inset-x-4 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <RotateCw className="w-3.5 h-3.5" />
              <span>استخدمي الأسفل لتدوير زاوية الرؤية الفراغية</span>
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setRotationY((prev) => prev - 30);
                  sound.playClick();
                }}
                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px]"
              >
                دوران يميناً ↻
              </button>
              <button
                onClick={() => {
                  setRotationY((prev) => prev + 30);
                  sound.playClick();
                }}
                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px]"
              >
                دوران يساراً ↺
              </button>
              <button
                onClick={() => {
                  setRotationX(-20);
                  setRotationY(35);
                  sound.playClick();
                }}
                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px]"
              >
                إعادة ضبط المنظور
              </button>
            </div>
          </div>
        </div>

        {/* Control & Concept Deck */}
        <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
          {/* Folding Slider */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="fold-slider" className="text-sm font-bold text-slate-800">
                مستوى طيّ الشبكة (Fold Angle):
              </label>
              <span className="text-sm font-black text-emerald-600 font-mono">
                {foldProgress}% ({Math.round(foldAngle)}°)
              </span>
            </div>
            <input
              id="fold-slider"
              type="range"
              min="0"
              max="100"
              step="1"
              value={foldProgress}
              onChange={(e) => handleFoldChange(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1">
              <span>0% منبسطة تماماً</span>
              <span>50% نصف مطوية</span>
              <span>100% مجسم مقفل</span>
            </div>

            {/* Quick Action Presets */}
            <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-200">
              <button
                onClick={() => handleFoldChange(0)}
                className="px-2 py-1 text-xs bg-white border border-slate-200 rounded-md hover:border-slate-400 text-slate-700 font-medium"
              >
                بسط الشبكة (2D)
              </button>
              <button
                onClick={() => handleFoldChange(50)}
                className="px-2 py-1 text-xs bg-white border border-slate-200 rounded-md hover:border-slate-400 text-slate-700 font-medium"
              >
                طي نصفي (45°)
              </button>
              <button
                onClick={() => handleFoldChange(100)}
                className="px-2 py-1 text-xs bg-emerald-50 border border-emerald-300 rounded-md text-emerald-800 font-medium"
              >
                إقفال المجسم (3D)
              </button>
            </div>
          </div>

          {/* Educational Concept Box */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 text-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>بطاقة المفهوم الهندسي: {shapesInfo[selectedShape].name}</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {shapesInfo[selectedShape].desc}
            </p>
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-emerald-200/60 text-center">
              <div className="bg-white/80 p-1.5 rounded-lg border border-emerald-100">
                <div className="text-[10px] text-slate-500">الأوجه</div>
                <div className="text-xs font-bold text-slate-800">{shapesInfo[selectedShape].faces}</div>
              </div>
              <div className="bg-white/80 p-1.5 rounded-lg border border-emerald-100">
                <div className="text-[10px] text-slate-500">الحواف</div>
                <div className="text-xs font-bold text-slate-800">{shapesInfo[selectedShape].edges}</div>
              </div>
              <div className="bg-white/80 p-1.5 rounded-lg border border-emerald-100">
                <div className="text-[10px] text-slate-500">الرؤوس</div>
                <div className="text-xs font-bold text-slate-800">{shapesInfo[selectedShape].vertices}</div>
              </div>
            </div>
          </div>

          {/* Validation Notice for Valid vs Invalid */}
          <div
            className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 ${
              testedNetType === 'valid'
                ? 'bg-emerald-50/60 border-emerald-200 text-emerald-800'
                : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}
          >
            {testedNetType === 'valid' ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block mb-0.5">شبكة صالحة:</strong>
                  تتوافق الأبعاد ولا يحدث أي تداخل أو تراكب بين الأوجه عند طي الحواف بزاوية 90°.
                </div>
              </>
            ) : (
              <>
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block mb-0.5">شبكة غير صالحة (تراكب الأوجه):</strong>
                  لاحظي كيف يتصادم الوجه المائل مع الوجه المقابل، مما يبقي جهة أخرى من المجسم غير مغطاة.
                </div>
              </>
            )}
          </div>

          {/* Display Options */}
          <div className="flex items-center justify-between text-xs text-slate-600 px-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showFaceLabels}
                onChange={(e) => setShowFaceLabels(e.target.checked)}
                className="rounded accent-emerald-600"
              />
              <span>إظهار مسميات الأوجه المتقابلة</span>
            </label>
            <div className="flex items-center gap-1 text-[11px] text-slate-400">
              <Layers className="w-3.5 h-3.5" />
              <span>مطابق لكتاب الطالب ص 49-51</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
