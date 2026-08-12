document.addEventListener("DOMContentLoaded", () => {

    const accordionGroups = [
        ".work-item",
        ".faq-item"
    ];


    accordionGroups.forEach((selector) => {

        const items = document.querySelectorAll(selector);


        items.forEach((item) => {

            const button = item.querySelector("button");


            if (!button) {
                return;
            }


            button.addEventListener("click", () => {

                const isActive =
                    item.classList.contains("active");


                items.forEach((otherItem) => {

                    otherItem.classList.remove("active");


                    const otherButton =
                        otherItem.querySelector("button");


                    if (otherButton) {

                        otherButton.setAttribute(
                            "aria-expanded",
                            "false"
                        );

                    }

                });


                if (!isActive) {

                    item.classList.add("active");

                    button.setAttribute(
                        "aria-expanded",
                        "true"
                    );

                }

            });

        });

    });

});