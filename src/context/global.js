'use client'

import React, { createContext, useEffect, useState } from 'react';

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
    const KONG_URL = "https://dnib66h97fzb3.cloudfront.net";

    const [userEdit, setUserEdit] = useState();
    const [eventEdit, setEventEdit] = useState();
    const [companyEdit, setCompanyEdit] = useState();
    const [companyNameEdit, setCompanyNameEdit] = useState();
    const [eventSelected, setEventSelected] = useState();

    const eventsType = ["Formatura", "Festa", "Venda de Ingressos", "Corporativo"];
    const eventsSubType = ["Almoço", "Jantar"];
    const adminSidebarItens = ["dashboard", "administradores", "empresas"];
    const estbSidebarItens = ["eventos", "novo-evento"];
    const estbSidebarEvent = ["evento", "usuarios", "sair"];

    const [userName, setUserName] = useState()
    const [userEmail, setUserEmail] = useState()
    const [userType, setUserType] = useState()
    const [userJwt, setUserJwt] = useState()

    const [companyId, setCompanyId] = useState()
    const [companyName, setCompanyName] = useState()
    const [companyDoc, setCompanyDoc] = useState()

    useEffect(() => {
        setUserName(localStorage.getItem("user_name"))
        setUserEmail(localStorage.getItem("user_email"))
        setUserType(localStorage.getItem("user_type"))
        setUserJwt(localStorage.getItem("user_jwt"))
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
                jwt: userJwt
            },
            company: {
                id: companyId,
                name: companyName,
                document: companyDoc
            },
            setUserName,
            setUserEmail,
            setUserType,
            setUserJwt,
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
            setEventEdit
        }}>
            {children}
        </GlobalContext.Provider>
    );
};
