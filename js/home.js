/* ===== HOME HERO SLIDER (jQuery) ===== */
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

  setInterval(() => { index++; snap(); }, 4000);

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
