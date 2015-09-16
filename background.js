/**
 *
 * Proof of concept dirty prototype.
 *
 * DO NOT USE IN PRODUCTION!
 */

var params = {
  'authorize_url' : 'https://hh.ru/oauth/authorize',
  'get_token_url' : 'https://hh.ru/oauth/token',
  // register your app on https://dev.hh.ru/
  'client_id' : '',
  'client_secret' : ''
};

var oauthProvider = new oAuth(params);
var userInfo = null;

function onUserInfoFetched(text) {
  userInfo = text;
  chrome.tabs.create({ 'url' : 'user-info.html'});
};

function getUserInfo() {
  oauthProvider.auth(function(token) {
    // do some authorized request
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(event, text) {
      if (xhr.readyState === 4 && xhr.status === 200) {
        onUserInfoFetched(xhr.responseText);
      }
    };
    xhr.open('GET', 'https://api.hh.ru/me', true);
    xhr.setRequestHeader('Authorization', 'Bearer '+ token);
    xhr.send();
  });
};


// dirty prototype of oauth provider
function oAuth(params) {
  this.token = null;
  this.params = params;
  this.lastCallback = null;
  this.lastTokenInfo = null;
  this.lastRedirectUri = null;
  this.lastTabId = null;
};

oAuth.prototype.auth = function(callback) {
  if (this.token) {
    callback(this.token);
  } else {
    this.lastCallback = callback;
    this.lastRedirectUri = chrome.extension.getURL('oauth-callback.html');
    chrome.tabs.create(
        {
          url: 'https://hh.ru/oauth/authorize' +
                '?response_type=code' +
                '&client_id=' + encodeURI(this.params.client_id) +
                '&redirect_uri=' + encodeURI(this.lastRedirectUri)
        },
        function(tab) {
          this.lastTabId = tab.id;
        }.bind(this)
    );
  }
};

oAuth.prototype.getToken = function(authorizationCode) {
  if (this.lastTabId !== null) {
    chrome.tabs.remove(this.lastTabId);
    this.lastTabId = null;
  }
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      this.lastTokenInfo = JSON.parse(xhr.responseText);
      this.token = this.lastTokenInfo['access_token'];
      if (this.lastCallback !== null) {
        this.lastCallback(this.token);
        this.lastCallback = null;
      }
    }
  }.bind(this);
  var params = 'grant_type=authorization_code' +
              '&client_id=' + encodeURI(this.params.client_id) +
              '&client_secret=' + encodeURI(this.params.client_secret) +
              '&code=' + encodeURI(authorizationCode);
  if (this.lastRedirectUri !== null) {
    params += '&redirect_uri=' + this.lastRedirectUri;
  }
  
  xhr.open('POST', 'https://hh.ru/oauth/token', true);
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.send(params);
};

chrome.browserAction.onClicked.addListener(getUserInfo);
