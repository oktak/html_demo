$(function () {
  $('[name="view_district"]').on('change', function (e) {
    let val = $(this).val();
    console.log('val', val);
    if ("-" !== val) {
      let el = $('#district_senta');

      if (el.length) {
        let html = `<img class="senta_img" src="/html_demo/assets/img/output_${val}.png" alt="" />`
        $('#district_senta').html(html)
      }
    }
  });
});
