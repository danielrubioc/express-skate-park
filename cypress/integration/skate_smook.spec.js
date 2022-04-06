describe("login", () => {
    it("frontepage can be apened", () => {
        cy.visit("http://localhost:5000");
        cy.contains("Lista de participantes");
    });

    it("Click Iniciar Sesión", () => {
        cy.visit("http://localhost:5000");
        cy.contains("Iniciar Sesión").click();
    });

    it("Click input", () => {
        cy.visit("http://localhost:5000/login");
        cy.get("input:first").type("email@email.com");
    });
});
