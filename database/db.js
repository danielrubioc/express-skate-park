require("dotenv").config();
const { Pool } = require("pg");

const connectionString =
    process.env.DATABASE_URL ||
    "postgresql://postgres:root@localhost:5432/skatepark";

const pool = process.env.DATABASE_URL
    ? new Pool({
          connectionString: connectionString,
          ssl: { rejectUnauthorized: false },
      })
    : new Pool({ connectionString });

const getSkatersDB = async () => {
    const client = await pool.connect();
    try {
        const respuesta = await client.query(
            "SELECT * FROM skaters ORDER BY id"
        );
        //console.log(respuesta);
        return {
            ok: true,
            skaters: respuesta.rows,
        };
    } catch (error) {
        //console.log(error);
        return {
            ok: false,
            msg: error.message,
        };
    } finally {
        client.release();
    }
};

const getSkaterDB = async (id) => {
    const client = await pool.connect();
    try {
        const query = {
            text: "SELECT email, nombre, anos_experiencia, especialidad  FROM skaters where id= $1;",
            values: [id],
        };
        const respuesta = await client.query(query);
        //console.log(respuesta);
        return {
            ok: true,
            skaters: respuesta.rows[0],
        };
    } catch (error) {
        //console.log(error);
        return {
            ok: false,
            msg: error.message,
        };
    } finally {
        client.release();
    }
};

const getSkaterByEmailDB = async (email) => {
    const client = await pool.connect();
    try {
        const query = {
            text: "SELECT * FROM skaters where email= $1;",
            values: [email],
        };
        const respuesta = await client.query(query);
        return {
            ok: true,
            skater: respuesta.rows[0],
        };
    } catch (error) {
        //console.log(error);
        return {
            ok: false,
            msg: error.message,
        };
    } finally {
        client.release();
    }
};

const createSkaterDB = async (data) => {
    const client = await pool.connect();
    const {
        nombre,
        email,
        password,
        anos_experiencia,
        especialidad,
        estado,
        foto,
    } = data;

    const query = {
        text: "INSERT INTO skaters (email, nombre, password, anos_experiencia, especialidad, foto, estado) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *",
        values: [
            email,
            nombre,
            password,
            anos_experiencia,
            especialidad,
            foto,
            estado,
        ],
    };

    try {
        const respuesta = await client.query(query);
        const { id } = respuesta.rows[0];
        return {
            ok: true,
            id,
        };
    } catch (error) {
        console.log(error);
        if (error.code === "23505") {
            return {
                ok: false,
                msg: "Ya existe el email registrado",
            };
        }
        return {
            ok: false,
            msg: error.message,
        };
    } finally {
        client.release();
    }
};

const updateSkaterDB = async (data) => {
    const client = await pool.connect();
    try {
        const { id, nombre, password, anos_experiencia, especialidad } = data;
        const query = {
            text: "UPDATE skaters SET nombre = $1, password = $2, anos_experiencia = $3, especialidad = $4 WHERE id = $5 RETURNING*;",
            values: [nombre, password, anos_experiencia, especialidad, id],
        };
        const respuesta = await client.query(query);
        return {
            ok: true,
            skaters: respuesta.rows,
        };
    } catch (error) {
        //console.log(error);
        return {
            ok: false,
            msg: error.message,
        };
    } finally {
        client.release();
    }
};

const updateSkaterStatusDB = async (data) => {
    const client = await pool.connect();
    try {
        const { id, estado } = data;
        const query = {
            text: "UPDATE skaters SET estado = $1  WHERE id = $2 RETURNING*;",
            values: [estado, id],
        };
        const respuesta = await client.query(query);
        return {
            ok: true,
            skater: respuesta.rows[0],
        };
    } catch (error) {
        return {
            ok: false,
            msg: error.message,
        };
    } finally {
        client.release();
    }
};

const deleteSkaterDB = async (data) => {
    const client = await pool.connect();
    try {
        const { id } = data;
        const query = {
            text: "DELETE FROM skaters WHERE id=$1 RETURNING*;",
            values: [id],
        };
        const respuesta = await client.query(query);
        return {
            ok: true,
            skater: respuesta.rows[0],
        };
    } catch (error) {
        //console.log(error);
        return {
            ok: false,
            msg: error.message,
        };
    } finally {
        client.release();
    }
};

module.exports = {
    getSkatersDB,
    getSkaterDB,
    createSkaterDB,
    getSkaterByEmailDB,
    updateSkaterDB,
    updateSkaterStatusDB,
    deleteSkaterDB,
};
