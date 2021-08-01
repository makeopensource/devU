export function set(key: string, value: string) {
  localStorage.setItem(key, value)
}

// Not totally typesafe if something in local storage doesn't match it's type on read
export function get<T = any>(key: string): T | null {
  const storedValue: unknown = localStorage.getItem(key)

  return storedValue ? (storedValue as T) : null
}

export function setObject(key: string, obj: any) {
  const value = JSON.stringify(obj)

  localStorage.setItem(key, value)
}

// Not totally typesafe if something in local storage doesn't match it's type on read
export function getObject<T = any>(key: string): T | null {
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
