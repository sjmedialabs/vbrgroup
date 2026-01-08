"use client"

import useSWR from "swr"
import Image from "next/image"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function ContactInfoSection() {
    const { data } = useSWR("/api/branding", fetcher)

    const branding = data?.branding
    const contact = branding?.contactInfo

    if (!contact) return null

    return (
        <section className="py-12 lg:py-20">
            <div className="max-w-300 mx-auto px-5">
                <div
                    className="relative rounded-4xl overflow-hidden"
                    style={{
                        backgroundImage: "url('/uploads/bottomGreenImage.png')",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                >

                    {/* Content */}
                    <div className="relative z-10 flex flex-wrap md:flex-nowrap md:flex-row gap-4 md:justify-between items-center px-8 lg:px-16 py-20 text-white">

                        {/* EMAILS */}
                        <div className="flex gap-4 items-start md:basis-1/4">

                            <div>
                                <h4 className="font-semibold text-lg mb-1 flex flex-row items-center gap-1"><Image
                                    src="/images/contactMail.png"
                                    alt="Contact Location"
                                    className="w-4 h-4 rounded-full object-cover"
                                    width={50}
                                    height={50}
                                /> <span> General enquiries </span></h4>
                                {contact.emails?.map((email: string, i: number) => (
                                    <p key={i} className="text-base opacity-90">
                                        {email}
                                    </p>
                                ))}
                            </div>
                        </div>
                        <div className=" basis-1/8 lg:flex justify-center hidden items-center">
                            <div className="h-20 w-px bg-gray-400 "></div></div>
                        {/* PHONES */}
                        <div className="flex gap-4 items-start xl:px-8 md:basis-1/4">
                            <div>
                                <h4 className="font-semibold text-lg mb-1 flex flex-row items-center gap-1"><Image
                                    src="/images/contacthead.png"
                                    alt="Contact Location"
                                    width={50}
                                    height={50}
                                    className="w-4 h-4 rounded-full object-cover"
                                /><span> Give us a call </span></h4>
                                {contact.phones?.map((phone: string, i: number) => (
                                    <p key={i} className="text-base opacity-90">
                                        {phone}
                                    </p>
                                ))}
                            </div>
                        </div>
                        <div className=" basis-1/8 lg:flex justify-center hidden items-center">
                            <div className="h-20 w-px bg-gray-400  lg:block"></div></div>
                        {/* ADDRESS */}
                        <div className="flex gap-4 items-start md:basis-1/4">
                            <div>
                                <h4 className="font-semibold text-lg mb-1 flex flex-row items-center gap-1">
                                    <Image
                                        src="/images/contactLoc.png"
                                        alt="Contact Location"
                                        width={50}
                                        height={50}
                                        className="w-4 h-4 rounded-full object-cover"
                                    /> <span> Contact Location </span></h4>
                                <p className="text-base opacity-90">{contact.address}</p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    )
}
