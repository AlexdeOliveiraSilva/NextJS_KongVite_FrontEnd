'use client'

export default function TopbarGuest({ invites }) {

    return (
        <div className="topbarMidleContent flexr">
            <h4>Convites: <span>{invites || 0}</span></h4>
            <div className="topbarMidleButton flexr">Transferir</div>
        </div>
    )
}