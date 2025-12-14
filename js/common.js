/* ===== COMMON (dùng cho mọi trang) ===== */
(function(){
  // helpers
  window.formatPrice = function(vnd){
    try { return Number(vnd).toLocaleString("vi-VN") + "đ"; }
    catch { return vnd + "đ"; }
  };

  // cart in localStorage (persist between pages)
  const CART_KEY = "UNIQLO_DEMO_CART_V1";

  function loadCart(){
    try { return JSON.parse(localStorage.getItem(CART_KEY) || "[]"); }
    catch { return []; }
  }
  function saveCart(cart){
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }

  window.CartStore = {
    get(){ return loadCart(); },
    set(cart){ saveCart(cart); window.CartStore.updateBadge(); },
    clear(){ saveCart([]); window.CartStore.updateBadge(); },
    add(item){ // item: {id, qty, size}
      const cart = loadCart();
      const found = cart.find(x => x.id === item.id && x.size === item.size);
      if(found) found.qty += item.qty || 1;
      else cart.push({ id: item.id, size: item.size || "M", qty: item.qty || 1 });
      saveCart(cart);
      window.CartStore.updateBadge();
    },
    remove(index){
      const cart = loadCart();
      cart.splice(index,1);
      saveCart(cart);
      window.CartStore.updateBadge();
    },
    updateBadge(){
      const el = document.getElementById("cartCount");
      if(!el) return;
      const cart = loadCart();
      const total = cart.reduce((s,x)=>s + (x.qty||0), 0);
      el.textContent = total;
    }
  };

  // set active nav based on body data-page
  function setActiveNav(){
    const page = document.body.getAttribute("data-page");
    document.querySelectorAll(".main-nav .nav-link").forEach(a=>{
      a.classList.toggle("active", a.dataset.page === page);
    });
  }

  // header cart click
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
