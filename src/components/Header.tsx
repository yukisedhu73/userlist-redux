import React from 'react';
import { Layout, Button } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';

import { useNavigate } from 'react-router-dom';

const { Header } = Layout;

const AppHeader: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <Header
      style={{
        backgroundColor: '#001529',
        padding: '0 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <div />
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ color: 'white', fontWeight: 500 }}>Elon Musk</span>
        <Button
          danger
          title='Log Out'
          // shape=""
          className='logOutBtn'
          icon={<LogoutOutlined className='logOutId' />}
          onClick={handleLogout}
        />
      </div>
    </Header>
  );
};

export default AppHeader;
