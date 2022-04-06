document.addEventListener("DOMContentLoaded", async () => {
    try {
        const bodyTable = document.getElementById("bodyTable");
        let string = "";
        bodyTable.innerHTML = "";
        const res = await fetch("/api/v1/skaters", {
            method: "get",
        });
        const data = await res.json();
        if (!data.ok) {
            const skaters = data.skaters;
            skaters.forEach((skater, key) => {
                let status = skater.estado == 0 ? "En Revisión" : "Aprobado";
                const classname =
                    skater.estado == 0 ? "text-danger" : "text-success";
                let texto = skater.estado == 0 ? "" : "checked";
                string += `<tr>
                    <th scope="row">${key + 1}</th>
                    <td><div style="background-image: url(avatars/${
                        skater.foto
                    });"></div></td>
                    <td>${skater.nombre}</td>
                    <td>${skater.anos_experiencia}</td>
                    <td>${skater.especialidad}</td>
                    <td class="${classname} font-weight-bold">
                        ${status} 
                        <input class="status" value="true" type="checkbox" ${texto} data-id="${
                    skater.id
                }">
                    </td>
                    
                </tr>
                `;
            });

            setTimeout(() => {
                const inputs = document.querySelectorAll(".status");
                inputs.forEach((input) => {
                    input.addEventListener("change", async (event) => {
                        const formData = new FormData();
                        formData.append("id", event.target.dataset.id);
                        formData.append("estado", event.target.checked);
                        const res = await fetch("/api/v1/skater/edit-status", {
                            method: "post",
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem(
                                    "token"
                                )}`,
                            },
                            body: formData,
                        });
                        const data = await res.json();
                        if (!data.ok) {
                            console.log(data);
                        }
                        window.location.href = "/admin";
                    });
                });
            }, 500);

            return (bodyTable.innerHTML = string);
        }
    } catch (error) {
        console.log(error);
    }
});
