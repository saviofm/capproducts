using capproducts as capproducts from '../db/data-model';

service CatalogService {// @( requires:'authenticated-user') {
    // Serviços para criação de APP FIORI DE CADASTROS
    @odata.draft.enabled : true
    entity ProductsFiori   as projection on capproducts.Products;
    

    entity Products as projection on capproducts.Products;
   
}