import { useQuery } from "@tanstack/react-query";
import { Card, Col, Input, Row, Form, Space, Select } from "antd";
import { getTenants } from "../../../http/api";
import { Tenant } from "../../../types";

const UserForm = () => {
    const { data: tenantsData, isLoading, error } = useQuery({
        queryKey: ['tenants'],
        queryFn: async () => {
            return getTenants().then((res) => res.data)
        }
    }) 
    return <Row>
        <Col span={24}>
            <Space direction="vertical" size={"large"}>
                <Card title="Basic Info">
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="First Name" name="firstName">
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Last Name" name="lastName">
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Email" name="email">
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Last Name" name="lastName">
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                </Card>
                <Card title="Security Info">
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="Password" name="password">
                                <Input.Password />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Confirm Password" name="confirmPassword">
                                <Input.Password />
                            </Form.Item>
                        </Col>
                    </Row>
                </Card>
                <Card title="Role">
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="Role" name="role">
                                <Select placeholder="Select a role">
                                    <Select.Option value="admin">Admin</Select.Option>
                                    <Select.Option value="customer">Customer</Select.Option>
                                    <Select.Option value="manager">Manager</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Restaurant" name="tenantId">
                                <Select placeholder="Select a restaurant" showSearch optionFilterProp="children">
                                    {
                                        isLoading ? <Select.Option value="">Loading...</Select.Option> :
                                        error ? <Select.Option value="">Error loading restaurants</Select.Option> :
                                        tenantsData?.map((tenant: Tenant) => (
                                            <Select.Option key={tenant.id} value={tenant.id}>{tenant.name}</Select.Option>
                                        ))
                                    }
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                </Card>
            </Space>
        </Col>
    </Row>
}

export default UserForm;
