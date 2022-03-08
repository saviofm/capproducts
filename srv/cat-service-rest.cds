using CatalogService as CatalogService from './cat-service';



@protocol : 'rest'
service CatalogServiceRest {

    entity PerPersonal as projection on CatalogService.Products;

    type product {}

    function getEAN(barcode: String)  returns product;

}