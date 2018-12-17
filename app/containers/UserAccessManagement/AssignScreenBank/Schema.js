export default {
  title: 'Assign Screens to Bank',
  schema: {
    type: 'object',
    required: ['Products', 'BankName'],
    properties: {
      BankName: {
        title: 'Bank Name',
        type: 'number',
        // enum: ["RS", "US UAE", "UK", "FR"]
      },
      Products: {
        title: 'Products',
        type: 'string',
        enum: ['Select a bank to choose products'],
      },
      Screens: {
        type: 'array',
        title: 'Screens List',
        // minItems: 2,
        items: {
          type: 'string',
          enum: [''],
          enumNames: ['Select a Product to choose Screen List'],
        },
        uniqueItems: true,
      },
    },
  },
  formData: {},
  uiSchema: {
    'ui:order': ['BankName', 'Products', 'Screens', '*'],
    Products: {
      'ui:widget': 'CustomDropdownWidget',
      classNames: 'marginRight',
      'ui:options': {
        required: true,
      },
    },
    BankName: {
      'ui:widget': 'CustomDropdownWidget',
      classNames: 'marginRight',
      'ui:options': {
        required: true,
      },
    },
    // multipleChoicesList: {
    //   "ui:widget": "CustomMultiSelectWidget"
    // },
    Screens: {
      'ui:widget': 'CustomMultiSelectWidgetWithSearch',
      classNames: 'customwidth_95',
      'ui:options': {
        required: true,
      },
    },
  },
  api: [
    {
      url: 'https://3ds2-ui-acsdemo-bdc1.enstage-uat.com/admin/uam/v1/banks',
      type: 'dropdown',
      key: 'BankName',
    },
  ],
  post: '',
};
