// ==========================================
// Mobi Mobile - Interactive Features
// Developer: Raj Gautam
// ==========================================

(function () {
  "use strict";

  function initCounters() {
    const counters = document.querySelectorAll(".counter");
    if (!counters.length) return;

    const observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        const el = entry.target;
        const target = parseFloat(el.getAttribute("data-target"));
        const suffix = el.getAttribute("data-suffix") || "";
        const duration = 2000;
        const start = performance.now();
        const isDecimal = target % 1 !== 0;

        function update(now) {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const value = target * eased;
          el.textContent =
            (isDecimal ? value.toFixed(1) : Math.floor(value)) + suffix;
          if (progress < 1) requestAnimationFrame(update);
        }

        requestAnimationFrame(update);
        obs.unobserve(el);
      });
    }, { threshold: 0.5 });

    counters.forEach(function (counter) {
      observer.observe(counter);
    });
  }

  function initTrailSearch() {
    const searchInput = document.getElementById("trail-search");
    const trailCards = document.querySelectorAll(".trail-card");
    const noResults = document.getElementById("no-results");

    if (!searchInput || !trailCards.length) return;

    searchInput.addEventListener("input", function (e) {
      const query = e.target.value.toLowerCase().trim();
      let visible = 0;

      trailCards.forEach(function (card) {
        const name = (card.getAttribute("data-name") || "").toLowerCase();
        const difficulty = (card.getAttribute("data-difficulty") || "").toLowerCase();
        const match = name.includes(query) || difficulty.includes(query);
        card.style.display = match ? "" : "none";
        if (match) visible++;
      });

      if (noResults) {
        noResults.style.display = visible === 0 ? "block" : "none";
      }
    });
  }

  function initReviews() {
    const reviewForm = document.getElementById("review-form");
    const reviewsContainer = document.getElementById("reviews-container");

    if (reviewForm) {
      reviewForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const name = document.getElementById("review-name").value.trim();
        const rating = parseInt(document.getElementById("review-rating").value, 10);
        const comment = document.getElementById("review-comment").value.trim();

        if (!name || !comment) {
          alert("Please add your name and a review.");
          return;
        }

        const newReview = {
          id: "r_" + Date.now(),
          name: name,
          rating: rating,
          comment: comment,
          date: new Date().toLocaleDateString()
        };

        const existing = JSON.parse(localStorage.getItem("mobi_reviews") || "[]");
        existing.push(newReview);
        localStorage.setItem("mobi_reviews", JSON.stringify(existing));

        window.location.href = "reviews.html";
      });
    }

    if (reviewsContainer) {
      const reviews = JSON.parse(localStorage.getItem("mobi_reviews") || "[]");

      if (!reviews.length) {
        reviewsContainer.innerHTML =
          '<p class="empty-reviews">No reviews yet. Be the first to write one!</p>';
        return;
      }

      reviewsContainer.innerHTML = reviews
        .slice()
        .reverse()
        .map(function (r) {
          const rating = Math.max(0, Math.min(5, parseInt(r.rating, 10) || 0));
          return (
            '<div class="review-card">' +
              '<div class="review-header">' +
                "<h4>" + escapeHTML(r.name) + "</h4>" +
                '<span class="review-stars">' +
                  "\u2605".repeat(rating) +
                  "\u2606".repeat(5 - rating) +
                "</span>" +
              "</div>" +
              '<p class="review-text">&ldquo;' + escapeHTML(r.comment) + "&rdquo;</p>" +
              '<small class="review-date">' + escapeHTML(r.date) + "</small>" +
            "</div>"
          );
        })
        .join("");
    }
  }

  function escapeHTML(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function initScrollReveal() {
    const reveals = document.querySelectorAll(".reveal");
    if (!reveals.length) return;

    if (!("IntersectionObserver" in window)) {
      reveals.forEach(function (el) {
        el.classList.add("active");
      });
      return;
    }

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    reveals.forEach(function (el) {
      observer.observe(el);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initCounters();
    initTrailSearch();
    initReviews();
    initScrollReveal();
  });
})();
