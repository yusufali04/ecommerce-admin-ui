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
                            <Input.Search allowClear={true} placeholder="Search users..." style={{ width: "100%" }} onChange={(e) => onFilterChange("searchFilter", e.target.value)} />
                        </Col>
                        <Col span={8}>
                            <Select placeholder="Role" style={{ width: "100%" }} allowClear={true} onChange={(value) => onFilterChange("roleFilter", value)}>
                                <Select.Option value="admin">Admin</Select.Option>
                                <Select.Option value="manager">Manager</Select.Option>
                                <Select.Option value="customer">Customer</Select.Option>
                            </Select>
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