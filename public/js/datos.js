document.addEventListener("DOMContentLoaded", async () => {
    const inputEmail = document.querySelector('[name="email"]');
    const inputNombre = document.querySelector('[name="nombre"]');
    const inputAniosExperiencia = document.querySelector(
        '[name="anos_experiencia"]'
    );
    const inputEspecialidad = document.querySelector('[name="especialidad"]');
    if (!localStorage.getItem("token")) {
        window.location.href = "/login";
    }
    try {
        const res = await fetch("/api/v1/skater/edit", {
            method: "get",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        const data = await res.json();
        const { anos_experiencia, email, especialidad, nombre } =
            await data.skater;

        inputEmail.value = email;
        inputNombre.value = nombre;
        inputAniosExperiencia.value = anos_experiencia;
        inputEspecialidad.value = especialidad;
    } catch (error) {
        console.log(error);
    }

    /*update*/
    const formulario = document.getElementById("formulario");
    formulario.addEventListener("submit", async (e) => {
        const divErrors = document.getElementById("errors");
        divErrors.innerHTML = "";
        e.preventDefault();
        const formData = new FormData(formulario);
        try {
            const res = await fetch("/api/v1/skater/edit", {
                method: "post",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: formData,
            });
            const data = await res.json();
            if (!data.ok) {
                const errorMessage = data.msg.split(",");
                let string = "";
                errorMessage.forEach((error) => {
                    string += `<p>${error}</p>`;
                });

                return (divErrors.innerHTML = string);
            }
            window.location.href = "/";
        } catch (error) {
            console.log(error);
        }
    });

    const btnDelete = document.getElementById("delete");
    btnDelete.addEventListener("click", async (e) => {
        try {
            const divErrors = document.getElementById("errors");
            divErrors.innerHTML = "";
            const res = await fetch("/api/v1/skater/delete", {
                method: "post",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            const data = await res.json();
            if (!data.ok) {
                const errorMessage = data.msg.split(",");
                let string = "";
                errorMessage.forEach((error) => {
                    string += `<p>${error}</p>`;
                });

                return (divErrors.innerHTML = string);
            }
            window.location.href = "/";
        } catch (error) {
            console.log(error);
        }
    });

    /*   */
});
