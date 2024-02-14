
import JSONBigInt from "json-bigint"
export const JSON = JSONBigInt({useNativeBigInt: true})
let ergolib = import('ergo-lib-wasm-browser')

const floatRe = new RegExp('^([0-9]*[.])?[0-9]*$')
const naturalRe = new RegExp('^[0-9]+$')

export async function encodeNum(n, isInt = false) {
    if (isInt) return (await ergolib).Constant.from_i32(n).encode_to_base16()
    else return (await ergolib).Constant.from_i64((await ergolib).I64.from_str(n)).encode_to_base16()
}

export async function decodeNum(n, isInt = false) {
    if (isInt) return (await ergolib).Constant.decode_from_base16(n).to_i32()
    else return (await ergolib).Constant.decode_from_base16(n).to_i64().to_str()

}

export async function encodeHex(reg) {
    return (await ergolib).Constant.from_byte_array(Buffer.from(reg, 'hex')).encode_to_base16()
}

function toHexString(byteArray) {
    return Array.from(byteArray, function(byte) {
        return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join('')
}

export async function decodeString(encoded) {
    return toHexString((await ergolib).Constant.decode_from_base16(encoded).to_byte_array())
}

export function ergToNano(erg) {
    if (erg === undefined) return 0
    if (erg.startsWith('.')) return parseInt(erg.slice(1) + '0'.repeat(9 - erg.length + 1))
    let parts = erg.split('.')
    if (parts.length === 1) parts.push('')
    if (parts[1].length > 9) return 0
    return parseInt(parts[0] + parts[1] + '0'.repeat(9 - parts[1].length))
}

export function dollarToCent(dollar) {
    if (dollar === undefined) return 0
    if (dollar.startsWith('.')) {
        let part = dollar.slice(1)
        if (part.length > 2) part = part.slice(0, 2)
        return parseInt(part + '0'.repeat(2 - part.length))
    }
    let parts = dollar.split('.')
    if (parts.length === 1) parts.push('')
    if (parts[1].length > 2) parts[1] = parts[1].slice(0, 2)
    return parseInt(parts[0] + parts[1] + '0'.repeat(2 - parts[1].length))
}

export function isFloat(num) {
    return num === '' || floatRe.test(num)
}

export function isNatural(num) {
    return num === '' || naturalRe.test(num)
}

export function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


export function reducedTxToBase64(data) {
    // Create a Buffer object from the input data
    const buffer = Buffer.from(data);

    // Encode the buffer using base64url encoding
    const base64UrlEncodedString = buffer.toString('base64') .replace(/\+/g, '-') // Convert '+' to '-'
    .replace(/\//g, '_') // Convert '/' to '_'
    .replace(/=+$/, ''); // Remove ending '='
    return base64UrlEncodedString + "=".repeat(base64UrlEncodedString.length % 4 ? 4 - base64UrlEncodedString.length % 4 : 0);

    // return base64UrlEncodedString + "=".repeat(base64UrlEncodedString.length % 4 ? 4 - base64UrlEncodedString.length % 4 : 0);
}
