document.addEventListener("DOMContentLoaded", async () => {

    const components = [
        {
            selector: "#header-placeholder",
            file: "components/header.html"
        },
        {
            selector: "#footer-placeholder",
            file: "components/footer.html"
        }
    ];


    for (const component of components) {

        const container =
            document.querySelector(
                component.selector
            );


        if (!container) {
            continue;
        }


        try {

            const response =
                await fetch(component.file);


            if (!response.ok) {

                throw new Error(
                    `HTTP ${response.status}`
                );

            }


            container.innerHTML =
                await response.text();


        } catch (error) {

            console.error(
                `Ошибка загрузки ${component.file}:`,
                error
            );

        }

    }


    document.dispatchEvent(
        new Event("componentsLoaded")
    );

});