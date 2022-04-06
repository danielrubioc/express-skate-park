const express = require("express");
const expressFileUpload = require("express-fileupload");
const {
    getSkaters,
    getSkater,
    createSkater,
    loginSkater,
    updateSkater,
    updateSkaterStatus,
    deleteSkater,
} = require("../controllers/skaters.controller");
const {
    requireDatos,
    requireUpdate,
    validateRegister,
    validateUpdate,
} = require("../middlewares/requireDatos");
const { requireAuth } = require("../middlewares/requireAuth");
const router = express.Router();

router.use(
    expressFileUpload({
        abortOnLimit: true,
        // limits: { fileSize: 5 * 1024 * 1024 },
    })
);

router.get("/skaters", getSkaters);
router.post("/skaters", [validateRegister, requireDatos], createSkater);
router.get("/skater/edit", requireAuth, getSkater);
router.post(
    "/skater/edit",
    [requireAuth, validateUpdate, requireUpdate],
    updateSkater
);
router.post("/skater/edit-status", updateSkaterStatus);
router.post("/skater/delete", requireAuth, deleteSkater);
router.post("/login", loginSkater);

module.exports = router;
