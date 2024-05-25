'use client'

import React from "react"
import { useState, useEffect } from "react"
import { IoCloseOutline } from "react-icons/io5";



export default function BannerInfo({ image, name, text, del }) {

    return (
        <div className="mainInfoBanner flexr">
            <img src={image}></img>
            <div className="mainInfoContent flexc">
                <h1>Olá, {name}!</h1>
                <p>{text}</p>
                <button onClick={del}>Não mostrar essa mensagem novamente.</button>
            </div>
            <IoCloseOutline
                onClick={del}
                className="bannerInfoClose" size={25} />
        </div>
    )
}