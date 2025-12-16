/* ===== PRODUCT DETAIL ===== */
(function(){
  const products = window.PRODUCTS || [];

  function $(id){ return document.getElementById(id); }
  function getId(){
    const url = new URL(window.location.href);
    return Number(url.searchParams.get("id") || 0);
  }

  function setActive(listSelector, el){
    document.querySelectorAll(listSelector).forEach(x=>x.classList.remove("active"));
    el.classList.add("active");
  }

  function initQty(){
    const minus = $("qtyMinus");
    const plus = $("qtyPlus");
    const input = $("qtyInput");
    if(!minus || !plus || !input) return;

    minus.onclick = ()=>{
      const v = Math.max(1, Number(input.value||1) - 1);
      input.value = v;
    };
    plus.onclick = ()=>{
      const v = Math.min(99, Number(input.value||1) + 1);
      input.value = v;
    };
  }

  function render(){
    let selectedColorId = null;
    const id = getId();
    const p = products.find(x=>x.id === id);
    if(!p){
      $("detailName").textContent = "Không tìm thấy sản phẩm";
      return;
    }
    
    $("detailName").textContent = p.name;
    $("detailPrice").textContent = formatPrice(p.price);
    $("detailOldPrice").textContent = p.oldPrice ? formatPrice(p.oldPrice) : "";
    $("detailDesc").textContent = p.description || "—";
    $("detailSold").textContent = Math.floor(Math.random()*400)+50;

    /* ===== MAIN IMAGE ===== */
    const main = $("mainImgElement");

    const colorIds = Array.isArray(p.colorIds) ? p.colorIds : [];
    const imagesByColor = p.imagesByColor || {};

    // ảnh mặc định theo màu đầu tiên
    if (colorIds[0] && imagesByColor[colorIds[0]]) {
      main.src = imagesByColor[colorIds[0]];
    } else {
      main.src = p.images?.[0] || "";
    }

    /* ===== THUMBS (giữ nguyên, không ảnh hưởng màu) ===== */
    const thumbs = $("detailThumbs");
    thumbs.innerHTML = "";
    (p.images || []).forEach((src, i)=>{
      const div = document.createElement("div");
      div.className = "detail-thumb" + (i===0 ? " active":"");
      div.innerHTML = `<img src="${src}" alt="thumb">`;
      div.onclick = ()=>{
        main.src = src;
        setActive(".detail-thumb", div);
      };
      thumbs.appendChild(div);
    });

    /* ===== COLORS (SOLID DOT + CLICK ĐỔI ẢNH) ===== */
    const colorWrap = $("detailColorOptions");
    colorWrap.innerHTML = "";

    const COLOR_MAP = window.COLOR_MAP || {};
    const fallbackIds = ["xam","den","nau","trang"];
    const idsToUse = colorIds.length ? colorIds : fallbackIds;

    idsToUse.forEach((id, i) => {
      const c = COLOR_MAP[id];
      if (!c) return;
      if (i === 0) selectedColorId = id;

      const b = document.createElement("div");
      b.className = "color-btn" + (i === 0 ? " active" : "");
      b.style.backgroundColor = c.hex;  
      b.title = c.name;

      b.onclick = () => {
        selectedColorId = id;      
        setActive("#detailColorOptions .color-btn", b);

        // ✅ đổi ảnh theo màu
        if (imagesByColor[id]) {
          main.src = imagesByColor[id];
        }
      };

      colorWrap.appendChild(b);
    });

    /* ===== SIZE ===== */
    document.querySelectorAll(".size-options .size-btn").forEach(btn=>{
      btn.onclick = (e)=>{
        e.preventDefault();
        setActive(".size-options .size-btn", btn);
      };
    });

    /* ===== BACK ===== */
    const back = $("backToListBtn");
    back.onclick = ()=>{
      sessionStorage.setItem("fromProductDetail", "1");
      window.location.href = `products.html?gender=${encodeURIComponent(p.gender)}`;
    };

    /* ===== ADD TO CART ===== */
   $("detailAddToCart").onclick = ()=>{
      const activeSize = document.querySelector(".size-options .size-btn.active");
      const size = activeSize ? activeSize.textContent.trim() : "M";
      const qty = Number($("qtyInput").value || 1);
      window.CartStore.add({
        id: p.id,
        size,
        color: selectedColorId,
        qty
      });
      const colorName = window.COLOR_MAP?.[selectedColorId]?.name || "—";

      alert(`Đã thêm ${p.name} - Size ${size} · Màu ${colorName} · SL ${qty} vào giỏ hàng!`);
    };


    /* ===== BUY NOW ===== */
    const buyBtn = document.querySelector(".buy-now");
    if(buyBtn){
      buyBtn.onclick = ()=>{
        const activeSize = document.querySelector(".size-options .size-btn.active");
        const size = activeSize ? activeSize.textContent.trim() : "M";
        const qty = Number($("qtyInput").value || 1);

        window.CartStore.add({
          id: p.id,
          size,
          color: selectedColorId,
          qty
        });
        window.location.href = "checkout.html";
      };
    }
  }

  document.addEventListener("DOMContentLoaded", ()=>{
    initQty();
    render();
  });
})();
