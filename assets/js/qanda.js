
function chartDonut (chart_id, labels, data, datalabels) {
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
        backgroundColor: ['rgb(255, 99, 132)', 'green'],
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

}



function handleSubmit (e) {
  e.preventDefault()
  $("#butnSubmit").attr("disable", true);
  $(".demo-gallery.hide, .result.hide").removeClass("hide");
  $(".score-1, .score-2, .score-3, .age-1, .age-2, .age-3").addClass("hide");

  let q01ans = parseInt($("#q01").val(), 10);
  let q02ans = $("#q02").val();

  let data = {
    type: "return",
    value: getAnonymousId(),
    q1: q01ans,
    q2: q02ans,
  }

  if (5 > q01ans) {
    $('.score-1').removeClass('hide')
  } else if (5 === q01ans) {
    $('.score-2').removeClass('hide')
  } else {
    $('.score-3').removeClass('hide')
  }

  if ("0-18" === q02ans) {
    $('.age-1').removeClass('hide')
  } else if ("60+" === q02ans) {
    $('.age-3').removeClass('hide')
  } else {
    $('.age-2').removeClass('hide')
  }

  console.log(`data prep`, data);

  fetch(G['GAPI'], {
    method: 'POST',
    body: JSON.stringify(data),
    mode: 'no-cors',
    credentials: 'include',
    redirect: 'follow',
    headers: {
        'Content-Type': 'application/json;charset=utf-8',
    }
  }).then(response => {
    console.log("success:", response);
  //   let data = [];
  //   let data = [{
  //     "name": "ts",
  //     "index": ["2020-11-24 00:51:19", "2020-11-23 00:54:39", "2020-11-23 00:51:19"],
  //     "data": [1, 1, 1]
  // }, {
  //     "name": "annoymous_id",
  //     "index": ["2b27ab63-ea97-ebe7-2a75-beb220640dc6"],
  //     "data": [3]
  // }, {
  //     "name": "q1",
  //     "index": ["26-30", "65+"],
  //     "data": [2, 1]
  // }, {
  //     "name": "q2",
  //     "index": ["A", "B", "D"],
  //     "data": [1, 1, 1]
  // }, {
  //     "name": "q3",
  //     "index": ["q1"],
  //     "data": [3]
  // }, {
  //     "name": "q4",
  //     "index": ["q1"],
  //     "data": [3]
  // }, {
  //     "name": "q5",
  //     "index": ["q1"],
  //     "data": [3]
  // }, {
  //     "name": "q6",
  //     "index": [],
  //     "data": []
  // }]

    let result = {};
    result["q1"] = data.filter(o => o.name === "q1")

    console.log(result["q1"]);


    if (result["q1"].length) {
      $("#result").show();
      chartDonut("chart01", result["q1"][0]["index"], result["q1"][0]["data"], "hihi");
    }

  })
  .catch(function (error) {
    console.log(error);
  });

  return false
}


function init_qanda () {

  // Load data and prepare charts
  // fetch JSON with timesatamp
  fetch("https://schema.org/", {
    method: 'GET',
    mode: 'no-cors',
    credentials: 'include', // include, *same-origin, omit
    redirect: 'follow',
  }).then(response => {
    let data = [{
        "name": "ts",
        "index": ["2020-11-24 00:51:19", "2020-11-23 00:54:39", "2020-11-23 00:51:19"],
        "data": [1, 1, 1]
    }, {
        "name": "annoymous_id",
        "index": ["2b27ab63-ea97-ebe7-2a75-beb220640dc6"],
        "data": [3]
    }, {
        "name": "q1",
        "index": ["26-30", "65+"],
        "data": [2, 1]
    }, {
        "name": "q2",
        "index": ["A", "B", "D"],
        "data": [1, 1, 1]
    }, {
        "name": "q3",
        "index": ["q1"],
        "data": [3]
    }, {
        "name": "q4",
        "index": ["q1"],
        "data": [3]
    }, {
        "name": "q5",
        "index": ["q1"],
        "data": [3]
    }, {
        "name": "q6",
        "index": [],
        "data": []
    }]

    let result = {}
    result["q1"] = data.filter(o => o.name === "q1")

    console.log(result["q1"]);

    if (result["q1"].length) {
      chartDonut("chart01", result["q1"][0]["index"], result["q1"][0]["data"], "hihi")
    }
  })
  .catch(function (error) {
    console.log(error);
  });


  // Handlers
  $("#butnSubmit").on("click", handleSubmit);
}

init_qanda();