const express = require("express");
const expressFileUpload = require("express-fileupload");
const {
    getHome,
    getLogin,
    getRegister,
    getAdmin,
    getDatos,
} = require("../controllers/public.controller");
const router = express.Router();

router.use(
    expressFileUpload({
        abortOnLimit: true,
        // limits: { fileSize: 5 * 1024 * 1024 },
    })
);

router.get("/", getHome);
router.get("/login", getLogin);
router.get("/registro", getRegister);
router.get("/admin", getAdmin);
router.get("/datos", getDatos);

module.exports = router;
