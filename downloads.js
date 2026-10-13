/*
  CADASTRO DE DOWNLOADS

  Para adicionar manualmente um item, copie um MODELO abaixo, cole dentro de
  PS3_DOWNLOADS e altere apenas os campos necessarios.

  Campos:
  - titulo: opcional; nome exibido no site
  - descricao: opcional; texto curto
  - categoria: opcional; quando vazia/ausente, o site exibe Outros
  - tipo: opcional e ignorado pelo site; o tipo real vem da extensao da URL
  - tamanho: opcional; apenas informativo
  - url: link DIRETO do arquivo
  - destino: opcional. Se vazio, o webMAN salva em /dev_hdd0/packages/
  - expiraEm: opcional. Timestamp ISO para links temporarios. Sem esse campo, o link e permanente.

  Regras importantes:
  - o tipo e inferido automaticamente pela extensao da URL: .pkg -> PKG, .zip -> ZIP etc.;
  - query string e fragmento nao interferem na deteccao da extensao;
  - se a URL nao possuir extensao identificavel, o tipo exibido sera ARQUIVO;
  - mantenha a extensao da URL e do destino coerentes quando o destino for informado;
  - evite caracteres como : * ? " < > | e \ no nome do arquivo de destino;
  - use virgula somente ENTRE os objetos do array; nao deixe virgula apos o ultimo item;
  - para link temporario de 15 minutos, prefira o formulario automatico de issue.

  MODELO MINIMO:
  {
    url: "https://servidor.exemplo/arquivo.zip"
  }

  MODELO COM DESTINO:
  {
    titulo: "Nome do arquivo",
    url: "https://servidor.exemplo/arquivo.zip",
    destino: "/dev_hdd0/packages/arquivo.zip"
  }

  MODELO TEMPORARIO:
  {
    titulo: "Nome do arquivo",
    url: "https://servidor.exemplo/arquivo.zip",
    destino: "/dev_hdd0/packages/arquivo.zip",
    expiraEm: "2026-10-13T01:45:00Z"
  }
*/

var PS3_DOWNLOADS = [
  {
    titulo: "Teste de download ZIP",
    descricao: "ZIP do proprio repositorio para validar o download pelo webMAN MOD.",
    categoria: "Teste",
    tipo: "ZIP",
    tamanho: "Pequeno",
    url: "https://github.com/leocalmeida/downgerenciador_ps3/archive/refs/heads/main.zip",
    destino: "/dev_hdd0/packages/downgerenciador_ps3-main.zip"
  },
  {
    titulo: "Naruto",
    descricao: "",
    categoria: "",
    tipo: "",
    tamanho: "",
    url: "https://cdn.psgamedl.com/PS3-DEC/Naruto%20Shippuden%20-%20Ultimate%20Ninja%20Storm%20Generations%20(USA)%20(EnFrEs).zip?e=1791939212&s=ZlhAcwYMVv11Bo-0M02znigw-bouvbEMPVuUCnAilv8",
    destino: "/dev_hdd0/PS3ISO/Naruto Shippuden: Ultimate Ninja Storm Generations.rar"
  }
];
