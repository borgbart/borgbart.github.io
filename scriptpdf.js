async function generateQuote() {
    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const quantity = parseInt(document.getElementById("quantity").value);
    const variation = document.getElementById("variation").value.trim();

    // Get predefined values
    const productInfo = document.getElementById("product-info");
    const productName = productInfo.dataset.productName;
    const unitCost = parseFloat(productInfo.dataset.unitCost);
    const vatRate = parseFloat(productInfo.dataset.vatRate);

    // Check if email contains '@'
    if (!email || !email.includes('@')) {
        alert("Please enter a valid email address.");
        return;
    }

    // Check if phone number contains exactly 8 digits
    const phoneRegex = /^\d{8}$/;
    if (!phone || !phoneRegex.test(phone)) {
        alert("Phone number must contain exactly 8 digits.");
        return;
    }

    // Check if quantity is a valid number and greater than 0
    if (!quantity || isNaN(quantity) || quantity <= 0) {
        alert("Quantity must be a valid number greater than 0.");
        return;
    }

    // Calculate net and total
    const netAmount = unitCost * quantity;
    const vatAmount = (netAmount * vatRate) / 100;
    const totalAmount = netAmount + vatAmount;

    if (!fullName || !email || !phone || !quantity || !variation) {
        alert("Please fill in all fields before generating the quote.");
        return;
    }

    try {
        const response = await fetch('/generate-quote', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                fullName,
                email,
                phone,
                quantity,
                variation,
                productName,
                unitCost,
                vatRate,
                netAmount: netAmount.toFixed(2),
                totalAmount: totalAmount.toFixed(2)
            })
        });

        if (!response.ok) {
            throw new Error('Failed to generate quote');
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        // Create an anchor element and trigger a click event to ensure it's user-initiated
        const a = document.createElement('a');
        a.href = url;
        a.target = '_blank';  // Open in a new tab or window

        // Safari on iOS-specific handling: Trigger the click inside a setTimeout to avoid blocking
        setTimeout(() => {
            a.click();
        }, 0);

    } catch (err) {
        alert("Error generating quote: " + err.message);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("quote-container");
    const variations = window.quoteVariations || []; // Use variations from HTML page

    fetch("/quote.html")
        .then(response => response.text())
        .then(html => {
            container.innerHTML = html;

            const select = document.getElementById("variation");
            if (select && variations.length) {
                variations.forEach(v => {
                    const option = document.createElement("option");
                    option.value = v;
                    option.textContent = v;
                    select.appendChild(option);
                });
            }
        });
});
