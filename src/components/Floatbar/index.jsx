'use client'

import React, { useState, useEffect, useContext } from "react"
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { GlobalContext } from "@/context/global";
import DashboardIcon from '@mui/icons-material/Dashboard';
import MenuIcon from '@mui/icons-material/Menu';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import LogoutIcon from '@mui/icons-material/Logout';
import CancelIcon from '@mui/icons-material/Cancel';
import WorkspacesIcon from '@mui/icons-material/Workspaces';

export default function FloatBar({ itens }) {
    const path = usePathname();
    const [barOpen, setBarOpen] = useState(true);
    const [event, setEvent] = useState()
    const [pathType, setPathType] = useState();
    const [menu, setMenu] = useState([]);
    const [floatOpen, setFloatOpen] = useState(false);
    const { estbSidebarItens, adminSidebarItens, user, estbSidebarEvent, guestSideBar, eventSelected } = useContext(GlobalContext);
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
                return <AddBusinessIcon className="sidebarMenuIcon" style={commonStyle} />;
            case "transferencias":
                return <DashboardIcon className="sidebarMenuIcon" style={commonStyle} />;
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
        setTimeout(() => {
            setFloatOpen(false)
        }, 150)

    }

    function toSetMenu(x) {

        switch (x) {

            case "1":
                setMenu(adminSidebarItens);
                break;

            case "2":
                if (path.startsWith('/cliente/event-view') || path.startsWith('/cliente/turmas')) {
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
        if (user) {
            setEvent(!!eventSelected ? eventSelected : localStorage.getItem('event_selected'))
            toSetMenu(user.usersType.id);
            switch (user.usersType.id) {
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
        }
    }, [user])




    if (floatOpen == false) {
        return (
            <div className="floatMainIcon flexc" onClick={() => setFloatOpen(true)} >
                <MenuIcon className="floatIcon" />
            </div>
        )
    } else {
        return (
            <div id="floatmain" className="floatmain flexc">
                <div className="floatmainInside flexc">
                    <div className="floatInsideClose flexc" onClick={() => setFloatOpen(false)}>
                        <CancelIcon style={{ width: "45px", height: "45px", color: "var(--blue-primary)" }} />
                    </div>
                    <div className="flexc sidebarMenuItens" style={{ height: "70%" }}>
                        {menu.map((e, y) => {
                            return (
                                <div
                                    onClick={(event) => Redirect(event, `/${pathType}/${e == 'sair-evento' ? 'eventos' : e}`)}
                                    key={y} className={path.startsWith(`/${pathType}/${e}`) ? "flexr floatbarTextmenuActive" : "flexr floatbarTextmenuActive"} style={{ gap: "10px" }}>
                                    {getIcon(e)}
                                    <p className={!barOpen ? "floatbarTextMenu" : "floatbarTextMenu"}>{getName(e)}</p>
                                </div>
                            )
                        })}
                    </div>
                    <div className="flexr sidebarFooter" style={{ height: "30%" }}>
                        {/* <div
                            onClick={(e) => logout(e)}
                            className="flexr sidebarMenuItemActive" style={{ gap: "10px" }}>
                            <LogoutIcon className="sidebarMenuIcon" style={{ color: "var(--red-primary)" }} />
                            <p className={!barOpen ? "iconOpacity sidebarTextMenu" : "sidebarTextMenu"}>Algo aqui</p>
                        </div> */}
                    </div>
                </div>
            </div>
        )
    }

}