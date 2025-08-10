import { Card, Col, Form, Input, Radio, Row, Select, Space, Switch, Typography } from "antd";

type ProductsFiltersProps = {
    children?: React.ReactNode;
}

const ProductsFilters = ({ children }: ProductsFiltersProps) => {
    return (
        <Card>
            <Row>
                <Col span={16}>
                    <Row gutter={20}>
                        <Col span={6}>
                            <Form.Item name="q">
                                <Input.Search allowClear={true} placeholder="Search products..." style={{ width: "100%" }} />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item name={"category"}>
                                <Select placeholder="Category" style={{ width: "100%" }} allowClear={true}>
                                    <Select.Option value="pizza">Pizza</Select.Option>
                                    <Select.Option value="beverages">Beverages</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item name={"tenant"}>
                                <Select placeholder="Tenant" style={{ width: "100%" }} allowClear={true}>
                                    <Select.Option value="banned">Tenant1</Select.Option>
                                    <Select.Option value="active">Tenant2</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item>
                                <Space>
                                    <Switch defaultChecked onChange={() => {}} />
                                    <Typography.Text>Show only published</Typography.Text>
                                </Space>
                            </Form.Item>
                        </Col>
                    </Row>
                </Col>
                <Col span={8} style={{display: "flex", justifyContent: "flex-end"}}>
                    { children }
                </Col>
            </Row>
        </Card>
    )
}

export default ProductsFilters;