import JSEncrypt from "jsencrypt";

/**
 * 生成rsa密钥对
 * @returns rsa密钥对
 */
async function generateKeyPair() {
    return await crypto.subtle.generateKey(
        {
            name: "RSA-OAEP",
            modulusLength: 1024, //密钥长度，可以是1024, 2048, 4096，建议2048以上
            publicExponent: new Uint8Array([0x01, 0x00, 0x01]), // 公共指数e，一般用65537
            hash: "SHA-256", //可以是"SHA-1", "SHA-256", "SHA-384", "SHA-512"
        },
        true,
        ["encrypt", "decrypt"]
    );
}

export const keyPair: CryptoKeyPair = await generateKeyPair();

function rsa2text(buffer: ArrayBuffer) {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    var base64 = window.btoa(binary);
    return base64.replace(/[^\x00-\xff]/g, "$&\x01").replace(/.{64}\x01?/g, "$&\n");
}

export function translateArrayBufferToBase64(buffer: ArrayBuffer) {
    let binaryStr = "";
    const bytes = new Uint8Array(buffer);
    for (let i = 0, len = bytes.byteLength; i < len; i++) {
        binaryStr += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binaryStr);
}

//base64转ArrayBuffer
export function translateBase64ToArrayBuffer(base64: string) {
    const binaryStr = window.atob(base64);
    const byteLength = binaryStr.length;
    const bytes = new Uint8Array(byteLength);
    for (let i = 0; i < byteLength; i++) {
        bytes[i] = binaryStr.charCodeAt(i);
    }
    return bytes.buffer;
}

export const publicKey = rsa2text(await crypto.subtle.exportKey(
    "spki",
    keyPair.publicKey!
))

const encrypt = new JSEncrypt();
encrypt.setPrivateKey(rsa2text(await crypto.subtle.exportKey(
    "pkcs8",
    keyPair.privateKey!
)))

/**
 * 解密
 * @param cipherText 需要解密的数据
 * @returns 明文
 */
export function decrypt(cipherText: string) {
    return encrypt.decrypt(cipherText)
}


