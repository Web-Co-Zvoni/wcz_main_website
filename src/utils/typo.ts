/** Czech typography: keep one-letter prepositions/conjunctions off line ends (k, v, s, z, o, u, a, i). */
export function cz(text: string) {
  return text.replace(/(?<=^|[\s(„])([kvszouaiKVSZOUAI])\s+/g, "$1 ");
}
