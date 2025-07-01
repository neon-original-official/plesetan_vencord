export const MAGIC_PREFIX = "0xF5A:";

const mapAZ = {
  a: "@", b: "8", c: "(", d: "|)", e: "3", f: "#", g: "9",
  h: "#", i: "1", j: "_|", k: "|<", l: "|", m: "^^", n: "/\\/",
  o: "0", p: "|o", q: "(,)", r: "|2", s: "$", t: "7", u: "|_|",
  v: "\\/", w: "\\/\\/", x: "><", y: "`/", z: "2"
};

const emojiAZ = {};
for (let i = 0; i < 26; i++) {
  const char = String.fromCharCode(65 + i); // A-Z
  emojiAZ[char] = String.fromCharCode(0xE000 + i); // U+E000-U+E019
}

const numberMap = {
  "0": "\uE100", "1": "\uE101", "2": "\uE102", "3": "\uE103", "4": "\uE104",
  "5": "\uE105", "6": "\uE106", "7": "\uE107", "8": "\uE108", "9": "\uE109"
};

const reverseMapAZ = Object.fromEntries(Object.entries(mapAZ).map(([k, v]) => [v, k]));
const reverseEmojiAZ = {};
for (let i = 0; i < 26; i++) {
  reverseEmojiAZ[String.fromCharCode(0xE000 + i)] = String.fromCharCode(97 + i);
}
const reverseNumberMap = Object.fromEntries(Object.entries(numberMap).map(([k, v]) => [v, k]));

export function encodeMessage(text) {
  let result = "";
  for (let char of text) {
    if (char >= 'a' && char <= 'z') result += mapAZ[char] || char;
    else if (char >= 'A' && char <= 'Z') result += emojiAZ[char] || char;
    else if (char >= '0' && char <= '9') result += numberMap[char];
    else result += char;
  }
  return result;
}

export function decodeMessage(text) {
  for (let key in reverseEmojiAZ)
    text = text.split(key).join(reverseEmojiAZ[key]);

  const sortedKeys = Object.keys(reverseMapAZ).sort((a, b) => b.length - a.length);
  for (let key of sortedKeys)
    text = text.split(key).join(reverseMapAZ[key]);

  for (let key in reverseNumberMap)
    text = text.split(key).join(reverseNumberMap[key]);

  return text;
}
