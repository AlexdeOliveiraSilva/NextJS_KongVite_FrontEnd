'use client'

import React, { useState, useEffect, useContext } from "react"
import { GlobalContext } from "@/context/global";
import DashboardIcon from '@mui/icons-material/Dashboard';
import PermDataSettingIcon from '@mui/icons-material/PermDataSetting';
import MenuIcon from '@mui/icons-material/Menu';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import PaidIcon from '@mui/icons-material/Paid';
import StoreIcon from '@mui/icons-material/Store';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import LogoutIcon from '@mui/icons-material/Logout';

export default function Sidebar({ itens }) {
    const [barOpen, setBarOpen] = useState(true);
    const { adminSidebarItens, setAdminSidebarItens, theme, setTheme } = useContext(GlobalContext);

    const getIcon = (x) => {
        switch (x) {
            case "Dashboard":
                return <DashboardIcon className="sidebarMenuIcon" style={{ color: 'var(--grey-ligth)' }
                } />
                break;
            case "Usuários":
                return <AccountCircleIcon className="sidebarMenuIcon" style={{ color: 'var(--grey-ligth)' }} />
                break;
            case "Empresas":
                return <AddBusinessIcon className="sidebarMenuIcon" style={{ color: 'var(--grey-ligth)' }} />
                break;
            case "Convidados":
                return <PeopleAltIcon className="sidebarMenuIcon" style={{ color: 'var(--grey-ligth)' }} />
                break;
            case "Configurações":
                return <PermDataSettingIcon className="sidebarMenuIcon" style={{ color: 'var(--grey-ligth)' }} />
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

    return (
        <div id="sidebarMain" className="sidebarMain flexc">
            {/* <div className="sidebarToogle flexr">

            </div> */}
            <div className="flexr sidebarLogo">
                <div className={!barOpen ? "flexr sidebarOpacity" : "flexr sidebarLogoDiv"}>
                    <img src="/logos/logo-kongvite.png" className={!barOpen && "iconOpacity"}></img>
                </div>
                <button onClick={() => setBarOpen(!barOpen)}>{!!barOpen == true ? <ArrowCircleLeftIcon className="sideIcon" /> : <ArrowCircleRightIcon className="sideIcon" />}</button>
            </div>
            <div className="flexc sidebarMenuItens">
                {!!adminSidebarItens && adminSidebarItens.map((e, y) => {
                    return (
                        <div key={y} className="flexr sidebarMenuItemActive" style={{ gap: "10px" }}>
                            {getIcon(e)}
                            <p className={!barOpen ? "iconOpacity sidebarTextMenu" : "sidebarTextMenu"}>{e}</p>
                        </div>
                    )
                })}
            </div>
            <div className="flexr sidebarFooter">
                <div className="flexr sidebarMenuItemActive" style={{ gap: "10px" }}>
                    <LogoutIcon className="sidebarMenuIcon" style={{ color: "var(--red-primary)" }} />
                    <p className={!barOpen ? "iconOpacity sidebarTextMenu" : "sidebarTextMenu"}>Sair</p>
                </div>
            </div>
        </div >
    );
}