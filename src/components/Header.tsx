import React from 'react';
import { Layout, Button, Avatar } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Header } = Layout;

const AppHeader: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <Header style={{ backgroundColor: '#001529', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div />
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ color: 'white', fontWeight: 500 }}>Elon Musk</span>
        <Button danger shape="circle" onClick={handleLogout}>
          G
        </Button>
      </div>
    </Header>
  );
};

export default AppHeader;
