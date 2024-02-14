import JSONBigInt from "json-bigint"
export const JSON = JSONBigInt({useNativeBigInt: true})

export async function post(url, body = {}, apiKey = '') {
    return await fetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            api_key: apiKey,
        },
        body: JSON.stringify(body),
    });
}
export async function get(url, apiKey = '') {
    const responmse =  await fetch(url, {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            api_key: apiKey,
        },
    });
    const jsbi = JSON.parse(await responmse.text());
    return jsbi;
}
