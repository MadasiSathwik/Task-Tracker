import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import Navbar from '../Navbar';
import { useTheme } from '../../context/ThemeContext';

const { Content, Footer } = Layout;

const AppLayout = () => {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <Layout
      style={{
        minHeight: '100vh',
        background: darkMode ? '#0f172a' : '#f8fafc',
        transition: 'background 0.3s',
      }}
    >
      <Navbar darkMode={darkMode} onThemeToggle={toggleTheme} />
      <Content
        style={{
          width: '100%',
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '32px 24px',
          minHeight: 'calc(100vh - 140px)',
        }}
      >
        <Outlet />
      </Content>
      <Footer
        style={{
          textAlign: 'center',
          color: darkMode ? '#64748b' : '#64748b',
          background: darkMode ? '#0f172a' : '#f8fafc',
          padding: '24px 16px',
          transition: 'background 0.3s, color 0.3s',
        }}
      >
        Task Tracker ©{new Date().getFullYear()} • Designed with Ant Design & Vite
      </Footer>
    </Layout>
  );
};

export default AppLayout;
