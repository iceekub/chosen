import React, { useEffect, useRef } from 'react';
import { Sparkles, Sprout } from 'lucide-react';

/**
 * CHOSEN - Landing Page
 * * Features:
 * - HTML5 Canvas Interactive Gradient (The "Garden")
 * - Modern Serif/Sans typography mix
 * - Glassmorphism UI
 */

const App = () => {
  const canvasRef = useRef(null);
  
  // Use useRef for mouse position to avoid re-renders on every pixel move
  const mouse = useRef({ x: -1000, y: -1000 });

  // Canvas Animation Logic
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = window.innerWidth;
    let height = window.innerHeight;

    // Configuration for the "Garden" blobs
    // Darkened Palette: Shifted everything down a shade level for deeper mystery
    const colors = [
      '#022c22', // Was #064e3b (Emerald 900 -> 950)
      '#064e3b', // Was #065f46 (Emerald 800 -> 900)
      '#047857', // Was #10b981 (Emerald 500 -> 700)
      '#059669', // Was #34d399 (Emerald 400 -> 600)
      '#d97706'  // Was #facc15 (Yellow 400 -> Amber 600)
    ]; 
    
    // Create random floating blobs ONCE on mount
    const blobs = Array.from({ length: 6 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 1.5, // Increased velocity from 0.5 to 1.5 for visibility
      vy: (Math.random() - 0.5) * 1.5,
      baseRadius: Math.random() * 200 + 300, // Store base radius
      radius: 0, // Current radius will be calculated
      color: colors[Math.floor(Math.random() * colors.length)],
      angle: Math.random() * Math.PI * 2, // For orbital movement if desired, or breathing phase
      pulseSpeed: 0.02 + Math.random() * 0.03 // Random speed for breathing effect
    }));

    // Mouse "Light" Blob - Internal state for the animation loop
    const mouseBlob = {
      x: width / 2, // Start in center (or off screen)
      y: height / 2,
      radius: 400,
      color: '#d9f99d' 
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    const render = () => {
      // Clear with deeper void green (Darker than #022c22)
      ctx.fillStyle = '#011510'; 
      ctx.fillRect(0, 0, width, height);

      // Update and Draw Floating Blobs
      blobs.forEach(blob => {
        // Move
        blob.x += blob.vx;
        blob.y += blob.vy;
        
        // "Breathe" effect - oscillate radius
        blob.angle += blob.pulseSpeed;
        blob.radius = blob.baseRadius + Math.sin(blob.angle) * 30; // +/- 30px size shift

        // Bounce off walls smoothly
        if (blob.x < -blob.radius) blob.x = width + blob.radius;
        if (blob.x > width + blob.radius) blob.x = -blob.radius;
        if (blob.y < -blob.radius) blob.y = height + blob.radius;
        if (blob.y > height + blob.radius) blob.y = -blob.radius;

        // Draw
        const gradient = ctx.createRadialGradient(blob.x, blob.y, 0, blob.x, blob.y, blob.radius);
        gradient.addColorStop(0, blob.color);
        gradient.addColorStop(1, 'rgba(1, 21, 16, 0)'); // Fade to new dark bg

        ctx.beginPath();
        ctx.fillStyle = gradient;
        ctx.arc(blob.x, blob.y, blob.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw Mouse Blob (Interactive Element)
      // Lerp mouse blob towards actual mouse position for smooth lag
      // Lowered factor from 0.08 to 0.03 for a more "serene", less twitchy feel
      if (mouse.current.x !== -1000) {
        mouseBlob.x += (mouse.current.x - mouseBlob.x) * 0.03;
        mouseBlob.y += (mouse.current.y - mouseBlob.y) * 0.03;
      }

      const mouseGradient = ctx.createRadialGradient(mouseBlob.x, mouseBlob.y, 0, mouseBlob.x, mouseBlob.y, mouseBlob.radius);
      // Slightly reduced opacity from 0.3 to 0.25 to match darker theme
      mouseGradient.addColorStop(0, 'rgba(190, 242, 100, 0.25)'); 
      mouseGradient.addColorStop(1, 'rgba(0,0,0,0)');

      ctx.globalCompositeOperation = 'screen'; // Blend mode for "Light" effect
      ctx.beginPath();
      ctx.fillStyle = mouseGradient;
      ctx.arc(mouseBlob.x, mouseBlob.y, mouseBlob.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalCompositeOperation = 'source-over'; // Reset

      animationFrameId = requestAnimationFrame(render);
    };

    window.addEventListener('resize', resize);
    resize();
    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []); // Empty dependency array ensures this runs once, not on every mouse move

  // Track mouse coordinates efficiently without re-renders
  const handleMouseMove = (e) => {
    mouse.current = { x: e.clientX, y: e.clientY };
  };

  return (
    <div 
      className="relative w-full h-[100svh] overflow-hidden bg-slate-950 font-sans text-white"
      onMouseMove={handleMouseMove}
    >
      {/* 1. Global Styles for Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Inter:wght@300;400;500&display=swap');
        
        .font-serif { font-family: 'Playfair Display', serif; }
        .font-sans { font-family: 'Inter', sans-serif; }
      `}</style>

      {/* 2. Background: Interactive Canvas + Blur Layer */}
      <div className="absolute inset-0 z-0">
        {/* The Canvas renders the sharp shapes */}
        <canvas ref={canvasRef} className="block w-full h-full" />
        
        {/* The Backdrop Filter creates the "Gradient" effect by blurring the canvas output heavily */}
        <div className="absolute inset-0 backdrop-blur-[100px] pointer-events-none"></div>
        
        {/* Noise overlay for texture (Film grain effect) */}
        <div className="absolute inset-0 opacity-[0.07] pointer-events-none" 
             style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
        </div>
      </div>

      {/* 3. Navigation / Header */}
      <nav className="absolute top-0 left-0 right-0 z-20 flex justify-between items-center p-6 md:p-10">
        <div className="flex items-center gap-2">
          {/* Replaced Logo with SVG - Reduced size from h-8 to h-6 */}
          <svg viewBox="0 0 193 35" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-6 w-auto text-emerald-100/90">
            <path d="M191.78 35L169.98 12.15V34.5H164.98V0H165.38L187.18 22.85V0.500002H192.18V35H191.78Z" fill="currentColor"/>
            <path d="M136.367 34.5V0.5H158.017V5.25H141.717V19.35H156.167V24H141.717V29.75H158.717V34.5H136.367Z" fill="currentColor"/>
            <path d="M107.204 27.8L111.704 25.55C113.254 28.55 115.904 30.15 119.404 30.15C123.004 30.15 125.404 28.45 125.404 25.7C125.404 22.5 123.004 21.4 120.004 20.05L117.654 19C112.654 16.8 109.254 14.2 109.254 8.90005C109.254 3.70005 113.104 0.0500488 118.704 0.0500488C123.054 0.0500488 126.254 1.80005 128.404 5.40005L124.354 8.05005C123.054 5.85005 121.354 4.75005 118.804 4.75005C116.054 4.75005 114.454 6.35005 114.454 8.70005C114.454 11.4 116.104 12.45 119.804 14.1L122.154 15.15C127.304 17.45 130.704 19.8 130.704 25.55C130.704 31.8 125.904 34.95 119.454 34.95C113.704 34.95 109.504 32.15 107.204 27.8Z" fill="currentColor"/>
            <path d="M87.4719 34.95C77.7219 34.95 69.9219 27.55 69.9219 17.5C69.9219 7.45005 77.7219 0.0500488 87.4719 0.0500488C97.2219 0.0500488 105.022 7.45005 105.022 17.5C105.022 27.55 97.2219 34.95 87.4719 34.95ZM87.4719 30.1C94.5219 30.1 99.4719 24.7 99.4719 17.5C99.4719 10.3 94.5219 4.90005 87.4719 4.90005C80.4219 4.90005 75.4719 10.3 75.4719 17.5C75.4719 24.7 80.4219 30.1 87.4719 30.1Z" fill="currentColor"/>
            <path d="M58.798 19.35V0.5H64.148V34.5H58.798V24.1H42.498V34.5H37.148V0.5H42.498V19.35H58.798Z" fill="currentColor"/>
            <path d="M17.2 34.95C7.5 34.95 0 27.55 0 17.5C0 7.45005 7.65 0.0500488 17.35 0.0500488C23.65 0.0500488 28 2.50005 30.95 6.65005L26.85 9.55005C24.6 6.50005 21.7 4.90005 17.2 4.90005C10.45 4.90005 5.55 10.3 5.55 17.5C5.55 24.85 10.55 30.1 17.4 30.1C21.8 30.1 25.05 28.45 27.6 25.15L31.75 28C28.25 32.65 23.8 34.95 17.2 34.95Z" fill="currentColor"/>
          </svg>
        </div>
        {/* Navigation removed */}
      </nav>

      {/* 4. Main Content Hero */}
      <main className="relative z-10 flex flex-col justify-center items-center h-full px-4 text-center">
        
        {/* Pill Label */}
        <div className="mb-6 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/30 border border-emerald-500/20 backdrop-blur-md text-emerald-200/80 text-xs tracking-wide uppercase">
          <Sparkles className="w-3 h-3" />
          <span>Coming Spring 2026</span>
        </div>

        {/* Headline */}
        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl leading-tight md:leading-[1.1] text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-emerald-200/50 mb-6 drop-shadow-sm">
          Bring them back <br />
          <span className="italic text-emerald-100">to Sunday.</span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-xl mx-auto text-lg md:text-xl text-emerald-100/60 font-light mb-10 leading-relaxed">
          A sanctuary for modern devotion. Keep your congregation connected to your teachings and Scripture all week long.
        </p>

        {/* Action Button */}
        <div className="w-full max-w-md flex justify-center">
          <a 
            href="mailto:hello@chosenapp.com"
            className="group relative px-10 py-4 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 backdrop-blur-md text-emerald-100/90 hover:text-white font-light text-lg transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.1)]"
          >
            <span>Get in touch</span>
          </a>
        </div>
      </main>

      {/* 5. Footer Accents */}
      {/* Changed justify-between to justify-end to keep Copyright on the right after removing the left element */}
      <div className="absolute bottom-10 left-0 right-0 z-20 px-10 flex justify-end items-end text-xs text-emerald-200/20 uppercase tracking-widest font-mono">
        <div>
          Copyright © 2026 Chosen Technologies
        </div>
      </div>
    </div>
  );
};

export default App;