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
