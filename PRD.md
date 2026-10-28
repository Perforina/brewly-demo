# Brewly checkout rules v1
1. Catalog: 6 coffee bags. House Blend $12, Ethiopia Yirgacheffe $18, Colombia Supremo $16, Kenya AA $20, Decaf Swiss Water $15, Espresso Roast $14.
2. Cart shows line items, quantity controls, subtotal, discount, shipping and total.
3. Coupon SAVE10 takes 10% off the subtotal. Invalid codes show "Code not valid".
4. Shipping is $5. Shipping is free when the subtotal AFTER discounts is $50 or more.
5. Checkout form: name, email, address. All required. Email must be valid.
6. Payment (mock, test mode): card number (16 digits), expiry (MM/YY) and CVC (3 digits), all required. 4242 4242 4242 4242 pays. 4000 0000 0000 0002 is declined: show a decline message, place no order, keep the cart.
7. Placing an order shows "Order confirmed" with an order number and the final total.
