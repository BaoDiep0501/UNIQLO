/* ===== COMMON (dùng cho mọi trang) ===== */
(function(){
  // helpers
  window.formatPrice = function(vnd){
    try { return Number(vnd).toLocaleString("vi-VN") + "đ"; }
    catch { return vnd + "đ"; }
  };

  /* ================= CART STORE ================= */
  const CART_KEY = "UNIQLO_DEMO_CART_V1";

  function loadCart(){
    try { return JSON.parse(localStorage.getItem(CART_KEY) || "[]"); }
    catch { return []; }
  }

  function saveCart(cart){
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }

  window.CartStore = {
  key: "UNIQLO_CART",

  get() {
    return JSON.parse(localStorage.getItem(this.key) || "[]");
  },

  save(cart) {
    localStorage.setItem(this.key, JSON.stringify(cart));
    this.updateBadge();
  },

  add(item) {
    const cart = this.get();

    const found = cart.find(
      x =>
        x.id === item.id &&
        x.size === item.size &&
        x.color === item.color
    );

    if (found) {
      found.qty += item.qty || 1;
    } else {
      cart.push({
        id: item.id,
        size: item.size,
        color: item.color,
        qty: item.qty || 1
      });
    }

    this.save(cart);
  },

  remove(index) {
    const cart = this.get();
    cart.splice(index, 1);
    this.save(cart);
  },

  updateBadge() {
    const el = document.getElementById("cartCount");
    if (!el) return;
    const total = this.get().reduce((s, i) => s + i.qty, 0);
    el.textContent = total;
  }
};


  /* ================= NAV ================= */
  function setActiveNav(){
    const page = document.body.getAttribute("data-page");
    document.querySelectorAll(".main-nav .nav-link").forEach(a=>{
      a.classList.toggle("active", a.dataset.page === page);
    });
  }

  function setupCartBtn(){
    const cartBtn = document.getElementById("cartBtn");
    if(cartBtn){
      cartBtn.addEventListener("click", ()=>{
        window.location.href = "checkout.html";
      });
    }
  }

  document.addEventListener("DOMContentLoaded", ()=>{
    setActiveNav();
    setupCartBtn();
    window.CartStore.updateBadge();
  });
})();
