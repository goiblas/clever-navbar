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
