'use client'

import { useState, useEffect, useContext } from "react"
import { GlobalContext } from "@/context/global";
import { useRouter } from "next/navigation";
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Separator from "@/components/fragments/separatorLine";

export default function Dashboard() {
    const router = useRouter();
    const { KONG_URL, user, eventsType, eventsSubType, eventEdit, setEventEdit } = useContext(GlobalContext),
        [data, setData] = useState();

    async function getEvent() {
        let x;
        let jwt = !!user?.jwt ? user.jwt : localStorage.getItem("user_jwt")
        let eventId = !!eventEdit ? eventEdit : localStorage.getItem("event_edit");

        if (!!jwt && !!eventId) {
            try {

                x = await (await fetch(`${KONG_URL}/companys/dashboardGeneral/${eventId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': jwt
                    }
                })).json()

                if (!x.message) {

                    setData(x.turmas)
                }

            } catch (error) {

                return ""
            }
        } else {

        }
    }
    useEffect(() => {
        getEvent();
    }, [])

    console.log("data", data)

    return (
        <div className="clienteMain flexr">
            <ToastContainer></ToastContainer>

            <div className="clienteContent flexc" style={{ justifyContent: "flex-start", padding: "25px 15px" }}>
                <div className="clienteDashMain flexc" style={{ margin: "0px", maxHeight: "700px", overflowY: "auto", justifyContent: "flex-start" }}>
                    {!!data && data?.map((e, y) => e.types?.map((x, z) => {
                        return (
                            <div key={y} className="flexc clienteDashMain" style={{ padding: "10px", marginTop: "15px" }}>
                                <h6>Turma: <b>{!!e.name && e.name}</b> - Ingresso: {!!x.description && x.description}</h6>
                                <div className="clienteDashGrid">
                                    <div className="clienteDashCard flexr">
                                        <div className="clienteCardContent flexc">
                                            <h4><ArrowForwardIosIcon style={{ fontSize: "12px", marginRight: "10px" }} />{x.ausente}</h4>
                                            <h6>Ausente{x.ausente > 1 && "s"}</h6>
                                        </div>
                                        <CancelIcon style={{ color: "var(--red-primary)", fontSize: "40px" }} />
                                    </div>
                                    <div className="clienteDashCard flexr">
                                        <div className="clienteCardContent flexc">
                                            <h4><ArrowForwardIosIcon style={{ fontSize: "12px", marginRight: "10px" }} />{x.presente}</h4>
                                            <h6>Presente{x.presente > 1 && "s"}</h6>
                                        </div>
                                        <CheckCircleIcon style={{ color: "var(--green-primary)", fontSize: "40px" }} />
                                    </div>
                                    <div className="clienteDashCard flexr">
                                        <div className="clienteCardContent flexc">
                                            <h4><ArrowForwardIosIcon style={{ fontSize: "12px", marginRight: "10px" }} />{x.total}</h4>
                                            <h6>Total</h6>
                                        </div>
                                        <AccountCircleIcon style={{ color: "var(--blue-secondary)", fontSize: "40px" }} />
                                    </div>
                                </div>
                                {e.types?.length != z + 1 && <Separator color={"#BEBEBE"} width="100%" height="1px"></Separator>}
                            </div>


                        )
                    }))}
                </div>
            </div>

        </div>
    );
}
