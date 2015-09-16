// Copyright (c) 2015 Nikita Kovalev, HeadHunter

var oauthProvider = chrome.extension.getBackgroundPage().oauthProvider;

// copy-paste from http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
var qs = (function(a) {
    if (a == "") return {};
    var b = {};
    for (var i = 0; i < a.length; ++i)
    {
        var p=a[i].split('=', 2);
        if (p.length == 1)
            b[p[0]] = "";
        else
            b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
    }
    return b;
})(window.location.search.substr(1).split('&'));


oauthProvider.getToken(qs['code']);  // only the happy way. in the real extension you also need to handler errors!
