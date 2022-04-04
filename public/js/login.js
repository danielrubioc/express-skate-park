document.addEventListener("DOMContentLoaded", async () => {
    const formulario = document.getElementById("formulario");
    formulario.addEventListener("submit", async (e) => {
        e.preventDefault();
        const formData = new FormData(formulario);
        // para validar los datos
        //const [email, password] = [...datos.values()]
        try {
            const res = await fetch("/api/v1/login", {
                method: "post",
                body: formData,
            });
            const data = await res.json();
            if (!data.ok) {
                return alert(data.msg);
            }
            localStorage.setItem("token", data.token);
            window.location.href = "/datos";
        } catch (error) {
            console.log(error);
        }
    });
});
