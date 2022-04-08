const cds = require('@sap/cds');
const validation = require('./common/validation')
const crud = require('./common/crud')
const xsenv = require("@sap/xsenv");
const AWS = require('aws-sdk');


class CatalogService extends cds.ApplicationService {
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
        const bucket = objectstore.credentials.bucket;
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
        // getEAN - API EAN                                                                 //
        //----------------------------------------------------------------------------------//
        //----------------------------------------------------------------------------------//
        //----------------------------------------------------------------------------------//
        
        this.on('getEAN',  async (req) => {  
            return await crud.getEANAPI(req);   
            
        }); 
        //----------------------------------------------------------------------------------//
        //----------------------------------------------------------------------------------//
        //----------------------------------------------------------------------------------//
        // PRODUCTS -  FUNCTION CONTENT - Post Image Content                                 //
        //----------------------------------------------------------------------------------//
        //----------------------------------------------------------------------------------//
        //----------------------------------------------------------------------------------//
        this.on('postImageContent', async (req) => {
            return await crud.postImageContentRest(req, s3, bucket);   
           
        
        });
        //----------------------------------------------------------------------------------//
        //----------------------------------------------------------------------------------//
        //----------------------------------------------------------------------------------//
        // PRODUCTS - Create - Valida se o EAN já existe                                    //
        //----------------------------------------------------------------------------------//
        //----------------------------------------------------------------------------------//
        //----------------------------------------------------------------------------------//
        this.before('CREATE', ['Products', 'ProductsFiori'], async (req) => {
            return await validation.ProductCreate(req);
        });
  
        //----------------------------------------------------------------------------------//
        //----------------------------------------------------------------------------------//
        //----------------------------------------------------------------------------------//
        // PRODUCTS - Create - Obtém o Content e faz a criação                              //
        //----------------------------------------------------------------------------------//
        //----------------------------------------------------------------------------------//
        //----------------------------------------------------------------------------------//
        this.on('CREATE', ['Products','ProductsFiori'], async (req, next) => {
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
        this.on('READ', ['Products','ProductsFiori'], (req, next) => {
            if (req.data.ID && req.query._streaming) {            
                const params = {
                    Bucket: objectstore.credentials.bucket,
                    Key: req.data.ID
                };
                
               return {
                   value: s3.getObject(params).createReadStream()
               };
 
            } else {
                return next()
            }
        });
        //----------------------------------------------------------------------------------//
        //----------------------------------------------------------------------------------//
        //----------------------------------------------------------------------------------//
        // PRODUCTS - READ - Obtém o url                            //
        //----------------------------------------------------------------------------------//
        //----------------------------------------------------------------------------------//
        //----------------------------------------------------------------------------------//
        this.after('READ', ['Products','ProductsFiori'], (each, req) => {
            if (!req.query._streaming) {
                crud.ProductRead(each, s3, bucket);
            }
        });
        //----------------------------------------------------------------------------------//
        //----------------------------------------------------------------------------------//
        //----------------------------------------------------------------------------------//
        // Products - UPDATE - Verifica se o EAN existe e é diferente do produto atual      //
        //----------------------------------------------------------------------------------//
        //----------------------------------------------------------------------------------//
        //----------------------------------------------------------------------------------//
        this.before('UPDATE', ['Products', 'ProductsFiori'], async (req) => {  
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

module.exports = { CatalogService };
