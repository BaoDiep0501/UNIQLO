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

    // main img
    const main = $("mainImgElement");
    main.src = p.images?.[0] || "";

    // thumbs
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

    // colors (demo)
    const colorWrap = $("detailColorOptions");
    colorWrap.innerHTML = "";
    const demoColors = ["#95a5a6", "#2c3e50", "#8b4513", "#bdc3c7"];
    demoColors.forEach((c,i)=>{
      const b = document.createElement("div");
      b.className = "color-btn" + (i===0 ? " active":"");
      b.style.backgroundColor = c;
      if(p.images?.[i]) b.innerHTML = `<img src="${p.images[i]}" alt="color">`;
      b.onclick = ()=>{
        setActive("#detailColorOptions .color-btn", b);
        if(p.images?.[i]) main.src = p.images[i];
      };
      colorWrap.appendChild(b);
    });

    // size selection
    document.querySelectorAll(".size-options .size-btn").forEach(btn=>{
      btn.onclick = (e)=>{
        e.preventDefault();
        setActive(".size-options .size-btn", btn);
      };
    });

    // back
    const back = $("backToListBtn");
    back.onclick = ()=>{
      window.location.href = `products.html?gender=${encodeURIComponent(p.gender)}`;
    };

    // add to cart
    $("detailAddToCart").onclick = ()=>{
      const activeSize = document.querySelector(".size-options .size-btn.active");
      const size = activeSize ? activeSize.textContent.trim() : "M";
      const qty = Number($("qtyInput").value || 1);

      window.CartStore.add({ id: p.id, size, qty });
      alert(`Đã thêm ${p.name} - Size ${size} ×${qty} vào giỏ hàng!`);
    };

    // buy now
    const buyBtn = document.querySelector(".buy-now");
    if(buyBtn){
      buyBtn.onclick = ()=>{
        const activeSize = document.querySelector(".size-options .size-btn.active");
        const size = activeSize ? activeSize.textContent.trim() : "M";
        const qty = Number($("qtyInput").value || 1);
        window.CartStore.add({ id: p.id, size, qty });
        window.location.href = "checkout.html";
      };
    }
  }

  document.addEventListener("DOMContentLoaded", ()=>{
    initQty();
    render();
  });
})();
