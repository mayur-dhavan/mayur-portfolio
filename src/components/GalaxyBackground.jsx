import React, { useEffect, useRef } from 'react';

const GalaxyBackground = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let stars = [];
    let shootingStars = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createStars = (count) => {
      stars = [];
      
      // Create different types of stars for layered effect
      for (let i = 0; i < count; i++) {
        const starType = Math.random();
        let star;
        
        if (starType < 0.7) {
          // Background stars - small and dim
          star = {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 1 + 0.5,
            opacity: Math.random() * 0.6 + 0.2,
            twinkleSpeed: Math.random() * 0.02 + 0.01,
            color: getStarColor(),
            type: 'background',
            glowSize: 0
          };
        } else if (starType < 0.9) {
          // Medium stars - moderate size and brightness
          star = {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 1.5 + 1,
            opacity: Math.random() * 0.7 + 0.4,
            twinkleSpeed: Math.random() * 0.03 + 0.015,
            color: getStarColor(),
            type: 'medium',
            glowSize: Math.random() * 3 + 2,
            pulseSpeed: Math.random() * 0.02 + 0.01
          };
        } else {
          // Bright stars - large with glow effect
          star = {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2 + 1.5,
            opacity: Math.random() * 0.4 + 0.7,
            twinkleSpeed: Math.random() * 0.04 + 0.02,
            color: getStarColor(),
            type: 'bright',
            glowSize: Math.random() * 8 + 5,
            pulseSpeed: Math.random() * 0.025 + 0.015,
            flareIntensity: Math.random() * 0.3 + 0.7
          };
        }
        
        stars.push(star);
      }
    };

    // Get realistic star colors
    const getStarColor = () => {
      const colors = [
        { r: 255, g: 255, b: 255, name: 'white' },      // White
        { r: 255, g: 248, b: 220, name: 'warm' },       // Warm white
        { r: 173, g: 216, b: 255, name: 'blue' },       // Blue
        { r: 255, g: 204, b: 111, name: 'yellow' },     // Yellow
        { r: 255, g: 180, b: 107, name: 'orange' },     // Orange
        { r: 248, g: 247, b: 255, name: 'blue-white' }, // Blue-white
      ];
      return colors[Math.floor(Math.random() * colors.length)];
    };

    const createShootingStar = () => {
      const color = getStarColor();
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height * 0.5, // Upper half of screen
        length: Math.random() * 100 + 30,
        speed: Math.random() * 12 + 8,
        size: Math.random() * 1.5 + 1,
        angle: Math.random() * Math.PI * 0.3 + Math.PI * 0.1, // Angled downward
        opacity: 1,
        life: 0,
        color: color,
        trail: Math.random() * 0.5 + 0.5 // Trail intensity
      };
    };

    const drawStars = () => {
      stars.forEach(star => {
        const time = Date.now() * 0.001;
        
        // Calculate twinkling effect
        let twinkle = Math.sin(time * star.twinkleSpeed + star.x * 0.01) * 0.3 + 0.7;
        let currentOpacity = star.opacity * twinkle;
        
        // Add pulsing effect for medium and bright stars
        if (star.type !== 'background') {
          const pulse = Math.sin(time * star.pulseSpeed + star.y * 0.01) * 0.2 + 0.8;
          currentOpacity *= pulse;
        }
        
        currentOpacity = Math.max(0.1, Math.min(1, currentOpacity));
        
        // Draw glow effect for medium and bright stars
        if (star.glowSize > 0) {
          const glowRadius = star.glowSize * (twinkle * 0.5 + 0.5);
          const gradient = ctx.createRadialGradient(
            star.x, star.y, 0,
            star.x, star.y, glowRadius
          );
          
          const glowOpacity = currentOpacity * 0.3;
          gradient.addColorStop(0, `rgba(${star.color.r}, ${star.color.g}, ${star.color.b}, ${glowOpacity})`);
          gradient.addColorStop(0.4, `rgba(${star.color.r}, ${star.color.g}, ${star.color.b}, ${glowOpacity * 0.5})`);
          gradient.addColorStop(1, `rgba(${star.color.r}, ${star.color.g}, ${star.color.b}, 0)`);
          
          ctx.beginPath();
          ctx.arc(star.x, star.y, glowRadius, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();
        }
        
        // Draw cross flares for bright stars
        if (star.type === 'bright' && star.flareIntensity) {
          const flareLength = star.size * 4 * twinkle;
          const flareOpacity = currentOpacity * star.flareIntensity * 0.6;
          
          ctx.strokeStyle = `rgba(${star.color.r}, ${star.color.g}, ${star.color.b}, ${flareOpacity})`;
          ctx.lineWidth = 0.5;
          ctx.lineCap = 'round';
          
          // Horizontal flare
          ctx.beginPath();
          ctx.moveTo(star.x - flareLength, star.y);
          ctx.lineTo(star.x + flareLength, star.y);
          ctx.stroke();
          
          // Vertical flare
          ctx.beginPath();
          ctx.moveTo(star.x, star.y - flareLength);
          ctx.lineTo(star.x, star.y + flareLength);
          ctx.stroke();
        }
        
        // Draw the main star
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${star.color.r}, ${star.color.g}, ${star.color.b}, ${currentOpacity})`;
        ctx.fill();
        
        // Add a bright center for bright stars
        if (star.type === 'bright') {
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size * 0.3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${currentOpacity * 0.9})`;
          ctx.fill();
        }
      });
    };

    const drawShootingStars = () => {
      shootingStars.forEach((star, index) => {
        const gradient = ctx.createLinearGradient(
          star.x, star.y,
          star.x - Math.cos(star.angle) * star.length,
          star.y - Math.sin(star.angle) * star.length
        );
        
        const headColor = `rgba(${star.color.r}, ${star.color.g}, ${star.color.b}, ${star.opacity})`;
        const tailColor = `rgba(${star.color.r}, ${star.color.g}, ${star.color.b}, 0)`;
        
        gradient.addColorStop(0, headColor);
        gradient.addColorStop(0.7, `rgba(${star.color.r}, ${star.color.g}, ${star.color.b}, ${star.opacity * star.trail * 0.4})`);
        gradient.addColorStop(1, tailColor);

        // Draw main trail
        ctx.strokeStyle = gradient;
        ctx.lineWidth = star.size;
        ctx.lineCap = 'round';

        ctx.beginPath();
        ctx.moveTo(star.x, star.y);
        ctx.lineTo(
          star.x - Math.cos(star.angle) * star.length,
          star.y - Math.sin(star.angle) * star.length
        );
        ctx.stroke();

        // Add a bright core
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity * 0.9})`;
        ctx.fill();

        // Update position
        star.x += Math.cos(star.angle) * star.speed;
        star.y += Math.sin(star.angle) * star.speed;
        star.life += 0.016;
        star.opacity = Math.max(0, 1 - star.life / 3);

        // Remove if off screen or faded
        if (star.x > canvas.width + 100 || star.y > canvas.height + 100 || star.opacity <= 0) {
          shootingStars.splice(index, 1);
        }
      });
    };

    const animate = () => {
      // Clear canvas with black background
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw stars
      drawStars();
      drawShootingStars();

      // Randomly add shooting stars
      if (Math.random() < 0.01 && shootingStars.length < 3) {
        shootingStars.push(createShootingStar());
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    // Initialize
    resizeCanvas();
    createStars(600); // Create 600 stars for rich galaxy effect
    animate();

    // Handle resize
    const handleResize = () => {
      resizeCanvas();
      createStars(600);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -2, // Behind the WebGL background
        pointerEvents: 'none'
      }}
    />
  );
};

export default GalaxyBackground;
