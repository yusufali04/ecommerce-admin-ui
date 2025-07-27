import { Breadcrumb, Button, Drawer, Space, Table } from "antd";
import { PlusOutlined, RightOutlined } from "@ant-design/icons"
import { Link, Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getTenants } from "../../http/api";
import { useAuthStore } from "../../store";
import { useState } from "react";
import TenantsFilters from "./TenantsFilters";

const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id'
    },
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name'
    },
    {
        title: 'Address',
        dataIndex: 'address',
        key: 'address',
    }
]

const Tenants = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const { user } = useAuthStore();
    const { data: tenantsData, isLoading, error } = useQuery({
        queryKey: ['tenants'],
        queryFn: async () => {
            return getTenants().then((res) => res.data)
        }
    }) 
    if (user?.role !== "admin") {
        return <Navigate to="/" replace={true} />
    }
    return (
        <>
            <Space direction="vertical" style={{ width: '100%' }} size={"large"}>
                <Breadcrumb separator={<RightOutlined />} items={[{ title: <Link to={"/"}>Dashboard</Link> }, { title: "Restaurants"}]} />
                {isLoading && <div>Loading...</div>}
                {error && <div>{error && "Error while fetching restaurants!"}</div>}
                <TenantsFilters onFilterChange={(filterName, filterValue) => {
                    console.log("Filter changed:", filterName, filterValue);
                }}>
                    <Button icon={<PlusOutlined />} type="primary" onClick={() => { setDrawerOpen(true); }}>Add Restaurant</Button>
                </TenantsFilters>
                <Table columns={columns} dataSource={tenantsData} rowKey="id" />
                <Drawer
                    title="Create Restaurant"
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
                    <p>Content</p>
                </Drawer>
            </Space>
        </>
    )
}

export default Tenants;