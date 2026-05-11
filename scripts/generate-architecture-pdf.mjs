/**
 * NeonTrade AI — Architecture audit → PDF (Puppeteer)
 * Reads: docs/NeonTrade_AI_Architecture.md
 * Writes: NeonTrade_AI_Architecture.pdf (project root)
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import puppeteer from 'puppeteer'
import { marked } from 'marked'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const MD_PATH = path.join(ROOT, 'docs', 'NeonTrade_AI_Architecture.md')
const OUT_PATH = path.join(ROOT, 'NeonTrade_AI_Architecture.pdf')

marked.use({
  gfm: true,
  breaks: false,
})

function buildHtml(bodyHtml) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>NeonTrade AI — System Architecture Audit</title>
  <style>
    @page { size: A4; margin: 18mm 16mm 22mm 16mm; }
    * { box-sizing: border-box; }
    html, body {
      margin: 0;
      padding: 0;
      font-family: Arial, Helvetica, sans-serif;
      font-size: 11pt;
      line-height: 1.45;
      color: #111;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .cover {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      page-break-after: always;
      padding: 48px 24px;
    }
    .cover h1 {
      font-size: 28pt;
      font-weight: 700;
      margin: 0 0 16px 0;
      letter-spacing: -0.02em;
    }
    .cover .subtitle {
      font-size: 14pt;
      color: #333;
      margin: 0;
      font-weight: 600;
    }
    .cover .meta {
      margin-top: 48px;
      font-size: 10pt;
      color: #555;
    }
    .document-body {
      max-width: 100%;
    }
    .document-body h1 {
      font-size: 20pt;
      margin: 0 0 12pt 0;
      page-break-after: avoid;
    }
    .document-body h2 {
      font-size: 14pt;
      margin: 18pt 0 8pt 0;
      border-bottom: 1px solid #ccc;
      padding-bottom: 4px;
      page-break-after: avoid;
    }
    .document-body h3 {
      font-size: 12pt;
      margin: 14pt 0 6pt 0;
      page-break-after: avoid;
    }
    .document-body p { margin: 0 0 8pt 0; }
    .document-body ul, .document-body ol {
      margin: 0 0 10pt 0;
      padding-left: 22px;
    }
    .document-body li { margin: 0 0 4pt 0; }
    .document-body hr {
      border: none;
      border-top: 1px solid #ddd;
      margin: 14pt 0;
    }
    .document-body strong { font-weight: 700; }
    .document-body table {
      width: 100%;
      border-collapse: collapse;
      margin: 10pt 0 14pt 0;
      font-size: 10pt;
      page-break-inside: avoid;
    }
    .document-body th,
    .document-body td {
      border: 1px solid #333;
      padding: 6px 8px;
      vertical-align: top;
      text-align: left;
    }
    .document-body th {
      background: #f2f2f2;
      font-weight: 700;
    }
    .document-body pre {
      font-family: ui-monospace, "Cousine", "Roboto Mono", Menlo, Consolas, monospace;
      font-size: 8.5pt;
      line-height: 1.35;
      white-space: pre;
      overflow-wrap: normal;
      border: 1px solid #999;
      background: #fafafa;
      padding: 10px 12px;
      margin: 10pt 0 14pt 0;
      page-break-inside: avoid;
    }
    .document-body code {
      font-family: ui-monospace, "Cousine", "Roboto Mono", Menlo, Consolas, monospace;
      font-size: 9.5pt;
      background: #f5f5f5;
      padding: 1px 4px;
      border-radius: 2px;
    }
    .document-body pre code {
      background: transparent;
      padding: 0;
      font-size: inherit;
    }
  </style>
</head>
<body>
  <section class="cover">
    <h1>NeonTrade AI</h1>
    <p class="subtitle">System Architecture &amp; ML Integration</p>
    <p class="meta">System Architecture Audit · Technical documentation</p>
  </section>
  <article class="document-body">
${bodyHtml}
  </article>
</body>
</html>`
}

async function main() {
  const md = fs.readFileSync(MD_PATH, 'utf8')
  const bodyHtml = marked.parse(md)
  const html = buildHtml(bodyHtml)

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })
  try {
    const page = await browser.newPage()
    await page.setContent(html, { waitUntil: 'networkidle0' })
    await page.pdf({
      path: OUT_PATH,
      format: 'A4',
      printBackground: true,
      displayHeaderFooter: true,
      headerTemplate: '<div></div>',
      footerTemplate: `
        <div style="width:100%;font-size:9px;font-family:Arial,Helvetica,sans-serif;color:#444;padding:0 16mm;text-align:center;">
          <span style="margin-right:6px;">NeonTrade AI</span>
          <span>—</span>
          <span style="margin:0 6px;">Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
        </div>
      `,
      margin: {
        top: '14mm',
        right: '14mm',
        bottom: '18mm',
        left: '14mm',
      },
    })
    console.log('Wrote PDF:', OUT_PATH)
  } finally {
    await browser.close()
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
