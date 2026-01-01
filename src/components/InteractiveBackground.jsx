import { useEffect, useRef, useCallback, useState } from 'react';

const SYMBOLS = ['★', '✦', '✧', '✨', '🌸', '⭐', '✿', '🌷', '💫', '🌺', '🦋', '🍀'];
const COLORS = ['#ff6b9d', '#ffb6c1', '#ffd93d', '#ff8a5c', '#ff69b4', '#c44569'];

class FloatingSymbol {
  constructor(canvas, x = null, y = null) {
    this.canvas = canvas;
    this.x = x ?? Math.random() * canvas.width;
    this.y = y ?? Math.random() * canvas.height;
    this.symbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
    this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    this.size = 16 + Math.random() * 20;
    this.baseX = this.x;
    this.baseY = this.y;
    this.angle = Math.random() * Math.PI * 2;
    this.angleSpeed = 0.005 + Math.random() * 0.01;
    this.wobbleX = 30 + Math.random() * 40;
    this.wobbleY = 20 + Math.random() * 30;
    this.driftY = -0.1 - Math.random() * 0.2;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotationSpeed = (Math.random() - 0.5) * 0.02;
    this.opacity = 0.4 + Math.random() * 0.3;
    this.pulsePhase = Math.random() * Math.PI * 2;
    this.pulseSpeed = 0.02 + Math.random() * 0.02;
    this.alive = true;
  }

  update() {
    this.angle += this.angleSpeed;
    this.pulsePhase += this.pulseSpeed;
    this.rotation += this.rotationSpeed;
    
    this.x = this.baseX + Math.sin(this.angle) * this.wobbleX;
    this.y = this.baseY + Math.cos(this.angle * 0.7) * this.wobbleY;
    this.baseY += this.driftY;
    
    // Wrap around
    if (this.baseY < -50) {
      this.baseY = this.canvas.height + 50;
    }
    if (this.baseY > this.canvas.height + 50) {
      this.baseY = -50;
    }
    
    return this.alive;
  }

  draw(ctx) {
    const pulse = 1 + Math.sin(this.pulsePhase) * 0.1;
    
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.globalAlpha = this.opacity * (0.8 + Math.sin(this.pulsePhase) * 0.2);
    ctx.font = `${this.size * pulse}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowBlur = 15;
    ctx.shadowColor = this.color;
    ctx.fillStyle = this.color;
    ctx.fillText(this.symbol, 0, 0);
    ctx.restore();
  }

  containsPoint(px, py) {
    const dist = Math.sqrt((px - this.x) ** 2 + (py - this.y) ** 2);
    return dist < this.size;
  }
}

class ExplosionParticle {
  constructor(x, y, color, symbol) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.symbol = symbol;
    const angle = Math.random() * Math.PI * 2;
    const speed = 3 + Math.random() * 6;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.life = 1;
    this.decay = 0.02 + Math.random() * 0.02;
    this.size = 8 + Math.random() * 12;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotationSpeed = (Math.random() - 0.5) * 0.3;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.1; // gravity
    this.vx *= 0.98;
    this.rotation += this.rotationSpeed;
    this.life -= this.decay;
    return this.life > 0;
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.globalAlpha = this.life;
    ctx.font = `${this.size * this.life}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowBlur = 10;
    ctx.shadowColor = this.color;
    ctx.fillStyle = this.color;
    ctx.fillText(this.symbol, 0, 0);
    ctx.restore();
  }
}

export default function InteractiveBackground() {
  const canvasRef = useRef(null);
  const symbolsRef = useRef([]);
  const explosionsRef = useRef([]);
  const animationRef = useRef(null);
  const [, setForceUpdate] = useState(0);

  const createExplosion = useCallback((x, y, color, symbol) => {
    const miniSymbols = ['✦', '✧', '·', '★', '✨'];
    for (let i = 0; i < 12; i++) {
      const sym = i < 3 ? symbol : miniSymbols[Math.floor(Math.random() * miniSymbols.length)];
      explosionsRef.current.push(new ExplosionParticle(x, y, color, sym));
    }
  }, []);

  const handleClick = useCallback((e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Check if clicked on any symbol
    for (let i = symbolsRef.current.length - 1; i >= 0; i--) {
      const symbol = symbolsRef.current[i];
      if (symbol.containsPoint(x, y)) {
        createExplosion(symbol.x, symbol.y, symbol.color, symbol.symbol);
        symbolsRef.current.splice(i, 1);
        setForceUpdate(n => n + 1);
        break;
      }
    }
  }, [createExplosion]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resize();
    window.addEventListener('resize', resize);

    // Initialize symbols
    for (let i = 0; i < 20; i++) {
      symbolsRef.current.push(new FloatingSymbol(canvas));
    }

    // Spawn new symbols periodically
    const spawnInterval = setInterval(() => {
      if (symbolsRef.current.length < 25) {
        const canvas = canvasRef.current;
        const newSymbol = new FloatingSymbol(
          canvas,
          Math.random() * canvas.width,
          canvas.height + 30
        );
        newSymbol.driftY = -0.3 - Math.random() * 0.3;
        symbolsRef.current.push(newSymbol);
      }
    }, 2000);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw symbols
      symbolsRef.current.forEach(symbol => {
        symbol.canvas = canvas;
        symbol.update();
        symbol.draw(ctx);
      });

      // Update and draw explosions
      explosionsRef.current = explosionsRef.current.filter(p => {
        const alive = p.update();
        if (alive) p.draw(ctx);
        return alive;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();
    canvas.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('click', handleClick);
      clearInterval(spawnInterval);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [handleClick]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-auto z-0"
      style={{ background: 'transparent' }}
    />
  );
}
