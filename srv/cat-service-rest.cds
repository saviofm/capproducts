using CatalogService as CatalogService from './cat-service';



@protocol : 'rest'
service CatalogServiceRest {

    entity PerPersonal as projection on CatalogService.Products;

    type returnEAN {
        pesoBruto   : Decimal(15,3);
        pesoLiquido : Decimal(15,3);
        tara        : Decimal(15,3);
    }

    function getEAN(Barcode: String) returns returnEAN;

}