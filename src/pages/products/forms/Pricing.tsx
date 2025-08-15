import { Card, Col, Form, InputNumber, Row, Space, Typography } from "antd";
import { Category, CategoryPriceConfiguration } from "../../../types";
import { useQuery } from "@tanstack/react-query";
import { getCategory } from "../../../http/api";

type PricingProps = {
    selectedCategory: string
}


const Pricing = ({ selectedCategory }: PricingProps) => {
    const { data: fetchedCategory } = useQuery<Category>({
        queryKey: ['category', selectedCategory],
        queryFn: () => {
            return getCategory(selectedCategory).then(res => res.data)
        },
        staleTime: 1000 * 60 * 5 // 5 Minutes
    })
    if (!fetchedCategory) {
        return null;
    }
    return (
        <Card title={<Typography.Text>Product Price</Typography.Text>}>
            {
                Object.entries(fetchedCategory.priceConfiguration).map(([configurationKey, configurationValue]) => {
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