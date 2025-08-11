import { useQuery } from "@tanstack/react-query";
import { Card, Col, Input, Row, Form, Space, Select, Upload, Typography, Switch } from "antd";
import { getCategories, getTenants } from "../../../http/api";
import { Category, Tenant } from "../../../types";
import { PlusOutlined } from "@ant-design/icons";
import Pricing from "./Pricing";
import Attributes from "./Attributes";

const ProductForm = ({ isEditMode = false }: { isEditMode: boolean }) => {
    const selectedCategory = Form.useWatch("categoryId");
    const { data: categories, isLoading: isLoadingCategories, error: categoriesError } = useQuery({
        queryKey: ["categories"],
        queryFn: () => getCategories(),
    })
    const { data: restaurants, isLoading: isLoadingRestaurants, error: restaurantsError } = useQuery({
        queryKey: ["restaurants"],
        queryFn: () => getTenants("perPage=100&currentPage=1"),
    })
    return <Row>
        <Col span={24}>
            <Space direction="vertical" size={"large"}>
                <Card title="Product Info">
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="Product Name" name="name" rules={[
                                { required: true, message: 'Product name is required' },
                            ]}>
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Category" name="categoryId" rules={[
                                { required: true, message: 'Category is required' },
                            ]}>
                                <Select placeholder="Select a category" showSearch optionFilterProp="children">
                                    {
                                        isLoadingCategories ? <Select.Option value="">Loading...</Select.Option> :
                                            categoriesError ? <Select.Option value="">Error loading categories</Select.Option> :
                                                categories?.data.map((category: Category) => (
                                                    <Select.Option key={category._id} value={JSON.stringify(category)}>{category.name}</Select.Option>
                                                ))
                                    }
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item label="Description" name="description" rules={[
                                { required: true, message: 'Description is required' },
                            ]}>
                                <Input.TextArea rows={1} maxLength={100} style={{ resize: "none" }} />
                            </Form.Item>
                        </Col>
                    </Row>
                </Card>

                <Card title="Product Image">
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="" name="image" rules={[
                                { required: true, message: 'Image is required' },
                            ]}>
                                <Upload listType="picture-card">
                                    <Space direction="vertical">
                                        <PlusOutlined />
                                        <Typography.Text>Upload</Typography.Text>
                                    </Space>
                                </Upload>
                            </Form.Item>
                        </Col>
                    </Row>
                </Card>
                <Card title="Tenant Info">
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="Restaurant" name="tenantId" rules={[
                                { required: true, message: 'Restaurant is required' },
                            ]}>
                                <Select placeholder="Select a restaurant" showSearch optionFilterProp="children">
                                    {
                                        isLoadingRestaurants ? <Select.Option value="">Loading...</Select.Option> :
                                            restaurantsError ? <Select.Option value="">Error loading restaurants</Select.Option> :
                                                restaurants?.data.data.map((tenant: Tenant) => (
                                                    <Select.Option key={tenant.id} value={tenant.id}>{tenant.name}</Select.Option>
                                                ))
                                    }
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                </Card>
                {
                    selectedCategory && (
                        <Pricing selectedCategory={selectedCategory} />
                    )
                }
                {
                    selectedCategory && (
                        <Attributes />
                    )
                }
                <Card title="Other Properties">
                    <Row gutter={16}>
                        <Col span={12}>
                            <Space>
                                <Form.Item name={"isPublished"} valuePropName="checked" noStyle>
                                    <Switch defaultChecked checkedChildren="Yes" unCheckedChildren="No" />
                                </Form.Item>
                                <Typography.Text>Publish</Typography.Text>
                            </Space>
                        </Col>
                    </Row>
                </Card>
            </Space>
        </Col>
    </Row>
}

export default ProductForm;
