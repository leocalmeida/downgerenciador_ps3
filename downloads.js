/*
  CADASTRO DE DOWNLOADS

  Para adicionar um item, copie um bloco e altere os campos.

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
*/

var PS3_DOWNLOADS = [
  /*
  {
    titulo: "Exemplo de PKG",
    descricao: "Substitua este exemplo por um arquivo real.",
    categoria: "Homebrew",
    tipo: "PKG",
    tamanho: "100 MB",
    url: "https://servidor.exemplo/arquivo.pkg",
    destino: ""
  },
  {
    titulo: "Exemplo de ISO",
    descricao: "Exemplo salvando diretamente na pasta PS3ISO.",
    categoria: "ISO",
    tipo: "ISO",
    tamanho: "10 GB",
    url: "https://servidor.exemplo/jogo.iso",
    destino: "/dev_hdd0/PS3ISO/Jogo.iso"
  }
  */
];
