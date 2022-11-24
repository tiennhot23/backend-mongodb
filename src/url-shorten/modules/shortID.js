const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-';
const randomChars = [
  '3', '0', 'N', '-', 't', 'r', 'h', 'V', 's',
  '6', 'e', 'I', 'b', '_', 'w', '2', 'x', 'T',
  'Y', 'L', 'a', 'u', 'm', 'M', 'c', '5', 'Z',
  'z', 'D', 'k', 'v', 'W', 'X', 'o', '7', 'H',
  '4', 'F', 'd', 'q', 'G', 'O', 'n', 'C', 'f',
  'A', 'K', 'i', 'j', 'Q', 'U', 'g', '8', 'B',
  '9', 'l', 'y', 'P', 'S', 'p', '1', 'R', 'J',
  'E',
];
const charIndex = [0, 0];

/**
 * generate id base on current time and 2 random chars
 */
function generateID() {
  let ms = Number(new Date());
  let encodeStr = '';
  // encode timestamp
  while (ms >= chars.length) {
    encodeStr = chars.charAt(ms % chars.length) + encodeStr;
    ms /= chars.length;
  }

  // append string generated from randomChars
  encodeStr = getRandomStr() + encodeStr;
  randomChars.push(randomChars.shift());
  return encodeStr;
}

/**
 * get string of 2 chars: randomChar[index] x randomChar[index]
 * Ex: '33', '30', '3N', ...
 */
function getRandomStr() {
  const str = `${randomChars[charIndex[0]]}${randomChars[charIndex[1]]}`;
  plusOne(charIndex, charIndex.length - 1, randomChars.length - 1);
  // for (let i = 0; i < length; i += 1) {
  //   const idx = Math.floor(Math.random() * maxValidLength); // 0 -> maxValidLength - 1
  //   str += randomChars[idx];
  //   randomChars.push(randomChars[idx]);
  //   randomChars.splice(idx, 1);
  //   maxValidLength = maxValidLength <= 1 ? randomChars.length : maxValidLength - 1;
  // }
  return str;
}

function plusOne(arr, index, max) {
  if (index === -1) {
    return;
  }
  if (arr[index] + 1 <= max) {
    arr[index] += 1;
  } else {
    arr[index] = 0;
    plusOne(arr, index - 1, max);
  }
}

function genTimestampBase32() {
  return Number(new Date()).toString(32);
}

module.exports = { generateID, genTimestampBase32 };
