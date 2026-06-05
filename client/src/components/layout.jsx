import { Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import styles from '../styles/layout.module.css';

const NAV_ITEMS = [
  { to: '/dashboard',  label: 'Dashboard', icon: '⊞' },
  { to: '/progress',   label: 'Progress',  icon: '◎' },
  { to: '/languages',  label: 'Languages', icon: '⊕' },
];

export default function Layout() {
  const { user, logout } = useAuth();

  return (
    <div className={styles.layout}>

      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarTop}>
          <div className={styles.brand}>
            <span className={styles.brandIcon}>𝕃</span>
            <span className={styles.brandName}>Lingua</span>
          </div>

          <nav className={styles.nav}>
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

        <div className={styles.sidebarBottom}>
          <div className={styles.profileBar}>
            <div className={styles.avatarRing}>
              <div className={styles.avatar}>
                {user?.name?.charAt(0).toUpperCase() || '?'}
              </div>
              <span className={styles.statusDot} />
            </div>
            <div className={styles.userInfo}>
              <p className={styles.userName}>{user?.name}</p>
              <p className={styles.userLang}>
                {user?.language
                  ? user.language.charAt(0).toUpperCase() + user.language.slice(1)
                  : 'No language'}
              </p>
            </div>
            <button className={styles.logoutBtn} onClick={logout} title="Log out">↗</button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}