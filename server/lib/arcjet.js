import arcjet, { tokenBucket, shield, detectBot, slidingWindow } from "@arcjet/node";

import "dotenv/config"

export const aj = arcjet({
    key: process.env.ARCJ_KEY,
    characteristics:["ip.src"],
    rules: [
        shield({mode: "LIVE"}),
        detectBot({
            mode:"LIVE",
            allow: [
                "CATEGORY:SEARCH_ENGINE",
                //lista de todas las categorias https://arcjet.com/bot-list
            ],
        }),

        tokenBucket({
            mode: "LIVE",
            refillRate: 30,
            interval: 5,
            capacity: 20,
        })

        
    ]
})