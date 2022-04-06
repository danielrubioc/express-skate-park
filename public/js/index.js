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
                    </td>
                </tr>
                `;
            });

            return (bodyTable.innerHTML = string);
        }
        console.log();
    } catch (error) {
        console.log(error);
    }
});
