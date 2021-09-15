import { init as initESLexer, parse as parseESModules } from 'es-module-lexer'

interface ImportMetadata {
  name: string
  path: string
}

export function parseId (id: string) {
  const index = id.indexOf('?')
  if (index < 0) return { path: id, query: {} }

  // @ts-ignore
  const query = Object.fromEntries(new URLSearchParams(id.slice(index)))
  return { path: id.slice(0, index), query }
}

export async function parseImports (code: string) {
  try {
    await initESLexer

    const imports = parseESModules(code)[0]
    const importMap: Record<string, ImportMetadata> = Object.create(null)
    imports.forEach(({ d: isDynamic, n: path, ss: statementStart, s: importPathStart }) => {
      if (isDynamic > -1 || !path) return
      const importFragment = code.substring(statementStart, importPathStart)
      parseImportVariables(importFragment).forEach(([name, asName]) => {
        importMap[asName] = { name, path }
      })
    })
    return importMap
  }
  catch (error) {
    console.error(error)
    return {}
  }
}

const importStatementRegex = /import\s*(.*?)\s*from['"\s]+$/s
const importVarRegex = /(?:\{\s*((?:[^,}]+[,\s]*)+)\}|([^,]+))(?:[,\s]*|\s*$)+/sg
const trim = (s: string) => s.trim()

export function parseImportVariables (partialStatement: string) {
  const variablesStr = partialStatement.match(importStatementRegex)?.[1].trim()
  if (!variablesStr) return [] // Example: import '~/styles/main.css'

  const variables = Array.from(variablesStr.matchAll(importVarRegex))
    .flatMap(([, inBrackets, outer]) => {
      if (inBrackets) return inBrackets.split(',').map(trim).filter(x => x)
      outer = outer.trim()
      return outer.includes(' as ') ? outer : `default as ${outer}`
    })

  return variables.map(variable => variable.split(' as ').map(trim))
}