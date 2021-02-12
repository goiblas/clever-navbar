(function () {
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
    const name = "locale";

    let response = document.cookie
      .split(";")
      .map((c) => c.trim())
      .find((c) => c.substring(0, name.length + 1) === name + "=");
    if (response) {
      response = response.split("=");
      if (response.length > 1) response = response[1];
      else response = undefined;
    }
    console.log(document.cookie);
    return response;
  }

  function setCookie(name, value) {
    document.cookie = name + "=" + value;
  }

  function goToLocale() {
    //const locale = $(this).attr("data-locale");
    setCookie("locale", locale);

    window.location.href = "/";
  }

  console.log(getLocales());
})();
