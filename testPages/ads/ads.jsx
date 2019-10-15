/*require('es5-shim');
require('es5-shim/es5-sham');
require('console-polyfill');*/
require('es6-promise');
require('fetch-ie8');

//兼容ie8
window.Token="";
window.iosToken = function(data){
    window.Token =  data;
    ReactDOM.render(
      <AddView />,
      document.getElementById('wrap')
    );
}
if (window.webkit) {
    window.webkit.messageHandlers.ios_askToken.postMessage('token');
    if (Token.length > 10) {
    } else {
        window.webkit.messageHandlers.ios_askLogin.postMessage('token');
    }
}


if (window.android) {
    Token = window.android.getToken();

    if (Token != undefined) {

    } else {
       window.android.login();
    }
}
const React = require('react');
const ReactDOM = require('react-dom');
const AddView = require('./index').default;


if(!window.webkit){
	ReactDOM.render(
	  <AddView />,
	  document.getElementById('wrap')
	);
}




