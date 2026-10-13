(function () {
  function textoSeguro(valor) {
    if (valor === null || typeof valor === "undefined") {
      return "";
    }
    return String(valor);
  }

  function escapeHtml(valor) {
    return textoSeguro(valor)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function montarUrlWebman(item) {
    var base = "http://127.0.0.1/xmb.ps3/download.ps3?";
    var partes = [];

    if (item.destino) {
      partes.push("to=" + encodeURIComponent(item.destino));
    }

    partes.push("url=" + encodeURIComponent(item.url));
    return base + partes.join("&");
  }

  function normalizar(valor) {
    return textoSeguro(valor).toLowerCase();
  }

  function removerQueryEFragmento(valor) {
    var texto = textoSeguro(valor);
    var posHash = texto.indexOf("#");
    var posQuery;

    if (posHash !== -1) {
      texto = texto.substring(0, posHash);
    }

    posQuery = texto.indexOf("?");
    if (posQuery !== -1) {
      texto = texto.substring(0, posQuery);
    }

    return texto;
  }

  function nomeArquivo(caminho) {
    var texto = removerQueryEFragmento(caminho);
    var pos = texto.lastIndexOf("/");

    if (pos !== -1) {
      texto = texto.substring(pos + 1);
    }

    return texto;
  }

  function extrairExtensao(valor) {
    var arquivo = nomeArquivo(valor);
    var pos = arquivo.lastIndexOf(".");

    if (pos <= 0 || pos === arquivo.length - 1) {
      return "";
    }

    return arquivo.substring(pos + 1).toLowerCase();
  }

  function tipoDoItem(item) {
    var extensao;

    if (!item || typeof item !== "object") {
      return "ARQUIVO";
    }

    extensao = extrairExtensao(item.url);
    return extensao ? extensao.toUpperCase() : "ARQUIVO";
  }

  function categoriaDoItem(item) {
    if (!item || typeof item !== "object") {
      return "Outros";
    }

    return textoSeguro(item.categoria) || "Outros";
  }

  function numero2(valor) {
    return valor < 10 ? "0" + valor : String(valor);
  }

  function parseDataIso(valor) {
    var texto = textoSeguro(valor);
    var match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d{1,3}))?(Z|([+-])(\d{2}):(\d{2}))$/.exec(texto);
    var milissegundos;
    var timestamp;
    var deslocamento;

    if (!match) {
      return null;
    }

    milissegundos = match[7] || "0";
    while (milissegundos.length < 3) {
      milissegundos += "0";
    }

    timestamp = Date.UTC(
      parseInt(match[1], 10),
      parseInt(match[2], 10) - 1,
      parseInt(match[3], 10),
      parseInt(match[4], 10),
      parseInt(match[5], 10),
      parseInt(match[6], 10),
      parseInt(milissegundos, 10)
    );

    if (match[8] !== "Z") {
      deslocamento = (parseInt(match[10], 10) * 60) + parseInt(match[11], 10);
      if (match[9] === "+") {
        timestamp -= deslocamento * 60000;
      } else {
        timestamp += deslocamento * 60000;
      }
    }

    return timestamp;
  }

  function formatarData(timestamp) {
    var data = new Date(timestamp);

    return numero2(data.getDate()) + "/" +
      numero2(data.getMonth() + 1) + "/" +
      data.getFullYear() + " " +
      numero2(data.getHours()) + ":" +
      numero2(data.getMinutes());
  }

  function obterExpiracao(item, agora) {
    var texto;
    var timestamp;

    if (!item || typeof item !== "object" || !textoSeguro(item.expiraEm)) {
      return {
        temporario: false,
        valido: true,
        expirado: false,
        timestamp: null
      };
    }

    texto = textoSeguro(item.expiraEm);
    timestamp = parseDataIso(texto);

    return {
      temporario: true,
      valido: timestamp !== null,
      expirado: timestamp !== null && agora >= timestamp,
      timestamp: timestamp
    };
  }

  function validarItem(item) {
    var resultado = {
      erros: [],
      avisos: []
    };
    var extUrl;
    var extDestino;
    var arquivoDestino;
    var tipoInferido;

    if (!item || typeof item !== "object") {
      resultado.erros.push("Cadastro invalido: o item nao e um objeto.");
      return resultado;
    }

    if (!textoSeguro(item.titulo)) {
      resultado.avisos.push("Titulo nao informado.");
    }

    if (!textoSeguro(item.url)) {
      resultado.erros.push("URL nao informada.");
    }

    tipoInferido = tipoDoItem(item);
    if (textoSeguro(item.tipo) && normalizar(item.tipo) !== normalizar(tipoInferido)) {
      resultado.avisos.push(
        "O campo tipo foi ignorado. Pela extensao da URL, o tipo utilizado sera " + tipoInferido + "."
      );
    }

    if (textoSeguro(item.expiraEm) && parseDataIso(item.expiraEm) === null) {
      resultado.erros.push("Data de expiracao invalida. Use formato ISO, por exemplo 2026-10-12T22:45:00-03:00 ou UTC com Z.");
    }

    if (textoSeguro(item.url) && textoSeguro(item.destino)) {
      extUrl = extrairExtensao(item.url);
      extDestino = extrairExtensao(item.destino);

      if (extUrl && extDestino && extUrl !== extDestino) {
        resultado.erros.push(
          "Extensao da URL (." + extUrl + ") diferente da extensao do destino (." + extDestino + ")."
        );
      }

      arquivoDestino = nomeArquivo(item.destino);
      if (/[:*?"<>|\\]/.test(arquivoDestino)) {
        resultado.avisos.push("O nome do arquivo de destino possui caracteres potencialmente problematicos.");
      }

      if (/[ .]$/.test(arquivoDestino)) {
        resultado.avisos.push("O nome do arquivo de destino termina com ponto ou espaco.");
      }
    }

    return resultado;
  }

  function renderizarValidacao(validacao) {
    var html = "";
    var i;

    if (validacao.erros.length === 0 && validacao.avisos.length === 0) {
      return html;
    }

    html += '<div class="validation">';

    for (i = 0; i < validacao.erros.length; i++) {
      html += '<div class="validation-error"><strong>Erro:</strong> ' + escapeHtml(validacao.erros[i]) + '</div>';
    }

    for (i = 0; i < validacao.avisos.length; i++) {
      html += '<div class="validation-warning"><strong>Aviso:</strong> ' + escapeHtml(validacao.avisos[i]) + '</div>';
    }

    html += '</div>';
    return html;
  }

  function renderizarExpiracao(expiracao) {
    if (!expiracao.temporario) {
      return "";
    }

    if (!expiracao.valido) {
      return '<div class="expiration expired"><strong>Link temporario:</strong> data de expiracao invalida.</div>';
    }

    if (expiracao.expirado) {
      return '<div class="expiration expired"><strong>Link expirado.</strong> Validade terminou em ' +
        escapeHtml(formatarData(expiracao.timestamp)) + '.</div>';
    }

    return '<div class="expiration active"><strong>Link temporario.</strong> Valido ate ' +
      escapeHtml(formatarData(expiracao.timestamp)) + '.</div>';
  }

  function categorias() {
    var mapa = {};
    var lista = [];
    var i;
    var cat;

    if (typeof PS3_DOWNLOADS === "undefined") {
      return lista;
    }

    for (i = 0; i < PS3_DOWNLOADS.length; i++) {
      cat = categoriaDoItem(PS3_DOWNLOADS[i]);
      if (!mapa[cat]) {
        mapa[cat] = true;
        lista.push(cat);
      }
    }

    lista.sort();
    return lista;
  }

  function preencherCategorias() {
    var select = document.getElementById("category");
    var lista = categorias();
    var i;
    var option;

    for (i = 0; i < lista.length; i++) {
      option = document.createElement("option");
      option.value = lista[i];
      option.appendChild(document.createTextNode(lista[i]));
      select.appendChild(option);
    }
  }

  function itemCombina(item, busca, categoria) {
    var conteudo;

    if (!item || typeof item !== "object") {
      return !busca && !categoria;
    }

    if (categoria && categoriaDoItem(item) !== categoria) {
      return false;
    }

    if (!busca) {
      return true;
    }

    conteudo = normalizar(item.titulo) + " " +
      normalizar(item.descricao) + " " +
      normalizar(categoriaDoItem(item)) + " " +
      normalizar(tipoDoItem(item));

    return conteudo.indexOf(busca) !== -1;
  }

  function renderizar() {
    var container = document.getElementById("downloads");
    var status = document.getElementById("status");
    var busca = normalizar(document.getElementById("search").value);
    var categoria = document.getElementById("category").value;
    var agora = new Date().getTime();
    var html = "";
    var total = 0;
    var invalidos = 0;
    var expirados = 0;
    var i;
    var item;
    var itemValido;
    var destino;
    var validacao;
    var expiracao;
    var bloqueado;

    if (typeof PS3_DOWNLOADS === "undefined") {
      container.innerHTML = '<div class="empty">Nao foi possivel carregar downloads.js.</div>';
      status.innerHTML = "Erro ao carregar a lista.";
      return;
    }

    for (i = 0; i < PS3_DOWNLOADS.length; i++) {
      item = PS3_DOWNLOADS[i];

      if (!itemCombina(item, busca, categoria)) {
        continue;
      }

      total++;
      itemValido = item && typeof item === "object" ? item : {};
      destino = itemValido.destino ? itemValido.destino : "/dev_hdd0/packages/";
      validacao = validarItem(item);
      expiracao = obterExpiracao(itemValido, agora);
      bloqueado = validacao.erros.length > 0 || expiracao.expirado;

      if (validacao.erros.length > 0) {
        invalidos++;
      }

      if (expiracao.expirado) {
        expirados++;
      }

      html += '<div class="download-card">';
      html += '<h2>' + escapeHtml(itemValido.titulo || "Sem titulo") + '</h2>';
      html += '<div class="meta">';
      html += '<span>Categoria: <strong>' + escapeHtml(categoriaDoItem(itemValido)) + '</strong></span>';
      html += '<span>Tipo: <strong>' + escapeHtml(tipoDoItem(itemValido)) + '</strong></span>';
      if (itemValido.tamanho) {
        html += '<span>Tamanho: <strong>' + escapeHtml(itemValido.tamanho) + '</strong></span>';
      }
      html += '</div>';

      if (itemValido.descricao) {
        html += '<div class="description">' + escapeHtml(itemValido.descricao) + '</div>';
      }

      html += '<div class="destination">Destino: ' + escapeHtml(destino) + '</div>';
      html += renderizarExpiracao(expiracao);
      html += renderizarValidacao(validacao);

      if (!bloqueado) {
        html += '<a class="button" href="' + escapeHtml(montarUrlWebman(itemValido)) + '">Baixar no PS3</a>';
      } else if (expiracao.expirado) {
        html += '<span class="button disabled">Link expirado</span>';
      } else {
        html += '<span class="button disabled">Download bloqueado</span>';
      }

      if (itemValido.url && !expiracao.expirado) {
        html += '<a class="button secondary" href="' + escapeHtml(itemValido.url) + '">Link direto</a>';
      } else if (itemValido.url && expiracao.expirado) {
        html += '<span class="button disabled">Link direto expirado</span>';
      }

      html += '</div>';
    }

    if (total === 0) {
      if (PS3_DOWNLOADS.length === 0) {
        html = '<div class="empty">Nenhum download cadastrado ainda. Edite o arquivo <strong>downloads.js</strong> no repositorio para adicionar o primeiro link.</div>';
      } else {
        html = '<div class="empty">Nenhum item encontrado com esse filtro.</div>';
      }
    }

    container.innerHTML = html;
    status.innerHTML = total + (total === 1 ? " item encontrado." : " itens encontrados.");
    if (invalidos > 0) {
      status.innerHTML += " " + invalidos + (invalidos === 1 ? " cadastro possui erro." : " cadastros possuem erros.");
    }
    if (expirados > 0) {
      status.innerHTML += " " + expirados + (expirados === 1 ? " link expirado." : " links expirados.");
    }
  }

  window.filtrarDownloads = renderizar;

  function iniciar() {
    preencherCategorias();
    renderizar();

    if (window.setInterval) {
      window.setInterval(renderizar, 30000);
    }
  }

  if (document.readyState === "complete") {
    iniciar();
  } else if (window.addEventListener) {
    window.addEventListener("load", iniciar, false);
  } else if (window.attachEvent) {
    window.attachEvent("onload", iniciar);
  } else {
    window.onload = iniciar;
  }
}());
