import React, { useEffect, useRef } from 'react';

const SimpleFluidBackground = () => {
  const canvasRef = useRef(null);
  const animationFrameRef = useRef();
  const particlesRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resizeCanvas();

    // Particle class
    class Particle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
        this.life = 1.0;
        this.decay = 0.02;
        this.size = Math.random() * 20 + 10;
        this.color = {
          r: Math.random() * 100 + 100,
          g: Math.random() * 100 + 50,
          b: Math.random() * 200 + 150
        };
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vx *= 0.98;
        this.vy *= 0.98;
        this.life -= this.decay;
        this.size *= 0.99;
      }

      draw(ctx) {
        if (this.life <= 0) return;

        ctx.save();
        ctx.globalAlpha = this.life * 0.7;
        
        // Create gradient
        const gradient = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.size
        );
        gradient.addColorStop(0, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0.8)`);
        gradient.addColorStop(1, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      isDead() {
        return this.life <= 0 || this.size <= 1;
      }
    }

    // Mouse tracking
    let mouseX = 0;
    let mouseY = 0;
    let lastMouseX = 0;
    let lastMouseY = 0;

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;

      // Calculate velocity
      const vx = mouseX - lastMouseX;
      const vy = mouseY - lastMouseY;

      // Create particles based on movement
      if (Math.abs(vx) > 2 || Math.abs(vy) > 2) {
        for (let i = 0; i < 3; i++) {
          const particle = new Particle(
            mouseX + (Math.random() - 0.5) * 20,
            mouseY + (Math.random() - 0.5) * 20
          );
          particle.vx = vx * 0.1 + (Math.random() - 0.5) * 2;
          particle.vy = vy * 0.1 + (Math.random() - 0.5) * 2;
          particlesRef.current.push(particle);
        }
      }

      lastMouseX = mouseX;
      lastMouseY = mouseY;
    };

    // Render function
    const render = () => {
      // Clear canvas with slight fade
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add occasional random particles
      if (Math.random() < 0.01) {
        particlesRef.current.push(new Particle(
          Math.random() * canvas.width,
          Math.random() * canvas.height
        ));
      }

      // Update and draw particles
      particlesRef.current = particlesRef.current.filter(particle => {
        particle.update();
        particle.draw(ctx);
        return !particle.isDead();
      });

      animationFrameRef.current = requestAnimationFrame(render);
    };

    // Event listeners
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', resizeCanvas);

    console.log('Simple fluid background initialized!');
    render();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: -1,
      pointerEvents: 'none'
    }}>
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          opacity: 0.6
        }}
      />
    </div>
  );
};

export default SimpleFluidBackground;
