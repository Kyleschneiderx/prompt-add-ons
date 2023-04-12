const express = require('express');
const router = express.Router();
require('dotenv').config()


const stripe = require('stripe')(process.env.STRIPE_KEY);

const { GoogleSpreadsheet } = require('google-spreadsheet');
const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);



// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;


router.route('/')
.post(express.raw({ type: 'application/json' }), async (req, res) => {
    const signature = req.headers['stripe-signature'];
  
    let event;
    try {
      event = stripe.webhooks.constructEvent(req.body, signature, endpointSecret);
    } catch (err) {
      console.error('Error verifying webhook signature', err);
      return res.sendStatus(400);
    }

    // Handle the event

    switch (event.type) {
        case 'charge.succeeded':
            const chargeSucceeded = event.data.object;
            console.log(chargeSucceeded)
            const chargeId = chargeSucceeded.payment_intent;

            // Define and call a function to handle the event charge.succeeded
            try {
                await doc.useServiceAccountAuth({
                    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
                    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
                });
                await doc.loadInfo(); // loads document properties and worksheets
                const firstSheet = await doc.sheetsByIndex[0];
        
                let chekc = [];
                const col = await firstSheet.getRows();
                let i = 0;
                while (i < col.length) {
                    if (col[i]["sessionId"] === chargeId) {
                        chekc.push({index: i, id: col[i]["Patient Account Number"], name: col[i]["Patient Name"], owed: col[i]["Total Outstanding"], number: col[i]["phoneNumber"], paid: chargeSucceeded.amount/100});
                    }
                    i++;
                }

            
                if (chekc.length !== 0) {
                    await firstSheet.loadCells();
                    const paidAmount = await firstSheet.getCell(chekc[0].index+1, 9)
                    paidAmount.value = chekc[0].paid;
        
                    const out = await firstSheet.getCell(chekc[0].index+1, 2)
                    const newTotal = chekc[0].owed - chekc[0].paid
                    out.value = newTotal
            
            // Save the changes to the sheet
                    await firstSheet.saveUpdatedCells();
                }





            } catch(err) {
                console.error(err);
                next(err);
            }

            break;
        // ... handle other event types
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    res.sendStatus(200);
});


module.exports = router;