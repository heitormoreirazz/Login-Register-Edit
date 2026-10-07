# Login-Register-Edit

Projeto Node para registro e login de usuários.

## Uso

1. Instale dependências:
   ```bash
   npm install
   ```
2. Configure variáveis de ambiente em `.env` se desejar:
   ```bash
   HOST=0.0.0.0
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/login-register-edit
   ```
3. Inicie o servidor local:
   ```bash
   npm start
   ```
4. Abra em `http://localhost:3000` ou use a URL da porta encaminhada pelo VS Code/Codespaces. O servidor escuta em `0.0.0.0` por padrão para permitir o encaminhamento.

Na página de perfil, ao informar um CEP válido com 8 dígitos, o endereço é
consultado automaticamente pela API ViaCEP e os campos de rua, bairro, cidade
e estado são preenchidos. A consulta requer acesso à internet.
