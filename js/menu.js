document.addEventListener("componentsLoaded", () => {
  const menuToggle = document.getElementById("menuToggle");
  const navigation = document.getElementById("navigation");

  if (!menuToggle || !navigation) {
    return;
  }

  const navigationLinks = navigation.querySelectorAll(
    ".navigation__link, .navigation__cta",
  );

  menuToggle.addEventListener("click", () => {
    const isOpen = navigation.classList.toggle("active");

    menuToggle.classList.toggle("active");

    menuToggle.setAttribute(
      "aria-expanded",
      String(isOpen),
    );

    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Закрыть меню" : "Открыть меню",
    );

    document.body.classList.toggle("menu-open", isOpen);
  });

  navigationLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navigation.classList.remove("active");

      menuToggle.classList.remove("active");

      menuToggle.setAttribute(
        "aria-expanded",
        "false",
      );

      menuToggle.setAttribute(
        "aria-label",
        "Открыть меню",
      );

      document.body.classList.remove("menu-open");
    });
  });
});