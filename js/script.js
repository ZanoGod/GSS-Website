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


  //scroll-animation

  document.addEventListener('DOMContentLoaded', () => {
    // Select all elements you want to animate
    const animatedElements = document.querySelectorAll('.scroll-animate');

    // The Intersection Observer API is a modern browser feature that
    // allows us to efficiently watch for when elements enter the viewport.
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // If the element is intersecting (i.e., is in view)
        if (entry.isIntersecting) {
          // Add the 'is-visible' class to trigger the animation
          entry.target.classList.add('is-visible');

          // Optional: Stop observing the element after it has become visible
          // This ensures the animation only happens once.
          observer.unobserve(entry.target);
        }
      });
    }, {
      // This option adjusts the "trigger point". 
      // 0.1 means the animation will start when 10% of the element is visible.
      threshold: 0.1
    });

    // Loop through all the selected elements and start observing them
    animatedElements.forEach(element => {
      observer.observe(element);
    });
  });





  //form load
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
      autoplayTimeout: 1000,
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