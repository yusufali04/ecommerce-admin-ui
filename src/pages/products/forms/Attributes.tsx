import { Card, Col, Form, Radio, Row, Switch, Typography } from "antd";
import { Category } from "../../../types";


type PricingProps = {
    selectedCategory: string
}

const Attributes = ({ selectedCategory }: PricingProps) => {
    const category: Category = selectedCategory ? JSON.parse(selectedCategory) : null;
    if (!category) {
        return null;
    }
    return (
        <Card title={<Typography.Text>Attributes</Typography.Text>}>
            {
                category.attributes.map((attribute) => {
                    return (
                        <div key={attribute.name}>
                            {
                                attribute.widgetType === 'radio' ? (
                                    <Form.Item
                                        label={attribute.name}
                                        name={['attributes', attribute.name]}
                                        initialValue={attribute.defaultValue}
                                        rules={[
                                            {
                                                required: true,
                                                message: `${attribute.name} is required`
                                            }
                                        ]}>
                                        <Radio.Group>
                                            {
                                                attribute.availableOptions.map((option) => {
                                                    return (
                                                        <Radio.Button key={option} value={option}>{option}</Radio.Button>
                                                    )
                                                })
                                            }
                                        </Radio.Group>
                                    </Form.Item>
                                ) : attribute.widgetType === 'switch' ? (
                                    <Row>
                                        <Col>
                                            <Form.Item label={attribute.name} name={["attributes", attribute.name]} valuePropName="checked" initialValue={attribute.defaultValue}>
                                                <Switch checkedChildren="Yes" unCheckedChildren="No" />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                ) : null
                            }
                        </div>
                    )
                })
            }
        </Card>
    )
}

export default Attributes;