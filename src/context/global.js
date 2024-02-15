'use client'

import React, { createContext, useEffect, useState } from 'react';

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
    const KONG_URL = "https://dnib66h97fzb3.cloudfront.net";

    const [userEdit, setUserEdit] = useState();

    const [adminSidebarItens, setAdminSidebarItens] = useState([
        "dashboard",
        "admin-users",
        "Empresas",
        "Convidados",
        "Configurações"
    ]);

    const [estbSidebarItens, setEstbSidebarItens] = useState([
        "Dashboard1",
        "Usuários1",
        "Empresas1",
        "Convidados1",
        "Configurações1"
    ]);

    const [userName, setUserName] = useState()
    const [userEmail, setUserEmail] = useState()
    const [userType, setUserType] = useState()
    const [userJwt, setUserJwt] = useState()

    useEffect(() => {
        setUserName(localStorage.getItem("user_name"))
        setUserEmail(localStorage.getItem("user_email"))
        setUserType(localStorage.getItem("user_type"))
        setUserJwt(localStorage.getItem("user_jwt"))
    }, [])

    return (
        <GlobalContext.Provider value={{
            adminSidebarItens,
            setAdminSidebarItens,
            estbSidebarItens,
            setEstbSidebarItens,
            KONG_URL,
            user: {
                name: userName,
                email: userEmail,
                type: userType,
                jwt: userJwt
            },
            setUserName,
            setUserEmail,
            setUserType,
            setUserJwt,
            userEdit,
            setUserEdit
        }}>
            {children}
        </GlobalContext.Provider>
    );
};
