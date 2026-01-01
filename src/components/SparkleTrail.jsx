import { useEffect, useCallback } from 'react';

const SPARKLE_COLORS = ['#ff6b9d', '#ffb6c1', '#ffd93d', '#ff8a5c', '#ffffff', '#c44569'];

export default function SparkleTrail() {
  const createSparkle = useCallback((x, y) => {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    
    const color = SPARKLE_COLORS[Math.floor(Math.random() * SPARKLE_COLORS.length)];
    const size = Math.random() * 10 + 5;
    const symbols = ['✦', '✧', '★', '🌸', '✨', '·'];
    const symbol = symbols[Math.floor(Math.random() * symbols.length)];
    
    sparkle.innerHTML = symbol;
    sparkle.style.left = `${x - size / 2}px`;
    sparkle.style.top = `${y - size / 2}px`;
    sparkle.style.fontSize = `${size}px`;
    sparkle.style.color = color;
    sparkle.style.textShadow = `0 0 ${size}px ${color}`;
    
    document.body.appendChild(sparkle);
    
    setTimeout(() => {
      sparkle.remove();
    }, 800);
  }, []);

  useEffect(() => {
    let lastTime = 0;
    const throttleMs = 50;

    const handleMouseMove = (e) => {
      const now = Date.now();
      if (now - lastTime < throttleMs) return;
      lastTime = now;
      
      // Random offset for more organic feel
      const offsetX = (Math.random() - 0.5) * 20;
      const offsetY = (Math.random() - 0.5) * 20;
      
      createSparkle(e.clientX + offsetX, e.clientY + offsetY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [createSparkle]);

  return null;
}
