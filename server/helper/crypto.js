const crypto = require('crypto');
require('dotenv').config()
const stripe = require('stripe')(process.env.STRIPE_KEY);
 
 
function encrypt(text, key) {
    const cipher = crypto.createCipher('aes192', key);
    // Encrypt the data
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted
}
 
 
function decrypt(text, key) {

    const decipher = crypto.createDecipher('aes192', key);
    // Decrypt the data
    let decrypted = decipher.update(text, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted
}


async function createCustomer(name, customerReferenceId) {
    const customer = await stripe.customers.create({
      name: name,
      metadata: {
        CustomerReferenceId: customerReferenceId,
      },
    });
  
    return customer.id;
}
  





async function createPaymentLink(customerId, amount, currency) {
    const price = await stripe.prices.create({
        unit_amount: amount,
        currency: 'usd',
        product_data: {
            name: 'Physical Therapy',
            type: 'service',
        },
    });

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
          price_data: {
            currency: currency,
            unit_amount: amount,
            product_data: {
              name: 'Lake City Physical Therapy',
            },
          },
          quantity: 1,
        }],
        mode: 'payment',
        success_url: 'https://lakecitypt.com/contact-us',
        customer: customerId
      });
    
    return session;

}


module.exports = {
    createCustomer,
    createPaymentLink,
    encrypt,
    decrypt
}
