$(document).ready(function () {
  const $slider = $("#hero-slider");
  const $slides = $(".hero-slide");
  const slideCount = $slides.length;
  if (!slideCount) return;

  let slideHeight = $(window).height();
  let index = 0;
  let isScrolling = false;

  function goToSlide(i) {
    index = Math.max(0, Math.min(i, slideCount - 1));
    isScrolling = true;
    $slider.scrollTop(index * slideHeight);

    setTimeout(() => {
      isScrolling = false;
    }, 600);
  }

  // wheel = đổi banner
  $slider.on("wheel", function (e) {
    e.preventDefault();
    if (isScrolling) return;

    if (e.originalEvent.deltaY > 0) {
      goToSlide(index + 1);
    } else {
      goToSlide(index - 1);
    }
  });
});
