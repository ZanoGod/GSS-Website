(function ($) {
  "use strict";

  var initPreloader = function () {
    $(document).ready(function () {
      // Hide preloader as soon as the DOM is ready
      // $('.preloader').fadeOut(); // Fades out the preloader immediately
      $('.preloader').fadeOut(500);

      $('body').removeClass('preloader-site'); // Removes preloader-related class
    });
  }

  // Preloader logic
  initPreloader();


  // Sticky Navbar
  $(window).scroll(function () {
    if ($(this).scrollTop() > 200) {
      $('.sticky-top').addClass('shadow-sm').css('top', '0px');
    } else {
      $('.sticky-top').removeClass('shadow-sm').css('top', '-100px');
    }
  });


  // =====================================================
  //  Custom Scroll Animation Logic (Updated)
  // =====================================================

  // This function checks if an element is in the viewport
  function revealOnScroll() {
    // Select all elements that we want to animate
    const elementsToAnimate = document.querySelectorAll('.scroll-animate');

    // Loop through each element
    for (let i = 0; i < elementsToAnimate.length; i++) {
      const element = elementsToAnimate[i];

      // Get the position and dimensions of the element on the screen
      const elementRect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // This is the offset. The animation will trigger when the element
      // is 100 pixels into the viewport from the bottom or top.
      const triggerOffset = 100;

      // NEW CONDITION: Check if the element is within the visible part of the window
      // It's "visible" if its top is above the bottom of the screen AND its bottom is below the top of the screen.
      if (elementRect.top < windowHeight - triggerOffset && elementRect.bottom > triggerOffset) {
        // If element is visible, add the class to trigger the animation
        element.classList.add('is-visible');
      } else {
        // If element is NOT visible, remove the class to reset the animation
        element.classList.remove('is-visible');
      }
    }
  }

  // Add an event listener to run the function every time the user scrolls
  window.addEventListener('scroll', revealOnScroll);

  // Run the function once on page load to check for elements already in view
  revealOnScroll();


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


  

  // Car Categories
$(document).ready(function () {
 $(".categories-carousel").owlCarousel({
    autoplay: true,
    smartSpeed: 1000,
    dots: false,
    loop: true,
    margin: 25,
    nav: true,
    navText: [
      '<i class="fas fa-chevron-left"></i>',
      '<i class="fas fa-chevron-right"></i>'
    ],
    responsiveClass: true,
    responsive: {
      0: {
        items: 1
      },
      576: {
        items: 1
      },
      768: {
        items: 1
      },
      992: {
        items: 2
      },
      1200: {
        items: 3
      }
    }
  });
});

 



})(jQuery);