const getHome = async (req, res) => {
    return res.render("home");
};

const getLogin = async (req, res) => {
    return res.render("login");
};

const getRegister = async (req, res) => {
    return res.render("register");
};

const getAdmin = async (req, res) => {
    return res.render("admin");
};

const getDatos = async (req, res) => {
    return res.render("datos");
};

module.exports = {
    getHome,
    getLogin,
    getRegister,
    getAdmin,
    getDatos,
};
