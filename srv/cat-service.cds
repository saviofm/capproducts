using capproducts as capproducts from '../db/data-model';

service CatalogService {// @( requires:'authenticated-user') {
    // Serviços para criação de APP FIORI DE CADASTROS
    @odata.draft.enabled : true
    entity ProductsFiori   as projection on capproducts.Products {
        *,
        null as imageUrl  : String @Core.IsURL @Core.MediaType: imageType,
        media : redirected to ProductMedia
    }

    //Without Draft
    entity Products as projection on capproducts.Products {
        *,
        null as imageUrl  : String @Core.IsURL @Core.MediaType: imageType,
        media : redirected to ProductMedia
    };

    entity ProductMedia            as projection on capproducts.ProductMedia {
        * , 
        null as mediaUrl    : String @Core.IsURL @Core.MediaType: mediaType,
        product : redirected to Products    
    };

    type product {};

    function getEAN (barcode: String)  returns product;

    action postImageContent (ID: UUID, contentURL:LargeString);


}

annotate ProductsFiori with {
imageUrl @(
    title       : '{i18n>imageUrl}',
    description : '{i18n>imageUrl}',
  );


};

annotate Products  with {
imageUrl @(
    title       : '{i18n>imageUrl}',
    description : '{i18n>imageUrl}',
  );
};

annotate Products  with {
mediaUrl @(
    title       : '{i18n>mediaUrl}',
    description : '{i18n>mediaUrl}',
  );
};

