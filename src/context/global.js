'use client'

import React, { createContext, useEffect, useState } from 'react';
import { usePathname, useRouter } from "next/navigation";
export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
    const KONG_URL = "https://api.kongvite.com";
    const router = useRouter();
    async function sendtos3(key, extension, base64Data) {

        let res;

        const body = JSON.stringify({
            key: key.toString(),
            extension: extension.toString(),
            base64Data: base64Data.toString()
        });

        try {
            res = await (await fetch(`${KONG_URL}/upload`, {
                method: 'POST',
                body: body,
                headers: {
                    'Content-Type': 'application/json'
                }
            })).json()


            return res

        } catch (error) {
            console.log('error', error);
        }

    }

    const [userEdit, setUserEdit] = useState();
    const [eventEdit, setEventEdit] = useState();
    const [companyEdit, setCompanyEdit] = useState();
    const [turmaEditId, setTurmaEditId] = useState();
    const [guestEditId, setGuestEditId] = useState();
    const [guestEditName, setGuestEditName] = useState();
    const [companyNameEdit, setCompanyNameEdit] = useState();
    const [refreshPage, setRefreshPage] = useState(false);

    const [eventSelected, setEventSelected] = useState();

    const eventsType = ["Formatura"];
    const eventsSubType = ["Almoço", "Jantar"];
    const adminSidebarItens = ["dashboard", "administradores", "empresas"];
    const guestSideBar = ["evento", "transferencias"];
    const estbSidebarItens = ["eventos", "novo-evento"];
    const estbSidebarEvent = ["eventos", "turmas", "sair-evento"];

    const [user, setUser] = useState()

    const [eventClasses, setEventClasses] = useState()
    const [eventChoice, setEventChoice] = useState();

    useEffect(() => {
        let data = localStorage.getItem("user", null)
        if (!data) {
            router.push('/');
        } else {
            setUser(JSON.parse(localStorage.getItem("user")))
        }
    }, [router.pathname])

    return (
        <GlobalContext.Provider value={{
            adminSidebarItens,
            estbSidebarItens,
            KONG_URL,
            sendtos3,
            userEdit,
            setUserEdit,
            companyEdit,
            setCompanyEdit,
            companyNameEdit,
            setCompanyNameEdit,
            eventSelected,
            setEventSelected,
            estbSidebarEvent,
            eventsType,
            eventsSubType,
            eventEdit,
            setEventEdit,
            turmaEditId,
            setTurmaEditId,
            guestEditId,
            setGuestEditId,
            guestEditName,
            setGuestEditName,
            guestSideBar,
            eventClasses,
            setEventClasses,
            eventChoice,
            setEventChoice,
            refreshPage,
            setRefreshPage,
            user,
            setUser

        }}>
            {children}
        </GlobalContext.Provider>
    );
};
