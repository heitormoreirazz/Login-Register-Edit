var express = require("express");
var path = require("path");
var user = require("../controller/user");
var router = express.Router();
const bcrypt = require("bcrypt");
var salt = bcrypt.genSaltSync(12);
var connection = require("./pool_conexoes");
const flash = require('connect-flash');
const multer = require('multer');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// ===== CONFIGURAÇÃO DO MULTER =====
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        const allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Tipo de arquivo não permitido'));
        }
    }
});

// ===== CONFIGURAÇÃO DO SUPABASE =====
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ===== ROTAS EXISTENTES =====

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
        erro: "",
        valores: { nome: "", sobrenome: "", email: "", senha: "" },
    });
});

router.get("/controller/cepAPI.js", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "controller", "cepAPI.js"));
});

// ===== ROTA DO PERFIL - CORRIGIDA =====
router.get("/profile", async function (req, res) {
    const session = req.session || {};
    const userId = session.userId;

    let avatar_url = session.avatar_url || "";

    if (!userId) {
        return res.redirect("/login");
    }

    // ✅ BUSCAR A URL DO AVATAR NO BANCO DE DADOS
    if (userId) {
        try {
            const query = "SELECT avatar_url FROM usuario WHERE id = $1";
            const result = await connection.query(query, [userId]);
            
            if (result.rows.length > 0 && result.rows[0].avatar_url) {
                avatar_url = result.rows[0].avatar_url;
                console.log('✅ Avatar URL carregado do banco:', avatar_url);
            }
        } catch (error) {
            console.error('❌ Erro ao buscar avatar:', error);
        }
    }

    res.render("pages/profile", {

        
        
        nome: session.nome || "",
        sobrenome: session.sobrenome || "",
        email: session.email || "",
        logradouro: session.logradouro || session.logrado || "",
        numero: session.numero || "",
        complemento: session.complemento || "",
        cep: session.cep || "",
        bairro: session.bairro || "",
        cidade: session.cidade || "",
        estado: session.estado || "",
        celular: session.celular || "",
        CPF: session.CPF || "",
        bio: session.bio || "",
        avatar_url: avatar_url  // ← PASSA A URL PARA O TEMPLATE
    });
});

// ===== ENDPOINT PARA UPLOAD DE AVATAR =====
router.post("/upload-avatar", upload.single('file'), async function (req, res) {
    try {
        // Verificar se arquivo foi enviado
        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: 'Nenhum arquivo enviado'
            });
        }

        // Verificar se usuário está autenticado
        if (!req.session || !req.session.userId) {
            return res.status(401).json({
                success: false,
                error: 'Usuário não autenticado'
            });
        }

        // Gerar nome único para o arquivo
        const fileName = `avatar-${req.session.userId}-${Date.now()}.jpg`;
        const bucket = 'images';

        console.log('📤 Fazendo upload para Supabase:', fileName);

        // Fazer upload para o Supabase Storage
        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(fileName, req.file.buffer, {
                contentType: req.file.mimetype,
                upsert: true
            });

        if (error) {
            console.error('❌ Erro Supabase:', error);
            return res.status(500).json({
                success: false,
                error: 'Erro ao fazer upload: ' + error.message
            });
        }

        // Obter URL pública da imagem
        const { data: publicData } = supabase.storage
            .from(bucket)
            .getPublicUrl(fileName);

        const publicUrl = publicData.publicUrl;
        console.log('✅ URL pública gerada:', publicUrl);

        // Salvar URL do avatar no banco de dados
        const updateQuery = 'UPDATE usuario SET avatar_url = $1 WHERE id = $2';

        // ✅ USAR PROMISE PARA ESPERAR O RESULTADO
        await new Promise((resolve, reject) => {
            connection.query(updateQuery, [publicUrl, req.session.userId], (err) => {
                if (err) {
                    console.error('❌ Erro ao atualizar banco:', err);
                    reject(err);
                } else {
                    // Atualizar sessão APÓS salvar no banco
                    req.session.avatar_url = publicUrl;
                    console.log('✅ Avatar salvo no banco de dados');
                    resolve();
                }
            });
        });

        // Retornar sucesso com a URL pública
        res.json({
            success: true,
            message: 'Avatar atualizado com sucesso',
            url: publicUrl,
            fileName: fileName
        });

    } catch (error) {
        console.error('❌ Erro no upload:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor: ' + error.message
        });
    }
});

router.get("/controller/upload-img.js", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "controller", "upload-img.js"));
});

router.post("/logout", user.logoutUsuario, async function (req, res) { });

// ===== ROTAS EXISTENTES CONTINUADAS =====

router.post("/editarEndereco", user.editarEnderecoUsuario);

router.post("/editarInfo", user.editarInfoUsuario);

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

router.post("/fazerLogin", user.loginUsuario, async function (req, res) { });

module.exports = router;
