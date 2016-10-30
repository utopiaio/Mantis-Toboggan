import React, { Component } from 'react';

import store from '../redux/store';
import { language, theme } from '../redux/action/showtime';

class Setting extends Component {
  constructor(props) {
    const state = store.getState();

    super(props);
    this.state = {
      language: state.language,
      theme: state.theme,
    };
  }

  componentDidMount() {
    this.unsubscribe = store.subscribe(() => {
      const state = store.getState();
      this.setState({ language: state.language, theme: state.theme });
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  changeLanguage() {
    language(this.state.language === 'en' ? 'am' : 'en');
  }

  changeTheme() {
    theme(this.state.theme === 'night' ? 'light' : 'night');
  }

  render() {
    return (
      <div className="view-setting">
        <i className="icon-setting" />
        <button
          onClick={() => this.changeLanguage()}
          className={this.state.language === 'am' ? 'btn -am-' : 'btn'}
        >
          { this.state.language === 'am' ? 'ቋንቋ ቀይር' : 'Change Language' }
        </button>
        <button
          onClick={() => this.changeTheme()}
          className={this.state.language === 'am' ? 'btn -am-' : 'btn'}
        >
          { this.state.language === 'am' ? 'ቀለም ቀይር' : 'Change Theme' }
        </button>
      </div>
    );
  }
}

module.exports = Setting;
