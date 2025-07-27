import { Breadcrumb, Button, Drawer, Form, Space, Table, theme } from "antd";
import { PlusOutlined, RightOutlined } from "@ant-design/icons"
import { Link, Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../../http/api";
import { User } from "../../types";
import { useAuthStore } from "../../store";
import UsersFilters from "./UsersFilters";
import { useState } from "react";
import UserForm from "./forms/UserForm";

const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id'
    },
    {
        title: 'First Name',
        dataIndex: 'firstName',
        key: 'firstName',
        render: (_text: string, record: User) => {
            return (<div>
                {record.firstName} {record.lastName}
            </div>)
        },
    },
    {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
    },
    {
        title: 'Role',
        dataIndex: 'role',
        key: 'role',
    },
    {
        title: 'Restaurant',
        key: 'restaurant',
        render: (_text: string, record: User) => record.tenant?.name || '-',
    }
]

const Users = () => {
    const { token: { colorBgLayout } } = theme.useToken();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const { user } = useAuthStore();
    const { data: users, isLoading, error } = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            return getUsers().then((res) => res.data)
        }
    }) 
    if (user?.role !== "admin") {
        return <Navigate to="/" replace={true} />
    }
    return (
        <>
            <Space direction="vertical" style={{ width: '100%' }} size={"large"}>
                <Breadcrumb separator={<RightOutlined />} items={[{ title: <Link to={"/"}>Dashboard</Link> }, { title: "Users"}]} />
                {isLoading && <div>Loading...</div>}
                {error && <div>{error && "Error while fetching users!"}</div>}
                <UsersFilters onFilterChange={(filterName, filterValue) => {
                    console.log("Filter changed:", filterName, filterValue);
                }}>
                    <Button icon={<PlusOutlined />} type="primary" onClick={() => { setDrawerOpen(true); }}>Add User</Button>
                </UsersFilters>
                <Table columns={columns} dataSource={users} rowKey="id" />
                <Drawer
                    styles={{body: { backgroundColor: colorBgLayout }}}
                    title="Create User"
                    placement="right"
                    width={720}
                    destroyOnHidden={true}
                    open={drawerOpen}
                    onClose={() => { setDrawerOpen(false); }}
                    extra={
                        <Space>
                            <Button onClick={() => { setDrawerOpen(false); }}>
                                Cancel
                            </Button>
                            <Button onClick={() => {}} type="primary">
                                Submit
                            </Button>
                        </Space>
                    }
                >
                    <Form layout="vertical">
                        <UserForm />
                    </Form>
                </Drawer>
            </Space>
        </>
    )
}

export default Users;