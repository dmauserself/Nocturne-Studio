import { Contact } from './Contact'
import { Faq } from './Faq'
import { Footer } from './Footer'
import { Philosophy } from './Philosophy'
import { Presence } from './Presence'
import { Process } from './Process'
import { Projects } from './Projects'
import { Services } from './Services'
import { Team } from './Team'
import { Testimonials } from './Testimonials'

/** Всё, что ниже первого экрана: грузится отдельным чанком */
export default function BelowFold() {
  return (
    <>
      <Presence />
      <Services />
      <Philosophy />
      <Projects />
      <Process />
      <Team />
      <Testimonials />
      <Faq />
      <Contact />
      <Footer />
    </>
  )
}
