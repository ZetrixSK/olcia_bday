import { useEffect, useRef, useState } from 'react';

const COLORS = ['#ff6b9d', '#ff8a5c', '#ffd93d', '#ff69b4', '#ff1493', '#ffb6c1', '#ffa07a'];

// Explosion particle
class Particle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    const angle = Math.random() * Math.PI * 2;
    const speed = 2 + Math.random() * 6;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.life = 1;
    this.decay = 0.008 + Math.random() * 0.008;
    this.size = 2 + Math.random() * 3;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.05; // gravity
    this.vx *= 0.99;
    this.life -= this.decay;
    return this.life > 0;
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.life;
    ctx.fillStyle = this.color;
    ctx.shadowBlur = 10;
    ctx.shadowColor = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size * this.life, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

// Rising firework
class Firework {
  constructor(x, targetY, onExplode) {
    this.x = x;
    this.y = window.innerHeight + 10;
    this.targetY = targetY;
    this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    this.speed = 8 + Math.random() * 4;
    this.exploded = false;
    this.onExplode = onExplode;
    this.trail = [];
  }

  update() {
    if (!this.exploded) {
      this.trail.push({ x: this.x, y: this.y, life: 1 });
      this.trail = this.trail.filter(t => {
        t.life -= 0.05;
        return t.life > 0;
      });
      
      this.y -= this.speed;
      if (this.y <= this.targetY) {
        this.exploded = true;
        if (this.onExplode) this.onExplode(this.x, this.targetY);
        return true;
      }
    }
    return false;
  }

  draw(ctx) {
    if (!this.exploded) {
      ctx.save();
      // Draw trail
      this.trail.forEach(t => {
        ctx.globalAlpha = t.life * 0.4;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(t.x, t.y, 2, 0, Math.PI * 2);
        ctx.fill();
      });
      
      // Draw firework head
      ctx.globalAlpha = 1;
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 15;
      ctx.shadowColor = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }
}

// Pre-generate stars
const STARS = Array.from({ length: 120 }, () => ({
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: 0.3 + Math.random() * 1.2,
  twinkleOffset: Math.random() * Math.PI * 2,
  twinkleSpeed: 0.01 + Math.random() * 0.02,
}));

export default function CelebrationScreen({ onBack }) {
  const canvasRef = useRef(null);
  const [showLine1, setShowLine1] = useState(false);
  const [showLine2, setShowLine2] = useState(false);
  const [showBackButton, setShowBackButton] = useState(false);
  const animationRef = useRef(null);
  const particlesRef = useRef([]);
  const fireworksRef = useRef([]);
  const phaseRef = useRef(0);
  const frameRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const createExplosion = (x, y, count = 80) => {
      for (let i = 0; i < count; i++) {
        const color = COLORS[Math.floor(Math.random() * COLORS.length)];
        particlesRef.current.push(new Particle(x, y, color));
      }
    };

    // Launch firework for line 1
    setTimeout(() => {
      const line1Y = canvas.height * 0.38;
      fireworksRef.current.push(new Firework(
        canvas.width * 0.5,
        line1Y,
        (x, y) => {
          createExplosion(x, y, 100);
          setShowLine1(true);
          
          // Launch firework for line 2 after delay
          setTimeout(() => {
            const line2Y = canvas.height * 0.55;
            fireworksRef.current.push(new Firework(
              canvas.width * 0.5,
              line2Y,
              (x2, y2) => {
                createExplosion(x2, y2, 80);
                setShowLine2(true);
                phaseRef.current = 1;
                setTimeout(() => setShowBackButton(true), 1500);
              }
            ));
          }, 1200);
        }
      ));
    }, 800);

    const launchRandomFirework = () => {
      const x = canvas.width * 0.1 + Math.random() * canvas.width * 0.8;
      const y = canvas.height * 0.1 + Math.random() * canvas.height * 0.35;
      fireworksRef.current.push(new Firework(x, y, (ex, ey) => createExplosion(ex, ey, 60)));
    };

    const animate = () => {
      frameRef.current++;
      
      // Dark night sky background
      ctx.fillStyle = '#050208';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw twinkling stars
      const time = frameRef.current * 0.016;
      ctx.save();
      ctx.shadowBlur = 0;
      ctx.shadowColor = 'transparent';
      STARS.forEach(star => {
        const twinkle = 0.3 + Math.sin(time * star.twinkleSpeed * 60 + star.twinkleOffset) * 0.4;
        ctx.globalAlpha = Math.max(0.1, twinkle);
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(
          (star.x / 100) * canvas.width,
          (star.y / 100) * canvas.height,
          star.size,
          0,
          Math.PI * 2
        );
        ctx.fill();
      });
      ctx.restore();

      // Random fireworks in background after text appears
      if (phaseRef.current === 1 && Math.random() < 0.04) {
        launchRandomFirework();
      }

      // Update and draw fireworks
      fireworksRef.current = fireworksRef.current.filter(fw => {
        const exploded = fw.update();
        fw.draw(ctx);
        return !exploded && !fw.exploded;
      });

      // Update and draw particles
      particlesRef.current = particlesRef.current.filter(p => {
        const alive = p.update();
        if (alive) p.draw(ctx);
        return alive;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      
      {/* Text overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none px-4 pt-8">
        <h1 
          className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-8 transition-all duration-500 text-center
            ${showLine1 ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}
          style={{
            fontFamily: "'Great Vibes', cursive",
            background: 'linear-gradient(90deg, #ff6b9d, #ffb6c1, #ff69b4)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 0 25px rgba(255, 107, 157, 0.7))',
            lineHeight: '1.4',
            padding: '0.2em 0',
          }}
        >
          Happy 20th Birthday
        </h1>

        <h2 
          className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl transition-all duration-500 text-center
            ${showLine2 ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}
          style={{
            fontFamily: "'Great Vibes', cursive",
            background: 'linear-gradient(90deg, #ffd93d, #ff8a5c, #ff6b9d)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 0 25px rgba(255, 217, 61, 0.7))',
            lineHeight: '1.4',
            padding: '0.2em 0',
          }}
        >
          Olcia!
        </h2>
      </div>

      {/* Back button */}
      {showBackButton && (
        <button
          onClick={onBack}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 
            px-8 py-3 bg-[#1a0f18]/80 backdrop-blur-sm
            border border-[#ff6b9d]/30 rounded-2xl
            text-[#ff6b9d] hover:text-[#ffb6c1] hover:border-[#ff6b9d]/50
            transition-all duration-300 z-10 flex items-center gap-2"
        >
          Return
        </button>
      )}
    </div>
  );
}
