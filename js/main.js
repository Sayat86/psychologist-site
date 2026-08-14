document.addEventListener("componentsLoaded", () => {
  const header = document.getElementById("header");

  const menuToggle = document.getElementById("menuToggle");

  const navigation = document.getElementById("navigation");

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

  /*
   * =========================
   * MOBILE MENU
   * =========================
   */

  if (!menuToggle || !navigation) {
    return;
  }

  menuToggle.addEventListener("click", () => {
    const isOpen = navigation.classList.contains("active");

    navigation.classList.toggle("active");

    menuToggle.classList.toggle("active");

    menuToggle.setAttribute("aria-expanded", String(!isOpen));

    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Открыть меню" : "Закрыть меню",
    );

    document.body.classList.toggle("menu-open", !isOpen);
  });

  /*
   * =========================
   * CLOSE MENU AFTER CLICK
   * =========================
   */

  const navigationLinks = navigation.querySelectorAll(
    ".navigation__link, .navigation__cta",
  );

  navigationLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navigation.classList.remove("active");

      menuToggle.classList.remove("active");

      menuToggle.setAttribute("aria-expanded", "false");

      menuToggle.setAttribute("aria-label", "Открыть меню");

      document.body.classList.remove("menu-open");
    });
  });
});
