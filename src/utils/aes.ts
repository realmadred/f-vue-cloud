import { Session } from '/@/utils/storage'
import { strToArrayBuffer, arrayBufferToBase64 } from '/@/utils/common'
import { SESSION_AES } from '/@/api/constant'

const iv: ArrayBuffer = strToArrayBuffer('24dff9ew978ac1ui')

/**
 * 获取加密key
 * @param key key字符
 * @return Promise<CryptoKey>
 */
export function getCryptoKey(key: string): Promise<CryptoKey> {
    const rawKey = strToArrayBuffer(key)
    return window.crypto.subtle.importKey(
        "raw",
        rawKey,
        "AES-CBC",
        true,
        ["encrypt"]
    )
}

/**
 * 加密
 * @param message 待加密内容
 * @returns 密文
 */
export async function encrypt(message: string) {
    return await encryptByKey(message, Session.get(SESSION_AES))
}

/**
 * 加密
 * @param message 待加密内容
 * @param key key
 * @returns 密文
 */
export async function encryptByKey(message: string, key: string) {
    const cryptoKey: CryptoKey = await getCryptoKey(key);
    return await encryptMessage(message, cryptoKey)
}

/**
 * 解密
 * @param cipherText 密文
 * @param key key
 * @returns 明文
 */
export async function decryptByKey(cipherText: BufferSource, key: string) {
    const cryptoKey: CryptoKey = await getCryptoKey(key);
    return await decryptMessage(cipherText, cryptoKey)
}

export async function encryptMessage(message: string, cryptoKey: CryptoKey) {
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

export async function decryptMessage(cipherText: BufferSource, cryptoKey: CryptoKey) {
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


