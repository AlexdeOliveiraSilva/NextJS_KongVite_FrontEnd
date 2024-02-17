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

export default function Sidebar() {
    const path = usePathname();
    const [barOpen, setBarOpen] = useState(true);
    const { estbSidebarItens, adminSidebarItens, user, setUserName, setUserEmail, setUserType, setUserJwt } = useContext(GlobalContext);

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
            case "Convidados":
                return <PeopleAltIcon className="sidebarMenuIcon" style={commonStyle} />;
            case "Configurações":
                return <PermDataSettingIcon className="sidebarMenuIcon" style={commonStyle} />;
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
            case "Convidados":
                return "Convidados";
            case "Configurações":
                return "Configurações";
            default:
                return "";
        }
    }

    const logout = (e) => {
        e.preventDefault()
        localStorage.clear("user_jwt");
        localStorage.clear("user_name");
        localStorage.clear("user_type");
        localStorage.clear("user_email");
        setUserName('')
        setUserEmail('')
        setUserType('')
        setUserJwt('')

        router.push('/');
    }

    const Redirect = (e, path) => {
        e.preventDefault();
        router.push(`${path}`);
    }

    useEffect(() => {
        const sidebarMain = document.getElementById('sidebarMain');

        if (!barOpen) {
            sidebarMain.classList.add('sidebarMainClose');
        } else {
            sidebarMain.classList.remove('sidebarMainClose');
        }
    }, [barOpen]);


    return (
        <div id="sidebarMain" className="sidebarMain flexc">
            <div className="flexr sidebarLogo">
                <div className={!barOpen ? "flexr sidebarOpacity" : "flexr sidebarLogoDiv"}>
                    <img src="/logos/logo-kongvite.png" className={!barOpen ? "iconOpacity" : undefined}></img>
                </div>
                <button onClick={() => setBarOpen(!barOpen)}>{!!barOpen == true ? <ArrowCircleLeftIcon className="sideIconActive" /> : <ArrowCircleRightIcon className="sideIcon" />}</button>
            </div>
            <div className="flexc sidebarMenuItens">
                {!!adminSidebarItens && user?.type == 1 ? adminSidebarItens.map((e, y) => {
                    return (
                        <div
                            onClick={(event) => Redirect(event, `/admin/${e}`)}
                            key={y} className={path.startsWith(`/admin/${e}`) ? "flexr sidebarMenuItemActiveNow" : "flexr sidebarMenuItemActive"} style={{ gap: "10px" }}>
                            {getIcon(e)}
                            <p className={!barOpen ? "iconOpacity sidebarTextMenu" : "sidebarTextMenu"}>{getName(e)}</p>
                        </div>
                    )
                })
                    :
                    !!estbSidebarItens && user?.type == 2 ? estbSidebarItens.map((e, y) => {
                        return (
                            <div key={y} className="flexr sidebarMenuItemActive" style={{ gap: "10px" }}>
                                {getIcon(e)}
                                <p className={!barOpen ? "iconOpacity sidebarTextMenu" : "sidebarTextMenu"}>{getName(e)}</p>
                            </div>
                        )
                    })
                        :
                        <p>No Options</p>
                }

            </div>
            <div className="flexr sidebarFooter">
                <div
                    onClick={(e) => logout(e)}
                    className="flexr sidebarMenuItemActive" style={{ gap: "10px" }}>
                    <LogoutIcon className="sidebarMenuIcon" style={{ color: "var(--red-primary)" }} />
                    <p className={!barOpen ? "iconOpacity sidebarTextMenu" : "sidebarTextMenu"}>Sair</p>
                </div>
            </div>
        </div >
    );
}