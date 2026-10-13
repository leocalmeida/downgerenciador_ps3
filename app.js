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
      .replace(/\"/g, "&quot;");
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

  function categorias() {
    var mapa = {};
    var lista = [];
    var i;
    var cat;

    if (typeof PS3_DOWNLOADS === "undefined") {
      return lista;
    }

    for (i = 0; i < PS3_DOWNLOADS.length; i++) {
      cat = textoSeguro(PS3_DOWNLOADS[i].categoria);
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
    var i;
    var item;
    var destino;

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
      destino = item.destino ? item.destino : "/dev_hdd0/packages/";

      html += '<div class="download-card">';
      html += '<h2>' + escapeHtml(item.titulo) + '</h2>';
      html += '<div class="meta">';
      html += '<span>Categoria: <strong>' + escapeHtml(item.categoria || "Outros") + '</strong></span>';
      html += '<span>Tipo: <strong>' + escapeHtml(item.tipo || "Arquivo") + '</strong></span>';
      if (item.tamanho) {
        html += '<span>Tamanho: <strong>' + escapeHtml(item.tamanho) + '</strong></span>';
      }
      html += '</div>';

      if (item.descricao) {
        html += '<div class="description">' + escapeHtml(item.descricao) + '</div>';
      }

      html += '<div class="destination">Destino: ' + escapeHtml(destino) + '</div>';
      html += '<a class="button" href="' + escapeHtml(montarUrlWebman(item)) + '">Baixar no PS3</a>';
      html += '<a class="button secondary" href="' + escapeHtml(item.url) + '">Link direto</a>';
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
