'use client'
import React from "react";
import { useState, useEffect, useContext } from "react"
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { usePathname } from "next/navigation";
import TopbarAdmin from "../fragments/topbarAdmin";
import TopbarCompany from "../fragments/topbarCompany";
import { GlobalContext } from "@/context/global";
import LogoutIcon from '@mui/icons-material/Logout';
import GetEventGuest from "../Modal/type3eventSelect";
import TopbarGuest from "../fragments/topbarGuest";
import { useRouter } from "next/navigation";
import TransferModal from "@/components/Modal/transferModal";
import Loader from "@/components/fragments/loader";

export default function Topbar() {
    const path = usePathname();
    const router = useRouter();
    const { user,
        KONG_URL,
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
    const [transferModalIsOpen, setTransferModalIsOpen] = useState(false);
    const [inviteslaking, setInvitesLaking] = useState(0);
    const [myData, setMyData] = useState();
    const [loadData, setLoadData] = useState(false);

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

    function openTransferPassword() {

        setTransferModalIsOpen(true)
    }

    function deleteTransferPassword() {
        window.location.reload()
        setTransferModalIsOpen(false)
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

    function invitesGuestCount(z) {
        if (!!z && z.length > 0) {

            const totalAvailable = z.reduce((accumulator, currentObject) => {

                const availableValue = Number(currentObject.available);

                return accumulator + (isNaN(availableValue) ? 0 : availableValue);
            }, 0);


            setInvitesLaking(totalAvailable);
        }
    }

    function closeGuestModalF() {
        setEventChoiceModal(false);
    }

    async function getAvaibles() {
        let jwt = !!user?.jwt ? user.jwt : localStorage.getItem("user_jwt");
        let y = !!eventChoice ? JSON.parse(eventChoice) : JSON.parse(localStorage.getItem("event_choice"));

        let theClass = y?.classEvent?.id

        let x;

        if (!!jwt && !!theClass) {
            setLoadData(true)
            try {
                x = await (await fetch(`${KONG_URL}/user/guests/${theClass}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': jwt
                    }
                })).json()

                if (!x?.message) {
                    invitesGuestCount(x.guestsTicketsTypeNumber);
                    setLoadData(false)
                } else {
                    console.log("error", x)
                    setLoadData(false)
                }


            } catch (error) {
                setLoadData(false)
                console.log("catch", error)
                return ""
            }
        }
    }

    async function getAllData(myId) {

        let x;
        let jwt = !!user?.jwt ? user.jwt : localStorage.getItem("user_jwt")

        if (!!myId) {

            try {
                x = await (await fetch(`${KONG_URL}/student/${myId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': jwt
                    }
                })).json()

                if (!x.message) {
                    setMyData(x)
                    return ""
                }

            } catch (error) {

                return ""
            }
        } else {

            return ""
        }
    }



    useEffect(() => {


        let x = !!user?.type ? user.type : localStorage.getItem("user_type")
        let y = !!eventChoice ? eventChoice : localStorage.getItem("event_choice");

        if ((x == "3" || x == 3)) {
            getAvaibles();

            if (!y) {
                setEventChoiceModal(true);
            }
        }

        getAllData(!!user?.id ? user?.id : localStorage.getItem("user_id"));

        setcompanyData({
            id: !!company?.id ? company.id : localStorage.getItem('company_id'),
            name: !!company?.name ? company.name : localStorage.getItem('company_name'),
            document: !!company?.document ? company.document : localStorage.getItem('company_document')
        })
    }, [])


    return (
        <div className="topbarMain flexr">
            {!!transferModalIsOpen && <TransferModal close={() => deleteTransferPassword()} myData={myData}></TransferModal>}
            {eventChoiceModal == true && <GetEventGuest close={() => closeGuestModalF()} seteffect={(e) => { e.preventDefault(); doRefresh() }}></GetEventGuest>}
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
                            <TopbarGuest invites={inviteslaking} open={() => openTransferPassword()} load={loadData}></TopbarGuest>
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