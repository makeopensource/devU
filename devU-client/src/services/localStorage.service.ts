export function set(key: string, value: string) {
  localStorage.setItem(key, value)
}

export function get(key: string) {
  return localStorage.getItem(key)
}

export function setObject(key: string, obj: any) {
  const value = JSON.stringify(obj)

  localStorage.setItem(key, value)
}

export function getObject(key: string): any | null {
  const value = localStorage.getItem(key)

  if (!value) return null

  try {
    return JSON.parse(value)
  } catch (err) {
    console.error(err)
    return null
  }
}

export function remove(key: string) {
  localStorage.removeItem(key)
}

export default {
  set,
  get,
  setObject,
  getObject,
  remove,
}
