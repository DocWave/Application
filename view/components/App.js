import React, {Component} from 'react';
import {render} from 'react-dom';

export default class App extends Component {
  render() {
    return (
      <div id='App'>
        App
      </div>
    )
  }
}

render(<App />, document.getElementById('main-container'));
