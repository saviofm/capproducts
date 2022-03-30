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
      productName : localized String not null;
      productDescription : localized String;
      brand : String;
      obs: LargeString;
      imageContent: LargeBinary @Core.MediaType: imageType;
      imageType : String @Core.IsMediaType: true;
      media     : Composition of many ProductMedia
                         on media.product  = $self;     
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
  imageContent @(
    title       : '{i18n>imageContent}',
    description : '{i18n>imageContent}',
  );
  imageType @(
    title       : '{i18n>imageType}',
    description : '{i18n>imageType}',
  );
};


//------------------ PRODUCTSMEDIA  -----------------//
//------------------------------------------------------//
//------------------------------------------------------//
//Entity
entity ProductMedia: cuid , managed {
  product: Association to Products;
  fileName : String;
  mediaType : String @Core.IsMediaType: true;
  mediaContent: LargeBinary @Core.MediaType: mediaType @Core.ContentDisposition.Filename: fileName @Core.ContentDisposition.Type: 'inline';
}

@cds.odata.valuelist
//Annotation
annotate ProductMedia with @(
  title              : '{i18n>ProductMedia}',
  description        : '{i18n>ProductMedia}'
){
  product @(
    title       : '{i18n>product}',
    description : '{i18n>product}',
  );
  imageContent @(
    title       : '{i18n>imageContent}',
    description : '{i18n>imageContent}',
  );
  imageType @(
    title       : '{i18n>imageType}',
    description : '{i18n>imageType}',
  );
};