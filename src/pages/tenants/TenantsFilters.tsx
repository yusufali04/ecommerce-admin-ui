import { Card, Col, Input, Row } from "antd";

type UsersFiltersProps = {
    onFilterChange: (filterName: string, filterValue: string) => void;
    children?: React.ReactNode;
}

const UsersFilters = ({ onFilterChange, children }: UsersFiltersProps) => {
    return (
        <Card>
            <Row>
                <Col span={16}>
                    <Col>
                        <Input.Search allowClear={true} placeholder="Search restaurants..." style={{ width: "50%" }} onChange={(e) => onFilterChange("searchFilter", e.target.value)} />
                    </Col>
                </Col>
                <Col span={8} style={{display: "flex", justifyContent: "flex-end"}}>
                    { children }
                </Col>
            </Row>
        </Card>
    )
}

export default UsersFilters;