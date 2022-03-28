const cds = require('@sap/cds');
const validation = require('./common/validation')
const crud = require('./common/crud')
const xsenv = require("@sap/xsenv");
const AWS = require('aws-sdk');
const fetch = require('node-fetch');




class CatalogServiceRest extends cds.ApplicationService {
    init() {

        //----------------------------------------------------------------------------------//
        //----------------------------------------------------------------------------------//
        //----------------------------------------------------------------------------------//
        // INIT - Instanciando S3                                                           //
        //----------------------------------------------------------------------------------//
        //----------------------------------------------------------------------------------//
        //----------------------------------------------------------------------------------//

        xsenv.loadEnv();
        const objectstore = xsenv.readServices()['capproducts-objectstore-service'];
        const bucket = objectstore.credentials.bucket
        const credentials = new AWS.Credentials(
            objectstore.credentials.access_key_id,
            objectstore.credentials.secret_access_key
        );
        AWS.config.update({
            region: objectstore.credentials.region,
            credentials: credentials
        })
        const s3 = new AWS.S3({
            apiVersion: '2006-03-01'
        })
        //----------------------------------------------------------------------------------//
        //----------------------------------------------------------------------------------//
        //----------------------------------------------------------------------------------//
        // getEAN - Aqui será feito a da API de EAN                                         //
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
                    let product = result.products[0];
                    
                    return {
                        barcode: product.barcode_number,
                        productName: product.title,
                        productDescription: product.description,
                        brand: product.brand,
                        imageUrl: product.images[0]
                    }

           
                } catch (error) {
                    console.log(error);
                    req.error(410, error.message);
                    return;    
                }
            }
        }); 
        
         //----------------------------------------------------------------------------------//
        //----------------------------------------------------------------------------------//
        //----------------------------------------------------------------------------------//
        // PRODUCTS - Create - Valida se o EAN já existe                                    //
        //----------------------------------------------------------------------------------//
        //----------------------------------------------------------------------------------//
        //----------------------------------------------------------------------------------//
        this.before('CREATE', 'Products', async (req) => {
            return await validation.ProductCreate(req);  
        });

        //----------------------------------------------------------------------------------//
        //----------------------------------------------------------------------------------//
        //----------------------------------------------------------------------------------//
        // PRODUCTS - Create - Obtém o Content e faz a criação                              //
        //----------------------------------------------------------------------------------//
        //----------------------------------------------------------------------------------//
        //----------------------------------------------------------------------------------//
        this.on('CREATE', 'Products', async (req, next) => {
            if (req.data.imageContent) {
                return await crud.ProductCreate(req, s3, bucket)
            } else {
                return next();
            }
        }); 
        //----------------------------------------------------------------------------------//
        //----------------------------------------------------------------------------------//
        //----------------------------------------------------------------------------------//
        // PRODUCTS - READ -  Obtém o stream                         //
        //----------------------------------------------------------------------------------//
        //----------------------------------------------------------------------------------//
        //----------------------------------------------------------------------------------//
        this.on('READ', 'Products', (req, next) => {
            if (req.data.ID && req.headers['content-type'] === 'application/octet-stream') {            
                const params = {
                    Bucket: objectstore.credentials.bucket,
                    Key: req.data.ID
                };
                return s3.getObject(params).createReadStream()
                
 
            } else {
                return next()
            }
        });
        //----------------------------------------------------------------------------------//
        //----------------------------------------------------------------------------------//
        //----------------------------------------------------------------------------------//
        // PRODUCTS - READ - Obtém o Content como stream e o url                            //
        //----------------------------------------------------------------------------------//
        //----------------------------------------------------------------------------------//
        //----------------------------------------------------------------------------------//
        this.after('READ', 'Products', (each, req) => {
            if (!req.headers['content-type'] === 'application/octet-stream') {
                crud.ProductRead(each, s3, bucket);
            }
        });
        //----------------------------------------------------------------------------------//
        //----------------------------------------------------------------------------------//
        //----------------------------------------------------------------------------------//
        // PRODUCTS -  FUNCTION CONTENT - get Image Content                                 //
        //----------------------------------------------------------------------------------//
        //----------------------------------------------------------------------------------//
        //----------------------------------------------------------------------------------//
        this.on('imageContent', 'Products', async (req) => {
            
            let oProduct = await cds.run(req.query);
            if (oProduct.length > 0) {
                oProduct = oProduct[0];
                //if (oProduct[0].ID && req.headers['content-type'] === 'application/octet-stream') {
                         
                    const params = {
                        Bucket: objectstore.credentials.bucket,
                        Key: oProduct.ID
                    };
                    
                    const object = await s3.getObject(params).promise();
                    req.res.contentType(oProduct.imageType);
                    //req.res.contentType('application/octet-stream');
                    return object.Body;

                //}
            } else {
                req.error(410, "not found");
            }
        
        });
       
        //----------------------------------------------------------------------------------//
        //----------------------------------------------------------------------------------//
        //----------------------------------------------------------------------------------//
        // Products - UPDATE - Verifica se o EAN existe e é diferente do produto atual      //
        //----------------------------------------------------------------------------------//
        //----------------------------------------------------------------------------------//
        //----------------------------------------------------------------------------------//
        this.before('UPDATE', 'Products', async (req) => {
            return await validation.ProductUpdate(req);        
        });
        
        //----------------------------------------------------------------------------------//
        //----------------------------------------------------------------------------------//
        //----------------------------------------------------------------------------------//
        // Products - UPDATE - Verifica conteúdo                                            //
        //----------------------------------------------------------------------------------//
        //----------------------------------------------------------------------------------//
        //----------------------------------------------------------------------------------//
        this.on('UPDATE', ['Products','ProductsFiori'], async (req, next) => {
            if (req.data.imageContent) {
                return await crud.ProductCreate(req, s3, bucket)
            } else {
                return next();
            }
            
        });
        
        //----------------------------------------------------------------------------------//
        //----------------------------------------------------------------------------------//
        //----------------------------------------------------------------------------------//
        // Products - DELETE - Elimina conteúdo                                            //
        //----------------------------------------------------------------------------------//
        //----------------------------------------------------------------------------------//
        //----------------------------------------------------------------------------------//
        this.before('DELETE', ['Products','ProductsFiori'], async (req) => {
           
            await validation.ProductDelete(req);

            return await crud.ProductDelete(req, s3, bucket);
            
        });


        return super.init();
    }
}

module.exports = { CatalogServiceRest };
