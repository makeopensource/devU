export function prettyPrintDate(date: string) {
  return new Date(date).toLocaleDateString('en-us', { year: 'numeric', month: '2-digit', day: '2-digit' })
}
export function wordPrintDate(date:string){
  return new Date(date).toLocaleString('en-us', {
    weekday: 'short', 
    month: 'short', 
    day: '2-digit', 
    hour:'2-digit', 
    minute: '2-digit'})
}

export function fullWordPrintDate(date:string){
  return new Date(date).toLocaleString('en-us', {
    weekday: 'long', 
    month: 'long', 
    day: '2-digit', 
    hour:'2-digit', 
    minute: '2-digit'})
}

export function prettyPrintDateTime(date: string) {
  return new Date(date).toLocaleString('en-us', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}
