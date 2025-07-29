import { Breadcrumb, Button, Drawer, Flex, Form, Space, Spin, Table, theme, Typography } from "antd";
import { LoadingOutlined, PlusOutlined, RightOutlined } from "@ant-design/icons"
import { Link, Navigate } from "react-router-dom";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createUser, getUsers } from "../../http/api";
import { User, UserFormValues } from "../../types";
import { useAuthStore } from "../../store";
import UsersFilters from "./UsersFilters";
import { useState } from "react";
import UserForm from "./forms/UserForm";
import { PER_PAGE } from "../../constants";

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
    const [form] = Form.useForm();
    const queryClient = useQueryClient();
    const { token: { colorBgLayout } } = theme.useToken();
    const [ queryParams, setQueryParam ] = useState({
        perPage: PER_PAGE,
        currentPage: 1,
    });
    const [drawerOpen, setDrawerOpen] = useState(false);
    const { user } = useAuthStore();
    const { data: users, isFetching, error } = useQuery({
        queryKey: ['users', queryParams],
        queryFn: async () => {
            const queryString = new URLSearchParams({
                perPage: queryParams.perPage.toString(),
                currentPage: queryParams.currentPage.toString()
            }).toString();
            return getUsers(queryString).then((res) => res.data)
        },
        placeholderData: keepPreviousData
    })
    const { mutate: createUserMutate } = useMutation({
        mutationFn: async (data: UserFormValues) => {return createUser(data).then((res) => res.data)},
        onSuccess: async () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            form.resetFields();
            setDrawerOpen(false);
            return;
        },
    });
    const handleSubmit = () => {
        form.validateFields().then((values) => {
            console.log("Form values:", values);
            createUserMutate(values as UserFormValues);
        }).catch((errorInfo) => {
            console.error("Validation failed:", errorInfo);
        });
    }
    if (user?.role !== "admin") {
        return <Navigate to="/" replace={true} />
    }
    return (
        <>
            <Space direction="vertical" style={{ width: '100%' }} size={"large"}>
                <Flex justify={"space-between"} align={"center"}>
                    <Breadcrumb separator={<RightOutlined />} items={[{ title: <Link to={"/"}>Dashboard</Link> }, { title: "Users"}]} />
                    {isFetching && (<Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />)}
                    {error && <Typography.Text type="danger">{error && "Error while fetching users!"}</Typography.Text>}
                </Flex>
                <UsersFilters onFilterChange={(filterName, filterValue) => {
                    console.log("Filter changed:", filterName, filterValue);
                }}>
                    <Button icon={<PlusOutlined />} type="primary" onClick={() => { setDrawerOpen(true); }}>Add User</Button>
                </UsersFilters>
                <Table 
                columns={columns} 
                pagination={{
                    pageSize: queryParams.perPage,
                    current: queryParams.currentPage,
                    total: users?.total || 0,
                    onChange: (page) => {
                        setQueryParam(() => {
                            return {
                                ...queryParams,
                                currentPage: page
                            }
                        });
                    }
                }} 
                dataSource={users?.data} 
                rowKey="id" />
                <Drawer
                    styles={{body: { backgroundColor: colorBgLayout }}}
                    title="Create User"
                    placement="right"
                    width={720}
                    destroyOnHidden={true}
                    open={drawerOpen}
                    onClose={() => { 
                        setDrawerOpen(false); 
                        form.resetFields();
                    }}
                    extra={
                        <Space>
                            <Button onClick={() => { 
                                setDrawerOpen(false); 
                                form.resetFields(); 
                            }}>
                                Cancel
                            </Button>
                            <Button onClick={handleSubmit} type="primary">
                                Submit
                            </Button>
                        </Space>
                    }
                >
                    <Form layout="vertical" form={form}>
                        <UserForm />
                    </Form>
                </Drawer>
            </Space>
        </>
    )
}

export default Users;