import { Card, Col, Input, Row, Select } from "antd";

type UsersFiltersProps = {
    onFilterChange: (filterName: string, filterValue: string) => void;
    children?: React.ReactNode;
}

const UsersFilters = ({ onFilterChange, children }: UsersFiltersProps) => {
    return (
        <Card>
            <Row>
                <Col span={16}>
                    <Row gutter={20}>
                        <Col span={8}>
                            <Input.Search allowClear={true} placeholder="Search restaurants..." style={{ width: "100%" }} onChange={(e) => onFilterChange("searchFilter", e.target.value)} />
                        </Col>
                        <Col span={8}>
                            <Select placeholder="Status" style={{ width: "100%" }} allowClear={true} onChange={(value) => onFilterChange("statusFilter", value)}>
                                <Select.Option value="banned">Banned</Select.Option>
                                <Select.Option value="active">Active</Select.Option>
                            </Select>
                        </Col>
                    </Row>
                </Col>
                <Col span={8} style={{display: "flex", justifyContent: "flex-end"}}>
                    { children }
                </Col>
            </Row>
        </Card>
    )
}

export default UsersFilters;