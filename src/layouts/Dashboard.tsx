import { Navigate, NavLink, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../store";
import { Avatar, Badge, Dropdown, Flex, Layout, Menu, Space, theme } from "antd";
import Icon, { BellFilled } from "@ant-design/icons";
import { useState } from "react";
import Logo from "../components/icons/Logo";
import Home from "../components/icons/Home";
import User from "../components/icons/User";
import Food from "../components/icons/Food";
import Gift from "../components/icons/Gift";
import Basket from "../components/icons/Basket";
import { useMutation } from "@tanstack/react-query";
import { logout } from "../http/api";

const { Sider, Header, Content, Footer } = Layout;

const getMenuItems = (role: string) => { 
    const baseItems = [
        {
            key: '/',
            icon: <Icon component={Home} />,
            label: <NavLink to={"/"}>Home</NavLink>
        },
        {
            key: '/restaurants',
            icon: <Icon component={Food} />,
            label: <NavLink to={"/restaurants"}>Restaurants</NavLink>
        },
        {
            key: '/products',
            icon: <Icon component={Basket} />,
            label: <NavLink to={"/products"}>Products</NavLink>
        },
        {
            key: '/promos',
            icon: <Icon component={Gift} />,
            label: <NavLink to={"/promos"}>Promos</NavLink>
        }
    ]
    if(role === "admin") {
        baseItems.splice(1, 0, {
                key: '/users',
                icon: <Icon component={User} />,
                label: <NavLink to={"/users"}>Users</NavLink>
            })
    }
    return baseItems;
 }

const Dashboard = () => {
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);
    const { logout: logoutFromStore, user } = useAuthStore();
    const {token: { colorBgContainer }} = theme.useToken();
    const items = getMenuItems(user?.role as string);

    const { mutate: logoutMutate } = useMutation({
        mutationKey: ["logout"],
        mutationFn: logout,
        onSuccess: async () => {
            logoutFromStore();
            return;
        }
    })
    if(user === null) {
        return <Navigate to={`/auth/login?returnTo=${encodeURIComponent(location.pathname)}`} replace={true}/>
    }
    return <div>
        <Layout style={{ minHeight: '100vh' }}>
            <Sider theme="light" collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                <div className="logo"><Logo /></div>
                <Menu theme="light" defaultSelectedKeys={[location.pathname]} mode="inline" items={items} />
            </Sider>
            <Layout>
                <Header style={{ padding: "0px 16px", background: colorBgContainer }} >
                    <Flex gap="middle" align="start" justify="space-between">
                            <Badge
                                text={user.role === "admin"? "You are an admin": user.tenant?.name}
                                status="success"
                            />
                            <Space size={16}>
                                <Badge dot={true}>
                                    <BellFilled />
                                </Badge>
                                <Dropdown
                                    menu={{
                                        items: [
                                            {
                                                key: 'logout',
                                                label: 'Logout',
                                                onClick: () => logoutMutate(),
                                            },
                                        ],
                                    }}
                                    placement="bottomRight">
                                    <Avatar
                                        style={{
                                            backgroundColor: '#fde3cf',
                                            color: '#f56a00',
                                        }}>
                                        U
                                    </Avatar>
                                </Dropdown>
                            </Space>
                        </Flex>
                </Header>
                <Content style={{ margin: '16px' }}>
                    <Outlet />
                </Content>
                <Footer style={{ textAlign: 'center' }}>
                Pizza House ©{new Date().getFullYear()} Built with 💖 by Yusuf
                </Footer>
            </Layout>
        </Layout>
    </div>
}

export default Dashboard;