// ==========================================
// Mobi Mobile - Navigation & Layout
// Developer: Raj Gautam
// ==========================================

(function () {
  "use strict";

  const IS_IN_PAGES = window.location.pathname.includes("/pages/");
  const BASE = IS_IN_PAGES ? "../" : "./";
  const PAGE_PREFIX = IS_IN_PAGES ? "" : "pages/";

  function getMobiUser() {
    try {
      return JSON.parse(localStorage.getItem("mobi_user")) || null;
    } catch (err) {
      return null;
    }
  }

  function currentPage() {
    return window.location.pathname.split("/").pop() || "index.html";
  }

  function renderNavbar() {
    const navContainer = document.getElementById("navbar");
    if (!navContainer) return;

    const user = getMobiUser();
    const page = currentPage();

    const links = [
      { href: BASE + "index.html", label: "Home", id: "index.html" },
      { href: PAGE_PREFIX + "trails.html", label: "Trails", id: "trails.html" },
      { href: PAGE_PREFIX + "gallery.html", label: "Gallery", id: "gallery.html" },
      { href: PAGE_PREFIX + "reviews.html", label: "Reviews", id: "reviews.html" },
      { href: PAGE_PREFIX + "write-review.html", label: "Write Review", id: "write-review.html" }
    ];

    const navLinksHTML = links
      .map(function (link) {
        const active = page === link.id ? "active" : "";
        return (
          '<a href="' + link.href + '" class="nav-link ' + active + '">' +
          link.label +
          "</a>"
        );
      })
      .join("");

    const userActionHTML = user
      ? '<a href="' + PAGE_PREFIX + 'dashboard.html" class="nav-user-btn">Hi, ' +
        String(user.name || "Explorer").split(" ")[0] +
        "</a>"
      : '<a href="' + PAGE_PREFIX + 'login.html" class="nav-user-btn">Login</a>';

    navContainer.innerHTML =
      '<nav class="navbar" id="main-navbar">' +
        '<a href="' + BASE + 'index.html" class="nav-logo">' +
          '<img src="' + BASE + 'images/logo.png" alt="Mobi Mobile Logo" class="nav-logo-img">' +
          "<span>Mobi Mobile</span>" +
        "</a>" +
        '<div class="nav-links" id="nav-links">' + navLinksHTML + "</div>" +
        '<div class="nav-actions">' +
          userActionHTML +
          '<a href="' + PAGE_PREFIX + 'trails.html" class="btn-primary nav-cta">Explore Trails</a>' +
          '<button class="hamburger" id="hamburger" aria-label="Toggle navigation" aria-expanded="false">&#9776;</button>' +
        "</div>" +
      "</nav>";

    const hamburger = document.getElementById("hamburger");
    const navLinks = document.getElementById("nav-links");
    if (hamburger && navLinks) {
      hamburger.addEventListener("click", function () {
        navLinks.classList.toggle("mobile-open");
        const isOpen = navLinks.classList.contains("mobile-open");
        hamburger.setAttribute("aria-expanded", isOpen ? "true" : "false");
      });
    }

    const nav = document.getElementById("main-navbar");
    function onScroll() {
      if (!nav) return;
      if (window.scrollY > 50) {
        nav.classList.add("scrolled");
      } else {
        nav.classList.remove("scrolled");
      }
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  function renderFooter() {
    const footerContainer = document.getElementById("footer");
    if (!footerContainer) return;

    footerContainer.innerHTML =
      '<footer class="footer">' +
        '<div class="footer-grid">' +
          '<div class="footer-brand">' +
            '<img src="' + BASE + 'images/logo.png" alt="Mobi Mobile Logo" class="footer-logo">' +
            "<p>Your next adventure starts here. Discover trails, connect with guides, and explore the world.</p>" +
          "</div>" +
          '<div class="footer-links">' +
            "<h4>Explore</h4>" +
            '<a href="' + PAGE_PREFIX + 'trails.html">Trails</a>' +
            '<a href="' + PAGE_PREFIX + 'gallery.html">Gallery</a>' +
            '<a href="' + PAGE_PREFIX + 'reviews.html">Reviews</a>' +
            '<a href="' + PAGE_PREFIX + 'write-review.html">Write a Review</a>' +
          "</div>" +
          '<div class="footer-links">' +
            "<h4>Account</h4>" +
            '<a href="' + PAGE_PREFIX + 'login.html">Login</a>' +
            '<a href="' + PAGE_PREFIX + 'register.html">Register</a>' +
            '<a href="' + PAGE_PREFIX + 'dashboard.html">Dashboard</a>' +
          "</div>" +
          '<div class="footer-links">' +
            "<h4>Company</h4>" +
            '<a href="' + BASE + 'index.html">Home</a>' +
            '<a href="' + BASE + '404.html">Help</a>' +
          "</div>" +
        "</div>" +
        '<div class="footer-bottom">' +
          "<p>&copy; 2026 Mobi Mobile. All rights reserved.</p>" +
          "<p>Designed &amp; Developed by <strong>Raj Gautam</strong></p>" +
        "</div>" +
      "</footer>";
  }

  document.addEventListener("DOMContentLoaded", function () {
    renderNavbar();
    renderFooter();
  });
})();
