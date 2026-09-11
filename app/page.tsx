"use client";

/**
 * ConcertGo — Landing Page Pengguna (Sebelum Login)
 * Single-file Next.js page (App Router: app/page.tsx)
 * Dilengkapi dengan tampilan visual dummy event yang kaya, poster konser,
 * modal detail konser interaktif, dan animasi Framer Motion.
 */

import type { CSSProperties, JSX } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

/* ------------------------------------------------------------------ */
/*  Type Definitions & Dummy Data                                     */
/* ------------------------------------------------------------------ */

type Category =
  | "Musik & Konser"
  | "Festival Musik"
  | "Hiburan & Pertunjukan"
  | "Wisata & Outdoor"
  | "Olahraga & E-Sport"
  | "Amal & Charity"
  | "Seni & Budaya"
  | "Stand-up Comedy"
  | "Atraksi & Wahana";

type TicketTier = {
  name: string;
  price: number;
  perks: string[];
  status: "Tersedia" | "Sisa Sedikit" | "Habis";
};

type EventItem = {
  id: string;
  title: string;
  artist: string;
  venue: string;
  address: string;
  city: string;
  date: string;
  dayMonth: { day: string; month: string };
  time: string;
  genre: string;
  priceFrom: number;
  blurb: string;
  tone: "espresso" | "clay" | "olive";
  badge?: string;
  image: string;
  interestedCount: string;
  soldPercentage: number;
  promoter: string;
  lineup: string[];
  ticketTiers: TicketTier[];
  rundown: { time: string; act: string }[];
};

const CATEGORIES: { label: Category; icon: JSX.Element }[] = [
  { label: "Musik & Konser", icon: <IconMusic /> },
  { label: "Festival Musik", icon: <IconSparkles /> },
  { label: "Hiburan & Pertunjukan", icon: <IconMask /> },
  { label: "Wisata & Outdoor", icon: <IconCompass /> },
  { label: "Olahraga & E-Sport", icon: <IconSun /> },
  { label: "Amal & Charity", icon: <IconHeart /> },
  { label: "Seni & Budaya", icon: <IconPalette /> },
  { label: "Stand-up Comedy", icon: <IconMic /> },
  { label: "Atraksi & Wahana", icon: <IconPin /> },
];

const HERO_SLIDES = [
  {
    id: "hero-1",
    eventId: "senja-orchestra",
    title: "Senja Symphony & Orchestra Fest 2026",
    subtitle: "Harmoni 60 Musisi Orkestra & Kolaborasi Vokalis Pilihan Nusantara",
    artist: "Kala Senja feat. Jakarta City Strings",
    venue: "Istora Senayan, Jakarta",
    date: "12 Sep 2026",
    time: "19:00 WIB",
    tag: "PANGGUNG UTAMA · BEST SELLER",
    price: 250000,
    image: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?q=80&w=1600&auto=format&fit=crop",
    gradient: "from-[#3a1c0f]/90 via-[#241209]/80 to-[#120a05]/95",
  },
  {
    id: "hero-2",
    eventId: "ombak-festival",
    title: "Ombak Nusantara Beach Festival 2026",
    subtitle: "Tiga Hari Penuh Musik Indie, 4 Panggung Sunset Tepi Laut Bali",
    artist: "Deretan 24 Musisi Indie Pesisir",
    venue: "GWK Cultural Park & Pantai Karang, Bali",
    date: "20 - 22 Sep 2026",
    time: "15:00 WITA",
    tag: "FESTIVAL RESMI · EARLY BIRD",
    price: 180000,
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1600&auto=format&fit=crop",
    gradient: "from-[#1b2d28]/90 via-[#0f1f1a]/85 to-[#0a1210]/95",
  },
  {
    id: "hero-3",
    eventId: "neon-dangdut",
    title: "Neon Koplo & Pop Carnival Vol. 4",
    subtitle: "Goyang Berkelas Tanpa Henti dengan Tata Cahaya Laser Spektakuler",
    artist: "Rafi & The Koplo Machine feat. Star Guests",
    venue: "Eldorado Dome, Bandung",
    date: "10 Okt 2026",
    time: "20:00 WIB",
    tag: "TRENDING #1 · HAMPIR HABIS",
    price: 100000,
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1600&auto=format&fit=crop",
    gradient: "from-[#2f1938]/90 via-[#1e0f24]/85 to-[#0d0710]/95",
  },
];

const EVENTS: EventItem[] = [
  {
    id: "senja-orchestra",
    title: "Senja Symphony Orchestra",
    artist: "Kala Senja & String Ensemble",
    venue: "Istora Senayan",
    address: "Jl. Pintu Satu Senayan, Gelora, Tanah Abang, Jakarta Pusat",
    city: "Jakarta",
    date: "12 Sep 2026",
    dayMonth: { day: "12", month: "SEP" },
    time: "19:00 WIB",
    genre: "Orkestra",
    priceFrom: 250000,
    blurb:
      "Perpaduan vokal memikat dan harmoni kayu akustik yang hangat. Siap-siap larut dalam suasana malam syahdu nan megah.",
    tone: "espresso",
    badge: "Terlaris",
    image: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?q=80&w=800&auto=format&fit=crop",
    interestedCount: "2.4k peminat",
    soldPercentage: 88,
    promoter: "Kala Harmony Live",
    lineup: ["Kala Senja", "Jakarta City Strings", "Aditya Nugraha (Violin)", "Vocal Quartet"],
    ticketTiers: [
      { name: "VVIP (Front Row + Merch)", price: 750000, perks: ["Kursi nomor baris 1-3", "Goodie bag eksklusif", "Fast-track gate"], status: "Sisa Sedikit" },
      { name: "VIP (Numbered Seating)", price: 450000, perks: ["Kursi nomor tengah", "Pandangan panggung lurus"], status: "Tersedia" },
      { name: "Reguler Tribune", price: 250000, perks: ["Free seating tribun", "Akses semua booth"], status: "Tersedia" },
    ],
    rundown: [
      { time: "17:00 WIB", act: "Open Gate & Penukaran Wristband" },
      { time: "18:30 WIB", act: "Orchestral Prelude by City Strings" },
      { time: "19:30 WIB", act: "Main Performance: Kala Senja & Ensemble" },
      { time: "21:30 WIB", act: "Encore & Sesi Dokumentasi" },
    ],
  },
  {
    id: "ombak-festival",
    title: "Ombak Nusantara Festival",
    artist: "24 Musisi Indie Pesisir",
    venue: "Pantai Karang Beach Club",
    address: "Jl. Pantai Karang No. 88, Sanur, Denpasar Selatan, Bali",
    city: "Bali",
    date: "20 Sep 2026",
    dayMonth: { day: "20", month: "SEP" },
    time: "16:00 WITA",
    genre: "Indie & Alternative",
    priceFrom: 180000,
    blurb:
      "Festival musik tepi pantai dengan lima panggung dan sunset terbaik se-Bali. Bawa sandal santai, tinggalkan segala beban penat.",
    tone: "clay",
    badge: "Promo",
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800&auto=format&fit=crop",
    interestedCount: "3.8k peminat",
    soldPercentage: 75,
    promoter: "Pesisir Soundwave",
    lineup: ["Fourtwnty", "The Panturas", "Dialog Dini Hari", "Danilla", "Barasuara"],
    ticketTiers: [
      { name: "3-Day Pass VIP", price: 550000, perks: ["Akses 3 hari penuh", "VIP Sunset Deck", "Minuman selamat datang"], status: "Tersedia" },
      { name: "Single Day Pass", price: 180000, perks: ["Akses 1 hari bebas pilih", "Festival ground"], status: "Tersedia" },
      { name: "Early Bird 3-Day", price: 150000, perks: ["Akses 3 hari", "Harga promo perdana"], status: "Habis" },
    ],
    rundown: [
      { time: "15:00 WITA", act: "Gate Open & Beach Market Activation" },
      { time: "16:30 WITA", act: "Sunset Stage: Akustik & Ambient" },
      { time: "19:00 WITA", act: "Main Beach Stage Performances" },
      { time: "23:00 WITA", act: "After-party DJ Sessions" },
    ],
  },
  {
    id: "kota-tua-jazz",
    title: "Kota Tua Jazz & Soul Night",
    artist: "Ardan Quartet feat. Nadia Ayu",
    venue: "Taman Fatahillah",
    address: "Kawasan Kota Tua, Pinangsia, Tamansari, Jakarta Barat",
    city: "Jakarta",
    date: "27 Sep 2026",
    dayMonth: { day: "27", month: "SEP" },
    time: "18:30 WIB",
    genre: "Jazz",
    priceFrom: 150000,
    blurb:
      "Alunan jazz klasik di tengah arsitektur gedung tua bersejarah. Duduk santai, nikmati kopi hangat, dan biarkan nada trompet bicara.",
    tone: "olive",
    badge: "Intimate",
    image: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=800&auto=format&fit=crop",
    interestedCount: "1.2k peminat",
    soldPercentage: 92,
    promoter: "Heritage Jazz Movement",
    lineup: ["Ardan Quartet", "Nadia Ayu", "Monita Tahalea", "Barry Likumahuwa Bass Project"],
    ticketTiers: [
      { name: "Jazz Table VIP (Termasuk Kopi & Snack)", price: 320000, perks: ["Meja nomor reservasi", "Artisan coffee", "CD Eksklusif"], status: "Sisa Sedikit" },
      { name: "General Admission", price: 150000, perks: ["Akses area panggung utama"], status: "Tersedia" },
    ],
    rundown: [
      { time: "17:30 WIB", act: "Open Gate & Heritage Walk" },
      { time: "18:30 WIB", act: "Opening Act by Youth Brass Band" },
      { time: "20:00 WIB", act: "Ardan Quartet feat. Nadia Ayu" },
      { time: "22:00 WIB", act: "Jam Session Kolaboratif" },
    ],
  },
  {
    id: "gema-rimba",
    title: "Gema Rimba Folk Festival",
    artist: "Hutan Bernyanyi Collective",
    venue: "Taman Hutan Raya Juanda",
    address: "Jl. Ir. H. Juanda No.99, Ciburial, Cimenyan, Bandung",
    city: "Bandung",
    date: "3 Okt 2026",
    dayMonth: { day: "03", month: "OKT" },
    time: "17:00 WIB",
    genre: "Folk & Akustik",
    priceFrom: 120000,
    blurb:
      "Panggung akustik magis di antara pepohonan pinus berkabut. Cocok buat kamu yang merindukan udara sejuk dan petikan gitar lembut.",
    tone: "espresso",
    badge: "Outdoor",
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop",
    interestedCount: "1.9k peminat",
    soldPercentage: 80,
    promoter: "Rimba Echo Creative",
    lineup: ["Banda Neira Legacy", "Nadin Amizah", "Fiersa Besari", "Iksan Skuter"],
    ticketTiers: [
      { name: "Picnic VIP (Termasuk Tiket + Alas Duduk)", price: 280000, perks: ["Matras piknik kayu", "Paket teh rempah", "Area depan panggung"], status: "Tersedia" },
      { name: "Reguler Pine Area", price: 120000, perks: ["Akses area hutan", "Bebas pilih spot"], status: "Tersedia" },
    ],
    rundown: [
      { time: "15:00 WIB", act: "Open Gate & Nature Workshop" },
      { time: "17:00 WIB", act: "Acoustic Sunset Sessions" },
      { time: "19:00 WIB", act: "Hutan Bernyanyi Showcase" },
    ],
  },
  {
    id: "neon-dangdut",
    title: "Neon Dangdut Koplo Party",
    artist: "Rafi & The Koplo Machine",
    venue: "GOR C-Tra Arena",
    address: "Jl. Cikutra No. 278, Cibeunying Kidul, Bandung",
    city: "Bandung",
    date: "10 Okt 2026",
    dayMonth: { day: "10", month: "OKT" },
    time: "20:00 WIB",
    genre: "Dangdut & Koplo",
    priceFrom: 100000,
    blurb:
      "Goyang sampai subuh dengan remix koplo modern dan tata laser canggih. Sound system menggelegar tanpa kompromi.",
    tone: "clay",
    badge: "Hot",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800&auto=format&fit=crop",
    interestedCount: "4.5k peminat",
    soldPercentage: 95,
    promoter: "Koplo Rave Indonesia",
    lineup: ["Rafi & The Koplo Machine", "Feel Koplo", "NDX AKA", "Guyon Waton"],
    ticketTiers: [
      { name: "VIP Mosh Front", price: 220000, perks: ["Barikade panggung depan", "Luminous glow stick", "Stiker pack"], status: "Sisa Sedikit" },
      { name: "Festival Goyang", price: 100000, perks: ["General admission standing area"], status: "Tersedia" },
    ],
    rundown: [
      { time: "18:00 WIB", act: "Open Gate & DJ Pemanasan" },
      { time: "20:00 WIB", act: "Live Koplo Nonstop Part 1" },
      { time: "22:00 WIB", act: "Grand Jam Goyang Bersama" },
    ],
  },
  {
    id: "bianglala-pop",
    title: "Bianglala Mega Pop Fest",
    artist: "5 Headliner Pop Nasional",
    venue: "Stadion Madya Senayan",
    address: "Gelora Bung Karno Sports Complex, Senayan, Jakarta Pusat",
    city: "Jakarta",
    date: "18 Okt 2026",
    dayMonth: { day: "18", month: "OKT" },
    time: "15:00 WIB",
    genre: "Pop",
    priceFrom: 320000,
    blurb:
      "Festival akbar parade hits pop Indonesia. Bernyanyi serentak dari lagu pembuka hingga kembang api penutup spektakuler.",
    tone: "olive",
    badge: "Favorit",
    image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=800&auto=format&fit=crop",
    interestedCount: "5.1k peminat",
    soldPercentage: 84,
    promoter: "Nusantara Pop Live",
    lineup: ["Tulus", "Raisa", "Yura Yunita", "Kunto Aji", "Hindia"],
    ticketTiers: [
      { name: "Diamond VIP Numbered", price: 850000, perks: ["Tempat duduk terbaik", "Exclusive lanyard", "Lounge VIP"], status: "Tersedia" },
      { name: "Festival Gold", price: 480000, perks: ["Standing area dekat panggung"], status: "Tersedia" },
      { name: "Tribune CAT 1", price: 320000, perks: ["Tribun bertingkat atap"], status: "Tersedia" },
    ],
    rundown: [
      { time: "13:00 WIB", act: "Open Gate Festival Area" },
      { time: "15:30 WIB", act: "Artist 1 & 2 Live Show" },
      { time: "18:30 WIB", act: "Break & Acoustic Showcase" },
      { time: "19:30 WIB", act: "Main Headliners Concert" },
      { time: "22:45 WIB", act: "Fireworks Finale" },
    ],
  },
  {
    id: "malam-metal",
    title: "Malam Metal Raya 2026",
    artist: "Serigala Baja & Bintang Tamu",
    venue: "Eldorado Dome",
    address: "Jl. Dr. Setiabudi No. 438, Isola, Sukasari, Bandung",
    city: "Bandung",
    date: "24 Okt 2026",
    dayMonth: { day: "24", month: "OKT" },
    time: "19:30 WIB",
    genre: "Rock & Metal",
    priceFrom: 140000,
    blurb:
      "Mosh pit paling bertenaga tahun ini. Tiga band cadas legendaris satu panggung dengan dentuman drum menggetarkan dada.",
    tone: "espresso",
    badge: "Headbang",
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800&auto=format&fit=crop",
    interestedCount: "2.1k peminat",
    soldPercentage: 70,
    promoter: "Distorsi Hitam Prod.",
    lineup: ["Serigala Baja", "Burgerkill Legacy", "Deadsquad", "Seringai"],
    ticketTiers: [
      { name: "Moshpit Circle Pass", price: 250000, perks: ["Akses pit depan", "Kaos resmi festival", "Poster bertandatangan"], status: "Tersedia" },
      { name: "General Admission", price: 140000, perks: ["Akses arena konser"], status: "Tersedia" },
    ],
    rundown: [
      { time: "18:00 WIB", act: "Open Gate & Merchandise Booth" },
      { time: "19:30 WIB", act: "Opening Act Metalcore" },
      { time: "20:30 WIB", act: "Main Set: Serigala Baja" },
    ],
  },
  {
    id: "akustik-senyap",
    title: "Akustik di Senyap — Intimate",
    artist: "Larasati & Sahabat",
    venue: "Rooftop Kopi Manja",
    address: "Jl. Kaliurang KM 5.5, Manggung, Caturtunggal, Sleman, Yogyakarta",
    city: "Yogyakarta",
    date: "1 Nov 2026",
    dayMonth: { day: "01", month: "NOV" },
    time: "19:00 WIB",
    genre: "Folk & Akustik",
    priceFrom: 95000,
    blurb:
      "Konser intim hanya 200 penonton di rooftop beratapkan bintang. Petikan dawai gitar lembut menemani secangkir kopi hangat.",
    tone: "clay",
    badge: "Sisa Sedikit",
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop",
    interestedCount: "980 peminat",
    soldPercentage: 94,
    promoter: "Kopi & Nada Senyap",
    lineup: ["Larasati", "Duo Suara Hujan", "Ari & Gitar"],
    ticketTiers: [
      { name: "Single Seat + Coffee & Pastry", price: 95000, perks: ["1 Kursi teratur", "Pilihan minuman kopi", "Kue camilan"], status: "Sisa Sedikit" },
    ],
    rundown: [
      { time: "18:30 WIB", act: "Open Gate & Welcome Drink" },
      { time: "19:30 WIB", act: "Sesi Cerita & Lagu Larasati" },
      { time: "21:30 WIB", act: "Obrolan Santai Bareng Artis" },
    ],
  },
  {
    id: "ritme-nusantara",
    title: "Ritme Nusantara Fusion",
    artist: "Gamelan Contemporary Orchestra",
    venue: "Taman Budaya Surakarta",
    address: "Jl. Ir. Sutami No.57, Jebres, Kec. Jebres, Kota Surakarta, Jawa Tengah",
    city: "Solo",
    date: "8 Nov 2026",
    dayMonth: { day: "08", month: "NOV" },
    time: "18:00 WIB",
    genre: "Tradisional & Fusion",
    priceFrom: 110000,
    blurb:
      "Gamelan pusaka berpadu synth elektrik dan drum dinamis. Eksperimen bunyi adiluhung yang menghormati akar tradisi leluhur.",
    tone: "olive",
    badge: "Budaya",
    image: "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?q=80&w=800&auto=format&fit=crop",
    interestedCount: "1.4k peminat",
    soldPercentage: 68,
    promoter: "Dinas Seni Budaya Surakarta",
    lineup: ["Gamelan Contemporary Orchestra", "Kua Etnika", "SambaSunda"],
    ticketTiers: [
      { name: "VIP Pendopo Depan", price: 220000, perks: ["Tempat duduk utama", "Souvenir wayang mini"], status: "Tersedia" },
      { name: "Reguler Lesehan", price: 110000, perks: ["Area lesehan karpet beludru"], status: "Tersedia" },
    ],
    rundown: [
      { time: "17:00 WIB", act: "Pameran Instrumen Tradisional" },
      { time: "18:30 WIB", act: "Tembang Pembuka & Tari Sambutan" },
      { time: "19:30 WIB", act: "Gamelan Fusion Grand Symphony" },
    ],
  },
  {
    id: "surabaya-indie-wave",
    title: "Surabaya Indie Wave Fest",
    artist: "Kuartet Malam & Musisi Lokal",
    venue: "Grand City Convention",
    address: "Jl. Walikota Mustajab No.1, Ketabang, Genteng, Surabaya",
    city: "Surabaya",
    date: "15 Nov 2026",
    dayMonth: { day: "15", month: "NOV" },
    time: "17:30 WIB",
    genre: "Indie & Alternative",
    priceFrom: 135000,
    blurb:
      "Gairah musik alternatif kota pahlawan. Dentuman drum cepat, lirik puitis, dan paduan suara penonton tanpa batas.",
    tone: "espresso",
    badge: "Pilihan",
    image: "https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=800&auto=format&fit=crop",
    interestedCount: "2.8k peminat",
    soldPercentage: 77,
    promoter: "East Wave Organizer",
    lineup: ["Kuartet Malam", "Silampukau", "Heavy Monster", "Grrrl Gang"],
    ticketTiers: [
      { name: "VIP Backstage Access", price: 350000, perks: ["Meet & Greet", "Akses pit depan", "Poster bertandatangan"], status: "Tersedia" },
      { name: "Festival Pass", price: 135000, perks: ["General admission"], status: "Tersedia" },
    ],
    rundown: [
      { time: "16:30 WIB", act: "Open Gate" },
      { time: "17:30 WIB", act: "Opening Session" },
      { time: "19:30 WIB", act: "Main Indie Acts" },
    ],
  },
  {
    id: "jogja-retro-groove",
    title: "Jogja Retro Soul & Groove",
    artist: "The Vintage Soul Project",
    venue: "Jogja Expo Center (JEC)",
    address: "Jl. Raya Janti, Wonocatur, Banguntapan, Bantul, Yogyakarta",
    city: "Yogyakarta",
    date: "22 Nov 2026",
    dayMonth: { day: "22", month: "NOV" },
    time: "18:30 WIB",
    genre: "Jazz",
    priceFrom: 125000,
    blurb:
      "Dansa bernostalgia bersama irama funk, disco soul, dan city-pop era 80-an yang dibawakan live dengan instrumen tiup lengkap.",
    tone: "clay",
    badge: "Spesial",
    image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?q=80&w=800&auto=format&fit=crop",
    interestedCount: "1.6k peminat",
    soldPercentage: 72,
    promoter: "Jogja Groove Union",
    lineup: ["The Vintage Soul Project", "Diskoria", "Mocca", "White Shoes & The Couples Company"],
    ticketTiers: [
      { name: "VIP Groove Floor", price: 290000, perks: ["Akses lantai dansa terdepan", "Cocktail/Mocktail gratis"], status: "Tersedia" },
      { name: "Reguler Pass", price: 125000, perks: ["Akses konser umum"], status: "Tersedia" },
    ],
    rundown: [
      { time: "17:00 WIB", act: "Open Gate & Retro Costume Contest" },
      { time: "18:30 WIB", act: "Funk DJ Opening" },
      { time: "20:00 WIB", act: "The Vintage Soul Live Set" },
    ],
  },
  {
    id: "medan-sound-explosion",
    title: "Medan Sound Explosion",
    artist: "Rockstar Sumatera Union",
    venue: "Lapangan Benteng Medan",
    address: "Jl. Pengadilan, Petisah Tengah, Medan Petisah, Kota Medan",
    city: "Medan",
    date: "29 Nov 2026",
    dayMonth: { day: "29", month: "NOV" },
    time: "19:00 WIB",
    genre: "Rock & Metal",
    priceFrom: 115000,
    blurb:
      "Gemerlap panggung megah berlatar langit malam kota Medan. Nikmati sajian live performance penuh energi membakar akhir pekan.",
    tone: "olive",
    badge: "Energetik",
    image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=800&auto=format&fit=crop",
    interestedCount: "3.1k peminat",
    soldPercentage: 86,
    promoter: "Horas Stage Media",
    lineup: ["Rockstar Sumatera Union", "Jamrud", "Kotak", "Padi Reborn"],
    ticketTiers: [
      { name: "VIP Rocker Front", price: 260000, perks: ["Area barikade depan", "Bandana eksklusif"], status: "Sisa Sedikit" },
      { name: "Festival Lapangan", price: 115000, perks: ["Area festival luas"], status: "Tersedia" },
    ],
    rundown: [
      { time: "16:00 WIB", act: "Open Gate & Food Bazaar" },
      { time: "19:00 WIB", act: "Rock Anthem Opening" },
      { time: "20:30 WIB", act: "Main Performances Nonstop" },
    ],
  },
];

const GENRES = Array.from(new Set(EVENTS.map((e) => e.genre)));
const CITIES = Array.from(new Set(EVENTS.map((e) => e.city)));

const TESTIMONIALS = [
  {
    name: "Dinda Ayu",
    role: "Mahasiswi · Jakarta",
    quote:
      "Beli tiket cuma butuh dua menit, e-tiket resmi langsung masuk email. Nggak perlu cemas kena calo tiket palsu lagi!",
    rating: 5,
  },
  {
    name: "Reza Pratama",
    role: "Karyawan Swasta · Bandung",
    quote:
      "Waktu ada konser diundur jadwalnya, proses refund ditangani sigap dan uang kembali utuh dalam hitungan hari. Jempolan!",
    rating: 5,
  },
  {
    name: "Amel Santoso",
    role: "Content Creator · Bali",
    quote:
      "Suka banget sama fitur filter dan kurasi konsernya. Notifikasi pengingat sebelum hari H ngebantu banget pas jadwal padat.",
    rating: 5,
  },
  {
    name: "Bram Tantular",
    role: "Musisi Indie · Yogyakarta",
    quote:
      "Sebagai musisi, saya apresiasi sistem ticketing ConcertGo yang ramah fans. Harga transparan tanpa biaya tersembunyi.",
    rating: 5,
  },
  {
    name: "Naya Karisma",
    role: "Pecinta Konser · Solo",
    quote:
      "Desain aplikasinya estetik dan navigasinya mulus banget. Checkout tiket pas lagi di jalan pun tetap lancar jaya.",
    rating: 5,
  },
  {
    name: "Fajar Wicaksono",
    role: "Fotografer Event · Surabaya",
    quote:
      "Informasi denah venue dan gate masuk sangat akurat. Bikin penonton tertib dan pengalaman menonton jadi maksimal.",
    rating: 5,
  },
];

const WHY_POINTS = [
  {
    title: "100% Tiket Resmi",
    desc: "Bermitra resmi langsung dengan promotor terpercaya. Dijamin anti calo dan barcode langsung terverifikasi di pintu venue.",
    icon: <IconShieldCheck />,
    stat: "500K+ Tiket Terjual",
  },
  {
    title: "Pembayaran Cepat & Aman",
    desc: "Dukungan QRIS, Virtual Account bank terlengkap, e-Wallet, hingga cicilan kartu kredit dengan enkripsi berstandar perbankan.",
    icon: <IconCreditCard />,
    stat: "Instant Verification",
  },
  {
    title: "Jaminan Perlindungan Pengguna",
    desc: "Bila jadwal acara mengalami perubahan atau pembatalan, jaminan refund mudah dan transparan langsung ke rekeningmu.",
    icon: <IconRefreshCw />,
    stat: "100% Refund Guarantee",
  },
  {
    title: "Layanan Bantuan 24/7",
    desc: "Tim Customer Support siap mendampingi kendala pemesanan, verifikasi data, hingga penukaran tiket kapan saja.",
    icon: <IconHeadphones />,
    stat: "Respons < 5 Menit",
  },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function formatIDR(n: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);
}

const ID_MONTHS: Record<string, number> = {
  Jan: 0, Feb: 1, Mar: 2, Apr: 3, Mei: 4, Jun: 5,
  Jul: 6, Agu: 7, Sep: 8, Okt: 9, Nov: 10, Des: 11,
};

function parseEventDate(dateStr: string): number {
  const parts = dateStr.split(" ");
  const day = parts[0];
  const mon = parts[1];
  const year = parts[2];
  const month = ID_MONTHS[mon] ?? 0;
  const time = new Date(Number(year), month, Number(day)).getTime();
  return Number.isNaN(time) ? 0 : time;
}

function splitMatch(text: string, query: string) {
  if (!query.trim()) return { before: text, match: "", after: "" };
  const i = text.toLowerCase().indexOf(query.trim().toLowerCase());
  if (i === -1) return { before: text, match: "", after: "" };
  return {
    before: text.slice(0, i),
    match: text.slice(i, i + query.trim().length),
    after: text.slice(i + query.trim().length),
  };
}

function Highlighted({ text, query }: { text: string; query: string }) {
  const { before, match, after } = splitMatch(text, query);
  if (!match) return <>{text}</>;
  return (
    <>
      {before}
      <span className="font-semibold text-[#d9691f]">{match}</span>
      {after}
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Landing Page Component                                        */
/* ------------------------------------------------------------------ */

export default function ConcertGoLandingPage() {
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState<string>("Semua Genre");
  const [city, setCity] = useState<string>("Semua Kota");
  const [sort, setSort] = useState<string>("Tanggal terdekat");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [promoIndex, setPromoIndex] = useState(0);

  // States for modals
  const [selectedEventForDetail, setSelectedEventForDetail] = useState<EventItem | null>(null);
  const [selectedEventForLogin, setSelectedEventForLogin] = useState<EventItem | null>(null);

  const filtered = useMemo(() => {
    return EVENTS.filter((e) => {
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        e.title.toLowerCase().includes(q) ||
        e.artist.toLowerCase().includes(q) ||
        e.city.toLowerCase().includes(q) ||
        e.venue.toLowerCase().includes(q);
      const matchesGenre = genre === "Semua Genre" || e.genre === genre;
      const matchesCity = city === "Semua Kota" || e.city === city;
      return matchesQuery && matchesGenre && matchesCity;
    }).sort((a, b) => {
      if (sort === "Harga terendah") return a.priceFrom - b.priceFrom;
      if (sort === "Harga tertinggi") return b.priceFrom - a.priceFrom;
      return parseEventDate(a.date) - parseEventDate(b.date);
    });
  }, [query, genre, city, sort]);

  const recommended = filtered.slice(0, 4);
  const popular = filtered.slice(2, 6).length ? filtered.slice(2, 6) : filtered.slice(0, 4);
  const mostLiked = filtered.slice(4, 8).length ? filtered.slice(4, 8) : filtered.slice(0, 4);

  function toggleFavorite(id: string) {
    setFavorites((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function jumpToResults() {
    document.getElementById("konser")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div id="top" className="min-h-screen bg-[#f6efe1] font-[var(--font-body,ui-sans-serif)] text-[#241608] selection:bg-[#d9691f] selection:text-white">
      <SiteHeader />

      <main>
        {/* Hero Banner Carousel dengan Foto Panggung Nyata */}
        <HeroCarousel
          index={promoIndex}
          setIndex={setPromoIndex}
          onOpenDetail={(ev) => setSelectedEventForDetail(ev)}
        />

        {/* Rail Kategori Interaktif */}
        <CategoryRail />

        {/* Bar Pencarian & Filter */}
        <SearchHero
          query={query}
          setQuery={setQuery}
          genre={genre}
          setGenre={setGenre}
          city={city}
          setCity={setCity}
          sort={sort}
          setSort={setSort}
          resultCount={filtered.length}
          onSubmit={jumpToResults}
        />

        {/* Tampilan Visual Event Konser (Dengan Poster & Detail Interaktif) */}
        <div id="konser" className="space-y-8">
          <EventSection
            id="rekomendasi"
            title="Rekomendasi Konser Pilihan"
            subtitle="Konser terbaik dengan animo penonton tertinggi yang paling direkomendasikan kurator kami."
            events={recommended}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            onOpenDetail={(ev) => setSelectedEventForDetail(ev)}
            onBuyTicket={(ev) => setSelectedEventForLogin(ev)}
          />

          <EventSection
            id="populer"
            title="Konser Paling Populer"
            subtitle="Jadwal konser dengan penjualan tiket paling cepat habis di berbagai kota besar."
            events={popular}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            onOpenDetail={(ev) => setSelectedEventForDetail(ev)}
            onBuyTicket={(ev) => setSelectedEventForLogin(ev)}
          />

          <EventSection
            id="disukai"
            title="Paling Banyak Difavoritkan"
            subtitle="Daftar penampilan musik dengan rating ulasan tertinggi dan komentar paling positif."
            events={mostLiked}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            onOpenDetail={(ev) => setSelectedEventForDetail(ev)}
            onBuyTicket={(ev) => setSelectedEventForLogin(ev)}
          />
        </div>

        {/* Banner Promo & Voucher Diskon */}
        <AnnouncementBanner />

        {/* Marquee Komentar & Ulasan Pengguna */}
        <TestimonialMarquee />

        {/* Keunggulan Layanan ConcertGo */}
        <WhyConcertGo />

        {/* Banner Ajakan Registrasi Khusus Tamu */}
        <GuestRegistrationCTA />
      </main>

      <SiteFooter />

      {/* Modal Detail Event Interaktif (Tampilan Event Lengkap) */}
      <AnimatePresence>
        {selectedEventForDetail && (
          <EventDetailModal
            event={selectedEventForDetail}
            onClose={() => setSelectedEventForDetail(null)}
            onBuyClick={(ev) => {
              setSelectedEventForDetail(null);
              setSelectedEventForLogin(ev);
            }}
          />
        )}
      </AnimatePresence>

      {/* Modal Prompt Login Ketika Pengguna Ingin Checkout */}
      <AnimatePresence>
        {selectedEventForLogin && (
          <LoginPromptModal
            event={selectedEventForLogin}
            onClose={() => setSelectedEventForLogin(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Header                                                             */
/* ------------------------------------------------------------------ */

const NAV_LINKS = [
  { label: "Home", targetId: "top" },
  { label: "Konser", targetId: "konser" },
  { label: "Rekomendasi", targetId: "rekomendasi" },
  { label: "Komentar", targetId: "komentar" },
  { label: "Keunggulan", targetId: "keunggulan" },
];

function SiteHeader() {
  const [active, setActive] = useState("Home");

  function handleNavClick(label: string, targetId: string) {
    setActive(label);
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-0 z-30 border-b border-[#e6d9bf] bg-[#f6efe1]/95 backdrop-blur shadow-xs"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick("Home", "top");
          }}
          className="group flex items-center gap-2.5 transition-transform hover:scale-105"
        >
          <img src="/image/Logo.png" alt="ConcertGo" className="h-8 w-auto" />
          <span className="font-[var(--font-display,serif)] text-xl font-bold tracking-tight text-[#241608]">
            <span>Concert</span>
            <span className="text-[#d9691f]">Go</span>
          </span>
        </a>

        <nav className="hidden items-center gap-8 text-sm font-medium text-[#4a3a26] md:flex">
          {NAV_LINKS.map(({ label, targetId }) => (
            <a
              key={label}
              href={`#${targetId}`}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(label, targetId);
              }}
              className={`relative py-1 transition-colors hover:text-[#d9691f] ${
                active === label ? "text-[#241608] font-semibold" : ""
              }`}
            >
              {label}
              {active === label && (
                <motion.span
                  layoutId="activeNavIndicator"
                  className="absolute -bottom-[17px] left-0 right-0 h-[2.5px] rounded-full bg-[#d9691f]"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/Sign-in"
            className="rounded-full border border-[#d9691f]/40 px-4 py-1.5 text-xs font-semibold text-[#4a3a26] transition-all hover:border-[#d9691f] hover:bg-[#efe4cf]/50 sm:text-sm sm:px-5 sm:py-2"
          >
            Masuk
          </Link>

          <Link
            href="/Sign-up"
            className="rounded-full bg-[#241608] px-4 py-1.5 text-xs font-semibold text-[#f6efe1] shadow-xs transition-transform hover:scale-105 active:scale-95 sm:text-sm sm:px-5 sm:py-2"
          >
            Daftar Akun
          </Link>
        </div>
      </div>
    </motion.header>
  );
}

/* ------------------------------------------------------------------ */
/*  Hero Carousel (Visual Poster Panggung)                             */
/* ------------------------------------------------------------------ */

function HeroCarousel({
  index,
  setIndex,
  onOpenDetail,
}: {
  index: number;
  setIndex: React.Dispatch<React.SetStateAction<number>>;
  onOpenDetail: (event: EventItem) => void;
}) {
  const currentSlide = HERO_SLIDES[index % HERO_SLIDES.length];

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [setIndex]);

  const activeEvent = EVENTS.find((e) => e.id === currentSlide.eventId) ?? EVENTS[0];

  return (
    <section className="mx-auto max-w-7xl px-6 pt-8 pb-4">
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.85fr_1fr]">
        {/* Main Slide Card dengan Foto Latar */}
        <div className="relative min-h-[360px] overflow-hidden rounded-3xl bg-[#120a05] p-7 text-[#f6efe1] shadow-xl md:min-h-[400px] md:p-9 flex flex-col justify-between">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide.id}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="absolute inset-0 -z-10"
            >
              <img
                src={currentSlide.image}
                alt={currentSlide.title}
                className="h-full w-full object-cover"
              />
              <div className={`absolute inset-0 bg-gradient-to-r ${currentSlide.gradient}`} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            </motion.div>
          </AnimatePresence>

          {/* Top meta */}
          <div className="relative z-10 flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-black/40 px-3.5 py-1 text-xs font-semibold tracking-wider text-[#d9a26a] backdrop-blur-md border border-white/10">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#d9691f]" />
              {currentSlide.tag}
            </span>
            <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
              Mulai {formatIDR(currentSlide.price)}
            </span>
          </div>

          {/* Main Title & Artist */}
          <div className="relative z-10 my-auto py-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide.id + "-text"}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
              >
                <h2 className="font-[var(--font-display,serif)] text-2xl font-bold leading-tight md:text-4xl lg:text-[40px]">
                  {currentSlide.title}
                </h2>
                <p className="mt-2.5 max-w-lg text-sm text-[#e8dcc4] md:text-base">
                  {currentSlide.subtitle}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium text-[#f6efe1]/80">
                  <span className="flex items-center gap-1.5">
                    <IconPinSmall /> {currentSlide.venue}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <IconClock /> {currentSlide.date} · {currentSlide.time}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bottom actions & indicators */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/20">
            <div className="flex items-center gap-2">
              <button
                aria-label="Sebelumnya"
                onClick={() => setIndex((i) => (i - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-all hover:scale-110 hover:bg-black/60 active:scale-95"
              >
                ‹
              </button>
              <button
                aria-label="Selanjutnya"
                onClick={() => setIndex((i) => (i + 1) % HERO_SLIDES.length)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-all hover:scale-110 hover:bg-black/60 active:scale-95"
              >
                ›
              </button>

              <div className="ml-3 flex gap-2">
                {HERO_SLIDES.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setIndex(i)}
                    aria-label={`Slide ${i + 1}`}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      i === index % HERO_SLIDES.length ? "w-8 bg-[#d9691f]" : "w-2 bg-white/40 hover:bg-white/60"
                    }`}
                  />
                ))}
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => onOpenDetail(activeEvent)}
              className="inline-flex items-center gap-2 rounded-full bg-[#d9691f] px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-[#d9691f]/30 transition-colors hover:bg-[#c45c16] sm:text-sm"
            >
              <IconTicketSmall /> Lihat Detail & Tiket
            </motion.button>
          </div>
        </div>

        {/* Side Mosaic Cards (Dummy Live Highlights) */}
        <div className="grid grid-rows-2 gap-4">
          <motion.div
            whileHover={{ y: -3 }}
            transition={{ duration: 0.2 }}
            className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-[#e6d9bf] bg-[#241209] p-6 text-white shadow-md"
          >
            <img
              src={EVENTS[2].image}
              alt={EVENTS[2].title}
              className="absolute inset-0 h-full w-full object-cover opacity-35 transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#241209] via-[#241209]/80 to-transparent" />

            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-[#d9691f] px-2.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                  🔥 Trending Pekan Ini
                </span>
                <span className="text-xs font-bold text-[#f6efe1]">Rp 150.000</span>
              </div>
              <h3 className="mt-3 font-[var(--font-display,serif)] text-lg font-bold">
                {EVENTS[2].title}
              </h3>
              <p className="mt-1 text-xs text-[#c4b59d] line-clamp-2">
                Suasana syahdu gedung tua ditemani aransemen jazz romantis musisi ibukota.
              </p>
            </div>

            <div className="relative z-10 mt-4 flex items-center justify-between pt-2 border-t border-white/20 text-xs text-[#c4b59d]">
              <span>Taman Fatahillah · Jakarta</span>
              <button
                onClick={() => onOpenDetail(EVENTS[2])}
                className="font-semibold text-white hover:text-[#d9a26a] hover:underline"
              >
                Lihat Acara →
              </button>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -3 }}
            transition={{ duration: 0.2 }}
            className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-[#e6d9bf] bg-[#1a1208] p-6 text-white shadow-md"
          >
            <img
              src={EVENTS[7].image}
              alt={EVENTS[7].title}
              className="absolute inset-0 h-full w-full object-cover opacity-35 transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a1208] via-[#1a1208]/80 to-transparent" />

            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-amber-600 px-2.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                  ⚡ Flash Sale H-30
                </span>
                <span className="text-xs font-mono text-amber-300">Hemat 25%</span>
              </div>
              <h3 className="mt-3 font-[var(--font-display,serif)] text-lg font-bold">
                {EVENTS[7].title}
              </h3>
              <p className="mt-1 text-xs text-[#c4b59d] line-clamp-2">
                Konser akustik intim 200 penonton di Rooftop Kopi Manja dengan pemandangan lampu malam kota.
              </p>
            </div>

            <div className="relative z-10 mt-4 flex items-center justify-between pt-2 border-t border-white/20 text-xs text-[#c4b59d]">
              <span>1 Nov 2026 · Jogja</span>
              <button
                onClick={() => onOpenDetail(EVENTS[7])}
                className="font-semibold text-white hover:text-[#d9a26a] hover:underline"
              >
                Lihat Acara →
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Category Rail                                                      */
/* ------------------------------------------------------------------ */

function CategoryRail() {
  const [active, setActive] = useState<Category>("Musik & Konser");

  return (
    <section className="mx-auto max-w-7xl overflow-x-auto px-6 py-8">
      <div className="flex min-w-max items-center justify-start gap-4 pb-2 sm:justify-center">
        {CATEGORIES.map((c, idx) => {
          const isSelected = active === c.label;
          return (
            <motion.button
              key={c.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04, duration: 0.3 }}
              whileHover={{ y: -4, scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setActive(c.label)}
              className={`group flex flex-col items-center gap-2 rounded-2xl p-2.5 transition-colors focus:outline-hidden ${
                isSelected ? "bg-white/80 shadow-xs" : "hover:bg-white/40"
              }`}
            >
              <span
                className={`flex h-13 w-13 items-center justify-center rounded-2xl border transition-all ${
                  isSelected
                    ? "border-[#d9691f] bg-[#d9691f] text-[#f6efe1] shadow-md shadow-[#d9691f]/20"
                    : "border-[#e6d9bf] bg-[#efe4cf] text-[#4a3a26] group-hover:border-[#d9691f] group-hover:bg-[#f6efe1]"
                }`}
              >
                {c.icon}
              </span>
              <span
                className={`text-[12px] font-medium leading-tight ${
                  isSelected ? "font-bold text-[#d9691f]" : "text-[#4a3a26]"
                }`}
              >
                {c.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Search Hero & Live Autocomplete                                    */
/* ------------------------------------------------------------------ */

const MAX_SUGGESTIONS = 6;

type Suggestion = {
  key: string;
  kind: "event" | "city" | "genre";
  label: string;
  meta?: string;
  event?: EventItem;
};

function buildSuggestions(query: string): Suggestion[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const results: Suggestion[] = [];

  for (const e of EVENTS) {
    const hit =
      e.title.toLowerCase().includes(q) ||
      e.artist.toLowerCase().includes(q) ||
      e.venue.toLowerCase().includes(q);
    if (hit) {
      results.push({
        key: `event-${e.id}`,
        kind: "event",
        label: e.title,
        meta: `${e.artist} · ${e.venue}, ${e.city}`,
        event: e,
      });
    }
  }

  for (const c of CITIES) {
    if (c.toLowerCase().includes(q) && !results.some((r) => r.kind === "city" && r.label === c)) {
      const count = EVENTS.filter((e) => e.city === c).length;
      results.push({
        key: `city-${c}`,
        kind: "city",
        label: c,
        meta: `${count} konser tersedia`,
      });
    }
  }

  for (const g of GENRES) {
    if (g.toLowerCase().includes(q)) {
      const count = EVENTS.filter((e) => e.genre === g).length;
      results.push({
        key: `genre-${g}`,
        kind: "genre",
        label: g,
        meta: `${count} konser pilihan`,
      });
    }
  }

  return results.slice(0, MAX_SUGGESTIONS);
}

function SearchHero(props: {
  query: string;
  setQuery: (v: string) => void;
  genre: string;
  setGenre: (v: string) => void;
  city: string;
  setCity: (v: string) => void;
  sort: string;
  setSort: (v: string) => void;
  resultCount: number;
  onSubmit: () => void;
}) {
  const { query, setQuery, genre, setGenre, city, setCity, sort, setSort, resultCount, onSubmit } = props;

  const [isOpen, setIsOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const suggestions = useMemo(() => buildSuggestions(query), [query]);

  useEffect(() => {
    setHighlightIndex(0);
  }, [query]);

  useEffect(() => {
    function handlePointerDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  const showDropdown = isOpen && query.trim().length > 0 && suggestions.length > 0;

  const activeFilterCount = [
    genre !== "Semua Genre",
    city !== "Semua Kota",
    sort !== "Tanggal terdekat",
  ].filter(Boolean).length;

  function resetFilters() {
    setGenre("Semua Genre");
    setCity("Semua Kota");
    setSort("Tanggal terdekat");
  }

  function applySuggestion(s: Suggestion) {
    if (s.kind === "city") {
      setCity(s.label);
      setQuery("");
    } else if (s.kind === "genre") {
      setGenre(s.label);
      setQuery("");
    } else {
      setQuery(s.label);
    }
    setIsOpen(false);
    onSubmit();
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!showDropdown) {
      if (e.key === "Enter") onSubmit();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((i) => (i + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((i) => (i - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      applySuggestion(suggestions[highlightIndex]);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="mx-auto max-w-3xl px-6 pb-12 pt-4 text-center"
    >
      <span className="inline-flex items-center gap-2 rounded-full border border-[#d9691f]/30 bg-[#efe4cf]/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#b5772f]">
        <IconSparklesSmall /> Tiket Resmi · Dijamin Anti Calo
      </span>

      <h1 className="mt-4 font-[var(--font-display,serif)] text-3xl font-bold leading-tight text-[#241608] md:text-5xl">
        Konser Favoritmu, Satu Sentuhan Lagi.
      </h1>
      <p className="mx-auto mt-3 max-w-lg text-sm text-[#5a4a35] md:text-base">
        Eksplorasi ratusan jadwal konser musik, festival akbar, dan tur musisi idola di seluruh Indonesia dengan jaminan tiket resmi 100%.
      </p>

      {/* Input Search Box */}
      <div ref={containerRef} className="relative mx-auto mt-8 max-w-xl">
        <div className="flex items-center gap-2 rounded-full border border-[#e6d9bf] bg-white p-2 pl-5 shadow-md shadow-[#241608]/5 transition-all focus-within:border-[#d9691f] focus-within:ring-2 focus-within:ring-[#d9691f]/20">
          <IconSearch />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder="Cari artis, venue, atau kota (contoh: Jakarta, Senayan, Tulus)..."
            role="combobox"
            aria-expanded={showDropdown}
            aria-controls="search-suggestions"
            className="flex-1 bg-transparent text-sm text-[#241608] placeholder:text-[#8a7a63] focus:outline-hidden"
          />
          {query && (
            <button
              type="button"
              aria-label="Bersihkan pencarian"
              onClick={() => {
                setQuery("");
                setIsOpen(false);
              }}
              className="shrink-0 rounded-full px-2 py-1 text-xs text-[#8a7a63] hover:text-[#241608]"
            >
              ✕
            </button>
          )}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={onSubmit}
            className="rounded-full bg-[#241608] px-5 py-2.5 text-xs font-semibold text-[#f6efe1] transition-colors hover:bg-[#3a2010] sm:text-sm"
          >
            Temukan
          </motion.button>
        </div>

        {/* Live suggestions dropdown */}
        <AnimatePresence>
          {showDropdown && (
            <motion.ul
              id="search-suggestions"
              role="listbox"
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 5, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="absolute left-0 right-0 top-[calc(100%+8px)] z-20 overflow-hidden rounded-2xl border border-[#e6d9bf] bg-white text-left shadow-2xl"
            >
              {suggestions.map((s, i) => (
                <li key={s.key} role="option" aria-selected={i === highlightIndex}>
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onMouseEnter={() => setHighlightIndex(i)}
                    onClick={() => applySuggestion(s)}
                    className={`flex w-full items-center gap-3 px-4 py-3 text-sm transition-colors ${
                      i === highlightIndex ? "bg-[#f6efe1]" : "bg-white hover:bg-[#f6efe1]/50"
                    }`}
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#efe4cf] text-[#8a7a63]">
                      {s.kind === "city" ? <IconPinSmall /> : s.kind === "genre" ? <IconMusicSmall /> : <IconSearchSmall />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[#241608]">
                        <Highlighted text={s.label} query={query} />
                      </span>
                      {s.meta && <span className="block truncate text-xs text-[#8a7a63]">{s.meta}</span>}
                    </span>
                    <span className="shrink-0 rounded-full bg-[#f1e6d0] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#8a7a63]">
                      {s.kind === "city" ? "Kota" : s.kind === "genre" ? "Genre" : "Konser"}
                    </span>
                  </button>
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>

      {/* Filter Chips */}
      <div className="mx-auto mt-5 flex max-w-2xl flex-wrap items-center justify-center gap-2.5 text-xs sm:text-sm">
        <button
          type="button"
          onClick={resetFilters}
          disabled={activeFilterCount === 0}
          className={`flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 font-medium transition-all ${
            activeFilterCount > 0
              ? "border-[#d9691f] bg-[#d9691f] text-white shadow-xs hover:bg-[#c15f1b]"
              : "cursor-default border-[#e6d9bf] bg-white/70 text-[#4a3a26]"
          }`}
        >
          <IconFilter />
          <span>Filter</span>
          {activeFilterCount > 0 && (
            <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-white px-1 text-[10px] font-bold text-[#d9691f]">
              {activeFilterCount}
            </span>
          )}
        </button>

        <select
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          className="rounded-full border border-[#e6d9bf] bg-white/80 px-3.5 py-1.5 text-[#4a3a26] transition-colors focus:border-[#d9691f] focus:outline-hidden"
        >
          <option>Semua Genre</option>
          {GENRES.map((g) => (
            <option key={g}>{g}</option>
          ))}
        </select>

        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="rounded-full border border-[#e6d9bf] bg-white/80 px-3.5 py-1.5 text-[#4a3a26] transition-colors focus:border-[#d9691f] focus:outline-hidden"
        >
          <option>Semua Kota</option>
          {CITIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="rounded-full border border-[#e6d9bf] bg-white/80 px-3.5 py-1.5 text-[#4a3a26] transition-colors focus:border-[#d9691f] focus:outline-hidden"
        >
          <option>Tanggal terdekat</option>
          <option>Harga terendah</option>
          <option>Harga tertinggi</option>
        </select>
      </div>

      <p className="mt-3 text-xs text-[#8a7a63]">
        Menampilkan <span className="font-semibold text-[#241608]">{resultCount}</span> dari {EVENTS.length} konser tersedia
      </p>
    </motion.section>
  );
}

/* ------------------------------------------------------------------ */
/*  Event Section & Dummy Event Visual Cards                           */
/* ------------------------------------------------------------------ */

function EventSection({
  id,
  title,
  subtitle,
  events,
  favorites,
  onToggleFavorite,
  onOpenDetail,
  onBuyTicket,
}: {
  id: string;
  title: string;
  subtitle?: string;
  events: EventItem[];
  favorites: Set<string>;
  onToggleFavorite: (id: string) => void;
  onOpenDetail: (event: EventItem) => void;
  onBuyTicket: (event: EventItem) => void;
}) {
  if (events.length === 0) {
    return (
      <section id={id} className="mx-auto max-w-7xl scroll-mt-24 px-6 py-8">
        <h2 className="font-[var(--font-display,serif)] text-2xl font-bold">{title}</h2>
        <p className="mt-2 text-sm text-[#8a7a63]">
          Belum ada konser yang cocok dengan filter pencarianmu saat ini. Coba ubah kota atau genre.
        </p>
      </section>
    );
  }

  return (
    <section id={id} className="mx-auto max-w-7xl scroll-mt-24 px-6 py-8">
      <div className="mb-6 flex flex-col justify-between gap-1 sm:flex-row sm:items-end">
        <div>
          <h2 className="font-[var(--font-display,serif)] text-2xl font-bold text-[#241608] md:text-3xl">
            {title}
          </h2>
          {subtitle && <p className="mt-1 text-xs text-[#5a4a35] md:text-sm">{subtitle}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {events.map((ev, idx) => (
          <EventCard
            key={ev.id + title}
            event={ev}
            index={idx}
            isFavorite={favorites.has(ev.id)}
            onToggleFavorite={() => onToggleFavorite(ev.id)}
            onOpenDetail={() => onOpenDetail(ev)}
            onBuy={() => onBuyTicket(ev)}
          />
        ))}
      </div>
    </section>
  );
}

function EventCard({
  event,
  index,
  isFavorite,
  onToggleFavorite,
  onOpenDetail,
  onBuy,
}: {
  event: EventItem;
  index: number;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onOpenDetail: () => void;
  onBuy: () => void;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      whileHover={{ y: -6 }}
      className="group flex flex-col overflow-hidden rounded-3xl border border-[#e6d9bf] bg-[#f1e6d0] shadow-sm transition-all duration-300 hover:shadow-xl hover:border-[#d9691f]/50"
    >
      {/* Visual Poster Banner Event */}
      <div className="relative h-48 w-full overflow-hidden bg-[#241209]">
        <img
          src={event.image}
          alt={event.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-108"
        />

        {/* Gradient overlays for contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/50" />

        {/* Top Badges & Calendar Widget */}
        <div className="absolute top-3 inset-x-3 flex items-start justify-between">
          <div className="flex items-center gap-1.5 rounded-xl bg-black/55 px-2.5 py-1 text-center font-mono backdrop-blur-md border border-white/10">
            <span className="text-sm font-black text-white">{event.dayMonth.day}</span>
            <span className="text-[10px] font-bold text-[#d9a26a] uppercase">{event.dayMonth.month}</span>
          </div>

          <div className="flex items-center gap-2">
            {event.badge && (
              <span className="rounded-full bg-[#d9691f] px-2.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider shadow-xs">
                {event.badge}
              </span>
            )}

            <motion.button
              whileTap={{ scale: 0.7 }}
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite();
              }}
              aria-label="Simpan ke favorit"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-base backdrop-blur-md transition-colors hover:bg-black/60"
            >
              <span className={isFavorite ? "text-red-500" : "text-white/80"}>
                {isFavorite ? "❤" : "♡"}
              </span>
            </motion.button>
          </div>
        </div>

        {/* Bottom Tag & Social Proof */}
        <div className="absolute bottom-3 inset-x-3 flex items-center justify-between text-white">
          <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-medium backdrop-blur-md">
            {event.genre}
          </span>
          <span className="text-[10px] text-white/90 font-medium bg-black/40 px-2 py-0.5 rounded-full backdrop-blur-md">
            {event.interestedCount}
          </span>
        </div>
      </div>

      {/* Card Body & Info */}
      <div className="flex flex-1 flex-col justify-between gap-3 p-5">
        <div>
          <div className="cursor-pointer" onClick={onOpenDetail}>
            <h3 className="font-[var(--font-display,serif)] text-lg font-bold leading-snug text-[#241608] hover:text-[#d9691f] transition-colors line-clamp-1">
              {event.title}
            </h3>
            <p className="mt-0.5 text-xs font-semibold text-[#d9691f] line-clamp-1">
              {event.artist}
            </p>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-[#5a4a35] line-clamp-2">
            {event.blurb}
          </p>
        </div>

        <div className="space-y-1.5 pt-1 text-[11px] font-medium text-[#8a7a63]">
          <p className="flex items-center gap-1.5">
            <IconPinSmall />
            <span className="truncate">
              {event.venue}, {event.city}
            </span>
          </p>
          <p className="flex items-center gap-1.5">
            <IconClock />
            <span>
              {event.date} · {event.time}
            </span>
          </p>
        </div>

        {/* Status Penjualan Bar */}
        <div className="space-y-1 pt-1">
          <div className="flex justify-between text-[10px] font-medium text-[#8a7a63]">
            <span>Kuota Tiket</span>
            <span className={event.soldPercentage > 85 ? "text-red-600 font-bold" : "text-[#241608]"}>
              {event.soldPercentage}% Terjual
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#e6d9bf]">
            <div
              className={`h-full rounded-full ${
                event.soldPercentage > 85 ? "bg-red-600" : "bg-[#d9691f]"
              }`}
              style={{ width: `${event.soldPercentage}%` }}
            />
          </div>
        </div>

        {/* Action Bottom */}
        <div className="mt-2 flex items-center justify-between border-t border-[#e6d9bf] pt-3">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-[#8a7a63]">Mulai Dari</p>
            <p className="text-sm font-bold text-[#241608]">{formatIDR(event.priceFrom)}</p>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={onOpenDetail}
              className="rounded-full border border-[#241608]/30 px-3 py-1.5 text-xs font-semibold text-[#241608] transition-colors hover:bg-white/60"
            >
              Detail
            </button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onBuy}
              className="rounded-full bg-[#241608] px-3.5 py-1.5 text-xs font-semibold text-[#f6efe1] shadow-xs transition-colors hover:bg-[#d9691f]"
            >
              Pesan
            </motion.button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

/* ------------------------------------------------------------------ */
/*  Interactive Event Detail Modal (Tampilan Lengkap Dummy Event)      */
/* ------------------------------------------------------------------ */

function EventDetailModal({
  event,
  onClose,
  onBuyClick,
}: {
  event: EventItem;
  onClose: () => void;
  onBuyClick: (event: EventItem) => void;
}) {
  const [selectedTier, setSelectedTier] = useState<TicketTier>(event.ticketTiers[0]);
  const [activeTab, setActiveTab] = useState<"tiket" | "lineup" | "rundown" | "lokasi">("tiket");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      {/* Backdrop blur */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/75 backdrop-blur-sm"
      />

      {/* Modal Box */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 30 }}
        transition={{ type: "spring", damping: 26, stiffness: 340 }}
        className="relative z-10 w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-3xl border border-[#e6d9bf] bg-[#f6efe1] text-[#241608] shadow-2xl"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Tutup detail"
          className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md transition-all hover:bg-black/70 hover:scale-110 active:scale-95"
        >
          ✕
        </button>

        {/* Cover Poster Banner */}
        <div className="relative h-64 w-full overflow-hidden bg-black md:h-72">
          <img src={event.image} alt={event.title} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#f6efe1] via-black/40 to-black/60" />

          {/* Banner Badges */}
          <div className="absolute top-5 left-6 flex items-center gap-2">
            <span className="rounded-full bg-[#d9691f] px-3 py-1 text-xs font-bold text-white uppercase tracking-wider shadow-md">
              {event.genre}
            </span>
            <span className="rounded-full bg-black/40 px-3 py-1 text-xs font-medium text-white backdrop-blur-md border border-white/20">
              Promotor: {event.promoter}
            </span>
          </div>

          <div className="absolute bottom-4 left-6 right-6">
            <h2 className="font-[var(--font-display,serif)] text-2xl font-bold leading-tight text-[#241608] md:text-4xl">
              {event.title}
            </h2>
            <p className="text-sm font-semibold text-[#d9691f] md:text-base">
              {event.artist}
            </p>
          </div>
        </div>

        {/* Event Quick Meta Bar */}
        <div className="mx-6 mt-4 grid grid-cols-2 gap-3 rounded-2xl border border-[#e6d9bf] bg-[#efe4cf]/70 p-4 text-xs md:grid-cols-4 md:text-sm">
          <div>
            <p className="text-[#8a7a63] text-[11px] uppercase tracking-wider font-semibold">Tanggal</p>
            <p className="font-bold text-[#241608] mt-0.5">{event.date}</p>
          </div>
          <div>
            <p className="text-[#8a7a63] text-[11px] uppercase tracking-wider font-semibold">Waktu</p>
            <p className="font-bold text-[#241608] mt-0.5">{event.time}</p>
          </div>
          <div>
            <p className="text-[#8a7a63] text-[11px] uppercase tracking-wider font-semibold">Venue</p>
            <p className="font-bold text-[#241608] mt-0.5 truncate">{event.venue}</p>
          </div>
          <div>
            <p className="text-[#8a7a63] text-[11px] uppercase tracking-wider font-semibold">Status Tiket</p>
            <p className="font-bold text-[#d9691f] mt-0.5">{event.soldPercentage}% Terjual</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#e6d9bf] px-6 mt-6 gap-6 text-sm font-semibold">
          {[
            { id: "tiket", label: "Pilihan Tiket" },
            { id: "lineup", label: "Lineup & Artis" },
            { id: "rundown", label: "Jadwal Rundown" },
            { id: "lokasi", label: "Venue & Aturan" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`pb-3 relative transition-colors ${
                activeTab === tab.id ? "text-[#d9691f]" : "text-[#5a4a35] hover:text-[#241608]"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.span
                  layoutId="tabUnderline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#d9691f]"
                />
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === "tiket" && (
            <div className="space-y-4">
              <p className="text-xs text-[#5a4a35]">
                Pilih kategori tiket yang ingin kamu pesan. Setiap akun maksimal membeli 4 tiket resmi.
              </p>

              <div className="space-y-3">
                {event.ticketTiers.map((tier) => {
                  const isSelected = selectedTier?.name === tier.name;
                  const isSoldOut = tier.status === "Habis";
                  return (
                    <div
                      key={tier.name}
                      onClick={() => !isSoldOut && setSelectedTier(tier)}
                      className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border p-4 transition-all ${
                        isSoldOut
                          ? "opacity-50 cursor-not-allowed bg-neutral-200 border-neutral-300"
                          : isSelected
                          ? "border-[#d9691f] bg-white ring-2 ring-[#d9691f]/30 shadow-md cursor-pointer"
                          : "border-[#e6d9bf] bg-white/70 hover:bg-white cursor-pointer"
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-[#241608]">{tier.name}</span>
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                              tier.status === "Habis"
                                ? "bg-red-100 text-red-700"
                                : tier.status === "Sisa Sedikit"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-emerald-100 text-emerald-800"
                            }`}
                          >
                            {tier.status}
                          </span>
                        </div>
                        <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#5a4a35]">
                          {tier.perks.map((p) => (
                            <li key={p} className="flex items-center gap-1">
                              <span className="text-[#d9691f]">✓</span> {p}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="sm:text-right shrink-0">
                        <p className="text-base font-bold text-[#d9691f]">{formatIDR(tier.price)}</p>
                        <span className="text-[11px] text-[#8a7a63]">per tiket</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Stage layout mockup graphic */}
              <div className="mt-6 rounded-2xl border border-[#e6d9bf] bg-[#efe4cf] p-4 text-center">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#8a7a63]">
                  Denah Panggung & Area Penonton (Ilustrasi)
                </p>
                <div className="mx-auto mt-3 max-w-sm rounded-xl border border-dashed border-[#bfae8f] bg-white/80 p-4">
                  <div className="rounded-lg bg-[#241608] py-2 text-xs font-bold text-white tracking-widest uppercase">
                    [ PANGGUNG UTAMA / STAGE ]
                  </div>
                  <div className="mt-2 rounded-lg bg-amber-100 py-1.5 text-[11px] font-semibold text-amber-900">
                    Area VVIP (Number Seating Baris Depan)
                  </div>
                  <div className="mt-2 rounded-lg bg-orange-100 py-1.5 text-[11px] font-semibold text-orange-900">
                    Area VIP & Festival Standing Ground
                  </div>
                  <div className="mt-2 rounded-lg bg-stone-200 py-1.5 text-[11px] font-semibold text-stone-700">
                    Tribun CAT 1 & CAT 2 (Tingkat Bertingkat)
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "lineup" && (
            <div className="space-y-4">
              <h4 className="font-bold text-sm text-[#241608]">Deretan Musisi & Bintang Tamu</h4>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {event.lineup.map((artistName) => (
                  <div
                    key={artistName}
                    className="flex flex-col items-center rounded-2xl border border-[#e6d9bf] bg-white p-4 text-center shadow-xs"
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#efe4cf] text-lg font-bold text-[#d9691f]">
                      {artistName[0]}
                    </div>
                    <p className="mt-2 text-xs font-bold text-[#241608] line-clamp-1">{artistName}</p>
                    <span className="text-[10px] text-[#8a7a63]">Confirmed Performer</span>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs text-[#5a4a35] leading-relaxed">
                *Lineup dapat bertambah seiring pengumuman fase lanjutan dari promotor resmi.
              </p>
            </div>
          )}

          {activeTab === "rundown" && (
            <div className="space-y-3">
              <h4 className="font-bold text-sm text-[#241608]">Rundown Jadwal Acara</h4>
              <div className="space-y-2 border-l-2 border-[#d9691f] pl-4 ml-2">
                {event.rundown.map((item, i) => (
                  <div key={i} className="relative py-1">
                    <span className="absolute -left-[21px] top-2 h-2.5 w-2.5 rounded-full bg-[#d9691f]" />
                    <span className="text-xs font-bold text-[#d9691f]">{item.time}</span>
                    <p className="text-xs font-medium text-[#241608]">{item.act}</p>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-[#8a7a63] mt-2">
                *Waktu dapat disesuaikan dengan kondisi di lapangan oleh pihak penyelenggara.
              </p>
            </div>
          )}

          {activeTab === "lokasi" && (
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-sm text-[#241608]">Lokasi Venue Acara</h4>
                <p className="text-xs font-medium text-[#241608] mt-1">{event.venue}</p>
                <p className="text-xs text-[#5a4a35]">{event.address}</p>

                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    `${event.venue}, ${event.city}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-[#e6d9bf] bg-white px-4 py-1.5 text-xs font-semibold text-[#241608] hover:bg-[#efe4cf] transition-colors"
                >
                  <IconPinSmall /> Buka Petunjuk di Google Maps
                </a>
              </div>

              <div className="border-t border-[#e6d9bf] pt-4">
                <h4 className="font-bold text-sm text-[#241608]">Aturan & Ketentuan Penonton</h4>
                <ul className="mt-2 space-y-1.5 text-xs text-[#5a4a35]">
                  <li className="flex items-start gap-2">
                    <span className="text-[#d9691f]">•</span> E-tiket resmi wajib ditunjukkan untuk penukaran gelang wristband.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#d9691f]">•</span> Dilarang membawa kamera profesional (DSLR/Mirrorless) tanpa ID pers resmi.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#d9691f]">•</span> Dilarang membawa makanan dan minuman kemasan dari luar arena konser.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#d9691f]">•</span> Anak di bawah usia 12 tahun wajib didampingi oleh orang tua/wali dewasa.
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Booking Sticky Bar */}
        <div className="sticky bottom-0 z-20 flex items-center justify-between border-t border-[#e6d9bf] bg-[#f6efe1]/98 px-6 py-4 backdrop-blur-md">
          <div>
            <span className="text-[10px] uppercase font-semibold text-[#8a7a63]">Kategori Dipilih</span>
            <p className="text-sm font-bold text-[#241608]">
              {selectedTier ? `${selectedTier.name} — ${formatIDR(selectedTier.price)}` : formatIDR(event.priceFrom)}
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onBuyClick(event)}
            className="rounded-full bg-[#d9691f] px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-[#d9691f]/30 hover:bg-[#c45c16] sm:text-sm"
          >
            Lanjutkan Pemesanan Tiket
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Announcement / Promo Banner                                       */
/* ------------------------------------------------------------------ */

function AnnouncementBanner() {
  const [index, setIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const promos = [
    {
      code: "CONCERTGO20",
      title: "Diskon 20% Khusus Tiket Festival & Reguler",
      sub: "Gunakan kode promo saat checkout tiket konser pilihanmu sebelum kuota harian habis.",
      tag: "KODE VOUCHER EKSKLUSIF",
    },
    {
      code: "BEBASADMIN",
      title: "Gratis Biaya Layanan untuk Pembayaran QRIS",
      sub: "Beli tiket tanpa tambahan biaya administrasi sepeserpun untuk semua transaksi e-wallet.",
      tag: "HEMAT MAKSIMAL",
    },
    {
      code: "RAMAIKAN26",
      title: "Beli 3 Dapat 4 untuk Kategori Grup & Komunitas",
      sub: "Ajak kawan nonton bareng konser musisi favorit dengan paket hemat komunitas.",
      tag: "PROMO GRUP",
    },
  ];

  const currentPromo = promos[index];

  function copyCode() {
    navigator.clipboard?.writeText(currentPromo.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-10">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#241209] via-[#3a1c0f] to-[#241209] p-8 text-[#f6efe1] shadow-xl md:p-12">
        <div className="relative z-10 max-w-2xl">
          <span className="rounded-full bg-[#d9691f] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">
            {currentPromo.tag}
          </span>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentPromo.code}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="mt-4"
            >
              <h3 className="font-[var(--font-display,serif)] text-2xl font-bold md:text-3xl">
                {currentPromo.title}
              </h3>
              <p className="mt-2 text-sm text-[#e8dcc4]">{currentPromo.sub}</p>
            </motion.div>
          </AnimatePresence>

          {/* Interactive Copy Code Button */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={copyCode}
              className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 font-mono text-xs font-bold text-[#241608] shadow-md transition-transform hover:scale-105 active:scale-95"
            >
              <span>{currentPromo.code}</span>
              <span className="text-[10px] text-[#d9691f]">
                {copied ? "✓ Tersalin!" : "Salin Kode"}
              </span>
            </button>
            <span className="text-xs text-white/70">Klik kode untuk menyalin ke clipboard</span>
          </div>
        </div>

        {/* Carousel controls */}
        <div className="absolute right-6 bottom-6 flex items-center gap-2 z-10">
          <button
            aria-label="Sebelumnya"
            onClick={() => setIndex((i) => (i - 1 + promos.length) % promos.length)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-all hover:scale-110 hover:bg-white/30"
          >
            ‹
          </button>
          <button
            aria-label="Selanjutnya"
            onClick={() => setIndex((i) => (i + 1) % promos.length)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-all hover:scale-110 hover:bg-white/30"
          >
            ›
          </button>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Testimonials Marquee (Double-Row Infinite Loop)                   */
/* ------------------------------------------------------------------ */

function TestimonialMarquee() {
  const palette = ["bg-[#e0a340] text-[#241608]", "bg-[#2a1a0d] text-[#f6efe1]"];
  const REPEATS = 4;
  const translatePercent = 100 / REPEATS;

  const rows = [
    { items: TESTIMONIALS, direction: "left" as const },
    { items: [...TESTIMONIALS].reverse(), direction: "right" as const },
  ];

  return (
    <section id="komentar" className="scroll-mt-24 py-12">
      <div className="mx-auto mb-6 max-w-7xl px-6">
        <h2 className="font-[var(--font-display,serif)] text-2xl font-bold text-[#241608] md:text-3xl">
          Kata Mereka yang Sudah Menonton
        </h2>
        <p className="mt-1 text-xs text-[#5a4a35] md:text-sm">
          Pengalaman nyata dari ribuan concert-goers yang memesan tiket resmi via ConcertGo.
        </p>
      </div>

      {rows.map((row, rowIdx) => (
        <div key={rowIdx} className="group mb-4 overflow-hidden">
          <div
            className={`marquee-track flex w-max gap-4 px-6 ${
              row.direction === "left" ? "marquee-left" : "marquee-right"
            } group-hover:[animation-play-state:paused]`}
            style={
              {
                "--marquee-distance": `${translatePercent}%`,
              } as CSSProperties
            }
          >
            {Array.from({ length: REPEATS }).flatMap((_, rep) =>
              row.items.map((t, i) => (
                <motion.div
                  whileHover={{ y: -4, scale: 1.02 }}
                  key={`${t.name}-${rep}-${i}`}
                  className={`w-72 shrink-0 rounded-3xl p-6 shadow-sm transition-shadow ${palette[(i + rowIdx) % 2]}`}
                >
                  <div className="flex text-amber-500 gap-1 text-xs mb-2">
                    {"★".repeat(t.rating)}
                  </div>
                  <p className="text-sm leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                  <div className="mt-4 flex items-center gap-3 text-sm border-t border-current/10 pt-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black/10 font-bold text-xs">
                      {t.name[0]}
                    </span>
                    <div>
                      <p className="font-bold leading-none">{t.name}</p>
                      <p className="text-xs opacity-75 mt-0.5">{t.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      ))}

      <style jsx>{`
        .marquee-track {
          animation-duration: 45s;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          will-change: transform;
        }
        .marquee-left {
          animation-name: marquee-left;
        }
        .marquee-right {
          animation-name: marquee-right;
        }
        @keyframes marquee-left {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(calc(var(--marquee-distance) * -1));
          }
        }
        @keyframes marquee-right {
          from {
            transform: translateX(calc(var(--marquee-distance) * -1));
          }
          to {
            transform: translateX(0);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee-track {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Why ConcertGo (Keunggulan)                                         */
/* ------------------------------------------------------------------ */

function WhyConcertGo() {
  return (
    <section id="keunggulan" className="mx-auto max-w-7xl scroll-mt-24 px-6 py-14">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#d9691f]">
          Keamanan & Kemudahan
        </span>
        <h2 className="mt-2 font-[var(--font-display,serif)] text-3xl font-bold text-[#241608] md:text-4xl">
          Kenapa Memilih ConcertGo?
        </h2>
        <p className="mt-2 text-sm text-[#5a4a35]">
          Kami menghubungkan ribuan penikmat musik dengan panggung idola secara transparan, aman, dan tanpa biaya tersembunyi.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {WHY_POINTS.map((p, idx) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: idx * 0.08 }}
            whileHover={{ y: -5 }}
            className="flex flex-col justify-between rounded-3xl border border-[#e6d9bf] bg-[#f1e6d0] p-6 shadow-xs transition-shadow hover:shadow-lg"
          >
            <div>
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#d9691f] text-white shadow-md shadow-[#d9691f]/20">
                {p.icon}
              </span>
              <h3 className="mt-4 font-[var(--font-display,serif)] text-lg font-bold text-[#241608]">
                {p.title}
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-[#5a4a35]">{p.desc}</p>
            </div>
            <div className="mt-5 border-t border-[#e6d9bf] pt-3">
              <span className="text-[11px] font-semibold text-[#d9691f]">{p.stat}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Guest CTA (Khusus Pengguna Sebelum Login)                         */
/* ------------------------------------------------------------------ */

function GuestRegistrationCTA() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#241209] via-[#33170a] to-[#1a0c06] p-8 text-center text-[#f6efe1] shadow-2xl md:p-14"
      >
        <div className="relative z-10 mx-auto max-w-2xl">
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold tracking-wider text-[#d9a26a] backdrop-blur-sm">
            GABUNG SEKARANG
          </span>
          <h2 className="mt-4 font-[var(--font-display,serif)] text-3xl font-bold md:text-5xl">
            Siap Temukan Tiket Konser Impianmu?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-[#e8dcc4] md:text-base">
            Daftar akun gratis sekarang untuk menikmati kemudahan simpan konser favorit, akses tiket presale eksklusif, dan notifikasi jadwal musisi idola.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/Sign-up"
              className="rounded-full bg-[#d9691f] px-7 py-3 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-105 active:scale-95 hover:bg-[#c45c16]"
            >
              Daftar Akun Gratis
            </Link>

            <Link
              href="/Sign-in"
              className="rounded-full border border-white/30 bg-white/10 px-7 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20 hover:scale-105 active:scale-95"
            >
              Sudah Punya Akun? Masuk
            </Link>
          </div>
        </div>

        {/* Ambient background decoration */}
        <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-[#d9691f]/20 blur-3xl pointer-events-none" />
        <div className="absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
      </motion.div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Login Prompt Modal (Framer Motion)                                 */
/* ------------------------------------------------------------------ */

function LoginPromptModal({
  event,
  onClose,
}: {
  event: EventItem;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-xs"
      />

      {/* Modal Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 350 }}
        className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-[#e6d9bf] bg-[#f6efe1] p-6 shadow-2xl text-[#241608]"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/60 text-[#4a3a26] hover:bg-white transition-colors"
        >
          ✕
        </button>

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#d9691f] text-white mb-4 shadow-md shadow-[#d9691f]/30">
          <IconLock />
        </div>

        <h3 className="font-[var(--font-display,serif)] text-xl font-bold">
          Masuk untuk Melanjutkan Pembelian
        </h3>
        <p className="mt-2 text-xs leading-relaxed text-[#5a4a35]">
          Kamu perlu masuk atau mendaftarkan akun ConcertGo terlebih dahulu untuk memesan tiket{" "}
          <strong className="text-[#241608]">{event.title}</strong> di {event.venue}.
        </p>

        <div className="my-4 rounded-2xl bg-[#efe4cf] p-3 text-xs flex justify-between items-center">
          <div>
            <p className="font-semibold text-[#241608]">{event.title}</p>
            <p className="text-[#8a7a63]">{event.city} · {event.date}</p>
          </div>
          <span className="font-bold text-[#d9691f]">{formatIDR(event.priceFrom)}</span>
        </div>

        <div className="flex flex-col gap-2.5">
          <Link
            href="/Sign-in"
            className="flex items-center justify-center rounded-full bg-[#241608] py-2.5 text-sm font-semibold text-[#f6efe1] transition-transform hover:scale-[1.02] active:scale-95"
          >
            Masuk ke Akun
          </Link>
          <Link
            href="/Sign-up"
            className="flex items-center justify-center rounded-full border border-[#d9691f] bg-transparent py-2.5 text-sm font-semibold text-[#d9691f] transition-transform hover:scale-[1.02] active:scale-95"
          >
            Daftar Akun Baru
          </Link>
        </div>

        <p className="mt-4 text-center text-[11px] text-[#8a7a63]">
          Butuh bantuan? Kunjungi halaman Pusat Bantuan ConcertGo.
        </p>
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Footer                                                             */
/* ------------------------------------------------------------------ */

const FOOTER_COLUMNS: { heading: string; links: { label: string; href: string }[] }[] = [
  {
    heading: "Pakai ConcertGo",
    links: [
      { label: "Best Offers", href: "#" },
      { label: "Tempat dengan Promo Terbaik", href: "#" },
      { label: "Promo Tiket", href: "#" },
      { label: "Pusat Bantuan", href: "#" },
      { label: "Kebijakan Privasi", href: "#" },
      { label: "Syarat & Ketentuan", href: "#" },
    ],
  },
  {
    heading: "Informasi Event",
    links: [
      { label: "Publish Event di ConcertGo", href: "#" },
      { label: "Solusi Promotor & Venue", href: "#" },
      { label: "Download Brosur", href: "#" },
      { label: "ConcertGo Experience Manager", href: "#" },
      { label: "Point of Sales Sistem", href: "#" },
      { label: "Aplikasi Ticket Scanner", href: "#" },
    ],
  },
  {
    heading: "Kategori Populer",
    links: [
      { label: "Konser Musik Pop & Rock", href: "#" },
      { label: "Festival Pantai & Outdoor", href: "#" },
      { label: "Jazz & Orkestra", href: "#" },
      { label: "Stand-up Comedy Show", href: "#" },
      { label: "Koplo & Dangdut Modern", href: "#" },
      { label: "E-Sport Championship", href: "#" },
    ],
  },
  {
    heading: "Tentang ConcertGo",
    links: [
      { label: "Tentang Kami", href: "#" },
      { label: "Blog & Kabar Musik", href: "#" },
      { label: "Karir di ConcertGo", href: "#" },
      { label: "Press Kit & Media", href: "#" },
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
          href="#top"
          className="flex items-center gap-2 font-[var(--font-display,serif)] text-base font-bold text-[#241608]"
        >
          <img src="/image/Logo.png" alt="ConcertGo" className="h-7 w-auto" />
          ConcertGo
        </a>

        <div className="flex gap-3">
          <a href="#" aria-label="Instagram" className="opacity-70 hover:opacity-100">
            <IconInstagram />
          </a>
          <a href="#" aria-label="TikTok" className="opacity-70 hover:opacity-100">
            <IconTikTok />
          </a>
          <a href="#" aria-label="X" className="opacity-70 hover:opacity-100">
            <IconX />
          </a>
        </div>
      </div>
      <p className="border-t border-[#e6d9bf] py-4 text-center text-xs text-[#8a7a63]">
        © 2026 ConcertGo Indonesia. Semua tiket terverifikasi resmi & dilindungi hak cipta.
      </p>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/*  Inline SVG Icons                                                   */
/* ------------------------------------------------------------------ */

function IconMusic() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M9 18V5l12-2v13" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  );
}
function IconSparkles() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" strokeLinejoin="round" />
    </svg>
  );
}
function IconSparklesSmall() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" strokeLinejoin="round" />
    </svg>
  );
}
function IconMask() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M4 5c4 3 12 3 16 0-1 8-4 14-8 14S5 13 4 5Z" strokeLinejoin="round" />
    </svg>
  );
}
function IconCompass() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="12" cy="12" r="9" />
      <path d="M15 9l-2 6-6 2 2-6 6-2Z" strokeLinejoin="round" />
    </svg>
  );
}
function IconSun() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M6.5 17.5 5 19" strokeLinecap="round" />
    </svg>
  );
}
function IconHeart() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M12 21s-7-4.35-9.5-8.5C.7 8.8 2.6 5 6.2 5c2 0 3.4 1.1 4 2.3C10.8 6.1 12.2 5 14.2 5c3.6 0 5.5 3.8 3.7 7.5C19 16.65 12 21 12 21Z" strokeLinejoin="round" />
    </svg>
  );
}
function IconPalette() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M12 3a9 9 0 1 0 0 18c1.5 0 1.8-1.6.8-2.4-.9-.7-.4-2.1.9-2.1H15a5 5 0 0 0 5-5 8 8 0 0 0-8-8.5Z" strokeLinejoin="round" />
      <circle cx="7.5" cy="10.5" r="1" fill="currentColor" />
      <circle cx="12" cy="7.5" r="1" fill="currentColor" />
      <circle cx="16" cy="10.5" r="1" fill="currentColor" />
    </svg>
  );
}
function IconMic() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" strokeLinecap="round" />
      <line x1="12" x2="12" y1="19" y2="22" strokeLinecap="round" />
    </svg>
  );
}
function IconPin() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12Z" strokeLinejoin="round" />
      <circle cx="12" cy="9" r="2.3" />
    </svg>
  );
}
function IconPinSmall() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12Z" strokeLinejoin="round" />
      <circle cx="12" cy="9" r="2.3" />
    </svg>
  );
}
function IconClock() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" strokeLinecap="round" />
    </svg>
  );
}
function IconSearch() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8a7a63" strokeWidth="2">
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" strokeLinecap="round" />
    </svg>
  );
}
function IconSearchSmall() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" strokeLinecap="round" />
    </svg>
  );
}
function IconMusicSmall() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 18V5l12-2v13" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  );
}
function IconFilter() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 6h16M7 12h10M10 18h4" strokeLinecap="round" />
    </svg>
  );
}
function IconTicketSmall() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="7" width="18" height="12" rx="2" />
      <path d="M3 12h18" strokeDasharray="2 2" />
    </svg>
  );
}
function IconShieldCheck() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" strokeLinejoin="round" />
      <path d="m9 12 2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconCreditCard() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect width="20" height="14" x="2" y="5" rx="2" />
      <line x1="2" x2="22" y1="10" y2="10" />
    </svg>
  );
}
function IconRefreshCw() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 12a9 9 0 0 1 15.5-6.4L21 8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M21 3v5h-5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M21 12a9 9 0 0 1-15.5 6.4L3 16" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 21v-5h5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconHeadphones() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconLock() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
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