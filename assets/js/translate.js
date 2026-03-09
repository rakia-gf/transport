/**
 * Jouadi Transport — Script de traduction FR / AR
 * Intégration : ajouter <script src="./assets/js/translate.js" defer></script>
 * avant la fermeture </body>, après script.js
 */

const translations = {
  fr: {
    nav_home:    "Accueil",
    nav_about:   "À propos",
    nav_service: "Services",
    nav_contact: "Contact",

    hero_title_1: "Vers Toutes",
    hero_title_2: "les Directions",
    hero_text:    "Il existe de nombreuses variations de passages de Lorem Ipsum disponibles, mais la majorité",
    hero_btn:     "Expédiez avec nous",

    about_subtitle: "Qui nous sommes",
    about_title:    "Nous Sommes Jouadi Transport",
    about_text:     "Jouadi Transport est une entreprise de transport de confiance opérant entre la Tunisie, l'Italie, la Suisse et l'Allemagne. Nous sommes spécialisés dans des services de transport fiables et sécurisés vers et depuis ces pays, garantissant une livraison sûre et efficace avec un seul transporteur dédié. Notre mission est de fournir un service de haute qualité, de la ponctualité et la satisfaction du client. Nous nous engageons envers le professionnalisme, la responsabilité et le soin apporté à chaque envoi. Chez Jouadi Transport, nous croyons en l'établissement de relations à long terme basées sur la confiance, la fiabilité et l'excellence.",

    service_subtitle: "Tous les services",
    service_title:    "Reconnu pour nos services",
    service_text:     "Dans toutes les directions, nous veillons à ce que vos marchandises arrivent à temps et en parfait état. Parce que votre entreprise mérite l'excellence.",

    s1_title: "Transport International",
    s1_text:  "Transport direct entre la Tunisie, l'Italie, la Suisse et l'Allemagne. Les envois vers les Pays-Bas et l'Autriche sont livrés en toute sécurité via des services postaux fiables.",

    s2_title: "Manutention Sécurisée",
    s2_text:  "Vos marchandises sont traitées avec professionnalisme et responsabilité pour garantir la sécurité tout au long du trajet.",

    s3_title: "Livraison Rapide",
    s3_text:  "Nous nous engageons à assurer la ponctualité et l'efficacité de chaque envoi.",

    footer_quicklinks: "Liens rapides",
    footer_callus:     "Appelez-nous",
    footer_copyright:  "© 2026 Jouadi Transport. Tous droits réservés par",

    lang_toggle: "عربي",
  },

  ar: {
    nav_home:    "الرئيسية",
    nav_about:   "من نحن",
    nav_service: "الخدمات",
    nav_contact: "اتصل بنا",

    hero_title_1: "إلى جميع",
    hero_title_2: "الوجهات",
    hero_text:    "نوفر خدمات نقل موثوقة وآمنة بين تونس وأوروبا، مع ضمان وصول شحناتك في الوقت المحدد وبأمان تام.",
    hero_btn:     "شحن معنا",

    about_subtitle: "من نحن",
    about_title:    "نحن جوادي للنقل",
    about_text:     "جوادي للنقل شركة نقل موثوقة تعمل بين تونس وإيطاليا وسويسرا وألمانيا. متخصصون في تقديم خدمات نقل آمنة وموثوقة من وإلى هذه البلدان، مع ضمان التسليم الآمن والفعّال عبر سائق مخصص واحد. مهمتنا تقديم خدمة عالية الجودة مع الالتزام بالمواعيد ورضا العملاء. نؤمن بالمهنية والمسؤولية والعناية بكل شحنة. في جوادي للنقل، نسعى إلى بناء علاقات طويلة الأمد قائمة على الثقة والموثوقية والتميز.",

    service_subtitle: "جميع الخدمات",
    service_title:    "معروفون بخدماتنا",
    service_text:     "في جميع الاتجاهات، نحرص على وصول بضائعكم في الوقت المحدد وبحالة مثالية. لأن عملكم يستحق التميز.",

    s1_title: "النقل الدولي",
    s1_text:  "نقل مباشر بين تونس وإيطاليا وسويسرا وألمانيا. تُسلَّم الشحنات إلى هولندا والنمسا بأمان عبر خدمات بريدية موثوقة.",

    s2_title: "التداول الآمن",
    s2_text:  "تُعامَل بضائعكم باحترافية ومسؤولية لضمان سلامتها طوال الرحلة.",

    s3_title: "التوصيل السريع",
    s3_text:  "نلتزم بضمان الدقة والكفاءة في كل شحنة.",

    footer_quicklinks: "روابط سريعة",
    footer_callus:     "اتصل بنا",
    footer_copyright:  "© 2026 جوادي للنقل. جميع الحقوق محفوظة لـ",

    lang_toggle: "Français",
  }
};

let currentLang = "fr";

/* ─── Apply translations ─────────────────────────────────────────────────── */
function applyTranslations(lang) {
  const t = translations[lang];
  document.documentElement.lang = lang;
  document.documentElement.dir  = lang === "ar" ? "rtl" : "ltr";

  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (t[key] !== undefined) el.textContent = t[key];
  });

  // Service card titles (keep number span)
  document.querySelectorAll("[data-i18n-after-span]").forEach(el => {
    const key = el.getAttribute("data-i18n-after-span");
    if (el._i18nTextNode && t[key]) {
      el._i18nTextNode.textContent = " " + t[key];
    }
  });

  // Copyright (keep <a> tag, replace ALL text nodes with a single one)
  const copyright = document.querySelector("[data-i18n-copyright]");
  if (copyright) {
    // Remove all existing text nodes first
    Array.from(copyright.childNodes)
      .filter(n => n.nodeType === Node.TEXT_NODE)
      .forEach(n => n.remove());
    // Insert fresh text node before the <a> link
    const link = copyright.querySelector("a");
    const textNode = document.createTextNode(t.footer_copyright + " ");
    copyright.insertBefore(textNode, link);
  }

  // Update button label + active state (no size change, only visual state)
  const btn = document.getElementById("lang-toggle-btn");
  if (btn) {
    btn.textContent = t.lang_toggle;
    btn.setAttribute("data-active", lang === "ar" ? "true" : "false");
  }
}

function toggleLanguage() {
  currentLang = currentLang === "fr" ? "ar" : "fr";
  applyTranslations(currentLang);
}

/* ─── Inject data-i18n attributes automatically ──────────────────────────── */
function injectDataI18n() {
  const map = [
    { sel: '.navbar-link[href="#home"] span',    key: "nav_home"    },
    { sel: '.navbar-link[href="#about"] span',   key: "nav_about"   },
    { sel: '.navbar-link[href="#service"] span', key: "nav_service" },
    { sel: '.navbar-link[href="#footer"] span',  key: "nav_contact" },

    { sel: ".hero-title .span:first-child", key: "hero_title_1" },
    { sel: ".hero-title .span.small",       key: "hero_title_2" },
    { sel: ".hero-text",                    key: "hero_text"    },
    { sel: ".hero-btn",                     key: "hero_btn"     },

    { sel: "#about .section-subtitle", key: "about_subtitle" },
    { sel: "#about .section-title",    key: "about_title"    },
    { sel: "#about .section-text",     key: "about_text"     },

    { sel: "#service .section-subtitle", key: "service_subtitle" },
    { sel: "#service .section-title",    key: "service_title"    },
    { sel: "#service .section-text",     key: "service_text"     },

    { sel: "#service .service-list li:nth-child(1) .card-title", key: "s1_title", mode: "after-span" },
    { sel: "#service .service-list li:nth-child(1) .card-text",  key: "s1_text"  },
    { sel: "#service .service-list li:nth-child(2) .card-title", key: "s2_title", mode: "after-span" },
    { sel: "#service .service-list li:nth-child(2) .card-text",  key: "s2_text"  },
    { sel: "#service .service-list li:nth-child(3) .card-title", key: "s3_title", mode: "after-span" },
    { sel: "#service .service-list li:nth-child(3) .card-text",  key: "s3_text"  },

    { sel: ".footer-list .footer-list-title",       key: "footer_quicklinks" },
    { sel: ".footer-list ~ div .footer-list-title", key: "footer_callus"     },

    { sel: '.footer-link[href="#home"]',    key: "nav_home"    },
    { sel: '.footer-link[href="#about"]',   key: "nav_about"   },
    { sel: '.footer-link[href="#service"]', key: "nav_service" },
    { sel: '.footer-link[href="#footer"]',  key: "nav_contact" },
  ];

  map.forEach(({ sel, key, mode }) => {
    document.querySelectorAll(sel).forEach(el => {
      if (mode === "after-span") {
        el.setAttribute("data-i18n-after-span", key);
      } else {
        el.setAttribute("data-i18n", key);
      }
    });
  });

  const copyright = document.querySelector(".copyright");
  if (copyright) copyright.setAttribute("data-i18n-copyright", "1");

  // Rebuild card titles: keep <span>0X</span> + translatable text node
  document.querySelectorAll("[data-i18n-after-span]").forEach(el => {
    const span  = el.querySelector("span");
    const tNode = document.createTextNode("");
    el._i18nTextNode = tNode;
    if (span) {
      el.innerHTML = "";
      el.appendChild(span);
      el.appendChild(tNode);
    }
  });
}

/* ─── Navbar button + all styles ────────────────────────────────────────── */
function createNavLangButton() {

  /* === Inject CSS === */
  const style = document.createElement("style");
  style.textContent = `

    /* ── Lang button: fixed dimensions, NO size change ever ── */
    #lang-toggle-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 72px;
      height: 34px;
      padding: 0;
      flex-shrink: 0;

      font-family: 'Rubik', sans-serif;
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.5px;
      line-height: 1;
      cursor: pointer;

      border-radius: 6px;
      border: 2px solid #ec5e0b;
      box-sizing: border-box;
      outline: none;

      /* FR default: orange background, blue text */
      background: #ec5e0b;
      color: #0d0531;

      transition:
        background   0.25s ease,
        color        0.25s ease,
        border-color 0.25s ease,
        box-shadow   0.25s ease,
        translate    0.18s ease;
    }

    /* FR hover: blue background, orange text */
    #lang-toggle-btn:not([data-active="true"]):hover {
      background:   #0d0531;
      color:        #ec5e0b;
      border-color: #0d0531;
      box-shadow:   0 0 12px rgba(13, 5, 49, 0.5);
      translate: 0 -2px;
    }

    /* Click flash — no movement */
    #lang-toggle-btn:active {
      translate: 0 0;
      box-shadow: 0 0 0 3px rgba(236, 94, 11, 0.35);
      transition: box-shadow 0s;
    }

    /* AR active state: blue background, orange text */
    #lang-toggle-btn[data-active="true"] {
      background:   #0d0531;
      color:        #ec5e0b;
      border-color: #0d0531;
      box-shadow:   0 0 12px rgba(13, 5, 49, 0.4);
    }

    /* AR hover: orange background, blue text */
    #lang-toggle-btn[data-active="true"]:hover {
      background:   #ec5e0b;
      color:        #0d0531;
      border-color: #ec5e0b;
      box-shadow:   0 0 14px rgba(236, 94, 11, 0.5);
      translate: 0 -2px;
    }

    /* ── RTL global adjustments ── */
    [dir="rtl"] .navbar-link ion-icon,
    [dir="rtl"] .back-top-btn ion-icon {
      transform: scaleX(-1);
    }
    [dir="rtl"] .hero-content,
    [dir="rtl"] .about-content,
    [dir="rtl"] .service-card { text-align: right; }
    [dir="rtl"] .footer-brand,
    [dir="rtl"] .footer-list  { text-align: right; }
    [dir="rtl"] .social-list,
    [dir="rtl"] .contact-number {
      flex-direction: row-reverse;
      justify-content: flex-end;
    }
    [dir="rtl"] .hero-title { direction: rtl; }
  `;
  document.head.appendChild(style);

  /* === Create button === */
  const btn = document.createElement("button");
  btn.id = "lang-toggle-btn";
  btn.textContent = translations.fr.lang_toggle; // "عربي"
  btn.setAttribute("aria-label", "Changer la langue / تغيير اللغة");
  btn.setAttribute("data-active", "false");
  btn.addEventListener("click", toggleLanguage);

  /* === Insert into header, just before the hamburger button === */
  const headerContainer = document.querySelector(".header .container");
  const navOpenBtn      = document.querySelector(".nav-open-btn");

  if (headerContainer && navOpenBtn) {
    headerContainer.insertBefore(btn, navOpenBtn);
  } else if (headerContainer) {
    headerContainer.appendChild(btn);
  }
}

/* ─── Init ──────────────────────────────────────────────────────────────────*/
document.addEventListener("DOMContentLoaded", () => {
  injectDataI18n();
  createNavLangButton();
  applyTranslations("fr");
});