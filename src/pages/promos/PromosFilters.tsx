import { Card, Col, Input, Row, Select } from "antd";
import { Form } from "antd";
import { useAuthStore } from "../../store";
import { useQuery } from "@tanstack/react-query";
import { getTenants } from "../../http/api";
import { Tenant } from "../../types";

type PromosFiltersProps = {
    children?: React.ReactNode;
}

const PromosFilters = ({ children }: PromosFiltersProps) => {
    const { user } = useAuthStore();
    const { data: restaurants } = useQuery({
        queryKey: ["restaurants"],
        queryFn: () => getTenants("perPage=100&currentPage=1"),
    })
    return (
        <Card>
            <Row>
                <Col span={16}>
                    <Row gutter={20}>
                        <Col span={12}>
                            <Form.Item name="q">
                                <Input.Search allowClear={true} placeholder="Search promos..." style={{}} />
                            </Form.Item>
                        </Col>
                        {
                            user!.role === 'admin' && (
                                <Col span={12}>
                                    <Form.Item name="tenantId">
                                        <Select placeholder="Restaurants" style={{ width: "100%" }}>
                                            {
                                                restaurants?.data.data.map((restaurant: Tenant) => {
                                                    return <Select.Option key={restaurant.id} value={restaurant.id}>{restaurant.name}</Select.Option>
                                                })
                                            }
                                        </Select>
                                    </Form.Item>
                                </Col>
                            )
                        }
                    </Row>
                </Col>
                <Col span={8} style={{ display: "flex", justifyContent: "flex-end" }}>
                    {children}
                </Col>
            </Row>
        </Card>
    )
}

export default PromosFilters;