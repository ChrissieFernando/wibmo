export default {
  title: 'Create Group',
  schema: {
    type: 'object',
    required: [
      'GroupName',
      // "LastName",
      // "EmailID",
      'BankName',
    ],
    properties: {
      GroupName: {
        title: 'Group Name',
        type: 'string',
        // default: "A new Task"
      },

      BankID: {
        title: 'Bank ID',
        type: 'string',
      },
      BankName: {
        title: 'Bank Name',
        type: 'number',
        // enum: ["RS", "US UAE", "UK", "FR"]
      },
      Products: {
        title: 'Products',
        type: 'string',
        enum: [''],
        enumNames: ['Choose a bank first to select Products'],
      },
      Permissions: {
        type: 'array',
        title: 'Permissions List',
        // minItems: 2,
        items: {
          type: 'string',
          enum: [''],
          enumNames: ['Select a Product to choose Permissions List'],
        },
        uniqueItems: true,
      },
    },
  },
  formData: {},
  uiSchema: {
    'ui:order': [
      'GroupName',
      'BankName',
      'BankID',
      'Products',
      'Permissions',
      '*',
    ],
    GroupName: {
      'ui:widget': 'CustomTextWidget',
      classNames: 'marginRight',
      'ui:options': {
        type: 'text',
        // disable: true,
        placeholder: 'first name',
      },
    },
    BankID: {
      'ui:widget': 'CustomTextWidget',
      'ui:options': {
        type: 'text',
        disable: true,
        // placeholder: "last name"
      },
    },
    // BankName: {
    //   "ui:widget": "CustomTextWidget",
    //   "ui:options": {
    //     type: "text"
    //   }
    // },
    // password: {
    //   "ui:widget": "CustomTextWidget",
    //   "ui:options": {
    //     type: "password"
    //   }
    // },
    Products: {
      'ui:widget': 'CustomDropdownWidget',
      'ui:options': {
        required: true,
      },
    },
    BankName: {
      'ui:widget': 'CustomDropdownWidget',
      'ui:options': {
        required: true,
      },
    },
    // multipleChoicesList: {
    //   "ui:widget": "CustomMultiSelectWidget"
    // },
    Permissions: {
      'ui:widget': 'CustomMultiSelectWidgetWithSearch',
      classNames: 'customwidth_100',
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
