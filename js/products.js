/* ===== PRODUCTS PAGE ===== */
(function () {
  const products = window.PRODUCTS || [];
  const grid = document.getElementById("productsGrid");
  const genderButtons = document.querySelectorAll(".gender-btn");

  // state duy nhất (KHÔNG khai báo lại ở dưới)
  let currentGender = "all";

  const filterCategory = document.getElementById("filterCategory");
  const filterSize = document.getElementById("filterSize");
  const filterColor = document.getElementById("filterColor");
  const filterPrice = document.getElementById("filterPrice");
  const clearFilters = document.getElementById("clearFilters");

  function getQueryParam(name) {
    const url = new URL(window.location.href);
    return url.searchParams.get(name) || "";
  }

  function formatPrice(v) {
    // fallback nếu common.js chưa có
    try {
      return v.toLocaleString("vi-VN") + "đ";
    } catch {
      return String(v) + "đ";
    }
  }

  // Chuẩn hoá so sánh (tránh lệch den/Đen/đen...)
  function normalizeText(s) {
    return (s || "")
      .toString()
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  // ✅ helper: lấy ảnh theo màu filter (nếu có), fallback về ảnh đầu
  function getMainImgByColor(p, activeColor) {
    if (activeColor && activeColor !== "all") {
      const byColor = p.imagesByColor || {};
      if (byColor[activeColor]) return byColor[activeColor];
    }
    return p.images?.[0] || "https://via.placeholder.com/400";
  }

  // ✅ nhận thêm activeColor để đổi ảnh chính theo màu đang lọc
  function createCard(p, activeColor) {
    const card = document.createElement("div");
    card.className = "product-card";

    const imgDiv = document.createElement("div");
    imgDiv.className = "product-image";

    const imgSrc = getMainImgByColor(p, activeColor);

    imgDiv.innerHTML = `
      <img src="${imgSrc}"
           alt="${p.name}"
           style="width:100%; height:100%; object-fit:cover; border-radius:12px; transition:transform .4s;">
      <div class="product-hover-overlay">
        <div class="hover-content">
          <span>Xem chi tiết</span>
          <span class="hover-price">${formatPrice(p.price)}</span>
        </div>
      </div>
    `;
    imgDiv.addEventListener("click", () => {
      window.location.href = "product-detail.html?id=" + encodeURIComponent(p.id);
    });

    const info = document.createElement("div");
    info.className = "product-info";

    // hiển thị text màu: ưu tiên colorIds nếu có
    const colorText = Array.isArray(p.colorIds) && p.colorIds.length ? "Nhiều màu" : (p.color || "Nhiều màu");

    info.innerHTML = `
      <h3 class="product-name">${p.name}</h3>
      <div class="product-meta">${p.gender === "female" ? "Nữ" : "Nam"} · ${colorText}</div>
      <div class="product-price-main">${formatPrice(p.price)}</div>

      <div class="product-sizes">
        <button class="size-btn" data-size="S">S</button>
        <button class="size-btn" data-size="M">M</button>
        <button class="size-btn" data-size="L">L</button>
        <button class="size-btn" data-size="XL">XL</button>
      </div>

      <button class="add-cart-btn">Thêm vào giỏ hàng</button>
    `;

    info.querySelector(".product-name").addEventListener("click", () => {
      window.location.href = "product-detail.html?id=" + encodeURIComponent(p.id);
    });

    let selectedSize = "M";
    info.querySelectorAll(".size-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        info.querySelectorAll(".size-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        selectedSize = btn.dataset.size;
      });
    });

    info.querySelector(".add-cart-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      window.CartStore?.add?.({ id: p.id, size: selectedSize, qty: 1 });
      alert(`Đã thêm "${p.name}" - Size ${selectedSize} vào giỏ hàng!`);
    });

    card.appendChild(imgDiv);
    card.appendChild(info);
    return card;
  }

  function matchPrice(p, priceKey) {
    if (priceKey === "all") return true;
    if (priceKey === "1") return p.price < 500000;
    if (priceKey === "2") return p.price >= 500000 && p.price <= 1000000;
    if (priceKey === "3") return p.price > 1000000;
    return true;
  }

  function setActiveGenderButton() {
    genderButtons.forEach((b) => b.classList.remove("active"));
    document.querySelector(`.gender-btn[data-gender="${currentGender}"]`)?.classList.add("active");
  }
  function normalizeCategoryKey(val) {
  const v = normalizeText(val);
  // chỉ chấp nhận 3 loại bạn đang dùng
  if (v === "top" || v === "bottom" || v === "outer") return v;
  return v; // fallback
}

  function apply() {
    if (!grid) return;

    const cat = filterCategory?.value || "all";
    const size = filterSize?.value || "all";
    const color = filterColor?.value || "all";
    const price = filterPrice?.value || "all";
    const q = normalizeText(getQueryParam("q"));

    const list = products.filter((p) => {
      // gender
      if (currentGender !== "all" && p.gender !== currentGender) return false;

      // category
      if (cat !== "all") {
    const pc = normalizeCategoryKey(p.category);
    const fc = normalizeCategoryKey(cat);
    if (pc !== fc) return false;
    }

      // price
      if (!matchPrice(p, price)) return false;

      // search q
      if (q && !normalizeText(p.name).includes(q)) return false;

      // size
      if (size !== "all" && Array.isArray(p.sizes) && !p.sizes.includes(size)) return false;

      // ✅ color filter theo colorIds
      if (color !== "all") {
        const ids = Array.isArray(p.colorIds) ? p.colorIds : [];
        if (!ids.includes(color)) return false;
      }

      return true;
    });

    grid.innerHTML = "";
    if (list.length === 0) {
      grid.innerHTML = `<p>Không có sản phẩm phù hợp.</p>`;
      return;
    }

    // ✅ truyền màu đang lọc vào createCard để đổi ảnh chính
    list.forEach((p) => grid.appendChild(createCard(p, color)));
  }

  function resetFilters() {
    if (filterCategory) filterCategory.value = "all";
    if (filterSize) filterSize.value = "all";
    if (filterColor) filterColor.value = "all";
    if (filterPrice) filterPrice.value = "all";
    apply();
  }

  document.addEventListener("DOMContentLoaded", () => {
    // init gender từ URL param nếu có: ?gender=female|male|all
    const g = getQueryParam("gender");
    if (g && ["female", "male", "all"].includes(g)) {
      currentGender = g;
    }
    setActiveGenderButton();

    // bind gender (CHỈ 1 LẦN)
    genderButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        currentGender = btn.dataset.gender || "all";
        setActiveGenderButton();
        apply();
      });
    });

    // bind filters
    [filterCategory, filterSize, filterColor, filterPrice].forEach((el) => {
      el?.addEventListener("change", apply);
    });
    clearFilters?.addEventListener("click", resetFilters);

    // first render
    apply();
  });
})();
