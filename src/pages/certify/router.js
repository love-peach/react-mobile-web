const realNameCard = () => import('./real-name/card');
const realNameLiving = () => import('./real-name/living');

export default [
  {
    path: '/card',
    title: {
      title: '实名认证（1/3）',
    },
    component: realNameCard,
  },
  {
    path: '/living',
    title: {
      title: '实名认证（1/3）',
    },
    component: realNameLiving,
  },
];
