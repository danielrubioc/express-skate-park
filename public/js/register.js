document.addEventListener("DOMContentLoaded", () => {
    formulario.addEventListener("submit", async (e) => {
        const formulario = document.getElementById("formulario");
        const divErrors = document.getElementById("errors");
        const formData = new FormData(formulario);
        const btnSubmit = document.getElementById("btnSubmit");
        btnSubmit.disabled = true;
        divErrors.innerHTML = "";
        e.preventDefault();

        try {
            const res = await fetch("/api/v1/skaters", {
                method: "post",
                body: formData,
            });
            const data = await res.json();
            btnSubmit.disabled = false;
            if (!data.ok) {
                const errorMessage = data.msg.split(",");
                let string = "";
                errorMessage.forEach((error) => {
                    string += `<p>${error}</p>`;
                });

                return (divErrors.innerHTML = string);
            }
            window.location.href = "/";
            /* localStorage.setItem("token", data.token);
            window.location.href = "/"; */
        } catch (error) {
            console.log(error);
        }
    });
});
