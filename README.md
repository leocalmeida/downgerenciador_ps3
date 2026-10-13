# PS3 Download Center

Pagina simples para abrir no navegador do PlayStation 3 e disparar downloads diretamente pelo webMAN MOD.

## Arquivos

- `index.html` - pagina principal
- `style.css` - visual leve para o navegador do PS3
- `downloads.js` - lista de arquivos exibidos no site
- `app.js` - filtros, validacoes, expiracao e montagem dos comandos do webMAN
- `scripts/add_download.py` - gera automaticamente novos itens de `downloads.js`
- `.github/ISSUE_TEMPLATE/add-download.yml` - formulario para cadastrar uma URL
- `.github/workflows/add-download.yml` - automacao que atualiza `downloads.js`

## Cadastro automatico

O modo recomendado e usar o formulario de issue **Adicionar download**.

1. Abra `Issues` no repositorio.
2. Clique em `New issue`.
3. Escolha `Adicionar download`.
4. Informe a URL direta do arquivo.
5. Se quiser outro destino, preencha `Destino (opcional)`.
6. Escolha se o link e permanente ou temporario.
7. Crie a issue.

Por seguranca, somente issues abertas pelo dono do repositorio executam a automacao.

Quando apenas a URL for informada, o sistema:

- identifica o nome do arquivo pela URL;
- ignora query string e fragmento para descobrir nome e extensao;
- preserva a URL original completa em `downloads.js`;
- infere `tipo` pela extensao;
- gera o titulo a partir do nome do arquivo;
- usa `Outros` como categoria inicial;
- grava por padrao em `/dev_hdd0/packages/<nome-do-arquivo>`;
- impede duplicacao da mesma URL;
- solicita uma nova compilacao do GitHub Pages apos o commit.

Se `Destino (opcional)` for informado, ele prevalece. Uma pasta terminada em `/` recebe automaticamente o nome do arquivo. Um caminho completo tambem pode ser informado.

### Links temporarios

No formulario `Adicionar download`, selecione `Sim - expira em 15 minutos` em `Link temporario?`.

Nesse caso, o script grava no item um timestamp UTC no campo `expiraEm`, calculado como horario do cadastro + 15 minutos:

```javascript
{
  titulo: "app",
  descricao: "",
  categoria: "Outros",
  tipo: "PKG",
  tamanho: "",
  url: "https://servidor.com/app.pkg",
  destino: "/dev_hdd0/packages/app.pkg",
  expiraEm: "2026-10-13T01:45:00Z"
}
```

No site:

- enquanto o link estiver valido, o horario limite e exibido;
- apos a expiracao, `Baixar no PS3` e `Link direto` ficam bloqueados;
- a pagina reavalia a expiracao periodicamente, mesmo se permanecer aberta;
- itens sem `expiraEm` continuam permanentes.

A verificacao usa o relogio do console/navegador. Portanto, a data e hora do PS3 devem estar corretas.

Exemplo permanente:

```text
URL: https://servidor.com/app.pkg
Destino: [vazio]
Link temporario?: Nao
```

Resultado:

```javascript
{
  titulo: "app",
  descricao: "",
  categoria: "Outros",
  tipo: "PKG",
  tamanho: "",
  url: "https://servidor.com/app.pkg",
  destino: "/dev_hdd0/packages/app.pkg"
}
```

Tambem e possivel executar localmente:

```text
python scripts/add_download.py "https://servidor.com/app.pkg"
```

ou com destino especifico:

```text
python scripts/add_download.py "https://servidor.com/jogo.iso" "/dev_hdd0/PS3ISO/jogo.iso"
```

Para gerar um link temporario localmente:

```text
python scripts/add_download.py "https://servidor.com/app.pkg" "" --temporario
```

## Cadastro manual

Ainda e possivel editar `downloads.js` diretamente e adicionar um objeto dentro de `PS3_DOWNLOADS`:

```javascript
{
  titulo: "Meu Homebrew",
  descricao: "Descricao curta.",
  categoria: "Homebrew",
  tipo: "PKG",
  tamanho: "120 MB",
  url: "https://servidor.com/arquivo.pkg",
  destino: "/dev_hdd0/packages/arquivo.pkg"
}
```

Para um cadastro manual temporario, adicione `expiraEm` em formato ISO:

```text
expiraEm: "2026-10-13T01:45:00Z"
```

Para salvar em outra pasta, informe o caminho completo, por exemplo:

```text
/dev_hdd0/PS3ISO/Jogo.iso
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

O endereco esperado do projeto e:

```text
https://leocalmeida.github.io/downgerenciador_ps3/
```

A automacao de cadastro solicita explicitamente um novo build do Pages depois de atualizar `downloads.js`, pois commits criados com o `GITHUB_TOKEN` nao disparam um build do Pages automaticamente.

## Observacao sobre links

Use preferencialmente URLs que apontem diretamente para o arquivo. Paginas intermediarias, encurtadores, CAPTCHA, cookies obrigatorios ou hosts que exigem JavaScript podem nao funcionar no downloader do webMAN ou no navegador antigo do PS3.
