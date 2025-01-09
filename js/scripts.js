/*!
* Start Bootstrap - Stylish Portfolio v6.0.6 (https://startbootstrap.com/theme/stylish-portfolio)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-stylish-portfolio/blob/master/LICENSE)
*/
window.addEventListener('DOMContentLoaded', event => {

    const sidebarWrapper = document.getElementById('sidebar-wrapper');
    const menuToggle = document.body.querySelector('.menu-toggle');
    
    menuToggle.addEventListener('click', event => {
        event.preventDefault();
        sidebarWrapper.classList.toggle('active');
        menuToggle.classList.toggle('active');
        
        // Add this line to toggle body scroll
        document.body.classList.toggle('sidebar-toggled');
    });

    // Close sidebar when clicking outside
    document.addEventListener('click', event => {
        if (sidebarWrapper.classList.contains('active') && 
            !event.target.closest('#sidebar-wrapper') && 
            !event.target.closest('.menu-toggle')) {
            sidebarWrapper.classList.remove('active');
            menuToggle.classList.remove('active');
            document.body.classList.remove('sidebar-toggled');
        }
    });

    // Close sidebar when clicking on nav items
    const navItems = document.querySelectorAll('.sidebar-nav-item a');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            sidebarWrapper.classList.remove('active');
            menuToggle.classList.remove('active');
            document.body.classList.remove('sidebar-toggled');
        });
    });
});

function fadeOut(el) {
    el.style.opacity = 1;
    (function fade() {
        if ((el.style.opacity -= .1) < 0) {
            el.style.display = "none";
        } else {
            requestAnimationFrame(fade);
        }
    })();
};

function fadeIn(el, display) {
    el.style.opacity = 0;
    el.style.display = display || "block";
    (function fade() {
        var val = parseFloat(el.style.opacity);
        if (!((val += .1) > 1)) {
            el.style.opacity = val;
            requestAnimationFrame(fade);
        }
    })();
};

const jobTitles = {
    en: [
        "AI Web Technologist",
        "AI Business Expert",
        "Web Developer",
        "Software Engineer",
        "UX Designer",
        "Project Manager",
        "Full-Stack Developer",
        "Quality Authority",
        "Requirement Engineer",
        "Software Test Manager",
        "ISTQB Certified Tester",
        "Philantropist"
    ],
    de: [
        "KI Web Technologe",
        "KI Business Experte",
        "Web Entwickler",
        "Software Ingenieur",
        "UX Designer",
        "Projektmanager",
        "Full-Stack Entwickler",
        "Qualitätsbeauftragter",
        "Anforderungsingenieur",
        "Software Test Manager",
        "ISTQB Zertifizierter Tester",
        "Philanthrop"
    ]
};

let currentJobIndex = 0;
const targetElement = document.querySelector('h3.mb-5 > em');

// Function to get current language
function getCurrentLanguage() {
    return document.documentElement.getAttribute('lang') || 'en';
}

// Set initial text content
targetElement.textContent = jobTitles[getCurrentLanguage()][currentJobIndex];

setInterval(() => {
    currentJobIndex = (currentJobIndex + 1) % jobTitles[getCurrentLanguage()].length;
    targetElement.textContent = jobTitles[getCurrentLanguage()][currentJobIndex];
}, 4000);

// Add event listener for language changes
document.addEventListener('languageChanged', () => {
    targetElement.textContent = jobTitles[getCurrentLanguage()][currentJobIndex];
});

const portfolioItems = document.querySelectorAll('.portfolio-item .caption');

portfolioItems.forEach(caption => {
  caption.addEventListener('click', () => {
    window.location.href = caption.parentElement.href;
  });
});

// Add these functions to handle the language toggle visibility
document.querySelector(".menu-toggle").addEventListener("click", function() {
    const languageToggle = document.getElementById("languageToggle");
    // Toggle body class first
    document.body.classList.toggle("active");
    // Then set language toggle visibility based on body class
    languageToggle.style.display = document.body.classList.contains("active") ? "block" : "none";
});

// Add click listener to document to handle clicks outside navbar
document.addEventListener("click", function(event) {
    const sidebar = document.getElementById("sidebar-wrapper");
    const menuToggle = document.querySelector(".menu-toggle");
    const languageToggle = document.getElementById("languageToggle");
    
    // If clicking outside sidebar and not on menu toggle or language toggle
    if (!sidebar.contains(event.target) && 
        !menuToggle.contains(event.target) && 
        !languageToggle.contains(event.target)) {
        // Hide language toggle first
        languageToggle.style.display = "none";
        // Then remove active class from body
        document.body.classList.remove("active");
    }
});

// Keep the language toggle click handler
document.getElementById("languageToggle").addEventListener("click", function(event) {
    event.stopPropagation();
});