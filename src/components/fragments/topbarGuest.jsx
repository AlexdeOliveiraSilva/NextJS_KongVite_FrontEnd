'use client'

import Loader from "./loader"

export default function TopbarGuest({ invites, open, load }) {

    return (
        <div className="topbarMidleContent flexr">
            {load ? <Loader></Loader> : <h4>Convites: <span>{invites || 0}</span></h4>}
            <div
                onClick={open}
                className="topbarMidleButton flexr">Transferir</div>
        </div>
    )
}