'use client'
import React from "react";
import { useState, useEffect, useContext } from "react"
import { usePathname } from "next/navigation";
import { GlobalContext } from "@/context/global";
import LogoutIcon from '@mui/icons-material/Logout';
import GetEventGuest from "../Modal/type3eventSelect";
import { useRouter } from "next/navigation";
import { GoMail } from "react-icons/go";
import Separator from "@/components/fragments/separatorLine";
import { FaRegCircleUser } from "react-icons/fa6";

export default function NewTopBar() {
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




    useEffect(() => {
        let x = !!user?.type ? user.type : localStorage.getItem("user_type")
        let y = !!eventChoice ? eventChoice : localStorage.getItem("event_choice");
        if ((x == "3" || x == 3)) {
            getAvaibles();
            if (!y) {
                setEventChoiceModal(true);
            }
        }


        setcompanyData({
            id: !!company?.id ? company.id : localStorage.getItem('company_id'),
            name: !!company?.name ? company.name : localStorage.getItem('company_name'),
            document: !!company?.document ? company.document : localStorage.getItem('company_document')
        })
    }, [])


    return (
        <div className="newTopMain flexr">
            {eventChoiceModal == true && <GetEventGuest close={() => closeGuestModalF()} seteffect={(e) => { e.preventDefault(); doRefresh() }}></GetEventGuest>}
            <Separator width={'1px'} height={'100%'} color={'#DFE0E6'} />
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
                    <p>{user?.usersType.description}</p>
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
    )
}