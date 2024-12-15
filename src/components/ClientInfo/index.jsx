'use client'

import React from "react"
import { useState, useEffect } from "react"
import { IoCloseOutline } from "react-icons/io5";
import { LuMapPin } from "react-icons/lu";
import { IoCalendarClearOutline } from "react-icons/io5";
import { BsFillTicketPerforatedFill } from "react-icons/bs";




export default function ClientInfo({ eventName, place, invites, date, hour, tickets }) {

    const [ticketsSorted, setTicketsSorted] = useState()

    const colors = [
        '#0B192E',
        '#2E64AD',
        '#18A87C',
        '#00E1E2'
    ]

    useEffect(() => {
        if (tickets) {
            let x = tickets.sort((a, b) => a.tycketsType?.description.localeCompare(b.tycketsType?.description))

            setTicketsSorted(x)
        }

    }, [tickets])



    return (
        <div className="mainClientInfo flexc">
            {!!eventName &&
                <div className="iconEventContent flexr">
                    <div className="iconEvent flexr"><LuMapPin size={40} /></div>
                    <div className="iconEventData flexc">
                        <h6>EVENTO</h6>
                        <h1>{eventName}</h1>
                        <p>Local: {place}</p>
                    </div>
                    <div className="iconEvent flexr"><IoCalendarClearOutline size={40} /></div>
                    <div className="iconEventData flexc">
                        <h6>DATA</h6>
                        <h1>{date}</h1>
                        <p>às {hour} horas</p>
                    </div>
                </div>
            }

            <p>Você possui um total de <span>{invites} convite{invites != 1 ? "s" : ""} disponíve{invites != 1 ? "is" : "l"}</span> {!!invites && invites > 0 ? `, utilize${invites > 1 ? "-os" : ""} conforme a divisão feita abaixo` : ""}.</p>

            <div className="typeCardBox flexr">
                {!!ticketsSorted && ticketsSorted.map((e, y) => {
                    const c = colors[y % colors.length];
                    console.log(e)
                    return (
                        <div key={y} className="typeCard flexr" style={{ borderLeft: "10px solid", borderColor: c }}>
                            <div className="typeCardAvaible flexr" style={{ backgroundColor: c }}>{e.available}</div>
                            <div className="typeCardName flexc" style={{ color: c }}>
                                <div className="typeCardDesc flexr">
                                    <BsFillTicketPerforatedFill size={25} />
                                    <h6 style={{ color: c }}>{e.tycketsType?.description}</h6>
                                </div>
                                <p>Total de <i>{e.available}/{e.number}</i> disponíveis.</p>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}