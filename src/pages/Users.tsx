import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { fetchUsers } from '../features/users/userThunk';
import { setPage } from '../features/users/userSlice';
import { Card, Avatar, Table, Button, Pagination, Spin, Input, Radio } from 'antd';
import { EditOutlined, DeleteOutlined, SearchOutlined, PlusOutlined, TableOutlined, AppstoreOutlined } from '@ant-design/icons';
import '../styles/users.css';

const Users = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { list, loading, error, page, total, per_page } = useSelector((state: RootState) => state.users);
    const [isCardView, setIsCardView] = useState(false);
    const [search, setSearch] = useState('');

    useEffect(() => {
        dispatch(fetchUsers(page));
    }, [dispatch, page]);

    const handlePageChange = (p: number) => {
        dispatch(setPage(p));
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    const filteredList = list.filter((user) => {
        const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
        return (
            fullName.includes(search.toLowerCase()) ||
            user.email.toLowerCase().includes(search.toLowerCase())
        );
    });

    const columns = [
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            render: (text: string, record: any) => (
                <>
                    <Avatar src={record.avatar} style={{ marginRight: 8 }} /> {text}
                </>
            ),
        },
        {
            title: 'First Name',
            dataIndex: 'first_name',
            key: 'first_name',
        },
        {
            title: 'Last Name',
            dataIndex: 'last_name',
            key: 'last_name',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_: any, record: any) => (
                <>
                    <Button type="primary" style={{ marginRight: 8 }} icon={<EditOutlined />} />
                    <Button type="primary" danger icon={<DeleteOutlined />} />
                </>
            ),
        },
    ];

    return (
        <div className="user-container">
            <Card>
                <div className="user-header">
                    <h2>Users</h2>
                    <div className="user-toolbar">
                        <Radio.Group
                            value={isCardView ? 'card' : 'table'}
                            onChange={(e) => setIsCardView(e.target.value === 'card')}
                            buttonStyle="solid"
                            className="view-toggle-group"
                        >
                            <Radio.Button value="table">
                                <TableOutlined /> Table
                            </Radio.Button>
                            <Radio.Button value="card">
                                <AppstoreOutlined /> Card
                            </Radio.Button>
                        </Radio.Group>
                        <Input
                            placeholder="Search user"
                            value={search}
                            onChange={handleSearchChange}
                            allowClear
                            suffix={<SearchOutlined />}
                            className="search-input"
                        />
                        <Button type="primary" icon={<PlusOutlined />}>Create User</Button>
                    </div>
                </div>

                {loading ? (
                    <Spin />
                ) : error ? (
                    <p style={{ color: 'red' }}>{error}</p>
                ) : isCardView ? (
                    <div className="card-grid">
                        {filteredList.map((user) => (
                            <Card key={user.id} className="user-card" hoverable>
                                <Avatar src={user.avatar} size={64} style={{ margin: '0 auto' }} />
                                <h3>{user.first_name} {user.last_name}</h3>
                                <p>{user.email}</p>
                                <div className="card-actions">
                                    <Button shape="circle" icon={<EditOutlined />} />
                                    <Button shape="circle" icon={<DeleteOutlined />} danger />
                                </div>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Table
                        columns={columns}
                        dataSource={filteredList.map((user) => ({ ...user, key: user.id }))}
                        pagination={false}
                    />
                )}

                <div className="pagination-container">
                    <Pagination
                        current={page}
                        total={total}
                        pageSize={per_page}
                        onChange={handlePageChange}
                    />
                </div>
            </Card>
        </div>
    );
};

export default Users;