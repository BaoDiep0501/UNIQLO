/* ===== CHECKOUT PAGE ===== */
(function(){
  const products = window.PRODUCTS || [];

  function renderCart(){
    const cartItemsEl = document.getElementById("cartItems");
    const cartSummaryEl = document.getElementById("cartSummary");
    const cart = window.CartStore.get();

    if(!cartItemsEl || !cartSummaryEl) return;

    if(cart.length === 0){
      cartItemsEl.innerHTML = "<p>Giỏ hàng trống.</p>";
      cartSummaryEl.textContent = "";
      return;
    }

    cartItemsEl.innerHTML = "";
    let subtotal = 0;

    cart.forEach((item, idx)=>{
      const p = products.find(x=>x.id === item.id);
      if(!p) return;
      const row = document.createElement("div");
      row.className = "cart-item";
      const lineTotal = p.price * (item.qty||1);
      subtotal += lineTotal;

      row.innerHTML = `
        <span>${p.name} · Size ${item.size || "M"} ×${item.qty || 1}</span>
        <span>${formatPrice(lineTotal)}</span>
      `;
      cartItemsEl.appendChild(row);
    });

    cartSummaryEl.textContent = `Tổng: ${formatPrice(subtotal)}`;
  }

  function setupForm(){
    const form = document.getElementById("checkoutForm");
    const msg = document.getElementById("checkoutMessage");
    const sendCodeBtn = document.getElementById("sendCodeBtn");
    if(sendCodeBtn){
      sendCodeBtn.onclick = ()=>{
        alert("Đã gửi mã (demo). Bạn nhập bất kỳ để tiếp tục nhé.");
      };
    }
    if(!form || !msg) return;

    form.addEventListener("submit",(e)=>{
      e.preventDefault();
      msg.textContent = "✅ Thanh toán thành công (demo). Cảm ơn bạn!";
      window.CartStore.clear();
      renderCart();
      setTimeout(()=> msg.textContent = "", 3500);
      form.reset();
    });
  }

  document.addEventListener("DOMContentLoaded", ()=>{
    renderCart();
    setupForm();
  });
})();
