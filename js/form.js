document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");

  if (!form) {
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const button = form.querySelector(".contact-form__button");

    if (!button) {
      return;
    }

    const originalText = button.innerHTML;

    button.disabled = true;

    button.innerHTML = `
            <span>Отправляем...</span>
        `;

    const formData = new FormData(form);

    try {
      const response = await fetch("php/send.php", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Не удалось отправить заявку.");
      }

      form.reset();

      button.innerHTML = `
                <span>Заявка отправлена ✓</span>
            `;

      setTimeout(() => {
        button.innerHTML = originalText;

        button.disabled = false;
      }, 4000);
    } catch (error) {
      console.error(error);

      button.innerHTML = `
                <span>Ошибка. Попробуйте ещё раз</span>
            `;

      setTimeout(() => {
        button.innerHTML = originalText;

        button.disabled = false;
      }, 4000);
    }
  });
});
