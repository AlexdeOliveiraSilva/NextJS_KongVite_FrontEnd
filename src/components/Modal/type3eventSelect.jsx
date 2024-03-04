'use client'

import { useEffect, useState, useContext } from "react"
import CloseIcon from '@mui/icons-material/Close';
import TextField from '@mui/material/TextField';
import { GlobalContext } from "@/context/global";
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import Loader from "../fragments/loader";


export default function GetEventGuest({ close }) {
    const { KONG_URL, user, eventClasses, setEventChoice, setEventClasses } = useContext(GlobalContext);
    const [eventData, setEventData] = useState();
    const [isLoading, setIsLoading] = useState(false);

    function SetingEventData() {
        let x = !!eventClasses ? eventClasses : localStorage.getItem("event_classes")

        try {
            const jsonArray = JSON.parse(x);

            setEventData(jsonArray)

        } catch (error) {
            console.error('Erro ao fazer o parse da string JSON:', error);
        }


    }

    async function SelectEvent(e, classId, classEvent, event) {
        e.preventDefault();
        let jwt = !!user?.jwt ? user.jwt : localStorage.getItem("user_jwt")
        let x;

        if (!!jwt && !!classId) {
            setIsLoading(true);

            try {
                x = await (await fetch(`${KONG_URL}/user/guests/${classId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': jwt
                    }
                })).json()

                if (!x?.message) {
                    let user = x
                    const data = JSON.stringify({
                        classEvent,
                        user
                    })
                    const eventsClassesString = JSON.stringify(event);

                    setEventChoice(data)
                    localStorage.setItem("event_choice", data)

                    setEventClasses(eventsClassesString);
                    localStorage.setItem("event_classes", eventsClassesString);

                    close()
                    toast.success("Evento Selecionado.", {
                        position: "top-right"
                    });
                    setIsLoading(false);
                }

            } catch (error) {

                toast.error("Não foi possivel selecionar.", {
                    position: "top-right"
                });
                setIsLoading(false);
                return ""
            }

        } else {

            return ""
        }
    }

    useEffect(() => {
        SetingEventData();
    }, [])

    return (
        <div
            className='mainModal flexr'>
            <div className='contentGuestEventChoice flexc'>
                <h2 style={{ whiteSpace: "nowrap" }}>Selecione o Evento: </h2>
                {isLoading == true ?
                    <div className="guestEventChoiceLine flexc">
                        <button
                            className="guestEventChoice" style={{ whiteSpace: "nowrap" }}><Loader></Loader></button>

                    </div>
                    :
                    <div className="guestEventChoiceLine flexc">

                        {!!eventData && eventData.map((e, y) => {
                            return (
                                <>
                                    <button
                                        onClick={(event) => SelectEvent(event, e.eventsClasses.id, e.eventsClasses, e.events)}
                                        key={y} className="guestEventChoice" style={{ whiteSpace: "nowrap" }}>{e.events.name} | {e.eventsClasses.name}</button>
                                </>

                            )
                        })}
                    </div>
                }
                <div className="guestEventChoiceLine flexc" style={{ margin: "0", padding: "0" }}>
                    <p className="infoWarningEventChoice">* Selecione para prosseguir</p>
                </div>
            </div>
        </div>
    )

}