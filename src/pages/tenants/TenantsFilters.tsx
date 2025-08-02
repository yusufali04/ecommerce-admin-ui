import { Card, Col, Input, Row } from "antd";
import { Form } from "antd";

type TenantsFiltersProps = {
    children?: React.ReactNode;
}

const TenantsFilters = ({ children }: TenantsFiltersProps) => {
    return (
        <Card>
            <Row>
                <Col span={16}>
                    <Col>
                    <Form.Item name="q">
                        <Input.Search allowClear={true} placeholder="Search restaurants..." style={{ width: "50%" }} />
                    </Form.Item>
                    </Col>
                </Col>
                <Col span={8} style={{display: "flex", justifyContent: "flex-end"}}>
                    { children }
                </Col>
            </Row>
        </Card>
    )
}

export default TenantsFilters;