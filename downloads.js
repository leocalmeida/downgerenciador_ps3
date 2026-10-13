/*
  CADASTRO DE DOWNLOADS

  Para adicionar um item, copie o MODELO abaixo, cole dentro de PS3_DOWNLOADS
  e altere os campos conforme necessario.

  Campos:
  - titulo: nome exibido no site
  - descricao: texto curto
  - categoria: Homebrew, Patch, Traducao, Tema, ISO, Utilitario etc.
  - tipo: PKG, ZIP, ISO, RAP, PUP etc.
  - tamanho: apenas informativo
  - url: link DIRETO do arquivo
  - destino: opcional. Se vazio, o webMAN salva em /dev_hdd0/packages/

  Para ISO, informe o caminho completo, por exemplo:
  /dev_hdd0/PS3ISO/Nome do Jogo.iso

  MODELO:
  {
    titulo: "Nome do arquivo",
    descricao: "Descricao curta do conteudo.",
    categoria: "Categoria",
    tipo: "ZIP",
    tamanho: "100 MB",
    url: "https://servidor.exemplo/arquivo.zip",
    destino: "/dev_hdd0/packages/arquivo.zip"
  },
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
  }
];
