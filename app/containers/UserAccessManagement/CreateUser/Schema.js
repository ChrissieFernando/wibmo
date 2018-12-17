export default {
  title: "Create User",
  schema: {
    type: "object",
    required: [
      "FirstName",
      // "LastName",
      "LoginID",
      "MobileCode",
      "MobileNumber",
      // "EmailID",
      // "BankName",
      "Status"
    ],
    properties: {
      FirstName: {
        title: "First Name",
        type: "string"
        // default: "A new Task"
      },
      LastName: {
        title: "Last Name",
        type: "string"
        // default: "A new Task"
      },
      LoginID: {
        title: "Login ID",
        type: "string"
        // default: "A new Task"
      },
      MobileCode: {
        title: "Code",
        type: "string",
        minLength: 2,
        enum: ["+91"]
        // maxLength: 10
      },
      MobileNumber: {
        title: "Mobile Number",
        type: "string"
        // minLength: 10,
        // maxLength: 10
      },

      EmailID: {
        title: "Email ID",
        type: "string"
      },
      // password: {
      //   title: "Password",
      //   type: "string"
      // },
      BankName: {
        title: "Bank Name",
        type: "number"
        // enum: ["RS", "US UAE", "UK", "FR"]
      },

      Status: {
        title: "Status",
        type: "string",
        enum: ["1", "0"],
        enumNames: ["Active", "Inactive"]
      },
      Products: {
        type: "array",
        title: "Products",
        // minItems: 2,
        items: {
          type: "string",
          enum: [""],
          enumNames: ["Select a bank to choose products"]
        },
        uniqueItems: true
      }
    }
  },
  formData: {
    Products: [],
    MobileCode: "+91"
  },
  uiSchema: {
    "ui:order": [
      "FirstName",
      "LastName",
      "LoginID",
      "MobileCode",
      "MobileNumber",
      "EmailID",
      "BankName",
      "Status",
      "Products",
      "*"
    ],
    FirstName: {
      "ui:widget": "CustomTextWidget",
      classNames: "customwidth_23",
      "ui:options": {
        type: "text",
        // disable: true,
        placeholder: "first name"
      }
    },
    LastName: {
      "ui:widget": "CustomTextWidget",
      classNames: "customwidth_23",
      "ui:options": {
        type: "text",
        // disable: true,
        placeholder: "last name"
      }
    },
    // BankName: {
    //   "ui:widget": "CustomTextWidget",
    //   "ui:options": {
    //     type: "text"
    //   }
    // },
    LoginID: {
      "ui:widget": "CustomTextWidget",
      "ui:options": {
        type: "text"
      }
    },
    MobileNumber: {
      "ui:widget": "CustomTextWidget",
      classNames: "customwidth_33",
      "ui:options": {
        type: "number"
      }
    },
    MobileCode: {
      "ui:widget": "CustomDropdownWidget",
      classNames: "customwidth_13",
      "ui:options": {
        type: "text",
        disable: true
      }
    },
    EmailID: {
      "ui:widget": "CustomTextWidget",
      "ui:options": {
        type: "string"
        // disable: true
      }
    },
    // password: {
    //   "ui:widget": "CustomTextWidget",
    //   "ui:options": {
    //     type: "password"
    //   }
    // },
    Status: {
      "ui:widget": "CustomDropdownWidget",
      "ui:options": {
        required: true
      }
    },
    BankName: {
      "ui:widget": "CustomDropdownWidget",
      "ui:options": {
        required: true
      }
    },
    // multipleChoicesList: {
    //   "ui:widget": "CustomMultiSelectWidget"
    // },
    Products: {
      "ui:widget": "CustomMultiSelectWidgetWithSearch",
      "ui:options": {
        required: true
      }
    }
  },
  api: [
    {
      url: "https://3ds2-ui-acsdemo-bdc1.enstage-uat.com/admin/uam/v1/banks",
      type: "dropdown",
      key: "BankName"
    }
  ],
  post: ""
};
