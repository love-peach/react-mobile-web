import CertifyRoute from './certify/router'; // 认证
import LoginRoute from './login/router'; // 登录
export default [
  ...CertifyRoute,
  ...LoginRoute,
];
