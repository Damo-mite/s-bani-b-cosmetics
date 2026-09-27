const CART_KEY = "sbanib-cart";

function getCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return {};
    }
    return parsed;
  } catch {
    return {};
  }
}

function cartCount(cart = getCart()) {
  return Object.values(cart).reduce((sum, qty) => sum + (Number(qty) || 0), 0);
}

function cartLines(cart = getCart()) {
  return Object.entries(cart)
    .map(([id, qty]) => {
      const product = getProduct(id);
      const quantity = Number(qty);
      if (!product || quantity < 1) return null;
      return {
        product,
        qty: quantity,
        lineTotal: product.price * quantity,
      };
    })
    .filter(Boolean);
}

function cartSubtotal(cart = getCart()) {
  return cartLines(cart).reduce((sum, line) => sum + line.lineTotal, 0);
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
}

function updateCartBadge() {
  const count = cartCount();
  document.querySelectorAll("[data-cart-count]").forEach((el) => {
    el.textContent = String(count);
  });
}

function addToCart(id, qty = 1) {
  const product = getProduct(id);
  if (!product) return;
  const cart = getCart();
  cart[id] = (Number(cart[id]) || 0) + qty;
  saveCart(cart);
  announce(product.name + ", " + product.sizeMl + "ml added to cart");
}

function setQty(id, qty) {
  const cart = getCart();
  if (qty < 1) delete cart[id];
  else cart[id] = qty;
  saveCart(cart);
}

function announce(message) {
  let el = document.getElementById("cart-status");
  if (!el) {
    el = document.createElement("div");
    el.id = "cart-status";
    el.className = "sr-only";
    el.setAttribute("aria-live", "polite");
    document.body.appendChild(el);
  }
  el.textContent = "";
  el.textContent = message;
}

function productCardHtml(product) {
  return `
    <article class="product-card">
      <div class="product-media">
        <img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.alt)}">
      </div>
      <div class="product-body">
        <p class="product-meta">${escapeHtml(product.categoryLabel)} · ${product.sizeMl}ml</p>
        <h3>${escapeHtml(product.name)}</h3>
        <p class="product-summary">${escapeHtml(product.summary)}</p>
        <p class="price">${formatMoney(product.price)}</p>
        <button type="button" class="btn" data-add="${escapeHtml(product.id)}">Add to cart</button>
      </div>
    </article>
  `;
}

function renderProductGrid(container, products) {
  if (!container) return;
  container.innerHTML = products.map(productCardHtml).join("");
}

function renderCart() {
  const root = document.getElementById("cart-root");
  if (!root) return;

  const lines = cartLines();
  if (lines.length === 0) {
    root.innerHTML = `
      <div class="empty-state">
        <h2>Your cart is empty</h2>
        <p>The raw and infused tubs are waiting in the shop.</p>
        <a class="btn" href="store.html">Shop the collection</a>
      </div>
    `;
    return;
  }

  const rows = lines
    .map((line) => {
      const { product, qty, lineTotal } = line;
      return `
        <article class="cart-line">
          <img src="${escapeHtml(product.image)}" alt="">
          <div>
            <h2>${escapeHtml(product.name)}</h2>
            <p class="product-meta">${escapeHtml(product.categoryLabel)} · ${product.sizeMl}ml</p>
            <div class="qty">
              <button type="button" data-delta="-1" data-id="${escapeHtml(product.id)}" aria-label="Decrease quantity of ${escapeHtml(product.name)} ${product.sizeMl}ml">−</button>
              <span aria-label="Quantity">${qty}</span>
              <button type="button" data-delta="1" data-id="${escapeHtml(product.id)}" aria-label="Increase quantity of ${escapeHtml(product.name)} ${product.sizeMl}ml">+</button>
            </div>
            <button type="button" class="text-btn" data-remove="${escapeHtml(product.id)}">Remove</button>
          </div>
          <p class="line-total">${formatMoney(lineTotal)}</p>
        </article>
      `;
    })
    .join("");

  root.innerHTML = `
    <div class="cart-layout">
      <div class="cart-lines">${rows}</div>
      <aside class="summary">
        <h2>Summary</h2>
        <p class="summary-row"><span>Subtotal</span><strong>${formatMoney(cartSubtotal())}</strong></p>
        <p class="summary-row muted"><span>Shipping</span><span>Calculated later</span></p>
        <a class="btn" href="checkout.html">Continue to payment</a>
        <a class="text-link" href="store.html">Continue shopping</a>
      </aside>
    </div>
  `;
}

function renderCheckout() {
  const summary = document.getElementById("checkout-summary");
  const actions = document.getElementById("pay-actions");
  if (!summary) return;

  const lines = cartLines();
  if (lines.length === 0) {
    summary.innerHTML = `
      <div class="empty-state">
        <h2>Your cart is empty</h2>
        <p>Add a tub before choosing a payment option.</p>
        <a class="btn" href="store.html">Shop the collection</a>
      </div>
    `;
    if (actions) actions.hidden = true;
    return;
  }

  if (actions) actions.hidden = false;

  const rows = lines
    .map(
      (line) => `
        <p class="summary-row">
          <span>${escapeHtml(line.product.name)} · ${line.product.sizeMl}ml × ${line.qty}</span>
          <span>${formatMoney(line.lineTotal)}</span>
        </p>
      `
    )
    .join("");

  summary.innerHTML = `
    <div class="summary checkout-summary">
      <h2>Order summary</h2>
      ${rows}
      <p class="summary-row"><span>Subtotal</span><strong>${formatMoney(cartSubtotal())}</strong></p>
      <p class="summary-row muted"><span>Shipping</span><span>Calculated later</span></p>
    </div>
  `;
}
