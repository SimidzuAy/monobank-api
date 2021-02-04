import fetch from 'node-fetch'

export const makeRequest = async <T>(url: string, token: string): Promise<T> => {
    const ans = await (
        await fetch(url, {
            headers: {
                'X-token': token
            }
        })
    ).json()

    return ans as T
}
