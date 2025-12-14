/* ===== FORM ĐẶT HÀNG NHANH - CHUYỂN ĐẾN GIỎ HÀNG ===== */
(function($){
  $(document).ready(function(){
    const $form = $("#contactForm");
    const $confirm = $("#contactConfirm");

    if(!$form.length || !$confirm.length) return;

    $form.on("submit", function(e){
      e.preventDefault();

      // Lấy dữ liệu từ form
      const customerData = {
        name: $("#contactName").val().trim(),
        phone: $("#contactPhone").val().trim(),
        email: $("#contactEmail").val().trim(),
        product: $("#contactProduct").val().trim(),
        note: $("#contactMessage").val().trim(),
        timestamp: new Date().toISOString()
      };

      // Lưu vào localStorage (sẽ dùng ở trang giỏ hàng)
      localStorage.setItem("uniqloCustomerInfo", JSON.stringify(customerData));

      // Hiển thị thông báo fadeIn
      $confirm.fadeIn(600);

      // Sau 2 giây, chuyển đến trang giỏ hàng
      setTimeout(function(){
        window.location.href = "cart.html"; // Thay bằng tên file giỏ hàng thực tế của bạn
      }, 2000);

      // Reset form (tùy chọn)
      $form[0].reset();
    });
  });
})(jQuery);