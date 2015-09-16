// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
//
// Copyright (c) 2015 Nikita Kovalev, HeadHunter

var userInfo = chrome.extension.getBackgroundPage().userInfo;
var output = document.getElementById('output');
output.innerText = userInfo;
