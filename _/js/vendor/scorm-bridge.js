(function () {
  'use strict';

  var isInIframe = (window.self !== window.top);

  function getShortPageKey() {
    var path = window.location.pathname;
    var match = path.match(/\/rhoai35-auto-series\/1\/(.+?)(?:\.html)?$/);
    if (match) return match[1];
    var lastPart = path.split('/').filter(Boolean).pop();
    return lastPart ? lastPart.replace(/\.html$/, '') : 'index';
  }

  function sendToParent(data) {
    if (!isInIframe) return;
    try { window.parent.postMessage(data, '*'); } catch (e) {}
  }

  document.addEventListener('DOMContentLoaded', function () {
    sendToParent({
      action: 'page_viewed',
      url: window.location.pathname
    });
  });

  window.addEventListener('message', function (event) {
    if (!event.data || !event.data.action) return;

    if (event.data.action === 'quiz_score') {
      sendToParent(event.data);
    }
  });
})();
