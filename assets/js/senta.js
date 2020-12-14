$(function () {
  $('[name="view_district"]').on('change', function (e) {
    let val = $(this).val();
    console.log('val', val);
    if ("-" !== val) {
      let el = $('#district_senta');

      if (el.length) {
        fireEvent(`${G['trackingCate']}`, 'click_district', {
          'chart_id': val,
          'anonymous_id': getAnonymousId(),
          'session_id': getSessionId(),
          'ts': Date.now()
        });

        let html = `<img class="senta_img" src="assets/img/output_${val}.png" alt="" />`
        $('#district_senta').html(html)
      }
    }
  });
});
