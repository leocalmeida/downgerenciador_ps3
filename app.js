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

  function validarItem(item) {
    var resultado = {
      erros: [],
      avisos: []
    };
    var extUrl;
    var extDestino;
    var arquivoDestino;

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

    if (!textoSeguro(item.tipo)) {
      resultado.erros.push("Tipo nao informado.");
    }

    if (!textoSeguro(item.categoria)) {
      resultado.avisos.push("Categoria nao informada; o item sera exibido como Outros.");
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

  function categorias() {
    var mapa = {};
    var lista = [];
    var i;
    var item;
    var cat;

    if (typeof PS3_DOWNLOADS === "undefined") {
      return lista;
    }

    for (i = 0; i < PS3_DOWNLOADS.length; i++) {
      item = PS3_DOWNLOADS[i];
      if (!item || typeof item !== "object") {
        continue;
      }

      cat = textoSeguro(item.categoria);
      if (cat && !mapa[cat]) {
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

    if (categoria && item.categoria !== categoria) {
      return false;
    }

    if (!busca) {
      return true;
    }

    conteudo = normalizar(item.titulo) + " " +
      normalizar(item.descricao) + " " +
      normalizar(item.categoria) + " " +
      normalizar(item.tipo);

    return conteudo.indexOf(busca) !== -1;
  }

  function renderizar() {
    var container = document.getElementById("downloads");
    var status = document.getElementById("status");
    var busca = normalizar(document.getElementById("search").value);
    var categoria = document.getElementById("category").value;
    var html = "";
    var total = 0;
    var invalidos = 0;
    var i;
    var item;
    var itemValido;
    var destino;
    var validacao;

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

      if (validacao.erros.length > 0) {
        invalidos++;
      }

      html += '<div class="download-card">';
      html += '<h2>' + escapeHtml(itemValido.titulo || "Sem titulo") + '</h2>';
      html += '<div class="meta">';
      html += '<span>Categoria: <strong>' + escapeHtml(itemValido.categoria || "Outros") + '</strong></span>';
      html += '<span>Tipo: <strong>' + escapeHtml(itemValido.tipo || "Nao informado") + '</strong></span>';
      if (itemValido.tamanho) {
        html += '<span>Tamanho: <strong>' + escapeHtml(itemValido.tamanho) + '</strong></span>';
      }
      html += '</div>';

      if (itemValido.descricao) {
        html += '<div class="description">' + escapeHtml(itemValido.descricao) + '</div>';
      }

      html += '<div class="destination">Destino: ' + escapeHtml(destino) + '</div>';
      html += renderizarValidacao(validacao);

      if (validacao.erros.length === 0) {
        html += '<a class="button" href="' + escapeHtml(montarUrlWebman(itemValido)) + '">Baixar no PS3</a>';
      } else {
        html += '<span class="button disabled">Download bloqueado</span>';
      }

      if (itemValido.url) {
        html += '<a class="button secondary" href="' + escapeHtml(itemValido.url) + '">Link direto</a>';
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
  }

  window.filtrarDownloads = renderizar;

  function iniciar() {
    preencherCategorias();
    renderizar();
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
