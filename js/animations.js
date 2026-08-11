document.addEventListener("DOMContentLoaded", () => {

    const heroElements = [
        document.querySelector(".hero__subtitle"),
        document.querySelector(".hero__title"),
        document.querySelector(".hero__description"),
        document.querySelector(".hero .button")
    ];


    heroElements.forEach((element, index) => {

        if (!element) {
            return;
        }

        element.style.opacity = "0";
        element.style.transform = "translateY(25px)";

        element.style.transition = `
            opacity 0.8s ease,
            transform 0.8s ease
        `;

        setTimeout(() => {

            element.style.opacity = "1";
            element.style.transform = "translateY(0)";

        }, 250 + (index * 180));

    });

});