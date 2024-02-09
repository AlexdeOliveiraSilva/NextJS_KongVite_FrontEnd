'use client'
import Dashboard from '@/app/admin/dashboard/page';
import React, { createContext, useEffect, useState } from 'react';

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
    const [adminSidebarItens, setAdminSidebarItens] = useState([
        "Dashboard",
        "Usuários",
        "Empresas",
        "Convidados",
        "Configurações"
    ]);
    const [theme, setTheme] = useState(true);

    return (
        <GlobalContext.Provider value={{
            adminSidebarItens,
            setAdminSidebarItens,
            theme,
            setTheme
        }}>
            {children}
        </GlobalContext.Provider>
    );
};
