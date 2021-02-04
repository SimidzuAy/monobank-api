import { Bank, Personal } from './methods'

interface IClientParams {
    apiUrl?: string
    token: string
}

class MonoClient {
    private readonly _bank: Bank
    private readonly _personal: Personal

    constructor(params: IClientParams) {
        const apiUrl = params.apiUrl ? params.apiUrl : 'https://api.monobank.ua'

        this._bank = new Bank({
            token: params.token,
            apiUrl
        })

        this._personal = new Personal({
            token: params.token,
            apiUrl
        })

    }

    get bank() {
        return this._bank
    }

    get personal() {
        return this._personal
    }
}


export { MonoClient, IClientParams }
export * from './methods'
