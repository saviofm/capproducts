using {
  cuid,
  managed,
  sap,
  temporal,
  Currency,
  User
} from '@sap/cds/common';


namespace capproducts;

//----------------------- PRODUCTS  ---------------------//
//------------------------------------------------------//
//------------------------------------------------------//
//Entity


entity Products : cuid , managed {
      EAN : String not null;
      productName : localized String;
      productDescription : localized String not null;
      brand : String;
      obs: LargeString;
      imageUrl  : String @Core.IsURL @Core.MediaType: 'image/png';
      
}
@cds.odata.valuelist
//Annotation
annotate Products with @(
  title              : '{i18n>Products}',
  description        : '{i18n>Products}',
  UI.TextArrangement : #TextOnly,
  Common.SemanticKey : [EAN],
  UI.Identification  : [{
    $Type : 'UI.DataField',
    Value : EAN
  }]
) {
  ID @(
        Core.Computed,
        Common.Text : {
            $value                 : EAN,
            ![@UI.TextArrangement] : #TextOnly
        }
  );
  EAN            @(
    title       : '{i18n>EAN}',
    description : '{i18n>EAN}',
    Common      : {
        FieldControl             : #Mandatory,
    //  Text : {
    //    $value                 : productDescription,
    //    ![@UI.TextArrangement] : #TextLast
    //  }
    }
  );
  productName @(
    title       : '{i18n>productName}',
    description : '{i18n>productName}',
    Common      : {
      FieldControl : #Mandatory,
      TextFor      : EAN
    }
  );
  productDescription @(
    title       : '{i18n>productDescription}',
    description : '{i18n>productDescription}',
  );
  brand @(
    title       : '{i18n>brand}',
    description : '{i18n>brand}',
  );
  obs @(
    title       : '{i18n>obs}',
    description : '{i18n>obs}',
    UI.MultiLineText: true,
  );
  imageUrl @(
    title       : '{i18n>imageUrl}',
    description : '{i18n>imageUrl}',
  );

};
