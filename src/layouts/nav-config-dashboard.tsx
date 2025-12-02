import type { NavSectionProps } from 'src/components/nav-section';

import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/global-config';

import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`${CONFIG.assetsDir}/assets/icons/navbar/${name}.svg`} />
);

const ICONS = {
  job: icon('ic-job'),
  blog: icon('ic-blog'),
  chat: icon('ic-chat'),
  mail: icon('ic-mail'),
  user: icon('ic-user'),
  file: icon('ic-file'),
  lock: icon('ic-lock'),
  tour: icon('ic-tour'),
  order: icon('ic-order'),
  label: icon('ic-label'),
  blank: icon('ic-blank'),
  kanban: icon('ic-kanban'),
  folder: icon('ic-folder'),
  course: icon('ic-course'),
  banking: icon('ic-banking'),
  booking: icon('ic-booking'),
  invoice: icon('ic-invoice'),
  product: icon('ic-product'),
  calendar: icon('ic-calendar'),
  disabled: icon('ic-disabled'),
  external: icon('ic-external'),
  menuItem: icon('ic-menu-item'),
  ecommerce: icon('ic-ecommerce'),
  analytics: icon('ic-analytics'),
  dashboard: icon('ic-dashboard'),
  parameter: icon('ic-parameter'),
};

// ----------------------------------------------------------------------

export const navData: NavSectionProps['data'] = [
  /**
   * Overview
   */
  {
    subheader: 'Overview',
    items: [
      { title: 'Home', path: paths.dashboard.root, icon: ICONS.dashboard },
    ],
  },
  /**
   * Management
   */
  {
    subheader: 'Tasks & Listings',
    items: [
      {
        title: 'Gigs',
        path: paths.dashboard.tasks.root,
        icon: ICONS.ecommerce,
        children: [
          { title: 'Post Gig', path: paths.dashboard.tasks.root },
          { title: 'My Gigs', path: paths.dashboard.tasks.root },
        ],
      },
      {
        title: 'Tools & Equipment',
        path: paths.dashboard.equipment.root,
        icon: ICONS.user,
        children: [
          { title: 'Inventory', path: paths.dashboard.equipment.root },
          { title: 'All', path: paths.dashboard.equipment.cards },
          { title: 'List', path: paths.dashboard.equipment.list },
          { title: 'Add Item', path: paths.dashboard.equipment.new },
          // { title: 'Edit', path: paths.dashboard.equipment.demo.edit },
          // { title: 'Account', path: paths.dashboard.equipment.account },
        ],
      },
    ],
  },
  {
    subheader: 'User & Support',
    items: [
      {
        title: 'Users',
        path: paths.dashboard.user.root,
        icon: ICONS.user,
        children: [
          { title: 'Profile', path: paths.dashboard.user.root },
          { title: 'Cards', path: paths.dashboard.user.cards },
          { title: 'List', path: paths.dashboard.user.list },
          { title: 'Create', path: paths.dashboard.user.new },
          { title: 'Edit', path: paths.dashboard.user.demo.edit },
          { title: 'Account', path: paths.dashboard.user.account },
        ],
      },
      {
        title: 'Help Tickets',
        path: paths.dashboard.user.root,
        icon: ICONS.user,
        children: [
          { title: 'Profile', path: paths.dashboard.user.root },
          { title: 'Cards', path: paths.dashboard.user.cards },
          { title: 'List', path: paths.dashboard.user.list },
          { title: 'Create', path: paths.dashboard.user.new },
          { title: 'Edit', path: paths.dashboard.user.demo.edit },
          { title: 'Account', path: paths.dashboard.user.account },
        ],
      },
      {
        title: 'Payments & Payouts',
        path: paths.dashboard.payment.root,
        icon: ICONS.user,
        children: [
          { title: 'Overview', path: paths.dashboard.payment.root },
          { title: 'Cards', path: paths.dashboard.payment.cards },
          { title: 'List', path: paths.dashboard.payment.list },
          { title: 'Create', path: paths.dashboard.payment.new },
          { title: 'Edit', path: paths.dashboard.payment.demo.edit },
          { title: 'Account', path: paths.dashboard.payment.account },
        ],
      },
    ],
  },
  {
    subheader: 'Billing & Offers',
    items: [
      {
        title: 'Subscription Packages',
        path: paths.dashboard.package.root,
        icon: ICONS.file,
        children: [
          { title: 'All', path: paths.dashboard.package.cards },
          { title: 'List', path: paths.dashboard.package.list },
        ],
      },
      {
        title: 'Promo Vouchers',
        path: paths.dashboard.voucher.root,
        icon: ICONS.user,
        children: [
          { title: 'Overview', path: paths.dashboard.voucher.root },
          { title: 'List', path: paths.dashboard.voucher.list },
        ],
      },
    ],
  },
];