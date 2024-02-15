'use client'

import React, { useState, useEffect, useContext } from "react"
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

export default function Sidebar({ itens }) {
    const [barOpen, setBarOpen] = useState(true);
    const { KONG_URL, estbSidebarItens, adminSidebarItens, user, setUserName, setUserEmail, setUserType, setUserJwt } = useContext(GlobalContext);
    const [userLogged, setUserLogged] = useState({
        name: "",
        email: "",
        type: 0,
        jwt: ""
    });

    const router = useRouter();

    const getIcon = (x) => {
        const commonStyle = { color: 'var(--grey-light)' };

        switch (x) {
            case "dashboard":
                return <DashboardIcon className="sidebarMenuIcon" style={commonStyle} />;
            case "admin-users":
                return <AccountCircleIcon className="sidebarMenuIcon" style={commonStyle} />;
            case "Empresas":
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
            case "admin-users":
                return "Admin Users";
            case "Empresas":
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
        e.preventDefault()
        router.push(`${path}`)
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
        setUserLogged({
            name: localStorage.getItem("user_name"),
            email: localStorage.getItem("user_email"),
            type: localStorage.getItem("user_type"),
            jwt: localStorage.getItem("user_jwt")
        })
    }, [])

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
                            onClick={(event) => Redirect(event, e)}
                            key={y} className="flexr sidebarMenuItemActive" style={{ gap: "10px" }}>
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