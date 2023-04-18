const express = require('express');
const router = express.Router();
require('dotenv').config()

router.route('/')
.post(async (req, res) => {


    console.log(req.body)





    // const existingPdfBytes = fs.readFileSync('./pdfFile/Amerigroup SH S. Harrod.pdf');
    // const pdfDoc = await PDFDocument.load(existingPdfBytes);
    // const form = pdfDoc.getForm()
    // form.getTextField('First name').setText('Jennifer');
    // form.getTextField('Last name').setText('Anderson');
    // form.getTextField('Amerigroup ID').setText('109093848');
    // form.getTextField('Phone number').setText('2088183015');
    // form.getTextField('Address').setText('14953 E Hayden Lake Rd');
    // form.getTextField('Date of birth').setText('14953 E Hayden Lake Rd');

    // const fields = form.getFields()

    // // console.log(fields[0].doc)
    
    // const fieldNames = form.getFields().map(field => console.log(field.getName()));
    // // const fieldLabels = fieldNames.map(name => {
    // //   const field = form.getField(name);
    // //   return field.getFullyQualifiedName();
    // // });
    
    // console.log(fieldNames);
    // // form.getTextField('name').setText('John Smith');
    // // form.getCheckbox('agree').check();
    // // form.getRadioGroup('gender').select('male');
    // // form.getDropdown('country').select('Canada');

    // const filledOutPdfBytes = await pdfDoc.save();
    // // fs.writeFileSync('./pdfdownload/SHfilled-out-form.pdf', filledOutPdfBytes);



    // Return a 200 response to acknowledge receipt of the event
    res.sendStatus(200);
});


module.exports = router;