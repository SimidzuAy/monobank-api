import { Methods } from './methods/index'

interface IClientParams {
    apiUrl?: string
    token: string
}

class Client {
    private readonly _methods: Methods

    constructor(params: IClientParams) {
        const apiUrl = params.apiUrl ? params.apiUrl : "https://api.monobank.ua/"

        this._methods = new Methods({
            token: params.token,
            apiUrl: apiUrl
        })
    }

    get methods() {
        return this._methods
    }
}


export { Client, IClientParams }
export * from './methods/index'
export * from './methods/bank'
