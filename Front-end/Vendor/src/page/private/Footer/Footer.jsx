import { Col, Row } from 'antd';
import style from './style.module.css';
import imgLogo from "../../../Image/Screenshot_2024-11-16_180021-removebg-preview 2.webp"
import { FacebookOutlined, LinkedinOutlined, TwitterOutlined, InstagramOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const { footer, footerIcon } = style

export default function Footer() {

  const { t } = useTranslation()

  return (<>
    <footer className={footer}>
      <Row justify="space-between" gutter={[16, 16]}>
        <Col xs={24} sm={20} xl={22}>
          <img
            loading="eager"
            src={imgLogo}
            alt="Logo"
            style={{ width: "auto", height: "auto" }}
          />
        </Col>
        <Col className={footerIcon} xs={24} sm={4} xl={2} >
          <Row justify="center" gutter={[8, 8]}>
            <Col><FacebookOutlined /></Col>
            <Col><LinkedinOutlined /></Col>
            <Col><TwitterOutlined /></Col>
            <Col><InstagramOutlined /></Col>
          </Row>
        </Col>
      </Row>
      <hr />
      <p>{t("BioFooter")}</p>
    </footer>
  </>
  )
}
