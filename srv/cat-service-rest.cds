using CatalogService as CatalogService from './cat-service';



@protocol : 'rest'
service CatalogServiceRest {

    entity products as projection on CatalogService.Products;

    type product {}

    function getEAN(barcode: String)  returns product;

}