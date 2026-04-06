import { useState, useEffect, useRef } from "react";
import { SignUp } from "@clerk/clerk-react";
import { TrendingUp, BarChart3, Wallet, ArrowRight, ChevronDown, PiggyBank, Zap, Shield } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { ThemeToggle } from "../components/ThemeToggle";

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return { ref, inView };
}

const features = [
  { icon: Wallet,    color: "from-indigo-500 to-indigo-700", title: "Track Every Rupee", desc: "Log income and expenses instantly. Know exactly where your money goes — always." },
  { icon: BarChart3, color: "from-purple-500 to-purple-700", title: "Visual Reports",    desc: "Beautiful charts break down your spending by category and month at a glance." },
  { icon: Shield,    color: "from-green-500 to-green-700",   title: "Secure & Private",  desc: "Your data belongs to you. Protected by Clerk authentication and MongoDB." },
  { icon: Zap,       color: "from-yellow-500 to-orange-500", title: "Real-time Updates", desc: "Add a transaction and see your balance, charts, and savings update instantly." },
];

export default function SignUpPage() {
  const { theme } = useTheme();
  const dark = theme === "dark";

  const [showAuth, setShowAuth] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const authRef = useRef<HTMLDivElement>(null);
  const { ref: featRef, inView: featInView } = useInView();
  const { ref: ctaRef,  inView: ctaInView  } = useInView();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToAuth = () => {
    setShowAuth(true);
    setTimeout(() => authRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 80);
  };

  const bg      = dark ? "bg-gray-950"   : "bg-slate-50";
  const bgCard  = dark ? "bg-gray-900"   : "bg-white";
  const border  = dark ? "border-gray-800" : "border-slate-200";
  const border2 = dark ? "border-gray-700" : "border-slate-300";
  const textPri = dark ? "text-white"    : "text-slate-900";
  const textSec = dark ? "text-gray-400" : "text-slate-500";
  const navBg   = dark
    ? "bg-gray-950/90 backdrop-blur border-b border-gray-800"
    : "bg-white/90 backdrop-blur border-b border-slate-200";

  const clerkAppearance = {
    variables: {
      colorPrimary:         "#6366F1",
      colorBackground:      dark ? "#111827" : "#ffffff",
      colorInputBackground: dark ? "#1F2937" : "#f8fafc",
      colorText:            dark ? "#FFFFFF" : "#0f172a",
      colorNeutral:         dark ? "#9CA3AF" : "#64748b",
      borderRadius:         "0.75rem",
    },
    elements: {
      card:                dark ? "bg-gray-900 border border-gray-800 shadow-2xl" : "bg-white border border-slate-200 shadow-xl",
      headerTitle:         dark ? "text-white" : "text-slate-900",
      headerSubtitle:      dark ? "text-gray-400" : "text-slate-500",
      formFieldInput:      dark ? "bg-gray-800 border-gray-700 text-white placeholder:text-gray-500" : "bg-slate-50 border-slate-300 text-slate-900",
      formButtonPrimary:   "bg-indigo-600 hover:bg-indigo-500 text-white font-semibold",
      footerActionLink:    "text-indigo-400 hover:text-indigo-300",
      formFieldLabel:      dark ? "text-gray-300" : "text-slate-600",
      dividerLine:         dark ? "bg-gray-700" : "bg-slate-200",
      dividerText:         dark ? "text-gray-500" : "text-slate-400",
      socialButtonsBlockButton: dark ? "border-gray-700 text-white hover:bg-gray-800" : "border-slate-300 text-slate-700 hover:bg-slate-50",
      footer:              dark ? "bg-gray-900 border-t border-gray-800" : "bg-slate-50 border-t border-slate-200",
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
            <a href="/sign-in" className={`text-sm ${textSec} hover:text-indigo-400 transition font-medium`}>Sign In</a>
            <button onClick={scrollToAuth} className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-indigo-900/40">
              Create Account
            </button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-16 text-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-purple-600/20 rounded-full blur-[120px]" />
          <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] bg-indigo-600/15 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 left-1/4 w-[250px] h-[250px] bg-green-500/10 rounded-full blur-[100px]" />
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(90deg, #6366f1 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        </div>

        <div className="relative inline-flex items-center gap-2 bg-green-950/60 border border-green-700/50 text-green-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-8 backdrop-blur-sm">
          <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
          Free forever · No credit card required
        </div>

        <h1 className="relative text-5xl md:text-7xl font-black tracking-tight mb-6 leading-tight">
          <span className={textPri}>Start Your</span>
          <br />
          <span className="bg-gradient-to-r from-green-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Financial Journey
          </span>
        </h1>

        <p className={`relative max-w-xl ${textSec} text-lg md:text-xl leading-relaxed mb-10`}>
          Create your free account and take control of your money in minutes. Track, analyse, and grow your savings starting today.
        </p>

        <div className="relative flex flex-col sm:flex-row gap-4 mb-16">
          <button onClick={scrollToAuth} className="group flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 py-4 rounded-2xl transition-all shadow-xl shadow-indigo-900/50 text-lg">
            Create Free Account
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <a href="/sign-in" className={`flex items-center justify-center gap-2 border ${border2} hover:border-gray-500 ${textSec} hover:text-white font-semibold px-8 py-4 rounded-2xl transition-all text-lg`}>
            Already have an account?
          </a>
        </div>

        <div className="relative flex flex-wrap justify-center gap-3 mb-12">
          {["✅ Free forever", "🔐 Secure login", "📊 Beautiful charts", "⚡ Instant setup"].map((pill) => (
            <span key={pill} className={`${dark ? "bg-gray-800/60 border-gray-700 text-gray-300" : "bg-slate-100 border-slate-300 text-slate-600"} border text-sm px-4 py-1.5 rounded-full backdrop-blur-sm`}>
              {pill}
            </span>
          ))}
        </div>

        <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 ${textSec} animate-bounce`}>
          <span className="text-xs">scroll</span>
          <ChevronDown size={16} />
        </div>
      </section>

      {/* FEATURES */}
      <section ref={featRef} className={`py-24 px-6 border-t ${border} ${dark ? "bg-gray-900/40" : "bg-slate-100/60"}`}>
        <div className="max-w-6xl mx-auto">
          <div className={`text-center mb-16 transition-all duration-700 ${featInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <h2 className={`text-4xl md:text-5xl font-black ${textPri} mb-4`}>Why ExpenseTracker?</h2>
            <p className={`${textSec} text-lg max-w-xl mx-auto`}>Everything you need to understand and control your finances.</p>
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

      {/* CTA + SIGN UP */}
      <section ref={ctaRef} className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-purple-600/15 rounded-full blur-[100px]" />
        </div>
        <div className="relative max-w-xl mx-auto text-center mb-10">
          <PiggyBank size={48} className={`mx-auto mb-6 text-green-400 transition-all duration-700 ${ctaInView ? "opacity-100 scale-100" : "opacity-0 scale-75"}`} />
          <h2 className={`text-4xl md:text-5xl font-black ${textPri} mb-4 transition-all duration-700 delay-100 ${ctaInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            Join for free today
          </h2>
          <p className={`${textSec} text-lg mb-8 transition-all duration-700 delay-200 ${ctaInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            Set up your account in under a minute. No credit card needed.
          </p>
          {!showAuth && (
            <button onClick={() => setShowAuth(true)} className="group inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 py-4 rounded-2xl transition-all shadow-xl shadow-indigo-900/50 text-lg">
              Create My Account
              <TrendingUp size={20} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          )}
        </div>
        {showAuth && (
          <div ref={authRef} className="flex justify-center transition-all duration-500 opacity-100 translate-y-0">
            <SignUp appearance={clerkAppearance} />
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