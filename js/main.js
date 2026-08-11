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