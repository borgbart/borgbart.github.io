// scripts.js

// Function to toggle the side panel and hamburger menu
function toggleMenu() {
    var sidePanel = document.getElementById("sidePanel");
    var hamburger = document.querySelector(".hamburger-menu");
    sidePanel.classList.toggle("show");
    hamburger.classList.toggle("active");
}

// Close side panel when clicking outside of it
document.addEventListener('click', function(event) {
    var sidePanel = document.getElementById("sidePanel");
    var hamburger = document.querySelector(".hamburger-menu");
    if (!sidePanel.contains(event.target) && !hamburger.contains(event.target)) {
        sidePanel.classList.remove("show");
        hamburger.classList.remove("active");
    }
});

// Load side panel category links
document.addEventListener('DOMContentLoaded', () => {
    const categoryLinks = document.querySelectorAll('.side-panel .nav-links ul li a');
    
    categoryLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const submenu = link.nextElementSibling;
            if (submenu && submenu.classList.contains('sub-categories')) {
                e.preventDefault();
                submenu.classList.toggle('show-menu');
                submenu.style.display = submenu.classList.contains('show-menu') ? 'block' : 'none';
            }
        });
    });
});

// Fetch the navigation content
document.addEventListener("DOMContentLoaded", function () {
    fetch("/nav.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("nav-container").innerHTML = data;
        })
        .catch(error => console.error("Error loading navigation:", error));
});

// Fetch the footer content
document.addEventListener("DOMContentLoaded", function () {
    fetch("/footer/footer.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("footer-container").innerHTML = data;
        })
        .catch(error => console.error("Error loading footer:", error));
});

// Image Navigation Arrows
let currentIndex = 0;
    const images = document.querySelectorAll('.product-images img, .product-imagesmandelli img');

    function showImage(index) {
        images.forEach((img, i) => {
            if (i === index) {
                img.classList.add('active-image');
            } else {
                img.classList.remove('active-image');
            }
        });
    }

    function nextImage() {
        currentIndex = (currentIndex + 1) % images.length;
        showImage(currentIndex);
    }

    function prevImage() {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        showImage(currentIndex);
    }

    showImage(currentIndex);

    

    // Show or hide the button when scrolling
window.addEventListener('scroll', function() {
    const button = document.getElementById('back-to-top');
    if (window.scrollY > 300) {
      button.style.display = 'block'; // Show button after 300px scroll
    } else {
      button.style.display = 'none'; // Hide button when near top
    }
  });
  
  // Scroll to top when clicked
  document.getElementById('back-to-top').addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  
