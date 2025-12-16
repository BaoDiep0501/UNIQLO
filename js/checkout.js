/* ===== CHECKOUT PAGE ===== */

const cartList = document.getElementById("cartList");
const totalPriceEl = document.getElementById("totalPrice");

let cart = [];

/* ===== LOAD DATA FROM CONTACT ===== */
function loadCartFromStorage() {
  const raw = localStorage.getItem("UNIQLO_CART");
  if (!raw) return;

  try {
    const data = JSON.parse(raw);
    cart = data.map((it, index) => {
      const product = (window.PRODUCTS || []).find(p => p.id === it.id);

      return {
        id: index + 1,
        name: product?.name || "Sản phẩm",
        size: it.size,
        color: it.color,
        qty: it.qty,
        price: product?.price || 0
      };
    });
  } catch (e) {
    console.error("Không đọc được giỏ hàng", e);
  }
}


/* ===== RENDER CART ===== */
function renderCart() {
  cartList.innerHTML = "";

  if (cart.length === 0) {
    cartList.innerHTML =
      `<p class="empty-cart">Giỏ hàng của bạn đang trống</p>`;
    updateTotal();
    return;
  }

  cart.forEach(item => {
    cartList.innerHTML += `
      <label class="cart-item">
        <input 
          type="checkbox" 
          checked 
          data-price="${item.price * item.qty}"
        >

        <div class="cart-info">
          <div class="cart-name">${item.name}</div>
          <div class="cart-meta">
          Màu ${window.COLOR_MAP?.[item.color]?.name || "—"} · 
            Size ${item.size|| "—"} · 
            SL ${item.qty}
          </div>
        </div>

        <div class="cart-actions">
          <span class="cart-price">
            ${(item.price * item.qty).toLocaleString("vi-VN")}đ
          </span>
          <button class="cart-remove" data-id="${item.id}">−</button>
        </div>
      </label>
    `;
  });

  updateTotal();
}

/* ===== REMOVE ITEM ===== */
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("cart-remove")) {
    const id = Number(e.target.dataset.id);
    cart = cart.filter(item => item.id !== id);
    const storeCart = cart.map(it => ({
  id: it.productId,
  size: it.size,
  color: it.color,
  qty: it.qty
}));

localStorage.setItem("UNIQLO_CART", JSON.stringify(storeCart));

// 🔄 cập nhật badge
window.CartStore.updateBadge();

renderCart();
  }
});

/* ===== UPDATE TOTAL ===== */
document.addEventListener("change", function (e) {
  if (e.target.matches(".cart-item input[type='checkbox']")) {
    updateTotal();
  }
});

function updateTotal() {
  let total = 0;

  document
    .querySelectorAll(".cart-item input[type='checkbox']")
    .forEach(cb => {
      if (cb.checked) {
        total += Number(cb.dataset.price);
      }
    });

  totalPriceEl.textContent = total.toLocaleString("vi-VN") + "đ";
}

/* ===== INIT ===== */
loadCartFromStorage();
renderCart();
