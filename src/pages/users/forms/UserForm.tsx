import { useQuery } from "@tanstack/react-query";
import { Card, Col, Input, Row, Form, Space, Select } from "antd";
import { getTenants } from "../../../http/api";
import { Tenant } from "../../../types";

const UserForm = ({ isEditMode = false }: { isEditMode: boolean }) => {
    const selectedRole = Form.useWatch("role");
    const { data: tenantsData, isLoading, error } = useQuery({
        queryKey: ['tenants'],
        queryFn: async () => {
            return getTenants("").then((res) => res.data)
        }
    }) 
    return <Row>
        <Col span={24}>
            <Space direction="vertical" size={"large"}>
                <Card title="Basic Info">
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="First Name" name="firstName" rules={[
                                { required: true, message: 'First name is required' },
                                ]}>
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Last Name" name="lastName" rules={[
                                { required: true, message: 'Last name is required' },
                            ]}>
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Email" name="email" rules={[
                                { required: true, message: 'Email is required' },
                                { type: 'email', message: 'Please enter a valid email' },
                            ]}>
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                </Card>
                {
                    !isEditMode && (
                        <Card title="Security Info">
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item label="Password" name="password" rules={[
                                        { required: true, message: 'Password is required' },
                                    ]}>
                                        <Input.Password />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Card>
                    )
                }
                
                <Card title="Role">
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="Role" name="role" rules={[
                                { required: true, message: 'Role is required' },
                            ]}>
                                <Select placeholder="Select a role" id="selectedBoxInUserForm" allowClear>
                                    <Select.Option value="admin">Admin</Select.Option>
                                    <Select.Option value="manager">Manager</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        {
                            selectedRole === 'manager' && (
                                <Col span={12}>
                                    <Form.Item label="Restaurant" name="tenantId" rules={[
                                        { required: true, message: 'Restaurant is required' },
                                    ]}>
                                        <Select placeholder="Select a restaurant" showSearch optionFilterProp="children">
                                            {
                                                isLoading ? <Select.Option value="">Loading...</Select.Option> :
                                                error ? <Select.Option value="">Error loading restaurants</Select.Option> :
                                                tenantsData?.data.map((tenant: Tenant) => (
                                                    <Select.Option key={tenant.id} value={tenant.id}>{tenant.name}</Select.Option>
                                                ))
                                            }
                                        </Select>
                                    </Form.Item>
                                </Col>
                            )
                        }
                        
                    </Row>
                </Card>
            </Space>
        </Col>
    </Row>
}

export default UserForm;
