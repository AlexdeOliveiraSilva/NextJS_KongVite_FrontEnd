'use client'

import React from "react"
import { useState, useEffect } from "react"
import { BsFillTicketPerforatedFill } from "react-icons/bs";

export default function TotalInvites({ invites }) {


    return (
        <div className="totalinvitesMain flexr">
            <BsFillTicketPerforatedFill />
            <h2>SALDO TOTAL </h2>
            <h1>{invites} INGRESSOS</h1>
        </div>
    )
}