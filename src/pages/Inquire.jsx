import React, { useEffect, useRef } from "react";
import Logo from "../components/Logo";
import SignupForm from "../components/SignupForm";
import { Link } from "react-router-dom";

const Inquire = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let width = window.innerWidth;
    let height = window.innerHeight;

    const colors = [
      "#084236",
      "#4F7147",
      "#78966E",
      "#B5D2AD",
      "#B4926C",
      "#FEECD3",
    ];

    const blobs = Array.from({ length: 6 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      baseRadius: Math.random() * 300 + 400,
      radius: 0,
      color: colors[Math.floor(Math.random() * colors.length)],
      angle: Math.random() * Math.PI * 2,
      pulseSpeed: 0.005 + Math.random() * 0.01,
    }));

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    const render = () => {
      ctx.fillStyle = "#062d25";
      ctx.fillRect(0, 0, width, height);
      blobs.forEach((blob) => {
        blob.x += blob.vx;
        blob.y += blob.vy;
        blob.angle += blob.pulseSpeed;
        blob.radius = blob.baseRadius + Math.sin(blob.angle) * 50;
        if (blob.x < -blob.radius) blob.x = width + blob.radius;
        if (blob.x > width + blob.radius) blob.x = -blob.radius;
        if (blob.y < -blob.radius) blob.y = height + blob.radius;
        if (blob.y > height + blob.radius) blob.y = -blob.radius;
        const gradient = ctx.createRadialGradient(
          blob.x,
          blob.y,
          0,
          blob.x,
          blob.y,
          blob.radius,
        );
        gradient.addColorStop(0, blob.color);
        gradient.addColorStop(1, "rgba(6, 45, 37, 0)");
        ctx.beginPath();
        ctx.fillStyle = gradient;
        ctx.arc(blob.x, blob.y, blob.radius, 0, Math.PI * 2);
        ctx.fill();
      });
      animationFrameId = requestAnimationFrame(render);
    };

    window.addEventListener("resize", resize);
    resize();
    render();
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-[#05241e] font-sans text-white overflow-x-hidden flex flex-col">
      <style>{`
        .font-serif { font-family: 'Playfair Display', serif; }
        .font-sans { font-family: 'Mulish', sans-serif; }
        .glass { background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.05); }
      `}</style>

      <div className="fixed inset-0 z-0 pointer-events-none">
        <canvas ref={canvasRef} className="block w-full h-full" />
        <div className="absolute inset-0 backdrop-blur-[120px]"></div>
      </div>

      <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center p-6 md:p-10 transition-all duration-500">
        <Logo className="h-6 md:h-8" />
        <div className="flex items-center gap-8 md:gap-12">
          <Link
            to="/about"
            className="text-[#FEECD3]/60 hover:text-white transition-colors text-sm font-sans tracking-widest uppercase"
          >
            About
          </Link>
          <Link
            to="/inquire"
            className="text-white transition-colors text-sm font-sans tracking-widest uppercase"
          >
            Get Started
          </Link>
        </div>
      </nav>

      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-32 text-center max-w-5xl mx-auto space-y-20">
        <div className="space-y-6">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-[#FEECD3]/50">
            Turn weekly services into <br />
            <span className="italic text-[#FEECD3] block mt-2">
              daily discipleship.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-brand-sage/60 font-light tracking-wide">
            Join our community of leaders.
          </p>
        </div>

        <div className="w-full max-w-3xl">
          <SignupForm full={true} />
        </div>
      </main>

      <footer className="relative z-10 py-10 px-10 text-center text-[10px] text-[#B4926C]/40 uppercase tracking-widest font-mono">
        Chosen Technologies © 2026
      </footer>
    </div>
  );
};

export default Inquire;
