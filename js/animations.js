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
    .work-item,
    .return__image-wrapper,
    .return__content,
    .consultation__top,
    .consultation__title,
    .consultation__bottom,
    .testimonials__top,
    .testimonials__header,
    .testimonials__slider,
    .testimonials__navigation,
    .faq__top,
    .faq__intro,
    .faq__list,
    .contacts__top,
    .contacts__intro,
    .contacts__form-wrapper,

    /* ABOUT PAGE */
  .about-page-hero__top,
  .about-page-hero__content,
  .about-page-intro__image-wrapper,
  .about-page-intro__content,
  .about-page-section__header,
  .about-page-section__content,
  .about-page-space__layout,
  .about-page-approach__layout,
  .about-page-return__content,
  .about-page-cta__content,

    /* STORY PAGE */
  .story-page-hero__top,
  .story-page-hero__content,
  .story-page-image__wrapper,
  .story-page-section__top,
  .story-page-place__layout,
  .story-page-return__layout,
  .story-page-years__layout,
  .story-page-changed__layout,
  .story-page-return-self__content,
  .story-page-final__content,
  .story-page-cta__content
    `,
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
