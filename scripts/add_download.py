#!/usr/bin/env python3
"""Adiciona uma URL ao PS3_DOWNLOADS de downloads.js.

Uso local:
    python scripts/add_download.py "https://servidor/arquivo.pkg"
    python scripts/add_download.py "https://servidor/arquivo.iso" "/dev_hdd0/PS3ISO/arquivo.iso"

No GitHub Actions, a URL e o destino opcional sao extraidos de ISSUE_BODY.
"""

import json
import os
import posixpath
import re
import sys
from urllib.parse import unquote, urlsplit

DOWNLOADS_FILE = "downloads.js"
DEFAULT_DIRECTORY = "/dev_hdd0/packages/"


def extract_issue_field(body, label):
    pattern = r"(?ms)^###\s+" + re.escape(label) + r"\s*\n+(.*?)(?=^###\s+|\Z)"
    match = re.search(pattern, body or "")
    if not match:
        return ""

    value = match.group(1).strip()
    if value in ("_No response_", "No response", "Nenhuma resposta"):
        return ""
    return value


def sanitize_filename(name):
    name = re.sub(r'[<>:"/\\|?*\x00-\x1f]', "_", name)
    name = name.rstrip(" .")
    return name or "arquivo"


def filename_from_url(url):
    parsed = urlsplit(url)
    if parsed.scheme not in ("http", "https") or not parsed.netloc:
        raise ValueError("URL invalida. Use uma URL http:// ou https:// completa.")

    filename = unquote(posixpath.basename(parsed.path.rstrip("/")))
    if not filename:
        raise ValueError("Nao foi possivel identificar o nome do arquivo pela URL.")

    return sanitize_filename(filename)


def extension_of(filename):
    base = posixpath.basename(filename)
    dot = base.rfind(".")
    if dot <= 0 or dot == len(base) - 1:
        return ""
    return base[dot + 1 :].lower()


def normalize_destination(destination, filename):
    destination = (destination or "").strip()
    if not destination:
        return DEFAULT_DIRECTORY + filename

    if destination.endswith("/"):
        return destination + filename

    directory, dest_filename = posixpath.split(destination)
    dest_filename = sanitize_filename(dest_filename)
    normalized = posixpath.join(directory, dest_filename) if directory else dest_filename

    url_ext = extension_of(filename)
    dest_ext = extension_of(dest_filename)
    if url_ext and dest_ext and url_ext != dest_ext:
        raise ValueError(
            "Extensao do destino (.%s) difere da extensao da URL (.%s)."
            % (dest_ext, url_ext)
        )

    return normalized


def js_string(value):
    return json.dumps(value, ensure_ascii=True)


def build_entry(url, destination):
    filename = filename_from_url(url)
    destination = normalize_destination(destination, filename)
    ext = extension_of(filename)
    file_type = ext.upper() if ext else "ARQUIVO"

    if ext:
        title = filename[: -(len(ext) + 1)]
    else:
        title = filename

    return {
        "titulo": title or filename,
        "descricao": "",
        "categoria": "Outros",
        "tipo": file_type,
        "tamanho": "",
        "url": url.strip(),
        "destino": destination,
    }


def render_entry(item):
    return "\n".join(
        [
            "  {",
            "    titulo: %s," % js_string(item["titulo"]),
            "    descricao: %s," % js_string(item["descricao"]),
            "    categoria: %s," % js_string(item["categoria"]),
            "    tipo: %s," % js_string(item["tipo"]),
            "    tamanho: %s," % js_string(item["tamanho"]),
            "    url: %s," % js_string(item["url"]),
            "    destino: %s" % js_string(item["destino"]),
            "  }",
        ]
    )


def add_to_downloads(item):
    with open(DOWNLOADS_FILE, "r", encoding="utf-8") as handle:
        content = handle.read()

    marker = "var PS3_DOWNLOADS = ["
    start = content.find(marker)
    end = content.rfind("];" )

    if start == -1 or end == -1 or end <= start:
        raise ValueError("Estrutura PS3_DOWNLOADS nao encontrada em downloads.js.")

    start += len(marker)
    array_content = content[start:end]
    url_literal = "url: %s" % js_string(item["url"])

    if url_literal in array_content:
        return False

    current = array_content.rstrip()
    if current:
        if not current.endswith(","):
            current += ","
        current += "\n" + render_entry(item) + "\n"
    else:
        current = "\n" + render_entry(item) + "\n"

    updated = content[:start] + current + content[end:]

    with open(DOWNLOADS_FILE, "w", encoding="utf-8", newline="\n") as handle:
        handle.write(updated)

    return True


def get_input():
    if len(sys.argv) >= 2:
        url = sys.argv[1].strip()
        destination = sys.argv[2].strip() if len(sys.argv) >= 3 else ""
        return url, destination

    issue_body = os.environ.get("ISSUE_BODY", "")
    url = extract_issue_field(issue_body, "URL")
    destination = extract_issue_field(issue_body, "Destino (opcional)")

    if not url:
        raise ValueError("Campo URL nao encontrado na issue.")

    return url, destination


def main():
    try:
        url, destination = get_input()
        item = build_entry(url, destination)
        changed = add_to_downloads(item)

        if changed:
            print("ADDED|%s|%s" % (item["titulo"], item["destino"]))
        else:
            print("DUPLICATE|URL ja cadastrada")
        return 0
    except Exception as exc:
        print("ERROR|%s" % exc, file=sys.stderr)
        return 1


if __name__ == "__main__":
    sys.exit(main())
