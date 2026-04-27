// ---------------- CART ----------------
let cart = [];

// Add to cart
function addToCart(name, price) {
    cart.push({ name, price });
    updateCartUI();
    toggleCart(true);
}

// Remove item
function removeItem(index) {
    cart.splice(index, 1);
    updateCartUI();
}

// Update UI
function updateCartUI() {
    const container = document.getElementById('cart-items-container');
    const countLabel = document.getElementById('cart-count');
    const totalLabel = document.getElementById('total-price');

    countLabel.innerText = cart.length;

    if (cart.length === 0) {
        container.innerHTML = '<p class="text-muted text-center py-5">Your cart is empty.</p>';
        totalLabel.innerText = '0';
        return;
    }

    let total = 0;
    container.innerHTML = cart.map((item, index) => {
        total += item.price;
        return `
        <div class="cart-item">
            <div>
                <h6 class="mb-0 small fw-bold">${item.name}</h6>
                <span class="text-muted">$${item.price}</span>
            </div>
            <button class="btn btn-sm btn-outline-danger border-0" onclick="removeItem(${index})">
                <i class='bx bx-trash'></i>
            </button>
        </div>`;
    }).join('');

    totalLabel.innerText = total;
}

// Toggle cart
function toggleCart(forceOpen = false) {
    const sidebar = document.getElementById('cart-sidebar');
    if (forceOpen) sidebar.classList.add('active');
    else sidebar.classList.toggle('active');
}

// Search
function searchFunc() {
    let input = document.getElementById('myInput').value.toLowerCase();
    let items = document.getElementsByClassName('product-item');

    for (let i = 0; i < items.length; i++) {
        let name = items[i].querySelector('.product-name').innerText.toLowerCase();
        items[i].style.display = name.includes(input) ? "" : "none";
    }
}

// ---------------- ORDER + TRACKING ----------------

// Open modal
function placeOrder() {
    if (cart.length === 0) {
        alert("Bhai, pehle kuch cart mein add toh karo!");
        return;
    }

    document.getElementById('modal-total').innerText =
        document.getElementById('total-price').innerText;

    toggleCart();
    new bootstrap.Modal(document.getElementById('checkoutModal')).show();
}

// Submit order
document.getElementById('orderForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('custName').value;
    const total = document.getElementById('total-price').innerText;

    // 🔥 FIX: Uppercase ID (important)
    const trackingID = ("NOVA-" + Math.floor(100000 + Math.random() * 900000)).toUpperCase();

    const orderObj = {
        id: trackingID,
        customer: name,
        amount: total,
        status: "Order Confirmed ✅",
        date: new Date().toLocaleDateString()
    };

    // Save
    localStorage.setItem(trackingID, JSON.stringify(orderObj));

    console.log("Saved:", trackingID, orderObj);

    // Alert
    alert(`Order Success 🎉

Tracking ID: ${trackingID}

Use this ID to track your order`);

    // Reset
    cart = [];
    updateCartUI();
    this.reset();

    bootstrap.Modal.getInstance(document.getElementById('checkoutModal')).hide();
});

// Track Order
document.getElementById('trackBtn').addEventListener('click', function () {
    const inputVal = document.getElementById('trackInput').value.trim().toUpperCase();
    const resultDiv = document.getElementById('trackResult');

    if (!inputVal) {
        alert("ID daalo bhai!");
        return;
    }

    const storedData = localStorage.getItem(inputVal);

    resultDiv.style.display = "block";

    if (storedData) {
        const data = JSON.parse(storedData);

        resultDiv.innerHTML = `
        <div class="p-3 rounded border bg-light">
            <h6 class="text-success fw-bold">Order Found ✅</h6>
            <p><b>ID:</b> ${data.id}</p>
            <p><b>Name:</b> ${data.customer}</p>
            <p><b>Amount:</b> $${data.amount}</p>
            <p><b>Status:</b> ${data.status}</p>
            <p><b>Date:</b> ${data.date}</p>

            <div class="progress" style="height: 10px;">
                <div class="progress-bar bg-warning progress-bar-striped progress-bar-animated" style="width: 30%"></div>
            </div>
        </div>`;
    } else {
        resultDiv.innerHTML = `
        <div class="alert alert-danger">
            ❌ Invalid Tracking ID!
        </div>`;
    }
});