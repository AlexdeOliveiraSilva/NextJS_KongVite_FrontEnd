'use client'

import { useEffect, useState, useContext } from "react"
import CloseIcon from '@mui/icons-material/Close';
import TextField from '@mui/material/TextField';
import { GlobalContext } from "@/context/global";
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import Loader from "../fragments/loader";
import { useRouter } from "next/navigation";


export default function GetEventGuest({ close }) {
    const { KONG_URL, user, setEventChoice, setEventClasses } = useContext(GlobalContext);
    const [eventData, setEventData] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    function setingEventData() {
        setEventData(user.eventsClasses)
        console.log(user)
    }

    async function SelectEvent(classId, classEvent, event) {
        let x;
        if (user && !!classId) {
            setIsLoading(true);

            try {
                x = await (await fetch(`${KONG_URL}/user/guests/${classId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': user.jwt
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
        setingEventData();
    }, [user])

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

                        {!!eventData && eventData.length > 1 ? (
                            eventData.map((e, y) => (
                                <button
                                    onClick={() => SelectEvent(e.eventsClasses.id, e.eventsClasses, e.events)}
                                    key={y}
                                    className="guestEventChoice"
                                    style={{ whiteSpace: "nowrap" }}
                                >
                                    {e.events.name} | {e.eventsClasses.name}
                                </button>
                            ))
                        ) : (
                            !!eventData && eventData.length === 1 && (
                                SelectEvent(eventData[0].eventsClasses.id, eventData[0].eventsClasses, eventData[0].events)
                            )
                        )}
                    </div>
                }
                <div className="guestEventChoiceLine flexc" style={{ margin: "0", padding: "0" }}>
                    <p className="infoWarningEventChoice">* Selecione para prosseguir</p>
                </div>
            </div>
        </div>
    )

}