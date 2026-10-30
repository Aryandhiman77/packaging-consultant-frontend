import {useEffect,useState} from 'react'
import {FaFacebookF,FaLinkedinIn,FaXTwitter,FaYoutube} from 'react-icons/fa6'
import {useApi} from '../context/ApiContext'
import {defaultSocialLinks,externalLinkProps,resolveSocialLinks} from '../data/socialLinks'
import SiteLink from './SiteLink'
const fallback={address:'P.O. Box 732024\nOrmond Beach, Florida 32173-2024',email:'info@packagingconsultantsusa.com',links:[
 {label:'Home',href:'/',column:1},{label:'Packaging Services',href:'/packaging-services/packaging-development',column:1},
 {label:'Industries',href:'/industries/food-beverage',column:1},{label:'Projects',href:'/projects/packaging-starts-here',column:1},
 {label:'About Us',href:'/about-us/consulting-approach',column:1},{label:'Packaging Times',href:'https://packagingtimes.com/',column:1},
 {label:'Project Review',href:'/project-review/starting-point',column:1},{label:'Contact Us',href:'/contact-us',column:2},
 {label:'Bag and Pouch Die Lines / Template Visuals',href:'/packaging-services/art-templates',column:2}
 ]}
function Links({links}){return <ul className="list-disc marker:text-black">{links.map((item,i)=><li key={item._id||`${item.label}-${i}`}><SiteLink href={item.href}>{item.label}</SiteLink></li>)}</ul>}
function SocialLinks({links}){return <div className="footer__socials" aria-label="Social media links">{[['x',FaXTwitter,'X'],['facebook',FaFacebookF,'Facebook'],['youtube',FaYoutube,'YouTube'],['linkedin',FaLinkedinIn,'LinkedIn']].map(([key,Icon,label])=>/^https?:\/\//.test(links[key]||'')?<a key={key} className={`social-button social-button--${key}`} href={links[key]} {...externalLinkProps(links[key])} aria-label={label}><Icon aria-hidden="true"/></a>:null)}</div>}
export default function Footer(){const {request,getPublicNavigation}=useApi();const [footer,setFooter]=useState(fallback);const [social,setSocial]=useState(defaultSocialLinks)
 useEffect(()=>{let live=true;request('/api/site-content').then(r=>{if(live&&r.data?.footer)setFooter(r.data.footer)}).catch(()=>{});getPublicNavigation().then(r=>{if(live)setSocial(resolveSocialLinks(r))}).catch(()=>{});return()=>{live=false}},[request,getPublicNavigation])
 return <footer className="footer mx-auto w-full max-w-[100vw]" id="contact"><div className="footer__content"><address className="footer__contact"><span>Mailing Address:</span><strong style={{whiteSpace:'pre-line'}}>{footer.address}</strong><span>E-Mail:</span><a href={`mailto:${footer.email}`}>{footer.email}</a></address><div className="footer__navigation"><nav aria-label="Company links"><Links links={footer.links.filter(item=>item.column===1)}/></nav><div className="footer__navigation-secondary"><nav aria-label="Resources"><Links links={footer.links.filter(item=>item.column===2)}/></nav></div></div><div className="footer__brand"><SocialLinks links={social}/><div className="footer__brand-lockup"><img src="/assets/site/footer-brand.png" alt="Packaging Consultants USA — America's Leading Packaging Design and Launch Consulting"/></div></div></div><div className="footer__legal"><span>Signature American Industries LLC</span><i>•</i><span>Packaging Consultants USA</span><span>Copyright Ⓒ 2026</span><span>All Rights Reserved</span></div></footer>
}
