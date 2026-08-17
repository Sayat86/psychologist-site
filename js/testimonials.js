document.addEventListener("DOMContentLoaded", () => {
  const testimonials = document.querySelectorAll(".testimonial");

  const previousButton = document.querySelector(
    ".testimonial-nav--prev",
  );

  const nextButton = document.querySelector(
    ".testimonial-nav--next",
  );

  const currentCounter = document.querySelector(
    ".testimonials__current",
  );

  if (
    !testimonials.length ||
    !previousButton ||
    !nextButton ||
    !currentCounter
  ) {
    return;
  }

  let currentIndex = 0;

  const showTestimonial = (index) => {
    testimonials.forEach((testimonial, i) => {
      testimonial.classList.toggle(
        "active",
        i === index,
      );
    });

    currentCounter.textContent = String(index + 1).padStart(
      2,
      "0",
    );
  };

  showTestimonial(currentIndex);

  nextButton.addEventListener("click", () => {
    currentIndex++;

    if (currentIndex >= testimonials.length) {
      currentIndex = 0;
    }

    showTestimonial(currentIndex);
  });

  previousButton.addEventListener("click", () => {
    currentIndex--;

    if (currentIndex < 0) {
      currentIndex = testimonials.length - 1;
    }

    showTestimonial(currentIndex);
  });
});