/* HERO.JS — Infinite LOOP + Vertical Scroll */
$(document).ready(function () {
  const slider = $('#hero-slider');
  const slides = $('.hero-slide');
  const slideCount = slides.length;
  const slideHeight = $(window).height();

  // Clone tạo loop vô tận
  const firstClone = slides.first().clone();
  const lastClone = slides.last().clone();

  slider.append(firstClone);
  slider.prepend(lastClone);

  let index = 1;
  slider.scrollTop(slideHeight * index);

  let isDragging = false;
  let startY = 0;
  let scrollStart = 0;

  // Drag start
  slider.on('mousedown touchstart', function (e) {
    isDragging = true;
    startY = e.pageY || e.originalEvent.touches[0].pageY;
    scrollStart = slider.scrollTop();
    slider.css('scroll-behavior', 'auto');
  });

  // Drag move
  slider.on('mousemove touchmove', function (e) {
    if (!isDragging) return;
    const y = e.pageY || e.originalEvent.touches[0].pageY;
    const walk = (startY - y);
    slider.scrollTop(scrollStart + walk);
  });

  // Drag end
  slider.on('mouseup touchend', function () {
    isDragging = false;
    slider.css('scroll-behavior', 'smooth');

    const currentScroll = slider.scrollTop();
    index = Math.round(currentScroll / slideHeight);

    snap();
  });

  // Auto slide
  setInterval(() => {
    index++;
    snap();
  }, 4000);

  function snap() {
    slider.scrollTop(slideHeight * index);

    setTimeout(() => {
      if (index === slideCount + 1) {
        slider.css('scroll-behavior', 'auto');
        index = 1;
        slider.scrollTop(slideHeight * index);
        slider.css('scroll-behavior', 'smooth');
      }
      if (index === 0) {
        slider.css('scroll-behavior', 'auto');
        index = slideCount;
        slider.scrollTop(slideHeight * index);
        slider.css('scroll-behavior', 'smooth');
      }
    }, 1000);
  }

  // Update khi viewport thay đổi
  $(window).resize(function () {
    const newHeight = $(window).height();
    slider.css('scroll-behavior', 'auto');
    slider.scrollTop(newHeight * index);
  });
});
