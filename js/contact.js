/* ===== CONTACT FORM ===== */
(function(){
  document.addEventListener("DOMContentLoaded", ()=>{
    const form = document.getElementById("contactForm");
    const confirm = document.getElementById("contactConfirm");
    if(!form || !confirm) return;

    form.addEventListener("submit",(e)=>{
      e.preventDefault();
      confirm.style.display = "block";
      setTimeout(()=> confirm.style.display = "none", 3500);
      form.reset();
    });
  });
})();
