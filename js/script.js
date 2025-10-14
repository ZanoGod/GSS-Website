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
  //  Custom Scroll Animation Logic (One-Way Animation)
  // =====================================================


  // ====================================================================
//  Modern, Smooth Scroll Animation using Intersection Observer
// ====================================================================

document.addEventListener("DOMContentLoaded", function() {

  // Select all elements you want to animate
  const elementsToAnimate = document.querySelectorAll('.scroll-animate');

  // Set up the observer options
  const observerOptions = {
    root: null, // observes intersections relative to the viewport
    rootMargin: '0px',
    threshold: 0.1 // Triggers when 10% of the element is visible
  };

  // Create the observer
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      // If the element is intersecting (visible)
      if (entry.isIntersecting) {
        // Add the 'is-visible' class to trigger the animation
        entry.target.classList.add('is-visible');
        
        // Stop observing the element so the animation only happens once
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Attach the observer to each element
  elementsToAnimate.forEach(element => {
    observer.observe(element);
  });

});

  // function revealOnScroll() {
  //   const elementsToAnimate = document.querySelectorAll('.scroll-animate');

  //   for (let i = 0; i < elementsToAnimate.length; i++) {
  //     const element = elementsToAnimate[i];

  //     // --- CHANGE #1: If the element is already visible, skip it ---
  //     // This prevents the code from re-checking elements that have already been animated.
  //     if (element.classList.contains('is-visible')) {
  //       continue;
  //     }

  //     const elementRect = element.getBoundingClientRect();
  //     const windowHeight = window.innerHeight;
  //     const triggerOffset = 100; // Animation triggers when element is 100px into the viewport

  //     // --- CHANGE #2: Simplified condition & no 'else' block ---
  //     // This checks if the top of the element has entered the viewport from the bottom.
  //     // Because there's no 'else', the class is never removed.
  //     if (elementRect.top < windowHeight - triggerOffset) {
  //       element.classList.add('is-visible');
  //     }
  //   }
  // }

  // // Keep these event listeners as they are
  // window.addEventListener('scroll', revealOnScroll);
  // revealOnScroll(); // Run once on load


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

  // Back to top button
  // Show button when scrolling down
  window.onscroll = function () {
    let btn = document.getElementById("backToTopBtn");
    if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
      btn.style.display = "block";
    } else {
      btn.style.display = "none";
    }
  };

  // Scroll to top smoothly
  document.getElementById("backToTopBtn").addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });




})(jQuery);