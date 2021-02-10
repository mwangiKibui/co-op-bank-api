require("dotenv").config();

const express = require('express');

const axios = require('axios');

const app = express();

app.use(express.json());

app.use(express.urlencoded({extended:false}));


//the routes

app.post('/get-access-token', async (req,res) => {

    let url = process.env.ACCESS_TOKEN_URL;

    let auth = `Basic ${new Buffer.from(`${process.env.CONSUMER_KEY}:${process.env.CONSUMER_SECRET}`).toString("base64")}`;

    let result = await axios.default.get(url,{
        headers:{
            'Authorizaion':auth,
            'content-type':"application/json"
        }
    })
    
    .then(result => {

        console.log("result from get-access-token");

        console.log(result.data)

    })

    .catch(console.log);

    return res.send({
        success:true,
        message:result.data
    });

})


//sending to mpesa.

app.post('/send-to-mpesa',async (req,res) => {

    let result = await axios.default.post(
        'https://developer.co-opbank.co.ke:8243/FundsTransfer/External/A2M/Mpesa/',
        {
            "CallBackUrl": "http://a028a476fbcd.ngrok.io/ft-callback", // ngrok hosted url
            "Destinations": [
                {
                "MobileNumber": "254791569999",
                "Narration": "Stationary Payment",
                "ReferenceNumber": "40ca18c6765086089a1_1",
                "Amount": "30"
                }
            ],
            "MessageReference": "40ca18c6765086089a1",
            "Source": {
                "Narration": "Testing the send-to-mpesa workaround",
                "Amount": "30",
                "TransactionCurrency": "KES",
                "AccountNumber": "01108629342700"
            }
        },{
            headers:{
                "Authorization":"Bearer d8713384-2cbf-31dc-81fc-e8601e8e1202",
                "content-type":"application/json"
            }
        }
    ).catch(console.log);

    result = await result.data;

    console.log('result',result);

    return res.send({
        success:true
    });

});

//callback

app.post('/ft-callback', (req,res) => {

    console.log("In the callback");

    console.dir(req,{depth:null})

})

const PORT = process.env.PORT || 4000;

async function main(){

    await app.listen(PORT, () => {
        console.log(`app started on ${PORT}`)
    });

};

main().catch(console.log);