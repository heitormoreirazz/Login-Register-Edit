var express = require("express");
var router = express.Router();
const bcrypt = require("bcrypt");
const { spawn } = require("child_process");
const path = require("path");
var salt = bcrypt.genSaltSync(12);
var connection = require("../config/pool_conexoes");
const flash = require('connect-flash');

const validarCadastro = (dados) => new Promise((resolve, reject) => {
    const processo = spawn("python3", [path.join(__dirname, "validar_cadastro.py")]);
    let saida = "";
    let erroSaida = "";

    processo.stdout.setEncoding("utf8");
    processo.stderr.setEncoding("utf8");
    processo.stdout.on("data", (chunk) => { saida += chunk; });
    processo.stderr.on("data", (chunk) => { erroSaida += chunk; });
    processo.on("error", reject);
    processo.on("close", (codigo) => {
        if (codigo !== 0) {
            reject(new Error(erroSaida || "O validador Python encerrou com erro."));
            return;
        }

        try {
            resolve(JSON.parse(saida));
        } catch (error) {
            reject(new Error(`Resposta inválida do validador Python: ${error.message}`));
        }
    });

    processo.stdin.end(JSON.stringify(dados));
});

const registrarUsuario = async (nome, sobrenome, email, senha, tipo_usuario) => {
    const senhaHash = await bcrypt.hash(senha, salt);
    const query = "INSERT INTO usuario (nome, sobrenome, email, senha, tipo_usuario) VALUES ($1, $2, $3, $4, $5)";
    const values = [nome, sobrenome, email, senhaHash, tipo_usuario];

    const result = await connection.query(query, values);
    return result;
};

const registrarUsu = async (req, res) => {
    const { nome, sobrenome, email, senha, confirmarSenha } = req.body;
    const emailCadastro = typeof email === "string" ? email.trim() : email;

    let validacao;
    try {
        validacao = await validarCadastro({ email: emailCadastro, senha, confirmarSenha });
    } catch (error) {
        console.error("Erro ao validar cadastro:", error);
        return res.status(500).render("pages/register", {
            erro: "Não foi possível validar seus dados. Tente novamente.",
            valores: { nome, sobrenome, email, senha: "" },
        });
    }

    if (!validacao.valido) {
        return res.status(400).render("pages/register", {
            erro: validacao.erros.join(" "),
            valores: { nome, sobrenome, email, senha: "" },
        });
    }

    try {
        await registrarUsuario(nome, sobrenome, emailCadastro, senha, "default_user");
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
        req.session.avatar_url = usuario.avatar_url;
        req.session.bio = usuario.bio;

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

const logoutUsuario = (req, res) => {
    // Destruir a sessão
    req.session.destroy((err) => {
        if (err) {
            console.error('Erro ao destruir sessão:', err);
            return res.status(500).json({
                success: false,
                error: 'Erro ao fazer logout'
            });
        }

        // Limpar cookies
        res.clearCookie('connect.sid'); // Nome padrão do cookie de sessão
        console.log('Usuário fez logout com sucesso');
        // Redirecionar para login
        res.redirect('/login');
    });
};


module.exports = {
    registrarUsu,
    loginUsuario,
    editarEnderecoUsuario,
    editarInfoUsuario,
    logoutUsuario
};