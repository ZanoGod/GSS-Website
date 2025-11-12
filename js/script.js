(function ($) {
  "use strict";

  // Preloader logic
  var initPreloader = function () {
    $(document).ready(function () {
      $(".preloader").fadeOut(500);
      $("body").removeClass("preloader-site");
    });
  };

  initPreloader();

  // Sticky Navbar and Back to Top button visibility
  $(window).on("scroll", function () {
    if ($(this).scrollTop() > 200) {
      $(".sticky-top").addClass("shadow-sm").css("top", "0px");
    } else {
      $(".sticky-top").removeClass("shadow-sm").css("top", "-100px");
    }

    const btn = $("#backToTopBtn");
    if ($(this).scrollTop() > 300) {
      btn.show();
    } else {
      btn.hide();
    }
  });

  // Scroll animations, form load, hamburger toggle on DOMContentLoaded
  document.addEventListener("DOMContentLoaded", () => {
    // Scroll animation with Intersection Observer
    const animatedElements = document.querySelectorAll(".scroll-animate");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    animatedElements.forEach((el) => observer.observe(el));

    // Load form.html into all .form-container elements
    const containers = document.querySelectorAll(".form-container");
    fetch("form.html")
      .then((response) => response.text())
      .then((html) => {
        containers.forEach((container) => {
          const temp = document.createElement("div");
          temp.innerHTML = html;
          container.appendChild(temp.firstElementChild);
        });
      })
      .catch((error) => {
        console.error("Error loading form:", error);
      });

    // Hamburger menu toggle
    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".nav-links");
    if (hamburger && navLinks) {
      hamburger.addEventListener("click", () => {
        hamburger.classList.toggle("active");
        navLinks.classList.toggle("active");
      });
    }

    // Back to top button smooth scroll
    const backToTopBtn = document.getElementById("backToTopBtn");
    if (backToTopBtn) {
      backToTopBtn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }
  });

  // Owl Carousel for Car Categories
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
        '<i class="fas fa-chevron-right"></i>',
      ],
      responsiveClass: true,
      responsive: {
        0: { items: 1 },
        576: { items: 1 },
        768: { items: 1 },
        992: { items: 2 },
        1200: { items: 3 },
      },
    });
  });

  // Hide the overlay after 10 seconds (for testing)
  setTimeout(() => {
    document.getElementById("maintenance-overlay").style.display = "none";
  }, 500);

})(jQuery);
