const cds = require('@sap/cds');
const fetch = require('node-fetch');
function ProductRead(each, s3, bucket) {
    if (each?.imageType) {
        const params = {
            Bucket: bucket,
            Key: each.ID
        };
        
        try {
            each.imageUrl = s3.getSignedUrl('getObject', params) 
        } catch (error) {
            
        }
    }
};

async function ProductCreate(req, s3, bucket){
    const tx = cds.transaction(req);
    const contentType = req._.req.headers['content-type']
    const params = {
        Bucket: bucket,
        Key: req.data.ID,
        Body: req.data.imageContent,
        ContentType: contentType
    };
    req.data.imageContent = null;
    try {
        
   
    const data = await s3.upload(params).promise();

    return tx.update(cds.entities.Products)
        .set({
            imageType: contentType,
        })
        .where({
            ID: req.data.ID
        });
    } catch (error) {
      console.log(error);
    }
};

async function ProductUpdate(req){
    
};

async function ProductDelete(req, s3, bucket){

    const tx = cds.transaction(req);

    //Somente faz alteração caso tenha o ID
    if (req.data.ID) {
        let delObject =  await tx.read(cds.services.CatalogService.entities.Products, ['imageType'])
            .where({ID: req.data.ID});
        if (delObject.length > 0 && delObject[0].imageType){              
            const params = {
                Bucket: bucket,
                Key: req.data.ID
            };
            await s3.deleteObject(params).promise();
        
        

            if (req.data.imageContent !== undefined && req.data.imageContent === null) {
                return await tx.update(cds.services.CatalogService.entities.Products)
                    .set({imageType: null})
                    .where({ID: req.data.ID});
            }
        }
    }
};

async function ProductDeleteRest(req, s3, bucket){

    const tx = cds.transaction(req);

    //Somente faz alteração caso tenha o ID
    let delObject =  await cds.run(req.query);
    if (delObject.length > 0 && delObject[0].imageType){              
        const params = {
            Bucket: bucket,
            Key: delObject[0].ID
        };
        const s3Object = await s3.deleteObject(params).promise();
        return await tx.update(cds.services.CatalogService.entities.Products)
            .set({imageType: null})
            .where({ID: delObject[0].ID});
    }
};


async function imageContentRest(req, s3, bucket) {
    let oProduct = await cds.run(req.query);
    if (oProduct.length > 0) {
        oProduct = oProduct[0];
                   
            const params = {
                Bucket: bucket,
                Key: oProduct.ID
            };
            
            const object = await s3.getObject(params).promise();
            req.res.contentType(oProduct.imageType);
        
            return object.Body;

        //}
    } else {
        req.error(410, "not found");
    }
    
};

async function postImageContentRest(req, s3, bucket) {
    const tx = cds.transaction(req);

    let Object =  await tx.read(cds.services.CatalogService.entities.Products, ['ID'])
        .where({ID: req.data.ID});;
    if (Object.length === 0) {
        req.error(410, "not found");
    }
    // separate out the mime component
    let contentType = req.data.contentURL.split(',')[0].split(':')[1].split(';')[0]
    let contentEncoding = req.data.contentURL.split(',')[0].split(':')[1].split(';')[1]
    let data = req.data.contentURL.split(',')[1]; 
    let buf = Buffer.from(data,contentEncoding);


    const params = {
        Bucket: bucket,
        Key: req.data.ID,
        Body: buf,
        ContentType: contentType,
        //ContentEncoding: contentEncoding
    };
   
    try {
        
   
    const data = await s3.upload(params).promise();

    return tx.update(cds.entities.Products)
        .set({
            imageType: contentType,
        })
        .where({
            ID: req.data.ID
        });
    } catch (error) {
      console.log(error);
    }
}

async function getEANAPI(req) {
    let barcode = req.data.barcode;

    if (barcode) {
        try {
        
            const url = `https://barcode.monster/api/${barcode}` 
            const method = "GET";
            const headers = new fetch.Headers();

            headers.set("Content-Type", 'application/json');

            const result = await fetch(url, { method:method, headers:headers }).then((res)=>{
                return res.json()
            });
            
            return {
                barcode: result.code,
                productName: result.description.replace("(from barcode.monster)", ""),
                brand: result.company,
                imageUrl: result.image_url
            }

    
        } catch (error) {
            console.log(error);
            req.error(410, error.message);
            return;    
        }
    }
}

module.exports = {
    ProductRead,
    ProductCreate,
    ProductUpdate,
    ProductDelete,
    ProductDeleteRest,
    imageContentRest,
    postImageContentRest,
    getEANAPI
}