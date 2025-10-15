document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");

    form.addEventListener("submit", (e) => {
        const fullName = document.getElementById("fullName").value.trim();
        const email = document.getElementById("email").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const subject = document.getElementById("subject").value.trim();
        const message = document.getElementById("message").value.trim();

        // Basic validation
        if (!fullName || !email || !subject || !message) {
            alert("Please fill in all required fields.");
            e.preventDefault();
            return;
        }

        // Validate email
        if (!email.includes("@")) {
            alert("Please enter a valid email address.");
            e.preventDefault();
            return;
        }

        // Optional: validate phone if filled
        if (phone) {
            const phoneRegex = /^\d{8}$/;
            if (!phoneRegex.test(phone)) {
                alert("Phone number must contain exactly 8 digits.");
                e.preventDefault();
                return;
            }
        }

        // Allow the form to submit to Formspree
    });
});
