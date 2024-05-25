'use client'

import React, { useState, useEffect, useContext } from "react"
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { GlobalContext } from "@/context/global";
import DashboardIcon from '@mui/icons-material/Dashboard';
import PermDataSettingIcon from '@mui/icons-material/PermDataSetting';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import LogoutIcon from '@mui/icons-material/Logout';
import WorkspacesIcon from '@mui/icons-material/Workspaces';
import { IoIosSend, IoMdHome } from "react-icons/io";

export default function Sidebar() {
    const path = usePathname();
    const [barOpen, setBarOpen] = useState(true);
    const [event, setEvent] = useState()
    const [pathType, setPathType] = useState();
    const [menu, setMenu] = useState();

    const {
        estbSidebarItens,
        adminSidebarItens,
        user,
        setUserName,
        setUserEmail,
        setUserType,
        setUserJwt,
        eventSelected,
        setEventSelected,
        estbSidebarEvent,
        guestSideBar

    } = useContext(GlobalContext);

    const router = useRouter();

    const getIcon = (x) => {
        const commonStyle = { color: 'var(--grey-light)' };

        switch (x) {
            case "dashboard":
                return <DashboardIcon className="sidebarMenuIcon" style={commonStyle} />;
            case "administradores":
                return <AccountCircleIcon className="sidebarMenuIcon" style={commonStyle} />;
            case "empresas":
                return <AddBusinessIcon className="sidebarMenuIcon" style={commonStyle} />;
            case "eventos":
                return <AddBusinessIcon className="sidebarMenuIcon" style={commonStyle} />;
            case "novo-evento":
                return <AddBusinessIcon className="sidebarMenuIcon" style={commonStyle} />;
            case "event-view":
                return <AddBusinessIcon className="sidebarMenuIcon" style={commonStyle} />;
            case "usuarios":
                return <AccountCircleIcon className="sidebarMenuIcon" style={commonStyle} />;
            case "sair-evento":
                return <LogoutIcon className="sidebarMenuIcon" style={commonStyle} />;
            case "turmas":
                return <WorkspacesIcon className="sidebarMenuIcon" style={commonStyle} />;
            case "convidados":
                return <AccountCircleIcon className="sidebarMenuIcon" style={commonStyle} />;
            case "evento":
                return <IoMdHome className="sidebarMenuIcon" style={commonStyle} />;
            case "transferencias":
                return <IoIosSend className="sidebarMenuIcon" style={commonStyle} />;
            default:
                return null;
        }
    }

    const getName = (x) => {
        switch (x) {
            case "dashboard":
                return "Dashboard";
            case "administradores":
                return "Administradores";
            case "empresas":
                return "Empresas";
            case "eventos":
                return "Eventos";
            case "novo-evento":
                return "Novo Evento";
            case "event-view":
                return "Evento";
            case "usuarios":
                return "Usuários";
            case "sair-evento":
                return "Sair do Evento";
            case "turmas":
                return "Turmas";
            case "convidados":
                return "Convidados";
            case "evento":
                return "Evento";
            case "transferencias":
                return "Transferências";
            default:
                return x;
        }
    }


    const Redirect = (e, path) => {
        e.preventDefault();
        router.push(`${path}`);
    }

    function ToSetMenu(x) {

        switch (x) {

            case "1":
                setMenu(adminSidebarItens);
                break;

            case "2":
                if (path.startsWith('/cliente/event-view') || path.startsWith('/cliente/turmas') || path.startsWith('/cliente/dashboard')) {
                    setMenu(estbSidebarEvent);
                } else {
                    setMenu(estbSidebarItens);
                }
                break;

            case "3":
                setMenu(guestSideBar);
                break;

            default:
                break;
        }
    }

    useEffect(() => {
        const sidebarMain = document.getElementById('sidebarMain');


        if (!barOpen) {
            sidebarMain.classList.add('sidebarMainClose');
        } else {
            sidebarMain.classList.remove('sidebarMainClose');
        }
    }, [barOpen]);

    useEffect(() => {
        setEvent(!!eventSelected ? eventSelected : localStorage.getItem('event_selected'))
        let userTypeHere = !!user?.type ? user?.type : localStorage.getItem('user_type')

        ToSetMenu(userTypeHere);

        switch (userTypeHere) {
            case "1":
                setPathType('admin')
                break;
            case "2":
                setPathType('cliente')
                break;
            case "3":
                setPathType('convidado')
                break;
            default:
                setPathType('admin')
                break;
        }
    }, [])

    useEffect(() => {
        let userTypeHere = !!user?.type ? user?.type : localStorage.getItem('user_type')

        ToSetMenu(userTypeHere);
    }, [path])


    return (
        <div id="sidebarMain" className="sidebarMain flexc">
            <div className="flexr sidebarLogo">
                <div className={!barOpen ? "flexr sidebarOpacity" : "flexr sidebarLogoDiv"}>
                    <img src="/logos/logo-kongvite.png" className={!barOpen ? "iconOpacity" : undefined}></img>
                </div>
                <button onClick={() => setBarOpen(!barOpen)}>{!!barOpen == true ? <ArrowCircleLeftIcon className="sideIconActive" /> : <ArrowCircleRightIcon className="sideIcon" />}</button>
            </div>
            <div className="flexc sidebarMenuItens">
                {!!menu && menu.map((e, y) => {
                    return (
                        <div
                            onClick={(event) => Redirect(event, `/${pathType}/${e == 'sair-evento' ? 'eventos' : e}`)}
                            key={y} className={path.startsWith(`/${pathType}/${e}`) ? "flexr sidebarMenuItemActiveNow" : "flexr sidebarMenuItemActive"} style={{ gap: "10px" }}>
                            {getIcon(e)}
                            <p className={!barOpen ? "iconOpacity sidebarTextMenu" : "sidebarTextMenu"}>{getName(e)}</p>
                        </div>
                    )
                })}
            </div>
            <div className="flexr sidebarFooter">
            </div>
        </div >
    );
}