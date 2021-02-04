# monobank-api

## Install
Yarn | Npm
-----|----
yarn add monobank-api | npm i monobank-api

## Usage
```typescript
import { MonoClient } from 'monobank-api'

const client = new MonoClient({
    token: process.env.TOKEN
})

client.bank.currency().then(console.log)

```

### Support 
- [X] Standart api
- [ ] Corporate api
