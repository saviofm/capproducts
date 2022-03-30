using CatalogService as CatalogService from './cat-service';



@protocol : 'rest'
service CatalogRest {

    entity Products as projection on CatalogService.Products 
        actions {
            function imageContent() returns {};
            action deleteImageContent();
        };
    
    action postImageContent(ID: UUID, contentURL:LargeString);

    entity ProductMedia as projection on CatalogService.ProductMedia;

    
    type product {}

    function getEAN(barcode: String)  returns product;

}