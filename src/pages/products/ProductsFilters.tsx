import { useQuery } from "@tanstack/react-query";
import { Card, Col, Form, Input, Row, Select, Space, Switch, Typography } from "antd";
import { getCategories, getTenants } from "../../http/api";
import { Category, Tenant } from "../../types";

type ProductsFiltersProps = {
    children?: React.ReactNode;
}

const ProductsFilters = ({ children }: ProductsFiltersProps) => {

    const { data: restaurants } = useQuery({
        queryKey: ["restaurants"],
        queryFn: () => getTenants("perPage=100&currentPage=1"),
    })
    const { data: categories } = useQuery({
        queryKey: ["categories"],
        queryFn: () => getCategories(),
    })

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
                                    {
                                        categories?.data.map((category: Category) => {
                                            return <Select.Option key={category._id} value={category._id}>{category.name}</Select.Option>
                                        })
                                    }
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item name={"restaurant"}>
                                <Select placeholder="Restaurants" style={{ width: "100%" }} allowClear={true}>
                                    {
                                        restaurants?.data.data.map((restaurant: Tenant) => {
                                            return <Select.Option key={restaurant.id} value={restaurant.id}>{restaurant.name}</Select.Option>
                                        })
                                    }
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