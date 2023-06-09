require('dotenv').config()


const api = (req,res, next) => {
    var token = req.headers["x-access-token"];
    if(token !== process.env.RANDOMPROTECTION){
        return res.status(323).send("Wrong API Key")
    }else{
        console.log('Next')
        next();
    }

};

module.exports = {api};