"use client";

/**
 * ConcertGo — Profil Saya
 * Single-file Next.js page (App Router: app/profile/page.tsx)
 *
 * This page now ONLY holds account info (avatar, stats, editable form).
 * Tiket Saya, Favorit Saya, and Pengaturan each live on their own route:
 *   app/tiket-saya/page.tsx
 *   app/favorit/page.tsx
 *   app/pengaturan/page.tsx
 *
 * All four share the same header, the same "account subnav" pill row,
 * and the same full footer as the homepage, so they read as one
 * connected section of the product instead of four separate designs.
 */

import type { CSSProperties, JSX } from "react";
import { useMemo, useRef, useState } from "react";
import Link from "next/link";

/* ------------------------------------------------------------------ */
/*  Mock current user — replace with your real session/auth data       */
/* ------------------------------------------------------------------ */

const CURRENT_USER = {
  name: "Raka Pratama",
  username: "rakapratama",
  email: "raka.pratama@email.com",
  phone: "+62 812-3456-7890",
  city: "Jakarta",
  birthdate: "1996-11-03",
  bio: "Penikmat konser akhir pekan. Selalu berburu tiket festival musik sebelum harganya naik.",
  initial: "R",
  memberSince: "2022",
};

type ProfileForm = {
  name: string;
  username: string;
  email: string;
  phone: string;
  city: string;
  birthdate: string;
  bio: string;
};

const INITIAL_PROFILE: ProfileForm = {
  name: CURRENT_USER.name,
  username: CURRENT_USER.username,
  email: CURRENT_USER.email,
  phone: CURRENT_USER.phone,
  city: CURRENT_USER.city,
  birthdate: CURRENT_USER.birthdate,
  bio: CURRENT_USER.bio,
};

const TICKET_COUNT = 2; // keep in sync with app/tiket-saya's mock data
const FAVORITE_COUNT = 2; // keep in sync with app/favorit's mock data

/* ------------------------------------------------------------------ */
/*  Page                                                                */
/* ------------------------------------------------------------------ */

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-[#f6efe1] font-[var(--font-body,ui-sans-serif)] text-[#241608]">
      <SiteHeader />

      <main>
        <Breadcrumb label="Profil Saya" />
        <AccountSubnav active="profil" />

        <ProfileHero />

        <div className="mx-auto max-w-7xl px-6">
          <StatsRow />
        </div>

        <div className="mx-auto max-w-7xl px-6 py-8">
          <ProfileFormCard />
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Header — identical pattern to the homepage/beranda header          */
/* ------------------------------------------------------------------ */

const NAV_LINKS = [
  { label: "Home", href: "/beranda" },
  { label: "Konser", href: "/beranda#konser" },
  { label: "Rekomendasi", href: "/beranda#rekomendasi" },
  { label: "Komentar", href: "/beranda#komentar" },
];

function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-[#e6d9bf] bg-[#f6efe1]/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/beranda" className="flex items-center gap-2">
          <img src="/image/Logo.png" alt="ConcertGo" className="h-8 w-auto" />
          <span className="font-[var(--font-display,serif)] text-lg">
            <span className="font-semibold">Concert</span>
            <span className="font-normal text-[#d9691f]">Go</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-[#4a3a26] md:flex">
          {NAV_LINKS.map(({ label, href }) => (
            <Link key={label} href={href} className="transition-colors hover:text-[#241608]">
              {label}
            </Link>
          ))}
        </nav>

        <UserMenu />
      </div>
    </header>
  );
}

function UserMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-full border border-[#e6d9bf] bg-white/70 py-1 pl-1 pr-3 transition-colors hover:border-[#d9691f]"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#d9691f] text-sm font-semibold text-[#f6efe1]">
          {CURRENT_USER.initial}
        </span>
        <span className="hidden text-sm font-medium text-[#241608] sm:inline">
          {CURRENT_USER.name.split(" ")[0]}
        </span>
        <IconChevronDown className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-50 mt-2 w-64 overflow-hidden rounded-2xl border border-[#e6d9bf] bg-white shadow-[0_20px_45px_rgba(36,22,8,0.18)]">
            <div className="border-b border-[#e6d9bf] px-4 py-3">
              <p className="text-sm font-semibold text-[#241608]">{CURRENT_USER.name}</p>
              <p className="text-xs text-[#8a7a63]">{CURRENT_USER.email}</p>
            </div>
            <nav className="py-1 text-sm text-[#4a3a26]">
              <MenuLink href="/profile" icon={<IconUser />} label="Profil Saya" />
              <MenuLink href="/tiket-saya" icon={<IconTicket />} label="Tiket Saya" />
              <MenuLink href="/favorit" icon={<IconHeart />} label="Favorit Saya" />
              <MenuLink href="/pengaturan" icon={<IconSettings />} label="Pengaturan" />
            </nav>
            <div className="border-t border-[#e6d9bf] py-1">
              <Link
                href="/sign-in"
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-[#c94f6d] transition-colors hover:bg-[#fdf2ee]"
              >
                <IconLogout /> Keluar
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function MenuLink({ href, icon, label }: { href: string; icon: JSX.Element; label: string }) {
  return (
    <Link href={href} className="flex items-center gap-2.5 px-4 py-2.5 transition-colors hover:bg-[#f6efe1]">
      <span className="text-[#8a7a63]">{icon}</span>
      {label}
    </Link>
  );
}

function Breadcrumb({ label }: { label: string }) {
  return (
    <div className="mx-auto max-w-7xl px-6 pt-6">
      <p className="text-xs text-[#8a7a63]">
        <Link href="/beranda" className="hover:text-[#241608]">
          Beranda
        </Link>{" "}
        / <span className="text-[#241608]">{label}</span>
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Account subnav — the four account sections, now separate routes    */
/* ------------------------------------------------------------------ */

const ACCOUNT_LINKS = [
  { id: "profil", label: "Profil", href: "/profile", icon: <IconUser /> },
  { id: "tiket", label: "Tiket Saya", href: "/tiket-saya", icon: <IconTicket /> },
  { id: "favorit", label: "Favorit Saya", href: "/favorit", icon: <IconHeart /> },
  { id: "pengaturan", label: "Pengaturan", href: "/pengaturan", icon: <IconSettings /> },
] as const;

function AccountSubnav({ active }: { active: (typeof ACCOUNT_LINKS)[number]["id"] }) {
  return (
    <div className="mx-auto max-w-7xl px-6 pb-2 pt-4">
      <div className="flex gap-2 overflow-x-auto">
        {ACCOUNT_LINKS.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              active === item.id
                ? "border-[#241608] bg-[#241608] text-[#f6efe1]"
                : "border-[#e6d9bf] bg-white/60 text-[#4a3a26] hover:border-[#d9691f]"
            }`}
          >
            {item.icon} {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Profil hero, stats, editable info form                             */
/* ------------------------------------------------------------------ */

function ProfileHero() {
  const [avatar, setAvatar] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleAvatarPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAvatar(reader.result as string);
    reader.readAsDataURL(file);
  }

  return (
    <section className="mx-auto max-w-7xl px-6 pt-2">
      <div className="overflow-hidden rounded-3xl border border-[#e6d9bf] bg-[#f1e6d0]">
        <div className="h-32 bg-gradient-to-r from-[#241209] via-[#3a1c0f] to-[#241209] md:h-40" />

        <div className="flex flex-col items-center gap-4 px-6 pb-6 sm:flex-row sm:items-end">
          <div className="relative -mt-12 shrink-0 sm:-mt-14">
            <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-[#f1e6d0] bg-gradient-to-br from-[#d9691f] to-[#3a1c0f] text-2xl font-semibold text-[#f6efe1] sm:h-28 sm:w-28">
              {avatar ? (
                <img src={avatar} alt="Foto profil" className="h-full w-full object-cover" />
              ) : (
                CURRENT_USER.initial
              )}
            </div>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              aria-label="Ganti foto profil"
              className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#f1e6d0] bg-[#241608] text-[#f6efe1] transition-transform hover:scale-110"
            >
              <IconCamera />
            </button>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatarPick} className="hidden" />
          </div>

          <div className="min-w-0 flex-1 pt-2 text-center sm:pt-0 sm:text-left">
            <p className="font-[var(--font-display,serif)] text-2xl text-[#241608]">{CURRENT_USER.name}</p>
            <p className="text-sm text-[#8a7a63]">
              @{CURRENT_USER.username} · {CURRENT_USER.city}
            </p>
          </div>

          <span className="shrink-0 rounded-full border border-[#e6d9bf] bg-white/60 px-3 py-1.5 text-xs text-[#5a4a35]">
            Member sejak {CURRENT_USER.memberSince}
          </span>
        </div>
      </div>
    </section>
  );
}

function StatsRow() {
  const stats = [
    { label: "Tiket Dibeli", value: String(TICKET_COUNT), icon: <IconTicket /> },
    { label: "Konser Favorit", value: String(FAVORITE_COUNT), icon: <IconHeart /> },
    { label: "Poin Loyalitas", value: "2.450", icon: <IconTrophy /> },
  ];
  return (
    <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
      {stats.map((s) => (
        <div key={s.label} className="flex items-center gap-4 rounded-3xl border border-[#e6d9bf] bg-[#f1e6d0] p-5">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#efe4cf] text-[#d9691f]">
            {s.icon}
          </span>
          <div>
            <p className="font-[var(--font-display,serif)] text-xl text-[#241608]">{s.value}</p>
            <p className="text-xs text-[#8a7a63]">{s.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function ProfileFormCard() {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<ProfileForm>(INITIAL_PROFILE);
  const [saved, setSaved] = useState<ProfileForm>(INITIAL_PROFILE);
  const [toast, setToast] = useState(false);

  const isDirty = useMemo(() => JSON.stringify(draft) !== JSON.stringify(saved), [draft, saved]);

  function field<K extends keyof ProfileForm>(key: K, value: ProfileForm[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  function handleSave() {
    setSaved(draft);
    setEditing(false);
    setToast(true);
    setTimeout(() => setToast(false), 2500);
  }

  function handleCancel() {
    setDraft(saved);
    setEditing(false);
  }

  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-[#e6d9bf] bg-[#f1e6d0] p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="font-[var(--font-display,serif)] text-xl text-[#241608]">Informasi Akun</h2>
            <p className="mt-1 text-sm text-[#8a7a63]">Data ini dipakai untuk e-tiket dan konfirmasi pembelian.</p>
          </div>

          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="flex shrink-0 items-center gap-1.5 rounded-full bg-[#241608] px-4 py-2 text-xs font-medium text-[#f6efe1] transition-transform hover:scale-105 active:scale-95"
            >
              <IconEdit /> Edit Profil
            </button>
          ) : (
            <div className="flex shrink-0 gap-2">
              <button
                onClick={handleCancel}
                className="rounded-full border border-[#e6d9bf] px-4 py-2 text-xs font-medium text-[#5a4a35] transition-colors hover:bg-white/60"
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                disabled={!isDirty}
                className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-medium transition-transform ${
                  isDirty
                    ? "bg-[#d9691f] text-white hover:scale-105 active:scale-95"
                    : "cursor-not-allowed bg-[#e6d9bf] text-[#8a7a63]"
                }`}
              >
                <IconCheck /> Simpan Perubahan
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Nama Lengkap" editing={editing}>
            <input value={draft.name} onChange={(e) => field("name", e.target.value)} disabled={!editing} className={inputClass(editing)} />
          </Field>

          <Field label="Username" editing={editing}>
            <div className="flex items-center">
              <span className="mr-1 text-[#8a7a63]">@</span>
              <input
                value={draft.username}
                onChange={(e) => field("username", e.target.value.replace(/\s/g, ""))}
                disabled={!editing}
                className={inputClass(editing)}
              />
            </div>
          </Field>

          <Field label="Email" editing={editing}>
            <input type="email" value={draft.email} onChange={(e) => field("email", e.target.value)} disabled={!editing} className={inputClass(editing)} />
          </Field>

          <Field label="Nomor HP" editing={editing}>
            <input value={draft.phone} onChange={(e) => field("phone", e.target.value)} disabled={!editing} className={inputClass(editing)} />
          </Field>

          <Field label="Kota" editing={editing}>
            <input value={draft.city} onChange={(e) => field("city", e.target.value)} disabled={!editing} className={inputClass(editing)} />
          </Field>

          <Field label="Tanggal Lahir" editing={editing}>
            <input type="date" value={draft.birthdate} onChange={(e) => field("birthdate", e.target.value)} disabled={!editing} className={inputClass(editing)} />
          </Field>

          <Field label="Bio" editing={editing} full>
            <textarea value={draft.bio} onChange={(e) => field("bio", e.target.value)} disabled={!editing} rows={3} className={`${inputClass(editing)} resize-none`} />
          </Field>
        </div>
      </div>

      {toast && (
        <div className="flex items-center gap-2 rounded-2xl border border-[#cfe3c8] bg-[#eef6ea] px-4 py-3 text-sm text-[#2f5c26]">
          <IconCheck /> Perubahan profil berhasil disimpan.
        </div>
      )}
    </div>
  );
}

function Field({ label, editing, full, children }: { label: string; editing: boolean; full?: boolean; children: React.ReactNode }) {
  return (
    <label className={`block ${full ? "sm:col-span-2" : ""}`}>
      <span className="mb-1.5 block text-xs font-medium text-[#8a7a63]">{label}</span>
      {children}
    </label>
  );
}

function inputClass(editing: boolean) {
  return `w-full rounded-xl border px-3.5 py-2.5 text-sm text-[#241608] transition-colors focus:outline-none ${
    editing ? "border-[#e6d9bf] bg-white focus:border-[#d9691f]" : "border-transparent bg-transparent px-0 py-1 text-[#5a4a35]"
  }`;
}

/* ------------------------------------------------------------------ */
/*  Footer — the exact same footer used on the homepage/beranda        */
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
                  <a href={l.href} className="text-sm text-[#5a4a35] transition-colors hover:text-[#d9691f]">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-[#e6d9bf] px-6 py-6 text-sm text-[#5a4a35] md:flex-row">
        <Link href="/beranda" className="flex items-center gap-2 font-[var(--font-display,serif)] text-base text-[#241608]">
          <img src="/image/Logo.png" alt="ConcertGo" className="h-7 w-auto" />
          ConcertGo
        </Link>

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
/*  Icons (inline SVG, no external deps — matches the rest of the site)*/
/* ------------------------------------------------------------------ */

function IconCamera() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 8h3l2-2h6l2 2h3v11H4V8Z" strokeLinejoin="round" />
      <circle cx="12" cy="13.5" r="3.2" />
    </svg>
  );
}
function IconEdit() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 20h4L18.5 9.5a2.1 2.1 0 0 0-3-3L5 17v3Z" strokeLinejoin="round" />
    </svg>
  );
}
function IconCheck() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconLogout() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" strokeLinecap="round" />
      <path d="M16 17l5-5-5-5M21 12H9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconTicket() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="7" width="18" height="12" rx="2.5" />
      <path d="M3 12h18" strokeDasharray="1.5 2.2" />
    </svg>
  );
}
function IconHeart() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M12 21s-7-4.35-9.5-8.5C.7 8.8 2.6 5 6.2 5c2 0 3.4 1.1 4 2.3C10.8 6.1 12.2 5 14.2 5c3.6 0 5.5 3.8 3.7 7.5C19 16.65 12 21 12 21Z" strokeLinejoin="round" />
    </svg>
  );
}
function IconTrophy() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M7 4h10v5a5 5 0 0 1-10 0V4Z" strokeLinejoin="round" />
      <path d="M7 5H4v2a3 3 0 0 0 3 3M17 5h3v2a3 3 0 0 1-3 3" strokeLinecap="round" />
      <path d="M12 14v3M9 20h6M10 17h4v3h-4v-3Z" strokeLinejoin="round" />
    </svg>
  );
}
function IconUser() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c1.5-4 5-6 8-6s6.5 2 8 6" strokeLinecap="round" />
    </svg>
  );
}
function IconSettings() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="3" />
      <path
        d="M19.4 13a7.5 7.5 0 0 0 0-2l2-1.5-2-3.4-2.3.9a7.6 7.6 0 0 0-1.7-1L15 3.5h-4l-.4 2.5a7.6 7.6 0 0 0-1.7 1l-2.3-.9-2 3.4L6.6 11a7.5 7.5 0 0 0 0 2l-2 1.5 2 3.4 2.3-.9c.5.4 1.1.75 1.7 1l.4 2.5h4l.4-2.5c.6-.25 1.2-.6 1.7-1l2.3.9 2-3.4-2-1.5Z"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function IconChevronDown({ className = "" }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
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

1. Save as app/profile/page.tsx. Pairs with app/tiket-saya/page.tsx,
   app/favorit/page.tsx, and app/pengaturan/page.tsx — all four share
   this same header, AccountSubnav pill row, and footer.

2. CURRENT_USER is mock data — replace with your real session.
   TICKET_COUNT / FAVORITE_COUNT are just for the stat cards; once you
   have a real data source, derive these from it instead of hardcoding.
------------------------------------------------------------------- */