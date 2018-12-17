export default {
  title: 'Create Bank',
  schema: {
    type: 'object',
    // required: ["BankName", "BankID", "Currency", "BankLogoURL", "Products"],
    properties: {
      ParentEntityName: {
        title: 'Parent Entity Name',
        type: 'string',
        default: 'A new Task',
      },
      BankName: {
        title: 'Bank Name',
        type: 'string',
        minLength: 3,
      },
      BankLogoURL: {
        title: 'Bank Logo URL',
        type: 'string',
      },
      BankID: {
        title: 'Bank ID',
        type: 'number',
      },
      // password: {
      //   title: "Password",
      //   type: "string"
      // },
      Currency: {
        title: 'Currency',
        type: 'number',
        enum: [1, 2, 23, 45, 5],
        enumNames: ['RS', 'US UAE', 'UK', 'FR'],
      },

      Buckets: {
        title: 'Buckets',
        type: 'string',
        enum: ['ACS', 'RBA CONFIG', 'DCS', 'TRANSACTIN'],
        // enumNames: ["one", "two", "three"]
      },
      Products: {
        type: 'array',
        title: 'Products',
        minItems: 2,
        items: {
          type: 'string',
          enum: [''],
          enumNames: ['No Data Available'],
        },
        uniqueItems: true,
      },
    },
  },
  formData: {
    BankID: '',
  },
  uiSchema: {
    'ui:order': [
      'ParentEntityName',
      'BankName',
      'BankID',
      'Currency',
      'Buckets',
      'BankLogoURL',
      'Products',
      '*',
    ],
    ParentEntityName: {
      'ui:widget': 'CustomTextWidget',
      // classNames: "marginRight_10 customwidth_40",
      'ui:options': {
        type: 'text',
        disable: true,
        placeholder: 'first name',
      },
    },
    BankName: {
      'ui:widget': 'CustomTextWidget',
      // classNames: "marginRight_10 customwidth_40",
      'ui:options': {
        type: 'text',
      },
    },
    BankLogoURL: {
      'ui:widget': 'CustomTextWidget',
      classNames: 'customwidth_100',
      'ui:options': {
        type: 'text',
      },
    },
    BankID: {
      'ui:widget': 'CustomTextWidget',
      'ui:options': {
        type: 'number',
        // disable: true
      },
    },
    // password: {
    //   "ui:widget": "CustomTextWidget",
    //   "ui:options": {
    //     type: "password"
    //   }
    // },
    Buckets: {
      'ui:widget': 'CustomDropdownWidget',
    },
    Currency: {
      'ui:widget': 'CustomDropdownWidget',
      'ui:options': {
        required: true,
      },
    },
    // multipleChoicesList: {
    //   "ui:widget": "CustomMultiSelectWidget"
    // },
    Products: {
      'ui:widget': 'CustomMultiSelectWidgetWithSearch',
      'ui:options': {
        required: true,
      },
    },
  },
  api: [
    {
      url: 'https://jsonplaceholder.typicode.com/posts',
      type: 'dropdown',
      key: 'Buckets',
    },
    {
      url:
        'https://3ds2-ui-acsdemo-bdc1.enstage-uat.com/admin/uam/v1/banks/8111/products',
      type: 'multiselect',
      key: 'Products',
    },
  ],
  post: '',
};
