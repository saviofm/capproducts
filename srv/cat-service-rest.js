const cds = require('@sap/cds');
/*
const xsenv = require("@sap/xsenv");
const { getBundle } = require('./common/i18n');
const AWS = require('aws-sdk')
*/
const fetch = require('node-fetch');



class CatalogServiceRest extends cds.ApplicationService {
    init() {
        
        //----------------------------------------------------------------------------------//
        //----------------------------------------------------------------------------------//
        //----------------------------------------------------------------------------------//
        // getEAN - Aqui será feito a da API de EAN                                        //
        //----------------------------------------------------------------------------------//
        //----------------------------------------------------------------------------------//
        //----------------------------------------------------------------------------------//
        
        this.on('getEAN',  async (req) => {  
            let barcode = req.data.barcode;

            if (barcode) {
                try {
                
                    const url = `https://api.barcodelookup.com/v3/products?barcode=${barcode}&formatted=y&key=0s36qj59io3mg6f14t60ib35q7etd8`;
                    const method = "GET";
                    const headers = new fetch.Headers();

                    headers.set("Content-Type", 'application/json');


                    const result = await fetch(url, { method:method, headers:headers }).then((res)=>{
                        return res.json()
                    });

                    return result.products[0];
           
                } catch (error) {
                    console.log(error);
                    req.error(410, error.message);
                    return;    
                }
            }
        });        
        
        return super.init();
    }
}

module.exports = { CatalogServiceRest };
