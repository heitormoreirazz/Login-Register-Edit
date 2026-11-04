import json
import re
import sys


EMAIL_PATTERN = re.compile(r"[^@\s]+@[^@\s]+\.[^@\s]+")


def validar_cadastro(dados):
    email = dados.get("email", "")
    senha = dados.get("senha", "")
    confirmar_senha = dados.get("confirmarSenha", "")
    erros = []

    if not isinstance(email, str) or not EMAIL_PATTERN.fullmatch(email.strip()):
        erros.append("Informe um email válido.")

    if not isinstance(senha, str) or len(senha) < 8:
        erros.append("A senha deve ter pelo menos 8 caracteres.")
    elif not any(caractere.isdigit() for caractere in senha):
        erros.append("A senha deve conter pelo menos um número.")

    if not isinstance(confirmar_senha, str) or senha != confirmar_senha:
        erros.append("A confirmação de senha não corresponde à senha.")

    return {"valido": not erros, "erros": erros}


def main():
    try:
        dados = json.load(sys.stdin)
        if not isinstance(dados, dict):
            raise ValueError("Os dados recebidos devem ser um objeto JSON.")
        resultado = validar_cadastro(dados)
    except (json.JSONDecodeError, ValueError) as erro:
        print(json.dumps({"valido": False, "erros": [str(erro)]}))
        sys.exit(1)

    print(json.dumps(resultado, ensure_ascii=False))


if __name__ == "__main__":
    main()
