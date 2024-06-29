'use client'

import React from "react"
import { useState, useEffect } from "react"
import { IoCloseOutline } from "react-icons/io5";



export default function BannerInfo({ image, name, banner, del, doAction }) {
    const [confirmIsOpen, setConfirmIsOpen] = useState(false)

    function close(type) {
        if (type == 1) {
            del(banner.id)
        } else {
            del(banner.id, banner.cookie)
        }
    }


    return (
        <div className="mainInfoBanner flexr">
            <div></div>
            <img src={image}></img>
            <div className="mainInfoContent flexc">
                <h1>Olá, {name}!</h1>
                <p>{banner.text}</p>
                {!!banner.text2 && <p>{banner.text2}</p>}
                {!!banner.action ?
                    <button onClick={doAction}>{banner.action}</button>
                    :
                    <button onClick={() => close(2)}>Não mostrar essa mensagem novamente.</button>
                }
            </div>
            <IoCloseOutline
                onClick={() => close(1)}
                className="bannerInfoClose" size={25} />
        </div>
    )
}