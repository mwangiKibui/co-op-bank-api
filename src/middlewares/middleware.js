
const { default: axios } = require('axios');
const qs = require('qs');

const getAccessToken = async (req,res,next) => {

        
    var data = qs.stringify({
    'grant_type': 'client_credentials' 
    });


    var config = {

    method: 'post',
    url: 'http://developer.co-opbank.co.ke:8280/token',
    headers: { 
        'Content-Type': 'application/x-www-form-urlencoded', 
        'Authorization': 'Basic QWZQNXVHSDZBdTZWWHlRU1RlNUswNHY3SkFNYTpZZXJOY084Vm9tTW1rRXdyeE1ZRHdiWTA3aThh'
    },
    data : data

    };

    let response = await axios(config).catch(console.log);

    let access_token = response.data['access_token'];

    req.access_token = access_token;

    console.log("access_token",req.access_token)

    return res.send({
        success:true
    });

};

module.exports = {
    getAccessToken
};