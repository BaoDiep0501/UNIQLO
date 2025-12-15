let cart = [
  { id: 13, name: "HEATTECH pha cashmere", size: "M", price: 799000 },
  { id: 14, name: "Áo khoác phao ngắn không đường may", size: "L", price: 1099000 }
];
const items = document.getElementById("cartList");

function renderCart() {
  items.innerHTML = "";

  if (cart.length === 0) {
    items.innerHTML = 
    `<p class="empty-cart"> Giỏ hàng của bạn đang trống</p>`;
    updateTotal();
    return;
  }

  cart.forEach(item => {
    items.innerHTML += `
      <label class="cart-item">
        <input type="checkbox" checked data-price="${item.price}">

        <div class="cart-info">
          <div class="cart-name">${item.name}</div>
          <div class="cart-meta">Size ${item.size}</div>
        </div>

        <div class="cart-actions">
          <span class="cart-price">${item.price.toLocaleString("vi-VN")}đ</span>
          <button class="cart-remove" data-id="${item.id}">−</button>
        </div>
      </label>
    `;
  });

  updateTotal();
}

document.addEventListener("click", function (e) {
  if (e.target.classList.contains("cart-remove")) {
    const id = Number(e.target.dataset.id);
    cart = cart.filter(item => item.id !== id);
    renderCart();
  }
});


const totalPriceEl = document.getElementById("totalPrice");

document.addEventListener("change", function (e) {
  if (e.target.matches(".cart-item input[type='checkbox']")) {
    updateTotal();
  }
});

function updateTotal() {
  let total = 0; //đặt biến tính tổng đơn hàng = 0

  document.querySelectorAll(".cart-item input[type='checkbox']")
    .forEach(checkbox => {
      if (checkbox.checked) {
        const price = Number(checkbox.dataset.price); //đọc giá của đơn hàng
        total += price;
      }
    });

  totalPriceEl.textContent = total.toLocaleString("vi-VN") + "đ";
}
renderCart();
