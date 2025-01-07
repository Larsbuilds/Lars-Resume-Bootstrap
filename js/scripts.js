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

const jobTitles = ["AI Web Technologist", "AI Business Expert", "Web Developer", "Software Engineer", "UX Designer", "Project Manager", "Full-Stack Developer", "Quality Authority", "Requirement Engineer", "Software Test manager", "ISTQB Certified Tester", "Philantropist"];
let currentJobIndex = 0;
const targetElement = document.querySelector('h3.mb-5 > em'); // Select the target element

// Set initial text content
targetElement.textContent = jobTitles[currentJobIndex];

setInterval(() => {
  currentJobIndex = (currentJobIndex + 1) % jobTitles.length;
  targetElement.textContent = jobTitles[currentJobIndex];
}, 4000); // Set interval to match total animation duration

const portfolioItems = document.querySelectorAll('.portfolio-item .caption');

portfolioItems.forEach(caption => {
  caption.addEventListener('click', () => {
    window.location.href = caption.parentElement.href;
  });
});