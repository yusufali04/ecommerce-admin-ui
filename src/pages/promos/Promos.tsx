import { Breadcrumb, Button, Drawer, Form, Space, Table, Typography } from "antd";
import { PlusOutlined, RightOutlined } from "@ant-design/icons";
import { Link, Navigate } from "react-router-dom";
import { useAuthStore } from "../../store";
import { useState, useMemo, useEffect } from "react";
import { FieldData, Promo } from "../../types";
import PromosFilters from "./PromosFilters";
import PromoForm from "./forms/PromoForm";
import { createPromo, getPromos, updatePromo } from "../../http/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";

const columns = [
    {
        title: 'Code',
        dataIndex: 'code',
        key: 'code'
    },
    {
        title: 'Title',
        dataIndex: 'title',
        key: 'title',
    },
    {
        title: 'Discount',
        dataIndex: 'discount',
        key: 'discount',
        render: (_text: string, record: Promo) => {
            return record.discount + "%"
        }
    },
    {
        title: 'Valid till',
        dataIndex: 'validUpto',
        key: 'validUpto',
        render: (_text: string, record: Promo) => {
            return <Typography.Text>
                {new Date(record.validUpto).toLocaleString("en-US", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true, // set false if you want 24-hour format
                })}
            </Typography.Text>
        }
    }
];

const Promos = () => {
    const [currentEditingPromo, setCurrentEditingPromo] = useState<Promo | null>(null);
    const [filterForm] = Form.useForm();
    const [promoForm] = Form.useForm();
    const [drawerOpen, setDrawerOpen] = useState(false);
    const { user } = useAuthStore();
    const [promos, setPromos] = useState<Promo[]>([]);
    const [filters, setFilters] = useState<{ q?: string }>({});
    const [selectedTenant, setSelectedTenant] = useState<string>('');
    const queryClient = useQueryClient();

    const { data: promosData, isLoading, error } = useQuery({
        queryKey: ['promos', selectedTenant],
        queryFn: async () => {
            return await getPromos(user?.role === "admin" && selectedTenant ? Number(selectedTenant) : null).then((res) => res.data)
        },
    });

    useEffect(() => {
        if (promosData) {
            setPromos(promosData);
        }
        if (currentEditingPromo) {
            promoForm.setFieldsValue({
                ...currentEditingPromo,
                validUpto: dayjs(currentEditingPromo.validUpto).format("YYYY-MM-DDTHH:mm")
            });
        }
    }, [promosData, currentEditingPromo, promoForm]);
    const filteredPromos = useMemo(() => {
        let data = promos;
        if (filters.q) {
            const q = filters.q.toLowerCase();
            data = data.filter(
                promo =>
                    promo.code.toLowerCase().includes(q) ||
                    promo.title.toLowerCase().includes(q)
            );
        }
        return data;
    }, [promos, filters]);

    const onFilterChange = (changedFields: FieldData[]) => {
        const changedFilterFields = changedFields.map((field) => ({
            [field.name[0]]: field.value
        })).reduce((acc, curr) => ({ ...acc, ...curr }), {});
        if (changedFilterFields.tenantId) {
            setSelectedTenant(changedFilterFields.tenantId);
            return;
        }
        setFilters(prev => ({ ...prev, ...changedFilterFields }));
    };
    const { mutate: createPromoMutate } = useMutation({
        mutationFn: async (data: Promo) => {
            return createPromo(data as Promo).then((res) => res.data)
        },
        onSuccess: async () => {
            queryClient.invalidateQueries({ queryKey: ['promos'] });
            return;
        },
    });

    const { mutate: updatePromoMutate } = useMutation({
        mutationFn: async ({ id, data }: { id: string, data: Promo }) => {
            return await updatePromo(id as string, data).then((res) => res.data);
        },
        onSuccess: async () => {
            queryClient.invalidateQueries({ queryKey: ['promos'] });
            return;
        },
    });

    const handleSubmit = async () => {
        await promoForm.validateFields();
        const { code, title, validUpto, discount } = promoForm.getFieldsValue() as Promo;
        const finalPromoData = { code, title, validUpto, discount, tenantId: selectedTenant ? selectedTenant : undefined };
        console.log(currentEditingPromo);

        if (currentEditingPromo) {
            updatePromoMutate({ id: currentEditingPromo._id!, data: finalPromoData })
        } else {
            createPromoMutate(finalPromoData)
        }
        setCurrentEditingPromo(null);
        setDrawerOpen(false);
        promoForm.resetFields();
    };

    if (user?.role !== "admin" && user?.role !== "manager") {
        return <Navigate to="/" replace={true} />
    }

    return (
        <>
            <Space direction="vertical" style={{ width: '100%' }} size={"large"}>
                <Breadcrumb separator={<RightOutlined />} items={[{ title: <Link to={"/"}>Dashboard</Link> }, { title: "Promos" }]} />
                <Form form={filterForm} onFieldsChange={onFilterChange}>
                    <PromosFilters>
                        <Button disabled={(user?.role === "admin" && !selectedTenant) ? true : false} icon={<PlusOutlined />} type="primary" onClick={() => { setDrawerOpen(true); }}>Add Promo</Button>
                    </PromosFilters>
                </Form>
                {
                    isLoading && (
                        <div>Loading...</div>
                    )
                }
                {
                    error && (
                        <div>Something went wrong</div>
                    )
                }
                <Table
                    columns={[
                        ...columns,
                        {
                            title: "Actions",
                            key: "actions",
                            render: (_text: string, record: Promo) => (
                                <Space>
                                    <Button type="link" onClick={() => { setCurrentEditingPromo(record); setDrawerOpen(true); }}>Edit</Button>
                                </Space>
                            ),
                        }
                    ]}
                    dataSource={filteredPromos}
                    rowKey="id"
                    pagination={false}
                />
                <Drawer
                    title={currentEditingPromo ? "Edit Promo" : "Create Promo"}
                    placement="right"
                    width={720}
                    destroyOnHidden={true}
                    open={drawerOpen}
                    onClose={() => { setDrawerOpen(false); setCurrentEditingPromo(null); promoForm.resetFields(); }}
                    extra={
                        <Space>
                            <Button onClick={() => { setDrawerOpen(false); setCurrentEditingPromo(null); promoForm.resetFields(); }}>
                                Cancel
                            </Button>
                            <Button onClick={handleSubmit} type="primary">Submit</Button>

                        </Space>
                    }
                >
                    <Form form={promoForm}>
                        <PromoForm />
                    </Form>
                </Drawer >
            </Space >
        </>
    );
};

export default Promos;
