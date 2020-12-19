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
    // 1. update height of step elements
    var stepH = Math.floor(window.innerHeight * 0.75);
    step.css("margin-bottom", stepH + "px");

    var figureHeight = window.innerHeight / 2;
    var figureMarginTop = (window.innerHeight - figureHeight) / 2;
    figureMarginTop = 75;

    figure
      .css("height", figureHeight + "px")
      .css("top", figureMarginTop + "px");

    // 3. tell scrollama to update new element dimensions
    scroller.resize();
  }

  // scrollama event handlers
  function handleStepEnter(response) {
    console.log(response);
    // response = { element, direction, index }

    // add color to current step only
    // step.classed("is-active", function(d, i) {
    //   return i === response.index;
    // });

    // update graphic based on step
    $("#scrolly figure p").text(response.index + 1);

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

    // 1. force a resize on load to ensure proper dimensions are sent to scrollama
    handleResize();

    // 2. setup the scroller passing options
    // 		this will also initialize trigger observations
    // 3. bind scrollama event handlers (this can be chained like below)
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
