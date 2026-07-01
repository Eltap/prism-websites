document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector("nav");

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      nav.classList.toggle("open");
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => nav.classList.remove("open"));
    });
  }

  const revealEls = document.querySelectorAll(
    ".card, .work-card, .price-card, .section-header, .brand-panel, .about-grid > div"
  );

  if (revealEls.length) {
    revealEls.forEach((el) => el.classList.add("reveal"));

    if ("IntersectionObserver" in window) {
      const revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              revealObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15 }
      );
      revealEls.forEach((el) => revealObserver.observe(el));
    } else {
      revealEls.forEach((el) => el.classList.add("is-visible"));
    }

    // Safety net: never leave content permanently invisible if the observer
    // fails to fire for any reason.
    window.setTimeout(() => {
      revealEls.forEach((el) => el.classList.add("is-visible"));
    }, 2000);
  }

  const form = document.querySelector("#contact-form");
  const status = document.querySelector(".form-status");

  if (form && status) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const submitButton = form.querySelector("button[type='submit']");
      submitButton.disabled = true;
      status.classList.remove("success", "error");
      status.textContent = "Sending...";

      try {
        const response = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { Accept: "application/json" },
          body: new FormData(form),
        });
        const result = await response.json();

        if (result.success) {
          status.textContent = "Thanks! I'll get back to you within a day.";
          status.classList.add("success");
          form.reset();
        } else {
          status.textContent = "Something went wrong. Please try again or email me directly.";
          status.classList.add("error");
        }
      } catch (err) {
        status.textContent = "Something went wrong. Please try again or email me directly.";
        status.classList.add("error");
      } finally {
        submitButton.disabled = false;
      }
    });
  }
});
