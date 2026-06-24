const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const yearNode = document.querySelector("#year");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

window.addEventListener("load", () => {
  if (!location.hash || location.hash === "#home") {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }
});

if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}

if (menuToggle && header) {
  menuToggle.addEventListener("click", () => {
    const isOpen = header.classList.toggle("menu-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "关闭导航菜单" : "打开导航菜单");
  });
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href");
    const target = targetId ? document.querySelector(targetId) : null;

    if (!target) return;

    event.preventDefault();
    header?.classList.remove("menu-open");
    menuToggle?.setAttribute("aria-expanded", "false");
    target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  });
});

const navLinks = Array.from(document.querySelectorAll(".site-nav a"));
const navSections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const assetModal = document.querySelector(".asset-modal");
const assetPanel = document.querySelector(".asset-modal-panel");
const assetTitle = document.querySelector("#asset-title");
const assetDesc = document.querySelector("#asset-desc");
const assetGrid = document.querySelector("#asset-grid");
let lastAssetTrigger = null;

const assetGalleries = {
  qinshan: {
    title: "原创《钦山食魃》资产素材",
    desc: "原创世界观项目的山景主视觉、场景资产、怪物与人物设定，用来展示从概念到镜头画面的视觉开发过程。",
    items: [
      ["./assets/ai-projects/images/qinshan-mountain.webp", "钦山主视觉场景", "wide"],
      ["./assets/ai-projects/images/qinshan-1.webp", "荒野场景与世界观气质", ""],
      ["./assets/ai-projects/images/qinshan-2.webp", "原创怪物造型方向", ""],
      ["./assets/ai-projects/images/qinshan-scene-wide.webp", "干旱村落场景资产", "wide"],
      ["./assets/ai-projects/posters/qinshan-poster.webp", "项目封面视觉", ""]
    ]
  },
  cheating: {
    title: "《老公出轨我装傻》资产素材",
    desc: "都市 AI 短剧项目的视频帧、人物关系画面和场景素材，用来展示可剪辑镜头筛选与情绪场面组织。",
    items: [
      ["./assets/ai-projects/images/cheating-video-frame.webp", "视频内横屏对话画面", "wide"],
      ["./assets/ai-projects/images/cheating-1.webp", "都市人物关系素材", ""],
      ["./assets/ai-projects/images/cheating-2.webp", "短剧场景画面", ""],
      ["./assets/ai-projects/posters/cheating-poster.webp", "项目封面参考", ""]
    ]
  },
  umbrella: {
    title: "《千机伞演示动画》资产素材",
    desc: "道具演示动画的横屏画面、拆解结构和动作展示素材，重点呈现机关道具的视觉表达。",
    items: [
      ["./assets/ai-projects/images/umbrella-wide.webp", "千机伞横屏演示画面", "wide"],
      ["./assets/ai-projects/images/千机伞演示动画-2.webp", "机关形态展示", ""],
      ["./assets/ai-projects/images/千机伞演示动画-3.webp", "道具运动状态", ""],
      ["./assets/ai-projects/images/千机伞演示动画-4.webp", "道具细节画面", ""]
    ]
  },
  fight: {
    title: "《打斗燃剪》资产素材",
    desc: "动作分镜、枫叶练剑和雨夜打斗画面，用来展示镜头张力、动作链和燃剪节奏组织。",
    items: [
      ["./assets/ai-projects/images/fight-maple.webp", "枫叶练剑动作分镜", "wide"],
      ["./assets/ai-projects/images/fight-rain-storyboard.webp", "雨夜打斗分镜", "wide"],
      ["./assets/ai-projects/images/打斗燃剪-1.webp", "法天相地动作段落", ""],
      ["./assets/ai-projects/images/打斗燃剪-4.webp", "动作场景补充", ""]
    ]
  },
  takeaway: {
    title: "《让你送外卖仿真人剧》资产素材",
    desc: "AI 仿真人短剧项目入口，展示竖屏商业短剧封面与可交付镜头素材方向。",
    items: [
      ["./assets/ai-projects/posters/takeaway-poster.webp", "项目封面与人物关系", "tall"],
      ["./assets/ai-projects/images/workflow-1.webp", "流程素材参考", ""],
      ["./assets/ai-projects/images/workflow-2.webp", "场景资产参考", ""],
      ["./assets/ai-projects/images/workflow-3.webp", "分镜工作流参考", "wide"]
    ]
  },
  characters: {
    title: "个人原创人设资产素材",
    desc: "部分个人原创角色设定、服装造型和人物资产图，用来展示角色造型、审美方向与 AIGC 人设资产产出能力。",
    items: [
      ["./assets/ai-projects/images/character-hero.webp", "蓝色古装女子角色设定", "wide"],
      ["./assets/ai-projects/images/female-costume-green.webp", "绿色古装女子角色设定", "wide"],
      ["./assets/ai-projects/images/character-1.webp", "个人原创人设补充", ""],
      ["./assets/ai-projects/images/character-2.webp", "个人原创人设补充", ""]
    ]
  },
  pipa: {
    title: "《琵琶行短片》资产素材",
    desc: "古风短片的视频帧、人物设定与场景素材，用来展示文本视觉化和古风镜头氛围控制。",
    items: [
      ["./assets/ai-projects/images/pipa-video-frame.webp", "视频内横屏琵琶人物画面", "wide"],
      ["./assets/ai-projects/images/pipa-wide.webp", "角色造型资产", ""],
      ["./assets/ai-projects/images/琵琶行短片-1.webp", "人物设定补充", ""],
      ["./assets/ai-projects/images/琵琶行短片-4.webp", "古风角色与场景补充", ""]
    ]
  }
};

function openAssetGallery(key, trigger) {
  const gallery = assetGalleries[key];
  if (!gallery || !assetModal || !assetGrid || !assetTitle || !assetDesc) return;

  lastAssetTrigger = trigger || null;
  assetTitle.textContent = gallery.title;
  assetDesc.textContent = gallery.desc;
  const importedItems = (window.assetGalleryExtras?.[key] || []).map((item) => [item.src, item.caption, item.size || ""]);
  const seen = new Set();
  const mergedItems = [...gallery.items, ...importedItems].filter(([src]) => {
    if (seen.has(src)) return false;
    seen.add(src);
    return true;
  });

  assetGrid.innerHTML = mergedItems
    .map(([src, caption, size]) => `
      <figure class="asset-item ${size}">
        <img src="${src}" alt="${caption}" loading="lazy" />
        <figcaption>${caption}</figcaption>
      </figure>
    `)
    .join("");

  assetModal.classList.add("is-open");
  assetModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("assets-open");
  assetPanel?.focus();

  if (window.gsap && !reduceMotion) {
    gsap.fromTo(assetModal, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.28, ease: "power2.out" });
    gsap.fromTo(".asset-modal-panel", { y: 60, scale: 0.97 }, { y: 0, scale: 1, duration: 0.72, ease: "expo.out" });
    gsap.fromTo(".asset-item", { y: 42, autoAlpha: 0, clipPath: "inset(16% 0% 16% 0%)" }, {
      y: 0,
      autoAlpha: 1,
      clipPath: "inset(0% 0% 0% 0%)",
      duration: 0.82,
      stagger: 0.06,
      ease: "expo.out"
    });
  }
}

function closeAssetGallery() {
  if (!assetModal) return;
  assetModal.classList.remove("is-open");
  assetModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("assets-open");
  assetGrid && (assetGrid.innerHTML = "");
  lastAssetTrigger?.focus?.();
}

document.querySelectorAll(".asset-trigger").forEach((trigger) => {
  trigger.addEventListener("click", () => openAssetGallery(trigger.dataset.gallery, trigger));
  trigger.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openAssetGallery(trigger.dataset.gallery, trigger);
    }
  });
});

document.querySelectorAll("[data-close-assets]").forEach((closer) => {
  closer.addEventListener("click", closeAssetGallery);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && assetModal?.classList.contains("is-open")) {
    closeAssetGallery();
  }
});

if ("IntersectionObserver" in window) {
  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`);
        });
      });
    },
    { rootMargin: "-36% 0px -55% 0px", threshold: 0.01 }
  );

  navSections.forEach((section) => navObserver.observe(section));
}

function fallbackReveal() {
  const revealItems = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }
}

function initGsapAnimations() {
  if (!window.gsap || !window.ScrollTrigger || reduceMotion) {
    document.querySelector(".opening-curtain")?.remove();
    fallbackReveal();
    return;
  }

  document.body.classList.add("gsap-ready");
  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ ease: "expo.out", duration: 1.15 });

  const opening = gsap.timeline({ defaults: { ease: "expo.inOut" } });
  opening
    .set(".opening-curtain span", { scaleX: 0.08, autoAlpha: 1 })
    .set([".hero-name", ".hero-title-stack span", ".hero-signature", ".hero-actions .button", ".hero-entry article"], {
      autoAlpha: 0
    })
    .fromTo(".opening-curtain span", { scaleX: 0.08 }, { scaleX: 1, duration: 0.9 })
    .to(".opening-curtain span", { scaleX: 0, xPercent: 70, duration: 0.72 }, "+=0.1")
    .to(".opening-curtain", { yPercent: -105, duration: 1.25 }, "-=0.35")
    .fromTo(".hero-media", { scale: 1.16, filter: "brightness(0.42) saturate(0.8)" }, { scale: 1.03, filter: "brightness(1) saturate(1)", duration: 2.1 }, "-=1.12")
    .fromTo(".hero-name", { y: 34, letterSpacing: "0.72em", autoAlpha: 0 }, { y: 0, letterSpacing: "0.42em", autoAlpha: 1, duration: 1.05 }, "-=1.35")
    .fromTo(".hero-title-stack span", { yPercent: 120, scaleY: 0.46, skewY: 4, autoAlpha: 0, transformOrigin: "0% 100%" }, {
      yPercent: 0,
      scaleY: 1,
      skewY: 0,
      autoAlpha: 1,
      duration: 1.55,
      stagger: 0.16
    }, "-=0.82")
    .fromTo(".hero-signature", { y: 34, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1.05 }, "-=0.72")
    .fromTo(".hero-actions .button", { y: 22, scale: 0.94, autoAlpha: 0 }, { y: 0, scale: 1, autoAlpha: 1, duration: 0.92, stagger: 0.08 }, "-=0.62")
    .fromTo(".hero-entry article", { y: 38, rotateX: -12, autoAlpha: 0 }, { y: 0, rotateX: 0, autoAlpha: 1, duration: 1.1, stagger: 0.12 }, "-=0.78");

  gsap.utils.toArray(".section").forEach((section) => {
    const heading = section.querySelector(".section-head h2, .contact-copy h2");
    const label = section.querySelector(".section-label");
    const lead = section.querySelector(".section-head p:last-child");
    const cards = section.querySelectorAll(".featured-preview, .project-card, .bento-wall figure, .timeline-pipeline li, .tool-group, .resume-list article, .future-card, .contact-actions .button, .link-panel .button");

    if (label) {
      gsap.fromTo(label, { x: -42, autoAlpha: 0 }, {
        x: 0,
        autoAlpha: 1,
        duration: 0.85,
        scrollTrigger: { trigger: section, start: "top 78%", once: true }
      });
    }

    if (heading) {
      gsap.fromTo(heading, { y: 120, scaleY: 0.58, skewY: 3, autoAlpha: 0, transformOrigin: "0% 100%" }, {
        y: 0,
        scaleY: 1,
        skewY: 0,
        autoAlpha: 1,
        duration: 1.25,
        scrollTrigger: { trigger: section, start: "top 76%", once: true }
      });
    }

    if (lead) {
      gsap.fromTo(lead, { y: 34, autoAlpha: 0 }, {
        y: 0,
        autoAlpha: 1,
        duration: 0.95,
        scrollTrigger: { trigger: section, start: "top 72%", once: true }
      });
    }

    if (cards.length) {
      gsap.fromTo(cards, { y: 74, scale: 0.96, autoAlpha: 0, filter: "blur(8px)" }, {
        y: 0,
        scale: 1,
        autoAlpha: 1,
        filter: "blur(0px)",
        duration: 1.15,
        stagger: { each: 0.08, from: "start" },
        scrollTrigger: { trigger: section, start: "top 68%", once: true }
      });
    }
  });

  gsap.utils.toArray(".project-card img, .bento-wall img, .featured-preview img").forEach((img) => {
    const holder = img.closest(".project-card, figure, .featured-preview");
    gsap.fromTo(img, { clipPath: "inset(18% 0% 18% 0%)", scale: 1.12 }, {
      clipPath: "inset(0% 0% 0% 0%)",
      scale: 1.02,
      duration: 1.35,
      scrollTrigger: { trigger: holder || img, start: "top 78%", once: true }
    });

    gsap.to(img, {
      yPercent: -6,
      ease: "none",
      scrollTrigger: {
        trigger: holder || img,
        start: "top bottom",
        end: "bottom top",
        scrub: 0.8
      }
    });
  });

  gsap.to(".light-pillar-bg", {
    xPercent: 2,
    yPercent: -1.5,
    ease: "none",
    scrollTrigger: {
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      scrub: 1
    }
  });
}

window.addEventListener("load", initGsapAnimations);
