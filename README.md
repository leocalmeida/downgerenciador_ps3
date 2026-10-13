# PS3 Download Center

Pagina simples para abrir no navegador do PlayStation 3 e disparar downloads diretamente pelo webMAN MOD.

## Arquivos

- `index.html` - pagina principal
- `style.css` - visual leve para o navegador do PS3
- `downloads.js` - lista de arquivos exibidos no site
- `app.js` - filtros e montagem dos comandos do webMAN

## Como adicionar um download

Edite `downloads.js` e adicione um objeto dentro de `PS3_DOWNLOADS`:

```javascript
{
  titulo: "Meu Homebrew",
  descricao: "Descricao curta.",
  categoria: "Homebrew",
  tipo: "PKG",
  tamanho: "120 MB",
  url: "https://servidor.com/arquivo.pkg",
  destino: ""
}
```

Quando `destino` estiver vazio, o webMAN MOD usa `/dev_hdd0/packages/`.

Para salvar em outra pasta, informe o caminho completo:

```javascript
{
  titulo: "Minha ISO",
  descricao: "ISO de exemplo.",
  categoria: "ISO",
  tipo: "ISO",
  tamanho: "8 GB",
  url: "https://servidor.com/jogo.iso",
  destino: "/dev_hdd0/PS3ISO/Jogo.iso"
}
```

## Comando usado no PS3

O botao `Baixar no PS3` monta chamadas no formato:

```text
http://127.0.0.1/xmb.ps3/download.ps3?url=URL
```

ou, quando existe destino personalizado:

```text
http://127.0.0.1/xmb.ps3/download.ps3?to=CAMINHO&url=URL
```

Isso exige o webMAN MOD ativo no console.

## GitHub Pages

Para publicar pelo GitHub Pages:

1. Abra `Settings` do repositorio.
2. Entre em `Pages`.
3. Em `Build and deployment`, escolha `Deploy from a branch`.
4. Selecione a branch `main` e a pasta `/ (root)`.
5. Salve.

Como este repositorio se chama `private_ps3`, o endereco esperado do projeto e:

```text
https://leocalmeida.github.io/private_ps3/
```

Se a sua conta GitHub nao oferecer Pages para repositorios privados, torne este repositorio publico ou mantenha o codigo privado e publique uma copia em um repositorio publico dedicado ao site.

## Observacao sobre links

Use preferencialmente URLs que apontem diretamente para o arquivo. Paginas intermediarias, encurtadores, CAPTCHA, cookies obrigatorios ou hosts que exigem JavaScript podem nao funcionar no downloader do webMAN ou no navegador antigo do PS3.
