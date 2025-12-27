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

    const paymentButtons = document.querySelectorAll('a[href="#pricing"], .btn-primary');

    paymentButtons.forEach(btn => {
        // Only bind to buttons that are actual purchase buttons or pricing links
        // We filter slightly to avoid navigation links if they point to sections vs actions
        // But for simplicity, let's target specific CTA buttons

        // Let's assume all buttons with text "Get the Habit Tracker" or similar should trigger it.
        // Or we simply check if it's the specific CTA. 
        // The user said: "Get the Habit Tracker" button should open modal.

        if (btn.textContent.includes('Get') || btn.textContent.includes('Buy')) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const rzp1 = new Razorpay(options);
                rzp1.open();
            });
        }
    });
}
