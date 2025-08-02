import { Card, Col, Input, Row, Form, Space } from "antd";

const TenantForm = () => {
    return <Row>
        <Col span={24}>
            <Space direction="vertical" size={"large"}>
                <Card title="Restaurant Info">
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="Name" name="name" rules={[
                                { required: true, message: 'Name is required' },
                                ]}>
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Address" name="address" rules={[
                                { required: true, message: 'Address is required' },
                            ]}>
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                </Card>
            </Space>
        </Col>
    </Row>
}

export default TenantForm;
