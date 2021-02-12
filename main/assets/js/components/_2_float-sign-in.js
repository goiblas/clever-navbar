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
