
    (() => {
      const cepInput = document.getElementById("cep");
      const status = document.getElementById("cep-status");
      const addressFields = {
        rua: document.getElementById("rua"),
        bairro: document.getElementById("bairro"),
        cidade: document.getElementById("cidade"),
        estado: document.getElementById("estado"),
      };
      let requestController;

      const updateStatus = (message, state = "") => {
        status.textContent = message;
        status.dataset.state = state;
      };

      cepInput.addEventListener("input", async () => {
        const cep = cepInput.value.replace(/\D/g, "");
        requestController?.abort();
        requestController = undefined;
        updateStatus("");

        if (cep.length !== 8) {
          return;
        }

        const controller = new AbortController();
        requestController = controller;
        updateStatus("Buscando endereço...");

        try {
          const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`, {
            signal: controller.signal,
          });

          if (!response.ok) {
            throw new Error(`A consulta de CEP retornou HTTP ${response.status}`);
          }

          const endereco = await response.json();
          if (controller.signal.aborted || cepInput.value.replace(/\D/g, "") !== cep) {
            return;
          }

          if (endereco.erro) {
            updateStatus("CEP não encontrado. Verifique o número informado.", "error");
            return;
          }

          addressFields.rua.value = endereco.logradouro || "";
          addressFields.bairro.value = endereco.bairro || "";
          addressFields.cidade.value = endereco.localidade || "";
          addressFields.estado.value = endereco.uf || "";
          updateStatus("Endereço localizado.");
        } catch (error) {
          if (error.name === "AbortError") {
            return;
          }

          console.error("Erro ao consultar CEP:", error);
          updateStatus("Não foi possível consultar o CEP. Tente novamente.", "error");
        } finally {
          if (requestController === controller) {
            requestController = undefined;
          }
        }
      });
    })();
  