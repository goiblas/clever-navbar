function Util() {}

Util.hasClass = function (el, className) {
  if (el.classList) return el.classList.contains(className);
  else
    return !!el
      .getAttribute("class")
      .match(new RegExp("(\\s|^)" + className + "(\\s|$)"));
};

Util.addClass = function (el, className) {
  var classList = className.split(" ");
  if (el.classList) el.classList.add(classList[0]);
  else if (!Util.hasClass(el, classList[0]))
    el.setAttribute("class", el.getAttribute("class") + " " + classList[0]);
  if (classList.length > 1) Util.addClass(el, classList.slice(1).join(" "));
};

Util.removeClass = function (el, className) {
  var classList = className.split(" ");
  if (el.classList) el.classList.remove(classList[0]);
  else if (Util.hasClass(el, classList[0])) {
    var reg = new RegExp("(\\s|^)" + classList[0] + "(\\s|$)");
    el.setAttribute("class", el.getAttribute("class").replace(reg, " "));
  }
  if (classList.length > 1) Util.removeClass(el, classList.slice(1).join(" "));
};

Util.toggleClass = function (el, className, bool) {
  if (bool) Util.addClass(el, className);
  else Util.removeClass(el, className);
};

(function () {
  var focusTab = document.getElementsByClassName("js-tab-focus"),
    shouldInit = false,
    outlineStyle = false,
    eventDetected = false;

  function detectClick() {
    if (focusTab.length > 0) {
      resetFocusStyle(false);
      window.addEventListener("keydown", detectTab);
    }
    window.removeEventListener("mousedown", detectClick);
    outlineStyle = false;
    eventDetected = true;
  }

  function detectTab(event) {
    if (event.keyCode !== 9) return;
    resetFocusStyle(true);
    window.removeEventListener("keydown", detectTab);
    window.addEventListener("mousedown", detectClick);
    outlineStyle = true;
  }

  function resetFocusStyle(bool) {
    var outlineStyle = bool ? "" : "none";
    for (var i = 0; i < focusTab.length; i++) {
      focusTab[i].style.setProperty("outline", outlineStyle);
    }
  }

  function initFocusTabs() {
    if (shouldInit) {
      if (eventDetected) resetFocusStyle(outlineStyle);
      return;
    }
    shouldInit = focusTab.length > 0;
    window.addEventListener("mousedown", detectClick);
  }

  initFocusTabs();
  window.addEventListener("initFocusTabs", initFocusTabs);
})();

function resetFocusTabsStyle() {
  window.dispatchEvent(new CustomEvent("initFocusTabs"));
}

// Animation menu button
(function () {
  var menuBtns = document.getElementsByClassName("js-anim-menu-btn");
  if (menuBtns.length > 0) {
    for (var i = 0; i < menuBtns.length; i++) {
      (function (i) {
        initMenuBtn(menuBtns[i]);
      })(i);
    }

    function initMenuBtn(btn) {
      btn.addEventListener("click", function (event) {
        event.preventDefault();
        var status = !Util.hasClass(btn, "anim-menu-btn--state-b");
        Util.toggleClass(btn, "anim-menu-btn--state-b", status);

        var event = new CustomEvent("anim-menu-btn-clicked", {
          detail: status,
        });
        btn.dispatchEvent(event);
      });
    }
  }
})();

// Main header
(function () {
  var mainHeader = document.getElementsByClassName("js-main-header");
  if (mainHeader.length > 0) {
    var menuTrigger = mainHeader[0].getElementsByClassName(
        "js-anim-menu-btn"
      )[0],
      firstFocusableElement = getMenuFirstFocusable();

    var focusMenu = false;

    menuTrigger.addEventListener("anim-menu-btn-clicked", function (event) {
      toggleMenuNavigation(event.detail);
    });

    // listen for key events
    window.addEventListener("keyup", function (event) {
      // listen for esc key
      if (
        (event.keyCode && event.keyCode == 27) ||
        (event.key && event.key.toLowerCase() == "escape")
      ) {
        // close navigation on mobile if open
        if (
          menuTrigger.getAttribute("aria-expanded") == "true" &&
          isVisible(menuTrigger)
        ) {
          focusMenu = menuTrigger; // move focus to menu trigger when menu is close
          menuTrigger.click();
        }
      }
      // listen for tab key
      if (
        (event.keyCode && event.keyCode == 9) ||
        (event.key && event.key.toLowerCase() == "tab")
      ) {
        // close navigation on mobile if open when nav loses focus
        if (
          menuTrigger.getAttribute("aria-expanded") == "true" &&
          isVisible(menuTrigger) &&
          !document.activeElement.closest(".js-main-header")
        )
          menuTrigger.click();
      }
    });

    // listen for resize
    var resizingId = false;
    window.addEventListener("resize", function () {
      clearTimeout(resizingId);
      resizingId = setTimeout(doneResizing, 500);
    });

    function getMenuFirstFocusable() {
      var focusableEle = mainHeader[0]
          .getElementsByClassName("main-header__nav")[0]
          .querySelectorAll(
            '[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable], audio[controls], video[controls], summary'
          ),
        firstFocusable = false;
      for (var i = 0; i < focusableEle.length; i++) {
        if (
          focusableEle[i].offsetWidth ||
          focusableEle[i].offsetHeight ||
          focusableEle[i].getClientRects().length
        ) {
          firstFocusable = focusableEle[i];
          break;
        }
      }

      return firstFocusable;
    }

    function isVisible(element) {
      return (
        element.offsetWidth ||
        element.offsetHeight ||
        element.getClientRects().length
      );
    }

    function doneResizing() {
      if (
        !isVisible(menuTrigger) &&
        Util.hasClass(mainHeader[0], "main-header--expanded")
      ) {
        menuTrigger.click();
      }
    }

    function toggleMenuNavigation(bool) {
      // toggle menu visibility on small devices
      Util.toggleClass(
        document.getElementsByClassName("main-header__nav")[0],
        "main-header__nav--is-visible",
        bool
      );
      Util.toggleClass(mainHeader[0], "main-header--expanded", bool);
      menuTrigger.setAttribute("aria-expanded", bool);
      if (bool) firstFocusableElement.focus();
      // move focus to first focusable element
      else if (focusMenu) {
        focusMenu.focus();
        focusMenu = false;
      }
    }
  }
})();

// Mobile float sign in
(function () {
  var floatSignIn = document.getElementsByClassName("js-float-sign-in")[0];

  if (floatSignIn) {
    var scrollOffset = parseInt(floatSignIn.getAttribute("data-offset")) || 0,
      scrolling = false;

    if (!window.requestAnimationFrame) {
      window.requestAnimationFrame = function (callback) {
        setTimeout(function () {
          callback();
        }, 250);
      };
    }

    window.addEventListener("scroll", function () {
      if (!scrolling) {
        scrolling = true;
        window.requestAnimationFrame(checkScrollPosition);
      }
    });

    function checkScrollPosition() {
      Util.toggleClass(
        floatSignIn,
        "is-collapsed",
        window.scrollY >= scrollOffset
      );
      scrolling = false;
    }
    checkScrollPosition();
  }
})();

// language selector
(function () {
  var mobileList = document.querySelector(".js-language-list-mobile"),
    desktopList = document.querySelector(".js-language-list-desktop"),
    inputFilter = document.querySelector(".js-language-filter"),
    desktopLabel = document.querySelector(".js-language-label");

  function getLocales() {
    return {
      "": "English",
      es: "Español",
      en: "English",
      af: "Afrikaans",
      sq: "Shqip",
      am: "አማርኛ",
      ar: "العربية",
      hy: "Հայերեն",
      az: "azərbaycan dili",
      eu: "euskara",
      be: "беларуская мова",
      bn: "বাংলা",
      bs: "bosanski jezik",
      bg: "български език",
      ca: "català, valencià",
      ny: "chiCheŵa",
      zh: "中文 (Zhōngwén)",
      co: "corsu",
      hr: "hrvatski jezik",
      cs: "čeština, český jazyk",
      da: "dansk",
      nl: "Nederlands",
      eo: "Esperanto",
      et: "eesti, eesti keel",
      tl: "Wikang Tagalog",
      fi: "suomi",
      fr: "français",
      fy: "Frysk",
      gl: "Galego",
      ka: "ქართული",
      de: "Deutsch",
      el: "ελληνικά",
      gu: "ગુજરાતી",
      ht: "Kreyòl",
      ha: "(Hausa) هَوُسَ",
      hi: "हिन्दी",
      hu: "magyar",
      is: "Íslenska",
      ig: "Asụsụ Igbo",
      id: "Bahasa",
      ga: "Gaeilge",
      it: "Italiano",
      ja: "日本語 (にほんご)",
      kn: "ಕನ್ನಡ",
      kk: "қазақ тілі",
      km: "ខ្មែរ",
      ko: "한국어",
      ku: "Kurdî, کوردی‎",
      ky: "Кыргызча, Кыргыз тили",
      lo: "ພາສາລາວ",
      la: "latine",
      lv: "latviešu valoda",
      lt: "lietuvių kalba",
      lb: "Lëtzebuergesch",
      mk: "македонски јазик",
      mg: "fiteny",
      ms: "Bahasa Melayu",
      ml: "മലയാളം",
      mt: "Malti",
      mi: "te reo Māori",
      mr: "मराठी",
      mn: "Монгол",
      my: "ဗမာစာ",
      ne: "नेपाली",
      ps: "پښتو",
      fa: "فارسی",
      pl: "polszczyzna",
      pt: "Português",
      pa: "ਪੰਜਾਬੀ",
      ro: "Română",
      ru: "русский",
      sm: "gagana fa'a Samoa",
      gd: "Gàidhlig",
      sr: "српски језик",
      st: "Sesotho",
      sn: "chiShona",
      sd: "सिन्धी‎",
      si: "සිංහල",
      sk: "Slovenčina",
      sl: "Slovenski Jezik",
      so: "Soomaaliga",
      su: "Basa Sunda",
      sw: "Kiswahili",
      sv: "Svenska",
      tg: "тоҷикӣ",
      ta: "தமிழ்",
      te: "తెలుగు",
      th: "ไทย",
      tr: "Türkçe",
      uk: "Українська",
      ur: "اردو",
      uz: "Oʻzbek",
      vi: "Tiếng Việt",
      cy: "Cymraeg",
      xh: "isiXhosa",
      yi: "ייִדיש",
      yo: "Yorùbá",
      zu: "isiZulu",
    };
  }

  function getLocaleCookie() {
    var name = "locale";

    var response = document.cookie
      .split(";")
      .map((c) => c.trim())
      .find((c) => c.substring(0, name.length + 1) === name + "=");
    if (response) {
      response = response.split("=");
      if (response.length > 1) response = response[1];
      else response = undefined;
    }
    return response;
  }

  function normalize(term) {
    return term.trim().toLowerCase();
  }

  // Desktop
  function printListLocalesDesktop() {
    var filter = normalize(inputFilter.value);

    var locales = getLocales();
    var fragment = document.createDocumentFragment();

    for (var localeKey in locales) {
      var locale = locales[localeKey];

      if (localeKey && normalize(locale).includes(filter)) {
        var li = document.createElement("li");
        var link = createLink(localeKey, locale);

        li.appendChild(link);
        fragment.appendChild(li);
      }
    }

    desktopList.innerHTML = ""; // clear
    desktopList.appendChild(fragment);

    function createLink(key, locale) {
      var link = document.createElement("a");

      link.setAttribute("href", "#");
      link.classList.add("main-header__dropdown-link");

      var text = document.createTextNode(locale);
      link.appendChild(text);

      link.onclick = function (ev) {
        ev.preventDefault();
        goToLocale(key);
      };

      return link;
    }
  }

  // Mobile
  function printListLocalesMobile() {
    var locales = getLocales();
    var fragment = document.createDocumentFragment();

    for (var localeKey in locales) {
      if (localeKey) {
        var option = document.createElement("option");
        option.value = localeKey;
        option.textContent = locales[localeKey];

        fragment.appendChild(option);
      }
    }

    mobileList.innerHTML = ""; // clear
    mobileList.appendChild(fragment);
  }

  function handleMobileSelector(ev) {
    const key = ev.target.value;
    goToLocale(key);
  }

  // Shared
  function printLocaleSelected(localeKey) {
    var locales = getLocales();

    desktopLabel.textContent = locales[localeKey];
    mobileList.value = localeKey;
  }

  function goToLocale(locale) {
    const path = getPath();
    setCookie("locale", locale);

    window.location.href = locale + path;

    function setCookie(name, value) {
      document.cookie = name + "=" + value;
    }
  }

  function getPath() {
    var t = getLocalePath();
    return t
      ? window.location.pathname.replace(`/${t}/`, "/")
      : window.location.pathname;
  }

  function getLocalePath() {
    var localeKeys = Object.keys(getLocales()).filter(Boolean);
    var candidateLocale = window.location.pathname.split("/")[1];

    if (localeKeys.indexOf(candidateLocale) >= 0) {
      return candidateLocale;
    }

    return false;
  }

  // Init
  function init() {
    // Print list
    printListLocalesDesktop();
    printListLocalesMobile();

    // Print locale selected
    var localeKeySelected = getLocaleCookie() || "en";
    printLocaleSelected(localeKeySelected);

    // Listeners
    inputFilter.addEventListener("keyup", printListLocalesDesktop);
    mobileList.addEventListener("change", handleMobileSelector);
  }

  // init
  document.addEventListener("DOMContentLoaded", init);
})();
