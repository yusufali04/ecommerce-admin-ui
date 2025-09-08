import { Breadcrumb, Space } from 'antd';
import { RightOutlined } from "@ant-design/icons";
import { Link } from 'react-router-dom'

const SingleOrder = () => {
    return (
        <Space direction="vertical" style={{ width: '100%' }} size={"large"}>
            <Breadcrumb separator={<RightOutlined />} items={[
                { title: <Link to={"/"}>Dashboard</Link> },
                { title: <Link to={"/orders"}>Orders</Link> },
                { title: `Order #6516dfbsdgb651sdgb` }]} />
        </Space >
    )
}

export default SingleOrder