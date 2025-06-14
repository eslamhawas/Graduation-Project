import { Col, Row } from 'antd';
import style from './style.module.css';
import imgLogo from "../../../Image/Screenshot_2024-11-16_180021-removebg-preview 2.webp"
import { FacebookOutlined, LinkedinOutlined, TwitterOutlined, InstagramOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const { footer, footerIcon } = style

export default function Footer() {

  const { t } = useTranslation()

  // Social media links (you can customize these URLs)
  const socialLinks = {
    facebook: "#",
    linkedin: "#",
    twitter: "#",
    instagram: "#"
  }

  const handleSocialClick = (platform) => {
    // Add analytics or tracking here if needed
    console.log(`Clicked ${platform} icon`);
  }

  return (
    <footer className={footer} role="contentinfo" aria-label="Site footer">
      <Row justify="space-between" align="middle" gutter={[16, 16]}>
        <Col xs={24} sm={20} xl={22}>
          <img
            loading="eager"
            src={imgLogo}
            alt="Company Logo"
            style={{ width: "auto", height: "auto" }}
          />
        </Col>
        <Col className={footerIcon} xs={24} sm={4} xl={2}>
          <Row justify="center" align="middle" gutter={[8, 8]}>
            <Col>
              <a
                href={socialLinks.facebook}
                aria-label="Visit our Facebook page"
                onClick={() => handleSocialClick('facebook')}
                tabIndex={0}
              >
                <FacebookOutlined />
              </a>
            </Col>
            <Col>
              <a
                href={socialLinks.linkedin}
                aria-label="Visit our LinkedIn page"
                onClick={() => handleSocialClick('linkedin')}
                tabIndex={0}
              >
                <LinkedinOutlined />
              </a>
            </Col>
            <Col>
              <a
                href={socialLinks.twitter}
                aria-label="Visit our Twitter page"
                onClick={() => handleSocialClick('twitter')}
                tabIndex={0}
              >
                <TwitterOutlined />
              </a>
            </Col>
            <Col>
              <a
                href={socialLinks.instagram}
                aria-label="Visit our Instagram page"
                onClick={() => handleSocialClick('instagram')}
                tabIndex={0}
              >
                <InstagramOutlined />
              </a>
            </Col>
          </Row>
        </Col>
      </Row>
      <hr role="separator" aria-hidden="true" />
      <p>{t("BioFooter")}</p>
    </footer>
  )
}
