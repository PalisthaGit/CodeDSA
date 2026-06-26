import hljs from 'highlight.js/lib/core'
import cpp from 'highlight.js/lib/languages/cpp'

hljs.registerLanguage('cpp', cpp)

const CPP_PATTERN = /#include|int main|cout|cin|std::|namespace|\bint\b|\bstring\b|\bfor\s*\(|\bwhile\s*\(|\breturn\b/

function decodedEntities(html: string): string {
  return html
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
}

export function applyCodeHighlighting(html: string): string {
  return html.replace(
    /<pre class="codeBlock"><code>([\s\S]*?)<\/code><\/pre>/g,
    (_, rawCode) => {
      const code = decodedEntities(rawCode)
      if (!CPP_PATTERN.test(code)) {
        return `<pre class="codeBlock codeBlock--plain"><code>${rawCode}</code></pre>`
      }
      const highlighted = hljs.highlight(code, { language: 'cpp' }).value
      return `<pre class="codeBlock codeBlock--cpp"><code class="hljs">${highlighted}</code></pre>`
    }
  )
}
