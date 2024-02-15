'use client'

import React, { useState, useEffect, useContext } from "react"
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { usePathname } from "next/navigation";
import TopbarAdmin from "../fragments/topbarAdmin";
import TopbarCompany from "../fragments/topbarCompany";
import { GlobalContext } from "@/context/global";

export default function Topbar() {
    const path = usePathname();
    const [pageTitle, setPageTitle] = useState("");
    const { KONG_URL, estbSidebarItens, adminSidebarItens, user, setUserName, setUserEmail, setUserType, setUserJwt } = useContext(GlobalContext);
    const [userLogged, setUserLogged] = useState({
        name: "",
        email: "",
        type: 0,
        jwt: ""
    });


    const changeTitle = (x) => {
        switch (x) {
            case "/admin/dashboard":
                return "Dashboard"

            case "/admin/admin-users":
                return "Administradores"

            case '/admin/admin-users/add':
                return "Administradores"

            case '/admin/admin-users/edit':
                return "Administradores"

            default:
                break;
        }
    }

    useEffect(() => {
        setPageTitle(changeTitle(path))
        setUserLogged({
            name: localStorage.getItem("user_name"),
            email: localStorage.getItem("user_email"),
            type: localStorage.getItem("user_type"),
            jwt: localStorage.getItem("user_jwt")

        })
    }, [path])


    return (
        <div className="topbarMain flexr">
            <div className="topbarContent flexr">
                <div className="topbarPageTitle flexr">
                    <ChevronRightIcon className="topbarTitleIcon"></ChevronRightIcon>
                    <h1>{pageTitle}</h1>
                </div>
                <div className="topbarPageMidle flexr">
                    {user?.type == 1
                        ?
                        <TopbarAdmin></TopbarAdmin>
                        :
                        <TopbarCompany></TopbarCompany>
                    }
                </div>
                <div className="topbarPageHello flexr">
                    <h2>Olá, <span>{user?.name == "Administrador" ? "Admin" : userLogged?.name}!</span></h2>
                </div>
            </div>
        </div>
    )
}