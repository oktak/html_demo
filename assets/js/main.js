var G = {}
G['entrySource'] = ''
G['trackingCate'] = 'hk01review2020'
G['GAPI'] = "https://script.google.com/macros/s/AKfycbx2UQSIMuHI56nSyKeMgUgUnwARxbj8ZUUV_ojyVruIrgxcSXgL/exec"

/**
 * hk01 Tracking::detectSource
 * @param {*} callback 
 */
function detectSource (callback) {
  let linkText = window.location.href;
  console.log(linkText);
  entrySource = (linkText.match(/#/)) ? linkText.match(/#(.*?)(&|$|\?)/)[1] : 'organic';
  initialID = (linkText.match(/&id=/)) ? parseInt(linkText.match(/&id=(\d+)/)[1]) : 0;
  G['entrySource'] = entrySource;

  switch (entrySource) {
      case 'article':
      case 'base':
      case 'issue':
          break;
      default:
          entrySource = 'organic';
          fireArticlePV(removehash(window.location.href));
  }

  console.log(entrySource + ' | initialID: ' + initialID);

  fireEvent(`${G['trackingCate']}_landing`, 'view', {
      'start_mode': entrySource,
      'anonymous_id': getAnonymousId(),
      'session_id': getSessionId(),
      'ts': Date.now()
  });

  fireMapPV(removehash(window.location.href));

  callback(initialID);
}


function init() {
  // reg
  let data = {
    type: "annoymous",
    value: getAnonymousId(),
    url: "http://testme.com:5500/app2/index.html"
  }
  fetch(G['GAPI'], {
    method: 'POST',
    body: JSON.stringify(data),
    mode: 'no-cors',
    credentials: 'include', // include, *same-origin, omit
    redirect: 'follow',
    headers: {
        'Content-Type': 'application/json;charset=utf-8',
    }
  }).then(response => {
    console.log("success:", response);
  })
  .catch(function (error) {
    console.log(error);
  });

  // lazyload
  var lazyLoadInstance = new LazyLoad({});
  lazyLoadInstance.update();

  const scroller = scrollama();
  scroller
    .setup({
      step: ".step",
    })
    .onStepEnter((response) => {
      console.log(`load flourish js!!`, response, response.element.getAttribute('data-step'));

      let embedtype = response.element.getAttribute('data-step');

      if (-1 === embedtype.indexOf("infogram")) {
        !function (e, i, n, s) {
          var t = "flourishEmbeds";
          var d = e.getElementsByTagName("script")[0];
          var o = e.createElement("script");
          o.async = 0, o.id = n, o.src = "https://public.flourish.studio/resources/embed.js", d.parentNode.insertBefore(o, d)
          console.log(`FF`)
        } (document, 0, "flourish-async");
      } else {
        !function (e, i, n, s) {
          var t = "InfogramEmbeds";
          var d = e.getElementsByTagName("script")[0];
          if (window[t] && window[t].initialized) window[t].process && window[t].process();
          else
          if (!e.getElementById(n)) {
              var o = e.createElement("script");
              o.async = 0, o.id = n, o.src = "https://e.infogram.com/js/dist/embed-loader-min.js", d.parentNode.insertBefore(o, d)
          }
        } (document, 0, "infogram-async");
      }
    })
    .onStepExit((response) => {
    });

  // setup resize event
  window.addEventListener("resize", scroller.resize);
}

// kick things off
detectSource(init);

