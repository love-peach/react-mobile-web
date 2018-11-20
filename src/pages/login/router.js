const Login = () => import('pages/login/index');

export default [
  {
    path: '/login',
    title: '登录',
    component: Login,
    headerHide: true,
    footerHide: true,
  },
];
