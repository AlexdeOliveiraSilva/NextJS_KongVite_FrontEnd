'use client'

import { useState, useContext, useEffect } from "react"
import CloseIcon from '@mui/icons-material/Close';
import "react-toastify/dist/ReactToastify.css";
import { GlobalContext } from "@/context/global";
import Loader from "../fragments/loader";
import { useRouter } from "next/navigation";

export default function InvitesAddModal({ close, id }) {
    const { KONG_URL, user, eventEdit, eventChoice } = useContext(GlobalContext);
    const router = useRouter();

    const [isLoading, setIsLoading] = useState();

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


    useEffect(() => {

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
                    >Adicionar Mais Convites</h2>

                    <div
                        onClick={(e) => e.stopPropagation()}
                        className='flexr' style={{ gap: "20px" }}>
                        {!!isLoading ?
                            <Loader></Loader>
                            :
                            <>
                                <p>aguardando rota do backend</p>
                            </>
                        }
                    </div>
                </div>
            </div>
        </div>
    )

}