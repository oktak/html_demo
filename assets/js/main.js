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





// using d3 for convenience
  var main = d3.select("main");
  var scrolly = main.select("#scrolly");
  var figure = scrolly.select("figure");
  var article = scrolly.select("article");
  var step = article.selectAll(".step");

  // initialize the scrollama
  var scroller = scrollama();

  // generic window resize listener event
  function handleResize() {
    // 1. update height of step elements
    var stepH = Math.floor(window.innerHeight * 0.75);
    step.style("height", stepH + "px");

    var figureHeight = window.innerHeight * 0.8;
    var figureMarginTop = (window.innerHeight - figureHeight) / 2;

    figure
      .style("height", figureHeight + "px")
      .style("top", figureMarginTop + "px");

    // 3. tell scrollama to update new element dimensions
    scroller.resize();
  }

  // scrollama event handlers
  function handleStepEnter(response) {
    console.log(response);
    // response = { element, direction, index }

    // add color to current step only
    step.classed("is-active", function(d, i) {
      return i === response.index;
    });

    // update graphic based on step
    figure.select("p").text(response.index + 1);

    // updade graph
    figure.selectAll("div.graph").each(function(d, i) {
      console.log(this,i)
      if (i === response.index) {
        this.classList.remove("hide")
        this.classList.add("show")
      } else {
        this.classList.remove("show")
        this.classList.add("hide")
      }
    });
  }

  function setupStickyfill() {
    d3.selectAll(".sticky").each(function() {
      Stickyfill.add(this);
    });
  }

  function handleSubmit (e) {
    e.preventDefault()

    let data = {
      type: "return",
      value: getAnonymousId(),
      q1: $('#q01').val(),
      q2: $('input[name="q02"]:checked').val(),
      q3: "q1",
      q4: "q1",
      q5: "q1",
    }

    console.log(data);


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

    return false
  }

  function init() {
    /**
     * Scrollma 
     *
    setupStickyfill();

    // 1. force a resize on load to ensure proper dimensions are sent to scrollama
    handleResize();

    // 2. setup the scroller passing options
    // 		this will also initialize trigger observations
    // 3. bind scrollama event handlers (this can be chained like below)
    scroller
      .setup({
        step: "#scrolly article .step",
        offset: 0.33,
        debug: true
      })
      .onStepEnter(handleStepEnter);

    // setup resize event
    window.addEventListener("resize", handleResize);
    */

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

    $("#butnSubmit").on("click", handleSubmit);
  }

  // kick things off
  detectSource(init);