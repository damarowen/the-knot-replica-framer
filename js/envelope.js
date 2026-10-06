/* ============================================================
   ENVELOPE OVERLAY — Add-on JS (Self-Injecting)
   Animasi pembuka amplop untuk website static HTML.

   Cara pakai (3 langkah saja):
     1. Copy css/envelope.css, js/envelope.js, dan assets/images/envelope-*.png
     2. Tambahkan di <head>:
          <link rel="stylesheet" href="css/envelope.css">
     3. Tambahkan sebelum </body>:
          <script src="js/envelope.js"></script>

   HTML overlay OTOMATIS disuntikkan ke DOM saat halaman load.
   Tidak perlu menambah blok HTML manual.

   Menonaktifkan overlay:
     <body data-envelope="disabled">

   Dokumentasi lengkap: ENVELOPE-ADDON.md
   ============================================================ */

(function () {
  "use strict";

  /* ── Konfigurasi Selector ───────────────────────────────────
       Ubah nilai di bawah ini jika class/ID di website target
       berbeda dari default. Lihat "Konfigurasi Selector" di
       ENVELOPE-ADDON.md (Opsi B).
    */
  const CONFIG = {
    overlay: "#envelopeOverlay", // container overlay amplop
    inviteLetters: "#inviteText .letter", // huruf teks "You're invited to"
    hero: ".hero", // section hero
    subtitleLetters: "#heroSubtitle .letter", // huruf subtitle hero
    titleLetters: "#heroTitle .letter", // huruf judul hero
    amp: "#heroTitle .amp", // tanda "&"
    mainNav: "#mainNav", // navigasi utama
  };

  /* ── Timing (ms) — lihat "Mengubah timing animasi" di docs ── */
  const TIMING = {
    letterStart: 200, // teks amplop mulai muncul
    letterStagger: 40, // delay antar huruf (ms)
    openFlap: 3000, // top flap mulai terbuka
    heroRevealed: 4100, // hero image mulai zoom in
    heroAnimate: 5100, // nav muncul + hero text animasi
    removeOverlay: 6100, // overlay dihapus dari DOM
  };

  /* ── Path gambar amplop ─────────────────────────────────────
       Ubah jika folder gambar target berbeda.
    */
  const ASSET_BASE = "assets/images/";

  /* ── HTML Template — disuntikkan otomatis ke <body> ─────────
       Teks bisa diganti di sini. Setiap huruf harus dalam
       <span class="letter"> sendiri agar animasi per huruf jalan.
    */
  const ENVELOPE_HTML = `
<div class="envelope-overlay" id="envelopeOverlay">
    <div class="envelope-scene">
        <div class="env-variant">
            <div class="env-layer env-right">
                <img src="${ASSET_BASE}envelope-right.png" alt="" decoding="auto">
            </div>
            <div class="env-layer env-left">
                <img src="${ASSET_BASE}envelope-left.png" alt="" decoding="auto">
            </div>
            <div class="env-layer env-bottom">
                <img src="${ASSET_BASE}envelope-bottom.png" alt="" decoding="auto">
            </div>
            <div class="env-layer env-top">
                <img src="${ASSET_BASE}envelope-top.png" alt="" decoding="auto">
                <div class="env-invite-text">
                    <h4 class="invite-heading" id="inviteText">
                        <span class="word"><span class="letter">Y</span><span class="letter">o</span><span class="letter">u</span><span class="letter">'</span><span class="letter">r</span><span class="letter">e</span></span>
                        <span class="word"><span class="letter">i</span><span class="letter">n</span><span class="letter">v</span><span class="letter">i</span><span class="letter">t</span><span class="letter">e</span><span class="letter">d</span></span>
                        <span class="word"><span class="letter">t</span><span class="letter">o</span></span>
                    </h4>
                </div>
            </div>
        </div>
    </div>
</div>`;

  /* ── Inject HTML overlay ke DOM ───────────────────────────── */
  function injectOverlay() {
    // Flag untuk menonaktifkan overlay via HTML
    if (document.body && document.body.dataset.envelope === "disabled") {
      return false;
    }
    // Jika HTML sudah ada di DOM (manual), jangan injeksi ganda
    if (document.querySelector(CONFIG.overlay)) {
      return true;
    }
    // Suntikkan sebagai anak pertama <body>
    if (document.body) {
      document.body.insertAdjacentHTML("afterbegin", ENVELOPE_HTML);
      return true;
    }
    return false;
  }

  // Injeksi secepat mungkin agar gambar mulai loading
  const overlayReady = injectOverlay();

  /* ── Jalankan animasi setelah DOM siap ────────────────────── */
  document.addEventListener("DOMContentLoaded", () => {
    const envelopeOverlay = overlayReady
      ? document.querySelector(CONFIG.overlay)
      : null;
    const hero = document.querySelector(CONFIG.hero);
    const mainNav = document.querySelector(CONFIG.mainNav);

    if (envelopeOverlay) {
      runEnvelopeAnimation(envelopeOverlay, hero, mainNav);
    } else {
      runFallbackAnimation(hero, mainNav);
    }
  });

  /* ── Animasi utama dengan overlay ─────────────────────────── */
  function runEnvelopeAnimation(envelopeOverlay, hero, mainNav) {
    const inviteLetters = document.querySelectorAll(CONFIG.inviteLetters);

    // Phase 1: animate "You're invited to" letters (stagger)
    setTimeout(() => {
      envelopeOverlay.classList.add("animate");
      inviteLetters.forEach((letter, i) => {
        letter.style.transitionDelay = `${i * TIMING.letterStagger}ms`;
      });
    }, TIMING.letterStart);

    // Phase 2: top flap terbuka (rotateX)
    setTimeout(() => {
      envelopeOverlay.classList.add("open");
    }, TIMING.openFlap);

    // Phase 3: hero image zoom in saat layer lain slide
    setTimeout(() => {
      if (hero) hero.classList.add("revealed");
    }, TIMING.heroRevealed);

    // Phase 4: hide overlay + nav muncul + hero text animasi
    setTimeout(() => {
      envelopeOverlay.classList.add("hidden");
      if (mainNav) mainNav.classList.add("visible");
      animateHeroText(hero);
    }, TIMING.heroAnimate);

    // Phase 5: hapus overlay dari DOM
    setTimeout(() => {
      envelopeOverlay.style.display = "none";
    }, TIMING.removeOverlay);
  }

  /* ── Fallback: tanpa overlay, konten tetap dianimasikan ───── */
  function runFallbackAnimation(hero, mainNav) {
    // Hero image zoom in
    setTimeout(() => {
      if (hero) hero.classList.add("revealed");
    }, 0);

    // Hero text letter-by-letter
    setTimeout(() => {
      animateHeroText(hero);
    }, 800);

    // Navigasi muncul
    setTimeout(() => {
      if (mainNav) mainNav.classList.add("visible");
    }, 1000);
  }

  /* ── Hero text: animasi huruf per huruf ───────────────────── */
  function animateHeroText(hero) {
    if (!hero) return;

    const subtitleLetters = document.querySelectorAll(CONFIG.subtitleLetters);
    const titleLetters = document.querySelectorAll(CONFIG.titleLetters);
    const amp = document.querySelector(CONFIG.amp);

    hero.classList.add("animate");

    // Subtitle dulu
    subtitleLetters.forEach((letter, i) => {
      letter.style.transitionDelay = `${i * 30}ms`;
    });

    // Title menyusul setelah subtitle
    const subtitleDelay = subtitleLetters.length * 30;
    titleLetters.forEach((letter, i) => {
      letter.style.transitionDelay = `${subtitleDelay + 200 + i * 40}ms`;
    });

    if (amp) {
      amp.style.transitionDelay = `${subtitleDelay + 100}ms`;
    }
  }
})();
