import { Breadcrumb, Button, Drawer, Flex, Form, Image, Space, Spin, Table, Tag, theme, Typography } from "antd";
import { RightOutlined, PlusOutlined, LoadingOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import ProductsFilters from "./ProductsFilters";
import React, { useState } from "react";
import { PER_PAGE } from "../../constants";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getProducts } from "../../http/api";
import { FieldData, Product } from "../../types";
import { format } from "date-fns";
import { debounce } from "lodash";
import { useAuthStore } from "../../store";
import ProductForm from "./forms/ProductForm";

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
                        <Image width={60} src={record.image} />
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
                {record.isPublished ? <Tag color="green">Published</Tag> : <Tag color="yellow">Draft</Tag>}
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
    const [currentEditingProduct, setCurrentEditingProduct] = useState<Product | null>(null);
    const { user } = useAuthStore();
    const [filterForm] = Form.useForm();
    const [form] = Form.useForm();
    const { token: { colorBgLayout } } = theme.useToken();
    const [drawerOpen, setDrawerOpen] = useState(false);
    // const queryClient = useQueryClient();
    // React.useEffect(() => {
    //     if (currentEditingProduct) {
    //         setDrawerOpen(true);
    //         form.setFieldsValue({
    //             ...currentEditingProduct,
    //             tenantId: currentEditingProduct.tenant?.id
    //         });
    //     }
    // }, [currentEditingProduct, form]);
    const [queryParams, setQueryParams] = useState({
        perPage: PER_PAGE,
        currentPage: 1,
        isPublished: true,
        tenantId: user!.role === 'manager' ? user!.tenant?.id : undefined
    });
    const { data: products, isFetching, error } = useQuery({
        queryKey: ['products', queryParams],
        queryFn: async () => {
            const filteredParams = Object.fromEntries(Object.entries(queryParams).filter(item => !!item[1]));
            const queryString = new URLSearchParams(filteredParams as unknown as Record<string, string>).toString();
            return getProducts(queryString).then((res) => res.data)
        },
        placeholderData: keepPreviousData
    })
    const debouncedQUpdate = React.useMemo(() => {
        return debounce((value: string | undefined) => {
            setQueryParams((prev) => ({ ...prev, q: value, currentPage: 1 }));
        }, 500)
    }, []);
    const onFilterChange = (changedFields: FieldData[]) => {
        const changedFilterFields = changedFields.map((field) => {
            return {
                [field.name[0]]: field.value
            }
        }).reduce((acc, curr) => ({ ...acc, ...curr }), {});

        if ('q' in changedFilterFields) {
            debouncedQUpdate(changedFilterFields.q);
        } else {
            setQueryParams((prev) => ({ ...prev, ...changedFilterFields, currentPage: 1 }));
        }
    }
    // const { mutate: createUserMutate } = useMutation({
    //     mutationFn: async (data: ProductFormValues) => {return createUser(data).then((res) => res.data)},
    //     onSuccess: async () => {
    //         queryClient.invalidateQueries({ queryKey: ['users'] });
    //         return;
    //     },
    // });
    // const { mutate: updateProductMutate } = useMutation({
    //     mutationFn: async (data: ProductFormValues) => {
    //         return updateUser(String(currentEditingProduct!.id), data).then((res) => res.data);
    //     },
    //     onSuccess: async () => {
    //         queryClient.invalidateQueries({ queryKey: ['users'] });
    //         return;
    //     },
    // });
    // const handleSubmit = async () => {
    //         const isEditMode = !!currentEditingProduct;
    //         await form.validateFields();
    //         if (isEditMode) {
    //             await updateProductMutate(form.getFieldsValue() as UserFormValues);
    //         } else {
    //             await updateProductMutate(form.getFieldsValue() as UserFormValues);
    //         }
    //         setCurrentEditingProduct(null);
    //         setDrawerOpen(false);
    //         form.resetFields();
    // }
    return (
        <>
            <Space direction="vertical" style={{ width: '100%' }} size={"large"}>
                <Flex justify={"space-between"} align={"center"}>
                    <Breadcrumb separator={<RightOutlined />} items={[{ title: <Link to={"/"}>Dashboard</Link> }, { title: "Products" }]} />
                    {isFetching && (<Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />)}
                    {error && <Typography.Text type="danger">{error && "Error while fetching products!"}</Typography.Text>}
                </Flex>
                <Form form={filterForm} onFieldsChange={onFilterChange}>
                    <ProductsFilters>
                        <Button icon={<PlusOutlined />} type="primary" onClick={() => { setDrawerOpen(true); }}>Add Product</Button>
                    </ProductsFilters>
                </Form>
                <Table
                    columns={[...columns, {
                        title: 'Actions',
                        key: 'actions',
                        render: (_text: string, record: Product) => (
                            <Space>
                                <Button type="link" onClick={() => { setCurrentEditingProduct(record); setDrawerOpen(true); }}>Edit</Button>
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
                <Drawer
                    styles={{ body: { backgroundColor: colorBgLayout } }}
                    title={"Add product"}
                    placement="right"
                    width={720}
                    destroyOnHidden={true}
                    open={drawerOpen}
                    onClose={() => {
                        setDrawerOpen(false);
                        form.resetFields();
                        setCurrentEditingProduct(null);
                    }}
                    extra={
                        <Space>
                            <Button onClick={() => {
                                setDrawerOpen(false);
                                form.resetFields();
                            }}>
                                Cancel
                            </Button>
                            <Button onClick={() => { }} type="primary">
                                Submit
                            </Button>
                        </Space>
                    }
                >
                    <Form layout="vertical" form={form}>
                        <ProductForm isEditMode={!!currentEditingProduct} />
                    </Form>
                </Drawer>
            </Space>
        </>
    )
}

export default Products;