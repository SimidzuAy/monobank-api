import fetch from 'node-fetch'

export const makeRequest = async <T>(url: string, token: string): Promise<T> => {
    const ans = await (
        await fetch(url, {
            headers: {
                'X-token': token
            }
        })
    ).json()

    if (ans.errorDescription) {
        throw new Error(ans.errorDescription)
    }

    return ans as T
}
