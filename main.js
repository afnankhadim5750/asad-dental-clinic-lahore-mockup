/* Asad Dental — mobile menu, tabs, lightbox, scroll-spy, booking helper. Vanilla JS. */
(function () {
  "use strict";

  /* ---------- Mobile menu ---------- */
  var toggle = document.querySelector("[data-menu-toggle]");
  var menu = document.querySelector("[data-mobile-menu]");
  if (toggle && menu) {
    var setOpen = function (open) {
      menu.hidden = !open;
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    };
    toggle.addEventListener("click", function () {
      setOpen(menu.hidden);
    });
    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { setOpen(false); });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !menu.hidden) setOpen(false);
    });
  }

  /* ---------- Tabs ---------- */
  var tabs = Array.prototype.slice.call(document.querySelectorAll(".tab"));
  var panels = Array.prototype.slice.call(document.querySelectorAll(".tab-panel"));
  function activateTab(tab, focus) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.classList.toggle("active", on);
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
    });
    panels.forEach(function (p) {
      var on = p.id === tab.getAttribute("data-tab");
      p.classList.toggle("active", on);
      p.hidden = !on;
    });
    if (focus) tab.focus();
  }
  tabs.forEach(function (tab, i) {
    tab.addEventListener("click", function () { activateTab(tab, false); });
    tab.addEventListener("keydown", function (e) {
      var next = null;
      if (e.key === "ArrowRight") next = tabs[(i + 1) % tabs.length];
      if (e.key === "ArrowLeft") next = tabs[(i - 1 + tabs.length) % tabs.length];
      if (next) { e.preventDefault(); activateTab(next, true); }
    });
  });

  /* ---------- Lightbox ---------- */
  var items = Array.prototype.slice.call(document.querySelectorAll(".gallery-item"));
  var box = document.getElementById("lightbox");
  var img = box ? box.querySelector(".lightbox-img") : null;
  var current = 0;
  function show(i) {
    current = (i + items.length) % items.length;
    img.src = items[current].getAttribute("data-full");
    img.alt = items[current].getAttribute("data-alt") || "";
  }
  function openBox(i) {
    show(i);
    box.hidden = false;
    document.body.style.overflow = "hidden";
    box.querySelector(".lightbox-close").focus();
  }
  function closeBox() {
    box.hidden = true;
    document.body.style.overflow = "";
    if (items[current]) items[current].focus();
  }
  if (box) {
    items.forEach(function (item, i) {
      item.addEventListener("click", function () { openBox(i); });
    });
    box.querySelector(".lightbox-close").addEventListener("click", closeBox);
    box.querySelector(".lightbox-prev").addEventListener("click", function () { show(current - 1); });
    box.querySelector(".lightbox-next").addEventListener("click", function () { show(current + 1); });
    box.addEventListener("click", function (e) { if (e.target === box) closeBox(); });
    document.addEventListener("keydown", function (e) {
      if (box.hidden) return;
      if (e.key === "Escape") closeBox();
      if (e.key === "ArrowRight") show(current + 1);
      if (e.key === "ArrowLeft") show(current - 1);
    });
  }

  /* ---------- Scroll-spy ---------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".site-nav a"));
  var sections = navLinks
    .map(function (a) { return document.querySelector(a.getAttribute("href")); })
    .filter(Boolean);
  if ("IntersectionObserver" in window && sections.length) {
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (a) {
          a.classList.toggle("active", a.getAttribute("href") === "#" + entry.target.id);
        });
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    sections.forEach(function (s) { obs.observe(s); });
  }

  /* (No scroll-reveal: sections are visible by default so the page never
     renders blank if observers or transitions are frozen.) */

  /* ---------- Booking helper ---------- */
  var form = document.getElementById("book-form");
  var summary = document.getElementById("call-summary");
  var summaryText = document.getElementById("call-summary-text");
  if (form && summary) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = document.getElementById("book-name").value.trim();
      var phone = document.getElementById("book-phone").value.trim();
      var treatment = document.getElementById("book-treatment").value;
      var day = document.getElementById("book-day").value;
      if (!name || !phone) {
        summaryText.textContent = "Please add your name and phone number first — the clinic will ask for both when you call.";
        summary.hidden = false;
        summary.scrollIntoView({ behavior: "smooth", block: "nearest" });
        return;
      }
      var emergency = treatment.indexOf("Emergency") === 0;
      summaryText.textContent = "“Hello, my name is " + name + ". I would like to book " +
        (emergency ? "an emergency visit — I am in pain now" : "an appointment for " + treatment.toLowerCase()) +
        " (" + day.toLowerCase() + "). My number is " + phone + ".” " +
        "Call 0335 1480480 and say exactly that — the clinic confirms every appointment on the phone.";
      summary.hidden = false;
      summary.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  }
})();
