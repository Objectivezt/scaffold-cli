import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './root';

console.log('current env:', process.env.NODE_ENV);

ReactDOM.render(<App />, document.getElementById('root'));
