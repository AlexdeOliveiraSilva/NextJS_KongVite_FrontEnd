'use client'

import React from "react";
import { useState, useEffect, useContext } from "react"
import { GlobalContext } from "@/context/global";
import Separator from "../fragments/separatorLine";
import { IoMdCloseCircleOutline, IoIosCheckmarkCircleOutline } from "react-icons/io";
import { BsFillTicketPerforatedFill } from "react-icons/bs";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
import { BsDownload } from "react-icons/bs";
import Loader from "../fragments/loader";
import { RiLockPasswordLine } from "react-icons/ri";

export default function GuestInfo({ self, data, setGuestDeleteId, setDeleteGuestModalIsOpen, setGuestData, setAddGuestModalIsOpen, setNewpasswordModal }) {
    const { KONG_URL, user, eventEdit, eventChoice, eventClasses, setRefreshPage, refreshPage } = useContext(GlobalContext);

    const colors = [
        '#0B192E',
        '#2E64AD',
        '#18A87C',
        '#00E1E2'
    ];

    const [tickets, setTickets] = useState([]),
        [filter, setFilter] = useState(),
        [dataCopy, setDataCopy] = useState(),
        [isLoading, setIsLoading] = useState(""),
        [isDownloaded, setIsDownloaded] = useState([]);


    function getFilter() {
        let x = data.filter((e) => e.tycketsType?.description.toString() == filter.toString())
        setDataCopy(x)
    }

    function openDeleteGuest(e, id) {
        e.preventDefault();
        e.stopPropagation();
        setGuestDeleteId(id)
        setDeleteGuestModalIsOpen(true)
    }

    function openEditGuest(e, data) {
        e.preventDefault();
        e.stopPropagation();
        setGuestData(data)
        setAddGuestModalIsOpen(true)
    }

    function openChangePassword() {

        setNewpasswordModal(true)
    }

    async function toDownload(uuid) {

        let jwt = !!user?.jwt ? user.jwt : localStorage.getItem("user_jwt")


        if (!!jwt && !!uuid && !!KONG_URL) {
            setIsLoading(uuid);

            try {
                let response = await fetch(`${KONG_URL}/invite/${uuid}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': jwt
                    }
                });


                if (response.ok) {
                    let blob = await response.blob();
                    let url = window.URL.createObjectURL(blob);

                    let a = document.createElement('a');
                    a.href = url;
                    a.download = `${uuid.toString().trim().toLowerCase()}.jpg`;
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);

                    setIsLoading("");
                } else {
                    console.log("erro else")
                    setIsLoading("");
                }


            } catch (error) {

                console.log("error:", error)
                setIsLoading("");
            }
        }
    }

    useEffect(() => {
        setDataCopy(data)

        if (data) {
            let colorIndex = 0;
            const updatedTickets = [...tickets];

            data.forEach((e) => {
                const description = e.tycketsType?.description;
                if (description && !updatedTickets.find(ticket => ticket.name === description)) {
                    updatedTickets.push({ name: description, color: colors[colorIndex % colors.length] });
                    colorIndex++;
                }
            });

            setTickets(updatedTickets);
        }


    }, [data]);

    useEffect(() => {
        if (!!filter && filter.length > 0) {
            getFilter()
        } else {
            setDataCopy(data)
        }
    }, [filter])



    return (
        <div className="mainGuestInfo flexc">
            <div className="mainGuestTable flexc">
                <div className="mainGuestFilters flexr">
                    <div
                        style={filter == undefined ? { backgroundColor: "var(--white-primary)" } : { backgroundColor: "#f8f8f8", color: "var(--grey-ligth)" }}
                        onClick={() => setFilter(undefined)}
                        className="GuestColunsTags flexr"><BsFillTicketPerforatedFill />TODOS</div>
                    {!!tickets && tickets.map((e, y) => {
                        return (
                            <div
                                style={filter == e.name.toString() ? { backgroundColor: "var(--white-primary)" } : { backgroundColor: "#f8f8f8", color: "var(--grey-ligth)" }}
                                onClick={() => setFilter(e.name.toString())}
                                key={y} className="GuestColunsTags flexr"><BsFillTicketPerforatedFill />{e.name}</div>
                        )
                    })}
                </div>
                <div className="mainGuestInside flexc">
                    <div className="GuestInsideColuns">
                        <p className="firstChild">Ingresso</p>
                        <p className="secondChild">Nome</p>
                        <p className="trhirdChild">Confirmação</p>
                        <p className="lastChild"></p>
                    </div>
                    <Separator width={'100%'} height={"1px"} color={"#71798639"}></Separator>
                    {!!self &&
                        <React.Fragment>
                            <div className="GuestInsideLines">
                                <div className="firstChild">
                                    <p style={{ backgroundColor: "var(--blue-fourth)" }}>{self.tycketsType?.description}</p>
                                </div>
                                <div
                                    style={{ fontWeight: "bold" }}
                                    className="secondChild">
                                    {self.name}
                                </div>
                                <div className="trhirdChild flexr">
                                    {self.status === 'AUSENTE' ?
                                        <IoMdCloseCircleOutline size={30} color="#71798691" />
                                        : <IoIosCheckmarkCircleOutline size={30} color="var(--blue-third)" />
                                    }
                                </div>
                                <div className="lastChild flexr">
                                    {isLoading != self.uuid ?
                                        <BsDownload
                                            style={{ cursor: "pointer" }}
                                            onClick={() => toDownload(self.uuid)}
                                            size={30} color="#71798691" />
                                        :
                                        <Loader></Loader>
                                    }
                                    <RiLockPasswordLine
                                        style={{ cursor: "pointer" }}
                                        onClick={(event) => openChangePassword(event)}
                                        size={30} color="#71798691" />

                                </div>
                            </div>
                            <Separator width={'100%'} height={"1px"} color={"#71798639"}></Separator>
                        </React.Fragment>
                    }
                    {!!dataCopy ? dataCopy.sort((a, b) => a.tycketsType?.description.localeCompare(b.tycketsType?.description)).map((e, y) => {
                        const ticket = tickets.find(ticket => ticket.name === e.tycketsType?.description);
                        const backgroundColor = ticket ? ticket.color : 'transparent';
                        return (
                            <React.Fragment key={y}>
                                <div className="GuestInsideLines">
                                    <div className="firstChild">
                                        <p style={{ backgroundColor }}>{e.tycketsType?.description}</p>
                                    </div>
                                    <div className="secondChild">
                                        {e.name}
                                    </div>
                                    <div className="trhirdChild flexr">
                                        {e.status === 'AUSENTE' ?
                                            <IoMdCloseCircleOutline size={30} color="#71798691" />
                                            : <IoIosCheckmarkCircleOutline size={30} color="var(--blue-third)" />
                                        }
                                    </div>
                                    <div className="lastChild flexr">
                                        {isLoading != e.uuid ?
                                            <BsDownload
                                                style={{ cursor: "pointer" }}
                                                onClick={() => toDownload(e.uuid)}
                                                size={30} color="#71798691" />
                                            :
                                            <Loader></Loader>
                                        }
                                        <FaRegEdit
                                            style={{ cursor: "pointer" }}
                                            onClick={(event) => openEditGuest(event, e)}
                                            size={30} color="#71798691" />

                                        <RiDeleteBinLine
                                            style={{ cursor: "pointer" }}
                                            onClick={(event) => { openDeleteGuest(event, e.id) }}
                                            size={30} color="#71798691" />

                                    </div>
                                </div>
                                <Separator width={'100%'} height={"1px"} color={"#71798639"}></Separator>
                            </React.Fragment>
                        )
                    })
                        :
                        <p style={{ margin: "30px 0" }}>Sem Convidados...</p>
                    }
                </div>
            </div>
        </div>
    )
}