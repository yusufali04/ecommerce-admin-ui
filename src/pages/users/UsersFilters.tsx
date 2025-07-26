import { Button, Card, Col, Input, Row, Select } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const UsersFilters = () => {
    return (
        <Card>
            <Row>
                <Col span={16}>
                    <Row gutter={20}>
                        <Col span={8}>
                            <Input.Search placeholder="Search users..." style={{ width: "100%" }} />
                        </Col>
                        <Col span={8}>
                            <Select placeholder="Role" style={{ width: "100%" }} allowClear={true}>
                                <Select.Option value="admin">Admin</Select.Option>
                                <Select.Option value="manager">Manager</Select.Option>
                                <Select.Option value="customer">Customer</Select.Option>
                            </Select>
                        </Col>
                        <Col span={8}>
                            <Select placeholder="Status" style={{ width: "100%" }} allowClear={true}>
                                <Select.Option value="banned">Banned</Select.Option>
                                <Select.Option value="active">Active</Select.Option>
                            </Select>
                        </Col>
                    </Row>
                </Col>
                <Col span={8} style={{display: "flex", justifyContent: "flex-end"}}>
                    <Button icon={<PlusOutlined />} type="primary">Add User</Button>
                </Col>
            </Row>
        </Card>
    )
}

export default UsersFilters;