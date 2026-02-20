document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const header = document.querySelector(".site-header");
  const navToggle = document.querySelector(".nav-toggle");
  const mainNav = document.querySelector(".main-nav");
  const themeToggle = document.querySelector(".theme-toggle");
  const themeIcon = document.querySelector(".theme-icon");
  const contactForm = document.getElementById("contact-form");
  const formStatus = document.querySelector(".form-status");
  const currentYearEl = document.getElementById("current-year");

  /* ===== Helper Functions ===== */
  const setThemeIcon = (theme) => {
    if (!themeIcon) return;
    themeIcon.textContent = theme === "dark" ? "☀️" : "🌙";
  };

  const applyTheme = (theme) => {
    body.setAttribute("data-theme", theme);
    localStorage.setItem("preferred-theme", theme);
    setThemeIcon(theme);
  };

  /* ===== Initialize Theme from Local Storage ===== */
  const savedTheme = localStorage.getItem("preferred-theme");
  if (savedTheme === "dark" || savedTheme === "light") {
    applyTheme(savedTheme);
  } else {
    // Use system preference as a starting point
    const prefersDark = window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    applyTheme(prefersDark ? "dark" : "light");
  }

  /* ===== Theme Toggle ===== */
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const currentTheme = body.getAttribute("data-theme") || "light";
      const nextTheme = currentTheme === "light" ? "dark" : "light";
      applyTheme(nextTheme);
    });
  }

  /* ===== Mobile Nav Toggle ===== */
  if (navToggle && header && mainNav) {
    navToggle.addEventListener("click", () => {
      const isOpen = header.classList.toggle("nav-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    // Close nav when a link is clicked (mobile)
    mainNav.addEventListener("click", (e) => {
      if (e.target.tagName.toLowerCase() === "a" && header.classList.contains("nav-open")) {
        header.classList.remove("nav-open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ===== Smooth Scroll (for older browsers) ===== */
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const targetId = link.getAttribute("href").substring(1);
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  /* ===== Contact Form Validation ===== */
  const showError = (field, message) => {
    const group = field.closest(".form-group");
    const errorEl = document.querySelector(
      `.error-message[data-error-for="${field.id}"]`
    );
    if (group) {
      group.classList.add("invalid");
    }
    if (errorEl) {
      errorEl.textContent = message || "";
    }
  };

  const clearError = (field) => {
    const group = field.closest(".form-group");
    const errorEl = document.querySelector(
      `.error-message[data-error-for="${field.id}"]`
    );
    if (group) {
      group.classList.remove("invalid");
    }
    if (errorEl) {
      errorEl.textContent = "";
    }
  };

  const isEmailValid = (value) => {
    // Basic email pattern
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(value);
  };

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const nameField = contactForm.querySelector("#name");
      const emailField = contactForm.querySelector("#email");
      const messageField = contactForm.querySelector("#message");

      let isValid = true;

      // Name validation
      if (!nameField.value.trim()) {
        showError(nameField, "Please enter your name.");
        isValid = false;
      } else {
        clearError(nameField);
      }

      // Email validation
      if (!emailField.value.trim()) {
        showError(emailField, "Please enter your email.");
        isValid = false;
      } else if (!isEmailValid(emailField.value.trim())) {
        showError(emailField, "Please enter a valid email address.");
        isValid = false;
      } else {
        clearError(emailField);
      }

      // Message validation
      if (!messageField.value.trim()) {
        showError(messageField, "Please enter a message.");
        isValid = false;
      } else if (messageField.value.trim().length < 10) {
        showError(messageField, "Your message should be at least 10 characters.");
        isValid = false;
      } else {
        clearError(messageField);
      }

      if (!formStatus) return;

      if (isValid) {
        formStatus.textContent = "Thank you! Your message has been sent successfully. I'll get back to you soon.";
        formStatus.classList.remove("error");
        formStatus.classList.add("success");

        // Clear the form after a short delay
        setTimeout(() => {
          contactForm.reset();
        }, 2000);
      } else {
        formStatus.textContent = "Please fix the errors above and try again.";
        formStatus.classList.remove("success");
        formStatus.classList.add("error");
      }
    });

    // Clear errors on input
    ["input", "blur", "keyup"].forEach((eventName) => {
      contactForm.addEventListener(eventName, (e) => {
        if (!(e.target instanceof HTMLElement)) return;
        const field = e.target;
        if (field.matches("#name, #email, #message")) {
          clearError(field);
        }
      });
    });
  }

  /* ===== Current Year in Footer ===== */
  if (currentYearEl) {
    currentYearEl.textContent = new Date().getFullYear();
  }
});

