import type { CodeSnippet } from '../types'

import { javaKeywordsContent } from './javaKeywords'

export const snippets: readonly CodeSnippet[] = [
  {
    id: 'java-keywords',
    title: 'Java keywords',
    language: 'java',
    content: javaKeywordsContent,
  },
  {
    id: 'ts-generic',
    title: 'Generic identity',
    language: 'typescript',
    content: 'function identity<T>(value: T): T {\n  return value\n}',
  },
  {
    id: 'rust-result',
    title: 'Rust map',
    language: 'rust',
    content:
      'fn doubled(x: i32) -> Result<i32, String> {\n  Ok(x * 2)\n}',
  },
  {
    id: 'css-grid',
    title: 'CSS grid',
    language: 'css',
    content:
      '.layout {\n  display: grid;\n  gap: 1rem;\n  grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));\n}',
  },
] as const
