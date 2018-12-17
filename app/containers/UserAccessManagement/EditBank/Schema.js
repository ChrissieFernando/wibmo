export default {
  title: 'Edit Bank',
  schema: {
    type: 'object',
    required: [
      'BankName',
      'BankID',
      'BankCode',
      'Currency',
      'BankLogoURL',
      'Products',
      'Buckets',
    ],
    properties: {
      // ParentEntityName: {
      //   title: "Parent Entity Name",
      //   type: "string",
      //   default: "A new Task"
      // },
      BankName: {
        title: 'Bank Name',
        type: 'string',
        minLength: 3,
      },
      BankCode: {
        title: 'Bank Code',
        type: 'string',
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
        // enum: [356, 840, 978, 45, 5],
        enum: [356, 840, 978],
        enumNames: ['INR', 'USD', 'EUR'],
      },

      Buckets: {
        title: 'Buckets',
        type: 'string',
        enum: ['ACS', 'RBA CONFIG', 'DCS', 'TRANSACTIN'],
        enumNames: ['one', 'two', 'three'],
      },
      Products: {
        type: 'array',
        title: 'Products',
        minItems: 2,
        items: {
          type: 'number',
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
      // "ParentEntityName",
      'BankName',
      'BankCode',
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
      classNames: 'marginRight_10 ',
      'ui:options': {
        type: 'text',
      },
    },
    BankCode: {
      'ui:widget': 'CustomTextWidget',
      // classNames: "marginRight_10 ",
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
        disable: true,
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
      'ui:options': {
        required: true,
      },
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
    // {
    //   url: "https://jsonplaceholder.typicode.com/posts",
    //   type: "dropdown",
    //   key: "Buckets"
    // },
  ],
  post: '',
};
