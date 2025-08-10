import { Breadcrumb, Button, Flex, Form, Space } from "antd";
import { RightOutlined, PlusOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import ProductsFilters from "./ProductsFilters";

const Products = () => {
    const [ filterForm ] = Form.useForm();
    return (
        <>
            <Space direction="vertical" style={{ width: '100%' }} size={"large"}>
                <Flex justify={"space-between"} align={"center"}>
                    <Breadcrumb separator={<RightOutlined />} items={[{ title: <Link to={"/"}>Dashboard</Link> }, { title: "Products"}]} />
                </Flex>
                <Form form={filterForm} onFieldsChange={() => {}}>
                    <ProductsFilters>
                        <Button icon={<PlusOutlined />} type="primary" onClick={() => {}}>Add Product</Button>
                    </ProductsFilters>
                </Form>
            </Space>
        </>
    )
}

export default Products;