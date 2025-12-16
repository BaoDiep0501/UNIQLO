const items = document.getElementById("cartList");
const successPopup = document.getElementById("successPopup");
const closePopupBtn = document.getElementById("closePopupBtn");
const checkoutBtn = document.getElementById("checkoutBtn");
const totalPriceEl = document.getElementById("totalPrice");

document.addEventListener("DOMContentLoaded", function () {
  fillCustomerInfoFromContact();
  renderCart();

  // REMOVE ITEM
  document.addEventListener("click", function (e) {
    const btn = e.target.closest(".cart-remove");
    if (!btn) return;
    const index = Number(btn.dataset.index);

    let cart = CartStore.get();
    cart.splice(index, 1); // xóa đúng 1 item
    CartStore.save(cart);

    renderCart();
  });


  // CHECKOUT
  checkoutBtn.addEventListener("click", function () {
    const checkedItems = document.querySelectorAll(
      ".cart-item input[type='checkbox']:checked"
    );

    if (checkedItems.length === 0) {
      alert("Vui lòng chọn ít nhất 1 sản phẩm để thanh toán");
      return;
    }

    successPopup.classList.add("show");
  });

  // CLOSE POPUP + REMOVE PAID ITEMS
closePopupBtn.addEventListener("click", function () {
  let cart = CartStore.get();

  const checkedIndexes = [];

  document.querySelectorAll(
    ".cart-item input[type='checkbox']:checked"
  ).forEach(cb => {
    const itemEl = cb.closest(".cart-item");
    const index = Number(
      itemEl.querySelector(".cart-remove").dataset.index
    );
    checkedIndexes.push(index);
  });

  checkedIndexes.sort((a, b) => b - a).forEach(i => {
    cart.splice(i, 1);
  });

  CartStore.set(cart);
  successPopup.classList.remove("show");
  renderCart();
});

  // CHECKBOX CHANGE
  document.addEventListener("change", function (e) {
    if (e.target.matches(".cart-item input[type='checkbox']")) {
      updateTotal();
    }
  });
});

/* ===== RENDER CART ===== */
function renderCart() {
  const cart = CartStore.get();
  items.innerHTML = "";

  if (!cart.length) {
    items.innerHTML = `
      <div class="empty-cart">
        <p>Giỏ hàng của bạn đang trống</p>
      </div>
    `;
    totalPriceEl.textContent = "0đ";
    return;
  }

  cart.forEach((item, index) => {
    const product = window.PRODUCTS.find(p => p.id === item.id);
    if (!product) return;

    const price = product.price * item.qty;

    items.innerHTML += `
      <div class="cart-item">
        <label class="cart-check">
          <input type="checkbox" checked data-price="${price}">
        </label>

        <div class="cart-info">
          <div class="cart-name">${product.name}</div>
          <div class="cart-meta">
            Size ${item.size} · 
            Màu ${window.COLOR_MAP?.[item.color]?.name || "—"} · 
            SL ${item.qty}
          </div>
        </div>

        <div class="cart-actions">
          <span class="cart-price">
            ${price.toLocaleString("vi-VN")}đ
          </span>
          <button class="cart-remove" data-index="${index}">−</button>
        </div>
      </div>
    `;

  });

  updateTotal();
}

function updateTotal() {
  let total = 0;

  document.querySelectorAll(".cart-item input[type='checkbox']")
    .forEach(cb => {
      if (cb.checked) {
        total += Number(cb.dataset.price);
      }
    });

  totalPriceEl.textContent = total.toLocaleString("vi-VN") + "đ";
}
function fillCustomerInfoFromContact() {
  const raw = localStorage.getItem("uniqloCustomerInfo");
  if (!raw) return;

  try {
    const info = JSON.parse(raw);

    const nameEl = document.getElementById("contactName");
    const phoneEl = document.getElementById("contactPhone");
    const emailEl = document.getElementById("contactEmail");

    if (nameEl && info.name) nameEl.value = info.name;
    if (phoneEl && info.phone) phoneEl.value = info.phone;
    if (emailEl && info.email) emailEl.value = info.email;
  } catch (e) {
    console.warn("Không thể parse uniqloCustomerInfo", e);
  }
}
