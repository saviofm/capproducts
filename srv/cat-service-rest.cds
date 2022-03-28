using CatalogService as CatalogService from './cat-service';



@protocol : 'rest'
service CatalogServiceRest {

    entity Products as projection on CatalogService.Products;

    entity ProductMedia as projection on CatalogService.ProductMedia;

    
    type product {}

    function getEAN(barcode: String)  returns product;

}