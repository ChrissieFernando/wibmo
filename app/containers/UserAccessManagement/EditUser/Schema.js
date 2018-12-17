import { GET_ALL_BANKS } from '../../../utils/requestUrl';

export default {
  title: 'Edit User',
  schema: {
    type: 'object',
    required: [
      'FirstName',
      // "LastName",
      'LoginID',
      'MobileCode',
      'MobileNumber',
      // "EmailID",
      // "BankName",
      'Status',
    ],
    properties: {
      FirstName: {
        title: 'First Name',
        type: 'string',
        // default: "A new Task"
      },
      LastName: {
        title: 'Last Name',
        type: 'string',
        // default: "A new Task"
      },
      LoginID: {
        title: 'Login ID',
        type: 'string',
        // default: "A new Task"
      },
      MobileCode: {
        title: 'Code',
        // type: "string",
        // minLength: 2,
        enum: [91, 1, 33, 49],
        enumNames: ['+ 91', '+ 1', '+ 33', '+ 49'],
        // maxLength: 10
      },
      MobileNumber: {
        title: 'Mobile Number',
        type: 'number',
        // minLength: 10,
        // maxLength: 10
      },

      EmailID: {
        title: 'Email ID',
        type: 'string',
      },
      // password: {
      //   title: "Password",
      //   type: "string"
      // },
      BankName: {
        title: 'Bank Name',
        type: 'number',
        // enum: ["RS", "US UAE", "UK", "FR"]
      },

      Status: {
        title: 'Status',
        type: 'string',
        enum: ['Active', 'Inactive'],
        enumNames: ['Active', 'Inactive'],
      },
      BankList: {
        type: 'array',
        title: 'Bank list',
        // minItems: 2,
        items: {
          // type: "number",
          enum: [''],
          enumNames: ['No Data Available'],
        },
        uniqueItems: true,
      },
    },
  },
  formData: {
    Products: [],
  },
  uiSchema: {
    'ui:order': [
      'FirstName',
      'LastName',
      'LoginID',
      'MobileCode',
      'MobileNumber',
      'EmailID',
      'BankName',
      'Status',
      'BankList',
      '*',
    ],
    FirstName: {
      'ui:widget': 'CustomTextWidget',
      classNames: 'customwidth_23',
      'ui:options': {
        type: 'text',
        // disable: true,
        placeholder: 'first name',
      },
    },
    LastName: {
      'ui:widget': 'CustomTextWidget',
      classNames: 'customwidth_23',
      'ui:options': {
        type: 'text',
        // disable: true,
        placeholder: 'last name',
      },
    },
    // BankName: {
    //   "ui:widget": "CustomTextWidget",
    //   "ui:options": {
    //     type: "text"
    //   }
    // },
    LoginID: {
      'ui:widget': 'CustomTextWidget',
      'ui:options': {
        type: 'text',
      },
    },
    MobileNumber: {
      'ui:widget': 'CustomTextWidget',
      classNames: 'customwidth_33',
      'ui:options': {
        type: 'number',
      },
    },
    MobileCode: {
      'ui:widget': 'CustomDropdownWidget',
      classNames: 'customwidth_13',
      'ui:options': {
        type: 'text',
        // disable: true
      },
    },
    EmailID: {
      'ui:widget': 'CustomTextWidget',
      'ui:options': {
        type: 'string',
        // disable: true
      },
    },
    // password: {
    //   "ui:widget": "CustomTextWidget",
    //   "ui:options": {
    //     type: "password"
    //   }
    // },
    Status: {
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
    BankList: {
      'ui:widget': 'CustomMultiSelectWidgetWithSearch',
      'ui:options': {
        required: true,
      },
    },
  },
  api: [
    {
      url: GET_ALL_BANKS,
      type: 'dropdown',
      key: 'BankName',
    },
    {
      url: GET_ALL_BANKS,
      type: 'multiselect',
      key: 'BankList',
    },
  ],
  post: '',
};
