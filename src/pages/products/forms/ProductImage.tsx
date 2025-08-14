import { Form, message, Space, Typography, Upload, UploadProps } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useState } from "react";

const ProductImage = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const uploaderConfig: UploadProps = {
        name: 'image',
        multiple: false,
        showUploadList: false,
        beforeUpload: (file) => {
            const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
            if (!isJpgOrPng) {
                console.error('Only JPG/PNG images are allowed');
                messageApi.error('Only JPG/PNG images are allowed')
            }
            setImageUrl(URL.createObjectURL(file))
            return false;
        },

    }
    return (
        <Form.Item label="" name="image" rules={[
            { required: true, message: 'Image is required' },

        ]}>
            <Upload listType="picture-card" {...uploaderConfig}>
                {contextHolder}
                {
                    imageUrl ?
                        (<img src={imageUrl} alt="image" style={{ width: '100%' }} />)
                        :
                        (<Space direction="vertical">
                            <PlusOutlined />
                            <Typography.Text>Upload</Typography.Text>
                        </Space>)
                }
            </Upload>
        </Form.Item>
    )
}

export default ProductImage;