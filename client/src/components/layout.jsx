import { Outlet, NavLink } from 'react-router-dom';
import styles from '../styles/layout.module.css';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Home',      icon: '⊞' },
  { to: '/progress',  label: 'Progress',  icon: '◎' },
  { to: '/languages', label: 'Languages', icon: '⊕' },
];

export default function Layout() {
  return (
    <div className={styles.layout}>
      <main className={styles.main}>
        <Outlet />
      </main>
      <nav className={styles.bottomNav}>
        {NAV_ITEMS.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.active : ''}`
            }
          >
            <span className={styles.navIcon}>{item.icon}</span>
            <span className={styles.navLabel}>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}