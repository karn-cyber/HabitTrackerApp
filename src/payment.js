import './style.css'

export function initPayment() {
    const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;

    if (!razorpayKey) {
        console.error("Razorpay Key ID is missing.");
        alert("Configuration Error: VITE_RAZORPAY_KEY_ID is missing.");
        return;
    }

    // Load Razorpay Script if missing
    if (!window.Razorpay) {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => console.log('Razorpay SDK loaded');
        script.onerror = () => alert('Failed to load payment gateway.');
        document.body.appendChild(script);
    }

    // Logic: "ownedProducts" is a JSON array of strings: ['habit', 'finance', 'bundle']
    let ownedProducts = [];
    try {
        ownedProducts = JSON.parse(localStorage.getItem('ownedProducts') || '[]');
        if (!Array.isArray(ownedProducts)) ownedProducts = [];
    } catch (e) {
        ownedProducts = [];
    }

    // Legacy support: if 'hasPaid' exists, assume they own 'habit' (old version)
    if (localStorage.getItem('hasPaid') === 'true' && !ownedProducts.includes('habit')) {
        ownedProducts.push('habit');
        localStorage.setItem('ownedProducts', JSON.stringify(ownedProducts));
    }

    // Product Links
    const links = {
        'habit': "https://docs.google.com/spreadsheets/d/1dLLUnOkYfOGctu_v8IDaZvAiJGT6W5Voo8ch30SYa7M/copy",
        'finance': "https://docs.google.com/spreadsheets/d/1qe5r_Hd8Cg31Vgl21r38byKkSUd-Lv4mHnAHg1E5zXg/copy", // Provided by user
        'bundle': null // Bundle doesn't have a single link, it unlocks both
    };

    // Helper: Mark button as owned
    const markOwned = (btn, product) => {
        btn.textContent = "Access Now";
        btn.classList.remove('btn-primary');
        btn.classList.add('btn-secondary'); // Visual indicator
        btn.onclick = (e) => {
            e.preventDefault();
            if (product === 'bundle') {
                // For bundle button in UI, maybe redirect to a page with both links or just open one? 
                // Requirement says "Access Your Copy" - simpler to just redirect to success page which lists both
                window.location.href = "/success.html?product=bundle";
            } else {
                window.open(links[product], '_blank');
            }
        };
    };

    const buyButtons = document.querySelectorAll('.buy-btn');

    buyButtons.forEach(btn => {
        const product = btn.dataset.product; // 'habit', 'finance', 'bundle'
        const amount = btn.dataset.amount;   // '3800', '5000'

        // Check ownership
        const isOwned = ownedProducts.includes(product) || (product !== 'bundle' && ownedProducts.includes('bundle')); // owning bundle implies owning components

        if (isOwned) {
            markOwned(btn, product);
            return;
        }

        // Attach Click Listener for Payment
        btn.addEventListener('click', (e) => {
            e.preventDefault();

            if (!window.Razorpay) {
                alert("Payment gateway loading... try again.");
                return;
            }

            const options = {
                "key": razorpayKey,
                "amount": amount,
                "currency": "INR",
                "name": "MoneyOS",
                "description": product === 'bundle' ? "Finance + Habit Tracker Bundle" : `${product.charAt(0).toUpperCase() + product.slice(1)} Tracker`,
                "image": "/logo.png", // Use logo
                "handler": function (response) {
                    // Update Local Storage
                    const currentOwned = JSON.parse(localStorage.getItem('ownedProducts') || '[]');
                    if (!currentOwned.includes(product)) {
                        currentOwned.push(product);
                        localStorage.setItem('ownedProducts', JSON.stringify(currentOwned));
                    }
                    // Redirect
                    window.location.href = `/success.html?product=${product}`;
                },
                "prefill": { "email": "" },
                "theme": { "color": "#6366f1" }
            };

            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', function (response) {
                alert("Payment Failed: " + response.error.description);
            });
            rzp.open();
        });
    });
}
