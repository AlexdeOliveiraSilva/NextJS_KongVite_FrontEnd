'use client'
import React from "react";
import { useState, useEffect, useContext } from "react"
import { usePathname } from "next/navigation";
import { GlobalContext } from "@/context/global";
import LogoutIcon from '@mui/icons-material/Logout';
import { useRouter } from "next/navigation";
import Separator from "@/components/fragments/separatorLine";
import { FaRegCircleUser } from "react-icons/fa6";
import TotalInvites from "./fragments/totalInvites";

export default function NewClientTopBar() {
    const path = usePathname();
    const router = useRouter();
    const {
        user,
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
    const [inviteslaking, setInvitesLaking] = useState(0);
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
        let jwt = user.jwt
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




    useEffect(() => {
        let x = user?.usersType.id
        let y = !!eventChoice ? eventChoice : localStorage.getItem("event_choice");
        // Estudante
        if (user?.usersType.id == "3") {
            getAvaibles();
            if (!y) {
                setEventChoiceModal(true);
            }
        }
    }, [])


    return (
        <div className="newTopInvitesMain flexr">
            {/* <div className="newTopSitemap flexr">
                <h1>{changeTitle(path)}</h1>
            </div> */}

            <TotalInvites invites={inviteslaking}></TotalInvites>
            <div className="newTopUserBox flexr">
                {/* <div className="newTopInvites flexr">
                    <LuPlus size={18} color="var(--blue-primary)" />
                </div> */}
                <Separator width={'1px'} height={'30px'} color={'#DFE0E6'} />
                <div
                    onClick={(e) => {
                        e.preventDefault();
                        barClick();
                    }}
                    className="newTopBox flexr">
                    <FaRegCircleUser size={22} color="var(--blue-primary)" />
                    <div
                        className="flexc">
                        <h6>{!!user?.name ? user?.name.split(' ')[0] : ""}</h6>
                        <p>{user?.usersType?.description}</p>
                        {!!barOpen &&
                            <div
                                className="topbarPageGetOut flexc">
                                <div
                                    onClick={(e) => logout(e)}
                                    className="flexr topbarMenuItemActive" style={{ gap: "10px" }}>
                                    <LogoutIcon className="topbarMenuIcon" style={{ color: "var(--red-primary)" }} />
                                    <p
                                        style={{ fontSize: "14px" }}
                                        className={!barOpen ? "iconOpacity topbarTextMenu" : "topbarTextMenu"}>Sair da Conta</p>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}