import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useAuth } from "@/lib/auth";
import { Mail, Lock, User, AlertCircle, CheckCircle2, ArrowRight, Loader2 } from "lucide-react";
import mascot from "@/assets/mascot.png";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: "signin" | "signup";
}

export function AuthModal({ isOpen, onClose, defaultTab = "signin" }: AuthModalProps) {
  const [tab, setTab] = useState<"signin" | "signup">(defaultTab);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const { signIn, signUp, isConfigured } = useAuth();

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setFullName("");
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(false);
  };

  const handleTabSwitch = (newTab: "signin" | "signup") => {
    setTab(newTab);
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email || !password) {
      setErrorMsg("Please fill in all required fields.");
      return;
    }

    if (tab === "signup") {
      if (password.length < 6) {
        setErrorMsg("Password must be at least 6 characters.");
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg("Passwords do not match.");
        return;
      }
    }

    setLoading(true);

    try {
      if (tab === "signin") {
        const { error } = await signIn(email, password);
        if (error) {
          setErrorMsg(error.message);
        } else {
          setSuccessMsg("Welcome back! Signed in successfully.");
          setTimeout(() => {
            handleClose();
          }, 800);
        }
      } else {
        const { error, needsEmailVerification } = await signUp(email, password, fullName);
        if (error) {
          setErrorMsg(error.message);
        } else {
          if (needsEmailVerification) {
            setSuccessMsg("Account created! Please check your email to confirm your account.");
          } else {
            setSuccessMsg("Account created and signed in successfully!");
            setTimeout(() => {
              handleClose();
            }, 800);
          }
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-md border-border bg-card/95 backdrop-blur-2xl p-6 sm:p-8 rounded-3xl shadow-2xl">
        {/* Brand Mascot / Logo Header */}
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-splash-purple via-splash-pink to-splash-orange p-[1.5px] shadow-lg shadow-splash-pink/20 mb-3">
            <div className="w-full h-full bg-card rounded-[14px] flex items-center justify-center overflow-hidden">
              <img src={mascot} alt="Aiel Studio" className="w-9 h-9 object-contain" />
            </div>
          </div>

          <DialogHeader className="space-y-1">
            <DialogTitle className="font-display text-xl sm:text-2xl font-extrabold tracking-tight text-foreground">
              {tab === "signin" ? (
                <>
                  Sign in to <span className="text-gradient">AIEL STUDIO</span>
                </>
              ) : (
                <>
                  Create an <span className="text-gradient">Account</span>
                </>
              )}
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm text-muted-foreground">
              {tab === "signin"
                ? "Track custom print orders, save design proofs and checkout faster."
                : "Join Aiel Studio for custom apparel, merchandise proofing & discounts."}
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Tab Switcher Pills */}
        <div className="flex bg-secondary/80 p-1 rounded-full border border-border mt-2">
          <button
            type="button"
            onClick={() => handleTabSwitch("signin")}
            className={`flex-1 py-1.5 text-xs font-display uppercase tracking-wider font-semibold rounded-full transition-all ${
              tab === "signin"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => handleTabSwitch("signup")}
            className={`flex-1 py-1.5 text-xs font-display uppercase tracking-wider font-semibold rounded-full transition-all ${
              tab === "signup"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Error / Success Feedback */}
        {errorMsg && (
          <div className="flex items-center gap-2 p-3 text-xs rounded-xl bg-destructive/15 text-destructive border border-destructive/20 animate-in fade-in">
            <AlertCircle size={15} className="flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="flex items-center gap-2 p-3 text-xs rounded-xl bg-emerald-500/15 text-emerald-500 border border-emerald-500/20 animate-in fade-in">
            <CheckCircle2 size={15} className="flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 mt-1">
          {tab === "signup" && (
            <div className="space-y-1">
              <label className="text-[11px] font-display uppercase tracking-wider text-muted-foreground font-semibold">
                Full Name
              </label>
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  required
                  placeholder="Arun Kumar"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-secondary/60 border border-border rounded-xl pl-9 pr-3.5 py-2.5 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-splash-pink transition-colors"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[11px] font-display uppercase tracking-wider text-muted-foreground font-semibold">
              Email Address
            </label>
            <div className="relative">
              <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-secondary/60 border border-border rounded-xl pl-9 pr-3.5 py-2.5 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-splash-pink transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-display uppercase tracking-wider text-muted-foreground font-semibold">
              Password
            </label>
            <div className="relative">
              <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-secondary/60 border border-border rounded-xl pl-9 pr-3.5 py-2.5 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-splash-pink transition-colors"
              />
            </div>
          </div>

          {tab === "signup" && (
            <div className="space-y-1">
              <label className="text-[11px] font-display uppercase tracking-wider text-muted-foreground font-semibold">
                Confirm Password
              </label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-secondary/60 border border-border rounded-xl pl-9 pr-3.5 py-2.5 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-splash-pink transition-colors"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 flex items-center justify-center gap-2 bg-brand-gradient text-primary-foreground font-display font-bold text-xs uppercase tracking-wider py-3 rounded-full shadow-lg shadow-splash-pink/20 hover:opacity-95 transition-opacity disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <span>{tab === "signin" ? "Sign In" : "Create Account"}</span>
                <ArrowRight size={14} />
              </>
            )}
          </button>
        </form>

        {/* Footer switch prompt */}
        <div className="pt-3 border-t border-border/80 text-center text-xs text-muted-foreground">
          {tab === "signin" ? (
            <p>
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => handleTabSwitch("signup")}
                className="text-splash-pink font-semibold hover:underline cursor-pointer"
              >
                Sign up now
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => handleTabSwitch("signin")}
                className="text-splash-pink font-semibold hover:underline cursor-pointer"
              >
                Sign in
              </button>
            </p>
          )}

          {isConfigured && (
            <p className="text-[10px] text-muted-foreground/60 mt-2 flex items-center justify-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
              Secured with Supabase Auth
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
