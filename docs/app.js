/* ==== HERO SLIDER (dựa trên hero.js, dùng jQuery) ==== */
$(document).ready(function () {
  const $slider = $('#hero-slider');
  const $slides = $('.hero-slide');
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

  $slider.on('mousedown touchstart', function (e) {
    isDragging = true;
    startY = e.pageY || e.originalEvent.touches[0].pageY;
    scrollStart = $slider.scrollTop();
    $slider.css('scroll-behavior', 'auto');
  });

  $slider.on('mousemove touchmove', function (e) {
    if (!isDragging) return;
    const y = e.pageY || e.originalEvent.touches[0].pageY;
    const walk = (startY - y);
    $slider.scrollTop(scrollStart + walk);
  });

  $slider.on('mouseup touchend mouseleave', function () {
    if (!isDragging) return;
    isDragging = false;
    $slider.css('scroll-behavior', 'smooth');

    const currentScroll = $slider.scrollTop();
    index = Math.round(currentScroll / slideHeight);
    snap();
  });

  // Auto slide
  setInterval(() => {
    index++;
    snap();
  }, 4000);

  function snap() {
    $slider.scrollTop(slideHeight * index);

    setTimeout(() => {
      if (index === slideCount + 1) {
        $slider.css('scroll-behavior', 'auto');
        index = 1;
        $slider.scrollTop(slideHeight * index);
        $slider.css('scroll-behavior', 'smooth');
      }
      if (index === 0) {
        $slider.css('scroll-behavior', 'auto');
        index = slideCount;
        $slider.scrollTop(slideHeight * index);
        $slider.css('scroll-behavior', 'smooth');
      }
    }, 600);
  }

  $(window).resize(function () {
    slideHeight = $(window).height();
    $slider.css('scroll-behavior', 'auto');
    $slider.scrollTop(slideHeight * index);
    $slider.css('scroll-behavior', 'smooth');
  });
});

/* ==== MOCK DATA SẢN PHẨM ==== */
const products = [
  // female
  {
    id: 1,
    name: "Áo khoác dạ nữ dài",
    gender: "female",
    category: "outer",
    size: "M",
    color: "black",
    price: 1299000,
    images: ["Look 1", "Look 1B", "Look 1C"],
    description: "Áo khoác dạ phom rộng, chất liệu ấm, phù hợp đi làm và đi chơi."
  },
  {
    id: 2,
    name: "Áo len cardigan nữ",
    gender: "female",
    category: "top",
    size: "S",
    color: "beige",
    price: 699000,
    images: ["Cardigan", "Cardigan 2"],
    description: "Cardigan len mỏng, tông màu trung tính dễ phối đồ."
  },
  {
    id: 3,
    name: "Quần jean ống suông nữ",
    gender: "female",
    category: "bottom",
    size: "M",
    color: "blue",
    price: 799000,
    images: ["Wide Jeans"],
    description: "Quần jean ống suông tôn dáng, chất liệu denim mềm."
  },
  {
    id: 4,
    name: "Áo sơ mi nữ oversized",
    gender: "female",
    category: "top",
    size: "L",
    color: "white",
    price: 499000,
    images: ["Overshirt"],
    description: "Áo sơ mi cotton oversized, phong cách basic."
  },

  // male
  {
    id: 5,
    name: "Áo bomber nam",
    gender: "male",
    category: "outer",
    size: "L",
    color: "brown",
    price: 1199000,
    images: ["Bomber", "Bomber 2"],
    description: "Áo khoác bomber dáng rộng, phù hợp thời tiết se lạnh."
  },
  {
    id: 6,
    name: "Sơ mi nam cổ đứng",
    gender: "male",
    category: "top",
    size: "M",
    color: "white",
    price: 599000,
    images: ["Shirt"],
    description: "Áo sơ mi cổ đứng, dễ kết hợp với quần tây hoặc jean."
  },
  {
    id: 7,
    name: "Quần tây nam slim fit",
    gender: "male",
    category: "bottom",
    size: "L",
    color: "black",
    price: 799000,
    images: ["Trousers"],
    description: "Quần tây co giãn, phù hợp môi trường công sở."
  },
  {
    id: 8,
    name: "Áo thun nam cổ tròn",
    gender: "male",
    category: "top",
    size: "M",
    color: "black",
    price: 299000,
    images: ["T-shirt"],
    description: "Áo thun cotton 100%, mềm và thoáng mát."
  }
];

/* ==== STATE ==== */
let cart = [];
let currentDetailProduct = null;
let activeGenderFilter = "all";

/* ==== DOM SHORTCUTS ==== */
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
const filterBar = document.querySelector(".filter-bar"); // thanh filter

// detail
const backToListBtn = document.getElementById("backToListBtn");
const detailMainImg = document.getElementById("detailMainImg");
const detailThumbs = document.getElementById("detailThumbs");
const detailName = document.getElementById("detailName");
const detailPrice = document.getElementById("detailPrice");
const detailDesc = document.getElementById("detailDesc");
const detailColor = document.getElementById("detailColor");
const detailSize = document.getElementById("detailSize");
const detailGender = document.getElementById("detailGender");
const detailAddToCart = document.getElementById("detailAddToCart");

// filters
const filterButtons = document.querySelectorAll(".filter-btn");
const filterCategory = document.getElementById("filterCategory");
const filterSize = document.getElementById("filterSize");
const filterColor = document.getElementById("filterColor");
const filterPrice = document.getElementById("filterPrice");

// chat
const chatToggleBtn = document.getElementById("chatToggleBtn");
const closeChatBtn = document.getElementById("closeChatBtn");
const chatBox = document.getElementById("chatBox");
const chatBody = document.getElementById("chatBody");
const chatInput = document.getElementById("chatInput");
const chatSendBtn = document.getElementById("chatSendBtn");

// checkout + membership
const checkoutForm = document.getElementById("checkoutForm");
const checkoutMessage = document.getElementById("checkoutMessage");
const sendCodeBtn = document.getElementById("sendCodeBtn");
const membershipForm = document.getElementById("membershipForm");
const membershipMessage = document.getElementById("membershipMessage");

/* ==== RENDER PRODUCTS ==== */
function formatPrice(vnd) {
  return vnd.toLocaleString("vi-VN") + "đ";
}

function createProductCard(p) {
  const card = document.createElement("div");
  card.className = "product-card";

  const imgDiv = document.createElement("div");
  imgDiv.className = "product-image";
  imgDiv.innerHTML = `
    <div class="img-placeholder">${p.images[0]}</div>
    <div class="product-hover">
      <span>Xem thêm hình ảnh</span>
      <span class="hover-arrow">➜</span>
    </div>
  `;
  imgDiv.addEventListener("click", () => showProductDetail(p.id));

  const infoDiv = document.createElement("div");
  infoDiv.className = "product-info";
  infoDiv.innerHTML = `
    <div class="product-name">${p.name}</div>
    <div class="product-meta">
      ${p.gender === "female" ? "Nữ" : "Nam"} · Size ${p.size}
    </div>
    <div class="product-price-row">
      <span class="product-price">${formatPrice(p.price)}</span>
    </div>
  `;

  const addBtn = document.createElement("button");
  addBtn.className = "add-cart-btn";
  addBtn.textContent = "Thêm vào giỏ hàng";
  addBtn.addEventListener("click", () => addToCart(p.id));
  infoDiv.querySelector(".product-price-row").appendChild(addBtn);

  infoDiv.querySelector(".product-name").addEventListener("click", () =>
    showProductDetail(p.id)
  );

  card.appendChild(imgDiv);
  card.appendChild(infoDiv);
  return card;
}

function renderProductLists() {
  womenProductsEl.innerHTML = "";
  menProductsEl.innerHTML = "";

  products.forEach((p) => {
    const card = createProductCard(p);
    if (p.gender === "female") {
      womenProductsEl.appendChild(card);
    } else {
      menProductsEl.appendChild(card);
    }
  });
}

/* ==== NAVIGATION ==== */
function showSection(id) {
  // Ẩn / hiện các section
  sections.forEach((s) => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");

  // Active menu
  navLinks.forEach((link) => {
    const sec = link.getAttribute("data-section");
    link.classList.toggle("active", sec === id);
  });

  // Chỉ hiện filter bar ở trang list sản phẩm
  if (id === "women" || id === "men") {
    filterBar.style.display = "flex";
  } else {
    filterBar.style.display = "none";
  }

  // Cập nhật giỏ hàng khi vào trang cart
  if (id === "cart") {
    renderCart();
  }
}

navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const sec = link.getAttribute("data-section");
    if (sec) showSection(sec);
  });
});

document.getElementById("cartBtn").addEventListener("click", () => {
  showSection("cart");
});

document.querySelectorAll("[data-section]").forEach((btn) => {
  if (btn.tagName === "BUTTON") {
    btn.addEventListener("click", () => {
      const sec = btn.getAttribute("data-section");
      if (sec) showSection(sec);
    });
  }
});

/* ==== SIDEBAR ==== */
menuBtn.addEventListener("click", () => sidebar.classList.add("open"));
closeSidebarBtn.addEventListener("click", () =>
  sidebar.classList.remove("open")
);

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const gender = btn.getAttribute("data-gender");
    const category = btn.getAttribute("data-category");
    const size = btn.getAttribute("data-size");

    if (gender) activeGenderFilter = gender;
    if (category) filterCategory.value = category;
    if (size) filterSize.value = size;

    applyFilters();
  });
});

[filterCategory, filterSize, filterColor, filterPrice].forEach((sel) => {
  sel.addEventListener("change", applyFilters);
});

searchInput.addEventListener("input", applyFilters);

function applyFilters() {
  const cat = filterCategory.value;
  const size = filterSize.value;
  const color = filterColor.value;
  const priceRange = filterPrice.value;
  const searchText = searchInput.value.trim().toLowerCase();

  function matchPrice(p) {
    if (priceRange === "1") return p.price < 500000;
    if (priceRange === "2") return p.price >= 500000 && p.price <= 1000000;
    if (priceRange === "3") return p.price > 1000000;
    return true;
  }

  womenProductsEl.innerHTML = "";
  menProductsEl.innerHTML = "";

  products.forEach((p) => {
    let ok = true;

    if (activeGenderFilter !== "all" && p.gender !== activeGenderFilter)
      ok = false;
    if (cat !== "all" && p.category !== cat) ok = false;
    if (size !== "all" && p.size !== size) ok = false;
    if (color !== "all" && p.color !== color) ok = false;
    if (!matchPrice(p)) ok = false;

    if (searchText && !p.name.toLowerCase().includes(searchText)) ok = false;

    if (!ok) return;

    const card = createProductCard(p);
    if (p.gender === "female") womenProductsEl.appendChild(card);
    else menProductsEl.appendChild(card);
  });
}

/* ==== PRODUCT DETAIL ==== */
function showProductDetail(id) {
  const p = products.find((x) => x.id === id);
  if (!p) return;
  currentDetailProduct = p;

  detailName.textContent = p.name;
  detailPrice.textContent = formatPrice(p.price);
  detailDesc.textContent = p.description;
  detailColor.textContent = p.color;
  detailSize.textContent = p.size;
  detailGender.textContent = p.gender === "female" ? "Nữ" : "Nam";

  detailMainImg.textContent = p.images[0];
  detailThumbs.innerHTML = "";
  p.images.forEach((label) => {
    const div = document.createElement("div");
    div.className = "detail-thumb";
    div.textContent = label;
    div.addEventListener("click", () => {
      detailMainImg.textContent = label;
    });
    detailThumbs.appendChild(div);
  });

  showSection("productDetail");
}

backToListBtn.addEventListener("click", () => {
  if (currentDetailProduct) {
    showSection(currentDetailProduct.gender === "female" ? "women" : "men");
  } else {
    showSection("home");
  }
});

detailAddToCart.addEventListener("click", () => {
  if (currentDetailProduct) {
    addToCart(currentDetailProduct.id);
  }
});

/* ==== CART ==== */
function addToCart(id) {
  const p = products.find((x) => x.id === id);
  if (!p) return;
  const existing = cart.find((item) => item.id === id);
  if (existing) existing.qty += 1;
  else cart.push({ id: p.id, qty: 1 });
  updateCartCount();
}

function updateCartCount() {
  const total = cart.reduce((sum, item) => sum + item.qty, 0);
  cartCountEl.textContent = total;
}

function renderCart() {
  if (cart.length === 0) {
    cartItemsEl.innerHTML = "<p>Giỏ hàng đang trống.</p>";
    cartSummaryEl.textContent = "";
    return;
  }

  cartItemsEl.innerHTML = "";
  let subtotal = 0;

  cart.forEach((item) => {
    const p = products.find((x) => x.id === item.id);
    if (!p) return;
    const li = document.createElement("div");
    li.className = "cart-item";
    li.innerHTML = `
      <span>${p.name} (x${item.qty})</span>
      <span>${formatPrice(p.price * item.qty)}</span>
    `;
    cartItemsEl.appendChild(li);
    subtotal += p.price * item.qty;
  });

  cartSummaryEl.textContent = `Tổng tiền tạm tính: ${formatPrice(subtotal)}`;
}

goToCheckoutBtn.addEventListener("click", () => {
  showSection("checkout");
});

/* ==== CHAT BOX ==== */
chatToggleBtn.addEventListener("click", () => {
  chatBox.classList.toggle("open");
});

closeChatBtn.addEventListener("click", () => {
  chatBox.classList.remove("open");
});

function addChatMessage(text, sender = "bot") {
  const div = document.createElement("div");
  div.className = `chat-message ${sender}`;
  div.textContent = text;
  chatBody.appendChild(div);
  chatBody.scrollTop = chatBody.scrollHeight;
}

chatSendBtn.addEventListener("click", sendChat);
chatInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    sendChat();
  }
});

function sendChat() {
  const text = chatInput.value.trim();
  if (!text) return;
  addChatMessage(text, "user");
  chatInput.value = "";

  setTimeout(() => {
    let reply =
      "Cảm ơn bạn. Hiện tại đây chỉ là chat demo nên mình không truy cập được đơn hàng thật.";
    const lower = text.toLowerCase();
    if (lower.includes("ship")) {
      reply = "UNIQLO demo hỗ trợ giao hàng trong 3–5 ngày làm việc.";
    } else if (lower.includes("size")) {
      reply = "Bạn có thể chọn size theo chiều cao/cân nặng ở phần mô tả sản phẩm.";
    }
    addChatMessage(reply, "bot");
  }, 400);
}

/* ==== CHECKOUT / MEMBERSHIP ==== */
sendCodeBtn.addEventListener("click", () => {
  checkoutMessage.textContent =
    "Đã gửi mã xác thực (giả lập) tới email / số điện thoại của bạn.";
});

checkoutForm.addEventListener("submit", (e) => {
  e.preventDefault();
  checkoutMessage.textContent =
    "Thanh toán thành công (giả lập). Cảm ơn bạn đã mua hàng tại UNIQLO demo!";
  cart = [];
  updateCartCount();
});

membershipForm.addEventListener("submit", (e) => {
  e.preventDefault();
  membershipMessage.textContent =
    "Đăng ký membership thành công! Bạn sẽ nhận email kích hoạt trong giây lát (giả lập).";
});

/* ==== INIT ==== */
renderProductLists();
updateCartCount();
// đảm bảo khi load lần đầu đang ở Trang chủ và ẩn filter
showSection("home");
