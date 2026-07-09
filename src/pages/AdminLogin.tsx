import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Shield, Mail, KeyRound, ArrowLeft } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type Step = "email" | "otp";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<Step>("email");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/admin/dashboard");
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate("/admin/dashboard");
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const allowedEmails = ["vishnu53@myyahoo.com"];
    if (!allowedEmails.includes(email.toLowerCase().trim())) {
      toast({ title: "Access Denied", description: "This email is not authorized for admin access.", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email: email.toLowerCase().trim(),
      options: {
        shouldCreateUser: true,
        emailRedirectTo: undefined,
      },
    });
    setLoading(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setStep("otp");
      toast({ title: "OTP Sent!", description: "Check your email for the 6-digit code." });
    }

  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) return;
    setLoading(true);
    const { error } = await supabase.auth.verifyOtp({
      email: email.toLowerCase().trim(),
      token: otp,
      type: "email",
    });
    setLoading(false);
    if (error) {
      toast({ title: "Verification Failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success!", description: "You are now logged in." });
      navigate("/admin/dashboard");
    }
  };

  const handleResend = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email: email.toLowerCase().trim(),
      options: {
        shouldCreateUser: true,
      },
    });
    setLoading(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setOtp("");
      toast({ title: "OTP Resent!", description: "A new code has been sent to your email." });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            {step === "email" ? (
              <Shield className="h-7 w-7 text-primary" />
            ) : (
              <KeyRound className="h-7 w-7 text-primary" />
            )}
          </div>
          <CardTitle className="text-2xl">
            {step === "email" ? "Admin Login" : "Enter Verification Code"}
          </CardTitle>
          <CardDescription>
            {step === "email"
              ? "Enter your admin email to receive a one-time password"
              : `We sent a 6-digit code to ${email}. Enter it below to log in.`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === "email" ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="Admin email address"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Sending..." : "Send OTP"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="flex justify-center">
                <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <Button type="submit" className="w-full" disabled={loading || otp.length !== 6}>
                {loading ? "Verifying..." : "Verify & Login"}
              </Button>
              <div className="flex items-center justify-between">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => { setStep("email"); setOtp(""); }}
                  className="gap-1"
                >
                  <ArrowLeft className="h-4 w-4" /> Back
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleResend}
                  disabled={loading}
                >
                  Resend Code
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
