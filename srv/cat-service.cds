using capproducts as capproducts from '../db/data-model';

service CatalogService {// @( requires:'authenticated-user') {
    // Serviços para criação de APP FIORI DE CADASTROS
    @odata.draft.enabled : true
    entity ProductsFiori   as projection on capproducts.Products;
    

    entity Products as projection on capproducts.Products;

    
}

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