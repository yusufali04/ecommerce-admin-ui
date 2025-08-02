import { Breadcrumb, Button, Drawer, Form, Space, Table } from "antd";
import { PlusOutlined, RightOutlined } from "@ant-design/icons"
import { Link, Navigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createTenant, getTenants, updateTenant } from "../../http/api";
import { useAuthStore } from "../../store";
import React, { useState } from "react";
import TenantsFilters from "./TenantsFilters";
import { PER_PAGE } from "../../constants";
import { debounce } from "lodash";
import { FieldData, Tenant, TenantFormValues } from "../../types";
import TenantForm from "./forms/TenantForm";

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
    const [ currentEditingTenant, setCurrentEditingTenant ] = useState<Tenant | null>(null);
    const queryClient = useQueryClient();
    const [ filterForm ] = Form.useForm();
    const [ tenantForm ] = Form.useForm();
    const [ queryParams, setQueryParams ] = useState({
            perPage: PER_PAGE,
            currentPage: 1,
        });
    const [drawerOpen, setDrawerOpen] = useState(false);
    const { user } = useAuthStore();
    React.useEffect(() => {
            if (currentEditingTenant) {
                setDrawerOpen(true);
                tenantForm.setFieldsValue({
                    ...currentEditingTenant,
                    tenantId: currentEditingTenant?.id
                });
            }
    }, [currentEditingTenant, tenantForm]);
    const { data: tenantsData, isLoading, error } = useQuery({
        queryKey: ['tenants', queryParams],
        queryFn: async () => {
            const filteredParams = Object.fromEntries(Object.entries(queryParams).filter(item => !!item[1]));
            const queryString = new URLSearchParams(filteredParams as unknown as Record<string, string>).toString();
            return getTenants(queryString).then((res) => res.data)
        }
    });
    const { mutate: createTenantMutate } = useMutation({
            mutationFn: async (data: TenantFormValues) => {return createTenant(data as Tenant).then((res) => res.data)},
            onSuccess: async () => {
                queryClient.invalidateQueries({ queryKey: ['tenants'] });
                return;
            },
    });
    const { mutate: updateTenantMutate } = useMutation({
            mutationFn: async (data: TenantFormValues) => {
                return updateTenant(String(currentEditingTenant!.id), data).then((res) => res.data);
            },
            onSuccess: async () => {
                queryClient.invalidateQueries({ queryKey: ['tenants'] });
                return;
            },
    });
    const debouncedQUpdate = React.useMemo(() => {
            return debounce((value: string | undefined)=> {
                setQueryParams((prev) => ({...prev, q: value, currentPage: 1}));
            }, 500)
        }, []);
        const onFilterChange = (changedFields: FieldData[]) => {
            const changedFilterFields = changedFields.map((field) => {
                return {
                    [field.name[0]]: field.value
                }
            }).reduce((acc, curr) => ({...acc,...curr}), {});
            console.log(changedFilterFields);
            
            if('q' in changedFilterFields) {
                debouncedQUpdate(changedFilterFields.q);
            } else {
                setQueryParams((prev) => ({...prev, ...changedFilterFields, currentPage: 1}));
            }
        }
        const handleSubmit = async () => {
            const isEditMode = !!currentEditingTenant;
            await tenantForm.validateFields();
            if (isEditMode) {
                await updateTenantMutate(tenantForm.getFieldsValue() as TenantFormValues);
            } else {
                await createTenantMutate(tenantForm.getFieldsValue() as TenantFormValues);
            }
            setCurrentEditingTenant(null);
            setDrawerOpen(false);
            tenantForm.resetFields();
        }
    if (user?.role !== "admin") {
        return <Navigate to="/" replace={true} />
    }
    return (
        <>
            <Space direction="vertical" style={{ width: '100%' }} size={"large"}>
                <Breadcrumb separator={<RightOutlined />} items={[{ title: <Link to={"/"}>Dashboard</Link> }, { title: "Restaurants"}]} />
                {isLoading && <div>Loading...</div>}
                {error && <div>{error && "Error while fetching restaurants!"}</div>}
                <Form form={filterForm} onFieldsChange={onFilterChange}>
                    <TenantsFilters>
                        <Button icon={<PlusOutlined />} type="primary" onClick={() => { setDrawerOpen(true); }}>Add Restaurant</Button>
                    </TenantsFilters>
                </Form>
                
                <Table 
                    columns={[...columns, 
                        {
                            title: "Actions",
                            key: "actions",
                            render: (_text: string, record: Tenant) => (
                                <Space>
                                    <Button type="link" onClick={() => { setCurrentEditingTenant(record); setDrawerOpen(true); }}>Edit</Button>
                                </Space>
                            ),
                        }
                    ]} 
                    dataSource={tenantsData?.data} 
                    rowKey="id"
                    
                    pagination={{
                    showTotal: (total: number, range: number[]) => `Showing ${range[0]}-${range[1]} of ${total} items`,
                    pageSize: queryParams.perPage,
                    current: queryParams.currentPage,
                    total: tenantsData?.total || 0,
                    onChange: (page) => {
                        setQueryParams(() => {
                            return {
                                ...queryParams,
                                currentPage: page
                            }
                        });
                    }
                }}   />
                <Drawer
                    title={currentEditingTenant ? "Edit Restaurant" : "Create Restaurant"}
                    placement="right"
                    width={720}
                    destroyOnHidden={true}
                    open={drawerOpen}
                    onClose={() => { setDrawerOpen(false); setCurrentEditingTenant(null); tenantForm.resetFields(); }}
                    extra={
                        <Space>
                            <Button onClick={() => { setDrawerOpen(false); setCurrentEditingTenant(null); tenantForm.resetFields(); }}>
                                Cancel
                            </Button>
                            <Button onClick={handleSubmit} type="primary">
                                Submit
                            </Button>
                        </Space>
                    }
                >
                    <Form form={tenantForm}>
                        <TenantForm />
                    </Form>
                </Drawer>
            </Space>
        </>
    )
}

export default Tenants;