import { type Client } from '@react-with-iam/types'

export type ParsedJwt = Client.User & {
    iat: Date
}

export const getJwt = function () {
    return localStorage.getItem('jwt')
}

export const parseJwt = function (jwt: string): ParsedJwt {
    var base64Url = jwt.split('.')[1]
    var base64 = base64Url.replace('-', '+').replace('_', '/')
    return JSON.parse(atob(base64))
}

export const requestAuth = function (formData: FormData, urlEnding: string) {
    return fetch(`${import.meta.env.VITE_API_URL}${urlEnding}`, {
        method: 'POST',
        headers: {
            content: 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(formData as any),
    })
}
