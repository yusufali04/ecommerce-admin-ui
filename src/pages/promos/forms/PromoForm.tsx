import { Card, Col, Input, Row, Form, Space } from "antd";

const PromoForm = () => {
    return <Row>
        <Col span={24}>
            <Space direction="vertical" size={"large"}>
                <Card title="Promo Info">
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="Title" name="title" rules={[
                                { required: true, message: 'Title is required' },
                            ]}>
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Code" name="code" rules={[
                                { required: true, message: 'Code is required' },
                            ]}>
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Validity" name="validUpto" rules={[
                                { required: true, message: 'Validity is required' },
                            ]}>
                                <Input type="datetime-local" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Discount(%)" name="discount" rules={[
                                { required: true, message: 'Code is required' },
                            ]}>
                                <Input type="number" />
                            </Form.Item>
                        </Col>
                    </Row>
                </Card>
            </Space>
        </Col>
    </Row>
}

export default PromoForm;
