const items = document.getElementById("cartList");
const successPopup = document.getElementById("successPopup");
const closePopupBtn = document.getElementById("closePopupBtn");
const checkoutBtn = document.getElementById("checkoutBtn");

const VN_PROVINCES = [
  // 28 tỉnh
  "Tuyên Quang","Lào Cai","Thái Nguyên","Phú Thọ","Bắc Ninh","Hưng Yên", "Thanh Hóa","Nghệ An","Hà Tĩnh",
  "Quảng Ninh","Sơn La","Lai Châu","Điện Biên","Cao Bằng","Quảng Trị","Quảng Ngãi","Gia Lai","Khánh Hòa",
  "Lâm Đồng","Đắk Lắk","Đồng Nai","Tây Ninh","Vĩnh Long","Đồng Tháp","Cà Mau","An Giang","Ninh Bình"
];
const MAJOR_CITIES = ["TP Hà Nội",  "TP Hải Phòng",  "TP Huế",  "TP Đà Nẵng",  "TP Hồ Chí Minh",  "TP Cần Thơ",];

function populateCities() {
  const select = document.getElementById("contactCity");
  if (!select) return;
  select.innerHTML = '<option value="">-- Chọn tỉnh / thành phố --</option>';
  MAJOR_CITIES.forEach(city => {
    const opt = document.createElement("option");
    opt.value = city;
    opt.textContent = city;
    select.appendChild(opt);
  });

  VN_PROVINCES.forEach(province => {
    const opt = document.createElement("option");
    opt.value = province;
    opt.textContent = province;
    select.appendChild(opt);
  });
}
document.addEventListener("DOMContentLoaded", function () {
  fillCustomerInfoFromContact();
  renderCart();
  populateCities()
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

  document.getElementById("contactCity")?.addEventListener("change", updateTotal);

  // CHECKOUT
  checkoutBtn.addEventListener("click", function () {
    if (!validateCustomerInfo()) return;
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

  CartStore.save(cart);
  successPopup.classList.remove("show");
  localStorage.removeItem("uniqloCustomerInfo");
  renderCart();
});

  // CHECKBOX CHANGE
  document.addEventListener("change", function (e) {
    if (e.target.matches(".cart-item input[type='checkbox']")) {
      updateTotal();
    }
  });
});

/*Load giỏ hàng*/
function renderCart() {
  const cart = CartStore.get();
  items.innerHTML = "";

  if (!cart.length) {
    items.innerHTML = `
      <div class="empty-cart">
        <p>Giỏ hàng của bạn đang trống</p>
      </div>
    `;
    resetSummary();
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
  const city = document.getElementById("contactCity")?.value || "";
  const shipFee = calculateShippingFee(city); 
  document.getElementById("subTotalPrice").textContent =
    total.toLocaleString("vi-VN") + "đ";

  document.getElementById("shippingFee").textContent =
    shipFee.toLocaleString("vi-VN") + "đ";

  document.getElementById("finalPrice").textContent =
    (total + shipFee).toLocaleString("vi-VN") + "đ";
}
function fillCustomerInfoFromContact() {
  const raw = localStorage.getItem("uniqloCustomerInfo");
  if (!raw) return;

  try {
    const info = JSON.parse(raw);

    document.getElementById("contactName").value = info.name || "";
    document.getElementById("contactPhone").value = info.phone || "";
    document.getElementById("contactEmail").value = info.email || "";
  } catch {}
}

function validateCustomerInfo() {
  const nameEl = document.getElementById("contactName");
  const phoneEl = document.getElementById("contactPhone");
  const emailEl = document.getElementById("contactEmail");
  const addressEl = document.getElementById("contactAddress");
  const cityEl = document.getElementById("contactCity");

  const name = nameEl.value.trim();
  const phone = phoneEl.value.trim();
  const email = emailEl.value.trim();
  const address = addressEl.value.trim();
  const city = cityEl.value;

  if (!name) {
    alert("Vui lòng nhập họ và tên");
    nameEl.focus();
    return false;
  }

  if (!phone && !email) {
    alert("Vui lòng nhập số điện thoại hoặc email");
    phoneEl.focus();
    return false;
  }
  if (!address) {
    alert("Vui lòng nhập địa chỉ nhận hàng");
    addressEl.focus();
    return false;
  }

  if (!city) {
    alert("Vui lòng chọn tỉnh / thành phố");
    cityEl.focus();
    return false;
  }

  return true;
}
function calculateShippingFee(city) {
  if (!city) return 0;
  if (city.startsWith("TP Hồ Chí Minh")) {
    return 15000; 
  }
  if (MAJOR_CITIES.some(c => city.startsWith(c))) {
    return 25000;
  }
  return 35000;
}
function resetSummary() {
  document.getElementById("subTotalPrice").textContent = "0đ";
  document.getElementById("shippingFee").textContent = "0đ";
  document.getElementById("finalPrice").textContent = "0đ";
}