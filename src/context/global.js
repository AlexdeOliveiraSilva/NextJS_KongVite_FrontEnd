'use client'

import React, { createContext, useEffect, useState } from 'react';

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
    const KONG_URL = "https://api.kongvite.com";

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

    const eventsType = ["Formatura", "Festa", "Venda de Ingressos", "Corporativo"];
    const eventsSubType = ["Almoço", "Jantar"];
    const adminSidebarItens = ["dashboard", "administradores", "empresas"];
    const guestSideBar = ["evento", "transferencias"];

    const estbSidebarItens = ["eventos", "novo-evento"];
    const estbSidebarEvent = ["dashboard", "event-view", "turmas", "sair-evento"];


    const [userName, setUserName] = useState()
    const [userEmail, setUserEmail] = useState()
    const [userType, setUserType] = useState()
    const [userJwt, setUserJwt] = useState()
    const [userId, setUserId] = useState()

    const [companyId, setCompanyId] = useState()
    const [companyName, setCompanyName] = useState()
    const [companyDoc, setCompanyDoc] = useState()
    const [eventClasses, setEventClasses] = useState()
    const [eventChoice, setEventChoice] = useState();

    useEffect(() => {
        setUserName(localStorage.getItem("user_name"))
        setUserEmail(localStorage.getItem("user_email"))
        setUserType(localStorage.getItem("user_type"))
        setUserJwt(localStorage.getItem("user_jwt"))
        setUserId(localStorage.getItem("user_id"))
    }, [])

    return (
        <GlobalContext.Provider value={{
            adminSidebarItens,
            estbSidebarItens,
            KONG_URL,
            user: {
                name: userName,
                email: userEmail,
                type: userType,
                jwt: userJwt,
                id: userId
            },
            company: {
                id: companyId,
                name: companyName,
                document: companyDoc
            },
            sendtos3,
            setUserName,
            setUserEmail,
            setUserType,
            setUserJwt,
            setUserId,
            userEdit,
            setUserEdit,
            companyEdit,
            setCompanyEdit,
            companyNameEdit,
            setCompanyNameEdit,
            setCompanyId,
            setCompanyName,
            setCompanyDoc,
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
            setRefreshPage

        }}>
            {children}
        </GlobalContext.Provider>
    );
};
