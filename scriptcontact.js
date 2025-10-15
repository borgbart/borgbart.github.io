document.addEventListener("DOMContentLoaded", () => {
    // 1️⃣ Load the contact form into the container
    const container = document.getElementById("contact-container"); 
    fetch("/contactform.html")
        .then(response => response.text())
        .then(html => {
            container.innerHTML = html;

            // 2️⃣ Add validation for the dynamically loaded form
            const form = container.querySelector("form");
            form.addEventListener("submit", (e) => {
                const fullName = document.getElementById("fullName").value.trim();
                const email = document.getElementById("email").value.trim();
                const phone = document.getElementById("phone").value.trim();
                const subject = document.getElementById("subject").value.trim();
                const message = document.getElementById("message").value.trim();

                if (!fullName || !email || !subject || !message) {
                    alert("Please fill in all required fields.");
                    e.preventDefault();
                    return;
                }

                if (!email.includes("@")) {
                    alert("Please enter a valid email address.");
                    e.preventDefault();
                    return;
                }

                if (phone) {
                    const phoneRegex = /^\d{8}$/;
                    if (!phoneRegex.test(phone)) {
                        alert("Phone number must contain exactly 8 digits.");
                        e.preventDefault();
                        return;
                    }
                }
            });
        })
        .catch(err => console.error("Failed to load contact form:", err));
});
