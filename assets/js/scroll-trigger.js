$(function () {
  var main = $("main");
  var scrolly = $("#scrolly");
  var figure = $("#scrolly figure");
  var article = $("#scrolly article");
  var step = $("#scrolly .step");

  // initialize the scrollama
  var scroller = scrollama();

  // generic window resize listener event
  function handleResize() {
    var stepH = Math.floor(window.innerHeight * 0.75);
    step.css("margin-bottom", stepH + "px");

    var figureHeight = window.innerHeight / 2;
    var figureMarginTop = (window.innerHeight - figureHeight) / 2;
    figureMarginTop = 75;

    figure
      .css("height", figureHeight + "px")
      .css("top", figureMarginTop + "px");

    scroller.resize();
  }

  // scrollama event handlers
  function handleStepEnter(response) {
    // update graphic based on step
    $("#scrolly figure .iframe_cont").addClass("hide-height");
    $("#scrolly figure .iframe_cont").eq(response.index).removeClass("hide-height");
  }

  function setupStickyfill() {
    $("#scrolly .sticky").each(function() {
      Stickyfill.add(this);
    });
  }

  function init() {
    setupStickyfill();

    handleResize();

    scroller
      .setup({
        step: "#scrolly article .step",
        offset: 0.75,
        debug: false
      })
      .onStepEnter(handleStepEnter);

    // setup resize event
    window.addEventListener("resize", handleResize);
  }

  // kick things off
  init();

});
