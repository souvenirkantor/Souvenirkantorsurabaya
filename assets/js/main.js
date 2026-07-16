/**
* Template Name: Creativo
* Template URL: https://bootstrapmade.com/creativo-bootstrap-creative-agency-template/
* Updated: Mar 23 2026 with Bootstrap v5.3.8
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/

(function () {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }
  if (mobileNavToggleBtn) {
    mobileNavToggleBtn.addEventListener('click', mobileNavToogle);
  }

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active') && !navmenu.classList.contains('toggle-dropdown')) {
        mobileNavToogle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function (e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * WhatsApp floating button
   */
  function createWhatsAppFloat() {
    if (document.querySelector('.whatsapp-float')) return;

    const waLink = document.createElement('a');
    waLink.href = 'https://wa.me/6288989643555?text=Halo%20CorporateGifts%20ID,%20saya%20ingin%20bertanya%20tentang%20souvenir%20kantor.';
    waLink.target = '_blank';
    waLink.rel = 'noreferrer noopener';
    waLink.className = 'whatsapp-float d-flex align-items-center justify-content-center';
    waLink.setAttribute('aria-label', 'Chat WhatsApp');
    waLink.innerHTML = '<i class="bi bi-whatsapp"></i>';

    document.body.appendChild(waLink);
  }

  window.addEventListener('load', createWhatsAppFloat);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Initiate Pure Counter
   */
  new PureCounter();

  /**
   * Init isotope layout and filters
   */
  document.querySelectorAll('.isotope-layout').forEach(function (isotopeItem) {
    let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
    let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
    let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

    let initIsotope;
    imagesLoaded(isotopeItem.querySelector('.isotope-container'), function () {
      initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
        itemSelector: '.isotope-item',
        layoutMode: layout,
        filter: filter,
        sortBy: sort
      });
    });

    isotopeItem.querySelectorAll('.isotope-filters li').forEach(function (filters) {
      filters.addEventListener('click', function () {
        isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
        this.classList.add('filter-active');
        initIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        if (typeof aosInit === 'function') {
          aosInit();
        }
      }, false);
    });

  });

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function (swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  /**
   * Contact form WhatsApp redirect
   */
  document.querySelectorAll('.whatsapp-form').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();

      const name = form.querySelector('input[name="name"]').value.trim();
      const email = form.querySelector('input[name="email"]').value.trim();
      const subjectField = form.querySelector('input[name="subject"]');
      const subject = subjectField ? subjectField.value.trim() : 'Permintaan Layanan Souvenir';
      const message = form.querySelector('textarea[name="message"]').value.trim();

      const text = `Halo CorporateGifts ID, saya ingin bertanya tentang souvenir kantor.` +
        `%0A%0ANama: ${encodeURIComponent(name)}` +
        `%0AEmail: ${encodeURIComponent(email)}` +
        `%0ASubjek: ${encodeURIComponent(subject)}` +
        `%0APesan: ${encodeURIComponent(message)}`;

      window.location.href = `https://wa.me/6288989643555?text=${text}`;
    });
  });

  /**
   * Frequently Asked Questions Toggle
   */
  document.querySelectorAll('.faq-item h3, .faq-item .faq-toggle, .faq-item .faq-header').forEach((faqItem) => {
    faqItem.addEventListener('click', () => {
      faqItem.parentNode.classList.toggle('faq-active');
    });
  });

  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  window.addEventListener('load', function (e) {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });

  /**
   * Navmenu Scrollspy and active page logic
   */
  let navmenulinks = document.querySelectorAll('.navmenu a');

  function clearNavmenuActive() {
    document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
    document.querySelectorAll('.navmenu li.active').forEach(item => item.classList.remove('active'));
  }

  function activateDropdownAncestors(navmenulink) {
    const dropdown = navmenulink.closest('.dropdown');
    if (!dropdown) return;
    dropdown.classList.add('active');
    const dropdownToggle = dropdown.querySelector('a[href="#"]');
    if (dropdownToggle) dropdownToggle.classList.add('active');
  }

  function setNavmenuActiveByPage() {
    clearNavmenuActive();
    const currentUrl = new URL(window.location.href);
    navmenulinks.forEach(navmenulink => {
      const href = navmenulink.getAttribute('href');
      if (!href || href === '#') return;

      let linkUrl;
      try {
        linkUrl = new URL(href, window.location.href);
      } catch (e) {
        return;
      }

      if (linkUrl.pathname === currentUrl.pathname) {
        if (linkUrl.hash && linkUrl.hash !== currentUrl.hash) return;
        navmenulink.classList.add('active');
        activateDropdownAncestors(navmenulink);
      }
    });
  }

  function navmenuScrollspy() {
    let sectionActive = false;

    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      const section = document.querySelector(navmenulink.hash);
      if (!section) return;
      const position = window.scrollY + 200;

      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        clearNavmenuActive();
        navmenulink.classList.add('active');
        activateDropdownAncestors(navmenulink);
        sectionActive = true;
      } else {
        navmenulink.classList.remove('active');
      }
    });

    if (!sectionActive) {
      setNavmenuActiveByPage();
    }
  }

  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);

})();