/* ============ NEXUS — main interactions ============ */

gsap.registerPlugin(ScrollTrigger);

/* ---------- Lenis smooth scroll ---------- */
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
});
window.lenis = lenis;
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

/* ---------- Local time ---------- */
function tickClock() {
  const el = document.getElementById("local-time");
  if (!el) return;
  el.textContent = new Date().toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Jakarta",
  });
}
tickClock();
setInterval(tickClock, 30000);

/* ---------- Split manifesto into words ---------- */
const manifesto = document.getElementById("manifesto-text");
if (manifesto) {
  manifesto.innerHTML = manifesto.textContent
    .trim()
    .split(/\s+/)
    .map((w) => `<span class="word">${w}</span>`)
    .join(" ");
}

/* ---------- Preloader ---------- */
const counter = { val: 0 };
const loaderCount = document.getElementById("loader-count");

const preloadTl = gsap.timeline({
  onComplete: initHeroIntro,
});

preloadTl
  .to(".preloader__char", {
    y: 0,
    duration: 0.9,
    stagger: 0.07,
    ease: "power4.out",
    delay: 0.2,
  })
  .to(counter, {
    val: 100,
    duration: 1.8,
    ease: "power2.inOut",
    onUpdate: () => (loaderCount.textContent = Math.round(counter.val)),
  }, "-=0.5")
  .to("#loader-bar", {
    scaleX: 1,
    duration: 1.8,
    ease: "power2.inOut",
  }, "<")
  .to(".preloader__char", {
    y: "-110%",
    duration: 0.7,
    stagger: 0.05,
    ease: "power3.in",
  }, "+=0.15")
  .to(".preloader__counter, .preloader__bar", { opacity: 0, duration: 0.3 }, "<")
  .to("#preloader", {
    yPercent: -100,
    duration: 0.9,
    ease: "power4.inOut",
  })
  .set("#preloader", { display: "none" });

/* ---------- Hero intro ---------- */
function initHeroIntro() {
  const tl = gsap.timeline();
  tl.to(".hero__char", {
    y: 0,
    rotate: 0,
    duration: 1.3,
    stagger: 0.08,
    ease: "power4.out",
  })
    .to(".hero__eyebrow .line", { y: 0, duration: 0.9, ease: "power3.out" }, "-=0.9")
    .to(".hero__tagline .line", { y: 0, duration: 0.9, stagger: 0.12, ease: "power3.out" }, "-=0.7")
    .from(".hero__bottom", { borderColor: "transparent" }, "<")
    .from(".nav", { y: -30, opacity: 0, duration: 0.8, ease: "power3.out" }, "-=0.8")
    .from(".hero__scroll", { opacity: 0, duration: 0.6 }, "-=0.4");
}

/* ---------- Hero parallax on scroll ---------- */
gsap.to(".hero__video", {
  scale: 1.0,
  yPercent: 8,
  ease: "none",
  scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
});
gsap.to(".hero__content", {
  yPercent: -18,
  opacity: 0.25,
  ease: "none",
  scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
});

/* ---------- Generic line reveals ---------- */
document.querySelectorAll("section .line-mask .line, footer .line-mask .line").forEach((line) => {
  if (line.closest(".hero")) return;
  gsap.to(line, {
    y: 0,
    duration: 1.1,
    ease: "power4.out",
    scrollTrigger: { trigger: line.closest("section, footer"), start: "top 72%" },
  });
});

/* ---------- Section tags ---------- */
document.querySelectorAll(".section-tag").forEach((tag) => {
  gsap.from(tag, {
    opacity: 0,
    x: -24,
    duration: 0.9,
    ease: "power3.out",
    scrollTrigger: { trigger: tag, start: "top 85%" },
  });
});

/* ---------- Manifesto word-by-word scrub ---------- */
gsap.to(".manifesto__text .word", {
  opacity: 1,
  stagger: 0.06,
  ease: "none",
  scrollTrigger: {
    trigger: ".manifesto",
    start: "top 70%",
    end: "bottom 65%",
    scrub: 0.6,
  },
});

/* ---------- Works horizontal scroll ---------- */
const track = document.getElementById("works-track");
if (track) {
  const getScroll = () => track.scrollWidth - window.innerWidth;
  gsap.to(track, {
    x: () => -getScroll(),
    ease: "none",
    scrollTrigger: {
      trigger: ".works",
      start: "top top",
      end: () => `+=${getScroll()}`,
      pin: ".works__pin",
      scrub: 1,
      invalidateOnRefresh: true,
    },
  });

  // subtle inner-image parallax while track moves
  document.querySelectorAll(".work__media img").forEach((img) => {
    gsap.fromTo(img, { xPercent: -5 }, {
      xPercent: 5,
      ease: "none",
      scrollTrigger: {
        trigger: ".works",
        start: "top top",
        end: () => `+=${getScroll()}`,
        scrub: 1,
      },
    });
  });
}

/* ---------- Philosophy image reveal ---------- */
gsap.to(".reveal-img", {
  clipPath: "inset(0% 0 0 0)",
  duration: 1.4,
  ease: "power4.inOut",
  scrollTrigger: { trigger: ".philosophy", start: "top 65%" },
});
gsap.to(".reveal-img img", {
  scale: 1.02,
  duration: 1.8,
  ease: "power3.out",
  scrollTrigger: { trigger: ".philosophy", start: "top 65%" },
});
gsap.from(".philosophy__text", {
  opacity: 0, y: 40, duration: 1, ease: "power3.out",
  scrollTrigger: { trigger: ".philosophy__text", start: "top 80%" },
});

/* ---------- Stats counters ---------- */
document.querySelectorAll(".stat-num").forEach((el) => {
  const target = +el.dataset.count;
  const obj = { v: 0 };
  gsap.to(obj, {
    v: target,
    duration: 1.8,
    ease: "power2.out",
    onUpdate: () => (el.textContent = Math.round(obj.v)),
    scrollTrigger: { trigger: el, start: "top 85%" },
  });
});

/* ---------- Services rows + floating preview ---------- */
const preview = document.getElementById("service-preview");
const previewImg = preview?.querySelector("img");
let previewX = 0, previewY = 0, targetX = 0, targetY = 0;

document.querySelectorAll(".service").forEach((row) => {
  gsap.from(row, {
    opacity: 0,
    y: 50,
    duration: 0.9,
    ease: "power3.out",
    scrollTrigger: { trigger: row, start: "top 88%" },
  });

  row.addEventListener("mouseenter", () => {
    if (!preview) return;
    previewImg.src = row.dataset.img;
    gsap.to(preview, { opacity: 1, scale: 1, duration: 0.4, ease: "power3.out" });
  });
  row.addEventListener("mouseleave", () => {
    if (!preview) return;
    gsap.to(preview, { opacity: 0, scale: 0.9, duration: 0.3, ease: "power3.in" });
  });
});

window.addEventListener("mousemove", (e) => {
  targetX = e.clientX;
  targetY = e.clientY;
});

gsap.ticker.add(() => {
  previewX += (targetX - previewX) * 0.08;
  previewY += (targetY - previewY) * 0.08;
  if (preview) {
    preview.style.transform = `translate(${previewX - 160}px, ${previewY - 200}px) scale(${gsap.getProperty(preview, "scale")})`;
  }
});

/* ---------- Marquee ---------- */
const marqueeInner = document.querySelector(".marquee__inner");
if (marqueeInner) {
  const marqueeTween = gsap.to(marqueeInner, { xPercent: -50, ease: "none", duration: 28, repeat: -1 });
  // speed reacts to scroll velocity
  ScrollTrigger.create({
    onUpdate: (self) => {
      const v = Math.abs(self.getVelocity()) / 800;
      gsap.to(marqueeTween, { timeScale: 1 + Math.min(v, 4), duration: 0.4, overwrite: true });
    },
  });
}

/* ---------- Footer big logo parallax ---------- */
gsap.from(".contact__big-logo", {
  yPercent: 60,
  ease: "none",
  scrollTrigger: { trigger: ".contact", start: "top bottom", end: "bottom bottom", scrub: 1 },
});

/* ---------- Menu overlay ---------- */
const menu = document.getElementById("menu");
const menuToggle = document.getElementById("menu-toggle");
let menuOpen = false;

const menuTl = gsap.timeline({ paused: true });
menuTl
  .to(".menu__bg", { yPercent: 0, duration: 0.8, ease: "power4.inOut" })
  .to(".menu__link", { y: 0, duration: 0.8, stagger: 0.07, ease: "power4.out" }, "-=0.3")
  .to(".menu__footer", { opacity: 1, duration: 0.5 }, "-=0.4");

// set initial transformed states via GSAP (CSS has them pre-positioned)
gsap.set(".menu__bg", { yPercent: -100 });
gsap.set(".menu__link", { y: "110%" });

function toggleMenu(force) {
  menuOpen = force !== undefined ? force : !menuOpen;
  document.body.classList.toggle("menu-open", menuOpen);
  if (menuOpen) {
    menu.classList.add("is-open");
    lenis.stop();
    menuTl.timeScale(1).play();
  } else {
    lenis.start();
    menuTl.timeScale(1.6).reverse().eventCallback("onReverseComplete", () => {
      menu.classList.remove("is-open");
    });
  }
}
menuToggle.addEventListener("click", () => toggleMenu());

document.querySelectorAll("[data-menu-link]").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const target = link.getAttribute("href");
    toggleMenu(false);
    setTimeout(() => lenis.scrollTo(target, { offset: 0, duration: 1.6 }), 500);
  });
});

/* smooth anchor for non-menu links */
document.querySelectorAll('a[href^="#"]:not([data-menu-link])').forEach((a) => {
  a.addEventListener("click", (e) => {
    const target = a.getAttribute("href");
    if (target.length > 1 && document.querySelector(target)) {
      e.preventDefault();
      lenis.scrollTo(target, { duration: 1.6 });
    }
  });
});

/* ---------- Custom cursor ---------- */
const cursor = document.getElementById("cursor");
const follower = document.getElementById("cursor-follower");
const followerLabel = follower.querySelector(".cursor-follower__label");
let cx = -100, cy = -100, fx = -100, fy = -100;

window.addEventListener("mousemove", (e) => {
  cx = e.clientX;
  cy = e.clientY;
});

gsap.ticker.add(() => {
  fx += (cx - fx) * 0.14;
  fy += (cy - fy) * 0.14;
  cursor.style.transform = `translate(${cx}px, ${cy}px)`;
  follower.style.transform = `translate(${fx}px, ${fy}px)`;
});

document.querySelectorAll("[data-cursor]").forEach((el) => {
  el.addEventListener("mouseenter", () => {
    followerLabel.textContent = el.dataset.cursor;
    follower.classList.add("is-active");
  });
  el.addEventListener("mouseleave", () => follower.classList.remove("is-active"));
});

/* ---------- Magnetic elements ---------- */
document.querySelectorAll("[data-magnetic]").forEach((el) => {
  const strength = 0.35;
  el.addEventListener("mousemove", (e) => {
    const rect = el.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    gsap.to(el, { x: dx * strength, y: dy * strength, duration: 0.4, ease: "power3.out" });
  });
  el.addEventListener("mouseleave", () => {
    gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.4)" });
  });
});

/* ---------- Refresh on resize ---------- */
window.addEventListener("resize", () => ScrollTrigger.refresh());
