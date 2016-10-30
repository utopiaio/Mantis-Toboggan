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
      <div>
        <span>Setting</span>
        <button onClick={() => this.changeLanguage()}>change language</button>
        <button onClick={() => this.changeTheme()}>change theme</button>
      </div>
    );
  }
}

module.exports = Setting;
