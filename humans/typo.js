/**
 * This object export is used to fix title typos from Ethio-Yellow pages
 * so Lethal Weapon 5 can do its thing
 *
 * Structure:
 * { [Typo Movie]: "Correct Movie Title" }
 */

const typos = {
  'Guardians of the Galaxy2': 'Guardians of the Galaxy Vol. 2',
  'Guardians of the Galaxy 2': 'Guardians of the Galaxy Vol. 2',
  'King Arthur: The Legend of the Sword': 'King Arthur: Legend of the Sword',
};

module.exports = (title) => {
  const keys = Object.keys(typos); // DJ Khaled
  const smallKeys = keys.map(key => key.toLowerCase());
  const movieIndex = smallKeys.indexOf(title.toLowerCase());

  if (movieIndex === -1) {
    return title;
  }

  return typos[keys[movieIndex]];
};
