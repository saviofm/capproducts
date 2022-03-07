using CatalogService from './cat-service';

//----------------------- Products  ---------------------//
//------------------------------------------------------//
//------------------------------------------------------//
//List Page
annotate CatalogService.Products with @(
	UI: {
        LineItem: [
			{   
                $Type: 'UI.DataField', 
                Value: EAN,
                ![@UI.Importance] : #High
            },
            {   
                $Type : 'UI.DataField', 
                Value : productDescription,
                ![@UI.Importance] : #High
            }
		],
        PresentationVariant : {
            $Type     : 'UI.PresentationVariantType',
            SortOrder : [{Property : EAN}]
        },
        SelectionFields: [ 
            EAN,
            productDescription,
        ],
	},
//Object Page
	UI: {
        HeaderInfo: {          
            Title : { 
                $Type : 'UI.DataField',
                Value: '{i18n>Products}'
            },
            TypeName: '{i18n>Product}',
            TypeNamePlural: '{i18n>Products}', 
            Description: { 
                $Type: 'UI.DataField', 
                Value: productDescription 
            }, 
        },
		HeaderFacets            : [
            {
                $Type             : 'UI.ReferenceFacet',
                Target            : '@UI.FieldGroup#Admin',
                ![@UI.Importance] : #Medium
            }
        ],
        FieldGroup #GeneralData: {
			Data: [
                {
                    $Type : 'UI.DataField',
                    Value: EAN
                },
                {
                    $Type : 'UI.DataField',
                    Value: productDescription
                }             
			]                        
        },
        FieldGroup #Admin: {
            Data : [
                {
                    $Type : 'UI.DataField',
                    Value : createdBy
                },
                {
                    $Type : 'UI.DataField',
                    Value : modifiedBy
                },
                {
                    $Type : 'UI.DataField',
                    Value : createdAt
                },
                {
                    $Type : 'UI.DataField',
                    Value : modifiedAt
                }
            ]
        },
        // Page Facets
		Facets: [
            {    
                $Type: 'UI.ReferenceFacet', 
                Label: '{i18n>GeneralData}', 
                Target: '@UI.FieldGroup#GeneralData'
            }
        ]    
    }
);

