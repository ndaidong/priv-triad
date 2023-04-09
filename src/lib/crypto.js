// crypto.js

const ALGORITHM = {
  name: 'AES-GCM',
  length: 256,
}

const KEY_FORMAT = 'raw'
const KEY_EXTRACTABLE = true
const KEY_USAGES = [
  'encrypt',
  'decrypt',
]

const DEFAULT_CRYPTO_SALT = 'bWDj59z2D8pZ7jsr'

const toHex = (buffer) => {
  return [...new Uint8Array(buffer)]
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

const toBuffer = (hex) => {
  const int8s = hex.match(/[\da-f]{2}/gi).map(h => parseInt(h, 16))
  const tarr = new Uint8Array(int8s)
  return tarr.buffer
}

const hash = async (message, salt, algorithm) => {
  const enc = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(salt),
    algorithm,
    false,
    ['sign', 'verify']
  )

  const signature = await crypto.subtle.sign(
    algorithm.name,
    key,
    enc.encode(message)
  )

  const hashArray = Array.from(new Uint8Array(signature))
  return toHex(hashArray)
}

export const sha256 = async (message, salt = DEFAULT_CRYPTO_SALT) => {
  const encoded = await hash(message, salt, { name: 'HMAC', hash: 'SHA-256' })
  return encoded // 64 hex chars
}

export const passiv = async (password, salt = DEFAULT_CRYPTO_SALT) => {
  const hex = await sha256(password, salt)
  const ivp = hex.match(/.{1,4}/g).map(hexchar => parseInt(hexchar, 16))
  return new Uint16Array(ivp)
}

export const encrypt = async (message, password, salt = DEFAULT_CRYPTO_SALT) => {
  const encoded = (new TextEncoder()).encode(message)
  const key = await crypto.subtle.generateKey(ALGORITHM, KEY_EXTRACTABLE, KEY_USAGES)
  const iv = await passiv(password, salt)
  const ciphertext = await crypto.subtle.encrypt(
    {
      name: ALGORITHM.name,
      iv,
    },
    key,
    encoded
  )
  const exportedKey = await crypto.subtle.exportKey(KEY_FORMAT, key)
  return `${toHex(ciphertext)}${toHex(exportedKey)}`
}

export const decrypt = async (encoded, password, salt = DEFAULT_CRYPTO_SALT) => {
  const n = encoded.length - 64
  const hexkey = encoded.substring(n)
  const encryptedText = encoded.substring(0, n)
  const iv = await passiv(password, salt)
  const key = await crypto.subtle.importKey(KEY_FORMAT, toBuffer(hexkey), ALGORITHM, true, KEY_USAGES)
  const decrypted = await crypto.subtle.decrypt(
    {
      name: ALGORITHM.name,
      iv,
    },
    key,
    toBuffer(encryptedText)
  )
  return (new TextDecoder()).decode(decrypted)
}

export const genid = (len = 32, prefix = '') => {
  let s = prefix
  const nums = crypto.getRandomValues(new Uint32Array(len))
  for (let i = 0; i < nums.length; i++) {
    const n = nums[i].toString(36)
    const r = Math.random()
    const c = n.charAt(Math.floor(r * n.length))
    s += (r > 0.3 && r < 0.7) ? c.toUpperCase() : c
  }
  return s.substring(0, len)
}
