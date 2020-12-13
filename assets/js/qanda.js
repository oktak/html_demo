
function chartDonut (chart_id, labels, data, datalabels) {
  var el = document.getElementById(chart_id);
  if (!el) {
    return;
  }
  var ctx = el.getContext('2d');

  var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'doughnut',

    // The data for our dataset
    data: {
      labels: labels || ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
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
    result["q2"] = data.filter(o => o.name === "q2")
    result["q3"] = data.filter(o => o.name === "q3")
    result["q4"] = data.filter(o => o.name === "q4")
    result["q5"] = data.filter(o => o.name === "q5")

    console.log(result["q1"]);

    if (result["q1"].length) {
      chartDonut("chart01", result["q1"][0]["index"], result["q1"][0]["data"], "hihi")
    }
    if (result["q2"].length) {
      chartDonut("chart02", result["q2"][0]["index"], result["q2"][0]["data"], "hihi")
    }
    if (result["q3"].length) {
      chartDonut("chart03", result["q3"][0]["index"], result["q3"][0]["data"], "hihi")
    }
  })
  .catch(function (error) {
    console.log(error);
  });


  // Handlers
  $("#butnSubmit").on("click", handleSubmit);
}

init_qanda();