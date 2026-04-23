(function ($) {
  "use strict";

  /**
   * Robust Preloader
   * - waits for window.load
   * - waits for elements with [include-html] to be populated (for items.js style injection)
   * - observes DOM mutations as fallback
   * - final safety timeout (10s)
   */
  var initPreloader = function () {
    var pre = document.querySelector(".preloader");
    if (!pre) return;

    function removePre() {
      try {
        if (!pre) return;
        if (pre.classList.contains("hidden")) return;
        pre.classList.add("hidden");
        // remove from DOM after transition completes
        setTimeout(function () {
          if (pre && pre.parentNode) pre.parentNode.removeChild(pre);
        }, 600);
      } catch (e) {
        console.warn("Error while removing preloader:", e);
      }
    }

    // Check whether include-html fragments are populated (no content = not ready)
    function includesReadyCheck() {
      var nodes = Array.prototype.slice.call(document.querySelectorAll("[include-html]"));
      if (nodes.length === 0) return true;
      return nodes.every(function (n) {
        return n.innerHTML && n.innerHTML.trim().length > 0;
      });
    }

    // 1) Hide on full load (images/fonts etc.)
    window.addEventListener("load", function () {
      removePre();
    });

    // 2) If includes are in use, wait for them to contain HTML
    if (includesReadyCheck()) {
      // If includes already present, hide shortly after DOM ready
      document.addEventListener("DOMContentLoaded", function () {
        setTimeout(removePre, 200);
      });
    } else {
      // Observe DOM changes to detect when include-html gets populated
      var observer = new MutationObserver(function (mutations, obs) {
        if (includesReadyCheck()) {
          removePre();
          obs.disconnect();
        }
      });
      observer.observe(document.documentElement, { childList: true, subtree: true, characterData: true });
      // Safety: disconnect observer after 15s
      setTimeout(function () {
        try { observer.disconnect(); } catch (e) {}
      }, 15000);
    }

    // 3) Safety fallback: if nothing else fires, hide after 10s
    setTimeout(function () {
      if (document.querySelector(".preloader")) {
        console.warn("Preloader fallback fired (10s)");
        removePre();
      }
    }, 10000);
  };

  initPreloader();

  var mobileEntryAlertDefaults = {
    enabled: true,
    title: "Mobile Notice",
    // Update this text whenever you want a different mobile popup message site-wide.
    message:
      "Welcome to Golden Support Service.\nIf you need full experience, please visit our website on a desktop or laptop computer.",
    buttonText: "Continue",
    autoHideMs: 3000,
    delayMs: 500,
  };

  function isLikelyMobileDevice() {
    var userAgent = navigator.userAgent || "";
    var userAgentDataMobile =
      navigator.userAgentData &&
      typeof navigator.userAgentData.mobile === "boolean"
        ? navigator.userAgentData.mobile
        : false;
    var hasCoarsePointer =
      window.matchMedia && window.matchMedia("(pointer: coarse)").matches;
    var isNarrowViewport =
      window.matchMedia && window.matchMedia("(max-width: 991.98px)").matches;

    return (
      userAgentDataMobile ||
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        userAgent
      ) ||
      (hasCoarsePointer && isNarrowViewport)
    );
  }

  function isHomePage() {
    var pathName = window.location.pathname || "";
    return (
      pathName === "/" ||
      /\/index\.html$/i.test(pathName) ||
      /\/GSS-Website\/?$/i.test(pathName)
    );
  }

  function createMobileEntryAlertModal(config) {
    var existingModal = document.getElementById("mobileEntryAlertModal");
    if (existingModal) return existingModal;

    var wrapper = document.createElement("div");
    wrapper.innerHTML =
      '<div class="modal fade mobile-entry-alert" id="mobileEntryAlertModal" tabindex="-1" aria-labelledby="mobileEntryAlertModalLabel" aria-hidden="true">' +
      '<div class="modal-dialog modal-dialog-centered modal-sm">' +
      '<div class="modal-content border-0 shadow">' +
      '<div class="modal-header">' +
      '<h5 class="modal-title" id="mobileEntryAlertModalLabel" data-mobile-alert-title></h5>' +
      '<button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>' +
      "</div>" +
      '<div class="modal-body">' +
      '<p class="mb-0" data-mobile-alert-message></p>' +
      "</div>" +
      '<div class="modal-footer border-0 pt-0">' +
      '<button type="button" class="btn w-100" data-bs-dismiss="modal" data-mobile-alert-button></button>' +
      "</div>" +
      "</div>" +
      "</div>" +
      "</div>";

    var modalEl = wrapper.firstElementChild;
    modalEl.querySelector("[data-mobile-alert-title]").textContent =
      config.title;
    modalEl.querySelector("[data-mobile-alert-message]").textContent =
      config.message;
    modalEl.querySelector("[data-mobile-alert-button]").textContent =
      config.buttonText;

    document.body.appendChild(modalEl);
    return modalEl;
  }

  function showMobileEntryAlert() {
    var config = Object.assign(
      {},
      mobileEntryAlertDefaults,
      window.GSS_MOBILE_ALERT || {}
    );
    if (
      !config.enabled ||
      !config.message ||
      !isLikelyMobileDevice() ||
      !isHomePage()
    ) {
      return;
    }

    if (window.bootstrap && typeof window.bootstrap.Modal === "function") {
      var modalEl = createMobileEntryAlertModal(config);
      var modalInstance = new window.bootstrap.Modal(modalEl);
      modalInstance.show();

      if (config.autoHideMs > 0) {
        window.setTimeout(function () {
          modalInstance.hide();
        }, config.autoHideMs);
      }

      return;
    }

    window.alert(config.message);
  }

  window.addEventListener("load", function () {
    setTimeout(showMobileEntryAlert, mobileEntryAlertDefaults.delayMs);
  });

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

})(jQuery);
