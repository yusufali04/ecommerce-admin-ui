import { Card, Col, Form, Input, Row, Select } from "antd";

type UsersFiltersProps = {
    children?: React.ReactNode;
}

const UsersFilters = ({ children }: UsersFiltersProps) => {
    return (
        <Card>
            <Row>
                <Col span={16}>
                    <Row gutter={20}>
                        <Col span={8}>
                        <Form.Item name="q">
                            <Input.Search allowClear={true} placeholder="Search users..." style={{ width: "100%" }} />
                        </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item name={"role"}>
                                <Select placeholder="Role" style={{ width: "100%" }} allowClear={true}>
                                <Select.Option value="admin">Admin</Select.Option>
                                <Select.Option value="manager">Manager</Select.Option>
                                <Select.Option value="customer">Customer</Select.Option>
                            </Select>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item>
                                <Select placeholder="Status" style={{ width: "100%" }} allowClear={true}>
                                    <Select.Option value="banned">Banned</Select.Option>
                                    <Select.Option value="active">Active</Select.Option>
                                </Select>
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

export default UsersFilters;