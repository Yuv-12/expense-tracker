import { useState, useEffect, useRef } from "react";
import { SignIn } from "@clerk/clerk-react";
import {
  TrendingUp, Shield, BarChart3, Wallet,
  ArrowRight, ChevronDown, PiggyBank, Zap,
} from "lucide-react";
import { ThemeToggle } from "../components/ThemeToggle";
import { useTheme } from "../context/ThemeContext";

function useCounter(target: number, duration = 1800, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(ease * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return count;
}

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return { ref, inView };
}

const features = [
  { icon: Wallet,   color: "from-indigo-500 to-indigo-700", title: "Track Every Rupee", desc: "Log income and expenses instantly. Know exactly where your money goes — always." },
  { icon: BarChart3, color: "from-purple-500 to-purple-700", title: "Visual Reports",    desc: "Beautiful charts break down your spending by category and month at a glance." },
  { icon: Shield,   color: "from-green-500 to-green-700",   title: "Secure & Private",  desc: "Your data belongs to you. Protected by Clerk authentication and MongoDB." },
  { icon: Zap,      color: "from-yellow-500 to-orange-500", title: "Real-time Updates", desc: "Add a transaction and see your balance, charts, and savings update instantly." },
];

const stats = [
  { value: 10000, suffix: "+", label: "Transactions Tracked" },
  { value: 98,    suffix: "%", label: "Uptime Reliability" },
  { value: 500,   suffix: "+", label: "Active Users" },
];

export default function SignInPage() {
  const { theme } = useTheme();
  const dark = theme === "dark";

  const [showAuth, setShowAuth] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const authRef = useRef<HTMLDivElement>(null);
  const { ref: statsRef, inView: statsInView } = useInView();
  const { ref: featRef,  inView: featInView  } = useInView();
  const { ref: ctaRef,   inView: ctaInView   } = useInView();

  const c0 = useCounter(stats[0].value, 1800, statsInView);
  const c1 = useCounter(stats[1].value, 1400, statsInView);
  const c2 = useCounter(stats[2].value, 1600, statsInView);
  const counts = [c0, c1, c2];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToAuth = () => {
    setShowAuth(true);
    setTimeout(() => authRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 80);
  };

  // Theme-aware class helpers
  const bg       = dark ? "bg-gray-950"     : "bg-slate-50";
  const bgCard   = dark ? "bg-gray-900"     : "bg-white";
  const bgCard2  = dark ? "bg-gray-800"     : "bg-slate-100";
  const border   = dark ? "border-gray-800" : "border-slate-200";
  const border2  = dark ? "border-gray-700" : "border-slate-300";
  const textPri  = dark ? "text-white"      : "text-slate-900";
  const textSec  = dark ? "text-gray-400"   : "text-slate-500";
  const navBg    = dark
    ? "bg-gray-950/90 backdrop-blur border-b border-gray-800"
    : "bg-white/90 backdrop-blur border-b border-slate-200";

  // Clerk appearance — adapts to theme
  const clerkAppearance = {
    variables: {
      colorPrimary:        "#6366F1",
      colorBackground:     dark ? "#111827" : "#ffffff",
      colorInputBackground: dark ? "#1F2937" : "#f8fafc",
      colorText:           dark ? "#FFFFFF" : "#0f172a",
      colorNeutral:        dark ? "#9CA3AF" : "#64748b",
      borderRadius:        "0.75rem",
    },
    elements: {
      card:               dark ? "bg-gray-900 border border-gray-800 shadow-2xl" : "bg-white border border-slate-200 shadow-xl",
      headerTitle:        dark ? "text-white" : "text-slate-900",
      headerSubtitle:     dark ? "text-gray-400" : "text-slate-500",
      formFieldInput:     dark ? "bg-gray-800 border-gray-700 text-white placeholder:text-gray-500" : "bg-slate-50 border-slate-300 text-slate-900",
      formButtonPrimary:  "bg-indigo-600 hover:bg-indigo-500 text-white font-semibold",
      footerActionLink:   "text-indigo-400 hover:text-indigo-300",
      identityPreviewText: dark ? "text-white" : "text-slate-900",
      formFieldLabel:     dark ? "text-gray-300" : "text-slate-600",
      dividerLine:        dark ? "bg-gray-700" : "bg-slate-200",
      dividerText:        dark ? "text-gray-500" : "text-slate-400",
      socialButtonsBlockButton: dark ? "border-gray-700 text-white hover:bg-gray-800" : "border-slate-300 text-slate-700 hover:bg-slate-50",
      footer:             dark ? "bg-gray-900 border-t border-gray-800" : "bg-slate-50 border-t border-slate-200",
    },
  };

  return (
    <div className={`min-h-screen ${bg} ${textPri} overflow-x-hidden transition-colors duration-300`}>

      {/* NAVBAR */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? `${navBg} py-3` : "py-5"}`}>
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-sm">ET</span>
            </div>
            <span className={`font-bold text-lg tracking-tight ${textPri}`}>
              Expense<span className="text-indigo-400">Tracker</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={scrollToAuth}
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-indigo-900/40"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-16 text-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-indigo-600/20 rounded-full blur-[120px]" />
          <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-purple-600/15 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[250px] h-[250px] bg-green-500/10 rounded-full blur-[100px]" />
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(90deg, #6366f1 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        </div>

        <div className="relative inline-flex items-center gap-2 bg-indigo-950/60 border border-indigo-700/50 text-indigo-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-8 backdrop-blur-sm">
          <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
          Free · No credit card required
        </div>

        <h1 className="relative text-5xl md:text-7xl font-black tracking-tight mb-6 leading-tight">
          <span className={textPri}>Master Your</span>
          <br />
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Financial Life
          </span>
        </h1>

        <p className={`relative max-w-xl ${textSec} text-lg md:text-xl leading-relaxed mb-10`}>
          Track income and expenses, visualise your spending, and grow your savings — all in one beautiful dashboard.
        </p>

        <div className="relative flex flex-col sm:flex-row gap-4 mb-16">
          <button
            onClick={scrollToAuth}
            className="group flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 py-4 rounded-2xl transition-all shadow-xl shadow-indigo-900/50 text-lg"
          >
            Start Tracking Free
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={scrollToAuth}
            className={`flex items-center justify-center gap-2 border ${border2} hover:border-gray-500 ${textSec} hover:text-white font-semibold px-8 py-4 rounded-2xl transition-all text-lg`}
          >
            Sign In
          </button>
        </div>

        {/* Dashboard preview */}
        <div className="relative w-full max-w-3xl mx-auto">
          <div className={`${bgCard} border ${border} rounded-2xl p-5 shadow-2xl`}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-red-500/70" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <div className="w-3 h-3 rounded-full bg-green-500/70" />
              <div className={`ml-3 text-xs ${textSec}`}>expense-tracker · Dashboard</div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              {[
                { label: "Balance", val: "₹44,500", color: "bg-indigo-600", icon: "💳" },
                { label: "Income",  val: "₹55,000", color: "bg-green-600",  icon: "📈" },
                { label: "Expenses",val: "₹10,500", color: "bg-red-500",    icon: "📉" },
                { label: "Savings", val: "₹44,500", color: "bg-purple-600", icon: "🐷" },
              ].map((s) => (
                <div key={s.label} className={`${bgCard2} rounded-xl p-3 flex flex-col gap-1`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs ${textSec}`}>{s.label}</span>
                    <div className={`w-6 h-6 ${s.color} rounded-lg flex items-center justify-center text-xs`}>{s.icon}</div>
                  </div>
                  <span className={`text-sm font-bold ${textPri}`}>{s.val}</span>
                  <span className="text-xs text-green-400">↑ Positive</span>
                </div>
              ))}
            </div>
            <div className={`${bgCard2} rounded-xl p-4`}>
              <div className={`text-xs ${textSec} mb-3`}>Monthly Spending</div>
              <div className="flex items-end gap-2 h-16">
                {[40,65,30,80,55,90,45,70,35,85,60,75].map((h, i) => (
                  <div key={i} className={`flex-1 rounded-t-sm ${i % 2 === 0 ? "bg-indigo-500" : "bg-green-500"}`}
                    style={{ height: `${h}%`, opacity: 0.7 + i * 0.02 }} />
                ))}
              </div>
            </div>
          </div>
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-indigo-600/30 blur-2xl rounded-full" />
        </div>

        <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 ${textSec} animate-bounce`}>
          <span className="text-xs">scroll</span>
          <ChevronDown size={16} />
        </div>
      </section>

      {/* STATS */}
      <section ref={statsRef} className={`py-20 px-6 border-y ${border} ${dark ? "bg-gray-900/40" : "bg-slate-100/60"}`}>
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-10 text-center">
          {stats.map((s, i) => (
            <div key={s.label} className={`transition-all duration-700 ${statsInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`} style={{ transitionDelay: `${i * 150}ms` }}>
              <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                {counts[i].toLocaleString("en-IN")}{s.suffix}
              </div>
              <div className={`${textSec} mt-2 text-sm font-medium`}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section ref={featRef} className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className={`text-center mb-16 transition-all duration-700 ${featInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <h2 className={`text-4xl md:text-5xl font-black ${textPri} mb-4`}>Everything you need</h2>
            <p className={`${textSec} text-lg max-w-xl mx-auto`}>A complete personal finance toolkit built for simplicity and clarity.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={f.title}
                  className={`group ${bgCard} border ${border} rounded-2xl p-6 hover:border-indigo-500/50 transition-all duration-500 hover:-translate-y-1 ${featInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
                  style={{ transitionDelay: `${i * 100 + 200}ms` }}
                >
                  <div className={`w-12 h-12 bg-gradient-to-br ${f.color} rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
                    <Icon size={22} className="text-white" />
                  </div>
                  <h3 className={`font-bold ${textPri} text-lg mb-2`}>{f.title}</h3>
                  <p className={`${textSec} text-sm leading-relaxed`}>{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className={`py-24 px-6 ${dark ? "bg-gray-900/40" : "bg-slate-100/60"} border-y ${border}`}>
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className={`text-4xl md:text-5xl font-black ${textPri} mb-4`}>Up and running in seconds</h2>
          <p className={`${textSec} text-lg`}>Three steps to financial clarity.</p>
        </div>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { step: "01", icon: "🔐", title: "Sign Up",           desc: "Create your free account with Google or email in seconds." },
            { step: "02", icon: "➕", title: "Add Transactions",   desc: "Log your income and expenses with category, date, and description." },
            { step: "03", icon: "📊", title: "See the Picture",    desc: "Watch your dashboard update instantly with charts and savings insights." },
          ].map((s, i) => (
            <div key={s.step} className="relative text-center group">
              {i < 2 && <div className="hidden md:block absolute top-8 left-[60%] w-full h-px bg-gradient-to-r from-indigo-600/50 to-transparent" />}
              <div className={`w-16 h-16 ${dark ? "bg-indigo-950" : "bg-indigo-50"} border-2 border-indigo-700 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4 group-hover:border-indigo-500 transition-colors`}>
                {s.icon}
              </div>
              <div className="text-xs font-bold text-indigo-500 mb-2 tracking-widest">STEP {s.step}</div>
              <h3 className={`text-xl font-bold ${textPri} mb-2`}>{s.title}</h3>
              <p className={`${textSec} text-sm leading-relaxed`}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA + SIGN IN */}
      <section ref={ctaRef} className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-indigo-600/15 rounded-full blur-[100px]" />
        </div>
        <div className="relative max-w-xl mx-auto text-center mb-10">
          <PiggyBank size={48} className={`mx-auto mb-6 text-indigo-400 transition-all duration-700 ${ctaInView ? "opacity-100 scale-100" : "opacity-0 scale-75"}`} />
          <h2 className={`text-4xl md:text-5xl font-black ${textPri} mb-4 transition-all duration-700 delay-100 ${ctaInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            Ready to take control?
          </h2>
          <p className={`${textSec} text-lg mb-8 transition-all duration-700 delay-200 ${ctaInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            Join thousands tracking their finances with ExpenseTracker.
          </p>
          {!showAuth && (
            <button onClick={() => setShowAuth(true)} className="group inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 py-4 rounded-2xl transition-all shadow-xl shadow-indigo-900/50 text-lg">
              Get Started — It's Free
              <TrendingUp size={20} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          )}
        </div>
        {showAuth && (
          <div ref={authRef} className={`flex justify-center transition-all duration-500 ${showAuth ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <SignIn appearance={clerkAppearance} />
          </div>
        )}
      </section>

      {/* FOOTER */}
      <footer className={`border-t ${border} py-8 px-6`}>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">ET</span>
            </div>
            <span className={`${textSec} text-sm`}>ExpenseTracker · Built with ❤️</span>
          </div>
          <p className={`${dark ? "text-gray-600" : "text-slate-400"} text-xs`}>© {new Date().getFullYear()} ExpenseTracker. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}