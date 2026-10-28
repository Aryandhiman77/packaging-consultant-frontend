import { useEffect, useState } from 'react'
import { FaFacebookF, FaLinkedinIn, FaXTwitter, FaYoutube } from 'react-icons/fa6'
import { useApi } from '../context/ApiContext'
import { artTemplatesPath } from '../data/packagingServices'
import { defaultSocialLinks, externalLinkProps, resolveSocialLinks } from '../data/socialLinks'

const primaryLinks = [
  ['Home', '/#home'],
  ['Packaging Services', '/packaging-services/packaging-development'],
  ['Industries', '/industries/food-beverage'],
  ['Projects', '/projects/packaging-starts-here'],
  ['About Us', '/about-us'],
  ['Packaging Times', '#packaging-times'],
  ['Project Review', '/project-review/starting-point'],
]

const secondaryLinks = [
  ['Contact Us', '#contact'],
  ['Bag and Pouch Die Lines / Template Visuals', artTemplatesPath],
  ['Blog', '#blog'],
]

function LinkList({ links }) {
  return (
    <ul className="list-disc marker:text-black">
      {links.map(([label, href]) => (
        <li key={label}>
          <a
            href={href}
            target={href.toLowerCase().endsWith('.pdf') ? '_blank' : undefined}
            rel={href.toLowerCase().endsWith('.pdf') ? 'noreferrer' : undefined}
          >
            {label}
          </a>
        </li>
      ))}
    </ul>
  )
}

function SocialLinks({ links }) {
  return (
    <div className="footer__socials" aria-label="Social media links">
      <a className="social-button social-button--x" href={links.x} {...externalLinkProps(links.x)} aria-label="X"><FaXTwitter aria-hidden="true" /></a>
      <a className="social-button social-button--facebook" href={links.facebook} {...externalLinkProps(links.facebook)} aria-label="Facebook"><FaFacebookF aria-hidden="true" /></a>
      <a className="social-button social-button--youtube" href={links.youtube} {...externalLinkProps(links.youtube)} aria-label="YouTube"><FaYoutube aria-hidden="true" /></a>
      <a className="social-button social-button--linkedin" href={links.linkedin} {...externalLinkProps(links.linkedin)} aria-label="LinkedIn"><FaLinkedinIn aria-hidden="true" /></a>
    </div>
  )
}

export default function Footer() {
  const { getPublicNavigation } = useApi()
  const [socialLinks, setSocialLinks] = useState(defaultSocialLinks)

  useEffect(() => {
    let active = true
    getPublicNavigation()
      .then((payload) => active && setSocialLinks(resolveSocialLinks(payload)))
      .catch(() => {})

    return () => { active = false }
  }, [getPublicNavigation])

  return (
    <footer className="footer mx-auto w-full max-w-[100vw]" id="contact">
      <div className="footer__content">
        <address className="footer__contact">
          <span>Mailing Address:</span>
          <strong>P.O. Box 732024<br />Ormond Beach, Florida&nbsp; 32173-2024</strong>
          <span>E-Mail:</span>
          <a href="mailto:info@packagingconsultantsusa.com">info@packagingconsultantsusa.com</a>
        </address>

        <div className="footer__navigation">
          <nav aria-label="Company links"><LinkList links={primaryLinks} /></nav>
          <div className="footer__navigation-secondary">
            <nav aria-label="Resources"><LinkList links={secondaryLinks} /></nav>
          </div>
        </div>

        <div className="footer__brand">
          <SocialLinks links={socialLinks} />
          <div className="footer__brand-lockup">
            <img src="/assets/site/footer-brand.png" alt="Packaging Consultants USA — America's Leading Packaging Design and Launch Consulting" />
          </div>
        </div>
      </div>

      <div className="footer__legal">
        <span>Signature American Industries LLC</span>
        <i>•</i>
        <span>Packaging Consultants USA</span>
        <span>Copyright Ⓒ 2026</span>
        <span>All Rights Reserved</span>
      </div>
    </footer>
  )
}
