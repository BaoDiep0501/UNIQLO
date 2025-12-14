/* ===== PROMO COUNTDOWN ===== */
(function(){
  function pad(n){ return String(n).padStart(2,"0"); }
  function startCountdown(){
    const el = document.getElementById("promoCountdown");
    if(!el) return;

    // demo: countdown 6 hours from open
    const start = Date.now();
    const end = start + 6*60*60*1000;

    function tick(){
      const diff = end - Date.now();
      if(diff <= 0){
        el.textContent = "00:00:00";
        return;
      }
      const h = Math.floor(diff/3600000);
      const m = Math.floor((diff%3600000)/60000);
      const s = Math.floor((diff%60000)/1000);
      el.textContent = `${pad(h)}:${pad(m)}:${pad(s)}`;
      requestAnimationFrame(()=> setTimeout(tick, 250));
    }
    tick();
  }
  document.addEventListener("DOMContentLoaded", startCountdown);
})();
