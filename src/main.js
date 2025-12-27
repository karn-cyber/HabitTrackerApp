import './style.css'
import { initPayment } from './payment.js'
import { createIcons, TrendingDown, Puzzle, Smartphone, CheckCircle, Calendar, BarChart2, Flame, CalendarDays, Palette, FileSpreadsheet } from 'lucide';

// Initialize Payment
initPayment();

// Initialize Icons
createIcons({
    icons: {
        TrendingDown, Puzzle, Smartphone, CheckCircle, Calendar, BarChart2, Flame, CalendarDays, Palette, FileSpreadsheet
    }
});


// FAQ Accordion
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    question.addEventListener('click', () => {
        // Close other items
        faqItems.forEach(otherItem => {
            if (otherItem !== item) {
                otherItem.classList.remove('active');
                otherItem.querySelector('.faq-answer').style.maxHeight = null;
            }
        });

        // Toggle current item
        item.classList.toggle('active');
        if (item.classList.contains('active')) {
            answer.style.maxHeight = answer.scrollHeight + 'px';
        } else {
            answer.style.maxHeight = null;
        }
    });
});

// Mobile Menu Toggle
const menuToggle = document.querySelector('.menu-toggle');
const navbar = document.querySelector('.navbar');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        navbar.classList.toggle('nav-active');
    });
}
