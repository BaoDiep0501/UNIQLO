/* ==== HERO SLIDER (giữ nguyên, chạy ngon) ==== */
$(document).ready(function () {
  const $slider = $("#hero-slider");
  const $slides = $(".hero-slide");
  const slideCount = $slides.length;
  let slideHeight = $(window).height();

  if (slideCount === 0) return;

  const $firstClone = $slides.first().clone();
  const $lastClone = $slides.last().clone();
  $slider.append($firstClone);
  $slider.prepend($lastClone);

  let index = 1;
  $slider.scrollTop(slideHeight * index);

  let isDragging = false;
  let startY = 0;
  let scrollStart = 0;

  $slider.on("mousedown touchstart", function (e) {
    isDragging = true;
    startY = e.pageY || e.originalEvent.touches[0].pageY;
    scrollStart = $slider.scrollTop();
    $slider.css("scroll-behavior", "auto");
  });

  $slider.on("mousemove touchmove", function (e) {
    if (!isDragging) return;
    const y = e.pageY || e.originalEvent.touches[0].pageY;
    const walk = startY - y;
    $slider.scrollTop(scrollStart + walk);
  });

  $slider.on("mouseup touchend mouseleave", function () {
    if (!isDragging) return;
    isDragging = false;
    $slider.css("scroll-behavior", "smooth");

    const currentScroll = $slider.scrollTop();
    index = Math.round(currentScroll / slideHeight);
    snap();
  });

  setInterval(() => {
    index++;
    snap();
  }, 4000);

  function snap() {
    $slider.scrollTop(slideHeight * index);
    setTimeout(() => {
      if (index === slideCount + 1) {
        $slider.css("scroll-behavior", "auto");
        index = 1;
        $slider.scrollTop(slideHeight * index);
        $slider.css("scroll-behavior", "smooth");
      }
      if (index === 0) {
        $slider.css("scroll-behavior", "auto");
        index = slideCount;
        $slider.scrollTop(slideHeight * index);
        $slider.css("scroll-behavior", "smooth");
      }
    }, 600);
  }

  $(window).resize(function () {
    slideHeight = $(window).height();
    $slider.css("scroll-behavior", "auto");
    $slider.scrollTop(slideHeight * index);
    $slider.css("scroll-behavior", "smooth");
  });
});

/* ==== MOCK DATA SẢN PHẨM (có ảnh thật + giá cũ) ==== */
const products = [
  { id: 1, name: "Áo khoác dạ nữ dài phom rộng", gender: "female", category: "outer", price: 1299000, oldPrice: 1899000, images: ["assets/image/f1.jpg","assets/image/f1b.jpg","assets/image/f1c.jpg"], description: "Chất dạ cao cấp, ấm áp, dáng dài thanh lịch." },
  { id: 2, name: "Áo len cardigan nữ beige", gender: "female", category: "top", price: 699000, oldPrice: 999000, images: ["assets/image/f2.jpg","assets/image/f2b.jpg"], description: "Len mềm mại, màu beige dễ phối đồ." },
  { id: 3, name: "Quần jean ống suông nữ", gender: "female", category: "bottom", price: 799000, images: ["assets/image/f3.jpg"], description: "Form chuẩn, tôn dáng cực đẹp." },
  { id: 4, name: "Áo sơ mi nữ oversized trắng", gender: "female", category: "top", price: 499000, oldPrice: 799000, images: ["assets/image/f4.jpg"], description: "Phong cách basic, chất cotton thoáng mát." },
  { id: 5, name: "Áo khoác bomber nam nâu", gender: "male", category: "outer", price: 1199000, oldPrice: 1699000, images: ["assets/image/m1.jpg","assets/image/m1b.jpg"], description: "Dáng rộng thoải mái, chất gió cao cấp." },
  { id: 6, name: "Sơ mi nam cổ đứng trắng", gender: "male", category: "top", price: 599000, images: ["assets/image/m2.jpg"], description: "Lịch lãm, dễ phối đồ công sở." },
  { id: 7, name: "Quần tây nam slim fit đen", gender: "male", category: "bottom", price: 799000, oldPrice: 1099000, images: ["assets/image/m3.jpg"], description: "Co giãn tốt, form slim tôn dáng." },
  { id: 8, name: "Áo thun nam cổ tròn đen", gender: "male", category: "top", price: 299000, images: ["assets/image/m4.jpg"], description: "Cotton 100%, mặc mát cả ngày." }
];

/* ==== STATE & DOM ==== */
let cart = [];
let currentDetailProduct = null;
let activeGenderFilter = "all";

const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll(".page-section");
const menuBtn = document.getElementById("menuBtn");
const sidebar = document.getElementById("sidebar");
const closeSidebarBtn = document.getElementById("closeSidebarBtn");
const womenProductsEl = document.getElementById("womenProducts");
const menProductsEl = document.getElementById("menProducts");
const cartCountEl = document.getElementById("cartCount");
const cartItemsEl = document.getElementById("cartItems");
const cartSummaryEl = document.getElementById("cartSummary");
const goToCheckoutBtn = document.getElementById("goToCheckoutBtn");
const searchInput = document.getElementById("searchInput");
const filterBar = document.querySelector(".filter-bar");

// DETAIL ELEMENTS (mới)
const backToListBtn = document.getElementById("backToListBtn");
const mainImgElement = document.getElementById("mainImgElement");
const detailThumbs = document.getElementById("detailThumbs");
const detailName = document.getElementById("detailName");
const detailPrice = document.getElementById("detailPrice");
const detailOldPrice = document.getElementById("detailOldPrice");
const detailDesc = document.getElementById("detailDesc");
const detailSold = document.getElementById("detailSold");
const detailColorOptions = document.getElementById("detailColorOptions");
const detailAddToCart = document.getElementById("detailAddToCart");

// filters & others
const filterButtons = document.querySelectorAll(".filter-btn");
const filterCategory = document.getElementById("filterCategory");
const filterSize = document.getElementById("filterSize");
const filterColor = document.getElementById("filterColor");
const filterPrice = document.getElementById("filterPrice");
const checkoutForm = document.getElementById("checkoutForm");
const checkoutMessage = document.getElementById("checkoutMessage");
const sendCodeBtn = document.getElementById("sendCodeBtn");
const membershipForm = document.getElementById("membershipForm");
const membershipMessage = document.getElementById("membershipMessage");
const contactForm = document.getElementById("contactForm");

/* ==== UTILS ==== */
function formatPrice(vnd) {
  return vnd.toLocaleString("vi-VN") + "đ";
}

/* ==== RENDER PRODUCTS ==== */
function createProductCard(p) {
  const card = document.createElement("div");
  card.className = "product-card";

  // Ảnh nhỏ hơn một chút (320px thay vì 380px)
  const imgDiv = document.createElement("div");
  imgDiv.className = "product-image";
  imgDiv.innerHTML = `
    <img src="${p.images[0] || 'https://via.placeholder.com/400'}" 
         alt="${p.name}" 
         style="width:100%; height:100%; object-fit:cover; border-radius:12px; transition:transform .4s;">
    <div class="product-hover-overlay">
      <div class="hover-content">
        <span>Xem chi tiết</span>
        <span class="hover-price">${formatPrice(p.price)}</span>
      </div>
    </div>
  `;
  imgDiv.addEventListener("click", () => showProductDetail(p.id));

  // Thông tin sản phẩm
  const infoDiv = document.createElement("div");
  infoDiv.className = "product-info";
  infoDiv.innerHTML = `
    <h3 class="product-name">${p.name}</h3>
    <div class="product-meta">
      ${p.gender === "female" ? "Nữ" : "Nam"} · ${p.color || "Nhiều màu"}
    </div>
    <div class="product-price-main">${formatPrice(p.price)}</div>

    <!-- CHỌN SIZE Ở DANH SÁCH (không mặc định M) -->
    <div class="product-sizes">
      <button class="size-btn" data-size="S">S</button>
      <button class="size-btn" data-size="M">M</button>
      <button class="size-btn" data-size="L">L</button>
      <button class="size-btn" data-size="XL">XL</button>
    </div>

    <button class="add-cart-btn">Thêm vào giỏ hàng</button>
  `;

  // Click tên → chi tiết
  infoDiv.querySelector(".product-name").addEventListener("click", () => showProductDetail(p.id));

  // CHỌN SIZE Ở DANH SÁCH → lưu vào card để thêm giỏ đúng size
  let selectedSize = "M"; // mặc định nhưng không hiện active
  infoDiv.querySelectorAll(".size-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      infoDiv.querySelectorAll(".size-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      selectedSize = btn.getAttribute("data-size");
    });
  });

  // Thêm vào giỏ với size đã chọn
  infoDiv.querySelector(".add-cart-btn").addEventListener("click", (e) => {
    e.stopPropagation();
    addToCartWithSize(p.id, selectedSize);
  });

  card.appendChild(imgDiv);
  card.appendChild(infoDiv);
  return card;
}

function renderProductLists() {
  womenProductsEl.innerHTML = "";
  menProductsEl.innerHTML = "";
  products.forEach(p => {
    const card = createProductCard(p);
    if (p.gender === "female") womenProductsEl.appendChild(card);
    else menProductsEl.appendChild(card);
  });
}

/* ==== FILTER (giữ nguyên) ==== */
// ... (giữ nguyên phần filter bạn đang có, không cần sửa)

/* ==== CHI TIẾT SẢN PHẨM - SHOPEE STYLE SIÊU ĐẸP ==== */
function showProductDetail(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;

  currentDetailProduct = p;

  // Thông tin cơ bản
  detailName.textContent = p.name;
  detailPrice.textContent = formatPrice(p.price);
  detailOldPrice.textContent = p.oldPrice ? formatPrice(p.oldPrice) : "";
  detailDesc.textContent = p.description;
  detailSold.textContent = Math.floor(Math.random() * 400) + 50;

  // Ảnh chính
  mainImgElement.src = p.images[0];

  // Thumbnails
  detailThumbs.innerHTML = "";
  p.images.forEach((src, i) => {
    const thumb = document.createElement("div");
    thumb.className = "detail-thumb" + (i === 0 ? " active" : "");
    thumb.innerHTML = `<img src="${src}" alt="thumb">`;
    thumb.onclick = () => {
      mainImgElement.src = src;
      document.querySelectorAll(".detail-thumb").forEach(t => t.classList.remove("active"));
      thumb.classList.add("active");
    };
    detailThumbs.appendChild(thumb);
  });

  // Chọn màu (giả lập)
  detailColorOptions.innerHTML = "";
  const colors = ["#95a5a6", "#2c3e50", "#8b4513", "#bdc3c7"];
  colors.forEach((color, i) => {
    const btn = document.createElement("div");
    btn.className = "color-btn" + (i === 0 ? " active" : "");
    btn.style.backgroundColor = color;
    if (p.images[i]) {
      btn.innerHTML = `<img src="${p.images[i]}" style="width:100%;height:100%;object-fit:cover;border-radius:50%">`;
    }
    btn.onclick = () => {
      document.querySelectorAll(".color-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      if (p.images[i]) mainImgElement.src = p.images[i];
    };
    detailColorOptions.appendChild(btn);
  });

  // CHO PHÉP BẤM CHỌN SIZE & MÀU TRONG TRANG CHI TIẾT (HOẠT ĐỘNG NGON LÀNH
document.querySelectorAll('#productDetail .size-btn').forEach(btn => {
  btn.onclick = function(e) {
    e.stopPropagation();
    // Xóa active cũ
    document.querySelectorAll('#productDetail .size-btn').forEach(b => b.classList.remove('active'));
    // Thêm active cho cái vừa bấm
    this.classList.add('active');
  };
});

document.querySelectorAll('#productDetail .color-btn').forEach(btn => {
  btn.onclick = function(e) {
    e.stopPropagation();
    document.querySelectorAll('#productDetail .color-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
  };
});

  showSection("productDetail");
}

/* ==== NÚT QUAY LẠI & THÊM GIỎ ==== */
backToListBtn.addEventListener("click", () => {
  if (currentDetailProduct) {
    showSection(currentDetailProduct.gender === "female" ? "women" : "men");
  } else {
    showSection("home");
  }
});

detailAddToCart.onclick = () => {
  const activeSizeBtn = document.querySelector('#productDetail .size-btn.active');
  if (!activeSizeBtn) {
    alert("Vui lòng chọn kích thước!");
    return;
  }
  const size = activeSizeBtn.textContent.trim();
  const qty = parseInt(qtyInput.value) || 1;

  for (let i = 0; i < qty; i++) {
    addToCartWithSize(currentDetailProduct.id, size);
  }
  
  alert(`Đã thêm ${currentDetailProduct.name} - Size ${size} ×${qty} vào giỏ hàng!`);
};

/* ==== GIỎ HÀNG (giữ nguyên) ==== */
function addToCart(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;
  const existing = cart.find(item => item.id === id);
  if (existing) existing.qty += 1;
  else cart.push({ id, qty: 1 });
  updateCartCount();
}

function updateCartCount() {
  const total = cart.reduce((sum, item) => sum + item.qty, 0);
  cartCountEl.textContent = total;
}

function renderCart() {
  if (cart.length === 0) {
    cartItemsEl.innerHTML = "<p>Giỏ hàng trống.</p>";
    cartSummaryEl.textContent = "";
    return;
  }
  cartItemsEl.innerHTML = "";
  let subtotal = 0;
  cart.forEach(item => {
    const p = products.find(x => x.id === item.id);
    if (!p) return;
    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `<span>${p.name} ×${item.qty}</span><span>${formatPrice(p.price * item.qty)}</span>`;
    cartItemsEl.appendChild(div);
    subtotal += p.price * item.qty;
  });
  cartSummaryEl.textContent = `Tổng: ${formatPrice(subtotal)}`;
}

goToCheckoutBtn.onclick = () => showSection("checkout");

/* ==== NAVIGATION & KHÁC (giữ nguyên hết) ==== */
function showSection(id) {
  sections.forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");

  navLinks.forEach(link => {
    link.classList.toggle("active", link.dataset.section === id);
  });

  if (id === "women" || id === "men") {
    filterBar.style.display = "flex";
    activeGenderFilter = id === "women" ? "female" : "male";
    applyFilters();
  } else {
    filterBar.style.display = "none";
  }

  if (id === "cart") renderCart();
}

navLinks.forEach(link => link.addEventListener("click", e => {
  e.preventDefault();
  showSection(link.dataset.section);
}));

document.getElementById("cartBtn").onclick = () => showSection("cart");

document.querySelectorAll("[data-section]").forEach(btn => {
  if (btn.tagName === "BUTTON") btn.onclick = () => showSection(btn.dataset.section);
});

/* SIDEBAR, CHAT, CHECKOUT... giữ nguyên như cũ */
menuBtn.onclick = () => sidebar.classList.add("open");
closeSidebarBtn.onclick = () => sidebar.classList.remove("open");

// ... (phần chat, checkout, membership, contact giữ nguyên như file cũ của bạn)

/* ==== INIT ==== */
renderProductLists();
updateCartCount();
showSection("home");
// SIDEBAR MỞ/ĐÓNG MƯỢT + OVERLAY ĐEN
menuBtn.onclick = () => {
  sidebar.classList.add("open");
  document.body.classList.add("sidebar-open");
};

closeSidebarBtn.onclick = () => {
  sidebar.classList.remove("open");
  document.body.classList.remove("sidebar-open");
};

// Đóng sidebar khi bấm overlay
document.body.addEventListener("click", (e) => {
  if (sidebar.classList.contains("open") && !sidebar.contains(e.target) && !menuBtn.contains(e.target)) {
    sidebar.classList.remove("open");
    document.body.classList.remove("sidebar-open");
  }
});
