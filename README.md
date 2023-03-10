# voteDapp

* Create a voting dApp to cast votes, delegate and query results on chain
* Request voting tokens to be minted using the API
* Store a list of recent votes in the backend and display that on frontend

## Setup ENV 

```shell
npm install dotenv --save
touch .env
```

```shell
MNEMONIC=""
PRIVATE_KEY=""
INFURA_API_KEY=""
INFURA_API_SECRET=""
ALCHEMY_API_KEY=""
ETHERSCAN_API_KEY=""
```

## Backend NestJS

```shell
cd backend && npm start run:dev
```

## Frontend ReactJS

```shell
cd frontend && npm start
```

## Hardhat

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.ts
```
