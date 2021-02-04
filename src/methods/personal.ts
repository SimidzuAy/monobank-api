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

interface IStatement {
    /**
     * Унікальний id транзакції
     */
    id: string
    /**
     * Час транзакції в секундах в форматі Unix time
     */
    time: bigint
    /**
     * Опис транзакцій
     */
    description: string
    /**
     * Код типу транзакції (Merchant Category Code), відповідно ISO 18245
     */
    mcc: number
    /**
     * Статус блокування суми (детальніше у wiki)
     * @see {@link https://en.wikipedia.org/wiki/Authorization_hold|wiki}
     */
    hold: boolean
    /**
     * Сума у валюті рахунку в мінімальних одиницях валюти (копійках, центах)
     */
    amount: bigint
    /**
     * Сума у валюті транзакції в мінімальних одиницях валюти (копійках, центах)
     */
    operationAmount: bigint
    /**
     * Код валюти рахунку відповідно ISO 4217
     */
    currencyCode: number
    /**
     * Розмір комісії в мінімальних одиницях валюти (копійках, центах)
     */
    commissionRate: bigint
    /**
     * Розмір кешбеку в мінімальних одиницях валюти (копійках, центах)
     */
    cashbackAmount: bigint
    /**
     * Баланс рахунку в мінімальних одиницях валюти (копійках, центах)
     */
    balance: bigint
    /**
     * Коментар до переказу, уведений користувачем. Якщо не вказаний, поле буде відсутнім
     */
    comment: string
    /**
     * Номер квитанции для check.gov.ua
     */
    receiptId: string
    /**
     * ЄДРПОУ контрагента, присутній лише для елементів виписки рахунків ФОП
     */
    counterEdrpou: string
    /**
     * IBAN контрагента, присутній лише для елементів виписки рахунків ФОП
     */
    counterIban: string
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
    public async statement(params: IStatementParams): Promise<IStatement> {
        const maxFrom = 2682000

        // Деление на 1000 т.к перевод в секунды...
        const to = params.to ? Number(params.to) : Math.round(Date.now() / 1000)
        let from = Number(params.from)

        if (Date.now() - from > maxFrom) from = Math.round(Date.now() / 1000 - maxFrom)

        return await makeRequest<IStatement>(
            `${this._apiUrl}/personal/statement/${params.account}/${from}/${to}`,
            this._token
        )
    }
}

export { Personal, IClientInfo, IAccount }
