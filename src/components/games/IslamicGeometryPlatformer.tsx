import React, { useState, useEffect, useRef } from 'react';
import { Trophy, Heart, ArrowLeft, ArrowRight, ArrowUp, RotateCcw, Sparkles, Shield, Check, X, Volume2 } from 'lucide-react';
import { sound } from '../../utils/audio';
import { LessonId } from '../../types';

interface IslamicGeometryPlatformerProps {
  lessonId: LessonId;
  onEarnXp: (amount: number, reason: string) => void;
}

interface Platform {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'ground' | 'castle_brick' | 'knowledge_box';
  solved?: boolean;
  questionData?: {
    q: string;
    options: string[];
    correct: number;
    explanation: string;
  };
}

interface StarItem {
  x: number;
  y: number;
  collected: boolean;
}

interface StageConfig {
  title: string;
  location: string;
  subtitle: string;
  skyColors: [string, string];
  flagX: number;
  platforms: Platform[];
  stars: StarItem[];
}

const STAGES_CONFIG: Record<LessonId, StageConfig> = {
  'lesson-1': {
    title: 'مغامرة حصن جبرين المعماري الإسلامي',
    location: 'واحة بهلاء وحصن جبرين الأثري',
    subtitle: 'استكشفي شبكات المجسمات: المكعب، المنشور، ومتوازي المستطيلات',
    skyColors: ['#0369a1', '#7dd3fc'],
    flagX: 1850,
    platforms: [
      { x: 0, y: 330, width: 560, height: 70, type: 'ground' },
      {
        x: 210,
        y: 200,
        width: 46,
        height: 46,
        type: 'knowledge_box',
        solved: false,
        questionData: {
          q: 'في شبكة المكعب المنتظم، كم وجهاً مربعاً متطابقاً يلزم لتكوين مجسم مقفل؟',
          options: ['4 أوجه مربعة', '6 أوجه مربعة متطابقة', '8 أوجه', '12 وجهاً'],
          correct: 1,
          explanation: 'المكعب يتكون من 6 أوجه مربعة متطابقة ترتبط لتشكل شبكة قابلة للطي إلى مجسم مقفل.'
        }
      },
      { x: 330, y: 190, width: 140, height: 28, type: 'castle_brick' },
      {
        x: 520,
        y: 160,
        width: 46,
        height: 46,
        type: 'knowledge_box',
        solved: false,
        questionData: {
          q: 'المنشور الثلاثي القائم، ما هي الأشكال التي تؤلف شبكته المستوية؟',
          options: [
            'قاعدتان مثلثتان و 3 أوجه مستطيلة',
            '5 مربعات متساوية',
            '4 مثلثات وقاعدة مربعة',
            'دائرتان ومستطيل'
          ],
          correct: 0,
          explanation: 'شبكة المنشور الثلاثي تتألف من قاعدتين مثلثتين متطابقتين وثلاثة أوجه جانبية مستطيلة.'
        }
      },
      { x: 640, y: 330, width: 520, height: 70, type: 'ground' },
      { x: 790, y: 200, width: 140, height: 28, type: 'castle_brick' },
      {
        x: 990,
        y: 160,
        width: 46,
        height: 46,
        type: 'knowledge_box',
        solved: false,
        questionData: {
          q: 'إذا اتصل وجهان في شبكة متوازي المستطيلات بنفس الحافة مباشرة، فماذا يحدث عند الطي؟',
          options: [
            'يتراكب الوجهان ويبقى جانب من المجسم مفتوحاً',
            'يتكون مجسم سليم تماماً',
            'تزيد مساحة المجسم تلقائياً',
            'يتحول إلى هرم رباعي'
          ],
          correct: 0,
          explanation: 'التراكب على نفس الحافة يؤدي إلى تصادم الوجهين وبقاء جانب فارغ دون تغطية.'
        }
      },
      { x: 1120, y: 210, width: 130, height: 28, type: 'castle_brick' },
      { x: 1300, y: 330, width: 680, height: 70, type: 'ground' },
      {
        x: 1520,
        y: 190,
        width: 46,
        height: 46,
        type: 'knowledge_box',
        solved: false,
        questionData: {
          q: 'كم وجهاً يمتلك الهرم الرباعي في شبكته المستوية؟',
          options: ['3 أوجه', '4 أوجه', '5 أوجه (قاعدة مربعة و 4 مثلثات)', '6 أوجه'],
          correct: 2,
          explanation: 'الهرم الرباعي المنتظم يتكون من قاعدة مربعة واحدة و 4 أوجه مثلثة متطابقة تحيط بها.'
        }
      }
    ],
    stars: [
      { x: 160, y: 280, collected: false },
      { x: 380, y: 140, collected: false },
      { x: 850, y: 150, collected: false },
      { x: 1180, y: 160, collected: false },
      { x: 1600, y: 280, collected: false }
    ]
  },
  'lesson-2': {
    title: 'مسار قواطع التوازي وأبراج المراقبة التاريخية',
    location: 'حصن الحزم وأبراج الزوايا الهندسية',
    subtitle: 'استكشفي الزوايا المتبادلة (Z) والمتناظرة (F) والداخلة (C)',
    skyColors: ['#312e81', '#6366f1'],
    flagX: 1850,
    platforms: [
      { x: 0, y: 330, width: 520, height: 70, type: 'ground' },
      {
        x: 210,
        y: 200,
        width: 46,
        height: 46,
        type: 'knowledge_box',
        solved: false,
        questionData: {
          q: 'مستقيمان متوازيان قطعهما قاطع وتشكل حرف Z. ما العلاقة بين الزاويتين الداخليتين؟',
          options: ['متبادلتان ومتساويتان في القياس', 'متناظرتان', 'مجموعهما 90°', 'متقابلتان بالرأس'],
          correct: 0,
          explanation: 'الزوايا على شكل حرف Z بين خطين متوازيين هي زوايا متبادلة وتكون متساوية في القياس.'
        }
      },
      { x: 320, y: 180, width: 140, height: 28, type: 'castle_brick' },
      { x: 570, y: 330, width: 480, height: 70, type: 'ground' },
      {
        x: 730,
        y: 190,
        width: 46,
        height: 46,
        type: 'knowledge_box',
        solved: false,
        questionData: {
          q: 'الزوايا المتناظرة الناتجة عن توازي مستقيمين وقاطع تكون على شكل أي حرف؟',
          options: ['حرف F اللاتيني', 'حرف Z', 'حرف C', 'حرف X'],
          correct: 0,
          explanation: 'الزوايا المتناظرة تكون في نفس الموضع النسبي وتشكل حرف F اللاتيني وتكون متساوية.'
        }
      },
      { x: 890, y: 170, width: 140, height: 28, type: 'castle_brick' },
      { x: 1140, y: 330, width: 800, height: 70, type: 'ground' },
      {
        x: 1360,
        y: 190,
        width: 46,
        height: 46,
        type: 'knowledge_box',
        solved: false,
        questionData: {
          q: 'زاويتان داخلتان في جهة واحدة من القاطع بين مستقيمين متوازيين (حرف C). ما مجموعهما؟',
          options: ['180° (متكاملتان)', '90° (متتامتان)', '360°', 'متساويتان دائماً'],
          correct: 0,
          explanation: 'الزاويتان الداخليتان في جهة واحدة من القاطع متكاملتان ومجموع قياسهما = 180°.'
        }
      }
    ],
    stars: [
      { x: 150, y: 280, collected: false },
      { x: 380, y: 130, collected: false },
      { x: 800, y: 280, collected: false },
      { x: 960, y: 120, collected: false },
      { x: 1480, y: 280, collected: false }
    ]
  },
  'lesson-3': {
    title: 'قلعة نزوى الشامخة ومسار البراهين المنطقية',
    location: 'قلعة نزوى العريقة وبرج الشهباء',
    subtitle: 'استدلال براهين الزوايا، متوازي الأضلاع، ومجموع زوايا المثلث',
    skyColors: ['#1e1b4b', '#4f46e5'],
    flagX: 1850,
    platforms: [
      { x: 0, y: 330, width: 500, height: 70, type: 'ground' },
      {
        x: 210,
        y: 200,
        width: 46,
        height: 46,
        type: 'knowledge_box',
        solved: false,
        questionData: {
          q: 'في متوازي الأضلاع، إذا كانت الزاوية س = 65°، فما قياس الزاوية المقابلة لها؟',
          options: ['65° (كل زاويتين متقابلتين متساويتان)', '115°', '180°', '90°'],
          correct: 0,
          explanation: 'من خواص متوازي الأضلاع: كل زاويتين متقابلتين متساويتان في القياس.'
        }
      },
      { x: 320, y: 180, width: 140, height: 28, type: 'castle_brick' },
      { x: 560, y: 330, width: 500, height: 70, type: 'ground' },
      {
        x: 740,
        y: 190,
        width: 46,
        height: 46,
        type: 'knowledge_box',
        solved: false,
        questionData: {
          q: 'ما قياس الزاوية الخارجة للمثلث مقارنة بالزاويتين الداخلتين المقابلتين؟',
          options: [
            'تساوي مجموع قياسي الزاويتين الداخلتين المقابلتين',
            'تساوي نصف الزاوية الداخلة',
            'تساوي 180° دائماً',
            'تساوي 90° زاوية قائمة'
          ],
          correct: 0,
          explanation: 'مبرهنة الزاوية الخارجة للمثلث: قياسها يساوي مجموع قياسي الزاويتين الداخلتين المقابلتين لها.'
        }
      },
      { x: 900, y: 170, width: 140, height: 28, type: 'castle_brick' },
      { x: 1140, y: 330, width: 800, height: 70, type: 'ground' },
      {
        x: 1380,
        y: 190,
        width: 46,
        height: 46,
        type: 'knowledge_box',
        solved: false,
        questionData: {
          q: 'كم مجموع قياسات زوايا المضلع السداسي؟',
          options: ['720° (4 مثلثات × 180°)', '360°', '540°', '1080°'],
          correct: 0,
          explanation: 'ينقسم السداسي إلى 4 مثلثات من رأس واحد، مجموع الزوايا = 4 × 180° = 720°.'
        }
      }
    ],
    stars: [
      { x: 150, y: 280, collected: false },
      { x: 380, y: 130, collected: false },
      { x: 780, y: 280, collected: false },
      { x: 960, y: 120, collected: false },
      { x: 1460, y: 280, collected: false }
    ]
  }
};

export const IslamicGeometryPlatformer: React.FC<IslamicGeometryPlatformerProps> = ({
  lessonId,
  onEarnXp
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Deep clone stage data so we don't mutate the template
  const stageDataRef = useRef<StageConfig>(JSON.parse(JSON.stringify(STAGES_CONFIG[lessonId] || STAGES_CONFIG['lesson-1'])));

  // Game status
  const [score, setScore] = useState<number>(0);
  const [starsCount, setStarsCount] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  const [gameState, setGameState] = useState<'playing' | 'question_modal' | 'game_over' | 'level_clear'>('playing');
  const [activeQuestion, setActiveQuestion] = useState<Platform['questionData'] | null>(null);

  // Visual button states
  const [pressingLeft, setPressingLeft] = useState<boolean>(false);
  const [pressingRight, setPressingRight] = useState<boolean>(false);
  const [pressingJump, setPressingJump] = useState<boolean>(false);

  // Fast movement refs
  const isPressingLeftRef = useRef<boolean>(false);
  const isPressingRightRef = useRef<boolean>(false);
  const jumpBufferRef = useRef<number>(0);
  const coyoteTimeRef = useRef<number>(0);

  // Player physics
  const playerRef = useRef({
    x: 60,
    y: 250,
    vx: 0,
    vy: 0,
    width: 34,
    height: 44,
    isGrounded: true,
    facing: 'right' as 'left' | 'right'
  });

  const keysRef = useRef({
    left: false,
    right: false
  });

  const cameraXRef = useRef<number>(0);

  // Reload stage when lessonId changes
  useEffect(() => {
    stageDataRef.current = JSON.parse(JSON.stringify(STAGES_CONFIG[lessonId] || STAGES_CONFIG['lesson-1']));
    playerRef.current.x = 60;
    playerRef.current.y = 250;
    playerRef.current.vx = 0;
    playerRef.current.vy = 0;
    cameraXRef.current = 0;
    setLives(3);
    setGameState('playing');
  }, [lessonId]);

  // Jump trigger
  const triggerJump = () => {
    jumpBufferRef.current = 8;
    setPressingJump(true);
    setTimeout(() => setPressingJump(false), 200);
  };

  // Global window listeners to NEVER leave keys/touches stuck
  useEffect(() => {
    const handleGlobalPointerUp = () => {
      isPressingLeftRef.current = false;
      isPressingRightRef.current = false;
      setPressingLeft(false);
      setPressingRight(false);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', ' ', 'Space'].includes(e.key)) {
        e.preventDefault();
      }

      // Left
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A' || e.key === 'ش') {
        keysRef.current.left = true;
      }
      // Right
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D' || e.key === 'ي') {
        keysRef.current.right = true;
      }
      // Jump
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W' || e.key === 'ص' || e.key === ' ') {
        triggerJump();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A' || e.key === 'ش') {
        keysRef.current.left = false;
      }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D' || e.key === 'ي') {
        keysRef.current.right = false;
      }
    };

    window.addEventListener('pointerup', handleGlobalPointerUp);
    window.addEventListener('mouseup', handleGlobalPointerUp);
    window.addEventListener('touchend', handleGlobalPointerUp);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('pointerup', handleGlobalPointerUp);
      window.removeEventListener('mouseup', handleGlobalPointerUp);
      window.removeEventListener('touchend', handleGlobalPointerUp);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Main Game Loop
  useEffect(() => {
    let animId: number;

    const gameLoop = () => {
      if (gameState === 'playing') {
        updatePhysics();
        renderScene();
      }
      animId = requestAnimationFrame(gameLoop);
    };

    animId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animId);
  }, [gameState, lessonId]);

  // Robust Physics
  const updatePhysics = () => {
    const p = playerRef.current;
    const stage = stageDataRef.current;
    const gravity = 0.58;
    const speed = 4.6;

    // Movement: keyboard or touch state
    const moveLeft = keysRef.current.left || isPressingLeftRef.current;
    const moveRight = keysRef.current.right || isPressingRightRef.current;

    if (moveLeft) {
      p.vx = -speed;
      p.facing = 'left';
    } else if (moveRight) {
      p.vx = speed;
      p.facing = 'right';
    } else {
      p.vx *= 0.72;
      if (Math.abs(p.vx) < 0.1) p.vx = 0;
    }

    // Process Jump request
    if (jumpBufferRef.current > 0) {
      jumpBufferRef.current--;
      if (p.isGrounded || coyoteTimeRef.current > 0) {
        p.vy = -12.6;
        p.isGrounded = false;
        coyoteTimeRef.current = 0;
        jumpBufferRef.current = 0;
        sound.playJump();
      }
    }

    if (coyoteTimeRef.current > 0) {
      coyoteTimeRef.current--;
    }

    // Gravity
    p.vy += gravity;
    if (p.vy > 14) p.vy = 14;

    const prevY = p.y;
    p.x += p.vx;
    p.y += p.vy;

    // Prevent moving off the left
    if (p.x < 15) {
      p.x = 15;
      p.vx = 0;
    }

    let groundedThisFrame = false;

    // Check collisions with platforms
    for (const plat of stage.platforms) {
      const playerBottom = p.y + p.height;
      const prevBottom = prevY + p.height;

      // Landing on platform top
      if (
        p.x + p.width > plat.x &&
        p.x < plat.x + plat.width &&
        playerBottom >= plat.y &&
        prevBottom <= plat.y + 24 &&
        p.vy >= 0
      ) {
        p.y = plat.y - p.height;
        p.vy = 0;
        groundedThisFrame = true;
        coyoteTimeRef.current = 6;
      }

      // Hitting knowledge box from underneath
      if (
        plat.type === 'knowledge_box' &&
        !plat.solved &&
        p.x + p.width > plat.x + 4 &&
        p.x < plat.x + plat.width - 4 &&
        p.y <= plat.y + plat.height &&
        p.y >= plat.y + plat.height - 20 &&
        p.vy < 0
      ) {
        p.vy = 2; // bounce down
        plat.solved = true;
        sound.playCoin();
        if (plat.questionData) {
          setActiveQuestion(plat.questionData);
          setGameState('question_modal');
          return;
        }
      }
    }

    p.isGrounded = groundedThisFrame;

    // Collecting Islamic geometric stars
    for (const star of stage.stars) {
      if (!star.collected) {
        const dx = p.x + p.width / 2 - star.x;
        const dy = p.y + p.height / 2 - star.y;
        if (Math.sqrt(dx * dx + dy * dy) < 32) {
          star.collected = true;
          sound.playCoin();
          setStarsCount((c) => c + 1);
          setScore((s) => s + 50);
          onEarnXp(15, 'جمع نجمة المعرفة الهندسية');
        }
      }
    }

    // Reach citadel flagpole
    if (p.x >= stage.flagX - 30) {
      sound.playVictory();
      setGameState('level_clear');
      onEarnXp(100, `الوصول لقمة قلعة ${stage.title}`);
      return;
    }

    // Falling into ravine: Respawn safely instead of blacking out!
    if (p.y > 420) {
      sound.playHurt();
      setLives((l) => {
        const next = l - 1;
        if (next <= 0) {
          setGameState('game_over');
        } else {
          // Safe respawn
          p.x = Math.max(60, p.x - 200);
          p.y = 220;
          p.vx = 0;
          p.vy = 0;
        }
        return next;
      });
    }

    // Smooth camera tracking
    const targetCamX = p.x - 220;
    cameraXRef.current += (targetCamX - cameraXRef.current) * 0.12;
    if (cameraXRef.current < 0) cameraXRef.current = 0;
    if (cameraXRef.current > stage.flagX - 450) cameraXRef.current = stage.flagX - 450;
  };

  // Render Scene
  const renderScene = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const camX = cameraXRef.current;
    const stage = stageDataRef.current;

    // Sky gradient
    const sky = ctx.createLinearGradient(0, 0, 0, height);
    sky.addColorStop(0, stage.skyColors[0]);
    sky.addColorStop(1, stage.skyColors[1]);
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, width, height);

    // Distant Omani Mountains & Minarets (Parallax)
    ctx.fillStyle = 'rgba(15, 23, 42, 0.25)';
    for (let i = 0; i < 7; i++) {
      const mx = i * 360 - camX * 0.18;
      ctx.beginPath();
      ctx.moveTo(mx - 140, 330);
      ctx.lineTo(mx + 60, 120);
      ctx.lineTo(mx + 260, 330);
      ctx.closePath();
      ctx.fill();

      // Islamic Dome Silhouette
      ctx.beginPath();
      ctx.arc(mx + 180, 240, 35, Math.PI, 0);
      ctx.fill();
    }

    // Platforms & Castle Bricks
    for (const plat of stage.platforms) {
      const px = plat.x - camX;
      if (px + plat.width < -60 || px > width + 60) continue;

      if (plat.type === 'ground') {
        ctx.fillStyle = '#b45309';
        ctx.fillRect(px, plat.y, plat.width, plat.height);

        // Crenellations (شرفات القلعة)
        ctx.fillStyle = '#92400e';
        ctx.fillRect(px, plat.y, plat.width, 10);
        for (let cr = px; cr < px + plat.width; cr += 26) {
          ctx.fillRect(cr, plat.y - 8, 13, 8);
        }

        // Brick mortar lines
        ctx.strokeStyle = '#78350f';
        ctx.lineWidth = 1;
        for (let by = plat.y + 14; by < plat.y + plat.height; by += 16) {
          ctx.beginPath();
          ctx.moveTo(px, by);
          ctx.lineTo(px + plat.width, by);
          ctx.stroke();
        }
      } else if (plat.type === 'castle_brick') {
        ctx.fillStyle = '#d97706';
        ctx.fillRect(px, plat.y, plat.width, plat.height);
        ctx.strokeStyle = '#92400e';
        ctx.lineWidth = 2;
        ctx.strokeRect(px, plat.y, plat.width, plat.height);
      } else if (plat.type === 'knowledge_box') {
        if (plat.solved) {
          ctx.fillStyle = '#475569';
          ctx.fillRect(px, plat.y, plat.width, plat.height);
          ctx.strokeStyle = '#334155';
          ctx.strokeRect(px, plat.y, plat.width, plat.height);
          ctx.fillStyle = '#94a3b8';
          ctx.font = 'bold 18px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('✓', px + plat.width / 2, plat.y + plat.height / 2);
        } else {
          // Golden Islamic Geometric Mystery Box
          ctx.fillStyle = '#f59e0b';
          ctx.fillRect(px, plat.y, plat.width, plat.height);
          ctx.strokeStyle = '#d97706';
          ctx.lineWidth = 2.5;
          ctx.strokeRect(px, plat.y, plat.width, plat.height);

          // Golden Corner Ornaments
          ctx.fillStyle = '#fde68a';
          ctx.fillRect(px + 2, plat.y + 2, 6, 6);
          ctx.fillRect(px + plat.width - 8, plat.y + 2, 6, 6);
          ctx.fillRect(px + 2, plat.y + plat.height - 8, 6, 6);
          ctx.fillRect(px + plat.width - 8, plat.y + plat.height - 8, 6, 6);

          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 24px Cairo, sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('؟', px + plat.width / 2, plat.y + plat.height / 2 + 1);
        }
      }
    }

    // Collectible 8-point Islamic Geometric Stars
    for (const star of stage.stars) {
      if (star.collected) continue;
      const sx = star.x - camX;
      if (sx < -30 || sx > width + 30) continue;

      ctx.save();
      ctx.translate(sx, star.y);
      ctx.fillStyle = '#fbbf24';
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 1.5;

      ctx.beginPath();
      for (let i = 0; i < 8; i++) {
        const r = i % 2 === 0 ? 12 : 6;
        const angle = (i * Math.PI) / 4;
        const x = Math.cos(angle) * r;
        const y = Math.sin(angle) * r;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }

    // Citadel Gate & Green Crescent Banner at the end
    const gx = stage.flagX - camX;
    if (gx > -80 && gx < width + 80) {
      ctx.fillStyle = '#92400e';
      ctx.fillRect(gx, 100, 84, 230);
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(gx + 42, 100, 38, Math.PI, 0);
      ctx.fill();

      // Green Islamic Crescent Flag
      ctx.fillStyle = '#15803d';
      ctx.fillRect(gx + 42, 40, 48, 28);
      ctx.fillStyle = '#fef08a';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText('🌙', gx + 60, 60);

      // Gate Archway
      ctx.fillStyle = '#451a03';
      ctx.beginPath();
      ctx.arc(gx + 42, 270, 26, Math.PI, 0);
      ctx.lineTo(gx + 68, 330);
      ctx.lineTo(gx + 16, 330);
      ctx.closePath();
      ctx.fill();
    }

    // Muslim Student Hero Character (محجبة بوقار، ثوب محتشم، ومخطوطة رياضية)
    const p = playerRef.current;
    const px = p.x - camX;

    ctx.save();
    ctx.translate(px, p.y);

    // Modest Islamic Dress (ثوب محتشم بألوان راقية)
    ctx.fillStyle = '#4338ca';
    ctx.fillRect(4, 16, p.width - 8, p.height - 18);

    // Golden dress border
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(p.width / 2 - 2, 16, 4, 16);

    // Hijab Headscarf (حجاب وقور)
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.ellipse(p.width / 2, 11, 13, 14, 0, 0, Math.PI * 2);
    ctx.fill();

    // Face
    ctx.fillStyle = '#fed7aa';
    ctx.beginPath();
    ctx.arc(p.width / 2 + (p.facing === 'right' ? 2 : -2), 12, 7.5, 0, Math.PI * 2);
    ctx.fill();

    // Eye
    ctx.fillStyle = '#1e1b4b';
    ctx.fillRect(p.width / 2 + (p.facing === 'right' ? 4 : -5), 11, 2.5, 3.5);

    // Mathematical Scroll (مخطوطة الهندسة)
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(p.facing === 'right' ? p.width - 4 : -3, 22, 7, 12);
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 1;
    ctx.strokeRect(p.facing === 'right' ? p.width - 4 : -3, 22, 7, 12);

    ctx.restore();
  };

  // Answer question modal
  const handleQuestionAnswer = (chosenIndex: number) => {
    if (!activeQuestion) return;
    if (chosenIndex === activeQuestion.correct) {
      sound.playCorrect();
      setScore((s) => s + 100);
      setStarsCount((c) => c + 3);
      onEarnXp(35, 'حل لغز صندوق المعرفة بنجاح');
    } else {
      sound.playWrong();
    }
    setGameState('playing');
    setActiveQuestion(null);
  };

  const handleRestart = () => {
    stageDataRef.current = JSON.parse(JSON.stringify(STAGES_CONFIG[lessonId] || STAGES_CONFIG['lesson-1']));
    playerRef.current.x = 60;
    playerRef.current.y = 250;
    playerRef.current.vx = 0;
    playerRef.current.vy = 0;
    cameraXRef.current = 0;
    setLives(3);
    setGameState('playing');
  };

  const currentStage = stageDataRef.current;

  return (
    <div className="bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl p-4 sm:p-6 text-white overflow-hidden select-none">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 font-black flex items-center justify-center text-sm shadow-md">
              <Shield className="w-5 h-5" />
            </span>
            <h3 className="text-base sm:text-lg font-black text-amber-300">
              {currentStage.title}
            </h3>
          </div>
          <p className="text-xs text-slate-300 mt-0.5">
            {currentStage.location} · {currentStage.subtitle}
          </p>
        </div>

        {/* Meters */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-slate-800/90 px-3 py-1.5 rounded-xl border border-slate-700 text-xs font-mono">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="font-bold text-amber-300">{score} نقطة</span>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-800/90 px-3 py-1.5 rounded-xl border border-slate-700 text-xs font-mono">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span className="font-bold text-yellow-300">{starsCount} نجوم</span>
          </div>

          <div className="flex items-center gap-1 bg-slate-800/90 px-3 py-1.5 rounded-xl border border-slate-700 text-xs">
            <Heart className="w-4 h-4 text-red-500 fill-red-500" />
            <span className="font-bold">{lives}</span>
          </div>
        </div>
      </div>

      {/* Main Canvas Viewport with direct tap zones */}
      <div className="relative mt-4 rounded-2xl overflow-hidden border-2 border-slate-700 shadow-inner bg-slate-950 flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={760}
          height={380}
          className="w-full h-auto max-h-[420px] block cursor-pointer"
          style={{ touchAction: 'none' }}
        />

        {/* Level Clear Overlay */}
        {gameState === 'level_clear' && (
          <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center mb-3 shadow-lg">
              <Trophy className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-amber-300">مبارك! وصلتِ إلى قمة القلعة بنجاح 🏰</h3>
            <p className="text-xs text-slate-200 mt-1 max-w-sm leading-relaxed">
              تمكنتِ من حل ألغاز الزوايا والشبكات بامتياز وحصدتِ المعرفة الهندسية الشاملة.
            </p>
            <button
              onClick={handleRestart}
              className="mt-5 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 font-bold text-xs rounded-xl shadow-md transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>إعادة التحدي وحصد المزيد من النقاط</span>
            </button>
          </div>
        )}

        {/* Game Over Overlay */}
        {gameState === 'game_over' && (
          <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center p-6 text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-2xl bg-rose-600 text-white flex items-center justify-center mb-3 shadow-lg">
              <RotateCcw className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-rose-400">انتهت المحاولات!</h3>
            <p className="text-xs text-slate-400 mt-1">
              المحاولة والتدريب أساس الإتقان الهندسي، دعينا نجرب مجدداً!
            </p>
            <button
              onClick={handleRestart}
              className="mt-4 px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              إعادة المحاولة فوراً ↺
            </button>
          </div>
        )}

        {/* Question Modal (When player bumps a knowledge chest "؟") */}
        {gameState === 'question_modal' && activeQuestion && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4 z-20">
            <div className="bg-slate-900 border-2 border-amber-400 rounded-2xl p-5 max-w-md w-full shadow-2xl text-right">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-amber-400">صندوق المعرفة والهندسة ✦</span>
                <span className="text-xs font-mono text-emerald-400">+100 نقطة خبرة</span>
              </div>

              <h4 className="text-sm font-bold text-white mt-3 mb-4 leading-relaxed">
                {activeQuestion.q}
              </h4>

              <div className="space-y-2.5">
                {activeQuestion.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuestionAnswer(idx)}
                    className="w-full p-3.5 bg-slate-800 hover:bg-amber-600/30 active:bg-amber-600/50 border border-slate-700 hover:border-amber-400 rounded-xl text-xs font-bold text-slate-100 text-right transition-all flex items-center justify-between cursor-pointer min-h-[48px]"
                  >
                    <span>{opt}</span>
                    <span className="w-5 h-5 rounded-md bg-slate-700 flex items-center justify-center text-[10px] text-slate-300">
                      {idx + 1}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* DUAL-SIDE GAMEPAD CONTROLS (الازرار في الجانبين المجاورين) */}
      <div className="mt-5 pt-4 border-t border-slate-800">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-3 px-1">
          <span className="font-semibold text-amber-400">
            🎮 تحكم الإبهامين المزدوج (Dual Controls): أزرار الحركة في جانب، وزر القفز في الجانب المجاور:
          </span>
          <span className="text-slate-400 hidden sm:inline">أو استخدمي الأسهم و W A D والمسافة</span>
        </div>

        {/* Dual Side Layout: Left Pad on one side, Jump button on the adjacent opposite side */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-950/70 p-4 rounded-2xl border border-slate-800">
          {/* DIRECTIONAL PAD (جانب الحركة) */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-center">
            {/* Move Left Button */}
            <button
              onPointerDown={(e) => {
                e.preventDefault();
                e.currentTarget.setPointerCapture?.(e.pointerId);
                isPressingLeftRef.current = true;
                isPressingRightRef.current = false;
                setPressingLeft(true);
                setPressingRight(false);
              }}
              onPointerUp={(e) => {
                e.preventDefault();
                isPressingLeftRef.current = false;
                setPressingLeft(false);
              }}
              onPointerCancel={() => {
                isPressingLeftRef.current = false;
                setPressingLeft(false);
              }}
              style={{ touchAction: 'none' }}
              className={`flex-1 sm:flex-none sm:w-36 py-4 px-4 rounded-2xl border-2 flex flex-col items-center justify-center transition-all cursor-pointer select-none min-h-[64px] ${
                pressingLeft
                  ? 'bg-amber-500 border-amber-300 text-slate-950 scale-95 shadow-inner'
                  : 'bg-slate-800 hover:bg-slate-700 active:bg-amber-500 border-slate-700 text-white shadow-md'
              }`}
            >
              <ArrowLeft className="w-7 h-7 mb-0.5" />
              <span className="text-xs font-black">◄ يسار (Move Left)</span>
            </button>

            {/* Move Right Button */}
            <button
              onPointerDown={(e) => {
                e.preventDefault();
                e.currentTarget.setPointerCapture?.(e.pointerId);
                isPressingRightRef.current = true;
                isPressingLeftRef.current = false;
                setPressingRight(true);
                setPressingLeft(false);
              }}
              onPointerUp={(e) => {
                e.preventDefault();
                isPressingRightRef.current = false;
                setPressingRight(false);
              }}
              onPointerCancel={() => {
                isPressingRightRef.current = false;
                setPressingRight(false);
              }}
              style={{ touchAction: 'none' }}
              className={`flex-1 sm:flex-none sm:w-36 py-4 px-4 rounded-2xl border-2 flex flex-col items-center justify-center transition-all cursor-pointer select-none min-h-[64px] ${
                pressingRight
                  ? 'bg-amber-500 border-amber-300 text-slate-950 scale-95 shadow-inner'
                  : 'bg-slate-800 hover:bg-slate-700 active:bg-amber-500 border-slate-700 text-white shadow-md'
              }`}
            >
              <ArrowRight className="w-7 h-7 mb-0.5" />
              <span className="text-xs font-black">يمين ► (Move Right)</span>
            </button>
          </div>

          {/* ADJACENT SIDE: BIG JUMP BUTTON (الجانب المجاور: زر القفز الكبير) */}
          <div className="w-full sm:w-auto flex justify-center">
            <button
              onPointerDown={(e) => {
                e.preventDefault();
                e.currentTarget.setPointerCapture?.(e.pointerId);
                triggerJump();
              }}
              style={{ touchAction: 'none' }}
              className={`w-full sm:w-56 py-4 px-6 rounded-2xl border-2 flex flex-col items-center justify-center transition-all cursor-pointer select-none min-h-[64px] shadow-lg ${
                pressingJump
                  ? 'bg-emerald-400 border-emerald-200 text-slate-950 scale-95 shadow-inner'
                  : 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 active:from-emerald-400 border-emerald-400 text-white hover:brightness-110'
              }`}
            >
              <ArrowUp className="w-7 h-7 mb-0.5" />
              <span className="text-sm font-black tracking-wide">قفـز 🡅 (JUMP)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
