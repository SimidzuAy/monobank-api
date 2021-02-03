import { Bank } from './bank'

interface IMethodsParams {
    token: string
    apiUrl: string
}

class Methods {
    private readonly _bank: Bank

    constructor(params: IMethodsParams) {
        this._bank = new Bank(params)
    }

    get bank() {
        return this._bank
    }
}

export { Methods }
