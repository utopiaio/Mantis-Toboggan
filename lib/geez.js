/**
 * given a number returns the geez equivalent
 * http://www.geez.org/Numerals/
 *
 * @param  {Number | String} number
 * @return {String}
 */
module.exports = (num = 1) => {
  let asciiNumber = `${num}`;

  // step 1
  if (asciiNumber.length % 2 !== 0) {
    asciiNumber = `0${asciiNumber}`;
  }

  // step 2, 3
  const asciiNumberGrouped = asciiNumber.match(/[\d]{2}/g);

  // step 4
  const asciiNumberExpanded = asciiNumberGrouped.map(group => [group[0] === '0' ? '0' : `${Number(group[0]) * 10}`, `${group[1]}`]);

  // step 5
  const geezMap = { 0: '0', 1: '፩', 2: '፪', 3: '፫', 4: '፬', 5: '፭', 6: '፮', 7: '፯', 8: '፰', 9: '፱', 10: '፲', 20: '፳', 30: '፴', 40: '፵', 50: '፶', 60: '፷', 70: '፸', 80: '፹', 90: '፺' };
  const ethiopic = asciiNumberExpanded.map(group => [geezMap[group[0]], geezMap[group[1]]]);

  // step 6
  const ethiopicPrefixed = asciiNumberExpanded.map((group, index) => {
    const reverseIndex = asciiNumberExpanded.length - (index + 1);

    if (reverseIndex > 0) {
      return ethiopic[index].concat(reverseIndex % 2 === 1 ? '፻' : '፼').join('');
    }

    return ethiopic[index].join('');
  });

  // step 6.1 & 6.2
  return ethiopicPrefixed.join('').replace(/00፻|0/g, '').replace(/^፩(፻|፼)/, '$1');
};
