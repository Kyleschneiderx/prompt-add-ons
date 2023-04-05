// import { google } from 'googleapis';

// // Load the API credentials from the JSON file you downloaded
// const credentials = require('./path/to/credentials.json');

// // Set up the authentication client
// const auth = new google.auth.JWT(
//   credentials.client_email,
//   null,
//   credentials.private_key,
//   ['https://www.googleapis.com/auth/spreadsheets']
// );



// // require('dotenv').config()

// const getRows = async ()=>{
//     sheets.spreadsheets.values.get({
//         auth,
//         spreadsheetId: 'your-spreadsheet-id',
//         range: 'Sheet1!A1:B2',
//       }, (err, res) => {
//         if (err) return console.log('The API returned an error: ' + err);
//         const rows = res.data.values;
//         if (rows.length) {
//           console.log('Data:');
//           rows.forEach(row => {
//             console.log(`${row[0]}, ${row[1]}`);
//           });
//         } else {
//           console.log('No data found.');
//         }
//     });
  
// }



// module.exports = {
//     getRows
// }


