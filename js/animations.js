document.addEventListener("DOMContentLoaded", () => {
  /*
   * ========================================
   * HERO ANIMATION
   * ========================================
   */

  const heroElements = [
    document.querySelector(".hero__subtitle"),
    document.querySelector(".hero__title"),
    document.querySelector(".hero__description"),
    document.querySelector(".hero .button"),
  ];

  heroElements.forEach((element, index) => {
    if (!element) {
      return;
    }

    element.classList.add("animate-on-load");

    setTimeout(
      () => {
        element.classList.add("is-visible");
      },
      250 + index * 180,
    );
  });

  /*
   * ========================================
   * SCROLL ANIMATIONS
   * ========================================
   */

  const animatedElements = document.querySelectorAll(
    `
    .about__image-wrapper,
    .about__content,
    .approach__header,
    .approach__intro,
    .approach-step,
    .work__header,
    .work__intro,
    .work-item
    `
);

  if (!animatedElements.length) {
    return;
  }

  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");

        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.15,
    },
  );

  animatedElements.forEach((element) => {
    element.classList.add("animate-on-scroll");

    observer.observe(element);
  });
});
