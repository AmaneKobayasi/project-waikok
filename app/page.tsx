"use client";

/**
 * ConcertGo — Homepage
 * Single-file Next.js page (App Router: app/page.tsx)
 *
 * Requires Tailwind CSS to be set up in the project (default with
 * `npx create-next-app@latest --tailwind`).
 *
 * Fonts: this file expects two CSS variables to be available globally —
 *   --font-display  (a serif, e.g. "Fraunces" or "Source Serif 4")
 *   --font-body     (a grotesk, e.g. "Inter" or "Plus Jakarta Sans")
 * See the "SETUP NOTES" comment at the very bottom of this file for the
 * two-line addition to app/layout.tsx that wires these up with next/font.
 */

import type { CSSProperties, JSX } from "react";
import { useMemo, useState } from "react";

/* ------------------------------------------------------------------ */
/*  Mock data                                                         */
/* ------------------------------------------------------------------ */

type Category =
  | "Musik & Konser"
  | "Hiburan & Pertunjukan"
  | "Wisata & Outdoor"
  | "Olahraga"
  | "Amal"
  | "Seni & Budaya"
  | "Relaksasi"
  | "Belanja"
  | "Atraksi";

type EventItem = {
  id: string;
  title: string;
  artist: string;
  venue: string;
  city: string;
  date: string;
  time: string;
  genre: string;
  priceFrom: number;
  blurb: string;
  tone: "espresso" | "clay" | "olive";
};

const CATEGORIES: { label: Category; icon: JSX.Element }[] = [
  { label: "Musik & Konser", icon: <IconMusic /> },
  { label: "Hiburan & Pertunjukan", icon: <IconMask /> },
  { label: "Wisata & Outdoor", icon: <IconCompass /> },
  { label: "Olahraga", icon: <IconSun /> },
  { label: "Amal", icon: <IconHeart /> },
  { label: "Seni & Budaya", icon: <IconPalette /> },
  { label: "Relaksasi", icon: <IconLeaf /> },
  { label: "Belanja", icon: <IconBag /> },
  { label: "Atraksi", icon: <IconPin /> },
];

const EVENTS: EventItem[] = [
  {
    id: "senja-orchestra",
    title: "Senja Orchestra",
    artist: "Kala Senja & String Ensemble",
    venue: "Istora Senayan",
    city: "Jakarta",
    date: "12 Sep 2026",
    time: "19:00 WIB",
    genre: "Orkestra",
    priceFrom: 250000,
    blurb:
      "Malam Jumat yang beda — perpaduan vokal memikat dan harmoni kayu yang hangat. Siap-siap larut dalam suasana magis.",
    tone: "espresso",
  },
  {
    id: "ombak-festival",
    title: "Ombak Festival",
    artist: "Deretan musisi indie pesisir",
    venue: "Pantai Karang Beach Club",
    city: "Bali",
    date: "20 Sep 2026",
    time: "16:00 WITA",
    genre: "Indie & Alternative",
    priceFrom: 180000,
    blurb:
      "Festival musik tepi pantai dengan lima panggung dan sunset terbaik se-Bali. Bawa sandal, tinggalkan beban.",
    tone: "clay",
  },
  {
    id: "kota-tua-jazz",
    title: "Kota Tua Jazz Night",
    artist: "Ardan Quartet feat. Nadia Ayu",
    venue: "Taman Fatahillah",
    city: "Jakarta",
    date: "27 Sep 2026",
    time: "18:30 WIB",
    genre: "Jazz",
    priceFrom: 150000,
    blurb:
      "Jazz klasik di tengah gedung-gedung kolonial. Duduk santai, nikmati kopi, biarkan trompet yang bicara.",
    tone: "olive",
  },
  {
    id: "gema-rimba",
    title: "Gema Rimba",
    artist: "Hutan Bernyanyi Collective",
    venue: "Taman Hutan Raya",
    city: "Bandung",
    date: "3 Okt 2026",
    time: "17:00 WIB",
    genre: "Folk & Akustik",
    priceFrom: 120000,
    blurb:
      "Panggung akustik di tengah pepohonan pinus. Cocok buat kamu yang cari konser tanpa hiruk-pikuk lampu sorot.",
    tone: "espresso",
  },
  {
    id: "neon-dangdut",
    title: "Neon Dangdut Party",
    artist: "Rafi & The Koplo Machine",
    venue: "GOR C-Tra Arena",
    city: "Bandung",
    date: "10 Okt 2026",
    time: "20:00 WIB",
    genre: "Dangdut",
    priceFrom: 100000,
    blurb:
      "Goyang sampai subuh dengan remix dangdut koplo modern. Lampu neon, sound system gila, energi tanpa henti.",
    tone: "clay",
  },
  {
    id: "bianglala-pop",
    title: "Bianglala Pop Fest",
    artist: "5 headliner pop nasional",
    venue: "Lapangan D Senayan",
    city: "Jakarta",
    date: "18 Okt 2026",
    time: "15:00 WIB",
    genre: "Pop",
    priceFrom: 320000,
    blurb:
      "Festival pop dua hari dengan line-up penuh hits yang bakal kamu nyanyiin dari lagu pertama sampai encore.",
    tone: "olive",
  },
  {
    id: "malam-metal",
    title: "Malam Metal Raya",
    artist: "Serigala Baja & tamu",
    venue: "Eldorado Dome",
    city: "Surabaya",
    date: "24 Okt 2026",
    time: "19:30 WIB",
    genre: "Metal",
    priceFrom: 140000,
    blurb:
      "Mosh pit terbaik tahun ini. Tiga band lokal, satu panggung, energi yang enggak bisa kamu dapetin di rumah.",
    tone: "espresso",
  },
  {
    id: "akustik-senyap",
    title: "Akustik di Senyap",
    artist: "Larasati",
    venue: "Rooftop Kopi Manja",
    city: "Yogyakarta",
    date: "1 Nov 2026",
    time: "19:00 WIB",
    genre: "Akustik",
    priceFrom: 95000,
    blurb:
      "Konser intim 200 kursi, lampu temaram, dan suara gitar yang kedengeran tiap petiknya. Buat malam yang pelan-pelan.",
    tone: "clay",
  },
  {
    id: "ritme-nusantara",
    title: "Ritme Nusantara",
    artist: "Gamelan Fusion Orchestra",
    venue: "Taman Budaya",
    city: "Solo",
    date: "8 Nov 2026",
    time: "18:00 WIB",
    genre: "Tradisional & Fusion",
    priceFrom: 110000,
    blurb:
      "Gamelan ketemu synth. Sebuah eksperimen bunyi yang menghormati akar sambil melangkah ke depan.",
    tone: "olive",
  },
];

const GENRES = Array.from(new Set(EVENTS.map((e) => e.genre)));
const CITIES = Array.from(new Set(EVENTS.map((e) => e.city)));

const TESTIMONIALS = [
  { name: "Dinda A.", role: "Mahasiswi", quote: "Beli tiket cuma butuh dua menit, e-tiket langsung masuk email. Ga pake drama calo lagi." },
  { name: "Reza P.", role: "Pekerja kantoran", quote: "Refund pas jadwal konsernya mundur prosesnya cepet banget, uang balik dalam 3 hari." },
  { name: "Amel S.", role: "Content creator", quote: "Suka fitur favorit — semua konser incaran kesimpen rapi, tinggal pantengin harga." },
  { name: "Bram T.", role: "Musisi", quote: "Sebagai musisi seneng liat fans bisa dapet tiket resmi, harga wajar, tanpa mark-up gila-gilaan." },
  { name: "Naya K.", role: "Mahasiswi", quote: "Tampilannya enak dipakai satu tangan pas lagi di kereta. Checkout-nya juga jelas step-nya." },
  { name: "Fajar W.", role: "Fotografer event", quote: "Info venue lengkap sama denah kursinya, jadi ga bingung pas nyampe lokasi." },
  { name: "Citra M.", role: "Guru", quote: "Metode bayarnya lengkap, saya pakai e-wallet dan langsung terkonfirmasi." },
  { name: "Ilham R.", role: "Freelancer", quote: "Notifikasi H-1 sebelum konser ngebantu banget, jadi ga lupa siapin tiket." },
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

const TONE_STYLES: Record<EventItem["tone"], string> = {
  espresso: "bg-[#241209] text-[#f4ead9]",
  clay: "bg-[#3a1c0f] text-[#f4ead9]",
  olive: "bg-[#2a2113] text-[#f4ead9]",
};

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function ConcertGoPage() {
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState<string>("Semua Genre");
  const [city, setCity] = useState<string>("Semua Kota");
  const [sort, setSort] = useState<string>("Tanggal terdekat");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [promoIndex, setPromoIndex] = useState(0);

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
      return a.title.localeCompare(b.title); // "Tanggal terdekat" fallback (mock order)
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

  return (
    <div id="top" className="min-h-screen bg-[#f6efe1] font-[var(--font-body,ui-sans-serif)] text-[#241608]">
      <SiteHeader />

      <main>
        <HeroCarousel index={promoIndex} setIndex={setPromoIndex} />

        <CategoryRail />

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
        />

        <div id="konser">
          <EventSection
            id="rekomendasi"
            title="Rekomendasi"
            events={recommended}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
          />

          <EventSection
            id="populer"
            title="Konser Populer"
            events={popular}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
          />

          <EventSection
            id="disukai"
            title="Paling Disukai"
            events={mostLiked}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
          />
        </div>

        <AnnouncementBanner />

        <TestimonialMarquee />

        <WhyConcertGo />
      </main>

      <SiteFooter />
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
    <header className="sticky top-0 z-30 border-b border-[#e6d9bf] bg-[#f6efe1]/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick("Home", "top");
          }}
          className="flex items-center gap-2"
        >
          <img src="/image/Logo.png" alt="ConcertGo" className="h-8 w-auto" />
          <span className="font-[var(--font-display,serif)] text-lg">
            <span className="font-semibold">Concert</span>
            <span className="font-normal text-[#d9691f]">Go</span>
          </span>
        </a>

        <nav className="hidden items-center gap-8 text-sm text-[#4a3a26] md:flex">
          {NAV_LINKS.map(({ label, targetId }) => (
            <a
              key={label}
              href={`#${targetId}`}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(label, targetId);
              }}
              className={`relative pb-1 transition-colors hover:text-[#241608] ${
                active === label ? "text-[#241608]" : ""
              }`}
            >
              {label}
              {active === label && (
                <span className="absolute -bottom-[17px] left-0 right-0 h-[2px] bg-[#241608]" />
              )}
            </a>
          ))}
        </nav>

        <button className="rounded-full bg-[#241608] px-5 py-2 text-sm font-medium text-[#f6efe1] transition-transform hover:scale-[1.03] active:scale-95">
          Masuk
        </button>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/*  Hero image carousel (mosaic, matches reference layout)             */
/* ------------------------------------------------------------------ */

function HeroCarousel({
  index,
  setIndex,
}: {
  index: number;
  setIndex: (fn: (i: number) => number) => void;
}) {
  const slides = 3;
  return (
    <section className="mx-auto max-w-7xl px-6 pt-10">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-[1.6fr_1fr]">
        <div className="relative h-[220px] overflow-hidden rounded-3xl bg-gradient-to-br from-[#3a1c0f] via-[#241209] to-[#120a05] md:h-[300px]">
          <div className="absolute inset-0 flex items-end p-6">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#d9a26a]">Panggung utama</p>
              <p className="mt-1 max-w-xs font-[var(--font-display,serif)] text-xl text-[#f6efe1]">
                {EVENTS[index % EVENTS.length].title}
              </p>
            </div>
          </div>
          <button
            aria-label="Sebelumnya"
            onClick={() => setIndex((i) => (i - 1 + slides) % slides)}
            className="absolute left-4 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-[#f6efe1]/90 text-[#241608] transition-transform hover:scale-110"
          >
            ‹
          </button>
          <button
            aria-label="Selanjutnya"
            onClick={() => setIndex((i) => (i + 1) % slides)}
            className="absolute right-4 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-[#f6efe1]/90 text-[#241608] transition-transform hover:scale-110"
          >
            ›
          </button>
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5">
            {Array.from({ length: slides }).map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i === index % slides ? "w-5 bg-[#f6efe1]" : "w-1.5 bg-[#f6efe1]/40"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-rows-2 gap-4">
          <div className="rounded-3xl bg-gradient-to-br from-[#2a2113] to-[#120a05]" />
          <div className="rounded-3xl bg-gradient-to-br from-[#3a1c0f] to-[#120a05]" />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Category rail                                                      */
/* ------------------------------------------------------------------ */

function CategoryRail() {
  const [active, setActive] = useState<Category>("Musik & Konser");
  return (
    <section className="mx-auto max-w-7xl overflow-x-auto px-6 py-10">
      <div className="flex min-w-max gap-8">
        {CATEGORIES.map((c) => (
          <button
            key={c.label}
            onClick={() => setActive(c.label)}
            className="group flex w-24 flex-col items-center gap-2 text-center"
          >
            <span
              className={`flex h-14 w-14 items-center justify-center rounded-full border transition-colors ${
                active === c.label
                  ? "border-[#d9691f] bg-[#d9691f] text-[#f6efe1]"
                  : "border-[#e6d9bf] bg-[#efe4cf] text-[#4a3a26] group-hover:border-[#d9691f]"
              }`}
            >
              {c.icon}
            </span>
            <span className="text-[11px] leading-tight text-[#4a3a26]">{c.label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Search hero                                                        */
/* ------------------------------------------------------------------ */

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
}) {
  const { query, setQuery, genre, setGenre, city, setCity, sort, setSort, resultCount } = props;
  return (
    <section className="mx-auto max-w-3xl px-6 pb-16 text-center">
      <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#b5772f]">
        Tiket resmi · Tanpa calo
      </p>
      <h1 className="mt-4 font-[var(--font-display,serif)] text-4xl leading-tight text-[#241608] md:text-5xl">
        Konser favoritmu, satu tiket lagi.
      </h1>
      <p className="mx-auto mt-4 max-w-md text-[#5a4a35]">
        Temukan dan pesan tiket konser dari berbagai kota di Indonesia, langsung dari genggamanmu.
      </p>

      <div className="mx-auto mt-8 flex max-w-xl items-center gap-2 rounded-full border border-[#e6d9bf] bg-white/70 p-2 pl-5 shadow-sm">
        <IconSearch />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari artis, venue, atau kota..."
          className="flex-1 bg-transparent text-sm text-[#241608] placeholder:text-[#8a7a63] focus:outline-none"
        />
        <button className="rounded-full bg-[#241608] px-5 py-2.5 text-sm font-medium text-[#f6efe1] transition-transform hover:scale-[1.03] active:scale-95">
          Cari
        </button>
      </div>

      <div className="mx-auto mt-4 flex max-w-2xl flex-wrap items-center justify-center gap-2 text-sm">
        <span className="flex items-center gap-1 rounded-full border border-[#e6d9bf] bg-white/60 px-3 py-1.5 text-[#4a3a26]">
          <IconFilter /> Filter
        </span>

        <select
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          className="rounded-full border border-[#e6d9bf] bg-white/60 px-3 py-1.5 text-[#4a3a26] focus:outline-none"
        >
          <option>Semua Genre</option>
          {GENRES.map((g) => (
            <option key={g}>{g}</option>
          ))}
        </select>

        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="rounded-full border border-[#e6d9bf] bg-white/60 px-3 py-1.5 text-[#4a3a26] focus:outline-none"
        >
          <option>Semua Kota</option>
          {CITIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="rounded-full border border-[#e6d9bf] bg-white/60 px-3 py-1.5 text-[#4a3a26] focus:outline-none"
        >
          <option>Tanggal terdekat</option>
          <option>Harga terendah</option>
          <option>Harga tertinggi</option>
        </select>
      </div>

      <p className="mt-3 text-xs text-[#8a7a63]">
        Menampilkan {resultCount} dari {EVENTS.length} konser
      </p>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Event section + card                                               */
/* ------------------------------------------------------------------ */

function EventSection({
  id,
  title,
  events,
  favorites,
  onToggleFavorite,
}: {
  id: string;
  title: string;
  events: EventItem[];
  favorites: Set<string>;
  onToggleFavorite: (id: string) => void;
}) {
  if (events.length === 0) {
    return (
      <section id={id} className="mx-auto max-w-7xl scroll-mt-24 px-6 py-8">
        <h2 className="font-[var(--font-display,serif)] text-2xl">{title}</h2>
        <p className="mt-4 text-sm text-[#8a7a63]">
          Belum ada konser yang cocok dengan pencarianmu di kategori ini.
        </p>
      </section>
    );
  }

  return (
    <section id={id} className="mx-auto max-w-7xl scroll-mt-24 px-6 py-8">
      <h2 className="mb-6 font-[var(--font-display,serif)] text-2xl">{title}</h2>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {events.map((ev) => (
          <EventCard
            key={ev.id + title}
            event={ev}
            isFavorite={favorites.has(ev.id)}
            onToggleFavorite={() => onToggleFavorite(ev.id)}
          />
        ))}
      </div>
    </section>
  );
}

function EventCard({
  event,
  isFavorite,
  onToggleFavorite,
}: {
  event: EventItem;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl border border-[#e6d9bf] bg-[#f1e6d0] transition-all hover:-translate-y-1 hover:shadow-lg">
      <div className={`relative flex h-32 items-start justify-between p-5 ${TONE_STYLES[event.tone]}`}>
        <h3 className="font-[var(--font-display,serif)] text-lg leading-tight">{event.title}</h3>
        <button
          onClick={onToggleFavorite}
          aria-label="Simpan ke favorit"
          className="shrink-0 text-lg transition-transform hover:scale-125"
        >
          {isFavorite ? "❤" : "♡"}
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <p className="text-xs leading-relaxed text-[#5a4a35]">{event.blurb}</p>

        <div className="mt-1 space-y-1 text-[11px] uppercase tracking-wide text-[#8a7a63]">
          <p className="flex items-center gap-1.5">
            <IconPinSmall /> {event.venue}, {event.city}
          </p>
          <p className="flex items-center gap-1.5">
            <IconClock /> {event.date}, {event.time}
          </p>
        </div>

        <div className="mt-auto flex items-end justify-between pt-3">
          <div>
            <p className="text-[10px] uppercase tracking-wide text-[#8a7a63]">Mulai dari</p>
            <p className="text-sm font-semibold text-[#241608]">{formatIDR(event.priceFrom)}</p>
          </div>
          <button className="rounded-full bg-[#241608] px-4 py-2 text-xs font-medium text-[#f6efe1] transition-transform hover:scale-105 active:scale-95">
            Beli Tiket
          </button>
        </div>
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/*  Announcement / promo banner                                        */
/* ------------------------------------------------------------------ */

function AnnouncementBanner() {
  const [index, setIndex] = useState(0);
  const promos = [
    { title: "Diskon 20% tiket kategori Festival", sub: "Berlaku untuk pembelian sebelum 5 September" },
    { title: "Cicilan 0% kartu kredit tertentu", sub: "Nikmati konser sekarang, bayar belakangan" },
    { title: "Buy 2 Get 1 khusus grup", sub: "Ajak temanmu, hemat lebih banyak" },
  ];
  return (
    <section className="mx-auto max-w-7xl px-6 py-10">
      <h2 className="mb-6 font-[var(--font-display,serif)] text-2xl">Pemberitahuan</h2>
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#241209] via-[#3a1c0f] to-[#241209] px-8 py-14 text-[#f6efe1]">
        <p className="text-xs uppercase tracking-[0.25em] text-[#d9a26a]">Penawaran terbatas</p>
        <p className="mt-3 max-w-md font-[var(--font-display,serif)] text-2xl">
          {promos[index].title}
        </p>
        <p className="mt-2 text-sm text-[#e8dcc4]">{promos[index].sub}</p>

        <button
          aria-label="Sebelumnya"
          onClick={() => setIndex((i) => (i - 1 + promos.length) % promos.length)}
          className="absolute left-4 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-[#f6efe1]/90 text-[#241608] transition-transform hover:scale-110"
        >
          ‹
        </button>
        <button
          aria-label="Selanjutnya"
          onClick={() => setIndex((i) => (i + 1) % promos.length)}
          className="absolute right-4 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-[#f6efe1]/90 text-[#241608] transition-transform hover:scale-110"
        >
          ›
        </button>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Testimonials (double-row marquee)                                  */
/* ------------------------------------------------------------------ */

function TestimonialMarquee() {
  const palette = ["bg-[#e0a340] text-[#241608]", "bg-[#2a1a0d] text-[#f6efe1]"];

  // Repeat the full testimonial list several times per row so the strip is
  // always wider than the viewport (even on ultra-wide monitors) and the
  // loop never runs out or visibly "restarts".
  const REPEATS = 4;
  const translatePercent = 100 / REPEATS;

  const rows = [
    { items: TESTIMONIALS, direction: "left" as const },
    { items: [...TESTIMONIALS].reverse(), direction: "right" as const },
  ];

  return (
    <section id="komentar" className="scroll-mt-24 py-12">
      <h2 className="mx-auto mb-6 max-w-7xl px-6 font-[var(--font-display,serif)] text-2xl">
        Komentar Pengguna
      </h2>

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
                <div
                  key={`${t.name}-${rep}-${i}`}
                  className={`w-64 shrink-0 rounded-3xl p-6 ${palette[(i + rowIdx) % 2]}`}
                >
                  <p className="mb-3 text-2xl opacity-60">&ldquo;</p>
                  <p className="text-sm leading-relaxed">{t.quote}</p>
                  <div className="mt-4 flex items-center gap-2 text-sm">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-black/10">
                      <IconUser />
                    </span>
                    <div>
                      <p className="font-medium leading-none">{t.name}</p>
                      <p className="text-xs opacity-70">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ))}

      <style jsx>{`
        .marquee-track {
          animation-duration: 48s;
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
/*  Why ConcertGo                                                      */
/* ------------------------------------------------------------------ */

function WhyConcertGo() {
  const points = [
    { title: "Mudah", desc: "Cari, pilih, bayar — semua dalam tiga langkah tanpa ribet." },
    { title: "Aman", desc: "Setiap tiket terverifikasi dan dilindungi dari penipuan calo." },
    { title: "Terpercaya", desc: "Ribuan goers sudah pakai ConcertGo untuk konser favorit mereka." },
  ];
  return (
    <section className="mx-auto max-w-7xl px-6 py-14">
      <h2 className="mb-8 font-[var(--font-display,serif)] text-2xl">Kenapa ConcertGo?</h2>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {points.map((p) => (
          <div
            key={p.title}
            className="rounded-3xl border border-[#e6d9bf] bg-[#f1e6d0] p-6 transition-transform hover:-translate-y-1"
          >
            <p className="font-[var(--font-display,serif)] text-xl text-[#d9691f]">{p.title}</p>
            <p className="mt-2 text-sm text-[#5a4a35]">{p.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Footer                                                              */
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
          href="#top"
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
/*  Icons (inline SVG, no external deps)                               */
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
function IconLeaf() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M20 4C10 4 4 10 4 18c8 0 14-6 14-14Z" strokeLinejoin="round" />
      <path d="M5 19c4-5 9-9 14-14" strokeLinecap="round" />
    </svg>
  );
}
function IconBag() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="4" y="8" width="16" height="12" rx="2" />
      <path d="M8 8V6a4 4 0 0 1 8 0v2" />
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
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12Z" strokeLinejoin="round" />
      <circle cx="12" cy="9" r="2.3" />
    </svg>
  );
}
function IconClock() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" strokeLinecap="round" />
    </svg>
  );
}
function IconSearch() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8a7a63" strokeWidth="2">
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" strokeLinecap="round" />
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
function IconUser() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c1.5-4 5-6 8-6s6.5 2 8 6" strokeLinecap="round" />
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

1. Save this file as app/page.tsx in a Next.js 14+ App Router project
   created with Tailwind (npx create-next-app@latest --tailwind).

2. Add the two fonts in app/layout.tsx:

   import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";

   const display = Fraunces({ subsets: ["latin"], variable: "--font-display" });
   const body = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-body" });

   export default function RootLayout({ children }: { children: React.ReactNode }) {
     return (
       <html lang="id" className={`${display.variable} ${body.variable}`}>
         <body>{children}</body>
       </html>
     );
   }

3. Everything on this page — search, filters, favorites, the two
   carousels, and the tabs — is state-driven and works out of the box,
   no extra libraries required.
------------------------------------------------------------------- */