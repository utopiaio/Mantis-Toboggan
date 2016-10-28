
import React, { PropTypes } from 'react';

function Spinner({ loading, refresh }) {
  return (
    <button onClick={refresh} className={loading ? 'spinner active' : 'spinner'}>
      <div className="double-bounce1" />
      <div className="double-bounce2" />
    </button>
  );
}

Spinner.propTypes = {
  loading: PropTypes.bool,
  refresh: PropTypes.func.isRequired,
};

Spinner.defaultProps = {
  loading: false,
};

module.exports = Spinner;
