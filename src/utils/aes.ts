import { strToArrayBuffer, arrayBufferToBase64 } from '/@/utils/common'

const iv: ArrayBuffer = strToArrayBuffer('24dff9ew978ac1ui')

let cryptoKey: CryptoKey;

/*
Import an AES secret key from an ArrayBuffer containing the raw bytes.
Takes an ArrayBuffer string containing the bytes, and returns a Promise
that will resolve to a CryptoKey representing the secret key.
*/
export function importSecretKey(key: string) {
    const rawKey = strToArrayBuffer(key)
    window.crypto.subtle.importKey(
        "raw",
        rawKey,
        "AES-CBC",
        true,
        ["encrypt"]
    ).then((data) => {
        cryptoKey = data
    }).catch(e => {
        console.error(e)
    })
}

export async function encryptMessage(message: string) {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    return arrayBufferToBase64(await crypto.subtle.encrypt(
        {
            name: "AES-CBC",
            iv
        },
        cryptoKey,
        data
    ));
}

export async function decryptMessage(cipherText: BufferSource) {
    const result = await crypto.subtle.decrypt(
        {
            name: "AES-CBC",
            iv,
            tagLength: 256
        },
        cryptoKey,
        cipherText
    );
    const decoder = new TextDecoder();
    return decoder.decode(result);
}


