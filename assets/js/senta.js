const dist_mapping = {
  "A": "中西區",
  "B": "灣仔區",
  "C": "東區",
  "D": "南區",
  "E": "油尖旺區",
  "F": "深水埗區",
  "G": "九龍城區",
  "H": "黃大仙區",
  "J": "觀塘區",
  "K": "荃灣區",
  "L": "屯門區",
  "M": "元朗區",
  "N": "北區",
  "P": "大埔區",
  "Q": "西貢區",
  "R": "沙田區",
  "S": "葵青區",
  "T": "離島區",
};

$(function () {
  $('[name="view_district"]').on('change', function (e) {
    let val = $(this).val();

    if ("-" !== val) {
      let el = $('#district_senta');

      if (el.length) {
        fireEvent(`${G['trackingCate']}`, 'click_district', {
          'chart_id': val,
          'anonymous_id': getAnonymousId(),
          'session_id': getSessionId(),
          'ts': Date.now()
        });

        let html = `<img class="senta_img" src="assets/img/output_${val}.png" alt="${dist_mapping[val]}" />`
        $('#district_senta').html(html)
      }
    }
  });
});
