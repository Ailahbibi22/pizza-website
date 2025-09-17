// --- CART STORAGE ---
let cart = JSON.parse(localStorage.getItem("cart") || '[]');

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// --- HAMBURGER TOGGLE ---
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
if (hamburger && navLinks) {
  hamburger.addEventListener("click", () => {
    navLinks.classList.toggle('active');
  });
}

// --- CART DISPLAY (Home Page) ---
function updateCartDisplay() {
  const cartItemsDiv = document.getElementById('cartItems');
  const cartCount = document.getElementById('cart-count');
  const cartTotal = document.getElementById('cartTotal');
  if (!cartItemsDiv || !cartCount || !cartTotal) return;

  cartCount.textContent = cart.reduce((sum, item) => sum + item.qty, 0);

  if (cart.length === 0) {
    cartItemsDiv.innerHTML = '<div class="empty-cart">Cart is empty</div>';
    cartTotal.textContent = 'Total: $0.00';
    return;
  }

  cartItemsDiv.innerHTML = '';
  let total = 0;
  cart.forEach((item, idx) => {
    total += item.price * item.qty;
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <span>${item.name}</span>
      <div class="cart-qty-controls">
        <button class="cart-qty-btn" data-action="decrease" data-idx="${idx}">−</button>
        <span class="cart-qty">${item.qty}</span>
        <button class="cart-qty-btn" data-action="increase" data-idx="${idx}">+</button>
      </div>
      <span>$${(item.price * item.qty).toFixed(2)}</span>
    `;
    cartItemsDiv.appendChild(div);
  });

  cartTotal.textContent = 'Total: $' + total.toFixed(2);
}

// --- ADD TO CART (works on all pages) ---
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('add-cart')) {
    const name = e.target.dataset.name;
    const price = parseFloat(e.target.dataset.price);
    const found = cart.find(item => item.name === name);
    if (found) {
      found.qty += 1;
    } else {
      cart.push({ name, price, qty: 1 });
    }
    saveCart();
    updateCartDisplay();
  }
});

// --- Quantity controls (Home Page Cart) ---
if (document.getElementById('cartItems')) {
  document.getElementById('cartItems').addEventListener('click', function(e) {
    if (e.target.classList.contains('cart-qty-btn')) {
      const idx = parseInt(e.target.dataset.idx);
      const action = e.target.dataset.action;
      if (action === 'increase') {
        cart[idx].qty += 1;
      } else if (action === 'decrease') {
        cart[idx].qty -= 1;
        if (cart[idx].qty <= 0) cart.splice(idx, 1);
      }
      saveCart();
      updateCartDisplay();
    }
  });
}

// --- CART DROPDOWN TOGGLE ---
const cartBtn = document.getElementById('cartBtn');
const cartDropdown = document.getElementById('cartDropdown');
if (cartBtn && cartDropdown) {
  document.addEventListener('click', (e) => {
    if (cartBtn.contains(e.target)) {
      cartDropdown.classList.toggle('active');
    } else if (!cartDropdown.contains(e.target)) {
      cartDropdown.classList.remove('active');
    }
  });
}

// --- SIGNUP MODAL ---
const signupBtn = document.getElementById("signupBtn");
const signupModal = document.getElementById("signupModal");
const closeModal = document.getElementById("closeModal");
if (signupBtn && signupModal && closeModal) {
  signupBtn.addEventListener("click", () => {
    signupModal.style.display = "flex";
  });
  closeModal.addEventListener("click", () => {
    signupModal.style.display = "none";
  });
  window.addEventListener("click", (e) => {
    if (e.target === signupModal) signupModal.style.display = "none";
  });
}

// --- ORDER PAGE LOGIC ---
function renderOrderCart() {
  const cartItemsDiv = document.getElementById('orderCartItems');
  const subtotalSpan = document.getElementById('orderSubtotal');
  const taxSpan = document.getElementById('orderTax');
  const deliveryFeeSpan = document.getElementById('orderDeliveryFee');
  const totalSpan = document.getElementById('orderTotal');
  if (!cartItemsDiv) return;

  const DELIVERY_FEE = 3.00;
  const TAX_RATE = 0.08;

  if (cart.length === 0) {
    cartItemsDiv.innerHTML = '<div class="empty-cart">Cart is empty</div>';
    subtotalSpan.textContent = '$0.00';
    taxSpan.textContent = '$0.00';
    deliveryFeeSpan.textContent = '$0.00';
    totalSpan.textContent = '$0.00';
    return;
  }

  cartItemsDiv.innerHTML = '';
  let subtotal = 0;
  cart.forEach((item, idx) => {
    subtotal += item.price * item.qty;
    const div = document.createElement('div');
    div.className = 'order-cart-item';
    div.innerHTML = `
      <div class="order-cart-item-details">
        <div class="order-cart-item-title">${item.name}</div>
        <div class="order-cart-item-meta">
          Size: ${item.size || 'Regular'}${item.toppings ? ', Toppings: ' + item.toppings : ''}
        </div>
      </div>
      <div class="order-cart-qty-controls">
        <button class="order-cart-qty-btn" data-action="decrease" data-idx="${idx}">−</button>
        <span class="order-cart-qty">${item.qty}</span>
        <button class="order-cart-qty-btn" data-action="increase" data-idx="${idx}">+</button>
      </div>
      <span>$${(item.price * item.qty).toFixed(2)}</span>
      <button class="order-cart-remove" data-idx="${idx}" title="Remove">&times;</button>
    `;
    cartItemsDiv.appendChild(div);
  });

  const tax = subtotal * TAX_RATE;
  const deliveryFee = document.querySelector('input[name="deliveryOption"]:checked')?.value === 'pickup' ? 0 : DELIVERY_FEE;
  const total = subtotal + tax + deliveryFee;

  subtotalSpan.textContent = '$' + subtotal.toFixed(2);
  taxSpan.textContent = '$' + tax.toFixed(2);
  deliveryFeeSpan.textContent = '$' + deliveryFee.toFixed(2);
  totalSpan.textContent = '$' + total.toFixed(2);
}

// --- ORDER PAGE EVENTS ---
if (document.querySelector('.order-section')) {
  document.getElementById('orderCartItems').addEventListener('click', function(e) {
    const idx = parseInt(e.target.dataset.idx);
    if (e.target.classList.contains('order-cart-qty-btn')) {
      const action = e.target.dataset.action;
      if (action === 'increase') {
        cart[idx].qty += 1;
      } else if (action === 'decrease') {
        cart[idx].qty -= 1;
        if (cart[idx].qty <= 0) cart.splice(idx, 1);
      }
      saveCart();
      renderOrderCart();
    }
    if (e.target.classList.contains('order-cart-remove')) {
      cart.splice(idx, 1);
      saveCart();
      renderOrderCart();
    }
  });

  document.querySelectorAll('input[name="deliveryOption"]').forEach(radio => {
    radio.addEventListener('change', renderOrderCart);
  });

  document.getElementById('orderForm').addEventListener('submit', function(e) {
    e.preventDefault();
    if (!cart || cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    document.getElementById('orderConfirmModal').classList.add('active');
    this.reset();
  });

  document.getElementById('closeOrderConfirm').addEventListener('click', function() {
    document.getElementById('orderConfirmModal').classList.remove('active');
  });

  window.addEventListener('click', function(e) {
    if (e.target === document.getElementById('orderConfirmModal')) {
      document.getElementById('orderConfirmModal').classList.remove('active');
    }
  });
}

// --- INITIAL LOAD (for both pages) ---
document.addEventListener('DOMContentLoaded', () => {
  cart = JSON.parse(localStorage.getItem("cart") || '[]');
  if (document.getElementById('cartItems')) updateCartDisplay();   // Home
  if (document.querySelector('.order-section')) renderOrderCart(); // Order
});
