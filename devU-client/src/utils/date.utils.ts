export function prettyPrintDate(date: string) {
  return new Date(date).toLocaleDateString('en-us', { year: 'numeric', month: '2-digit', day: '2-digit' })
}
