require('dotenv').config()


const api = (req,res, next) => {
    var token = req.headers["x-access-token"];
    console.log(token)
    if(token !== process.env.RANDOMPROTECTION){
        return res.status(323).send("Wrong API Key")
    }else{
        next();
    }

};

module.exports = {api};