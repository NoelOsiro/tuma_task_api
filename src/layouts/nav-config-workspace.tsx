import { CONFIG } from 'src/global-config';

import type { WorkspacesPopoverProps } from './components/workspaces-popover';

// ----------------------------------------------------------------------

export const _workspaces: WorkspacesPopoverProps['data'] = [
  {
    id: 'team-1',
    name: 'Squady',
    logo: `${CONFIG.assetsDir}/assets/icons/workspaces/logo-1.webp`,
    plan: 'Free',
  },
  {
    id: 'team-2',
    name: 'Boss',
    logo: `${CONFIG.assetsDir}/assets/icons/workspaces/logo-2.webp`,
    plan: 'Pro',
  },
];
