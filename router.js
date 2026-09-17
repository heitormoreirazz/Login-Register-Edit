var express = require("express");
var user = require("./controller/user");
var router = express.Router();
const bcrypt = require("bcrypt");
var salt = bcrypt.genSaltSync(12);
var connection = require("./config/pool_conexoes");
const flash = require('connect-flash');

router.get("/", async function (req, res) {
    const email = req.session ? req.session.email : "";
    res.render("pages/index", {
        email: email,
        userId: req.session ? req.session.userId : null,
        valores: { nome: "", sobrenome: "", email: "", senha: "" },
    });
});

router.get("/register", async function (req, res) {
    res.render("pages/register", {
        valores: { nome: "", sobrenome: "", email: "", senha: "" },
    });
});


router.get("/profile", async function (req, res) {
    const session = req.session || {};

    res.render("pages/profile", {
        nome: session.nome || "",
        sobrenome: session.sobrenome || "",
        email: session.email || "",
        logradouro: session.logradouro || session.logrado || "",
        numero: session.numero || "",
        complemento: session.complemento || "",
        bairro: session.bairro || "",
        cidade: session.cidade || "",
        estado: session.estado || "",
    });
});

router.post("/fazerRegistro", user.registrarUsu, async function (req, res) { });

router.get("/login", async function (req, res) {
    const session = req.session || {};

    res.render("pages/login", {
        valores: {
            email: session.email || "",
            senha: "",
            login: session.login || false,
            nome: session.nome || "",
            sobrenome: session.sobrenome || "",
            userId: session.userId || null,
        },
    });
});

router.post("/fazerLogin", user.loginUsuario, async function (req, res) {});
module.exports = router;
