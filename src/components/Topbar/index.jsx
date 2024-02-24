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
    const { user, company } = useContext(GlobalContext);
    const [companyData, setcompanyData] = useState();


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
                return "Empresas - Usuários"

            case '/admin/empresas/usuarios/add':
                return "Empresas - Usuários"

            case '/admin/empresas/usuarios/edit':
                return "Empresas - Usuários"

            case "/cliente/dashboard":
                return "Dashboard"

            case "/cliente/usuarios":
                return "Usuários"

            case "/cliente":
                return "Evento"

            case "/cliente/novo-evento":
                return "Evento"

            case "/cliente/edit":
                return "Evento"

            default:
                break;
        }
    }

    function backTo(event, url) {
        event.preventDefault();
        router.push(`/admin/${url}`)
    }

    async function getCompany() {
        let x;
        let jwt = !!user?.jwt ? user.jwt : localStorage.getItem("user_jwt")
        let companyName = !!company?.name ? company?.name : localStorage.getItem("company_name");

        try {

            x = await (await fetch(`${KONG_URL}/companys/1?name=${companyName}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': jwt
                }
            })).json()

            setCompanyEditData(x.data.filter((e) => e.name == companyName))

        } catch (error) {

            return ""
        }
    }

    useEffect(() => {
        setcompanyData({
            id: !!company?.id ? company.id : localStorage.getItem('company_id'),
            name: !!company?.name ? company.name : localStorage.getItem('company_name'),
            document: !!company?.document ? company.document : localStorage.getItem('company_document')
        })
    }, [])

    return (
        <div className="topbarMain flexr">
            <div className="topbarContent flexr">
                <div
                    onClick={(event) => backTo(event,
                        changeTitle(path)
                            .toLocaleLowerCase()
                            .replaceAll(" ", "")
                            .replaceAll("-", "/")
                            .replaceAll("á", 'a')
                    )}
                    className="topbarPageTitle flexr">
                    <ChevronRightIcon className="topbarTitleIcon"></ChevronRightIcon>
                    <h1>{changeTitle(path)}</h1>
                </div>
                <div className="topbarPageMidle flexr">
                    {user?.type == 1
                        ?
                        <TopbarAdmin></TopbarAdmin>
                        :
                        <TopbarCompany data={companyData}></TopbarCompany>
                    }
                </div>
                <div className="topbarPageHello flexr">
                    {user?.name != undefined ? <h2> Olá, <span>{user?.name == "Administrador" ? "Admin!" : `${user?.name}!`}</span></h2> : ""}
                </div>
            </div>
        </div>
    )
}