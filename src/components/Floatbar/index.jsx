'use client'

import React, { useState, useEffect, useContext } from "react"
import { useRouter } from "next/navigation";
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
import CancelIcon from '@mui/icons-material/Cancel';

export default function FloatBar({ itens }) {
    const [barOpen, setBarOpen] = useState(true);
    const [floatOpen, setFloatOpen] = useState(false);
    const router = useRouter();

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

    const logout = (e) => {
        e.preventDefault()
        router.push('/');
    }

    useEffect(() => {
        const sidebarMain = document.getElementById('sidebarMain');

        if (!barOpen) {
            sidebarMain.classList.add('sidebarMainClose');
        } else {
            sidebarMain.classList.remove('sidebarMainClose');
        }
    }, [barOpen]);


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
                        {!!adminSidebarItens && adminSidebarItens.map((e, y) => {
                            return (
                                <div key={y} className="flexr sidebarMenuItemActive" style={{ gap: "10px" }}>
                                    {getIcon(e)}
                                    <p className={!barOpen ? "iconOpacity sidebarTextMenu" : "sidebarTextMenu"}>{e}</p>
                                </div>
                            )
                        })}
                    </div>
                    <div className="flexr sidebarFooter" style={{ height: "30%" }}>
                        <div
                            onClick={(e) => logout(e)}
                            className="flexr sidebarMenuItemActive" style={{ gap: "10px" }}>
                            <LogoutIcon className="sidebarMenuIcon" style={{ color: "var(--red-primary)" }} />
                            <p className={!barOpen ? "iconOpacity sidebarTextMenu" : "sidebarTextMenu"}>Sair</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}