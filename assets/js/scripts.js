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
