'use client'
import React from "react";
import { useState, useEffect, useContext } from "react"
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { usePathname, useRouter } from "next/navigation";
import TopbarAdmin from "../fragments/topbarAdmin";
import TopbarCompany from "../fragments/topbarCompany";
import { GlobalContext } from "@/context/global";
import LogoutIcon from '@mui/icons-material/Logout';
import GetEventGuest from "../Modal/type3eventSelect";
import TopbarGuest from "../fragments/topbarGuest";

export default function Topbar() {
    const path = usePathname();
    const router = useRouter();
    const { user,
        setUserName,
        setUserEmail,
        setUserType,
        setUserJwt,
        eventChoice,
        setEventChoice,
        company } = useContext(GlobalContext);
    const [companyData, setcompanyData] = useState();
    const [barOpen, setBarOpen] = useState(false);
    const [eventChoiceModal, setEventChoiceModal] = useState(false);


    const [clientDataChoice, setClientDataChoice] = useState();
    const [inviteslaking, setInvitesLaking] = useState(0);

    const logout = (e) => {
        e.preventDefault()
        localStorage.clear("user_jwt");
        localStorage.clear("user_name");
        localStorage.clear("user_type");
        localStorage.clear("user_email");
        localStorage.clear("event_choice");
        setEventChoice('')
        setUserName('')
        setUserEmail('')
        setUserType('')
        setUserJwt('')

        router.push('/');
    }

    function barClick() {
        if (barOpen == true) {
            setBarOpen(false);
        } else {
            setBarOpen(true);
            setTimeout(() => {
                setBarOpen(false)
            }, 5000)
        }
    }


    const changeTitle = (x) => {
        switch (x) {
            case "/admin/dashboard/":
                return "Dashboard"

            case "/admin/administradores/":
                return "Administradores"

            case '/admin/administradores/add':
                return "Administradores"

            case '/admin/administradores/edit':
                return "Administradores"

            case "/admin/empresas/":
                return "Empresas"

            case '/admin/empresas/add/':
                return "Empresas"

            case '/admin/empresas/edit/':
                return "Empresas"

            case '/admin/empresas/usuarios/':
                return "Empresas - Usuários"

            case '/admin/empresas/usuarios/add/':
                return "Empresas - Usuários"

            case '/admin/empresas/usuarios/edit/':
                return "Empresas - Usuários"

            case "/cliente/empresas/":
                return "Dashboard"

            case "/cliente/usuarios/":
                return "Usuários"

            case "/cliente/eventos/":
                return "Eventos"

            case "/cliente/novo-evento/":
                return "Evento"

            case "/cliente/eventos/edit/":
                return "Evento"

            case '/cliente/event-view/':
                return "Evento"

            case '/cliente/turmas/':
                return "Turmas"

            case '/cliente/turmas/turma-view/':
                return "Turmas"

            case '/convidado/evento/':
                return "Evento"

            case '/convidado/transferencias/':
                return "Transferências"

            default:
                break;
        }
    }


    // async function getCompany() {
    //     let x;
    //     let jwt = !!user?.jwt ? user.jwt : localStorage.getItem("user_jwt")
    //     let companyName = !!company?.name ? company?.name : localStorage.getItem("company_name");

    //     try {

    //         x = await (await fetch(`${KONG_URL}/companys/1?name=${companyName}`, {
    //             method: 'GET',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'Authorization': jwt
    //             }
    //         })).json()

    //         setCompanyEditData(x.data.filter((e) => e.name == companyName))

    //     } catch (error) {

    //         return ""
    //     }
    // }

    function invitesGuestCount(z) {
        if (!!z) {
            z.map((e) => {
                setInvitesLaking(inviteslaking + (+e.available))
            })
        }
    }

    function closeGuestModalF() {
        setEventChoiceModal(false);
    }

    useEffect(() => {
        let x = !!user?.type ? user.type : localStorage.getItem("user_type")
        let y = !!eventChoice ? eventChoice : localStorage.getItem("event_choice");


        if ((x == "3" || x == 3) && !y) {
            setEventChoiceModal(true);
        }

        setcompanyData({
            id: !!company?.id ? company.id : localStorage.getItem('company_id'),
            name: !!company?.name ? company.name : localStorage.getItem('company_name'),
            document: !!company?.document ? company.document : localStorage.getItem('company_document')
        })
    }, [])

    useEffect(() => {
        let y = !!eventChoice ? eventChoice : localStorage.getItem("event_choice");
        let z = JSON.parse(y)
        setClientDataChoice(z);
        invitesGuestCount(z?.guestsTicketsTypeNumber);
    }, [eventChoiceModal])


    return (
        <div className="topbarMain flexr">
            {eventChoiceModal == true && <GetEventGuest close={() => closeGuestModalF()}></GetEventGuest>}
            <div className="topbarContent flexr">
                <div
                    className="topbarPageTitle flexr">
                    <ChevronRightIcon className="topbarTitleIcon"></ChevronRightIcon>
                    <h1>{changeTitle(path)}</h1>
                </div>
                <div className="topbarPageMidle flexr">
                    {user?.type == 1
                        ?
                        <TopbarAdmin></TopbarAdmin>
                        : user?.type == 2 ?
                            <TopbarCompany data={companyData}></TopbarCompany>
                            :
                            <TopbarGuest invites={inviteslaking}></TopbarGuest>
                    }
                </div>
                <div
                    onClick={(e) => {
                        e.preventDefault();
                        barClick();
                    }}
                    className="topbarPageHello flexr">
                    {user?.name != undefined ? <h2> Olá, <span>{user?.name == "Administrador" ? "Admin!" : `${user?.name}!`}</span></h2> : ""}
                    {!!barOpen &&
                        <div
                            className="topbarPageGetOut flexc">
                            <div
                                onClick={(e) => logout(e)}
                                className="flexr topbarMenuItemActive" style={{ gap: "10px" }}>
                                <LogoutIcon className="topbarMenuIcon" style={{ color: "var(--red-primary)" }} />
                                <p className={!barOpen ? "iconOpacity topbarTextMenu" : "topbarTextMenu"}>Sair da Conta</p>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}