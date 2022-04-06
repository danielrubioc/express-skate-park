const bcrypt = require("bcryptjs");
/* const { nanoid } = require("nanoid"); */
const fs = require("fs");
const jwt = require("jsonwebtoken");
const {
    getSkatersDB,
    getSkaterDB,
    createSkaterDB,
    getSkaterByEmailDB,
    updateSkaterDB,
    updateSkaterStatusDB,
    deleteSkaterDB,
} = require("../database/db");
const path = require("path");

const getSkaters = async (req, res) => {
    const respuesta = await getSkatersDB();
    if (!respuesta.ok) {
        return res.status(500).json({ msg: respuesta.msg });
    }
    return res.json({ skaters: respuesta.skaters });
};

const getSkater = async (req, res) => {
    const user_id = req.id;
    const respuesta = await getSkaterDB(user_id);
    if (!respuesta.ok) {
        return res.status(500).json({ msg: respuesta.msg });
    }
    return res.json({ skater: respuesta.skaters });
};

const createSkater = async (req, res) => {
    try {
        // validaciones
        const { nombre, email, password, anos_experiencia, especialidad } =
            req.body;
        const pathFoto = req.pathFoto;
        const { foto } = req.files;
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const respuesta = await createSkaterDB({
            nombre,
            email,
            password: hashPassword,
            anos_experiencia,
            especialidad,
            estado: 0,
            foto: pathFoto,
        });

        if (!respuesta.ok) {
            throw new Error(respuesta.msg);
        }

        // guardar img
        foto.mv(
            path.join(__dirname, "../public/avatars/", req.pathFoto),
            (err) => {
                if (err) throw new Error("No se puede guardar la img");
            }
        );

        const payload = { id: respuesta.id };
        const token = jwt.sign(payload, process.env.JWT_SECRET);

        return res.json({
            ok: true,
            token,
        });
    } catch (error) {
        // console.log(error);
        return res.status(400).json({
            ok: false,
            msg: error.message,
        });
    }
};

const updateSkater = async (req, res) => {
    try {
        // validaciones
        const { nombre, password, anos_experiencia, especialidad } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);
        const respuesta = await updateSkaterDB({
            id: req.id,
            nombre,
            password: hashPassword,
            anos_experiencia,
            especialidad,
        });

        if (!respuesta.ok) {
            throw new Error(respuesta.msg);
        }

        const payload = { id: respuesta.id };
        const token = jwt.sign(payload, process.env.JWT_SECRET);

        return res.json({
            ok: true,
            token,
        });
    } catch (error) {
        // console.log(error);
        return res.status(400).json({
            ok: false,
            msg: error.message,
        });
    }
};

const updateSkaterStatus = async (req, res) => {
    try {
        // validaciones
        const { id, estado } = req.body;
        //console.log("#dsad");
        const respuesta = await updateSkaterStatusDB({
            id,
            estado,
        });

        if (!respuesta.ok) {
            throw new Error(respuesta.msg);
        }

        if (!respuesta.skater) {
            throw new Error("No existe el skater");
        }

        return res.json({
            ok: true,
            skater: respuesta.skater,
        });
    } catch (error) {
        // console.log(error);
        return res.status(400).json({
            ok: false,
            msg: error.message,
        });
    }
};

const loginSkater = async (req, res) => {
    try {
        const { email, password } = req.body;
        // validar campos del body
        if (!email?.trim() || !password?.trim()) {
            throw new Error("Algunos campos están vacios");
        }

        // ver si email existe en DB
        const respuesta = await getSkaterByEmailDB(email);

        if (!respuesta.ok) {
            throw new Error(respuesta.msg);
        }

        if (!respuesta.skater) {
            throw new Error("No existe el email registrado");
        }

        // ver si el password coincide con el pass del DB
        const { skater } = respuesta;
        //console.log(skater);
        const comparePassword = await bcrypt.compare(password, skater.password);
        //console.log(comparePassword);
        if (!comparePassword) {
            throw new Error("Contraseña incorrecta");
        }

        // generar JWT
        const payload = { id: skater.id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        return res.json({
            ok: true,
            token,
        });
    } catch (error) {
        //console.log(error);
        return res.status(400).json({
            ok: false,
            msg: error.message,
        });
    }
};

const deleteSkater = async (req, res) => {
    try {
        const respuesta = await deleteSkaterDB({
            id: req.id,
        });

        if (!respuesta.ok) {
            throw new Error(respuesta.msg);
        }
        const { skater } = respuesta;
        fs.unlink(
            path.join(__dirname, "../public/avatars/", skater.foto),
            (err) => {
                if (err) {
                    return res.send("fallo eliminar archivo");
                }
            }
        );

        return res.json({
            ok: true,
            skater,
        });
    } catch (error) {
        // console.log(error);
        return res.status(400).json({
            ok: false,
            msg: error.message,
        });
    }
};

module.exports = {
    getSkaters,
    getSkater,
    createSkater,
    loginSkater,
    updateSkater,
    updateSkaterStatus,
    deleteSkater,
};
