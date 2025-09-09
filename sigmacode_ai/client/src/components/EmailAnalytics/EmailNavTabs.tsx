import { NavLink } from 'react-router-dom';

type TabKey = 'overview' | 'raw' | 'dmarc' | 'settings';

export function EmailNavTabs({ active }: { active: TabKey }) {
  const base = '/d/email';
  const tabCls = (isActive: boolean) =>
    `px-3 py-2 rounded-md text-sm font-medium ${
      isActive ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-100'
    }`;

  return (
    <div className="border-b bg-white">
      <div className="px-4 pt-4">
        <nav className="flex gap-2" aria-label="Email Subnavigation">
          <NavLink to={`${base}/overview`} className={({ isActive }) => tabCls(isActive || active === 'overview')}>
            Overview
          </NavLink>
          <NavLink to={`${base}/raw`} className={({ isActive }) => tabCls(isActive || active === 'raw')}>
            Raw
          </NavLink>
          <NavLink to={`${base}/dmarc`} className={({ isActive }) => tabCls(isActive || active === 'dmarc')}>
            DMARC
          </NavLink>
          <NavLink to={`${base}/settings`} className={({ isActive }) => tabCls(isActive || active === 'settings')}>
            Settings
          </NavLink>
        </nav>
      </div>
    </div>
  );
}

export default EmailNavTabs;
