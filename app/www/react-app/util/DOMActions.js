/* global window */
/* eslint no-console: 0 */

/**
 * this file contains _functions_ that do DOM manipulations.
 * keeping our React Components _free_ of DOM hassle
 */

/**
 * shows or hides the close button
 *
 * @param  {Boolean} show
 */
function showCloseButton(show = true) {
  const closeButton = window.document.querySelector('.close-button');

  switch (show) {
    case true:
      closeButton.style.transform = 'translateY(0em)';
      closeButton.style.opacity = '1';
      return;

    case false:
      closeButton.style.opacity = '0';
      setTimeout(() => {
        closeButton.style.transform = 'translateY(-2em)';
      }, 350);
      return;

    default:
      console.warn(`Unknown type passed [${show}]`);
  }
}

module.exports = {
  showCloseButton,
};
