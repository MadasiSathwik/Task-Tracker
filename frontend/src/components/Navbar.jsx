import { Layout, Avatar, Dropdown, Space, Typography, Switch } from 'antd';
import { UserOutlined, LogoutOutlined, CheckSquareOutlined, SunOutlined, MoonOutlined } from '@ant-design/icons';
import useAuth from '../hooks/useAuth';

const { Header } = Layout;
const { Text } = Typography;

const Navbar = ({ darkMode, onThemeToggle }) => {
  const { user, logout } = useAuth();

  const handleMenuClick = (e) => {
    if (e.key === 'logout') {
      logout();
    }
  };

  const menuItems = [
    {
      key: 'profile-info',
      label: (
        <div style={{ padding: '4px 12px' }}>
          <div style={{ fontWeight: 'bold' }}>{user?.username || 'User'}</div>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {user?.email || ''}
          </Text>
        </div>
      ),
      type: 'group',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Log Out',
      danger: true,
    },
  ];

  return (
    <Header
      style={{
        padding: 0,
        background: darkMode ? '#1e293b' : '#fff',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
        position: 'sticky',
        top: 0,
        zIndex: 10,
        width: '100%',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        borderBottom: darkMode ? '1px solid #334155' : 'none',
        transition: 'background 0.3s, border 0.3s',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Space size="middle">
            <CheckSquareOutlined style={{ fontSize: 28, color: '#1677ff' }} />
            <span style={{ fontSize: 20, fontWeight: 700, color: darkMode ? '#f1f5f9' : '#141414', letterSpacing: '-0.3px' }}>
              Task Tracker
            </span>
          </Space>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {/* Light/Dark Mode Switch */}
          <Switch
            checked={darkMode}
            onChange={onThemeToggle}
            checkedChildren={<MoonOutlined />}
            unCheckedChildren={<SunOutlined />}
            style={{ backgroundColor: darkMode ? '#1677ff' : '#d9d9d9' }}
          />

          <Dropdown
            menu={{
              items: menuItems,
              onClick: handleMenuClick,
            }}
            placement="bottomRight"
            trigger={['click']}
          >
            <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              <Space size="small">
                <Avatar
                  style={{ backgroundColor: '#1677ff' }}
                  icon={<UserOutlined />}
                >
                  {user?.username ? user.username[0].toUpperCase() : ''}
                </Avatar>
                <span style={{ fontWeight: 500, color: darkMode ? '#cbd5e1' : '#262626' }} className="hidden-mobile">
                  {user?.username || 'Profile'}
                </span>
              </Space>
            </div>
          </Dropdown>
        </div>
      </div>
    </Header>
  );
};

export default Navbar;
