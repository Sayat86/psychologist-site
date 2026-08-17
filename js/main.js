document.addEventListener("componentsLoaded", () => {
  const header = document.getElementById("header");


  /*
   * =========================
   * HEADER SCROLL
   * =========================
   */

  function handleHeaderScroll() {
    if (!header) {
      return;
    }

    if (window.scrollY > 40) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }

  window.addEventListener("scroll", handleHeaderScroll);

  handleHeaderScroll();

});
