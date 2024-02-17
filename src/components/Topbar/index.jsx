'use client'

import React, { useState, useEffect, useContext } from "react"
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { usePathname, useRouter } from "next/navigation";
import TopbarAdmin from "../fragments/topbarAdmin";
import TopbarCompany from "../fragments/topbarCompany";
import { GlobalContext } from "@/context/global";

export default function Topbar() {
    const path = usePathname();
    const router = useRouter();
    const { user } = useContext(GlobalContext);


    const changeTitle = (x) => {
        switch (x) {
            case "/admin/dashboard":
                return "Dashboard"

            case "/admin/administradores":
                return "Administradores"

            case '/admin/administradores/add':
                return "Administradores"

            case '/admin/administradores/edit':
                return "Administradores"

            case "/admin/empresas":
                return "Empresas"

            case '/admin/empresas/add':
                return "Empresas"

            case '/admin/empresas/edit':
                return "Empresas"

            case '/admin/empresas/usuarios':
                return "Empresas"

            case '/admin/empresas/usuarios/add':
                return "Empresas"

            case '/admin/empresas/usuarios/edit':
                return "Empresas"

            default:
                break;
        }
    }

    function backTo(event, url) {
        event.preventDefault();
        router.push(`/admin/${url}`)
    }
    return (
        <div className="topbarMain flexr">
            <div className="topbarContent flexr">
                <div
                    onClick={(event) => backTo(event, changeTitle(path).toLocaleLowerCase())}
                    className="topbarPageTitle flexr">
                    <ChevronRightIcon className="topbarTitleIcon"></ChevronRightIcon>
                    <h1>{changeTitle(path)}</h1>
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
                    {user?.name != undefined ? <h2> Olá, <span>{user?.name == "Administrador" ? "Admin!" : `${user?.name}!`}</span></h2> : ""}
                </div>
            </div>
        </div>
    )
}