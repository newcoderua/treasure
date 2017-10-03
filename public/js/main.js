$(document).ready(() => {
  $('.delete-customer').on('click', (e) => {
    $target = $(e.target);
    const id = $target.attr('data-id');
    $.ajax({
      type: 'DELETE',
      url: '/customer/'+id,
      success: (res) => {
        window.location.href='/';
      },
      error: (err) => {
        console.log(err);
      }
    })
  });
});
