# voteDapp

- Create a voting dApp to cast votes, delegate and query results on chain
- Request voting tokens to be minted using the API
- Store a list of recent votes in the backend and display that on frontend

## Setup & Installation:

```shell
npm install
cd backend && npm install
cd frontend && npm install
```

## Setup ENV

```shell
touch .env
```

Add the following to your .env file

```shell
MNEMONIC=""
PRIVATE_KEY=""
INFURA_API_KEY=""
INFURA_API_SECRET=""
ALCHEMY_API_KEY=""
ETHERSCAN_API_KEY=""
```

To run the application:

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

## Deployment

```shell
cd backend && npm install && nest build && npm run start:prod
cd frontend && npm install && npm run build && npx serve
```
