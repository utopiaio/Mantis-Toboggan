/**
 * given asciiNumberString return ethio string
 *
 * TODO:
 * - write tessts
 * - pass ESLint
 */
module.exports = (asciiNumberString = '') => {
  const ETHIOPIC_ONE = 0x1369;
  const ETHIOPIC_TEN = 0x1372;
  const ETHIOPIC_HUNDRED = 0x137B;
  const ETHIOPIC_TEN_THOUSAND = 0x137C;

  let n = asciiNumberString.length - 1;

  if ((n % 2) === 0) {
    asciiNumberString = `0${asciiNumberString}`;
    n++;
  }

  const asciiNumber = asciiNumberString.split('');

  let ethioNumberString = '';
  let asciiOne;
  let asciiTen;
  let ethioOne;
  let ethioTen;

  for (let place = n; place >= 0; place--) {
    asciiOne = asciiTen = ethioOne = ethioTen = '';

    asciiTen = asciiNumber[n - place];
    place--;
    asciiOne = asciiNumber[n - place];

    if (asciiOne !== '0') {
      ethioOne = String.fromCodePoint(Number(asciiOne) + (ETHIOPIC_ONE - 1));
    }

    if (asciiTen !== '0') {
      ethioTen = String.fromCodePoint(Number(asciiTen) + (ETHIOPIC_TEN - 1));
    }

    const pos = (place % 4) / 2;

    const sep = (place !== 0) ? (pos !== 0)
                 ? ((ethioOne !== '') || (ethioTen !== ''))
                    ? String.fromCodePoint(ETHIOPIC_HUNDRED)
                    : ''
                 : String.fromCodePoint(ETHIOPIC_TEN_THOUSAND)
              : ''
            ;

    if ((ethioOne === String.fromCodePoint(ETHIOPIC_ONE)) && (ethioTen === '') && (n > 1)) {
      if ((sep === String.fromCodePoint(ETHIOPIC_HUNDRED)) || ((place + 1) === n)) {
        ethioOne = '';
      }
    }

    if (ethioTen !== '') {
      ethioNumberString += ethioTen;
    }

    if (ethioOne !== '') {
      ethioNumberString += ethioOne;
    }

    if (sep !== '') {
      ethioNumberString += sep;
    }
  }

  return ethioNumberString;
};
