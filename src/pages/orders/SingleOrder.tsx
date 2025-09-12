import { Avatar, Breadcrumb, Card, Col, Flex, List, Row, Space, Tag, Typography } from 'antd';
import { RightOutlined } from "@ant-design/icons";
import { Link, useParams } from 'react-router-dom'
import { colorMapping } from '../../constants';
import { capitalizeFirstLetter } from '../../utils';
import { useQuery } from '@tanstack/react-query';
import { getSingleOrder } from '../../http/api';
import { Order } from '../../types';

const SingleOrder = () => {
    const { orderId } = useParams();
    const { data: order, isLoading } = useQuery<Order>({
        queryKey: ["order", orderId],
        queryFn: async () => {
            const queryString = new URLSearchParams({ fields: 'cart,address,paymentMode,tenantId,total,comment,orderStatus,paymentStatus,createdAt' }).toString();
            return getSingleOrder(orderId as string, queryString).then((res) => res.data)
        }
    })
    if (!order) {
        return <div>Loading...</div>
    }
    return (
        <Space direction="vertical" style={{ width: '100%' }} size={"large"}>
            <Breadcrumb separator={<RightOutlined />} items={[
                { title: <Link to={"/"}>Dashboard</Link> },
                { title: <Link to={"/orders"}>Orders</Link> },
                { title: `Order #${orderId}` }]} />
            <Row gutter={24}>
                <Col span={14}>
                    <Card title="Order details" extra={
                        <Tag color={colorMapping[order?.orderStatus ?? "preparing"]}>{capitalizeFirstLetter(order?.orderStatus || "received")}</Tag>
                    }>
                        {
                            isLoading
                                ?
                                <div>Loading cart items...</div>
                                :
                                (
                                    <List
                                        itemLayout="horizontal"
                                        dataSource={order?.cart}
                                        renderItem={(item) => (
                                            <List.Item key={item.name}>
                                                <List.Item.Meta
                                                    avatar={<Avatar src={item.image} />}
                                                    title={item.name}
                                                    description={item.chosenConfiguration.selectedToppings.map((topping) => topping.name).join(", ")}
                                                />
                                                <Space size={'large'}>
                                                    <Typography.Text>{Object.values(item.chosenConfiguration.priceConfiguration).join(", ")}</Typography.Text>
                                                    <Typography.Text>{item.qty} Piece{item.qty > 1 ? "s" : ''}</Typography.Text>
                                                </Space>

                                            </List.Item>
                                        )}
                                    />
                                )
                        }
                    </Card>
                </Col>
                <Col span={10}>
                    <Card title="Customer details">
                        <Space direction="vertical">
                            <Flex style={{ flexDirection: "column" }}>
                                <Typography.Text type='secondary'>Name</Typography.Text>
                                <Typography.Text>{order.customerId.firstName + " " + order.customerId.lastName}</Typography.Text>
                            </Flex>
                            <Flex style={{ flexDirection: "column" }}>
                                <Typography.Text type='secondary'>Address</Typography.Text>
                                <Typography.Text>{order.address}</Typography.Text>
                            </Flex>
                            <Flex style={{ flexDirection: "column" }}>
                                <Typography.Text type='secondary'>Payment Method</Typography.Text>
                                <Typography.Text>{capitalizeFirstLetter(order.paymentMode as string)}</Typography.Text>
                            </Flex>
                            <Flex style={{ flexDirection: "column" }}>
                                <Typography.Text type='secondary'>Payment Status</Typography.Text>
                                <Typography.Text>{capitalizeFirstLetter(order.paymentStatus as string)}</Typography.Text>
                            </Flex>
                            <Flex style={{ flexDirection: "column" }}>
                                <Typography.Text type='secondary'>Order Amount</Typography.Text>
                                <Typography.Text>₹{order.total}</Typography.Text>
                            </Flex>
                            <Flex style={{ flexDirection: "column" }}>
                                <Typography.Text type='secondary'>Ordered At</Typography.Text>
                                <Typography.Text>{new Date(order.createdAt).toLocaleString("en-IN", {
                                    weekday: 'long',
                                    year: "numeric",
                                    month: "2-digit",
                                    day: "2-digit",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    second: "2-digit",
                                    hour12: true,
                                })}</Typography.Text>
                            </Flex>
                            {
                                order.comment && (
                                    <Flex style={{ flexDirection: "column" }}>
                                        <Typography.Text type='secondary'>Note from customer</Typography.Text>
                                        <Typography.Text>{order.comment}</Typography.Text>
                                    </Flex>
                                )
                            }
                        </Space>
                    </Card>
                </Col>
            </Row>
        </Space >
    )
}

export default SingleOrder