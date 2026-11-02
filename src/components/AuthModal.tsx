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
  defaultTab?: "signin" | "signup" | "forgot";
}

export function AuthModal({ isOpen, onClose, defaultTab = "signin" }: AuthModalProps) {
  const [tab, setTab] = useState<"signin" | "signup" | "forgot">(defaultTab);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const { signIn, signUp, signInWithGoogle, resetPassword, isConfigured } = useAuth();

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setFullName("");
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(false);
    setGoogleLoading(false);
  };

  const handleTabSwitch = (newTab: "signin" | "signup" | "forgot") => {
    setTab(newTab);
    setErrorMsg(null);
    setSuccessMsg(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setGoogleLoading(true);
    try {
      const { error } = await signInWithGoogle();
      if (error) {
        setErrorMsg(error.message);
        setGoogleLoading(false);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Google sign in failed. Please try again.");
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email) {
      setErrorMsg("Please enter your email address.");
      return;
    }

    if (tab === "forgot") {
      setLoading(true);
      try {
        const { error } = await resetPassword(email);
        if (error) {
          setErrorMsg(error.message);
        } else {
          setSuccessMsg("Password reset link sent! Please check your email inbox.");
        }
      } catch (err: any) {
        setErrorMsg(err.message || "Failed to send reset link.");
      } finally {
        setLoading(false);
      }
      return;
    }

    if (!password) {
      setErrorMsg("Please enter your password.");
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
            setSuccessMsg("Account created! Please check your email to verify your account.");
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
              {tab === "signin" && (
                <>
                  Sign in to <span className="text-gradient">AIEL STUDIO</span>
                </>
              )}
              {tab === "signup" && (
                <>
                  Create an <span className="text-gradient">Account</span>
                </>
              )}
              {tab === "forgot" && (
                <>
                  Reset <span className="text-gradient">Password</span>
                </>
              )}
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm text-muted-foreground">
              {tab === "signin" && "Track custom print orders, save design proofs, and checkout faster."}
              {tab === "signup" && "Join Aiel Studio for custom apparel, merchandise proofing & discounts."}
              {tab === "forgot" && "Enter your email address to receive password recovery instructions."}
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Tab Switcher Pills */}
        <div className="flex bg-secondary/80 p-1 rounded-full border border-border mt-2">
          <button
            type="button"
            onClick={() => handleTabSwitch("signin")}
            className={`flex-1 py-1.5 text-xs font-display uppercase tracking-wider font-semibold rounded-full transition-all cursor-pointer ${
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
            className={`flex-1 py-1.5 text-xs font-display uppercase tracking-wider font-semibold rounded-full transition-all cursor-pointer ${
              tab === "signup"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Continue with Google OAuth Button */}
        {tab !== "forgot" && (
          <div className="mt-3">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
              className="w-full flex items-center justify-center gap-3 bg-card border border-border hover:border-splash-pink text-foreground font-display font-semibold text-xs tracking-wide py-3 px-4 rounded-full shadow-sm hover:shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              {googleLoading ? (
                <Loader2 size={16} className="animate-spin text-splash-pink" />
              ) : (
                <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
              )}
              <span>Continue with Google</span>
            </button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-display tracking-widest text-muted-foreground">
                <span className="bg-card px-3">or continue with email</span>
              </div>
            </div>
          </div>
        )}

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

          {tab !== "forgot" && (
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-display uppercase tracking-wider text-muted-foreground font-semibold">
                  Password
                </label>
                {tab === "signin" && (
                  <button
                    type="button"
                    onClick={() => handleTabSwitch("forgot")}
                    className="text-[11px] text-splash-pink hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
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
          )}

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
            className="w-full mt-2 flex items-center justify-center gap-2 bg-brand-gradient text-primary-foreground font-display font-bold text-xs uppercase tracking-wider py-3.5 rounded-full shadow-lg shadow-splash-pink/20 hover:opacity-95 transition-opacity disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <span>
                  {tab === "signin" && "Sign In"}
                  {tab === "signup" && "Create Account"}
                  {tab === "forgot" && "Send Reset Link"}
                </span>
                <ArrowRight size={14} />
              </>
            )}
          </button>
        </form>

        {/* Footer switch prompt */}
        <div className="pt-3 border-t border-border/80 text-center text-xs text-muted-foreground">
          {tab === "signin" && (
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
          )}

          {tab === "signup" && (
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

          {tab === "forgot" && (
            <p>
              Remember your password?{" "}
              <button
                type="button"
                onClick={() => handleTabSwitch("signin")}
                className="text-splash-pink font-semibold hover:underline cursor-pointer"
              >
                Back to sign in
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
