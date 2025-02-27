import { useState } from "react";
import { Button, Card, Col, Form, Input, Row } from "antd";
import { PhoneOutlined, MailOutlined } from '@ant-design/icons';
import toast from "react-hot-toast";

export default function Contact() {
  const [form] = Form.useForm();
  const [result, setResult] = useState(false);

  const onSubmit = async (values) => {
    setResult(true);
    const formData = new FormData();

    for (let key in values) {
      formData.append(key, values[key]);
    }
    
    formData.append("access_key", "84be3961-95a8-432f-a781-9eaad46bfc24");

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData
    });

    const data = await response.json();

    if (data.success) {
      toast.success('Successfully Send Mail!')
      form.resetFields(); 
      setResult(false);
    } else {
      toast.error("This didn't work.")
      setResult(false);
    }
  };

  return (
    <Row style={{ marginTop: "120px", marginBottom: "120px" }}>
      <Col span={2}></Col>

      <Col xs={24} md={7}>
        <Card variant="borderless" style={{ overflow: "hidden", marginRight: "15px" }}>
          <div>
            <h2>{<PhoneOutlined style={{ color: "#db4444", paddingRight: "12px" }} />}Call To Us</h2>
            <p>We are available 24/7, 7 days a week.</p>
            <p>Phone: 01145694211</p>
          </div>

          <hr style={{ width: "80%", margin: "0px", marginTop: "20px", marginBottom: "20px" }} />

          <div>
            <h2> {<MailOutlined style={{ color: "#db4444", paddingRight: "12px" }} />}Write To Us</h2>
            <p>Fill out our form and we will contact you within 24 hours.</p>
            <p>Emails: mohamedsayed20500@gmail.com</p>
          </div>
        </Card>
      </Col>

      <Col xs={24} md={13}>
        <Card variant="borderless">
          <Form form={form} onFinish={onSubmit}>
            <Row gutter={[20, 20]}>
              <Col span={8}>
                <Form.Item name="name" rules={[{ required: true, message: "Please enter your name" }]}>
                  <Input placeholder="Your Name" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="email" rules={[{ required: true, type: "email", message: "Please enter a valid email" }]}>
                  <Input type="email" placeholder="Your Mail" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="phone" rules={[{ required: true, message: "Please enter your phone number" }]}>
                  <Input type="tel" placeholder="Your Phone" />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item name="message" rules={[{ required: true, message: "Please enter your message" }]}>
                  <Input.TextArea showCount maxLength={100} placeholder="Your Message" style={{ height: 120, resize: 'none' }} />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item>
                  <Button disabled={result} type="primary" htmlType="submit" style={{ padding: "15px" }}>Send Message</Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
      </Col>

      <Col span={2}></Col>
    </Row>
  );
}
