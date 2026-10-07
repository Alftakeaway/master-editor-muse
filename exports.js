/* Small ZIP/OOXML/EPUB exporter. No network, executable macros or dependencies. */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.MuseExport = api;
})(globalThis, function () {
  "use strict";
  const encoder = new TextEncoder();
  const xml = (value) =>
    String(value ?? "")
      .replace(/[\x00-\x08\x0b\x0c\x0e-\x1f\uFFFE\uFFFF]/g, "")
      .replace(
        /[&<>"']/g,
        (c) =>
          ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&apos;",
          })[c],
      );
  const table = Array.from({ length: 256 }, (_, n) => {
    for (let i = 0; i < 8; i++) n = n & 1 ? 0xedb88320 ^ (n >>> 1) : n >>> 1;
    return n >>> 0;
  });
  function crc32(bytes) {
    let n = 0xffffffff;
    for (const b of bytes) n = table[(n ^ b) & 255] ^ (n >>> 8);
    return (n ^ 0xffffffff) >>> 0;
  }
  function zip(files) {
    const parts = [],
      central = [];
    let offset = 0,
      total = 0;
    for (const [path, value] of files) {
      if (path.startsWith("/") || path.split("/").includes(".."))
        throw Error("Percorso archivio non valido.");
      const name = encoder.encode(path),
        bytes = typeof value === "string" ? encoder.encode(value) : value,
        crc = crc32(bytes),
        local = new Uint8Array(30 + name.length),
        v = new DataView(local.buffer);
      v.setUint32(0, 0x04034b50, true);
      v.setUint16(4, 20, true);
      v.setUint16(6, 0x800, true);
      v.setUint16(12, 33, true);
      v.setUint32(14, crc, true);
      v.setUint32(18, bytes.length, true);
      v.setUint32(22, bytes.length, true);
      v.setUint16(26, name.length, true);
      local.set(name, 30);
      parts.push(local, bytes);
      const header = new Uint8Array(46 + name.length),
        c = new DataView(header.buffer);
      c.setUint32(0, 0x02014b50, true);
      c.setUint16(4, 20, true);
      c.setUint16(6, 20, true);
      c.setUint16(8, 0x800, true);
      c.setUint16(14, 33, true);
      c.setUint32(16, crc, true);
      c.setUint32(20, bytes.length, true);
      c.setUint32(24, bytes.length, true);
      c.setUint16(28, name.length, true);
      c.setUint32(42, offset, true);
      header.set(name, 46);
      central.push(header);
      offset += local.length + bytes.length;
      total += header.length;
    }
    const end = new Uint8Array(22),
      v = new DataView(end.buffer);
    v.setUint32(0, 0x06054b50, true);
    v.setUint16(8, files.length, true);
    v.setUint16(10, files.length, true);
    v.setUint32(12, total, true);
    v.setUint32(16, offset, true);
    const result = new Uint8Array(offset + total + 22);
    let at = 0;
    for (const part of [...parts, ...central, end]) {
      result.set(part, at);
      at += part.length;
    }
    return result;
  }
  const declaration = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
  function docx(p) {
    const paragraph = (text, style = "") =>
      `<w:p>${style ? '<w:pPr><w:pStyle w:val="' + style + '"/></w:pPr>' : ""}<w:r><w:t xml:space="preserve">${xml(text)}</w:t></w:r></w:p>`;
    const body = [
      paragraph(p.title, "Title"),
      ...(p.author ? [paragraph(p.author)] : []),
      ...p.chapters.flatMap((c) => [
        paragraph(c.title, "Heading1"),
        ...c.scenes.flatMap((s) => [
          paragraph(s.title, "Heading2"),
          ...s.text.split(/\r?\n/).map((t) => paragraph(t)),
        ]),
      ]),
    ].join("");
    return zip([
      [
        "[Content_Types].xml",
        declaration +
          '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/></Types>',
      ],
      [
        "_rels/.rels",
        declaration +
          '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>',
      ],
      [
        "word/_rels/document.xml.rels",
        declaration +
          '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rIdStyles" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>',
      ],
      [
        "word/styles.xml",
        declaration +
          '<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="Georgia" w:hAnsi="Georgia"/><w:sz w:val="24"/></w:rPr></w:rPrDefault><w:pPrDefault><w:pPr><w:spacing w:after="120" w:line="360" w:lineRule="auto"/></w:pPr></w:pPrDefault></w:docDefaults><w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/></w:style><w:style w:type="paragraph" w:styleId="Title"><w:name w:val="Title"/><w:basedOn w:val="Normal"/><w:rPr><w:b/><w:sz w:val="40"/></w:rPr></w:style><w:style w:type="paragraph" w:styleId="Heading1"><w:name w:val="heading 1"/><w:basedOn w:val="Normal"/><w:pPr><w:pageBreakBefore/><w:keepNext/><w:outlineLvl w:val="0"/></w:pPr><w:rPr><w:b/><w:sz w:val="32"/></w:rPr></w:style><w:style w:type="paragraph" w:styleId="Heading2"><w:name w:val="heading 2"/><w:basedOn w:val="Normal"/><w:pPr><w:keepNext/><w:outlineLvl w:val="1"/></w:pPr><w:rPr><w:b/><w:sz w:val="26"/></w:rPr></w:style></w:styles>',
      ],
      [
        "word/document.xml",
        declaration +
          '<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>' +
          body +
          '<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1134"/></w:sectPr></w:body></w:document>',
      ],
    ]);
  }
  function epub(p) {
    const xhtml = (title, body) =>
      declaration +
      `<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xml:lang="it" lang="it"><head><title>${xml(title)}</title><meta charset="utf-8"/><link rel="stylesheet" type="text/css" href="style.css"/></head><body>${body}</body></html>`;
    const date = new Date().toISOString().replace(/\.\d{3}Z$/, "Z"),
      identifier =
        "https://master-editor-muse.vercel.app/books/" +
        encodeURIComponent(p.id);
    const nav = xhtml(
      "Indice",
      `<nav epub:type="toc" id="toc"><h1>Indice</h1><ol>${p.chapters.map((c, i) => `<li><a href="chapter-${i + 1}.xhtml">${xml(c.title)}</a></li>`).join("")}</ol></nav>`,
    );
    const files = [
      ["mimetype", "application/epub+zip"],
      [
        "META-INF/container.xml",
        declaration +
          '<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container"><rootfiles><rootfile full-path="EPUB/package.opf" media-type="application/oebps-package+xml"/></rootfiles></container>',
      ],
      ["EPUB/nav.xhtml", nav],
      [
        "EPUB/style.css",
        "body{font-family:serif;line-height:1.6;margin:5%;}h1,h2{line-height:1.3;}p{margin:.7em 0;overflow-wrap:break-word;}",
      ],
    ];
    files.push([
      "EPUB/package.opf",
      declaration +
        `<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="book-id"><metadata xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:identifier id="book-id">${xml(identifier)}</dc:identifier><dc:title>${xml(p.title)}</dc:title><dc:language>it</dc:language>${p.author ? "<dc:creator>" + xml(p.author) + "</dc:creator>" : ""}<meta property="dcterms:modified">${date}</meta></metadata><manifest><item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/><item id="css" href="style.css" media-type="text/css"/>${p.chapters.map((c, i) => `<item id="c${i + 1}" href="chapter-${i + 1}.xhtml" media-type="application/xhtml+xml"/>`).join("")}</manifest><spine>${p.chapters.map((c, i) => `<itemref idref="c${i + 1}"/>`).join("")}</spine></package>`,
    ]);
    p.chapters.forEach((c, i) =>
      files.push([
        "EPUB/chapter-" + (i + 1) + ".xhtml",
        xhtml(
          c.title,
          `<section epub:type="chapter"><h1>${xml(c.title)}</h1>${c.scenes
            .map(
              (s) =>
                `<section><h2>${xml(s.title)}</h2>${s.text
                  .split(/\n\s*\n/)
                  .filter((t) => t.trim())
                  .map(
                    (t) => "<p>" + xml(t).replace(/\r?\n/g, "<br/>") + "</p>",
                  )
                  .join("")}</section>`,
            )
            .join("")}</section>`,
        ),
      ]),
    );
    return zip(files);
  }
  return { zip, crc32, xml, docx, epub };
});
