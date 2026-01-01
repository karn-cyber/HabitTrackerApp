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
        'finance': "https://docs.google.com/spreadsheets/d/1qe5r_Hd8Cg31Vgl21r38byKkSUd-Lv4mHnAHg1E5zXg/copy",
        'bundle': null, // Bundle doesn't have a single link, it unlocks both
        'ai-videos': "https://drive.google.com/drive/folders/1qBpqgApYwv86vNhsqKhJume2NNo_Qg9V",
        // AI Video Bundles (23 products)
        'glass-cutting-bundle': "https://drive.google.com/drive/folders/1AnfaT-CsqJI8h1RPLaqqco38TiPLlBCY",
        'ai-story-bundle': "https://drive.google.com/drive/folders/1kocgFg0rzsMCtXsrWiOH_oditWshBpbV",
        'patal-lok-bundle': "https://drive.google.com/drive/folders/1UePgbkbTlAKFbBAMqcXi9l34XFkUzFjF",
        'anime-reels-bundle': "https://drive.google.com/drive/folders/1vAkSCfTcXPen5pDkwMgUmbAOqGQZxfwF",
        'motivational-reels-bundle': "https://drive.google.com/drive/mobile/folders/1FJbKCNvBiujwgnbNmVnaaXs7lEokvNXT",
        'luxury-reels-bundle': "https://drive.google.com/drive/folders/13nXuzXZmz_d7Yt0DQbBwmyInw-0RS-Zz",
        'car-edits-bundle': "https://drive.google.com/drive/folders/1ev4YgEAw55izgE5mO6NTe0fswrrQTTva",
        'cars-reels-bundle': "https://drive.google.com/drive/folders/1hpwetf4zqIs1Yt0R0g8dBREDJ_oN61oW",
        '2d-animation-bundle': "https://drive.google.com/drive/folders/1sJmwRYH5l4fyGQaUPJ1MfvwwJT5PkL4h",
        'sigma-male-bundle': "https://drive.google.com/drive/folders/1-20KuM_Q8N41AZ3urB9OIsE4RwEqg33o",
        'movie-explain-bundle': "https://drive.google.com/drive/folders/1dVjqB7m_IKHIZ2-PN8PmNiXhC4jRVFbU",
        'cartoon-explain-bundle': "https://drive.google.com/drive/folders/1dHDKZe6HIDnDpX4jXMfow3VEXYxRJgY5",
        '30k-viral-bundle': "https://drive.google.com/drive/folders/1qBpqgApYwv86vNhsqKhJume2NNo_Qg9V",
        'satisfying-reels-bundle': "https://drive.google.com/drive/folders/1jzhyjsiKPRWJSZZSsasz4qq8Kq9qapV5",
        'gym-reels-bundle': "https://drive.google.com/drive/folders/1jesQ7V_duScTQ9W02bCPsvc8ffXSabxP",
        'marvelous-ai-bundle': "https://drive.google.com/drive/folders/120aMEClKKFz4ErXaj7wrfYlANtDPjj_T",
        'glowing-graphics-bundle': "https://drive.google.com/drive/folders/1roblnDQyKDbkJscGsTSTEglAJc-50RYM",
        'sanatan-ai-bundle': "https://drive.google.com/drive/folders/15qei5cdB_Z0UAMNPj9_2uPmSzg8kh8cW",
        'ai-reel-bundle': "https://drive.google.com/drive/folders/1b-L2Q8ItT21Mvsh8PfjK5USMPnNovANU",
        'funny-clips-bundle': "https://drive.google.com/drive/folders/1QREdguUC-VAZ-Me_kPbbJ1u3xjc-jf6K",
        'monkey-vlogs-bundle': "https://drive.google.com/drive/u/0/mobile/folders/1_JHEY5mmiMijvekAqTzbC5dENmoC6F11",
        'ai-news-bundle': "https://drive.google.com/drive/folders/1fS_qaVAubPNKODfsIrlh1DvHTRFiO0ZD",
        'ai-cat-story-bundle': "https://drive.google.com/drive/folders/1l-SosSdRxmkfTuVG6X5zwbBr03mmDfrY"
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
                "description": product === 'ai-videos' ? "30K+ AI Videos Library" : product === 'bundle' ? "Finance + Habit Tracker Bundle" : `${product.charAt(0).toUpperCase() + product.slice(1)} Tracker`,
                "image": "/logo.png", // Use logo
                "handler": function (response) {
                    // Update Local Storage
                    const currentOwned = JSON.parse(localStorage.getItem('ownedProducts') || '[]');
                    if (!currentOwned.includes(product)) {
                        currentOwned.push(product);
                        localStorage.setItem('ownedProducts', JSON.stringify(currentOwned));
                    }

                    // Set Security Token for Success Page access (Backup)
                    sessionStorage.setItem('secure_access_token', 'valid');

                    // Redirect with URL token (Primary method)
                    window.location.href = `/success.html?product=${product}&auth=verified`;
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

    // Promo Code Logic (Modal)
    const promoLink = document.getElementById('promo-trigger');
    const modal = document.getElementById('promo-modal');
    const closeBtn = document.querySelector('.modal-close');
    const applyBtn = document.getElementById('apply-promo-btn');
    const input = document.getElementById('promo-input');
    const errorMsg = document.getElementById('promo-error');

    // Open Modal
    if (promoLink && modal) {
        promoLink.addEventListener('click', (e) => {
            e.preventDefault();
            modal.classList.remove('hidden');
            input.value = ''; // Reset
            errorMsg.classList.add('hidden');
            input.focus();
        });

        // Close Modal
        const closeModal = () => {
            modal.classList.add('hidden');
        };

        closeBtn.addEventListener('click', closeModal);

        // Close on click outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        // Apply Logic
        applyBtn.addEventListener('click', () => {
            const code = input.value.trim();

            if (code && code.toUpperCase() === 'FRND49') {
                const expiryDate = new Date('2026-01-01');
                const now = new Date();

                if (now < expiryDate) {
                    // Success
                    const products = ['habit', 'finance', 'bundle'];
                    localStorage.setItem('ownedProducts', JSON.stringify(products));
                    sessionStorage.setItem('secure_access_token', 'valid');

                    // Visual feedback before redirect
                    applyBtn.textContent = "Unlocked! Redirecting...";
                    applyBtn.style.backgroundColor = "#10b981"; // Green

                    setTimeout(() => {
                        window.location.href = "/success.html?product=bundle&auth=verified";
                    }, 1000);
                } else {
                    // Expired
                    errorMsg.textContent = "This promo code has expired.";
                    errorMsg.classList.remove('hidden');
                }
            } else {
                // Invalid
                errorMsg.textContent = "Invalid code. Please try again.";
                errorMsg.classList.remove('hidden');
            }
        });

        // Enter key support
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') applyBtn.click();
        });
    }
}
