$(function () {

  async function makeHeatmap(place) {
    const maxval = "2020-01-01";
    let response = await fetch(`assets/js/json/${place}.json`)
    let data = await response.json()
    let daycount = 0;
    let newdata = Object.keys(data).map(o => {
      if (maxval === o) {
        return {
          date: maxval,
          count: 150
        }
      }
      if ("" !== data[o]) {
        daycount++;
      }
      return {
        date: o,
        count: ("" === data[o]) ? 0 : parseInt(data[o], 10) * 50
      }
    });
    let options = {
      weekStartDay: 7,
      coloring: "custom",
      labels: {
        days: true,
        months: true,
        custom: {
            weekDayLabels: ["日", "一", "二", "三", "四", "五", "六"],
            monthLabels: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"]
        }
      },
      legend: {
        show: false,
      },
      tooltips: {
          show: false,
          options: {}
      }
    };

    $("#heatmap").remove()
    $("#colorButton").after('<div id="heatmap" class=""></div>')
    $("#heatmap").CalendarHeatmap( newdata, options );
    $(".affected").html(daycount);
  }

  // Function that change a color
  async function changeColor2() {
    var radioValue = $("input[name='placeButton']:checked");

    fireEvent(`${G['trackingCate']}`, 'click_place', {
      'place': radioValue.val(),
      'anonymous_id': getAnonymousId(),
      'session_id': getSessionId(),
      'ts': Date.now()
    });

    makeHeatmap(radioValue.val());
  }


  // Event listener to the radio button
  $("#colorButton").on("change", changeColor2 );
  makeHeatmap("公眾娛樂場所");
});
