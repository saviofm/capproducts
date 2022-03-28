const cds = require('@sap/cds');
const { getBundle } = require('./i18n');

async function ProductCreate(req){
    let bundle = getBundle(req.user.locale);
    const tx = cds.transaction(req);
    let EAN = req.data.EAN.replace(" ","");
            
    let oProduct =  await tx.read(cds.services.CatalogService.entities.Products, ['ID'])
                        .where(
                            { 
                                EAN: EAN
                            }
                        );

    if (oProduct.length > 0) {
        const txt = bundle.getText("mERROR_UNIQUE",[req.data.EAN, bundle.getText("mEAN")]);
        return req.error(410, txt);
    }
};

async function ProductUpdate(req){
    let bundle = getBundle(req.user.locale);
    const tx = cds.transaction(req);
    //Validar EAN
    let EAN = req.data.EAN?.replace(" ","");     
    if (EAN) {
    let oProduct =  await tx.read(cds.services.CatalogService.entities.Products, ['ID'])
                        .where(
                        { 
                            ID: {
                                '<>': req.data.ID
                            },
                            EAN: EAN
                        }
                    );
        if (oProduct.length > 0) {
            const txt = bundle.getText("mERROR_UNIQUE",[req.data.EAN, bundle.getText("mEAN")]);
            return req.error(410, txt);
        }
    }

    //Validar ImageType
    if (req.data.imageType !== undefined){
        if(req.data.imageType === null){
            const txt = bundle.getText("mERROR_DELETE_FIELD", 'imageType');
            req.error(410, txt);   
        }
       //Returning old value
        let oProduct =  await tx.read(cds.services.CatalogService.entities.Products, ['imageType'])
                        .where({ID:  req.data.ID});
                           
        if (oProduct.length > 0 && oProduct[0].imageType){
            req.data.imageType =  oProduct[0].imageType;
        }
        
    }
};

async function ProductDelete(req){
    let bundle = getBundle(req.user.locale);
     //Verifica se está tentando somente apagar o imageType
     if (req.data.imageType !== undefined && req.data.imageType === null){
        const txt = bundle.getText("mERROR_DELETE_FIELD", 'imageType');
        req.error(410, txt);
    }

    const tx = cds.transaction(req);
    let EAN = req.data.EAN?.replace(" ","");
            
    if (EAN) {
    let oProduct =  await tx.read(cds.services.CatalogService.entities.Products, ['ID'])
                        .where(
                        { 
                            ID: {
                                '<>': req.data.ID
                            },
                            EAN: EAN
                        }
                    );
        if (oProduct.length > 0) {
            const txt = bundle.getText("mERROR_UNIQUE",[req.data.EAN, bundle.getText("mEAN")]);
            return req.error(410, txt);
        }
    }
};

module.exports = {
    ProductCreate,
    ProductUpdate,
    ProductDelete
}