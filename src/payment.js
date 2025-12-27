import './style.css'

export function initPayment() {
    const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;

    if (!razorpayKey) {
        console.error("Razorpay Key ID is missing in environment variables.");
        return;
    }

    const options = {
        "key": razorpayKey,
        "amount": "1900", // Amount is in currency subunits. Default currency is INR. Hence, 1900 = 19 INR
        "currency": "INR",
        "name": "Student Habit Tracker",
        "description": "Lifetime Access to Excel Dashboard",
        "image": "/dashboard-mockup.png",
        "handler": function (response) {
            // In a real app, you would verify signature on backend.
            // For this single page simple app, we redirect to success.
            window.location.href = "/success.html";
        },
        "prefill": {
            "name": "",
            "email": "",
            "contact": ""
        },
        "theme": {
            "color": "#6366f1"
        }
    };

    if (!window.Razorpay) {
        console.error("Razorpay SDK not loaded");
        return;
    }

    const paymentButtons = document.querySelectorAll('a[href="#pricing"], .btn-primary');

    paymentButtons.forEach(btn => {
        // Filter for specific CTA keywords
        if (btn.textContent.includes('Get') || btn.textContent.includes('Buy')) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                try {
                    const rzp1 = new window.Razorpay(options);
                    rzp1.open();
                } catch (error) {
                    console.error("Razorpay Initialization Failed:", error);
                    alert("Payment gateway failed to open. Please try again or check console.");
                }
            });
        }
    });
}
