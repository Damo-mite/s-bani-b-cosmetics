function initNav() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("site-nav");
  if (!toggle || !nav) return;

  function setOpen(open) {
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  }

  toggle.addEventListener("click", () => {
    setOpen(!nav.classList.contains("is-open"));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setOpen(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setOpen(false);
  });
}

function currentCategory() {
  const value = new URLSearchParams(location.search).get("category");
  return value === "raw" || value === "infused" ? value : "all";
}

function initStore() {
  const grid = document.getElementById("store-grid");
  if (!grid) return;

  const buttons = document.querySelectorAll("[data-filter]");

  function apply(category, updateUrl) {
    const products =
      category === "all" ? PRODUCTS : PRODUCTS.filter((product) => product.category === category);
    renderProductGrid(grid, products);
    buttons.forEach((button) => {
      button.classList.toggle("is-active", button.dataset.filter === category);
    });
    if (updateUrl) {
      const url = category === "all" ? "store.html" : "store.html?category=" + category;
      history.replaceState(null, "", url);
    }
  }

  buttons.forEach((button) => {
    button.addEventListener("click", () => apply(button.dataset.filter, true));
  });

  apply(currentCategory(), false);
}

function initHome() {
  const grid = document.getElementById("home-grid");
  if (grid) renderProductGrid(grid, PRODUCTS);
}

function initContact() {
  const form = document.getElementById("contact-form");
  const thanks = document.getElementById("contact-thanks");
  if (!form || !thanks) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = new FormData(form).get("name");
    thanks.hidden = false;
    thanks.textContent =
      "Thank you, " +
      name +
      ". This prototype does not send email. Your message stayed on this page so the form can be tested.";
    form.reset();
    thanks.focus();
  });
}

function initPayment() {
  const note = document.getElementById("payment-note");
  document.querySelectorAll("[data-pay]").forEach((button) => {
    button.addEventListener("click", () => {
      if (!note) return;
      const label = button.dataset.pay === "paypal" ? "PayPal" : "Payfast";
      note.hidden = false;
      note.textContent =
        label + " is not connected yet. This is a prototype, and no payment has been taken.";
      note.focus();
    });
  });
}

function initCartActions() {
  document.addEventListener("click", (event) => {
    const addButton = event.target.closest("[data-add]");
    if (addButton) {
      addToCart(addButton.dataset.add);
      addButton.classList.add("is-added");
      addButton.textContent = "Added";
      window.setTimeout(() => {
        addButton.classList.remove("is-added");
        addButton.textContent = "Add to cart";
      }, 1200);
      return;
    }

    const qtyButton = event.target.closest("[data-delta]");
    if (qtyButton) {
      const id = qtyButton.dataset.id;
      const cart = getCart();
      const next = (Number(cart[id]) || 0) + Number(qtyButton.dataset.delta);
      setQty(id, next);
      renderCart();
      return;
    }

    const removeButton = event.target.closest("[data-remove]");
    if (removeButton) {
      setQty(removeButton.dataset.remove, 0);
      renderCart();
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  updateCartBadge();
  initNav();
  initHome();
  initStore();
  renderCart();
  renderCheckout();
  initContact();
  initPayment();
  initCartActions();
});
