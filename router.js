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
    res.render("pages/profile", {
        valores: { nome: "", sobrenome: "", email: "", senha: "" },
    });
});

router.post("/fazerRegistro", user.registrarUsu, async function (req, res) { });

router.get("/login", async function (req, res) {
    res.render("pages/login", {
        valores: { email: "", senha: "" },
    });
});

router.post("/fazerLogin", user.loginUsuario, async function (req, res) {});
module.exports = router;
