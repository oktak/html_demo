const cellSize = Math.min((document.documentElement.clientWidth - 40)/ 8, 40)
const marginSize = 2
const labelSize = 60
const labelHeight = cellSize
const axisHeight = cellSize / 2
const labelPadding = 5
const rectRadius = 3
const monthNameHeight = 40
const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
let thresold = 0;

const statLabelSize = 100
const statCellWidth = Math.min((document.documentElement.clientWidth - statLabelSize * 2)/ 2, 200)
const statCellHeight = statCellWidth / 3

const dateParse = d3.timeParse('%Y-%m-%d')

const dateFormat = d3.timeFormat('%Y-%m-%d')
const weekDayFormat = d3.timeFormat('%w');
const weekFormat = d3.timeFormat('%U');

const forecastInterpolate = d3.interpolateRgb('#82E6FF', '#05337C');
const forecastWordMap = d3.scalePoint().domain(['', '1', '2']).range([0, 1]);
const statisticsInterpolate = d3.interpolateRgb('#C4DED2', '#3D9970');

const tooltip = d3.select('#tooltip');

(async function() {
  const actuals = await d3.json('assets/js/actuals-transform.json')
  const forecasts = await d3.json('assets/js/forecasts-transform.json')

  // const minDate = d3.min(forecasts.map(a => dateParse(a.date)))
  // const maxDate = d3.max(forecasts.map(a => dateParse(a.date)))

  const minDate = dateParse('2020-01-01')
  const maxDate = dateParse('2020-12-31')

  const allDays = d3.timeDay.range(minDate, maxDate);
  for (const day of allDays) {
    if (actuals.find(a => a.date == dateFormat(day)) == null) {
      actuals.push({
        date: dateFormat(day),
        rain: 0
      })
    }
  }

  // Prepare the data
  // const forecastsLookup = d3.nest()
  //   .key(a => a.date)
  //   .rollup(a => a[0].rain)
  //   .object(forecasts);
  const forecastsLookup0 = d3.rollup(forecasts, v => v[0].rain, d => d.date);
  // let forecastsLookup = Array.from(d3.rollup(forecasts, v => v[0].rain, d => d.date)).reduce((obj, [key, value]) => {
  //   obj[key] = value;
  //   return obj;
  // }, {});

  // const actualsLookup = d3.nest()
  //   .key(a => a.date)
  //   .rollup(a => a[0].rain)
  //   .object(actuals);
  const actualsLookup0 = d3.rollup(actuals, v => v[0].rain, d => d.date);
  let actualsLookup = Array.from(d3.rollup(actuals, v => v[0].rain, d => d.date)).reduce((obj, [key, value]) => {
    // obj[key] = value;
    obj[key] = "";
    return obj;
  }, {});

  forecastsLookup = await d3.json('assets/js/json/酒吧.json')

  // console.log(forecastsLookup);
  // console.log(actualsLookup);

  const maxRain = d3.max(actuals.map(a => a.rain))

  const months = d3.timeMonth.range(d3.timeMonth.floor(minDate), maxDate, 1);

  // Drawing Legend
  const legendWidth = (cellSize + labelSize) * forecastWordMap.domain().length
  const legend = d3.select('#legend')
    .append('svg')
    .attr('width', legendWidth)
    .attr('height', cellSize * 7 + marginSize * 8)

  const actualLegend = legend.append('g');

  actualLegend.selectAll('rect')
    .data(forecastWordMap.domain())
    .enter().append('rect')
    .attr('x', (_d, i) => (cellSize + labelSize) * i)
    .attr('y', cellSize + marginSize)
    .attr('rx', rectRadius)
    .attr('ry', rectRadius)
    .attr('width', cellSize)
    .attr('height', cellSize)
    .attr('fill', (d) => forecastInterpolate(forecastWordMap(d)))

  actualLegend.selectAll('text.label')
    .data(forecastWordMap.domain())
    .enter().append('text')
    .classed('label', true)
    .attr('dominant-baseline', 'middle')
    .attr('font-size', 12)
    .attr('x', (_d, i) => (cellSize + labelSize) * i + cellSize + labelPadding )
    .attr('y', cellSize + marginSize + cellSize / 2)
    .text((d) => d)

  actualLegend.append('text')
    .attr('dominant-baseline', 'middle')
    .attr('font-size', 16)
    .attr('y', cellSize / 2)
    .text('關閉狀態')

  const forecastLegend = legend.append('g')
    .attr('transform', 'translate(0, ' + (cellSize * 2 + marginSize * 3) + ')');

    // Function that change a color
  async function changeColor() {
    var radioValue = $("input[name='placeButton']:checked");
    console.log(radioValue.val())
    forecastsLookup = await d3.json(`assets/js/json/${radioValue.val()}.json`)
    // theCircles
    //   .transition()
    //   .style("fill", radioValue)
    drawingCalendars(forecastsLookup);
  }


  // Event listener to the radio button
  // d3.select("#colorButton").on("change", changeColor )


  // Drawing Calendars
  var svg = {};
  var stat = {};
  var axisWidth = 0;
  var gAxis = {};
  var gradient = {};
  var diagnosticRow = {};
  function drawingCalendars (forecastsLookup) {
    // console.log(`data`, forecastsLookup);

    var xMonths = months.map((dateOfstart, idx) => {
      var selecteddates = Object.keys(forecastsLookup).filter(o => {
        var month = parseInt(o.slice(5,7), 10) - 1
        return idx === month
      })
      var allstatus = selecteddates.reduce((a,b) => a + forecastsLookup[b], "")
      var sig =  dateFormat(dateOfstart) + "_" + allstatus

      return {
        date: dateOfstart,
        sig: sig
      }
    })

    updates = d3.select('#calendar')
      .selectAll('svg')
      .data(xMonths, key => key.sig)

    updates.exit().remove();

    svg = updates
      .enter()
      .append('svg')
      .attr('width', cellSize * 7 + marginSize * 8)
      .attr('height', m => (cellSize + marginSize) * (d3.timeWeek.range(m.date, d3.timeMonth.offset(m.date, 1)).length + 1) + marginSize + monthNameHeight)
      .append('g')

    svg.selectAll('rect')
      .data(m => d3.timeDay.range(m.date, d3.min([d3.timeDay.offset(maxDate, 1), d3.timeMonth.offset(m.date, 1)])))
      .enter().append('rect')
      .attr('x', d => weekDayFormat(d) * (cellSize + marginSize))
      .attr('y', d => monthNameHeight + (weekFormat(d) - weekFormat(d3.timeMonth.floor(d))) * (cellSize + marginSize))
      .attr('rx', rectRadius)
      .attr('ry', rectRadius)
      .attr('fill', d => forecastsLookup[dateFormat(d)] != "" ? forecastInterpolate(forecastWordMap(forecastsLookup[dateFormat(d)])) : '#cccccc')
      .attr('width', cellSize)
      .attr('height', cellSize)
      .on('mouseenter', (event, d, i) => {
        // let offset = event.target.getBoundingClientRect();

        // tooltip.transition()
        //   .duration(200)
        //   .style('opacity', 1);
        // tooltip.html('<b>' + dateFormat(d) + '</b><br>預測: ' + (forecastsLookup[dateFormat(d)] || '無雨') +
        //              '<br>實際: ' + (actualsLookup[dateFormat(d)] > 0 ? actualsLookup[dateFormat(d)] + ' 毫米' : '無雨'))
        //   .style('left', (offset.left + cellSize/2 ) + 'px')
        //   .style('top', offset.top + window.scrollY - cellSize * 2 + 'px');
      })
      .on('mouseleave', (d) => {
        // tooltip.transition()
        //   .duration(500)
        //   .style('opacity', 0);
      });


    svg.selectAll('text.day')
      .data(m => d3.timeDay.range(m, d3.timeMonth.offset(m, 1)))
      .enter().append('text')
      .classed('fa', true)
      .classed('day', true)
      .attr('fill', '#ffffff')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('x', d => cellSize / 2 + weekDayFormat(d) * (cellSize + marginSize))
      .attr('y', d => cellSize / 2 + monthNameHeight + (weekFormat(d) - weekFormat(d3.timeMonth.floor(d))) * (cellSize + marginSize))
      .attr('font-size', d => actualsLookup[dateFormat(d)] > thresold ? actualsLookup[dateFormat(d)] / maxRain * 20 + 10 : 0)
      .attr('opacity', d => actualsLookup[dateFormat(d)] > thresold ? 1 : 0)
      .text(d => actualsLookup[dateFormat(d)] > 0 ? '\uf73d' : '')

    svg.append('text')
      .attr('x', 0)
      .attr('y', monthNameHeight / 2)
      .attr('fill', '#000000')
      .attr('dorminant-baseline', 'middle')
      .attr('font-weight', 'bold')
      .text(m => monthNames[m.date.getMonth()])

    // Statistics
    const confusionMatrixLabel = [
      ['預測有雨', '預測無雨'],
      ['實際有雨', '實際無雨'],
    ]

    stat = d3.select('#statistics').append('svg')
      .attr('width', (statCellWidth + marginSize) * 2 + statLabelSize)
      .attr('height', (statCellHeight + marginSize) * 2 + labelHeight + axisHeight + 20)

    stat.append('g').classed('xAxis', true)
      .selectAll('text')
      .data(confusionMatrixLabel[0])
        .enter().append('text')
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('x', (_d, i) => i * (statCellWidth + marginSize) + statLabelSize + statCellWidth/2)
        .attr('y', labelHeight / 2)
        .text(d => d)

    stat.append('g').classed('yAxis', true)
      .selectAll('text')
      .data(confusionMatrixLabel[1])
        .enter().append('text')
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('x', statLabelSize / 2)
        .attr('y', (_d, i) => labelHeight + i * statCellHeight + statCellHeight/2)
        .text(d => d)

    axisWidth = (statCellWidth + marginSize) * 2;

    gradient = stat.append('linearGradient')
      .attr('id', 'axis-gradient')

    gradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', statisticsInterpolate(0));

    gradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', statisticsInterpolate(1));

    stat.append('rect')
      .style("fill", "url(#axis-gradient)")
      .attr('width', axisWidth)
      .attr('height', axisHeight / 2)
      .attr('transform', 'translate(' + statLabelSize + ', ' + ((statCellHeight + marginSize) * 2 + labelHeight + axisHeight/2 ) + ')')

    gAxis = stat.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(' + statLabelSize + ', ' + ((statCellHeight + marginSize) * 2 + labelHeight + axisHeight) + ')');

    diagnosticRow = d3.select('#statistics').append('div')
      .classed('diagnostic', true)
      .selectAll('div.row')
        .data(['accuracy', 'precision', 'recall', 'f1'])
      .enter().append('div')
        .classed('row', true);

    diagnosticRow.append('div')
      .classed('title', true)
      .text(g => g.substr(0, 1).toUpperCase() +  g.substr(1));

    diagnosticRow.append('div')
      .classed('value', true)
  }

  drawingCalendars(forecastsLookup);

  function updateStatistics() {
    const confusionMatrix = [
      [
        forecasts.filter(f => f.rain != null && actualsLookup[f.date] > thresold).length,
        forecasts.filter(f => f.rain == null && actualsLookup[f.date] > thresold).length,
      ],
      [
        forecasts.filter(f => f.rain != null && actualsLookup[f.date] <= thresold).length,
        forecasts.filter(f => f.rain == null && actualsLookup[f.date] <= thresold).length,
      ]
    ]
    const truePositive = confusionMatrix[0][0];
    const falseNegative = confusionMatrix[0][1];
    const falsePositive = confusionMatrix[1][0];
    const trueNegative = confusionMatrix[1][1];

    const maxHit = d3.max([truePositive, falseNegative, falsePositive, trueNegative])
    const minHit = d3.min([truePositive, falseNegative, falsePositive, trueNegative])

    const hitScale = d3.scaleLinear([minHit, maxHit], [0, 1])

    const gRect = stat.selectAll('g.rect')
      .data(confusionMatrix);

    const dataRect = gRect.enter().append('g')
        .classed('rect', true)
        .attr('transform', (_d, i) => `translate(0, ${i * (statCellHeight + marginSize) + labelHeight})`)
        .merge(gRect)
        .selectAll('rect')
        .data(row => row);

    dataRect.enter().append('rect')
        .attr('x', (_d, i) => i * (statCellWidth + marginSize) + statLabelSize)
        .attr('width', statCellWidth)
        .attr('height', statCellHeight)
      .merge(dataRect)
        .transition()
        .attr('fill', d => statisticsInterpolate(hitScale(d)))

    const gText = stat.selectAll('g.text')
      .data(confusionMatrix);

    const dataText = gText.enter().append('g')
        .classed('text', true)
        .attr('transform', (_d, i) => `translate(0, ${i * (statCellHeight + marginSize) + labelHeight})`)
        .merge(gText)
        .selectAll('text')
        .data(row => row);

    dataText.enter().append('text')
        .attr('x', (_d, i) => i * (statCellWidth + marginSize) + statLabelSize + statCellWidth / 2)
        .attr('y', statCellHeight / 2)
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('fill', '#ffffff')
      .merge(dataText)
        .transition()
        .text(d => d + ' 日')

    const confusionAxis = d3.axisBottom(d3.scaleLinear([minHit, maxHit], [0, axisWidth])).tickFormat(function(d){ return d;})

    gAxis.transition().call(confusionAxis);

    // Other statistic figures
    // Demonstration of using D3 to manipulate HTML DOM
    const positive = truePositive + falseNegative;
    const negative = falsePositive + trueNegative;

    const accuracy = (truePositive + trueNegative)/(positive + negative);
    const precision = truePositive/(truePositive + falsePositive);
    const recall = truePositive/(truePositive + falseNegative);
    const f1 = 2 * precision * recall / ( precision + recall )

    const diagnostic = {
      accuracy: accuracy,
      precision: precision,
      recall: recall,
      f1: f1
    }

    diagnosticRow.select('div.value')
      .text(g => (diagnostic[g]).toFixed(2));
  }

  // Slider
  function updateDay() {
    svg.selectAll('text.day')
      .transition()
      .attr('opacity', d => actualsLookup[dateFormat(d)] > thresold ? 1 : 0)

  }

  function update() {
    updateDay();
    updateStatistics();
  }

  update();

})();


$(function () {

  async function makeHeatmap(place) {
    const maxval = "2020-01-01";
    let data = await d3.json(`assets/js/json/${place}.json`)
    let newdata = Object.keys(data).map(o => {
      if (maxval === o) {
        return {
          date: maxval,
          count: 150
        }
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
  }

  // Function that change a color
  async function changeColor2() {
    var radioValue = $("input[name='placeButton']:checked");
    // console.log(radioValue.val())
    makeHeatmap(radioValue.val());
  }


  // Event listener to the radio button
  d3.select("#colorButton").on("change", changeColor2 );
  makeHeatmap("酒吧");

});