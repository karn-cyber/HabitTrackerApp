import './style.css'

export function initPayment() {
    const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;

    if (!razorpayKey) {
        console.error("Razorpay Key ID is missing in environment variables.");
        alert("Configuration Error: VITE_RAZORPAY_KEY_ID is missing. Please check your .env file and restart the server.");
        return;
    }

    // Check if user has already paid
    const hasPaid = localStorage.getItem('hasPaid');
    const paymentButtons = document.querySelectorAll('a[href="#pricing"], .btn-primary');
    const googleSheetLink = "https://docs.google.com/spreadsheets/d/1dLLUnOkYfOGctu_v8IDaZvAiJGT6W5Voo8ch30SYa7M/copy";

    if (hasPaid === 'true') {
        paymentButtons.forEach(btn => {
            if (btn.textContent.includes('Get') || btn.textContent.includes('Buy')) {
                btn.textContent = "Access Your Copy"; // Change text
                // Remove href javascript call and set real link
                if (btn.tagName === 'A') {
                    btn.removeAttribute('href');
                    btn.href = googleSheetLink;
                    btn.target = "_blank"; // Open in new tab
                } else {
                    // If it's a button, we need a click listener to redirect
                    btn.onclick = () => window.open(googleSheetLink, '_blank');
                }

                // Clone element to remove existing event listeners (the razorpay ones added below if we ran that code)
                // But better yet, we just return early so those listeners are never attached!
            }
        });
        console.log("User has paid. Access granted.");
        return; // EXIT FUNCTION EARLY
    }

    const options = {
        "key": razorpayKey,
        "amount": "100", // 100 paise = ₹1 INR
        "currency": "INR",
        "name": "Student Habit Tracker",
        "description": "Personal editable habit tracker for students",
        "image": "/dashboard-mockup.png",
        "handler": function (response) {
            localStorage.setItem('hasPaid', 'true');
            window.location.href = "/success.html";
        },
        "prefill": {
            // Leave empty to let Razorpay collect email/phone
            "name": "",
            "email": "",
            "contact": ""
        },
        "theme": {
            "color": "#6366f1"
        },
        "modal": {
            "ondismiss": function () {
                console.log('Checkout form closed');
            }
        }
    };

    if (!window.Razorpay) {
        console.error("Razorpay SDK not loaded");
        // Try to load it dynamically if missing
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => console.log('Razorpay SDK loaded dynamically');
        script.onerror = () => alert('Failed to load payment gateway. Please check your internet connection.');
        document.body.appendChild(script);
    }

    // paymentButtons defined above
    console.log("Found payment buttons:", paymentButtons.length);

    paymentButtons.forEach(btn => {
        if (btn.textContent.includes('Get') || btn.textContent.includes('Buy')) {
            // Remove any existing href to prevent navigation if JS fails or loading is slow
            if (btn.tagName === 'A') btn.setAttribute('href', 'javascript:void(0)');

            btn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log("Buy button clicked");

                if (!window.Razorpay) {
                    alert("Payment Gateway is still loading... please wait a moment and try again.");
                    return;
                }

                try {
                    const rzp1 = new window.Razorpay(options);
                    rzp1.open();
                } catch (error) {
                    console.error("Razorpay Initialization Failed:", error);
                    alert("Payment gateway failed to open. Error: " + error.message);
                }
            });
        }
    });
}
