import { Breadcrumb, Button, Flex, Form, Image, Space, Table, Tag, Typography } from "antd";
import { RightOutlined, PlusOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import ProductsFilters from "./ProductsFilters";
import { useState } from "react";
import { PER_PAGE } from "../../constants";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getProducts } from "../../http/api";
import { Product } from "../../types";
import { format } from "date-fns";

const columns = [
    {
        title: 'Product Name',
        dataIndex: 'name',
        key: 'name',
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        render: (_text: string, record: Product) => {
            return (
                <div>
                    <Space>
                        <Image width={60} src={record.image}/>
                        <Typography.Text>{record.name}</Typography.Text>
                    </Space>
                </div>
            )
        }
    },
    {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
    },
    {
        title: 'Status',
        dataIndex: 'isPublished',
        key: 'isPublished',
        render: (_: boolean, record: Product) => {
            return <>
                { record.isPublished? <Tag color="green">Published</Tag> : <Tag color="yellow">Draft</Tag> }
            </>
        }
    },
    {
        title: 'Created at',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (text: string) => {
            return (
                <Typography.Text>
                    {format(new Date(text), 'dd/mm/yyyy HH:mm')}
                </Typography.Text>
            )
        }
    },
]

const Products = () => {
    const [ filterForm ] = Form.useForm();
    const [ queryParams, setQueryParams ] = useState({
            perPage: PER_PAGE,
            currentPage: 1,
        });
    const { data: products } = useQuery({
        queryKey: ['products', queryParams],
        queryFn: async () => {
            const filteredParams = Object.fromEntries(Object.entries(queryParams).filter(item => !!item[1]));
            const queryString = new URLSearchParams(filteredParams as unknown as Record<string, string>).toString();
            return getProducts(queryString).then((res) => res.data)
        },
        placeholderData: keepPreviousData
    })

    return (
        <>
            <Space direction="vertical" style={{ width: '100%' }} size={"large"}>
                <Flex justify={"space-between"} align={"center"}>
                    <Breadcrumb separator={<RightOutlined />} items={[{ title: <Link to={"/"}>Dashboard</Link> }, { title: "Products"}]} />
                </Flex>
                <Form form={filterForm} onFieldsChange={() => {}}>
                    <ProductsFilters>
                        <Button icon={<PlusOutlined />} type="primary" onClick={() => {}}>Add Product</Button>
                    </ProductsFilters>
                </Form>
                <Table 
                    columns={[...columns, {
                    title: 'Actions',
                    key: 'actions',
                    render: () => (
                        <Space>
                            <Button type="link" onClick={() => { }}>Edit</Button>
                        </Space>
                    ),
                    }]} 
                pagination={{
                    showTotal: (total: number, range: number[]) => `Showing ${range[0]}-${range[1]} of ${total} items`,
                    pageSize: queryParams.perPage,
                    current: queryParams.currentPage,
                    total: products?.total || 0,
                    onChange: (page) => {
                        setQueryParams(() => {
                            return {
                                ...queryParams,
                                currentPage: page
                            }
                        });
                    }
                }} 
                dataSource={products?.data} 
                rowKey="_id" />
            </Space>
        </>
    )
}

export default Products;