(function ($) {
   "use strict";

  var initPreloader = function () {
    $(document).ready(function () {
      // Hide preloader as soon as the DOM is ready
     // $('.preloader').fadeOut(); // Fades out the preloader immediately
      $('.preloader').fadeOut(500); // The preloader will fade out over 500ms

      $('body').removeClass('preloader-site'); // Removes preloader-related class
    });
  }

  // Preloader logic
  initPreloader();

  // Animate on Scroll (assuming you have AOS.js initialized)
  AOS.init({
    duration: 1000,
    once: true,
  });

})(jQuery);
