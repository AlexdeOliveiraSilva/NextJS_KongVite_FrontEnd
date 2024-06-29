'use client'

import { useRouter } from "next/navigation"
import { FaLongArrowAltRight } from "react-icons/fa";

export default function SiteMapping({ map }) {
    const router = useRouter();


    return (
        <div className="margin5percent">
            <div className="newTopSitemap flexr">
                {!!map && map.map((e, y) => {
                    if (y != (map.length - 1) && !!e.url) {
                        return (
                            <h1
                                style={{ cursor: 'pointer', fontWeight: 400 }}
                                className="flexr gap-2"
                                onClick={() => router.push(e.url)}
                                key={y}>{e.name} <FaLongArrowAltRight />
                            </h1>
                        )
                    } else {
                        return (
                            <h1
                                style={{ fontWeight: 800 }}
                                key={y}>{e.name}
                            </h1>
                        )
                    }
                })}

            </div>
        </div>
    )
}