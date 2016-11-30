import React, { PropTypes } from 'react';

import i18n from '../config/i18n';
import amClass from '../util/amClass';
import containsFidel from '../util/containsFidel';

/**
 * To have proper stacking context, some components will live _outside_, not inside <Movie />
 *
 * Reasons:
 * - To have proper stacking context for our z-index
 * - The DOM is heavily animated, once entered there will be very little updates on the view.
 *   So going _static_ will actually be _faster_ (chasing that sweet 60fps).
 */

function Movie411({ language, movie, open, back }) {
  return (
    <div className="movie-411">
      <div className="info-container">
        <h2 className={`light-font-weight movie-title ${containsFidel(movie && movie.title) ? '_am_' : ''}`}>{movie && movie.title}</h2>
        <p className="movie-showtime _am_">{movie && movie.time}</p>
        <p className="movie-description">
          { movie && movie.omdb && movie.omdb.Plot }
        </p>
        {
          (movie && movie.omdb) ? <h3 className={`movie-information ${amClass(language)}`}>
            <table>
              <caption>{i18n[language].INFORMATION}</caption>
              <tbody>
                <tr>
                  <td>Rated</td>
                  <td>{ movie.omdb.Rated }</td>
                </tr>

                <tr>
                  <td>Released</td>
                  <td>{ movie.omdb.Released }</td>
                </tr>

                <tr>
                  <td>Genre</td>
                  <td>{ movie.omdb.Genre }</td>
                </tr>

                <tr>
                  <td>Director</td>
                  <td>{ movie.omdb.Director }</td>
                </tr>

                <tr>
                  <td>Cast</td>
                  <td>{ movie.omdb.Actors }</td>
                </tr>

                <tr>
                  <td>Run Time</td>
                  <td>{ movie.omdb.Runtime }</td>
                </tr>

                <tr>
                  <td>Website</td>
                  <td
                    className={`${movie.omdb.Website === 'N/A' ? '' : 'movie-website'}`}
                    onClick={() => open(movie.omdb.Website)}
                  >
                    <span>{ movie.omdb.Website.substring(0, 24) }</span>
                    { movie.omdb.Website.length > 24 ? <span>...</span> : <span /> }
                  </td>
                </tr>
              </tbody>
            </table>
          </h3> : <span />
        }
        {
          (movie && movie.video) ? <div>
            <div className={`video-label ${amClass(language)}`}>
              {i18n[language].VIDEO}
            </div>

            <div className="video-container">
              <iframe src={movie.video} frameBorder="0" allowFullScreen />
            </div>
          </div> : <span />
        }
        <button
          style={{ margin: '1em 0% 1em 10%', width: '80%', padding: '.75em', minWidth: '12em' }}
          className={`btn ${amClass(language)}`}
          onClick={back}
        >{i18n[language].CLOSE}</button>
      </div>
    </div>
  );
}

Movie411.propTypes = {
  language: PropTypes.string.isRequired,
  // eslint-disable-next-line
  movie: PropTypes.object,
  open: PropTypes.func.isRequired,
  back: PropTypes.func.isRequired,
};

module.exports = Movie411;
