import { addReq, getWalletAddress } from './helpers';
import { Address } from '@coinbarn/ergo-ts';
import { follow, getHeight, p2s, returnFee } from './assembler';
import { ergToNano } from './serializer';
import { bankNFTId, forceUpdateState, mintRcTx, priceToMintRc, rcTokenId } from './ageHelper';
import moment from 'moment';
import { assemblerNodeAddr, ergSendPrecision, implementor, minErgVal, reserveAcronym, usdAcronym, waitHeightThreshold } from './consts';
import { getScMintP2s } from './mintSc';
import { getRcRedeemP2s } from './redeemRc';
import { walletCreate } from './walletUtils';
let ergolib = import('ergo-lib-wasm-browser')

const template = `{
  val properMinting = {
    val myOut = OUTPUTS(1)
    myOut.propositionBytes == fromBase64("$userAddress") &&
      myOut.tokens(0)._1 == fromBase64("$rcTokenId") &&
      myOut.tokens(0)._2 >= $rcAmountL && HEIGHT < $timestampL &&
      HEIGHT <= $refundHeight // This allows multiple tries before refunding
  }
  val returnFunds = {
    val total = INPUTS.fold(0L, {(x:Long, b:Box) => x + b.value}) - ${returnFee}
    OUTPUTS(0).value >= total && OUTPUTS(0).propositionBytes == fromBase64("$userAddress") &&
        (PK("${assemblerNodeAddr}") || HEIGHT > $refundHeight)
  }
  val implementorOK = OUTPUTS(2).propositionBytes == fromBase64("$implementor") && OUTPUTS.size == 4
  val properBank = OUTPUTS(0).tokens(2)._1 == fromBase64("$bankNFT")
  sigmaProp((properMinting && implementorOK && properBank) || (returnFunds && OUTPUTS.size == 2))
}`;

export async function mintRc(amount, context, assembler=true) {
    await forceUpdateState();

    const { signTx, submitTx, getWalletUtxos: getUtxos, isAddressSet } = context;

    let ourAddr = getWalletAddress();
    let befPrice = await priceToMintRc(amount) + 1000000;
    let height = await getHeight()
    let price = (befPrice / 1e9).toFixed(ergSendPrecision);
    price = ergToNano(price);
    if (price < befPrice) price += 10 ** (9 - ergSendPrecision)
    let tx = await mintRcTx(amount);
    for (let i = 0; i < tx.requests.length; i++) {
        if (tx.requests[i].value < minErgVal) throw new Error("The amount you're trying to mint is too small!")
    }
    tx.requests[1].value += (price - befPrice);

    if (assembler) {
        let addr = (await getRcMintP2s(amount, tx.dataInputs[0], height)).address;
        let addr2 = (await getRcRedeemP2s(amount, tx.dataInputs[0], height)).address;
        let request = {
            address: addr,
            returnTo: ourAddr,
            startWhen: {
                erg: price
            },
            txSpec: tx
        };
        return follow(request).then(res => {
            if (res.id !== undefined) {
                let toFollow = {
                    id: res.id,
                    info: {
                        address: addr,
                        returnTo: ourAddr,
                        get: `+${amount} ${reserveAcronym}`,
                        pay: `-${(price / 1e9).toFixed(2)} ERG`,
                        type: `Purchase ${reserveAcronym}`,
                        sign: '',
                        timestamp: moment().valueOf()
                    },
                    key: 'operation',
                    status: 'follow',
                    operation: 'minting reservecoin'
                };
                addReq(toFollow, 'reqs');
                res.price = price;
                res.addr = addr;
            }
            return res;
        });
    } else {
        let resTx = await walletCreate({
            need: { ERG: price },
            req: tx,
            getUtxos: getUtxos,
            signTx: signTx,
            submitTx: submitTx,
        })
        const info = {
            id: resTx.id,
            get: `+${amount} ${reserveAcronym}`,
            pay: `-${(price / 1e9).toFixed(2)} ERG`,
            type: `Purchase ${reserveAcronym}`,
            sign: '',
            timestamp: moment().valueOf(),
            tx: resTx,
            txId: resTx.id,
            miningStat: 'pending',
            isNautilus: true
        }
        addReq(info, 'operation', 'id')
    }
}

export async function getRcMintP2s(amount, oracleBoxId, height) {
    let ourAddr = getWalletAddress();
    let userTreeHex = new Address(ourAddr).ergoTree;
    let userTree = Buffer.from(userTreeHex, 'hex').toString('base64');

    let implementorEnc = Buffer.from(new Address(implementor).ergoTree, 'hex').toString('base64');

    let rcTokenId64 = Buffer.from(await rcTokenId(), 'hex').toString('base64');
    let bankNFT64 = Buffer.from(await bankNFTId(), 'hex').toString('base64');
    let oracleBoxId64 = Buffer.from(oracleBoxId, 'hex').toString('base64')

    let script = template
        .replaceAll('$userAddress', userTree)
        .replaceAll('$implementor', implementorEnc)
        .replace('$rcAmount', parseInt(amount))
        .replace('$rcTokenId', rcTokenId64)
        .replace('$bankNFT', bankNFT64)
        .replaceAll('$oracleBoxId', oracleBoxId64)
        .replaceAll('$timestamp', moment().valueOf())
        .replaceAll('$refundHeight', height + waitHeightThreshold)
        .replaceAll('\n', '\\n');
    return p2s(script);
}
