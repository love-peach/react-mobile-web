const realNameCard = () => import('pages/certify/real-name/card');
const realNameLiving = () => import('pages/certify/real-name/living');

export default [
  {
    exact: true,
    path: '/card',
    title: '实名认证（1/3）',
    requiresAuth: true,
    component: realNameCard,
  },
  {
    path: '/living',
    title: '实名认证（2/3）',
    component: realNameLiving,
  },
];
