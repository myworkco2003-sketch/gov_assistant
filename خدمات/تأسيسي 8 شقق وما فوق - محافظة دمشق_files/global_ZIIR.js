(function () {
  const cssLink = document.querySelector('link[href*="global.css"]');
  const base = cssLink
    ? cssLink.getAttribute("href").replace("css/global.css", "")
    : "";
  const pagesPrefix = base + "pages/";

  const guideHref = base + "dalil/";

  function renderHeader() {
    const el = document.getElementById("site-header");
    if (!el) return;

    const activePage = el.dataset.active || "";

    const savedModel = localStorage.getItem("dm-header-model") || el.dataset.headerModel || "2";

    const navItems = [
      { label: "الرئيسية", href: `${base}index.html` },
      { label: "الأخبار", href: `${pagesPrefix}news-enas.html` },
      { label: "النظرة الثقافية", href: `${pagesPrefix}Cultural-model-5.html` },
      { label: "خدمات", aliases: ["الخدمات"], href: `${pagesPrefix}services-model-2.html` },
      { label: "دليل دمشق", href: guideHref },
      { label: "الاستثمارات", href: `${pagesPrefix}Investments.html` },
    ];

    const navLinks = navItems
      .map((item) => {
        const isActive =
          item.label === activePage ||
          (item.aliases || []).includes(activePage) ||
          (item.subItems || []).some((subItem) => subItem.label === activePage);

        if (!item.subItems) {
          return `<li class="nav__item"><a class="nav__link${isActive ? " is-active" : ""}" href="${item.href}"><span>${item.label}</span></a></li>`;
        }

        const subLinks = item.subItems
          .map(
            (subItem) =>
              `<li><a class="nav__submenu-link" href="${subItem.href}">${subItem.label}</a></li>`,
          )
          .join("");

        return `
          <li class="nav__item nav__item--has-menu${isActive ? " is-active" : ""}">
            <button
              class="nav__link nav__link--menu${isActive ? " is-active" : ""}"
              type="button"
              aria-expanded="false"
              aria-haspopup="true"
              data-menu-trigger
            >
              <span>${item.label}</span>
              <svg class="nav__chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="m7 10 5 5 5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>
            <ul class="nav__submenu" aria-label="${item.label}">${subLinks}</ul>
          </li>`;
      })
      .join("");

    el.outerHTML = `
<header class="header header--model-${savedModel}" id="siteHeader">
  <div class="container">
    <div class="header__row">
      <a href="${base}index.html" class="logo" aria-label="محافظة دمشق">
        <span class="logo__badge">
          <img src="${base}images/logo.png" alt="شعار محافظة دمشق" />
        </span>
        <span class="logo__text">
          <strong class="logo__title">محافظة دمشــــق</strong>
          <small class="logo__subtitle">DAMASCUS GOVERNORATE</small>
        </span>
      </a>

      <div class="header__bar">
        <button class="burger" id="burger" aria-label="القائمة" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>

        <nav class="nav" id="nav">
          <ul class="nav__list">${navLinks}</ul>

          <div class="nav__actions">
            <a href="#" class="btn-login" id="openAuth">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
              </svg>
              <span>تسجيل الدخول</span>
            </a>
          </div>
        </nav>
      </div>

      <div class="header__side">
        <a href="${pagesPrefix}contact.html" class="btn-contact" aria-label="تواصل معنا" title="تواصل معنا">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.86 19.86 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.81.36 1.6.68 2.34a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.74-1.25a2 2 0 0 1 2.11-.45c.74.32 1.53.55 2.34.68a2 2 0 0 1 1.72 2.04z"/>
          </svg>
        </a>
        <button class="btn-lang" id="langBtn" aria-label="تغيير اللغة" title="تغيير اللغة">

          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <ellipse cx="12" cy="12" rx="4" ry="10"/>
            <path d="M2 12h20"/>
            <path d="M4.5 7h15"/>
            <path d="M4.5 17h15"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</header>`;
  }

  function renderFooter() {
    const el = document.getElementById("site-footer");
    if (!el) return;

    el.outerHTML = `
    <footer class="footer pattern">
      <div class="footer__inner">
        <div class="footer__top">
          <div class="footer__brand">
            <div class="footer__identity">
              <a href="${base}index.html">
                <img class="footer__logo" src="${base}images/damascus-emblem.png" alt="محافظة دمشق" title="محافظة دمشق" />
              </a>
              <h2 class="footer__name">محافظة دمشق</h2>
            </div>
            <p class="footer__about">تسعى محافظة دمشق إلى الارتقاء بجودة الخدمات المقدمة للمواطنين وتلبية تطلعاتهم، مستندة إلى معايير السرعة، والكفاءة، والمصداقية في الإنجاز.</p>
            <ul class="socials">
              <li><a href="https://t.me/DamascusGov1" class="social" target="_blank" rel="noopener" aria-label="تيليغرام"><svg viewBox="0 0 448 512" fill="currentColor"><path d="M446.7 98.6l-67.6 318.8c-5.1 22.5-18.4 28.1-37.3 17.5l-103-75.9-49.7 47.8c-5.5 5.5-10.1 10.1-20.7 10.1l7.4-104.9 190.9-172.5c8.3-7.4-1.8-11.5-12.9-4.1L117.8 284 16.2 252.2c-22.1-6.9-22.5-22.1 4.6-32.7L418.2 66.4c18.4-6.9 34.5 4.1 28.5 32.2z"/></svg></a></li>
              <li><a href="https://x.com/DamascusGov1?s=20" class="social" target="_blank" rel="noopener" aria-label="إكس"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></a></li>
              <li><a href="https://www.youtube.com/@DamascusGov1" class="social" target="_blank" rel="noopener" aria-label="يوتيوب"><svg viewBox="0 0 510 510" fill="currentColor"><path d="M459,61.2C443.7,56.1,349.35,51,255,51c-94.35,0-188.7,5.1-204,10.2C10.2,73.95,0,163.2,0,255s10.2,181.05,51,193.8C66.3,453.9,160.65,459,255,459c94.35,0,188.7-5.1,204-10.2c40.8-12.75,51-102,51-193.8S499.8,73.95,459,61.2z M204,369.75v-229.5L357,255L204,369.75z"/></svg></a></li>
              <li><a href="https://www.facebook.com/DamascusGov1" class="social" target="_blank" rel="noopener" aria-label="فيسبوك"><svg viewBox="0 0 512 512" fill="currentColor"><path d="M504 256C504 119 393 8 256 8S8 119 8 256c0 123.78 90.69 226.38 209.25 245V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.28c-30.8 0-40.41 19.12-40.41 38.73V256h68.78l-11 71.69h-57.78V501C413.31 482.38 504 379.78 504 256z"/></svg></a></li>
              <li><a href="https://www.instagram.com/damascusgov1" class="social" target="_blank" rel="noopener" aria-label="انستغرام"><svg viewBox="0 0 448 512" fill="currentColor"><path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"/></svg></a></li>
            </ul>
          </div>
          <div class="footer__grid">
            <nav class="footer__col">
              <h3 class="footer__title">روابط سريعة</h3>
              <ul class="footer__list">
                <li><a href="${base}index.html">الرئيسية</a></li>
                <li><a href="${pagesPrefix}news-enas.html">الأخبار</a></li>
                <li><a href="${pagesPrefix}Cultural-model-5.html">النظرة الثقافية</a></li>
                <li><a href="${guideHref}">دليل دمشق</a></li>
                <li><a href="${pagesPrefix}Investments.html">الاستثمارات</a></li>
              </ul>
            </nav>
            <nav class="footer__col">
              <h3 class="footer__title">خدمات المواطنين</h3>
              <ul class="footer__list">
                <li><a href="${pagesPrefix}services-model-2.html">الخدمات</a></li>
                <li><a href="${pagesPrefix}electronic-services.html">الخدمات الإلكترونية</a></li>
                <li><a href="${pagesPrefix}contact.html">تواصل معنا</a></li>
              </ul>
            </nav>
            <div class="footer__col">
              <h3 class="footer__title">طرق التواصل</h3>
              <ul class="footer__contact">
                <li>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.86 19.86 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.81.36 1.6.68 2.34a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.74-1.25a2 2 0 0 1 2.11-.45c.74.32 1.53.55 2.34.68a2 2 0 0 1 1.72 2.04z"/></svg>
                  <span><a href="tel:+963112234567"><bdi dir="ltr">011-2234567</bdi></a><br /><a href="tel:+963999123456"><bdi dir="ltr">+963 999 123 456</bdi></a></span>
                </li>
                <li>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 6-10 7L2 6"/></svg>
                  <a href="mailto:damascus@moi.gov.sy"><bdi dir="ltr">damascus@moi.gov.sy</bdi></a>
                </li>
                <li>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  <span>دمشق — ساحة يوسف العظمة</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="footer__bottom">
          <p class="footer__copy">جميع الحقوق محفوظة - محافظة دمشق © 2026</p>
        </div>
      </div>
    </footer>
    <div class="header-switcher" id="headerSwitcher" aria-label="تبديل تصميم الهيدر">
      <button type="button" data-hmodel="1" title="النموذج 1">H1</button>
      <button type="button" data-hmodel="2" title="النموذج 2">H2</button>
      <button type="button" data-hmodel="3" title="النموذج 3">H3</button>
    </div>`;
  }

  function renderModals() {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = `
    <div class="auth-overlay" id="authOverlay">
      <div class="auth-modal" id="authWelcome">
        <button class="auth-modal__close" data-close>&times;</button>
        <img class="auth-modal__logo" src="${base}images/logo.png" alt="محافظة دمشق" />
        <span class="auth-modal__brand-name">محافظة دمشق</span>
        <h2 class="auth-modal__title">مرحباً بك في البوابة الإلكترونية</h2>
        <p class="auth-modal__subtitle">سجّل دخولك أو أنشئ حساباً جديداً للوصول إلى جميع الخدمات</p>
        <div class="auth-modal__actions">
          <button class="auth-btn auth-btn--primary" id="goLogin">تسجيل الدخول</button>
          <button class="auth-btn auth-btn--outline" id="goRegister">إنشاء حساب جديد</button>
        </div>
      </div>

      <div class="auth-modal" id="authLogin" style="display:none">
        <button class="auth-modal__close" data-close>&times;</button>
        <img class="auth-modal__logo" src="${base}images/logo.png" alt="محافظة دمشق" />
        <h2 class="auth-modal__title">تسجيل الدخول</h2>
        <form class="auth-form" onsubmit="return false">
          <div class="auth-field">
            <label>البريد الإلكتروني</label>
            <input type="email" placeholder="أدخل بريدك الإلكتروني" required />
          </div>
          <div class="auth-field">
            <label>كلمة المرور</label>
            <input type="password" placeholder="أدخل كلمة المرور" required />
          </div>
          <div class="auth-form__row">
            <a href="#" class="auth-forgot">نسيت كلمة المرور؟</a>
          </div>
          <button type="submit" class="auth-btn auth-btn--primary">دخول</button>
        </form>
        <div class="auth-modal__divider"><span>أو</span></div>
        <p class="auth-modal__switch">ليس لديك حساب؟ <a href="#" id="goRegister2">إنشاء حساب</a></p>
      </div>

      <div class="auth-modal auth-modal--register" id="authRegister" style="display:none">
        <button class="auth-modal__close" data-close>&times;</button>
        <img class="auth-modal__logo" src="${base}images/logo.png" alt="محافظة دمشق" />
        <h2 class="auth-modal__title">إنشاء حساب جديد</h2>
        <p class="auth-modal__subtitle">أدخل بياناتك للتسجيل في بوابة محافظة دمشق</p>
        <form class="auth-form auth-form--grid" onsubmit="return false">
          <div class="auth-field">
            <label>الاسم الأول <span class="req">*</span></label>
            <input type="text" required />
          </div>
          <div class="auth-field">
            <label>الاسم الأخير <span class="req">*</span></label>
            <input type="text" required />
          </div>
          <div class="auth-field">
            <label>البريد الإلكتروني <span class="req">*</span></label>
            <input type="email" required />
          </div>
          <div class="auth-field">
            <label>رقم الهاتف <span class="req">*</span></label>
            <input type="tel" required />
          </div>
          <div class="auth-field auth-field-full">
            <label>الصفة <span class="req">*</span></label>
            <div class="role-selector">
              <button type="button" class="role-pill">مواطن</button>
              <button type="button" class="role-pill">موظف حكومي</button>
              <button type="button" class="role-pill">مستثمر</button>
              <button type="button" class="role-pill">إعلامي</button>
            </div>
          </div>
          <div class="auth-field">
            <label>كلمة المرور <span class="req">*</span></label>
            <input type="password" required />
          </div>
          <div class="auth-field">
            <label>تأكيد كلمة المرور <span class="req">*</span></label>
            <input type="password" required />
          </div>
          <div class="auth-field auth-field-full">
            <label>المنطقة</label>
            <button type="button" class="auth-btn--location">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              تحديد الموقع تلقائياً
            </button>
          </div>
          <button type="submit" class="auth-btn auth-btn--primary auth-btn--submit">إنشاء الحساب</button>
        </form>
        <div class="auth-modal__divider"><span>أو</span></div>
        <p class="auth-modal__switch">لديك حساب؟ <a href="#" id="goLogin2">تسجيل الدخول</a></p>
      </div>
    </div>`;

    document.body.appendChild(wrapper.firstElementChild);
  }

  function loadAiChat() {
    const css = document.createElement("link");
    css.rel = "stylesheet";
    css.href = `${base}css/ai-chat.css`;
    document.head.appendChild(css);

    const js = document.createElement("script");
    js.src = `${base}js/ai-chat.js`;
    document.body.appendChild(js);
  }

  renderHeader();
  renderFooter();
  renderModals();
  loadAiChat();

  const header = document.querySelector(".header");
  const switcher = document.getElementById("headerSwitcher");

  const setHeaderHeight = () => {
    if (!header) return;
    document.documentElement.style.setProperty(
      "--header-h",
      header.offsetHeight + "px",
    );
  };

  function applyHeaderModel(modelNum) {
    if (!header) return;
    header.classList.remove(
      "header--model-1",
      "header--model-2",
      "header--model-3",
      "header--model-4",
    );
    header.classList.add(`header--model-${modelNum}`);
    localStorage.setItem("dm-header-model", String(modelNum));
    if (switcher) {
      switcher.querySelectorAll("button").forEach((btn) => {
        btn.classList.toggle("is-active", btn.dataset.hmodel === String(modelNum));
      });
    }
    setHeaderHeight();
  }

  const initialModel = localStorage.getItem("dm-header-model") || "2";
  applyHeaderModel(initialModel);

  if (switcher) {
    switcher.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-hmodel]");
      if (!btn) return;
      applyHeaderModel(btn.dataset.hmodel);
    });
  }

  const burger = document.getElementById("burger");
  const nav = document.getElementById("nav");

  if (burger && nav) {
    burger.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      burger.classList.toggle("is-open", open);
      burger.setAttribute("aria-expanded", String(open));
    });

    document.addEventListener("click", (e) => {
      if (!nav.contains(e.target) && !burger.contains(e.target)) {
        nav.classList.remove("is-open");
        burger.classList.remove("is-open");
        burger.setAttribute("aria-expanded", "false");
      }
    });
  }

  document.querySelectorAll(".nav__item--has-menu").forEach((menuItem) => {
    const menuTrigger = menuItem.querySelector("[data-menu-trigger]");
    if (!menuTrigger) return;

    let closeTimer = null;

    const openMenu = () => {
      clearTimeout(closeTimer);
      menuItem.classList.add("is-open");
      menuTrigger.setAttribute("aria-expanded", "true");
    };

    const closeMenu = () => {
      clearTimeout(closeTimer);
      closeTimer = setTimeout(() => {
        menuItem.classList.remove("is-open");
        menuTrigger.setAttribute("aria-expanded", "false");
      }, 150);
    };

    menuItem.addEventListener("mouseenter", openMenu);
    menuItem.addEventListener("mouseleave", closeMenu);

    menuTrigger.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = menuItem.classList.contains("is-open");
      if (isOpen) closeMenu();
      else openMenu();
    });

    document.addEventListener("click", (e) => {
      if (!menuItem.contains(e.target)) {
        menuItem.classList.remove("is-open");
        menuTrigger.setAttribute("aria-expanded", "false");
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        menuItem.classList.remove("is-open");
        menuTrigger.setAttribute("aria-expanded", "false");
      }
    });
  });

  setHeaderHeight();
  window.addEventListener("resize", setHeaderHeight);
  window.addEventListener("load", setHeaderHeight);

  if (header) {
    let lastY = window.scrollY;
    const SCROLL_THRESHOLD = 80;

    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastY;

      header.classList.toggle("is-scrolled", y > 24);

      if (y > SCROLL_THRESHOLD && delta > 6) {
        header.classList.add("is-hidden");
      } else if (delta < -4 || y <= SCROLL_THRESHOLD) {
        header.classList.remove("is-hidden");
      }

      lastY = y;
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  const authOverlay = document.getElementById("authOverlay");
  const authWelcome = document.getElementById("authWelcome");
  const authLogin = document.getElementById("authLogin");
  const authRegister = document.getElementById("authRegister");

  function showView(view) {
    [authWelcome, authLogin, authRegister].forEach((v) => {
      if (v) v.style.display = "none";
    });
    if (view) view.style.display = "";
  }

  function openAuth(view) {
    showView(view || authWelcome);
    if (authOverlay) authOverlay.classList.add("is-visible");
  }

  function closeAuth() {
    if (authOverlay) authOverlay.classList.remove("is-visible");
    setTimeout(() => showView(authWelcome), 300);
  }

  const openAuthBtn = document.getElementById("openAuth");
  if (openAuthBtn) {
    openAuthBtn.addEventListener("click", (e) => {
      e.preventDefault();
      openAuth(authLogin);
    });
  }

  const goLogin = document.getElementById("goLogin");
  const goLogin2 = document.getElementById("goLogin2");
  const goRegister = document.getElementById("goRegister");
  const goRegister2 = document.getElementById("goRegister2");

  if (goLogin) goLogin.addEventListener("click", () => showView(authLogin));
  if (goLogin2)
    goLogin2.addEventListener("click", (e) => {
      e.preventDefault();
      showView(authLogin);
    });
  if (goRegister)
    goRegister.addEventListener("click", () => showView(authRegister));
  if (goRegister2)
    goRegister2.addEventListener("click", (e) => {
      e.preventDefault();
      showView(authRegister);
    });

  document.querySelectorAll("[data-close]").forEach((btn) => {
    btn.addEventListener("click", closeAuth);
  });

  if (authOverlay) {
    authOverlay.addEventListener("click", (e) => {
      if (e.target === authOverlay) closeAuth();
    });
  }
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeAuth();
  });

  document.querySelectorAll(".role-selector").forEach((selector) => {
    selector.addEventListener("click", (e) => {
      const pill = e.target.closest(".role-pill");
      if (!pill) return;
      selector
        .querySelectorAll(".role-pill")
        .forEach((p) => p.classList.remove("is-active"));
      pill.classList.add("is-active");
    });
  });
})();