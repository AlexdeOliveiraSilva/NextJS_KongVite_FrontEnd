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
            case "administradores":
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
            case "administradores":
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
                        {!!adminSidebarItens && user?.type == 1 ? adminSidebarItens.map((e, y) => {
                            return (
                                <div key={y} className="flexr sidebarMenuItemActive" style={{ gap: "10px" }}>
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