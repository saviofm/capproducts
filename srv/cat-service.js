const cds = require('@sap/cds');
const xsenv = require("@sap/xsenv");
const { getBundle } = require('./common/i18n');


const AWS = require('aws-sdk')

class CatalogService extends cds.ApplicationService {
    init() {
        /*
        //----------------------------------------------------------------------------------//
        //----------------------------------------------------------------------------------//
        //----------------------------------------------------------------------------------//
        // getWeight - Aqui será feito a chamada a uma balança                              //
        //----------------------------------------------------------------------------------//
        //----------------------------------------------------------------------------------//
        //----------------------------------------------------------------------------------//
        
        this.on('getWeight',  async (req) => {  
            let pesoBruto = (Math.floor(Math.random() * 22000) + 3000) / 1000;
            let tara =  (Math.floor(Math.random() * 500) + 500) / 1000;
            let pesoLiquido = Math.round((pesoBruto - tara) * 1000)/1000;
            //Aguardando 1 segundo
            await new Promise(r => setTimeout(r, 1000));

            return {
                pesoBruto   : pesoBruto,
                pesoLiquido : pesoLiquido,
                tara        : tara,
            }
        });        
        */
        return super.init();
    }
}

module.exports = { CatalogService };
