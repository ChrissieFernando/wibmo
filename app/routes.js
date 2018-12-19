import HomePage from './containers/HomePage';
import MainPage from './containers/MainPage';
import NotFoundPage from './containers/NotFoundPage';
import Login from './containers/Login';
// import SendOtp from './components/SendOtp';
// import SetPassword from '../app/components/SetPassword';
// import MainPage from './components/main';
// import EnterOtp from './components/EnterOtp';
// import ResendOtp from './components/ResendOtp';
// import ForgotPassword from './components/ForgotPassword';
// import ResetPassword from './components/ResetPassword';
// import NotFoundPage from './components/NotFoundPage';
import TransactionReport from './containers/Transaction/TransactionReport';
import RbaConfiguration from './containers/RbaConfiguration';
import TransactionDetail from './containers/Transaction/TransactionDetail';
import CreateBank from './containers/UserAccessManagement/CreateBank';
import EditBank from './containers/UserAccessManagement/EditBank';
import ManageBank from './containers/UserAccessManagementList/ManageBank';
import AssignBank from './containers/UserAccessManagement/AssignScreenBank';
import EditAssignBank from './containers/UserAccessManagement/EditAssignScreenBank';
import CreateUser from './containers/UserAccessManagement/CreateUser';
import EditUser from './containers/UserAccessManagement/EditUser';
import ManageUser from './containers/UserAccessManagementList/ManageUsers';
import CreateGroup from './containers/UserAccessManagement/CreateGroup';
import EditGroup from './containers/UserAccessManagement/EditGroup';
import ManageGroup from './containers/UserAccessManagementList/ManageGroup';
import AssignGroup from './containers/UserAccessManagement/AssignUserGroup';
import EditAssignGroup from './containers/UserAccessManagement/EditAssignUserGroup';
// import BankUsrCreateUser from './components/bank-user-admin/BankUsrCreateUser';
// import BankUsrEditUser from './components/bank-user-admin/BankUsrEditUser';
// import BankUsrManageUser from './components/bank-user-admin/BankUsrManageUser';
// import BankUsrCreateGroup from './components/bank-user-admin/BankUsrCreateGroup';
// import BankUsrEditGroup from './components/bank-user-admin/BankUsrEditGroup';
// import BankUsrManageGroup from './components/bank-user-admin/BankUsrManageGroup';
// import BankUsrAssignGroup from './components/bank-user-admin/BankUsrAssignGroup';
// import BankUsrEditAssignGroup from './components/bank-user-admin/BankUsrEditAssignGroup';
// import DashboardAcs from './components/DashboardAcs';
// import Maker from './components/Maker';
// import MakerDetail from './components/MakerDetail';
// import Checker from './components/Checker';
// import CheckerDetail from './components/CheckerDetail';
// import MakersNcheckers from './components/MakersNcheckers';
// import MakersNcheckersDetail from './components/MakersNcheckersDetail';
// import MakersNcheckersMdetail from './components/MakersNcheckersMdetail';
// import Form from './components/jsonSchema/form';

const routes = [
  {
    path: '/admin/login',
    exact: true,
    component: Login,
  },
  // {
  //   path: '/sendotp',
  //   exact: true,
  //   component: SendOtp,
  // },
  // {
  //   path: '/setpassword',
  //   exact: true,
  //   component: SetPassword,
  // },
  // {
  //   path: '/enterotp',
  //   exact: true,
  //   component: EnterOtp,
  // },
  // {
  //   path: '/resendotp',
  //   exact: true,
  //   component: ResendOtp,
  // },
  // {
  //   path: '/forgotpassword',
  //   exact: true,
  //   component: ForgotPassword,
  // },
  // {
  //   path: '/resetpassword',
  //   exact: true,
  //   component: ResetPassword,
  // },
  // {
  //   path: '/acsdashboard',
  //   // auth: true,
  //   exact: true,
  //   component: DashboardAcs,
  //   routes: [],
  // },
  // {
  //   path: '/maker',
  //   // auth: true,
  //   exact: true,
  //   component: Maker,
  //   routes: [],
  // },
  // {
  //   path: '/maker-detail',
  //   // auth: true,
  //   exact: true,
  //   component: MakerDetail,
  //   routes: [],
  // },
  // {
  //   path: '/checker',
  //   // auth: true,
  //   exact: true,
  //   component: Checker,
  //   routes: [],
  // },
  // {
  //   path: '/checker-detail',
  //   // auth: true,
  //   exact: true,
  //   component: CheckerDetail,
  //   routes: [],
  // },
  // {
  //   path: '/makers-checkers',
  //   // auth: true,
  //   exact: true,
  //   component: MakersNcheckers,
  //   routes: [],
  // },
  // {
  //   path: '/makers-checkers-details',
  //   // auth: true,
  //   exact: true,
  //   component: MakersNcheckersDetail,
  //   routes: [],
  // },
  // {
  //   path: '/makers-checkers-mdetails',
  //   // auth: true,
  //   exact: true,
  //   component: MakersNcheckersMdetail,
  //   routes: [],
  // },
  // {
  //   path: '/demo/form',
  //   // auth: true,
  //   exact: true,
  //   component: Form,
  //   // routes: []
  // },
  {
    path: '/',
    auth: true,
    exact: true,
    component: HomePage,
    routes: [],
  },
  {
    path: '/admin/dashboard',
    component: MainPage,
    routes: [
      {
        path: '/admin/dashboard/transaction',
        auth: true,
        exact: true,
        component: TransactionReport,
      },
      {
        path: '/admin/dashboard/rba-configuration',
        auth: true,
        exact: true,
        component: RbaConfiguration,
      },
      {
        path: '/admin/dashboard/transaction-detail',
        auth: true,
        exact: true,
        component: TransactionDetail,
      },
      {
        path: '/admin/dashboard/edit-assign-screens-to-bank',
        // auth: true,
        exact: true,
        component: EditAssignBank,
      },
      {
        path: '/admin/dashboard/createbank',
        // auth: true,
        exact: true,
        component: CreateBank,
      },
      {
        path: '/admin/dashboard/editbank/:id',
        // auth: true,
        exact: true,
        component: EditBank,
      },
      {
        path: '/admin/dashboard/managebank',
        // auth: true,
        exact: true,
        component: ManageBank,
      },
      {
        path: '/admin/dashboard/assign-screens-to-bank/:id',
        // auth: true,
        exact: true,
        component: AssignBank,
      },
      {
        path: '/admin/dashboard/createuser',
        // auth: true,
        exact: true,
        component: CreateUser,
      },
      {
        path: '/admin/dashboard/edituser/:user_id',
        // auth: true,
        exact: true,
        component: EditUser,
      },
      {
        path: '/admin/dashboard/manageuser',
        // auth: true,
        exact: true,
        component: ManageUser,
      },
      {
        path: '/admin/dashboard/creategroup',
        // auth: true,
        exact: true,
        component: CreateGroup,
      },
      {
        path: '/admin/dashboard/editgroup/:groupId',
        // auth: true,
        exact: true,
        component: EditGroup,
      },
      {
        path: '/admin/dashboard/assign-users-to-group',
        // auth: true,
        exact: true,
        component: AssignGroup,
      },
      {
        path: '/admin/dashboard/managegroup',
        // auth: true,
        exact: true,
        component: ManageGroup,
      },
      {
        path: '/admin/dashboard/edit-assign-users-to-group',
        // auth: true,
        exact: true,
        component: EditAssignGroup,
      },
      //     {
      //       path: '/admin/dashboard/bankusr-createuser',
      //       // auth: true,
      //       exact: true,
      //       component: BankUsrCreateUser,
      //     },
      //     {
      //       path: '/admin/dashboard/bankusr-edituser',
      //       // auth: true,
      //       exact: true,
      //       component: BankUsrEditUser,
      //     },
      //     {
      //       path: '/admin/dashboard/bankusr-manageuser',
      //       // auth: true,
      //       exact: true,
      //       component: BankUsrManageUser,
      //     },
      //     {
      //       path: '/admin/dashboard/bankusr-managegroup',
      //       // auth: true,
      //       exact: true,
      //       component: BankUsrManageGroup,
      //     },
      //     {
      //       path: '/admin/dashboard/bankusr-creategroup',
      //       // auth: true,
      //       exact: true,
      //       component: BankUsrCreateGroup,
      //     },
      //     {
      //       path: '/admin/dashboard/bankusr-assigngroup',
      //       // auth: true,
      //       exact: true,
      //       component: BankUsrAssignGroup,
      //     },
      //     {
      //       path: '/admin/dashboard/bankusr-editassigngroup',
      //       // auth: true,
      //       exact: true,
      //       component: BankUsrEditAssignGroup,
      //     },
      //     {
      //       path: '/admin/dashboard/bankusr-editgroup',
      //       // auth: true,
      //       exact: true,
      //       component: BankUsrEditGroup,
      //     },
      {
        path: '/admin/dashboard/',
        auth: true,
        exact: true,
        component: HomePage,
        routes: [],
      },
      {
        path: '*',
        exact: true,
        auth: true,
        component: NotFoundPage,
        routes: [],
      },
    ],
  },
  {
    path: '*',
    exact: true,
    auth: true,
    component: NotFoundPage,
    routes: [],
  },
];
export default routes;
