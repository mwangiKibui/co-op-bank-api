require('dotenv').config();
const axios = require('axios');
const qs = require('querystring');
const uniqueString = require('unique-string');
const https = require('https');

/**
 * @class
 */
class CoopController {

    constructor(){

        this.data = qs.stringify({
            'grant_type':'client_credentials'
        });

    };

    /**
     * Get the access token
     * @returns {string} - The access token
     */
    async getAccessToken(req,res,next){

        let buff = new Buffer.from(`${process.env.CONSUMER_KEY}:${process.env.CONSUMER_SECRET}`);
        let buff_data = buff.toString("base64");

        let config = {
            method:'POST',
            url:'http://developer.co-opbank.co.ke:8280/token',
            headers:{
                'Content-Type':'application/x-www-form-urlencoded',
                'Authorization':`Basic ${buff_data}`
            },
            data:this.data
        };

        let response = await axios.default(config).catch(console.log);

        req.access_token = response.data.access_token;

        return next();

    };

    /**
     * Send to Mpesa.
     * 
     */
    async sendToMpesa(req,res,next){

        let access_token = req.access_token;
        let url = process.env.SEND_TO_MPESA_URL;
        let auth = `Bearer ${access_token}`;
        let cbUrl = "https://f044e1e49aed.ngrok.io/callback";

        let refNo = uniqueString().slice(0,14);
        let msgRef = uniqueString().slice(0,14);

        let response = await axios.default({
            httpsAgent:new https.Agent({
                rejectUnauthorized:false
            }),
            method:'POST',
            url,
            data:{
                "CallBackUrl": cbUrl,
                "Destinations": [
                    {
                    "MobileNumber": "254791569999",
                    "Narration": "Supplier Payment",
                    "ReferenceNumber": refNo,
                    "Amount": "50"
                    }
                ],
                "MessageReference": msgRef,
                "Source": {
                    "Narration": "Supplier Payment",
                    "Amount": "50",
                    "TransactionCurrency": "KES",
                    "AccountNumber": "36001873000"
                }
            },
            headers:{
                'Authorization':auth
            }
        }).catch(console.log);


        return res.send({
            message:response.data
        });

    };

    /**
     * account ministatement
     */
    async accountMinistatement(req,res,next){

        let url = process.env.MINISTATEMENT_URL;
        let access_token = req.access_token;
        let auth = `Bearer ${access_token}`;

        let msgRef = uniqueString().slice(0,14);

        let response = await axios.default({
            url,
            method:'POST',
            data:{
                "MessageReference": `${msgRef}`,
                "AccountNumber": process.env.DEFAULT_ACCOUNT_NO
            },
            headers:{
                'Authorization':auth
            }
        }).catch(console.log);

        return res.send({
            message:response.data
        });

    };

    /**
     * account fullstatement
     */
    async accountFullstatement(req,res,next){

        let url = process.env.FULLSTATEMENT_URL;
        let access_token = req.access_token;
        let auth = `Bearer ${access_token}`;

        let msgRef = uniqueString().slice(0,14);
        let startDate = "2020-11-01";
        let endDate = "2021-03-01";

        let response = await axios.default({
            url,
            method:'POST',
            data:{
                "MessageReference":`${msgRef}`,
                "AccountNumber":process.env.DEFAULT_ACCOUNT_NO,
                "StartDate": startDate,
                "EndDate": endDate
            },
            headers:{
                'Authorization':auth
            }
        }).catch(console.log);

        return res.send({
            message:response.data
        });

    };

    /**
     * account balance
     */
    async accountBalance(req,res,next){

        let url = process.env.ACCOUNT_BALANCE_URL;
        let access_token = req.access_token;
        let auth = `Bearer ${access_token}`;

        let msgRef = uniqueString().slice(0,14);

        let response = await axios.default({
            method:'POST',
            url,
            data:{
                "MessageReference":msgRef,
                "AccountNumber":process.env.DEFAULT_ACCOUNT_NO
            },
            headers:{
                'Authorization':auth
            }
        }).catch(console.log);

        return res.send({
            message:response.data
        });

    };

    /**
     * callback
     */
    async callback(req,res,next){

        console.log("...request...");

        console.log(req.body);

    }
};

module.exports = CoopController;