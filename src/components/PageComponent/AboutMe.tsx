"use client"
import { gruzAbout } from "@/data/GruzData/data"
import SectionTitle from "../SectionTitle"
import { useSwitch } from "../Context/SwitchContext"
import { rinkitAbout } from "@/data/RinkitData/data"

const AboutMe = () => {
  const { isSwitchOn } = useSwitch()
  return (
    <section className="flex flex-col gap-0.5">
      <SectionTitle title="About Me" />
      <div
        dangerouslySetInnerHTML={{
          __html: isSwitchOn ? gruzAbout : rinkitAbout,
        }}
        className="flex flex-col gap-1"
      />
    </section>
  )
}

export default AboutMe
