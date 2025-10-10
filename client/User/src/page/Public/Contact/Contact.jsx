import { useState } from "react";
import { Button, Card, Col, Form, Input, Row } from "antd";
import { PhoneOutlined, MailOutlined } from '@ant-design/icons';
import toast from "react-hot-toast";
import { useTranslation } from 'react-i18next';

export default function Contact() {
  const [form] = Form.useForm();
  const [result, setResult] = useState(false);
  const { t } = useTranslation();

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
      toast.success(t("contact.successfully_send_mail"))
      form.resetFields(); 
      setResult(false);
    } else {
      toast.error(t("contact.this_did_not_work"))
      setResult(false);
    }
  };

  return (
    <Row style={{ marginTop: "120px", marginBottom: "120px" }}>
      <Col span={2}></Col>

      <Col xs={24} md={7}>
        <Card variant="borderless" style={{ overflow: "hidden", marginRight: "15px" }}>
          <div>
            <h2>{<PhoneOutlined style={{ color: "#db4444", paddingRight: "12px" }} />}{t("contact.call_to_us")}</h2>
            <p>{t("contact.available_24_7")}</p>
            <p>{t("contact.phone")} 01145694211</p>
          </div>

          <hr style={{ width: "80%", margin: "0px", marginTop: "20px", marginBottom: "20px" }} />

          <div>
            <h2> {<MailOutlined style={{ color: "#db4444", paddingRight: "12px" }} />}{t("contact.write_to_us")}</h2>
            <p>{t("contact.fill_form_24_hours")}</p>
            <p>{t("contact.emails")} mohamedsayed20500@gmail.com</p>
          </div>
        </Card>
      </Col>

      <Col xs={24} md={13}>
        <Card variant="borderless">
          <Form form={form} onFinish={onSubmit}>
            <Row gutter={[20, 20]}>
              <Col span={8}>
                <Form.Item name="name" rules={[{ required: true, message: t("contact.please_enter_name") }]}>
                  <Input placeholder={t("contact.your_name")} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="email" rules={[{ required: true, type: "email", message: t("contact.please_enter_valid_email") }]}>
                  <Input type="email" placeholder={t("contact.your_mail")} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="phone" rules={[{ required: true, message: t("contact.please_enter_phone_number") }]}>
                  <Input type="tel" placeholder={t("contact.your_phone")} />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item name="message" rules={[{ required: true, message: t("contact.please_enter_message") }]}>
                  <Input.TextArea showCount maxLength={100} placeholder={t("contact.your_message")} style={{ height: 120, resize: 'none' }} />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item>
                  <Button disabled={result} type="primary" htmlType="submit" style={{ padding: "15px" }}>{t("contact.send_message")}</Button>
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
