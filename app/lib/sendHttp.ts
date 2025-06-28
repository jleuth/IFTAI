
export default async function sendRequest(method: string, url: string, body: any, headers?: any) {

    const response = await fetch(url, {
        method: method,
        body: JSON.stringify(body),
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        }
    })

    return response.json()
}