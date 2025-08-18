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

  // Initiate the wowjs 
 new WOW().init();



  // Sticky Navbar
  $(window).scroll(function () {
    if ($(this).scrollTop() > 200) {
      $('.sticky-top').addClass('shadow-sm').css('top', '0px');
    } else {
      $('.sticky-top').removeClass('shadow-sm').css('top', '-100px');
    }
  });



  document.addEventListener('DOMContentLoaded', function () {
    const containers = document.querySelectorAll('.form-container');

    fetch('form.html')
      .then(response => response.text())
      .then(html => {
        containers.forEach(container => {
          const temp = document.createElement('div');
          temp.innerHTML = html;
          container.appendChild(temp.firstElementChild);
        });
      })
      .catch(error => {
        console.error('Error loading form:', error);
      });
  });



})(jQuery);



