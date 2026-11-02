import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/lib/supabase";
import { syncCustomerProfile } from "@/lib/customer-service";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import mascot from "@/assets/mascot.png";

export const Route = createFileRoute("/auth/callback")({
  component: AuthCallbackPage,
});

function AuthCallbackPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function handleAuthRedirect() {
      try {
        // Exchange auth code or extract session from URL hash
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          throw error;
        }

        if (data.session?.user) {
          // Sync profile to database
          await syncCustomerProfile(data.session.user);
          if (mounted) {
            setStatus("success");
            setTimeout(() => {
              navigate({ to: "/account" });
            }, 600);
          }
        } else {
          // Listen for next auth event (PKCE code exchange)
          const { data: authListener } = supabase.auth.onAuthStateChange(
            async (event, session) => {
              if (session?.user && mounted) {
                await syncCustomerProfile(session.user);
                setStatus("success");
                setTimeout(() => {
                  navigate({ to: "/account" });
                }, 600);
              }
            }
          );

          // Timeout fallback
          setTimeout(() => {
            if (mounted && status === "loading") {
              navigate({ to: "/account" });
            }
          }, 2500);

          return () => {
            authListener.subscription.unsubscribe();
          };
        }
      } catch (err: any) {
        if (mounted) {
          setStatus("error");
          setErrorMessage(err.message || "Failed to authenticate. Please try again.");
          setTimeout(() => {
            navigate({ to: "/" });
          }, 3000);
        }
      }
    }

    handleAuthRedirect();

    return () => {
      mounted = false;
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background text-foreground">
      <div className="max-w-md w-full bg-card border border-border rounded-3xl p-8 text-center shadow-2xl relative overflow-hidden">
        {/* Glow */}
        <div className="pointer-events-none absolute -top-12 -right-12 w-36 h-36 bg-splash-pink/15 rounded-full blur-2xl" />

        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-splash-purple via-splash-pink to-splash-orange p-[1.5px] shadow-lg shadow-splash-pink/20 mx-auto mb-4">
          <div className="w-full h-full bg-card rounded-[14px] flex items-center justify-center overflow-hidden">
            <img src={mascot} alt="Aiel Studio" className="w-10 h-10 object-contain" />
          </div>
        </div>

        {status === "loading" && (
          <div className="space-y-3">
            <Loader2 size={32} className="animate-spin text-splash-pink mx-auto" />
            <h2 className="font-display font-bold text-lg text-foreground">
              Verifying Authentication...
            </h2>
            <p className="text-xs text-muted-foreground">
              Connecting your customer profile with Aiel Design &amp; Printing Studio.
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-3 animate-in fade-in">
            <CheckCircle2 size={36} className="text-emerald-500 mx-auto" />
            <h2 className="font-display font-bold text-lg text-foreground">
              Welcome to AIEL Studio!
            </h2>
            <p className="text-xs text-muted-foreground">
              Sign-in successful. Redirecting you to your account...
            </p>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-3 animate-in fade-in">
            <AlertCircle size={36} className="text-destructive mx-auto" />
            <h2 className="font-display font-bold text-lg text-foreground">
              Authentication Error
            </h2>
            <p className="text-xs text-destructive">{errorMessage}</p>
            <p className="text-[11px] text-muted-foreground">Redirecting back to home page...</p>
          </div>
        )}
      </div>
    </div>
  );
}
