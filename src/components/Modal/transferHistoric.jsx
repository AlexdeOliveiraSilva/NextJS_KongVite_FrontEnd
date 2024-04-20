'use client'

import { useState, useContext, useEffect } from "react"
import CloseIcon from '@mui/icons-material/Close';
import "react-toastify/dist/ReactToastify.css";
import { GlobalContext } from "@/context/global";
import Loader from "../fragments/loader";
import { useRouter } from "next/navigation";
import Separator from "../fragments/separatorLine";

export default function TransferHistoric({ close, id }) {
    const { KONG_URL, user, eventEdit, eventChoice } = useContext(GlobalContext);
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(),
        [data, setData] = useState();


    function onSend() {
        close();

        if (isAdd == true) {
            router.push('/cliente/turmas/turma-view/')
        }

    }

    function onClose() {
        close();

        if (isAdd == true) {
            router.push('/cliente/turmas/turma-view/')
        }
    }

    async function getHistoric() {
        let jwt = !!user?.jwt ? user.jwt : localStorage.getItem("user_jwt")
        let x;

        if (!!jwt && !!id) {
            setIsLoading(true);

            try {
                x = await (await fetch(`${KONG_URL}/companys/transferInvites/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': jwt
                    }
                })).json()
                if (!x?.message) {
                    setIsLoading(false);
                    setData(x)
                    return ""
                }
            } catch (error) {
                setIsLoading(false);
                return ""
            }
        } else {
            console.log("else")
        }
    }

    function formatDateToInput(dataString) {
        const data = new Date(dataString);

        const ano = data.getFullYear();
        const mes = String(data.getMonth() + 1).padStart(2, '0');
        const dia = String(data.getDate()).padStart(2, '0');
        const horas = String(data.getHours()).padStart(2, '0');
        const minutos = String(data.getMinutes()).padStart(2, '0');

        return `${dia}/${mes}/${ano} às ${horas}:${minutos} horas`;
    }

    useEffect(() => {
        getHistoric()
    }, [])


    return (
        <div
            onClick={close}
            className='mainModal flexr'>
            <div
                onClick={(e) => e.stopPropagation()}
                className='contentAddModal flexc'>
                <div
                    onClick={close}
                    className='modalClose flexr'><CloseIcon></CloseIcon></div>
                <div className="userAdminDoubleInputs flexc" style={{ gap: "10px" }}>
                    <h2
                        style={{ marginBottom: "30px" }}
                    >Histórico de Transferências</h2>

                    <div
                        onClick={(e) => e.stopPropagation()}
                        className='flexr' style={{ gap: "20px", width: "100%" }}>

                        <div className="clienteUl flexc" style={{ overflowY: 'auto', margin: "0", padding: "0" }}>
                            <div className="clienteTitle flexr">
                                <p className="historicDateLi">Data</p>
                                <Separator color={"var(--grey-ligth)"} width="1px" height="100%"></Separator>
                                <p className="historicTypeLi">Tipo</p>
                                <Separator color={"var(--grey-ligth)"} width="1px" height="100%"></Separator>
                                <p className="historicNameLi">Quem Recebeu</p>
                            </div>

                            {!!isLoading ?
                                <Loader></Loader>
                                :
                                !!data?.length > 0 ? data.map((e, y) => {
                                    return (
                                        <div
                                            // onClick={(event) => goView(event, e.id)}
                                            key={y} className="clienteLine flexr" style={{ width: "100%" }}>
                                            <p className="historicDateLi">{formatDateToInput(e.createdAt)}</p>
                                            <Separator color={"var(--grey-ligth)"} width="1px" height="100%"></Separator>
                                            <p className="historicTypeLi">{e.tycketsType?.description}</p>
                                            <Separator color={"var(--grey-ligth)"} width="1px" height="100%"></Separator>
                                            <p className="historicNameLi">{e.guests_guestsTransfers_guestIdDestinyToguests?.name}</p>
                                        </div>
                                    )
                                })
                                    :
                                    <p style={{ marginTop: "30px" }}>Nenhuma Tranferência</p>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

}