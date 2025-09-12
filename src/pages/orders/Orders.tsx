import { Breadcrumb, Form, Space, Table, Tag, Typography } from 'antd';
import { RightOutlined } from "@ant-design/icons";
import { Link } from 'react-router-dom';
import { FieldData, Order } from '../../types';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getOrders } from '../../http/api';
import { useAuthStore } from '../../store';
import React from 'react';
import OrdersFilters from './OrdersFilters';
import { colorMapping } from '../../constants';
import { capitalizeFirstLetter } from '../../utils';

const columns = [
    {
        title: "Order Id",
        dataIndex: '_id',
        key: '_id',
        render: (_text: string, record: Order) => {
            return <Typography.Text>{record._id}</Typography.Text>
        }
    },
    {
        title: "Customer",
        dataIndex: "customerId",
        key: "customerId._id",
        render: (_text: string, record: Order) => {
            if (!record.customerId) {
                return "";
            }
            return <Typography.Text>{record.customerId.firstName + " " + record.customerId.lastName}</Typography.Text>
        }
    },
    {
        title: "Address",
        dataIndex: "address",
        key: "address",
        render: (_text: string, record: Order) => {
            return <Typography.Text>{record.address}</Typography.Text>
        }
    },
    {
        title: "Comment",
        dataIndex: "comment",
        key: "comment",
        render: (_text: string, record: Order) => {
            return <Typography.Text>{record.comment}</Typography.Text>
        }
    },
    {
        title: "Payment Mode",
        dataIndex: "paymentMode",
        key: "paymentMode",
        render: (_text: string, record: Order) => {
            return <Typography.Text>{capitalizeFirstLetter(record.paymentMode)}</Typography.Text>
        }
    },
    {
        title: "Status",
        dataIndex: "orderStatus",
        key: "orderStatus",
        render: (_text: string, record: Order) => {
            return (
                <>
                    <Tag bordered={false} color={colorMapping[record.orderStatus]}>{capitalizeFirstLetter(record.orderStatus)}</Tag>
                </>
            )
        }
    },
    {
        title: "Total",
        dataIndex: "total",
        key: "total",
        render: (_text: string, record: Order) => {
            return <Typography.Text>₹{record.total}</Typography.Text>
        }
    },
    {
        title: "Placed At",
        dataIndex: "createdAt",
        key: "createdAt",
        render: (_text: string, record: Order) => {
            return <Typography.Text>{new Date(record.createdAt).toLocaleString("en-IN", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true, // set false if you want 24-hour format
            })}</Typography.Text>
        }
    },
    {
        title: "Action",
        render: (_: string, record: Order) => {
            return <Link to={`/orders/${record._id}`}>View</Link>
        }
    }
]

const Orders = () => {
    const [filterForm] = Form.useForm();
    const { user } = useAuthStore();
    const [orders, setOrders] = React.useState<Order[]>([]);
    const [filters, setFilters] = React.useState<{ q?: string }>({});
    const [selectedTenant, setSelectedTenant] = React.useState<string>('');

    const { data: ordersData, isLoading, isError } = useQuery({
        queryKey: ['orders', selectedTenant],
        queryFn: async () => {
            const tenantId = user?.role === "admin" && selectedTenant ? Number(selectedTenant) : null
            return await getOrders(tenantId).then((res) => res.data)
        },
        placeholderData: keepPreviousData
    })

    React.useEffect(() => {
        setOrders(ordersData)
    }, [ordersData])

    const filteredOrders = React.useMemo(() => {
        let data = orders;
        if (filters.q) {
            const q = filters.q.toLowerCase();
            data = data.filter(order => order._id.toLowerCase().includes(q));
        }
        return data;
    }, [orders, filters]);

    const onFilterChange = (changedFields: FieldData[]) => {
        const changedFilterFields = changedFields.map((field) => ({
            [field.name[0]]: field.value
        })).reduce((acc, curr) => ({ ...acc, ...curr }), {});
        if (changedFilterFields.tenantId) {
            setSelectedTenant(changedFilterFields.tenantId);
            return;
        }
        setFilters((prev) => ({ ...prev, ...changedFilterFields }));
    };
    return (
        <>
            <Space direction="vertical" style={{ width: '100%' }} size={"large"}>
                <Breadcrumb separator={<RightOutlined />} items={[{ title: <Link to={"/"}>Dashboard</Link> }, { title: "Orders" }]} />
                <Form form={filterForm} onFieldsChange={onFilterChange}>
                    <OrdersFilters />
                </Form>
                {
                    isLoading && (
                        <div>Loading...</div>
                    )
                }
                {
                    isError && (
                        <div>Something went wrong</div>
                    )
                }
                <Table
                    columns={columns}
                    dataSource={filteredOrders}
                    rowKey="_id"
                    pagination={{
                        pageSize: 6,
                    }}
                />
            </Space >
        </>
    )
}

export default Orders;