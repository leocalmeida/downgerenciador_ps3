/*
  CADASTRO DE DOWNLOADS

  Para adicionar um item, copie o MODELO abaixo, cole dentro de PS3_DOWNLOADS
  e altere os campos conforme necessario.

  Campos:
  - titulo: nome exibido no site
  - descricao: texto curto
  - categoria: Homebrew, Patch, Traducao, Tema, ISO, Utilitario etc.
  - tipo: PKG, ZIP, ISO, RAP, PUP etc. Nao deixe vazio.
  - tamanho: apenas informativo
  - url: link DIRETO do arquivo
  - destino: opcional. Se vazio, o webMAN salva em /dev_hdd0/packages/
  - expiraEm: opcional. Timestamp ISO para links temporarios. Sem esse campo, o link e permanente.

  Regras importantes:
  - mantenha a extensao da URL e do destino coerentes quando o destino for informado;
  - evite caracteres como : * ? " < > | e \ no nome do arquivo de destino;
  - use virgula somente ENTRE os objetos do array; nao deixe virgula apos o ultimo item.
  - para link temporario de 15 minutos, prefira o formulario automatico de issue.

  Para ISO, informe o caminho completo, por exemplo:
  /dev_hdd0/PS3ISO/Nome do Jogo.iso

  MODELO PERMANENTE:
  {
    titulo: "Nome do arquivo",
    descricao: "Descricao curta do conteudo.",
    categoria: "Categoria",
    tipo: "ZIP",
    tamanho: "100 MB",
    url: "https://servidor.exemplo/arquivo.zip",
    destino: "/dev_hdd0/packages/arquivo.zip"
  }

  MODELO TEMPORARIO:
  {
    titulo: "Nome do arquivo",
    descricao: "Descricao curta do conteudo.",
    categoria: "Categoria",
    tipo: "ZIP",
    tamanho: "100 MB",
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
  },
  {
    titulo: "README",
    descricao: "",
    categoria: "Outros",
    tipo: "MD",
    tamanho: "",
    url: "https://raw.githubusercontent.com/leocalmeida/downgerenciador_ps3/main/README.md",
    destino: "/dev_hdd0/packages/README.md",
    expiraEm: "2026-10-13T01:57:30Z"
  }
];
