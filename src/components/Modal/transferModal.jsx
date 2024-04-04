'use client'

import Loader from "../fragments/loader"
import { useEffect, useState, useContext } from "react"
import CloseIcon from '@mui/icons-material/Close';
import TextField from '@mui/material/TextField';
import { GlobalContext } from "@/context/global";
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function TransferModal({ close, myData }) {
    const { KONG_URL, user, eventChoice } = useContext(GlobalContext);
    const [isLoading, setIsLoading] = useState(false),
        [transferError, setTransferError] = useState(""),
        [selectedUser, setSelectedUser] = useState(""),
        [step, setStep] = useState(1),
        [myColleagues, setMyColleagues] = useState([]),
        [myColleaguesCopy, setMyColleaguesCopy] = useState([]),
        [searchUser, setSearchuser] = useState();

    const [counters, setCounters] = useState(
        myData?.mainConvidado?.guestsTicketsTypeNumber?.map(ticket => 0) || []
    );

    const increaseCount = (index) => {
        const newCounters = [...counters];
        newCounters[index]++;
        setCounters(newCounters);
    }

    const decreaseCount = (index) => {
        const newCounters = [...counters];
        if (newCounters[index] > 0) {
            newCounters[index]--;
            setCounters(newCounters);
        }
    }

    async function getGuests() {
        let jwt = !!user?.jwt ? user.jwt : localStorage.getItem("user_jwt");
        let myClass = !!eventChoice ? JSON.parse(eventChoice) : JSON.parse(localStorage.getItem("event_choice"));
        let x;

        try {
            x = await (await fetch(`${KONG_URL}/student/myColleagues/${myClass?.classEvent?.id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': jwt
                }
            })).json()

            if (!x.message) {
                setMyColleagues(x)

                return ""
            }

        } catch (error) {

            return ""
        }

    }

    async function tranferNow(id) {
        let jwt = user?.jwt || localStorage.getItem("user_jwt");

        if (!!jwt && !!id) {
            setIsLoading(true);

            try {
                await Promise.all(myData?.mainConvidado?.guestsTicketsTypeNumber?.map(async (e, y) => {
                    if ((e.available - counters[y]) > 0) {
                        const response = await fetch(`${KONG_URL}/student/transferInvites/${id}`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': jwt
                            },
                            body: JSON.stringify({
                                amount: counters[y],
                                tycketsTypeId: e.tycketsType.id
                            })
                        });

                        if (response.ok) {
                            toast.success("Transferido com sucesso!");
                        } else {
                            console.log("erro")
                        }
                    }
                }));

                close();
                setIsLoading(false);
                return ""
            } catch (error) {
                console.error("Error transferir tickets:", error);
                toast.error("Falha ao transferir...");
            } finally {
                setIsLoading(false);
            }
        } else {
            console.log("else");
        }
    }

    function onSearch() {
        if (searchUser?.length > 0) {
            setMyColleaguesCopy(myColleagues.filter((e) => e.name.toLowerCase().includes(searchUser.trim().toLowerCase())))
        }
    }

    function onSearchClear() {
        if (searchUser?.length == 0) {
            setMyColleaguesCopy([])
        }
    }

    function setToSecondStep(user) {
        setSelectedUser(user)
        setStep(2)
    }

    function setToFirstStep() {
        setSelectedUser()
        setStep(1)
    }


    useEffect(() => {
        getGuests();
        onSearchClear();
    }, [])


    return (
        <div
            onClick={close}
            className='mainModal flexr'>
            <div
                onClick={(e) => e.stopPropagation()}
                className='contentModal flexc'>
                <div
                    onClick={close}
                    className='modalClose flexr'><CloseIcon></CloseIcon></div>
                {step == 1 ?
                    <div className='deleteModalDiv flexc' style={{ gap: "20px" }}>
                        <h2>Buscar Formando.</h2>
                        <div className="flexc inputDiv" style={{ gap: "10px" }}>
                            <div className="flexr inputDiv" style={{ gap: "10px" }}>
                                <TextField
                                    onChange={(e) => setSearchuser(e.target.value)}
                                    className="inputStyle" id="outlined-size-normal" placeholder={`Digite o Nome...`} type="text" />
                                <SearchIcon
                                    onClick={() => onSearch()}
                                    style={{ fontSize: "40px", color: "#7D7D7D", cursor: "pointer" }}></SearchIcon>
                            </div>
                            <p className="inputDivError">{transferError}</p>
                        </div>
                        <div className='inputDivListContent flexc' style={{ gap: "10px" }}>
                            {myColleaguesCopy.length > 0 ?
                                myColleaguesCopy?.map((e, y) => {
                                    return (
                                        <div
                                            onClick={() => setToSecondStep(e)}
                                            key={y} className='inputDivList flexr'>
                                            {e.name}
                                        </div>
                                    )
                                })
                                :
                                <p>Nenhum Formando selecionado...</p>
                            }
                        </div>
                    </div>
                    : step == 2 &&
                    <div className='deleteModalDiv flexc'>
                        <div className="flexr inputDiv" style={{ justifyContent: "flex-start" }}><ArrowBackIcon onClick={() => setToFirstStep()}></ArrowBackIcon></div>
                        <h2>Transferir para: <span>{selectedUser?.name}</span></h2>
                        <div className="flexc inputDiv" style={{ gap: "10px" }}>
                            <div className="flexr inputDiv" style={{ gap: "10px" }}>
                                {!!myData
                                    ?
                                    myData?.mainConvidado?.guestsTicketsTypeNumber?.map((e, y) => {
                                        return (
                                            <div className="flexc invitesDivContent" key={y} style={{ gap: "10px" }}>
                                                <p>Tipo: <span>{e.tycketsType?.description}</span></p>
                                                <p>Disponiveis: <span>{e.available - counters[y]}</span></p>
                                                <div className="flexr" style={{ width: "100%", gap: "10px" }}>
                                                    <button className="circleInputs flexc" onClick={() => {
                                                        if (counters[y] >= 1) {
                                                            decreaseCount(y)
                                                        }
                                                    }}>-</button>
                                                    <span>{counters[y]}</span>
                                                    <button className="circleInputs flexc" onClick={() => {
                                                        if ((e.available - counters[y]) > 0) {
                                                            increaseCount(y)
                                                        }
                                                    }}>+</button>
                                                </div>
                                            </div>
                                        )
                                    })
                                    :
                                    ""
                                }
                            </div>
                        </div>
                        <div className='deleteModalBtnDiv flexr'>
                            <button
                                onClick={() => tranferNow(selectedUser?.id)}
                                disabled={!!isLoading ? true : false}
                                className={!!isLoading ? "btnDisabled" : "btnOrange"} style={{ minWidth: "100px" }}>
                                {!!isLoading ? <Loader></Loader> : `Transferir`}
                            </button>
                        </div>
                    </div>

                }
            </div>
        </div>
    )
}