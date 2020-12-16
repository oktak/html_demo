
function chartBar (chart_id, labels, data, datalabels) {
  var el = document.getElementById(chart_id);
  if (!el) {
    return;
  }
  var ctx = el.getContext('2d');

  var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'bar',

    // The data for our dataset
    data: {
      labels: labels || ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
      datasets: [{
        label: datalabels || 'My First dataset',
        backgroundColor: ["rgba(255, 99, 132, 0.2)","rgba(255, 159, 64, 0.2)","rgba(255, 205, 86, 0.2)","rgba(75, 192, 192, 0.2)","rgba(54, 162, 235, 0.2)","rgba(153, 102, 255, 0.2)","rgba(201, 203, 207, 0.2)"],"borderColor":["rgb(255, 99, 132)","rgb(255, 159, 64)","rgb(255, 205, 86)","rgb(75, 192, 192)","rgb(54, 162, 235)","rgb(153, 102, 255)","rgb(201, 203, 207)"],
        // borderColor: 'rgb(255, 99, 132)',
        data: data || [0, 10, 5, 2, 20, 30, 45]
      }]
    },

    // Configuration options go here
    options: {
      responsive: true,
      maintainAspectRatio: true,
    }
  });
}

/**
 * result
 * @param {*} callback 
 */
function displayResult () {
  fetch(G['AAPI'])
  .then(response => {
    return response.json()
  })
  .then(data => {
    console.log(data)
    if (data.data.length) {
      $("#result").show();
      chartBar("chart01", [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], data.data, "心情指數");
    }
  })
  .catch(function (error) {
    console.log(error);
  });

  !function (e, i, n, s) {
    var t = "flourishEmbeds";
    var d = e.getElementsByTagName("script")[0];
    var o = e.createElement("script");
    o.async = 0, o.id = n, o.src = "https://public.flourish.studio/resources/embed.js", d.parentNode.insertBefore(o, d)
  } (document, 0, "flourish-async-age");
}

function handleSubmit (e) {
  e.preventDefault();

  let q01ans = parseInt($("#q01").val(), 10);
  let q02ans = $("#q02").val();

  // Validation
  let isValid = true;
  console.log(`ans`, q01ans, q02ans)
  if (-1 === q01ans) {
    $('[for="q01"] .warning').removeClass("hide");
    isValid = false;
  }
  if ("-1" === q02ans) {
    $('[for="q02"] .warning').removeClass("hide");
    isValid = false;
  }
  if ($("#butnSubmit").attr("disabled")) {
    isValid = false;
  }

  if (!isValid) {
    return false;
  }

  $("#butnSubmit").attr("disabled", true).attr("aria-disabled", true).addClass("btn-secondary");
  $(".demo-gallery.hide, .result.hide, #qresult.hide").removeClass("hide");
  $(".score-1, .score-2, .score-3").addClass("hide");
  $(".age-1, .age-2, .age-3").addClass("hide-height");

  let data = {
    type: "return",
    value: getAnonymousId(),
    q1: q01ans,
    q2: q02ans,
  }

  fireEvent(`${G['trackingCate']}`, 'submit_form', {
    'data': JSON.stringify({
      q1: q01ans,
      q2: q02ans
    }),
    'anonymous_id': getAnonymousId(),
    'session_id': getSessionId(),
    'ts': Date.now()
  });

  if (5 > q01ans) {
    $('.score-1').removeClass('hide')
  } else if (5 === q01ans) {
    $('.score-2').removeClass('hide')
  } else {
    $('.score-3').removeClass('hide')
  }

  if ("0-18" === q02ans) {
    $('.age-1').removeClass('hide-height')
  } else if ("60+" === q02ans) {
    $('.age-3').removeClass('hide-height')
  } else {
    $('.age-2').removeClass('hide-height')
  }

  console.log(`data prep`, data);

  fetch(G['GAPI'], {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
        'Content-Type': 'application/json;charset=utf-8',
    }
  })
  .then(response => {
    // Load data and prepare charts
    displayResult();
  })
  .catch(function (error) {
    console.log(error);
  });

  return false
}

function handleChange (e) {
  $('.warning:not(.hide)').addClass("hide");
}

function init_qanda () {
  // Handlers
  $("#butnSubmit").on("click", handleSubmit);
  $("select").on("change", handleChange);
}

init_qanda();