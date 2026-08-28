"use client";

/**
 * ConcertGo — Sign In
 * Single-file Next.js page.
 *
 * Save as: app/sign-in/page.tsx  (route becomes /sign-in)
 *
 * Uses the landing page's warm cream / espresso / terracotta palette and
 * fonts so both pages read as one site.
 *
 * Flow: email + password → (simulated) request → 6-digit verification
 * code step → success. The footer is the same multi-column footer used
 * on the landing page.
 *
 * Requires the same setup as the landing page: Tailwind CSS, the
 * --font-display / --font-body variables in app/layout.tsx, and the
 * logo at public/image/Logo.png.
 */

import type { FormEvent, KeyboardEvent } from "react";
import { useEffect, useRef, useState } from "react";

/* ------------------------------------------------------------------ */
/*  Toast system (tiny, local — no external deps)                      */
/* ------------------------------------------------------------------ */

type Toast = { id: number; kind: "success" | "error"; message: string };

function useToasts() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idRef = useRef(0);

  function push(kind: Toast["kind"], message: string) {
    const id = ++idRef.current;
    setToasts((t) => [...t, { id, kind, message }]);
    setTimeout(() => {
      setToasts((t) => t.filter((toast) => toast.id !== id));
    }, 3800);
  }

  function dismiss(id: number) {
    setToasts((t) => t.filter((toast) => toast.id !== id));
  }

  return { toasts, push, dismiss };
}

function ToastStack({ toasts, dismiss }: { toasts: Toast[]; dismiss: (id: number) => void }) {
  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-50 flex flex-col items-center gap-2 px-4">
      {toasts.map((t) => (
        <div
          key={t.id}
          role="status"
          className={`toast-in pointer-events-auto flex max-w-sm items-center gap-3 rounded-2xl border px-4 py-3 text-sm shadow-lg ${
            t.kind === "success"
              ? "border-[#cfead9] bg-[#f2fbf5] text-[#1f5c37]"
              : "border-[#f3cfc0] bg-[#fdf2ee] text-[#8a2f14]"
          }`}
        >
          <span className="text-base">{t.kind === "success" ? "✅" : "⚠️"}</span>
          <span>{t.message}</span>
          <button
            onClick={() => dismiss(t.id)}
            aria-label="Tutup notifikasi"
            className="ml-1 opacity-50 transition-opacity hover:opacity-100"
          >
            ✕
          </button>
        </div>
      ))}
      <style jsx>{`
        .toast-in {
          animation: toast-in 0.25s ease-out;
        }
        @keyframes toast-in {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                                */
/* ------------------------------------------------------------------ */

export default function SignInPage() {
  const { toasts, push, dismiss } = useToasts();

  return (
    <div className="flex min-h-screen flex-col bg-[#f6efe1] font-[var(--font-body,ui-sans-serif)] text-[#241608]">
      <SiteHeader />
      <ToastStack toasts={toasts} dismiss={dismiss} />
      <SignInHero onToast={push} />
      <SiteFooter />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Header — logo only, no nav links, "Daftar" outline button          */
/* ------------------------------------------------------------------ */

function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-[#e6d9bf] bg-[#f6efe1]/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <a href="/#top" className="flex items-center gap-2">
          <img src="/image/Logo.png" alt="ConcertGo" className="h-8 w-auto" />
          <span className="font-[var(--font-display,serif)] text-lg">
            <span className="font-semibold">Concert</span>
            <span className="font-normal text-[#d9691f]">Go</span>
          </span>
        </a>

        <a
          href="/sign-up"
          className="rounded-full border-2 border-[#241608] px-5 py-2 text-sm font-medium text-[#241608] transition-colors hover:bg-[#241608] hover:text-[#f6efe1]"
        >
          Daftar
        </a>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/*  Hero section wrapping the login card                               */
/* ------------------------------------------------------------------ */

function SignInHero({ onToast }: { onToast: (kind: Toast["kind"], msg: string) => void }) {
  return (
    <main className="relative flex flex-1 items-center justify-center overflow-hidden px-5 py-16">
      {/* soft warm gradient backdrop, echoing a dim, blurred stage */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 0%, rgba(217,105,31,0.14), transparent 70%), radial-gradient(55% 45% at 85% 90%, rgba(58,28,15,0.18), transparent 70%), linear-gradient(180deg, #f6efe1 0%, #f1e6d0 100%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-[#d9691f]/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-[#241209]/25 blur-3xl"
      />

      <LoginCard onToast={onToast} />
    </main>
  );
}

/* ------------------------------------------------------------------ */
/*  Login card — two steps: credentials, then verification code        */
/* ------------------------------------------------------------------ */

type Step = "credentials" | "otp";
type FieldErrors = { email?: string; password?: string };

function LoginCard({ onToast }: { onToast: (kind: Toast["kind"], msg: string) => void }) {
  const [step, setStep] = useState<Step>("credentials");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [shakeField, setShakeField] = useState<keyof FieldErrors | null>(null);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 20);
    return () => clearTimeout(t);
  }, []);

  function validate(): FieldErrors {
    const next: FieldErrors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      next.email = "Alamat email wajib diisi.";
    } else if (!emailPattern.test(email.trim())) {
      next.email = "Format email belum sesuai, contoh: nama@email.com";
    }

    if (!password) {
      next.password = "Kata sandi wajib diisi.";
    } else if (password.length < 8) {
      next.password = "Kata sandi minimal 8 karakter.";
    }

    return next;
  }

  function triggerShake(field: keyof FieldErrors) {
    setShakeField(field);
    setTimeout(() => setShakeField(null), 420);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);

    if (nextErrors.email) triggerShake("email");
    else if (nextErrors.password) triggerShake("password");

    if (Object.keys(nextErrors).length > 0) {
      onToast("error", "Coba periksa lagi ya, ada isian yang belum pas.");
      return;
    }

    setLoading(true);
    // Simulated request — wire this up to your real auth endpoint.
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setLoading(false);

    onToast("success", `Kode verifikasi telah dikirim ke ${email.trim()}.`);
    setStep("otp");
  }

  function handleSocial(provider: "Google" | "Facebook") {
    onToast("success", `Menghubungkan ke akun ${provider}...`);
  }

  return (
    <div
      className={`relative w-full max-w-[440px] rounded-3xl border border-[#e6d9bf] bg-white/85 p-10 shadow-[0_20px_60px_rgba(36,22,8,0.15)] backdrop-blur-md transition-all duration-500 sm:p-10 ${
        mounted ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
      }`}
    >
      {step === "credentials" ? (
        <>
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#f1e6d0]">
              <IconTicketPerson />
            </div>
            <h1 className="font-[var(--font-display,serif)] text-[26px] font-semibold leading-tight text-[#241608] sm:text-[28px]">
              Selamat Datang Kembali, Pencinta Musik! 🎶
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-[#5a4a35]">
              Masuk ke akun ConcertGo-mu dan lanjutkan petualangan musikmu.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <FormField
              label="Alamat Email"
              error={errors.email}
              shake={shakeField === "email"}
              icon={<IconEnvelope />}
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tulis emailmu di sini"
                autoComplete="email"
                className="w-full bg-transparent py-3 pl-10 pr-3 text-sm text-[#241608] placeholder:text-[#a1917a] focus:outline-none"
              />
            </FormField>

            <FormField
              label="Kata Sandi"
              error={errors.password}
              shake={shakeField === "password"}
              icon={<IconLock />}
              trailing={
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                  className="pr-3 text-[#8a7a63] transition-colors hover:text-[#241608]"
                >
                  {showPassword ? <IconEyeOff /> : <IconEye />}
                </button>
              }
            >
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full bg-transparent py-3 pl-10 pr-3 text-sm text-[#241608] placeholder:text-[#a1917a] focus:outline-none"
              />
            </FormField>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-[#5a4a35]">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-4 w-4 rounded border-[#c9b48b] accent-[#d9691f]"
                />
                Ingat saya
              </label>
              <a href="/reset-password" className="font-medium text-[#b5772f] hover:text-[#d9691f]">
                Lupa kata sandi? Reset di sini
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#241209] to-[#d9691f] py-3.5 text-sm font-semibold text-[#f6efe1] shadow-[0_10px_30px_rgba(217,105,31,0.35)] transition-all hover:scale-[1.02] hover:shadow-[0_14px_38px_rgba(217,105,31,0.45)] active:scale-[0.99] disabled:opacity-70"
            >
              {loading && <IconSpinner />}
              {loading ? "Memproses..." : "Masuk ke Akun"}
            </button>

            <div className="flex items-center gap-3 py-1 text-xs uppercase tracking-wide text-[#a1917a]">
              <span className="h-px flex-1 bg-[#e6d9bf]" />
              atau masuk dengan
              <span className="h-px flex-1 bg-[#e6d9bf]" />
            </div>

            <div className="space-y-3">
              <button
                type="button"
                onClick={() => handleSocial("Google")}
                className="flex w-full items-center justify-center gap-2.5 rounded-full border-2 border-[#e6d9bf] py-3 text-sm font-medium text-[#241608] transition-colors hover:border-[#4285F4] hover:bg-[#4285F4]/5"
              >
                <IconGoogle /> Masuk dengan Google
              </button>
              <button
                type="button"
                onClick={() => handleSocial("Facebook")}
                className="flex w-full items-center justify-center gap-2.5 rounded-full border-2 border-[#e6d9bf] py-3 text-sm font-medium text-[#241608] transition-colors hover:border-[#1877F2] hover:bg-[#1877F2]/5"
              >
                <IconFacebook /> Masuk dengan Facebook
              </button>
            </div>
          </form>

          <p className="mt-7 text-center text-sm text-[#5a4a35]">
            Belum punya akun?{" "}
            <a href="/sign-up" className="font-semibold text-[#c94f6d] hover:text-[#a63d57]">
              Yuk, daftar sekarang!
            </a>
          </p>
        </>
      ) : (
        <VerificationStep
          email={email}
          onBack={() => setStep("credentials")}
          onToast={onToast}
        />
      )}

      <style jsx>{`
        @keyframes shake {
          10%,
          90% {
            transform: translateX(-1px);
          }
          20%,
          80% {
            transform: translateX(2px);
          }
          30%,
          50%,
          70% {
            transform: translateX(-4px);
          }
          40%,
          60% {
            transform: translateX(4px);
          }
        }
        :global(.field-shake) {
          animation: shake 0.42s ease-in-out;
        }
      `}</style>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Step 2: 6-digit verification code                                  */
/* ------------------------------------------------------------------ */

const OTP_LENGTH = 6;
const RESEND_SECONDS = 30;

function VerificationStep({
  email,
  onBack,
  onToast,
}: {
  email: string;
  onBack: () => void;
  onToast: (kind: Toast["kind"], msg: string) => void;
}) {
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [error, setError] = useState<string | undefined>();
  const [verifying, setVerifying] = useState(false);
  const [resendIn, setResendIn] = useState(RESEND_SECONDS);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendIn]);

  function updateDigit(index: number, value: string) {
    const clean = value.replace(/[^0-9]/g, "").slice(-1);
    setDigits((prev) => {
      const next = [...prev];
      next[index] = clean;
      return next;
    });
    setError(undefined);
    if (clean && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>, index: number) {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    const pasted = e.clipboardData.getData("text").replace(/[^0-9]/g, "").slice(0, OTP_LENGTH);
    if (!pasted) return;
    e.preventDefault();
    const next = Array(OTP_LENGTH).fill("");
    pasted.split("").forEach((d, i) => (next[i] = d));
    setDigits(next);
    inputsRef.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  }

  async function handleVerify(e: FormEvent) {
    e.preventDefault();
    const code = digits.join("");
    if (code.length < OTP_LENGTH) {
      setError("Masukkan semua 6 digit kode verifikasi.");
      return;
    }

    setVerifying(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setVerifying(false);

    onToast("success", "Verifikasi berhasil! Selamat datang kembali di ConcertGo.");
  }

  function handleResend() {
    if (resendIn > 0) return;
    setResendIn(RESEND_SECONDS);
    setDigits(Array(OTP_LENGTH).fill(""));
    inputsRef.current[0]?.focus();
    onToast("success", `Kode verifikasi baru telah dikirim ke ${email.trim()}.`);
  }

  return (
    <>
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#f1e6d0]">
          <IconShieldCheck />
        </div>
        <h1 className="font-[var(--font-display,serif)] text-[26px] font-semibold leading-tight text-[#241608] sm:text-[28px]">
          Verifikasi Kode
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-[#5a4a35]">
          Kami sudah kirim kode 6 digit ke{" "}
          <span className="font-medium text-[#241608]">{email || "emailmu"}</span>. Masukkan di
          bawah untuk lanjut masuk.
        </p>
      </div>

      <form onSubmit={handleVerify} noValidate>
        <div className="flex justify-between gap-2" onPaste={handlePaste}>
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => {
                inputsRef.current[i] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={d}
              onChange={(e) => updateDigit(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              className={`h-14 w-12 rounded-2xl border-2 bg-white/70 text-center text-lg font-semibold text-[#241608] focus:outline-none ${
                error ? "border-[#d9532f]" : "border-[#e6d9bf] focus:border-[#d9691f]"
              }`}
            />
          ))}
        </div>
        {error && <p className="mt-2 text-xs font-medium text-[#d9532f]">{error}</p>}

        <button
          type="submit"
          disabled={verifying}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#241209] to-[#d9691f] py-3.5 text-sm font-semibold text-[#f6efe1] shadow-[0_10px_30px_rgba(217,105,31,0.35)] transition-all hover:scale-[1.02] hover:shadow-[0_14px_38px_rgba(217,105,31,0.45)] active:scale-[0.99] disabled:opacity-70"
        >
          {verifying && <IconSpinner />}
          {verifying ? "Memverifikasi..." : "Verifikasi & Masuk"}
        </button>

        <p className="mt-5 text-center text-sm text-[#5a4a35]">
          {resendIn > 0 ? (
            <>Kirim ulang kode dalam {resendIn} detik</>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              className="font-semibold text-[#b5772f] hover:text-[#d9691f]"
            >
              Kirim ulang kode
            </button>
          )}
        </p>

        <button
          type="button"
          onClick={onBack}
          className="mt-2 w-full text-center text-sm text-[#8a7a63] hover:text-[#241608]"
        >
          ← Kembali ke halaman masuk
        </button>
      </form>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Reusable form field with icon, label, and inline error             */
/* ------------------------------------------------------------------ */

function FormField({
  label,
  icon,
  trailing,
  error,
  shake,
  children,
}: {
  label: string;
  icon: React.JSX.Element;
  trailing?: React.JSX.Element;
  error?: string;
  shake?: boolean;
  children: React.JSX.Element;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-[#8a7a63]">
        {label}
      </label>
      <div
        className={`flex items-center rounded-2xl border-2 bg-white/70 transition-colors ${
          error ? "border-[#d9532f]" : "border-[#e6d9bf] focus-within:border-[#d9691f]"
        } ${shake ? "field-shake" : ""}`}
      >
        <span className="pl-3.5 text-[#8a7a63]">{icon}</span>
        {children}
        {trailing}
      </div>
      {error && <p className="mt-1.5 text-xs font-medium text-[#d9532f]">{error}</p>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Footer — same multi-column footer as the landing page              */
/* ------------------------------------------------------------------ */

const FOOTER_COLUMNS: { heading: string; links: { label: string; href: string }[] }[] = [
  {
    heading: "Pakai ConcertGo",
    links: [
      { label: "Best Offers", href: "#" },
      { label: "Tempat dengan Promo Terbaik", href: "#" },
      { label: "Promo", href: "#" },
      { label: "Help Center", href: "#" },
      { label: "Privacy Policy", href: "#" },
      { label: "Terms & Conditions", href: "#" },
    ],
  },
  {
    heading: "Informasi",
    links: [
      { label: "Publish Event di ConcertGo", href: "#" },
      { label: "Solusi untuk Pemilik Venue", href: "#" },
      { label: "Download Brochures", href: "#" },
      { label: "ConcertGo Experience Manager", href: "#" },
      { label: "Point of Sales", href: "#" },
      { label: "Ticket Scanner", href: "#" },
      { label: "Pricing", href: "#" },
    ],
  },
  {
    heading: "Solusi Bisnis",
    links: [
      { label: "New Normal Solution", href: "#" },
      { label: "Online Event Management", href: "#" },
      { label: "Sport Venue & Event", href: "#" },
      { label: "Theme Park", href: "#" },
      { label: "Tour & Travel", href: "#" },
      { label: "Exhibition", href: "#" },
      { label: "Music & Concerts", href: "#" },
      { label: "Seminar", href: "#" },
    ],
  },
  {
    heading: "Kenal ConcertGo",
    links: [
      { label: "About Us", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Press Kit", href: "#" },
    ],
  },
];

function SiteFooter() {
  return (
    <footer className="border-t border-[#e6d9bf] bg-[#f1e6d0]">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 py-12 sm:grid-cols-2 md:grid-cols-4">
        {FOOTER_COLUMNS.map((col) => (
          <div key={col.heading}>
            <p className="mb-4 text-sm font-semibold text-[#241608]">{col.heading}</p>
            <ul className="space-y-2.5">
              {col.links.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="text-sm text-[#5a4a35] transition-colors hover:text-[#d9691f]"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-[#e6d9bf] px-6 py-6 text-sm text-[#5a4a35] md:flex-row">
        <a
          href="/#top"
          className="flex items-center gap-2 font-[var(--font-display,serif)] text-base text-[#241608]"
        >
          <img src="/image/Logo.png" alt="ConcertGo" className="h-7 w-auto" />
          ConcertGo
        </a>

        <div className="flex gap-3">
          <a href="#" aria-label="Instagram" className="opacity-70 hover:opacity-100"><IconInstagram /></a>
          <a href="#" aria-label="TikTok" className="opacity-70 hover:opacity-100"><IconTikTok /></a>
          <a href="#" aria-label="X" className="opacity-70 hover:opacity-100"><IconX /></a>
        </div>
      </div>
      <p className="border-t border-[#e6d9bf] py-4 text-center text-xs text-[#8a7a63]">
        © 2026 ConcertGo. Semua tiket terverifikasi resmi.
      </p>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/*  Icons                                                               */
/* ------------------------------------------------------------------ */

function IconEnvelope() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="m4 7 8 6 8-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconLock() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="4.5" y="10.5" width="15" height="10" rx="2.5" />
      <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" strokeLinecap="round" />
    </svg>
  );
}
function IconEye() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
function IconEyeOff() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 3l18 18" strokeLinecap="round" />
      <path
        d="M10.6 5.2A10.8 10.8 0 0 1 12 5c6.4 0 10 7 10 7a17.6 17.6 0 0 1-3.6 4.5M6.2 6.9C3.6 8.7 2 12 2 12s3.6 7 10 7a10 10 0 0 0 4.1-.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" strokeLinecap="round" />
    </svg>
  );
}
function IconSpinner() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="animate-spin" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" opacity="0.25" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
function IconTicketPerson() {
  return (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#d9691f" strokeWidth="1.6">
      <circle cx="12" cy="7" r="3" />
      <path d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6" strokeLinecap="round" />
      <rect x="15.5" y="2.5" width="6" height="4" rx="1" transform="rotate(18 15.5 2.5)" />
    </svg>
  );
}
function IconShieldCheck() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#d9691f" strokeWidth="1.6">
      <path d="M12 3l7 3v5c0 4.6-3 8.4-7 10-4-1.6-7-5.4-7-10V6l7-3Z" strokeLinejoin="round" />
      <path d="m9 12 2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconGoogle() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.6v3h3.9c2.3-2.1 3.5-5.2 3.5-8.8Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.9-3c-1.1.7-2.4 1.1-4 1.1-3.1 0-5.7-2.1-6.6-4.9H1.4v3.1C3.4 21.3 7.4 24 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.4 14.3c-.2-.7-.4-1.5-.4-2.3s.1-1.6.4-2.3V6.6H1.4A12 12 0 0 0 0 12c0 1.9.5 3.8 1.4 5.4l4-3.1Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4C17.9 1.2 15.2 0 12 0 7.4 0 3.4 2.7 1.4 6.6l4 3.1C6.3 6.9 8.9 4.8 12 4.8Z"
      />
    </svg>
  );
}
function IconFacebook() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2">
      <path d="M24 12.07C24 5.4 18.6 0 12 0S0 5.4 0 12.07C0 18.1 4.4 23.1 10.1 24v-8.44H7.1v-3.49h3v-2.66c0-2.97 1.79-4.61 4.5-4.61 1.3 0 2.66.23 2.66.23v2.92h-1.5c-1.48 0-1.94.92-1.94 1.86v2.26h3.3l-.53 3.49h-2.77V24C19.6 23.1 24 18.1 24 12.07Z" />
    </svg>
  );
}
function IconInstagram() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
function IconTikTok() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M14 4v9.5a3.5 3.5 0 1 1-3-3.46" strokeLinecap="round" />
      <path d="M14 4c.5 2.5 2.2 4 4.5 4.2" strokeLinecap="round" />
    </svg>
  );
}
function IconX() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M5 5l14 14M19 5 5 19" strokeLinecap="round" />
    </svg>
  );
}

/* ------------------------------------------------------------------
SETUP NOTES

1. Save this file as app/sign-in/page.tsx (route: /sign-in).
2. Uses the same Tailwind + font setup as the landing page — no new
   dependencies. Logo path: public/image/Logo.png.
3. Flow: submitting email + password simulates a request, then shows
   a 6-digit verification code step (auto-focus, paste support,
   backspace-to-previous-field, and a 30s resend cooldown). Replace
   both `await new Promise(...)` blocks (in handleSubmit and
   handleVerify) with your real endpoints — request an OTP after
   credentials check out, then confirm it in handleVerify.
4. Link targets /sign-up and /reset-password, and all footer column
   links, are placeholders — point them at your actual routes once
   those pages exist.
------------------------------------------------------------------- */