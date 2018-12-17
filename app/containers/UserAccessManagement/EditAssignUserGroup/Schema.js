export default {
  title: 'Edit Assign Users to Group',
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

      BankName: {
        title: 'Bank Name',
        type: 'number',
        // enum: ["RS", "US UAE", "UK", "FR"]
      },

      Users: {
        type: 'array',
        title: 'Users',
        minItems: 2,
        items: {
          type: 'string',
          enum: [''],
          enumNames: ['Select a Bank to choose Users List'],
        },
        uniqueItems: true,
      },
    },
  },
  formData: {},
  uiSchema: {
    'ui:order': ['GroupName', 'BankName', 'Users', '*'],
    GroupName: {
      'ui:widget': 'CustomTextWidget',
      classNames: 'marginRight',
      'ui:options': {
        type: 'text',
        // disable: true,
        placeholder: 'first name',
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
    Users: {
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
