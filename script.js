/* ============================================
   Nature's Bakery — JavaScript (Part 1)
   Cart storage, add/remove items, toast
   ============================================ */

// Cart data stored in localStorage so it persists across pages
function getCart() {
    try {
        return JSON.parse(localStorage.getItem('naturesCart')) || [];
    } catch (e) {
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem('naturesCart', JSON.stringify(cart));
    updateCartCount();
}

// Add item to cart
function addToCart(name, price) {
    var cart = getCart();
    var existing = cart.find(function(item) { return item.name === name; });

    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ name: name, price: price, qty: 1, img: getImg(name) });
    }

    saveCart(cart);
    showToast('Added to cart!');
}

// Remove item from cart
function removeFromCart(name) {
    var cart = getCart().filter(function(item) { return item.name !== name; });
    saveCart(cart);
    renderCart();
}

// Update quantity
function updateQty(name, delta) {
    var cart = getCart();
    var item = cart.find(function(i) { return i.name === name; });
    if (!item) return;

    item.qty += delta;
    if (item.qty <= 0) {
        cart = cart.filter(function(i) { return i.name !== name; });
    }

    saveCart(cart);
    renderCart();
}

// Map product names to images
function getImg(name) {
    var imgs = {
        'Almond Honey Croissant': 'croissant.jpg',
        'Whole Wheat Banana Bread': 'banana-bread.jpg',
        'Blueberry Oat Muffin': 'muffin.jpg',
        'Spinach & Feta Galette': 'galette.jpg',
        'Dark Chocolate Avocado Brownie': 'brownie.jpg',
        'Everything Oat Bagel': 'bagel.jpg',
        'Mediterranean Quinoa Bowl': 'quinoa-bowl.jpg',
        'Herb-Roasted Chicken & Sweet Potato': 'chicken.jpg',
        'Herb-Roasted Chicken': 'chicken.jpg',
        'Açaí Power Bowl': 'acai-bowl.jpg',
        'Acai Power Bowl': 'acai-bowl.jpg'
    };
    return imgs[name] || '';
}

// Update cart count badge in navbar
function updateCartCount() {
    var cart = getCart();
    var total = cart.reduce(function(sum, item) { return sum + item.qty; }, 0);
    var badges = document.querySelectorAll('#cart-count');
    badges.forEach(function(el) {
        el.textContent = total;
    });
}

// Show toast notification
function showToast(message) {
    var toast = document.getElementById('cart-toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(function() {
        toast.classList.remove('show');
    }, 2500);
}

// ============================================
// Render cart page
// ============================================
function renderCart() {
    var cart = getCart();
    var listEl = document.getElementById('cart-list');
    var emptyEl = document.getElementById('cart-empty');
    var subtotalEl = document.getElementById('cart-subtotal');
    var totalEl = document.getElementById('cart-total');
    var deliveryEl = document.getElementById('cart-delivery');

    if (!listEl) return; // not on cart page

    if (cart.length === 0) {
        emptyEl.style.display = 'block';
        listEl.innerHTML = '';
        subtotalEl.textContent = '$0.00';
        totalEl.textContent = '$0.00';
        deliveryEl.textContent = 'Free';
        return;
    }

    emptyEl.style.display = 'none';
    var html = '';
    var subtotal = 0;

    cart.forEach(function(item) {
        subtotal += item.price * item.qty;
        // Images used instead of emoji colors

        html += '<div class="cart-item">';
        if (item.img) {
            html += '  <div class="cart-item-image cart-item-img"><img src="images/' + item.img + '" alt="' + item.name + '"></div>';
        } else {
            html += '  <div class="cart-item-image" style="background: linear-gradient(135deg, #8BC34A, #689F38)">🥖</div>';
        }
        html += '  <div class="cart-item-info">';
        html += '    <h4>' + item.name + '</h4>';
        html += '    <p>Qty: ' + item.qty + ' · $' + item.price.toFixed(2) + ' each</p>';
        html += '  </div>';
        html += '  <div class="cart-item-price">$' + (item.price * item.qty).toFixed(2) + '</div>';
        html += '  <button class="cart-item-remove" onclick="removeFromCart(\'' + item.name.replace(/'/g, "\\'") + '\')">✕</button>';
        html += '</div>';
    });

    listEl.innerHTML = html;
    subtotalEl.textContent = '$' + subtotal.toFixed(2);
    totalEl.textContent = '$' + subtotal.toFixed(2);
    deliveryEl.textContent = 'Free';
}

// Checkout button
function checkout() {
    var cart = getCart();
    if (cart.length === 0) {
        showToast('Your cart is empty!');
        return;
    }
    showToast('Checkout coming soon, thanks for ordering!');
}

// Contact form handler
function handleSubmit(event) {
    event.preventDefault();
    showToast('Message sent! We\'ll get back to you soon.');
    event.target.reset();
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    renderCart();
});