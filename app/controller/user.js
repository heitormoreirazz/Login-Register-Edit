var express = require("express");
var router = express.Router();
const bcrypt = require("bcrypt");
var salt = bcrypt.genSaltSync(12);
var connection = require("../config/pool_conexoes");
const flash = require('connect-flash');

const registrarUsuario = async (nome, sobrenome, email, senha) => {
    const senhaHash = await bcrypt.hash(senha, salt);
    const query = "INSERT INTO usuario (nome, sobrenome, email, senha) VALUES ($1, $2, $3, $4)";
    const values = [nome, sobrenome, email, senhaHash];

    const result = await connection.query(query, values);
    return result;
};

const registrarUsu = async (req, res) => {
    const { nome, sobrenome, email, senha } = req.body;
    try {
        await registrarUsuario(nome, sobrenome, email, senha);
        console.log('Registro bem-sucedido!');
        res.redirect('/login');
    } catch (error) {
        console.error('Erro ao registrar usuário:', error);
        res.redirect('/register');
    }
};

const loginUsuario = async (req, res) => {
    const { email, senha } = req.body;
    try {
        const query = "SELECT * FROM usuario WHERE email = $1";
        const values = [email];
        const result = await connection.query(query, values);

        if (result.rows.length === 0) {
            console.log("Usuário não encontrado");
            res.redirect("/login");
            return;
        }

        const usuario = result.rows[0];
        const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

        if (!senhaCorreta) {
            console.log("Senha incorreta");
            res.redirect("/login");
            return;
        }
        req.session.nome = usuario.nome;
        req.session.sobrenome = usuario.sobrenome;
        req.session.logradouro = usuario.logradouro;
        req.session.numero = usuario.numero;
        req.session.complemento = usuario.complemento;
        req.session.cep = usuario.cep;
        req.session.bairro = usuario.bairro;
        req.session.cidade = usuario.cidade;
        req.session.estado = usuario.estado;
        req.session.userId = usuario.id;
        req.session.email = usuario.email;

        console.log("Login bem-sucedido!");
        res.redirect("/profile");
    } catch (error) {
        console.error("Erro ao fazer login:", error);
        res.redirect("/login");
    }
};

const editarEnderecoUsuario = async (req, res) => {
    const { logradouro, numero, complemento, bairro, cidade, estado, cep } = req.body;
    const userId = req.session?.userId;

    if (!userId) {
        return res.redirect("/login");
    }

    try {
        const query = "UPDATE usuario SET logradouro = $1, numero = $2, complemento = $3, bairro = $4, cidade = $5, estado = $6, cep = $7 WHERE id = $8";
        const values = [logradouro, numero, complemento, bairro, cidade, estado, cep, userId];

        const result = await connection.query(query, values);
        if (result.rowCount === 0) {
            console.error("Nenhum usuário encontrado para atualizar o endereço:", userId);
            return res.redirect("/profile");
        }

        Object.assign(req.session, { logradouro, numero, complemento, cep, bairro, cidade, estado });
        console.log("Endereço atualizado com sucesso!");
        res.redirect("/profile");
    } catch (error) {
        console.error("Erro ao atualizar endereço:", error);
        res.redirect("/profile");
    }
};

const editarInfoUsuario = async (req, res) => {
    const { nome, sobrenome, email, celular, CPF, bio } = req.body;
    const userId = req.session?.userId;

    if (!userId) {
        return res.redirect("/login");
    }

    try {
        const query = "UPDATE usuario SET nome = $1, sobrenome = $2, email = $3, celular = $4, CPF = $5, bio = $6 WHERE id = $7";
        const values = [nome, sobrenome, email, celular, CPF, bio, userId];

        const result = await connection.query(query, values);
        if (result.rowCount === 0) {
            console.error("Nenhum usuário encontrado para atualizar as informações:", userId);
            return res.redirect("/profile");
        }

        Object.assign(req.session, { nome, sobrenome, email, celular, CPF, bio });
        console.log("Informações do usuário atualizadas com sucesso!");
        res.redirect("/profile");
    } catch (error) {
        console.error("Erro ao atualizar informações do usuário:", error);
        res.redirect("/profile");
    }
};



module.exports = {
    registrarUsu,
    loginUsuario,
    editarEnderecoUsuario,
    editarInfoUsuario
};