/* ===== CONTACT PAGE LOGIC (FIXED & OPTIMIZED) ===== */
(function ($) {
  $(function () {
    const STORAGE_KEY = "contactFormDraft";

    const $form = $("#contactForm");
    const $confirm = $("#contactConfirm");
    const $search = $("#productSearch");
    const $suggestions = $("#productSuggestions");
    const $list = $("#selectedProductsContainer");
    const $empty = $("#emptySelectedMsg");

    const products = window.PRODUCTS || [];
    let selectedItems = [];

    /* ================= STORAGE ================= */
    function saveDraft() {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          name: $("#contactName").val(),
          phone: $("#contactPhone").val(),
          email: $("#contactEmail").val(),
          note: $("#contactMessage").val(),
          items: selectedItems
        })
      );
    }

    function loadDraft() {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      try {
        const d = JSON.parse(raw);
        $("#contactName").val(d.name || "");
        $("#contactPhone").val(d.phone || "");
        $("#contactEmail").val(d.email || "");
        $("#contactMessage").val(d.note || "");
        selectedItems = d.items || [];
      } catch {}
    }

    /* ================= HELPERS ================= */
    function getImg(p, color) {
      return (
        (color && p.imagesByColor?.[color]) ||
        p.images?.[0] ||
        "https://via.placeholder.com/400"
      );
    }

    /* ================= SEARCH ================= */
    $search.on("input", function () {
      const q = $(this).val().trim().toLowerCase();
      $suggestions.empty();

      if (q.length < 2) return $suggestions.hide();

      products
        .filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q)
        )
        .forEach((p) => {
          const el = $(`
            <div class="product-suggestion-item">
              <img src="${getImg(p)}">
              <div>
                <strong>${p.name}</strong><br>
                ${p.price.toLocaleString("vi-VN")}đ
              </div>
            </div>
          `);
          el.on("click", () => addProduct(p));
          $suggestions.append(el);
        });

      $suggestions.show();
    });

    $(document).on("click", (e) => {
      if (!$(e.target).closest(".product-search-wrapper").length) {
        $suggestions.hide();
      }
    });

    /* ================= PRODUCTS ================= */
    function addProduct(product) {
      const existed = selectedItems.find(
        (it) => it.product.id === product.id
      );

      if (existed) {
        existed.qty += 1;
      } else {
        selectedItems.push({
          product,
          color: product.colorIds?.[0] || null,
          size: "M",
          qty: 1
        });
      }

      render();
      saveDraft();
      $search.val("");
      $suggestions.hide();
    }

    function render() {
      $list.empty();

      if (!selectedItems.length) {
        $empty.show();
        return;
      }
      $empty.hide();

      selectedItems.forEach((it, i) => {
        const p = it.product;

        const colors = (p.colorIds || [])
          .map(
            (c) =>
              `<option value="${c}" ${
                it.color === c ? "selected" : ""
              }>${window.COLOR_MAP?.[c]?.name || c}</option>`
          )
          .join("");

        const row = $(`
          <div class="selected-product-item">
            <img src="${getImg(p, it.color)}">
            <div style="flex:1">
              <strong>${p.name}</strong><br>
              ${p.price.toLocaleString("vi-VN")}đ
            </div>

            <div class="selected-product-controls">
              <select class="color">${colors}</select>
              <select class="size">
                <option ${it.size === "S" ? "selected" : ""}>S</option>
                <option ${it.size === "M" ? "selected" : ""}>M</option>
                <option ${it.size === "L" ? "selected" : ""}>L</option>
                <option ${it.size === "XL" ? "selected" : ""}>XL</option>
              </select>
              <input class="qty" type="number" min="1" value="${it.qty}">
              <button class="remove-item">Xóa</button>
            </div>
          </div>
        `);

        row.find(".color").on("change", (e) => {
          it.color = e.target.value || null;
          render();
          saveDraft();
        });

        row.find(".size").on("change", (e) => {
          it.size = e.target.value;
          saveDraft();
        });

        row.find(".qty").on("change", (e) => {
          it.qty = Math.max(1, +e.target.value || 1);
          saveDraft();
        });

        row.find(".remove-item").on("click", () => {
          selectedItems.splice(i, 1);
          render();
          saveDraft();
        });

        $list.append(row);
      });
    }

    /* ================= FORM ================= */
    $("#contactName, #contactPhone, #contactEmail, #contactMessage").on(
      "input",
      saveDraft
    );

    $form.on("submit", function (e) {
      e.preventDefault();

      if (!selectedItems.length) {
        alert("Vui lòng chọn ít nhất 1 sản phẩm");
        return;
      }

      selectedItems.forEach(({ product, size, color, qty }) => {
        window.CartStore.add({
          id: product.id,
          size,
          color,
          qty
        });
      });

      localStorage.setItem(
        "uniqloCustomerInfo",
        JSON.stringify({
          name: $("#contactName").val(),
          phone: $("#contactPhone").val(),
          email: $("#contactEmail").val(),
          note: $("#contactMessage").val(),
          time: new Date().toISOString()
        })
      );

      localStorage.removeItem(STORAGE_KEY);

      $confirm.fadeIn(300);
      setTimeout(() => {
        window.location.href = "checkout.html";
      }, 1000);
    });

    /* ================= INIT ================= */
    loadDraft();
    render();
  });
})(jQuery);
