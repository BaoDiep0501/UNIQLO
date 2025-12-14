/* ===== PRODUCTS PAGE ===== */
(function(){
  const products = window.PRODUCTS || [];
  const grid = document.getElementById("productsGrid");
  const genderSelect = document.getElementById("genderSelect");

  const filterCategory = document.getElementById("filterCategory");
  const filterSize = document.getElementById("filterSize");
  const filterColor = document.getElementById("filterColor");
  const filterPrice = document.getElementById("filterPrice");
  const clearFilters = document.getElementById("clearFilters");

  function getQueryParam(name){
    const url = new URL(window.location.href);
    return url.searchParams.get(name) || "";
  }

  function createCard(p){
    const card = document.createElement("div");
    card.className = "product-card";

    const imgDiv = document.createElement("div");
    imgDiv.className = "product-image";
    imgDiv.innerHTML = `
      <img src="${p.images?.[0] || 'https://via.placeholder.com/400'}"
           alt="${p.name}"
           style="width:100%; height:100%; object-fit:cover; border-radius:12px; transition:transform .4s;">
      <div class="product-hover-overlay">
        <div class="hover-content">
          <span>Xem chi tiết</span>
          <span class="hover-price">${formatPrice(p.price)}</span>
        </div>
      </div>
    `;
    imgDiv.addEventListener("click", ()=>{
      window.location.href = "product-detail.html?id=" + encodeURIComponent(p.id);
    });

    const info = document.createElement("div");
    info.className = "product-info";
    info.innerHTML = `
      <h3 class="product-name">${p.name}</h3>
      <div class="product-meta">${p.gender === "female" ? "Nữ" : "Nam"} · ${p.color || "Nhiều màu"}</div>
      <div class="product-price-main">${formatPrice(p.price)}</div>

      <div class="product-sizes">
        <button class="size-btn" data-size="S">S</button>
        <button class="size-btn" data-size="M">M</button>
        <button class="size-btn" data-size="L">L</button>
        <button class="size-btn" data-size="XL">XL</button>
      </div>

      <button class="add-cart-btn">Thêm vào giỏ hàng</button>
    `;

    info.querySelector(".product-name").addEventListener("click", ()=>{
      window.location.href = "product-detail.html?id=" + encodeURIComponent(p.id);
    });

    let selectedSize = "M"; // default internal
    info.querySelectorAll(".size-btn").forEach(btn=>{
      btn.addEventListener("click",(e)=>{
        e.stopPropagation();
        info.querySelectorAll(".size-btn").forEach(b=>b.classList.remove("active"));
        btn.classList.add("active");
        selectedSize = btn.dataset.size;
      });
    });

    info.querySelector(".add-cart-btn").addEventListener("click",(e)=>{
      e.stopPropagation();
      window.CartStore.add({ id: p.id, size: selectedSize, qty: 1 });
      alert(`Đã thêm "${p.name}" - Size ${selectedSize} vào giỏ hàng!`);
    });

    card.appendChild(imgDiv);
    card.appendChild(info);
    return card;
  }

  function matchPrice(p, priceKey){
    if(priceKey === "all") return true;
    if(priceKey === "1") return p.price < 500000;
    if(priceKey === "2") return p.price >= 500000 && p.price <= 1000000;
    if(priceKey === "3") return p.price > 1000000;
    return true;
  }

  function apply(){
    const gender = genderSelect.value; // all / female / male
    const cat = filterCategory.value;
    const size = filterSize.value;
    const color = filterColor.value;
    const price = filterPrice.value;
    const q = (getQueryParam("q") || "").toLowerCase();

    const list = products.filter(p=>{
      if(gender !== "all" && p.gender !== gender) return false;
      if(cat !== "all" && p.category !== cat) return false;
      if(!matchPrice(p, price)) return false;
      if(q && !p.name.toLowerCase().includes(q)) return false;

      // size + color: demo data chưa có đầy đủ -> cho pass nếu không có field
      if(size !== "all" && p.sizes && !p.sizes.includes(size)) return false;
      if(color !== "all" && p.color && p.color !== color) return false;
      return true;
    });

    grid.innerHTML = "";
    if(list.length === 0){
      grid.innerHTML = `<p>Không có sản phẩm phù hợp.</p>`;
      return;
    }
    list.forEach(p=> grid.appendChild(createCard(p)));
  }

  function resetFilters(){
    filterCategory.value = "all";
    filterSize.value = "all";
    filterColor.value = "all";
    filterPrice.value = "all";
    apply();
  }

  document.addEventListener("DOMContentLoaded", ()=>{
    // show filter bar on this page
    const filterBar = document.querySelector(".filter-bar");
    if(filterBar) filterBar.style.display = "flex";

    // init dropdown by url param gender if any
    const g = getQueryParam("gender");
    if(g && ["female","male","all"].includes(g)) genderSelect.value = g;

    // if coming from home buttons via hash (optional)
    apply();

    [genderSelect, filterCategory, filterSize, filterColor, filterPrice].forEach(el=>{
      el.addEventListener("change", apply);
    });
    clearFilters?.addEventListener("click", resetFilters);
  });
})();
