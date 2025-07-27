import { Card, Col, Input, Row, Form } from "antd";

const UserForm = () => {
    return <Row>
        <Col span={24}>
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
                </Row>
            </Card>
        </Col>
    </Row>
}

export default UserForm;
