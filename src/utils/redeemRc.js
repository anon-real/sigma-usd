import { addReq, getWalletAddress } from './helpers';
import { Address } from '@coinbarn/ergo-ts';
import { follow, p2s } from './assembler';
import {
    amountFromRedeemingRc,
    forceUpdateState,
    rcTokenId,
    redeemRcTx,
    scTokenId
} from './ageHelper';
import moment from 'moment';
import { implementor, minErgVal, reserveAcronym, usdAcronym } from './consts';

const template = `{
  val rcTokenId = fromBase64("$rcTokenId")
  val properRedeeming = {
    val myOut = OUTPUTS(1)
    myOut.propositionBytes == fromBase64("$userAddress") &&
      myOut.value >= $redeemAmountL && HEIGHT < $timestampL &&
      CONTEXT.dataInputs(0).id == fromBase64("$oracleBoxId")
  }
  val returnFunds = {
    val total = INPUTS.fold(0L, {(x:Long, b:Box) => x + b.value}) - 4000000
    val totalInRc = INPUTS.fold(0L, {(x:Long, b:Box) => {
      val tok = b.tokens.getOrElse(0, (rcTokenId, 0L))
      if (tok._1 == rcTokenId) tok._2
      else 0L
    }})
    val tok = OUTPUTS(0).tokens.getOrElse(0, (rcTokenId, 0L))
    OUTPUTS(0).value >= total && OUTPUTS(0).propositionBytes == fromBase64("$userAddress") &&
      ((tok._1 == rcTokenId && tok._2 == totalInRc) || totalInRc == 0)
  }
  val implementorOK = OUTPUTS(2).propositionBytes == fromBase64("$implementor") && OUTPUTS.size == 4
  sigmaProp((properRedeeming && implementorOK) || (returnFunds && OUTPUTS.size == 2))
}`;

export async function redeemRc(amount) {
    await forceUpdateState()

    let ourAddr = getWalletAddress();
    let ergGet = (await amountFromRedeemingRc(amount) / 1e9)
    let tx = await redeemRcTx(amount)
    for (let i = 0; i < tx.requests.length; i++) {
        if (tx.requests[i].value < minErgVal) throw new Error("The amount you're trying to redeem is too small!")
    }
    let addr = (await getRcRedeemP2s(tx.requests[1].value, tx.dataInputs[0])).address
    let request = {
        address: addr,
        returnTo: ourAddr,
        startWhen: {
            erg: 10000000
        },
        txSpec: tx,
    };
    amount = parseInt(amount)
    request.startWhen[await rcTokenId()] = amount
    request.startWhen[await scTokenId()] = 0
    return follow(request).then(res => {
        if (res.id !== undefined) {
            let toFollow = {
                id: res.id,
                address: addr,
                info: {
                    address: addr,
                    returnTo: ourAddr,
                    get: `+${ergGet.toFixed(2)} ERG`,
                    pay: `-${amount} ${reserveAcronym}`,
                    type: `Redeem ${reserveAcronym}`,
                    sign: '',
                    timestamp: moment().valueOf()
                },
                key: 'operation',
                status: 'follow',
                operation: 'redeeming reservecoin'
            };
            addReq(toFollow, 'reqs')
            res.addr = addr
        }
        return res
    })
}

export async function getRcRedeemP2s(amount, oracleBoxId) {
    let ourAddr = getWalletAddress();
    let userTreeHex = new Address(ourAddr).ergoTree
    let userTree = Buffer.from(userTreeHex, 'hex').toString('base64');

    let implementorEnc = Buffer.from(new Address(implementor).ergoTree, 'hex').toString('base64');

    let rcTokenId64 = Buffer.from(await rcTokenId(), 'hex').toString('base64')
    let oracleBoxId64 = Buffer.from(oracleBoxId, 'hex').toString('base64')

    let script = template
        .replaceAll('$userAddress', userTree)
        .replaceAll('$implementor', implementorEnc)
        .replaceAll('$redeemAmount', amount)
        .replaceAll('$rcTokenId', rcTokenId64)
        .replaceAll('$oracleBoxId', oracleBoxId64)
        .replaceAll('$timestamp', moment().valueOf())
        .replaceAll('\n', '\\n');
    return p2s(script);
}
