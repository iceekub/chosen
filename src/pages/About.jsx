import React, { useEffect, useRef } from "react";
import {
  CheckCircle2,
  Bell,
  Search,
  Heart,
  Sparkles,
  ArrowRight,
  ChevronDown,
} from "lucide-react";
import { Link } from "react-router-dom";
import Logo from "../components/Logo";

const About = () => {
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
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      baseRadius: Math.random() * 200 + 300,
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
        blob.radius = blob.baseRadius + Math.sin(blob.angle) * 30;
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
        <div className="flex items-center gap-8 md:gap-12 text-[#B4926C]/80">
          <Link
            to="/about"
            className="text-white transition-colors text-sm font-sans tracking-widest uppercase"
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

      <main className="relative z-10 flex-1 max-w-6xl mx-auto px-6 pt-48 pb-32 space-y-40">
        {/* Section 1: The Why / Hero */}
        <section className="space-y-12 max-w-4xl mr-auto text-left">
          <h1 className="font-serif text-4xl md:text-6xl text-white leading-tight">
            Sunday <span className="italic text-[#FEECD3]">ignites.</span>{" "}
            <br />
            But by Wednesday, the flame flickers.
          </h1>
          <div className="space-y-8 text-lg md:text-xl text-brand-sage/60 font-light leading-relaxed">
            <p>
              That’s what we kept noticing - by mid week, the sermon that moved
              us on Sunday morning is competing with deadlines, arguments,
              fatigue, traffic, and a thousand other small things. The
              connection doesn’t fade because people stop caring. It fades
              because it needs support to uplift it.
            </p>
          </div>

          <div className="h-[1px] w-24 bg-[#B4926C]/40"></div>

          <div className="flex flex-col md:flex-row gap-16 lg:gap-24 md:items-center">
            {/* Team Circles - on the left */}
            <div className="flex gap-6 shrink-0">
              {["Alex", "Scott", "Dan"].map((name) => (
                <div
                  key={name}
                  className="flex flex-col items-center gap-3 text-[#B4926C]"
                >
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border border-[#B4926C]/30 glass flex items-center justify-center text-[#FEECD3]/20 text-[10px] uppercase tracking-tighter">
                    Photo
                  </div>
                  <span className="text-[10px] uppercase tracking-widest font-bold">
                    {name}
                  </span>
                </div>
              ))}
            </div>

            {/* Second Paragraph - on the right */}
            <p className="text-lg md:text-xl text-brand-sage/60 font-light leading-relaxed flex-1">
              The three of us built Chosen because we kept saying the same thing
              to each other: how nice would it be to have a companion gently
              reminding us to pause, take a breath, and come back to the message
              - every day of the week.
            </p>
          </div>
        </section>

        {/* Section 2: Split shepherding section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center text-left">
          <div className="relative aspect-square w-full rounded-[2.5rem] glass border border-[#B4926C]/10 flex items-center justify-center overflow-hidden order-2 lg:order-1 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-[#B4926C]/10 to-transparent"></div>
            <span className="text-[#FEECD3]/20 uppercase tracking-[0.3em] text-xs font-bold text-center px-8 text-center">
              Image Placeholder
            </span>
            <div className="absolute -z-10 -bottom-6 -left-6 w-full h-full rounded-[2.5rem] border border-[#B4926C]/5"></div>
          </div>

          <div className="space-y-8 order-1 lg:order-2">
            <p className="text-xl md:text-2xl text-[#FEECD3]/90 font-light leading-relaxed">
              Your congregation leaves Sunday transformed. By Wednesday, they
              remember the feeling but have lost the context.
            </p>
            <div className="space-y-6 text-brand-sage/60 font-light leading-relaxed text-lg">
              <p>
                They want your lens - the way you explained that passage, the
                story that made it click - not a generic devotional that
                could've come from anywhere.
              </p>
              <p>
                You can't meet with everyone, but everyone needs shepherding.
                Chosen is a companion app that carries your unique theological
                voice into their daily life, turning each Sunday sermon into a
                week of personalized content grounded entirely in your teaching.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: 3 Column Pods */}
        <section className="space-y-20 text-center">
          <h2 className="font-serif text-4xl md:text-6xl text-white whitespace-normal lg:whitespace-nowrap">
            Can this work for my congregation?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {[
              {
                title: "Chosen goes where Bible apps can't.",
                desc: "YouVersion doesn't know what you preached on Sunday - we do. Your congregation craves your voice and your lens on Scripture.",
              },
              {
                title: "We do the work, you stay in control",
                desc: "Your voice guides everything. Write, edit, or just let it run - we do the heavy lifting, you make sure it sounds like you.",
              },
              {
                title: "Already have an app? Good.",
                desc: "Chosen isn’t here to replace it - your app runs events & community, we carry your teaching into a daily companion. They live side by side.",
              },
            ].map((pod, i) => (
              <div
                key={i}
                className="p-10 rounded-[2rem] glass border border-white/5 space-y-6 flex flex-col group hover:border-[#B4926C]/30 transition-all duration-500 text-center"
              >
                <div className="min-h-[4rem] flex items-center justify-center">
                  <h3 className="font-serif text-2xl text-[#FEECD3] leading-tight">
                    {pod.title}
                  </h3>
                </div>
                <p className="text-brand-sage/60 font-light leading-relaxed text-[15px]">
                  {pod.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 4: What's Included */}
        <section className="space-y-16">
          <div className="text-center">
            <h2 className="font-serif text-4xl md:text-5xl text-white">
              What's included
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-left">
            <div className="p-10 rounded-[2.5rem] glass space-y-8 border border-[#B4926C]/10 shadow-2xl">
              <h4 className="text-xs uppercase tracking-widest text-[#B4926C] font-bold">
                For the Congregation
              </h4>
              <ul className="space-y-6">
                {[
                  "Daily devotions rooted in this week’s sermon, surfaced by a simple push notification",
                  "Deeper study: replay full services or search and share clips on any topic",
                  "In-app direct giving",
                  "Optional AI assistant that answers questions through your lens",
                ].map((feat, i) => (
                  <li key={i} className="flex gap-4 items-start">
                    <CheckCircle2 className="w-5 h-5 text-[#B4926C]/40 shrink-0 mt-1" />
                    <span className="text-brand-sage/80 font-medium">
                      {feat}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-10 rounded-[2.5rem] glass space-y-8 border border-[#B4926C]/10 shadow-2xl">
              <h4 className="text-xs uppercase tracking-widest text-[#B4926C] font-bold">
                For the Leadership
              </h4>
              <ul className="space-y-6">
                {[
                  "Hands on or off: zero extra time required from the pastor, or full editorial control if you want it",
                  "Completely personalized for your church",
                  "White glove onboarding from start to finish",
                  "Centralized dashboard with usage and engagement analytics",
                ].map((feat, i) => (
                  <li key={i} className="flex gap-4 items-start">
                    <CheckCircle2 className="w-5 h-5 text-[#B4926C]/40 shrink-0 mt-1" />
                    <span className="text-brand-sage/80 font-medium">
                      {feat}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Section 5: Closing CTA */}
        <section className="w-full text-center py-20 space-y-12">
          <h2 className="font-serif text-5xl md:text-7xl text-white leading-tight max-w-4xl mx-auto">
            Ready to see your voice in action?
          </h2>
          <div className="flex justify-center">
            <Link
              to="/inquire"
              className="group relative inline-flex items-center gap-4 px-12 py-5 rounded-full glass border border-[#B4926C]/20 hover:border-[#B4926C]/40 transition-all duration-500"
            >
              <span className="relative text-[#FEECD3] font-bold tracking-widest uppercase text-sm">
                Get Started
              </span>
              <ArrowRight className="w-5 h-5 text-[#B4926C] group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </section>
      </main>

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

export default About;
