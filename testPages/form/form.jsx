/*require('es5-shim');
require('es5-shim/es5-sham');
require('console-polyfill');*/
require('es6-promise');
require('fetch-ie8');

//兼容ie8

const React = require('react');
const ReactDOM = require('react-dom');
const FormDocs = require('./index').default;

ReactDOM.render(
  <FormDocs />,
  document.getElementById('wrap')
);

