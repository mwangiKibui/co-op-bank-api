
const express = require('express');

const router = express.Router();

const Coop = require('../controllers/Coop');

router.get(
    '/access-token',
    (req,res,next) => new Coop().getAccessToken(req,res,next)
);

router.post(
    `/send-to-mpesa`,
    (req,res,next) => new Coop().getAccessToken(req,res,next),
    (req,res,next) => new Coop().sendToMpesa(req,res,next)
);

router.post(
    `/callback`,
    (req,res,next) => new Coop().callback(req,res,next)
)

router.post(
    `/account-mini-statement`,
    (req,res,next) => new Coop().getAccessToken(req,res,next),
    (req,res,next) => new Coop().accountMinistatement(req,res,next)
);

router.post(
    `/account-full-statement`,
    (req,res,next) => new Coop().getAccessToken(req,res,next),
    (req,res,next) => new Coop().accountFullstatement(req,res,next)
);

router.post(
    `/account-balance`,
    (req,res,next) => new Coop().getAccessToken(req,res,next),
    (req,res,next) => new Coop().accountBalance(req,res,next)
)

module.exports = router;