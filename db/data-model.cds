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
      EAN : String;
      productDescription : localized String not null;
      @Core.MediaType: 'image/png'
      img : LargeBinary;
      
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
  productDescription @(
    title       : '{i18n>productDescription}',
    description : '{i18n>productDescription}',
    Common      : {
      FieldControl : #Mandatory,
      TextFor      : EAN
    }
  );
 
};
