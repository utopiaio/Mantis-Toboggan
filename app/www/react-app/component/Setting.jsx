/* global window */

import React, { Component } from 'react';

import store from '../redux/store';
import i18n from '../config/i18n';
import { language, theme } from '../redux/action/showtime';
import amClass from './../util/amClass';

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

  open(url) {
    if (window.cordova && window.cordova.InAppBrowser) {
      window.cordova.InAppBrowser.open(encodeURI(url), '_system');
    }
  }

  render() {
    return (
      <div className="view-setting">
        <i className="icon-setting" />
        <button
          onClick={() => this.changeLanguage()}
          className={`btn ${amClass(this.state.language)}`}
        >
          { i18n[this.state.language].CHANGE_LANGUAGE }
        </button>
        <button
          onClick={() => this.changeTheme()}
          className={`btn ${amClass(this.state.language)}`}
        >
          { i18n[this.state.language].CHANGE_THEME }
        </button>
        <button
          onClick={() => this.open('mailto:moe.heroku@gmail.com?subject=Feedback')}
          className={`btn btn-sm ${amClass(this.state.language)}`}
          style={{ marginTop: '2em' }}
        >
          { i18n[this.state.language].CONTACT }
        </button>
        <button
          onClick={() => this.open('https://github.com/moe-szyslak/showtime')}
          className={`btn btn-sm ${amClass(this.state.language)}`}
        >
          { i18n[this.state.language].SHOW_ME }
        </button>
      </div>
    );
  }
}

module.exports = Setting;
