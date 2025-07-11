function  gerarOrcamentoParaImpressaoCompleta()  {
 
  const idsObrigatorios = [
    "numeroOrcamento", "dataOrcamento", "origemCliente",
    "nomeOrigem", "telefoneOrigem", "emailOrigem",
    "operadorInterno", "vendedorResponsavel"
  ];

  const pendentes = [];
  idsObrigatorios.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    const valor = (el.value || el.textContent || "").trim();
    if (!valor) {
      pendentes.push(el);
      el.classList.add("campo-pendente");
    } else {
      el.classList.remove("campo-pendente");
    }
  });

  if (pendentes.length) {
    const continuar = confirm(
      `Existem ${pendentes.length} campo(s) obrigatório(s) vazio(s).\nEles foram destacados em vermelho.\n\nDeseja continuar mesmo assim?`
    );
    if (!continuar) return;
  }

  const getValue = id => document.getElementById(id)?.value || "-";

  const dados = {
    numero: getValue("numeroOrcamento"),
    data: getValue("dataOrcamento"),
    origem: getValue("origemCliente"),
    nomeOrigem: getValue("nomeOrigem"),
    codigoOrigem: getValue("codigoOrigem"),
    telefoneOrigem: getValue("telefoneOrigem"),
    emailOrigem: getValue("emailOrigem"),
    comissao: getValue("comissaoArquiteto"),
    operador: getValue("operadorInterno"),
    enderecoObra: getValue("enderecoObra"),
    contatoResponsavel: getValue("contatoResponsavel"),
    prazos: getValue("prazosArea"),
    condicao: getValue("condicaoPagamento"),
    condicoesGerais: getValue("condicoesGerais"),
    vendedor: document.getElementById("vendedorResponsavel")?.selectedOptions[0]?.textContent || "-"
  };

  const clienteWrapper = document.querySelector(".cliente-item");
  dados.nomeCliente = clienteWrapper?.querySelector(".razaoSocial")?.value || "-";
  dados.cpfCnpj = clienteWrapper?.querySelector(".cpfCnpj")?.value || "-";
  dados.telefoneCliente = clienteWrapper?.querySelector(".telefoneCliente")?.value || "-";

  let totalGeral = 0;
  let corpoHTML = "";
  const produtosPorAmbiente = {};

  document.querySelectorAll("table[id^='tabela-bloco-']").forEach(tabela => {
    const grupoId = tabela.id.replace("tabela-", "");
    const inputAmbiente = document.querySelector(`input[data-id-grupo='${grupoId}'][placeholder='Ambiente']`);
    const nomeAmbiente = inputAmbiente?.value.trim() || "Sem Ambiente";

    const linhaProdutoPrincipal = tabela.querySelector("tbody tr");
    if (!linhaProdutoPrincipal) return;

    const descricao = linhaProdutoPrincipal.querySelectorAll("td")[1]?.textContent.trim() || "-";
    const qtd = linhaProdutoPrincipal.querySelector("input.quantidade")?.value || "1";

    const total = parseFloat(
      tabela.querySelector("tfoot td[colspan='6'] strong")?.textContent.replace(/[^\d,\.]/g, '').replace(',', '.') || "0"
    );

    (produtosPorAmbiente[nomeAmbiente] ||= []).push({ descricao, qtd, total });
  });

  Object.entries(produtosPorAmbiente).forEach(([ambiente, produtos]) => {
    let totalAmbiente = 0;
    let htmlProdutos = "";

    produtos.forEach(prod => {
      totalAmbiente += prod.total;
      htmlProdutos += `
        <tr>
          <td>${prod.descricao}</td>
          <td>${prod.qtd}</td>
        </tr>`;
    });

    corpoHTML += `
      <div class="mt-4 border">
        <div class="fw-bold border p-2 bg-light text-center">AMBIENTE: ${ambiente.toUpperCase()}</div>
        <table class="table table-sm table-bordered w-100">
          <thead class="table-light">
            <tr><th>Descrição</th><th>Quantidade</th></tr>
          </thead>
          <tbody>
            ${htmlProdutos}
          </tbody>
        </table>
        <div class="border p-2 text-end fw-bold bg-light">Total do Ambiente: R$ ${totalAmbiente.toFixed(2).replace('.', ',')}</div>
      </div>`;

    totalGeral += totalAmbiente;
  });

  corpoHTML += `
    <div class="border p-2 text-end fw-bold mt-4 bg-light">Total Geral: R$ ${totalGeral.toFixed(2).replace('.', ',')}</div>
    <div class="border p-2 mt-3">
      <strong>Prazo:</strong><br>${dados.prazos}<br><br>
      <strong>Condições de Pagamento:</strong><br>${dados.condicao}<br><br>
      <strong>Condições Gerais:</strong><br>${dados.condicoesGerais}
    </div>`;

  const htmlCompleto = `
    <html>
      <head>
        <title>Orçamento ${dados.numero}</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
        <style>
          body { padding: 40px; font-family: Arial, sans-serif; font-size: 13px; }
        </style>
      </head>
      <body>
        <div style="margin-bottom:40px;">
          <table class="table table-bordered table-sm w-100">
            <tr>
              <td style="width:40%;text-align:center;vertical-align:middle;">
                <img src="logo.jpg" style="max-height:80px;"><br><br>
                CNPJ: 00.000.000/0000-00<br>(31) 99999-9999<br>www.ferreiraulhoa.com.br
              </td>
              <td style="width:60%;">
                <table class="table table-sm w-100">
                  <tr><td><strong>Orçamento:</strong></td><td>${dados.numero}</td></tr>
                  <tr><td><strong>Data:</strong></td><td>${dados.data}</td></tr>
                  <tr><td><strong>Telefone Origem:</strong></td><td>${dados.telefoneOrigem}</td></tr>
                </table>
              </td>
            </tr>
          </table>

          <table class="table table-bordered table-sm w-100 mt-2">
            <tr><td><strong>Email Origem:</strong></td><td>${dados.emailOrigem}</td></tr>
            <tr><td><strong>Cliente:</strong></td><td>${dados.nomeCliente}</td></tr>
            <tr><td><strong>CPF/CNPJ:</strong></td><td>${dados.cpfCnpj}</td></tr>
            <tr><td><strong>Telefone Cliente:</strong></td><td>${dados.telefoneCliente}</td></tr>
            <tr><td><strong>Endereço da Obra:</strong></td><td>${dados.enderecoObra}</td></tr>
            <tr><td><strong>Contato Responsável:</strong></td><td>${dados.contatoResponsavel}</td></tr>
            <tr><td><strong>Vendedor:</strong></td><td>${dados.vendedor}</td></tr>
            <tr><td><strong>Operador:</strong></td><td>${dados.operador}</td></tr>
          </table>
        </div>

        ${corpoHTML}
      </body>
    </html>`;

  const printWindow = window.open("", "_blank");
  if (!printWindow) return;
  printWindow.document.open();
  printWindow.document.write(htmlCompleto);
  printWindow.document.close();
  printWindow.focus();
  exemploComPausa()
  async function exemploComPausa() {
  console.log("⏳ Esperando 2 segundos...");
  await new Promise(resolve => setTimeout(resolve, 2000));
  console.log("✅ Continuando após pausa");
}

  printWindow.print();
 
}



