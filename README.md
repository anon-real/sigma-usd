# SigmaUSD UI
SigmaUSD is an instance of AgeUSD protocol for Ergo blockchain.

Please note that the UI itself is not the instance; it only interacts with the deployed contracts on Ergo blockchain
which has been deployed by other anonymous community members not connected with Emurgo or EF.

## install
```bash
npm install
```

## run in dev mode
```bash
npm run start
```

## build
```bash
npm run-script build
```

This project uses web-assembly. If you want to serve it using nginx, make sure nginx can serve WASM files - you can use the [mime.types](mime.types) file.

## Assembler service
You have to set up your own [assembler service](https://github.com/anon-real/ergo-assembler) and set its url in the [const](src/utils/consts.js) file before deploying the UI.
