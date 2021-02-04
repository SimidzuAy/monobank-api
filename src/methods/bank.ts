import { IParams } from '../types'
import { makeRequest } from '../utils'

interface ICurrencyAnswer {
    /**
     * Код валюти рахунку відповідно ISO 4217
     */
    currencyCodeA: number
    /**
     * Код валюти рахунку відповідно ISO 4217
     */
    currencyCodeB: number
    /**
     * Час курсу в секундах в форматі Unix time
     */
    date: number
    rateSell: number
    rateBuy: number
    rateCross: number
}

class Bank {
    private readonly _token: string
    private readonly _apiUrl: string

    constructor(params: IParams) {
        this._apiUrl = params.apiUrl
        this._token = params.token
    }

    /**
     * Отримати базовий перелік курсів валют monobank. Інформація кешується та оновлюється не частіше 1 разу на 5 хвилин.
     */
    public async currency(): Promise<ICurrencyAnswer[]> {
        return await makeRequest<ICurrencyAnswer[]>(`${this._apiUrl}/bank/currency`, this._token)
    }
}

export { Bank }
