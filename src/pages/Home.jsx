import React, { useEffect, useRef, useState } from "react";
import { ChevronDown, Play, CheckCircle2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Logo from "../components/Logo";
import SignupForm from "../components/SignupForm";

const Home = () => {
  const canvasRef = useRef(null);
  const mouse = useRef({ x: -1000, y: -1000 });
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

    const blobs = Array.from({ length: 8 }).map(() => ({
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

    const mouseBlob = {
      x: width / 2,
      y: height / 2,
      radius: 500,
      color: "#FEECD3",
    };

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
      if (mouse.current.x !== -1000) {
        mouseBlob.x += (mouse.current.x - mouseBlob.x) * 0.02;
        mouseBlob.y += (mouse.current.y - mouseBlob.y) * 0.02;
      }
      const mouseGradient = ctx.createRadialGradient(
        mouseBlob.x,
        mouseBlob.y,
        0,
        mouseBlob.x,
        mouseBlob.y,
        mouseBlob.radius,
      );
      mouseGradient.addColorStop(0, "rgba(254, 236, 211, 0.12)");
      mouseGradient.addColorStop(1, "rgba(0,0,0,0)");
      ctx.globalCompositeOperation = "screen";
      ctx.beginPath();
      ctx.fillStyle = mouseGradient;
      ctx.arc(mouseBlob.x, mouseBlob.y, mouseBlob.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalCompositeOperation = "source-over";
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

  const handleMouseMove = (e) => {
    mouse.current = { x: e.clientX, y: e.clientY };
  };

  return (
    <div
      className="relative w-full min-h-screen bg-[#05241e] font-sans text-white overflow-x-hidden flex flex-col"
      onMouseMove={handleMouseMove}
    >
      <style>{`
        .font-serif { font-family: 'Playfair Display', serif; }
        .font-sans { font-family: 'Mulish', sans-serif; }
        .glass { background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.05); }
      `}</style>

      <div className="fixed inset-0 z-0 pointer-events-none">
        <canvas ref={canvasRef} className="block w-full h-full" />
        <div className="absolute inset-0 backdrop-blur-[120px]"></div>
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>

      <nav
        className={`fixed top-0 left-0 right-0 z-50 flex justify-between items-center transition-all duration-500 px-6 md:px-10 ${isScrolled ? "py-4 bg-white/5 backdrop-blur-xl shadow-2xl" : "py-6 md:py-10"}`}
      >
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
            className="text-[#FEECD3]/60 hover:text-white transition-colors text-sm font-sans tracking-widest uppercase"
          >
            Get Started
          </Link>
        </div>
      </nav>

      <header className="relative z-10 w-full min-h-screen px-6 lg:px-20 flex flex-col justify-between pt-32 pb-12">
        <div className="flex-1 w-full max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="flex justify-center lg:justify-start">
            <div className="space-y-8 max-w-xl text-center lg:text-left">
              {/* Reduced font size slightly to prevent cutoff at 1700px */}
              <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl xl:text-7xl leading-[1.1] text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-[#FEECD3]/50 mb-6">
                <span className="lg:whitespace-nowrap inline-block">
                  Bring them back
                </span>{" "}
                <br />
                <span className="italic text-[#FEECD3]">to Sunday.</span>
              </h1>
              <p className="text-lg md:text-xl xl:text-2xl text-brand-sage/60 font-light leading-relaxed max-w-md mx-auto lg:mx-0">
                A sanctuary for modern devotion. Keep your congregation
                connected to your teachings and Scripture all week long.
              </p>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <div className="relative aspect-[4/3] lg:aspect-square w-full max-w-md xl:max-w-lg">
              <div className="absolute inset-0 rounded-[2.5rem] glass overflow-hidden shadow-2xl border border-white/10 group">
                <div className="absolute inset-0 bg-gradient-to-br from-[#B4926C]/20 to-transparent"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 xl:w-20 xl:h-20 rounded-full bg-white/5 flex items-center justify-center backdrop-blur-md border border-white/10">
                    <Play className="w-6 h-6 xl:w-8 xl:h-8 fill-[#FEECD3] text-[#FEECD3] opacity-60" />
                  </div>
                </div>
                <div className="absolute bottom-6 left-6 right-6 xl:bottom-8 xl:left-8 xl:right-8 p-3 xl:p-4 glass rounded-xl text-[10px] xl:text-xs text-[#B4926C] italic font-sans tracking-wider uppercase">
                  App Preview: The sanctuary experience
                </div>
              </div>
              <div className="absolute -z-10 -top-4 -right-4 xl:-top-6 xl:-right-6 w-full h-full rounded-[2.5rem] border border-[#B4926C]/20"></div>
            </div>
          </div>
        </div>

        <button
          onClick={() =>
            document
              .getElementById("features")
              .scrollIntoView({ behavior: "smooth" })
          }
          className="flex flex-col items-center gap-4 text-[#FEECD3]/60 hover:text-white transition-all duration-500 animate-bounce group mx-auto"
        >
          <span className="text-xs uppercase tracking-[0.4em] font-bold">
            Enter
          </span>
          <ChevronDown className="w-6 h-6 stroke-[1.5px] group-hover:translate-y-1 transition-transform" />
        </button>
      </header>

      <section
        id="features"
        className="relative z-10 py-24 px-6 md:px-20 space-y-48"
      >
        <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
          <div className="flex-1 space-y-6">
            <h2 className="font-serif text-4xl md:text-5xl text-[#FEECD3]">
              Faith that grows daily.
            </h2>
            <p className="text-brand-sage/60 text-lg leading-relaxed font-light">
              Five minutes each day. A verse, a question, a moment to breathe.
              Chosen transforms each week’s message into daily practice –
              delivered fresh to your congregation every day of the week.
            </p>
            <ul className="space-y-4">
              {[
                "The sermon does the work. Step in to review and edit anytime, or let it run itself, hands-free.",
                "Congregants can donate directly to the church without ever leaving the app.",
              ].map((item, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 text-brand-sage/80 font-medium leading-relaxed"
                >
                  <CheckCircle2 className="w-5 h-5 text-[#B4926C]/40 mt-1 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex-1 w-full aspect-[9/16] max-w-[320px] md:max-w-none md:aspect-video rounded-3xl glass overflow-hidden relative group border border-[#B4926C]/10">
            <div className="absolute inset-0 bg-gradient-to-br from-[#B4926C]/10 to-transparent"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/20 group-hover:scale-110 transition-transform cursor-pointer">
                <Play className="w-6 h-6 fill-[#FEECD3]" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row-reverse items-center gap-12 lg:gap-20">
          <div className="flex-1 space-y-6">
            <h2 className="font-serif text-4xl md:text-5xl text-[#FEECD3]">
              Guidance for the moments life doesn’t schedule.
            </h2>
            <p className="text-brand-sage/60 text-lg leading-relaxed font-light">
              Navigating a new job. Grieving a loss. Struggling in a marriage.
              Chosen lets your community search your entire sermon library by
              what they're going through – and surface your message that speaks
              directly to it.
            </p>
            <div className="p-6 glass rounded-2xl border-[#B4926C]/20">
              <p className="text-brand-sage/80 italic font-serif">
                "Chosen has transformed how our small groups interact. We're no
                longer just a Sunday church."
              </p>
              <p className="mt-4 text-xs text-[#FEECD3]/60 font-medium">
                — Pastor Mark, Grace Community
              </p>
            </div>
          </div>
          <div className="flex-1 w-full aspect-[9/16] max-w-[320px] md:max-w-none md:aspect-video rounded-3xl glass overflow-hidden relative border border-[#B4926C]/10">
            <div className="absolute inset-0 bg-gradient-to-bl from-[#B4926C]/10 to-transparent"></div>
          </div>
        </div>
      </section>

      <section className="relative z-10 py-32 px-6 flex flex-col items-center text-center">
        <div className="max-w-4xl w-full p-8 md:p-16 rounded-[2.5rem] glass border-[#B4926C]/20 relative overflow-hidden text-center shadow-2xl">
          <h2 className="font-serif text-4xl md:text-6xl text-white mb-6">
            Ready to watch your <br />
            message come alive?
          </h2>
          <p className="text-brand-sage/60 mb-10 max-w-lg mx-auto text-center font-light text-lg">
            Join the Chosen community of leaders ensuring their message stays at
            the center of their community’s rhythm, every day of the week.
          </p>
          <div className="flex justify-center">
            <Link
              to="/inquire"
              className="group relative inline-flex items-center gap-4 px-10 py-4 rounded-full glass border border-[#B4926C]/20 hover:border-[#B4926C]/40 transition-all duration-500"
            >
              <span className="relative text-[#FEECD3] font-bold tracking-widest uppercase text-xs">
                Get Started
              </span>
              <ArrowRight className="w-4 h-4 text-[#B4926C] group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      <footer className="relative z-10 py-20 px-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
        <Logo className="h-4 md:h-5 opacity-40 grayscale hover:grayscale-0 transition-all duration-500" />
        <div className="text-[10px] text-[#B4926C]/40 uppercase tracking-widest font-mono">
          Copyright © 2026 Chosen Technologies
        </div>
        <div className="flex gap-6 text-xs font-sans uppercase tracking-widest">
          <Link
            to="/privacy"
            className="hover:text-white transition-colors text-brand-sage/40"
          >
            Privacy
          </Link>
          <Link
            to="/terms"
            className="hover:text-white transition-colors text-brand-sage/40"
          >
            Terms
          </Link>
          <Link
            to="/inquire"
            className="hover:text-white transition-colors text-brand-sage/40"
          >
            Contact
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default Home;
