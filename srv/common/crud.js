const cds = require('@sap/cds');

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
}

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
    const data = await s3.upload(params).promise();

    return tx.update(cds.entities.Products)
        .set({
            imageType: contentType
        })
        .where({
            ID: req.data.ID
        });
    
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

module.exports = {
    ProductRead,
    ProductCreate,
    ProductUpdate,
    ProductDelete
}