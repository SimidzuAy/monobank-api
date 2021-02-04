import { IParams } from '../types'
import { makeRequest } from '../utils'

interface IAccount {
    /**
     * Ідентифікатор рахунку
     */
    id: string
    /**
     * Баланс рахунку в мінімальних одиницях валюти (копійках, центах)
     */
    balance: bigint
    /**
     * Кредитний ліміт
     */
    creditLimit: bigint
    /**
     * Тип рахунку
     */
    type: 'black' | 'white' | 'platinum' | 'iron' | 'fop' | 'yellow'
    /**
     * Код валюти рахунку відповідно ISO 4217
     */
    currencyCode: number
    /**
     * Тип кешбеку який нараховується на рахунок
     */
    cashbackType: null | 'UAH' | 'Miles'
    iban: string
    maskedPan: string[]
}

interface IClientInfo {
    /**
     * Ідентифікатор клієнта (зівпадає з id для send.monobank.ua)
     */
    id: string
    /**
     * Ім'я клієнта
     */
    name: string
    /**
     * URL для отримання інформації про нову транзакцію
     */
    webHookUrl: string
    /**
     * Перелік доступних рахунків
     */
    accounts: IAccount[]
    permissions: string
}


interface IStatementParams {
    /**
     * Ідентифікатор рахунку з переліку Statement list або 0 - дефолтний рахунок.
     */
    account: string | 0
    /**
     * Початок часу виписки.
     */
    from: string | number
    /**
     * Останній час виписки (якщо відсутній, буде використовуватись поточний час)
     */
    to?: string | number
}

class Personal {
    private readonly _apiUrl: string
    private readonly _token: string

    constructor(params: IParams) {
        this._apiUrl = params.apiUrl
        this._token = params.token
    }

    /**
     * Отримання інформації про клієнта та переліку його рахунків. Обмеження на використання функції не частіше ніж 1 раз у 60 секунд.
     */
    public async clientInfo(): Promise<IClientInfo> {
        return await makeRequest<IClientInfo>(`${this._apiUrl}/personal/client-info`, this._token)
    }

    /**
     * Отримання виписки за час від {from} до {to} часу в секундах в форматі Unix time Максимальний час за який можливо
     * отримувати виписку 31 доба + 1 година (2682000 секунд) Обмеження на використання функції не частіше ніж 1 раз у 60 секунд.
     */
    public async statement(params: IStatementParams) {
        const maxFrom = 2682000

        const to = params.to ? Number(params.to) : Date.now()
        let from = Number(params.from)

        if ( Date.now() - from > maxFrom )
            from = Date.now() - maxFrom

        console.log(to - from)

        return await makeRequest<Object>(`${this._apiUrl}/personal/statement/${params.account}/${from}/${to}`, this._token)
    }
}


export {
    Personal,
    IClientInfo,
    IAccount
}

