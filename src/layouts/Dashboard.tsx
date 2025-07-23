import { Navigate, NavLink, Outlet } from "react-router-dom";
import { useAuthStore } from "../store";
import { Layout, Menu, theme } from "antd";
import Icon from "@ant-design/icons";
import { useState } from "react";
import Logo from "../components/icons/Logo";
import Home from "../components/icons/Home";
import User from "../components/icons/User";
import Food from "../components/icons/Food";
import Gift from "../components/icons/Gift";
import Basket from "../components/icons/Basket";

const { Sider, Header, Content, Footer } = Layout;
const items = [
    {
        key: '/',
        icon: <Icon component={Home} />,
        label: <NavLink to={"/"}>Home</NavLink>
    },
    {
        key: '/users',
        icon: <Icon component={User} />,
        label: <NavLink to={"/users"}>Users</NavLink>
    },
    {
        key: '/restaurants',
        icon: <Icon component={Food} />,
        label: <NavLink to={"/restaurants"}>restaurants</NavLink>
    },
    {
        key: '/products',
        icon: <Icon component={Basket} />,
        label: <NavLink to={"/products"}>products</NavLink>
    },
    {
        key: '/promos',
        icon: <Icon component={Gift} />,
        label: <NavLink to={"/promos"}>promos</NavLink>
    }
]
const Dashboard = () => {
    const [collapsed, setCollapsed] = useState(false);
    const { user } = useAuthStore();
    const {token: { colorBgContainer }} = theme.useToken();
    if(user === null) {
        return <Navigate to="auth/login" replace={true}/>
    }
    return <div>
        <Layout style={{ minHeight: '100vh' }}>
            <Sider theme="light" collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                <div className="logo"><Logo /></div>
                <Menu theme="light" defaultSelectedKeys={['/']} mode="inline" items={items} />
            </Sider>
            <Layout>
                <Header style={{ padding: 0, background: colorBgContainer }} />
                <Content style={{ margin: '0 16px' }}>
                    <Outlet />
                </Content>
                <Footer style={{ textAlign: 'center' }}>
                Pizza House ©{new Date().getFullYear()} Built with love by Yusuf
                </Footer>
            </Layout>
        </Layout>
    </div>
}

export default Dashboard;