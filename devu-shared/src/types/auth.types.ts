export type SchoolAuth = {
  email: string
  schoolId: string
}

export type ApiAuth = {
  token: string
}

export type DeserializedRefreshToken = {
  id: number
}

export type DeserializedToken = {
  iat?: number
  exp?: number
  email: string
}

export type Provider = {
  name: string
  route: string
  method: string
  body?: string[]
}
