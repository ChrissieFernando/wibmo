const data = {
  'Bank Name': {
    dropdown: [
      {
        key: 'sbi',
        value: 'State Bank of India',
      },
      {
        key: 'icici',
        value: 'ICICI Bank',
      },
      {
        key: 'iob',
        value: 'Indian Overseas Bank',
      },
      {
        key: 'hdfc',
        value: 'HDFC Bank',
      },
      {
        key: 'ing',
        value: 'ING Bank',
      },
    ],
  },
  'Transaction Type': {
    dropdown: [
      {
        key: '',
        value: 'All',
      },
      {
        key: '',
        value: 'ITP',
      },
      {
        key: '',
        value: 'E - Commerce',
      },
      {
        key: '',
        value: 'IVR',
      },
      {
        key: '',
        value: 'ING Bank',
      },
    ],
  },
  'Card Union': {
    dropdown: [
      {
        key: '',
        value: 'All',
      },
      {
        key: '',
        value: 'UPS',
      },
      {
        key: '',
        value: 'American Express',
      },
      {
        key: '',
        value: 'RuPay',
      },
      {
        key: '',
        value: 'Visa',
      },
    ],
  },
  'Card Type': {
    dropdown: [
      {
        key: '',
        value: 'All',
      },
      {
        key: '',
        value: 'Debit',
      },
      {
        key: '',
        value: 'Credit',
      },
      {
        key: '',
        value: 'Prepaid',
      },
      {
        key: '',
        value: 'Wallet',
      },
    ],
  },
  'Bin Number': {
    dropdown: [
      {
        key: '',
        value: '3452374',
      },
      {
        key: '',
        value: '3456234',
      },
      {
        key: '',
        value: '3454234',
      },
      {
        key: '',
        value: '34533234',
      },
      {
        key: '',
        value: '3245234',
      },
    ],
  },
  'Transaction Status': {
    dropdown: [
      {
        key: '',
        value: 'Pending',
      },
      {
        key: '',
        value: 'Success',
      },
    ],
  },
  'Data Center': {
    dropdown: [
      {
        key: '',
        value: 'Primary',
      },
      {
        key: '',
        value: 'Secondary',
      },
    ],
  },
  Environment: {
    dropdown: [
      {
        key: '',
        value: 'Canary',
      },
      {
        key: '',
        value: 'Production',
      },
    ],
  },
  default: {
    bank_name: 'Select A Bank ',
    transaction_type: [],
    card_union: [],
    card_type: [],
    bin_number: [],
    transaction_status: [],
    data_center: [],
    environment: [],
    card_number: '',
    merchant_id: '',
  },
};
export default data;
