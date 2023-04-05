const express = require('express');
const app = express();
const cors = require('cors');
const fetch = require('node-fetch')
var CronJob = require('cron').CronJob;
require('dotenv').config()
var moment = require('moment');
const jwt = require('jsonwebtoken');
const {
    encrypt,
    decrypt,
    createCustomer,
    createPaymentLink

} = require('./helper/crypto.js')

const cron = require('node-cron');

const accountSid = process.env.TW_ID;
const authToken = process.env.TW_TOKEN;
const client = require('twilio')(accountSid,authToken);

const { GoogleSpreadsheet } = require('google-spreadsheet');

const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);

// cron.schedule('30 12,18 * * *', async () => {
    cron.schedule('5 15 * * *', async () => {
    console.log('Running the tasks at 12:30pm and 6:30pm every day');
    // add your task code here
    try{


        await doc.useServiceAccountAuth({
            client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
        });


        await doc.loadInfo(); // loads document properties and worksheets

        const firstSheet = await doc.sheetsByIndex[0]

        let chekc=[]
        const col = await firstSheet.getRows()
        let i = 0;
        while(i < col.length){
            if(col[i]["Texted"] !== "Yes"){

                chekc.push({index: i, id: col[i]["Patient Account Number"], name: col[i]["Patient Name"], owed: col[i]["Total Outstanding"], number: col[i]["phoneNumber"]})
                
            }
            i++

        }

        const selectedNumbers = chekc.slice(0, 5); // Send message to first 5 numbers in the list

        selectedNumbers.forEach(async number => {
            console.log(number.id)
            const link = encrypt(number.id, process.env.SECRET)
            console.log(link)
            client
            .messages
            .create({
                body: `Hi ${number.name.split(' ')[0]},\nThis is friendly reminder from Lake City PT letting you know you have an balance. If you'd like to make a payment please use the link below.\n https://lakecitypt.com/${link}`,
                from: process.env.TWILIONUMBER,
                to: number.number})
            .then(message => {
                console.log(message.sid)
                console.log(`Message sent to ${message.to}`)

            })
            .catch(error => console.error(`Error sending message to ${number}: ${error.message}`));
            await firstSheet.loadCells();
            const cell = await firstSheet.getCell(number.index+1, 3)
            cell.value = "Yes";
    
    // Save the changes to the sheet
            await firstSheet.saveUpdatedCells();

        });
    }
    catch(err){
        console.log(err)
    }
});

app.use(cors());

app.use(express.json({
    type: ['application/json', 'text/plain']
}));





// define the first route
app.get("/", function (req, res) {
  res.send("<h1>Send it to My Design Book </h1>")
})



app.route('/patient')
.post(async (req,res) =>{

    console.log(req.body)

    const amountInDollars = req.body.amount;
    const amountInCents = Math.round(amountInDollars * 100);


    try{
        const cust = await createCustomer(req.body.name, req.body.id)
        const pay = await createPaymentLink(cust, amountInCents, 'usd')
        console.log(pay.url)
        res.status(200).send(pay.url)

        await doc.useServiceAccountAuth({
            client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
        });

        await doc.loadInfo(); // loads document properties and worksheets
        const firstSheet = await doc.sheetsByIndex[0]
        await firstSheet.loadCells();
        const cell = await firstSheet.getCell(req.body.index+1, 4)
        cell.value = "Yes";

// Save the changes to the sheet
        await firstSheet.saveUpdatedCells();



    }catch(error){
        console.log(error)
        res.status(500).send(error.message)

    }
    
    

    
    


    // console.log('Testing')
    // await doc.useServiceAccountAuth({
    //     client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    //     private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    // });

    // await doc.loadInfo(); // loads document properties and worksheets
    // await doc.updateProperties({title: "Etsy Design Book"})

    // const firstSheet = await doc.sheetsByIndex[0]
    // await firstSheet.addRows([
    //     { Time: moment().format('MMMM Do YYYY, h:mm:ss a') , Title: req.body.Title, Picture: req.body.Picture, Url: req.body.Url, Item_reviews: req.body.Item_reviews, Total_reviews: req.body.Total_reviews},
    // ]);



})

.get(async (req,res)=>{

    // console.log(req.query)



    try{


        const patient = await decrypt(req.query.id, process.env.SECRET)
        console.log(patient, "Patient")


        await doc.useServiceAccountAuth({
            client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
        });


        await doc.loadInfo(); // loads document properties and worksheets

        const firstSheet = await doc.sheetsByIndex[0]
       

        let chekc=[]
        const col = await firstSheet.getRows()
        let i = 0;
        while(i < col.length){
            if(col[i]["Patient Account Number"] === patient){

                chekc.push({index: i, id: col[i]["Patient Account Number"], name: col[i]["Patient Name"], owed: col[i]["Total Outstanding"] })
                
            }
            i++

        }
        // console.log(encrypt(col[0]["Account Number"], process.env.SECRET))
//         await firstSheet.loadCells();
//         const cell = await firstSheet.getCell(chekc[0].index+1, 3)
//         cell.value = "Yes";

// // Save the changes to the sheet
//         await firstSheet.saveUpdatedCells();
        res.send(chekc)
    }catch(error){
        console.log(error)
    }
    

})


app.route('/text')
.get( async (req, res)=>{




    try{




        await doc.useServiceAccountAuth({
            client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
        });


        await doc.loadInfo(); // loads document properties and worksheets

        const firstSheet = await doc.sheetsByIndex[0]

        let chekc=[]
        const col = await firstSheet.getRows()
        let i = 0;
        while(i < col.length){
            if(col[i]["Texted"] !== "Yes"){

                chekc.push({index: i, id: col[i]["Patient Account Number"], name: col[i]["Patient Name"], owed: col[i]["Total Outstanding"], number: col[i]["phoneNumber"]})
                
            }
            i++

        }

        const selectedNumbers = chekc.slice(0, 5); // Send message to first 5 numbers in the list

        selectedNumbers.forEach(number => {
            console.log(number.id)
            const link = encrypt(number.id, process.env.SECRET)
            console.log(link)
            client
            .messages
            .create({
                body: `Hi ${number.name.split(' ')[0]},\nThis is friendly message from Lake City PT letting you know you have an balance. If you'd like to make a payment please use the link below.\n https://lakecitypt.com/${link}`,
                from: '+12083142483',
                to: number.number})
            .then(message => {
                console.log(message.sid)
                console.log(`Message sent to ${message.to}`)
            })
            .catch(error => console.error(`Error sending message to ${number}: ${error.message}`));
        });
    }
    catch(err){
        console.log(err)
    }


    // for(let i=0; i < recips.length; i++){
    //     client
    //     .messages
    //     .create({
    //         body: `Hi an important message was sent in the Webex Provider Group please check for reference.`,
    //         from: '+18557551240',
    //         to: recips[i]})
    //     .then(message => {
    //         console.log(message.sid)
    //         res.status(200).send(JSON.stringify(message.sid))
    //     });

    // }

})






const port = process.env.PORT || 3001

app.listen(port, () =>{
    console.log('SERVER RUNNING', port)
})