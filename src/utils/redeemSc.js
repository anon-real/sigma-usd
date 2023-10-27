import { addReq, getWalletAddress } from './helpers';
import { Address } from '@coinbarn/ergo-ts';
import { follow, getAddressFunds, getHeight, p2s, returnFee } from './assembler';
import { dollarToCent } from './serializer';
import { ergoPayBroadcast, ergoPaySign, walletCreate } from './walletUtils';
import {
    amountFromRedeemingRc,
    amountFromRedeemingSc, bankNFTId,
    forceUpdateState,
    rcTokenId,
    redeemScTx,
    scTokenId
} from './ageHelper';
import moment from 'moment';
import { assemblerNodeAddr, implementor, minErgVal, reserveAcronym, usdAcronym, usdName, waitHeightThreshold } from './consts';

const template = `{
  val scTokenId = fromBase64("$scTokenId")
  val properRedeeming = {
    val myOut = OUTPUTS(1)
    myOut.propositionBytes == fromBase64("$userAddress") &&
      myOut.value >= $redeemAmountL && HEIGHT < $timestampL &&
      HEIGHT <= $refundHeight // This allows multiple tries before refunding
  }
  val returnFunds = {
    val total = INPUTS.fold(0L, {(x:Long, b:Box) => x + b.value}) - ${returnFee}
    val totalInSc = INPUTS.fold(0L, {(x:Long, b:Box) => {
      val tok = b.tokens.getOrElse(0, (scTokenId, 0L))
      if (tok._1 == scTokenId) tok._2
      else 0L
    }})
    val tok = OUTPUTS(0).tokens.getOrElse(0, (scTokenId, 0L))
    OUTPUTS(0).value >= total && OUTPUTS(0).propositionBytes == fromBase64("$userAddress") &&
      ((tok._1 == scTokenId && tok._2 == totalInSc) || totalInSc == 0) &&
        (PK("${assemblerNodeAddr}") || HEIGHT > $refundHeight)
  }
  val implementorOK = OUTPUTS(2).propositionBytes == fromBase64("$implementor") && OUTPUTS.size == 4
  val properBank = OUTPUTS(0).tokens(2)._1 == fromBase64("$bankNFT")
  sigmaProp((properRedeeming && implementorOK && properBank) || (returnFunds && OUTPUTS.size == 2))
}`;

export async function redeemSc(amount, context, assembler=true, ergopay=false) {
    await forceUpdateState()

    var { signTx, submitTx, getWalletUtxos: getUtxos, isAddressSet } = context;
    if (ergopay) {
        signTx = ergoPaySign;
        getUtxos = getAddressFunds;
        submitTx = ergoPayBroadcast;
    }


    let ourAddr = getWalletAddress();
    let ergGet = (await amountFromRedeemingSc(amount) / 1e9)
    let height = await getHeight()
        let tx = await redeemScTx(amount)
    for (let i = 0; i < tx.requests.length; i++) {
        if (tx.requests[i].value < minErgVal) throw new Error(" The amount you're trying to redeem is too small!")
    }

    const ergNeed = 10000000
    if (assembler) {
        let addr = (await getScRedeemP2s(tx.requests[1].value, tx.dataInputs[0], height)).address
        let request = {
            address: addr,
            returnTo: ourAddr,
            startWhen: {
                erg: ergNeed
            },
            txSpec: tx,
        };
        request.startWhen[await scTokenId()] = dollarToCent(amount)
        return follow(request).then(res => {
            if (res.id !== undefined) {
                let toFollow = {
                    id: res.id,
                    address: addr,
                    info: {
                        address: addr,
                        returnTo: ourAddr,
                        get: `+${ergGet.toFixed(2)} ERG`,
                        pay: `-${amount} ${usdAcronym}`,
                        type: `Redeem ${usdAcronym}`,
                        sign: '$',
                        timestamp: moment().valueOf()
                    },
                    key: 'operation',
                    status: 'follow',
                    operation: 'redeeming stablecoin'
                };
                addReq(toFollow, 'reqs')
                res.addr = addr
            }
            return res
        })
    } else {
        let resTx = await walletCreate({
            need: { ERG: ergNeed, [await scTokenId()]: dollarToCent(amount) },
            req: tx,
            getUtxos: getUtxos,
            signTx: signTx,
            submitTx: submitTx,
        })
        const info = {
            id: resTx.id,
            get: `+${ergGet.toFixed(2)} ERG`,
            pay: `-${amount} ${usdAcronym}`,
            type: `Redeem ${usdAcronym}`,
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

export async function getScRedeemP2s(amount, oracleBoxId, height) {
    let ourAddr = getWalletAddress();
    let userTreeHex = new Address(ourAddr).ergoTree
    let userTree = Buffer.from(userTreeHex, 'hex').toString('base64');

    let implementorEnc = Buffer.from(new Address(implementor).ergoTree, 'hex').toString('base64');

    let scTokenId64 = Buffer.from(await scTokenId(), 'hex').toString('base64')
    let bankNFT64 = Buffer.from(await bankNFTId(), 'hex').toString('base64');
    let oracleBoxId64 = Buffer.from(oracleBoxId, 'hex').toString('base64')

    let script = template
        .replaceAll('$userAddress', userTree)
        .replaceAll('$implementor', implementorEnc)
        .replaceAll('$redeemAmount', amount)
        .replaceAll('$scTokenId', scTokenId64)
        .replace('$bankNFT', bankNFT64)
        .replaceAll('$oracleBoxId', oracleBoxId64)
        .replaceAll('$timestamp', moment().valueOf())
        .replaceAll('$refundHeight', height + waitHeightThreshold)
        .replaceAll('\n', '\\n');
    return p2s(script);
}
