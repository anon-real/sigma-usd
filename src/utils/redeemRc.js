import { addReq, getWalletAddress } from './helpers';
import { Address } from '@coinbarn/ergo-ts';
import { follow, getHeight, p2s, returnFee } from './assembler';
import {
    amountFromRedeemingRc, bankNFTId,
    forceUpdateState,
    rcTokenId,
    redeemRcTx,
    scTokenId
} from './ageHelper';
import moment from 'moment';
import { assemblerNodeAddr, implementor, minErgVal, reserveAcronym, usdAcronym, waitHeightThreshold } from './consts';
import { walletCreate } from './walletUtils';

const template = `{
  val rcTokenId = fromBase64("$rcTokenId")
  val properRedeeming = {
    val myOut = OUTPUTS(1)
    myOut.propositionBytes == fromBase64("$userAddress") &&
      myOut.value >= $redeemAmountL && HEIGHT < $timestampL &&
      HEIGHT <= $refundHeight // This allows multiple tries before refunding
  }
  val returnFunds = {
    val total = INPUTS.fold(0L, {(x:Long, b:Box) => x + b.value}) - ${returnFee}
    val totalInRc = INPUTS.fold(0L, {(x:Long, b:Box) => {
      val tok = b.tokens.getOrElse(0, (rcTokenId, 0L))
      if (tok._1 == rcTokenId) tok._2
      else 0L
    }})
    val tok = OUTPUTS(0).tokens.getOrElse(0, (rcTokenId, 0L))
    OUTPUTS(0).value >= total && OUTPUTS(0).propositionBytes == fromBase64("$userAddress") &&
      ((tok._1 == rcTokenId && tok._2 == totalInRc) || totalInRc == 0) && 
        (PK("${assemblerNodeAddr}") || HEIGHT > $refundHeight)
  }
  val implementorOK = OUTPUTS(2).propositionBytes == fromBase64("$implementor") && OUTPUTS.size == 4
  val properBank = OUTPUTS(0).tokens(2)._1 == fromBase64("$bankNFT")
  sigmaProp((properRedeeming && implementorOK && properBank) || (returnFunds && OUTPUTS.size == 2))
}`;

export async function redeemRc(amount, context, assembler=true) {
    await forceUpdateState()

    const { signTx, submitTx, getWalletUtxos: getUtxos, isAddressSet } = context;

    let ourAddr = getWalletAddress();
    let ergGet = (await amountFromRedeemingRc(amount) / 1e9)
    let tx = await redeemRcTx(amount)
    let height = await getHeight()
    for (let i = 0; i < tx.requests.length; i++) {
        if (tx.requests[i].value < minErgVal) throw new Error("The amount you're trying to redeem is too small!")
    }
    const ergNeed = 10000000;
    if (assembler) {
        let addr = (await getRcRedeemP2s(tx.requests[1].value, tx.dataInputs[0], height)).address
        let request = {
            address: addr,
            returnTo: ourAddr,
            startWhen: {
                erg: ergNeed
            },
            txSpec: tx,
        };
        amount = parseInt(amount)
        request.startWhen[await rcTokenId()] = amount
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
    } else {
        let resTx = await walletCreate({
            need: { ERG: ergNeed, [await rcTokenId()]: amount },
            req: tx,
            getUtxos: getUtxos,
            signTx: signTx,
            submitTx: submitTx,
        })
        const info = {
            id: resTx.id,
            get: `+${ergGet.toFixed(2)} ERG`,
            pay: `-${amount} ${reserveAcronym}`,
            type: `Redeem ${reserveAcronym}`,
            sign: '$',
            timestamp: moment().valueOf(),
            tx: resTx,
            txId: resTx.id,
            miningStat: 'pending',
            isNautilus: true
        }
        addReq(info, 'operation', 'id')
    }
}

export async function getRcRedeemP2s(amount, oracleBoxId, height) {
    let ourAddr = getWalletAddress();
    let userTreeHex = new Address(ourAddr).ergoTree
    let userTree = Buffer.from(userTreeHex, 'hex').toString('base64');

    let implementorEnc = Buffer.from(new Address(implementor).ergoTree, 'hex').toString('base64');

    let rcTokenId64 = Buffer.from(await rcTokenId(), 'hex').toString('base64')
    let bankNFT64 = Buffer.from(await bankNFTId(), 'hex').toString('base64');
    let oracleBoxId64 = Buffer.from(oracleBoxId, 'hex').toString('base64')

    let script = template
        .replaceAll('$userAddress', userTree)
        .replaceAll('$implementor', implementorEnc)
        .replaceAll('$redeemAmount', amount)
        .replaceAll('$rcTokenId', rcTokenId64)
        .replace('$bankNFT', bankNFT64)
        .replaceAll('$oracleBoxId', oracleBoxId64)
        .replaceAll('$timestamp', moment().valueOf())
        .replaceAll('$refundHeight', height + waitHeightThreshold)
        .replaceAll('\n', '\\n');
    return p2s(script);
}
