import { Card, Col, Form, InputNumber, Row, Space, Typography } from "antd";
import { CategoryPriceConfiguration } from "../../../types";

type PricingProps = {
    selectedCategory: string
}


const Pricing = ({ selectedCategory }: PricingProps) => {
    const category = selectedCategory ? JSON.parse(selectedCategory) : null
    if (!category) {
        return null;
    }
    return (
        <Card title={<Typography.Text>Product Price</Typography.Text>}>
            {
                Object.entries(category?.priceConfiguration).map(([configurationKey, configurationValue]) => {
                    return <div key={configurationKey}>
                        <Space direction="vertical" style={{ width: "100%" }}>
                            <Typography.Text>{`${configurationKey} (${(configurationValue as CategoryPriceConfiguration).priceType})`}</Typography.Text>
                            <Row gutter={20}>
                                {
                                    (configurationValue as CategoryPriceConfiguration).availableOptions.map((option: string) => {
                                        return (
                                            <Col span={8} key={option}>
                                                <Form.Item label={option} name={[
                                                    'priceConfiguration',
                                                    JSON.stringify({
                                                        configurationKey: configurationKey,
                                                        priceType: (configurationValue as CategoryPriceConfiguration).priceType
                                                    }),
                                                    option
                                                ]}>
                                                    <InputNumber addonAfter="₹" />
                                                </Form.Item>
                                            </Col>
                                        )
                                    })
                                }
                            </Row>
                        </Space>
                    </div>
                })
            }
        </Card>
    )
}

export default Pricing;