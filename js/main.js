const header = document.getElementById("header");


function handleHeaderScroll() {

    if (window.scrollY > 40) {

        header.classList.add("scrolled");

    } else {

        header.classList.remove("scrolled");

    }

}


window.addEventListener(
    "scroll",
    handleHeaderScroll
);


handleHeaderScroll();

/*
 * ========================================
 * WORK ACCORDION
 * ========================================
 */




    button.addEventListener("click", () => {

        const isActive = item.classList.contains("active");


        /*
         * Close all other items
         */

        workItems.forEach((otherItem) => {

            otherItem.classList.remove("active");

            const otherButton =
                otherItem.querySelector(
                    ".work-item__button"
                );

            otherButton.setAttribute(
                "aria-expanded",
                "false"
            );

        });


        /*
         * Open selected item
         */

        if (!isActive) {

            item.classList.add("active");

            button.setAttribute(
                "aria-expanded",
                "true"
            );

        }

    });

});