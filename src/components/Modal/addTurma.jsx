'use client'

import { useState, useContext, useEffect } from "react"
import CloseIcon from '@mui/icons-material/Close';
import TextField from '@mui/material/TextField';
import Loader from "../fragments/loader";
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { GlobalContext } from "@/context/global";

export default function AddTurmas({ close, turmaId, name }) {
    const { KONG_URL, user, eventEdit } = useContext(GlobalContext);

    const [isLoading, setIsLoading] = useState();
    const [turma, setTurma] = useState();
    const [event, setEvent] = useState();

    async function addTurma(event) {
        event.preventDefault();

        let jwt = !!user?.jwt ? user.jwt : localStorage.getItem("user_jwt")
        let eventId = !!eventEdit ? eventEdit : localStorage.getItem("event_edit");
        let x;

        if (!!jwt && !!eventId && !!turma) {
            setIsLoading(true);
            try {

                x = await (await fetch(`${KONG_URL}/companys/turma/${eventId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': jwt
                    },
                    body: JSON.stringify({
                        name: turma
                    })
                })).json()

                if (!x?.message) {

                    close();

                    toast.success("Turma cadastrada.", {
                        position: "top-right"
                    });
                    setIsLoading(false);
                    return ""
                }
            } catch (error) {
                console.log("erro")
                toast.error("Erro ao cadastrar turma.", {
                    position: "top-right"
                });
                setIsLoading(false);
                return ""
            }
        } else {
            toast.error("Erro ao cadastrar turma.", {
                position: "top-right"
            });
            console.log("else")
        }
    }

    async function editTurma() {
        let jwt = !!user?.jwt ? user.jwt : localStorage.getItem("user_jwt")
        let eventId = !!eventEdit ? eventEdit : localStorage.getItem("event_edit");
        let x;

        if (!!jwt && !!eventId && !!turma) {
            setIsLoading(true);
            try {

                x = await (await fetch(`${KONG_URL}/companys/turma/${eventId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': jwt
                    },
                    body: JSON.stringify({
                        id: turmaId,
                        name: turma
                    })
                })).json()

                if (!x?.message) {

                    close();

                    toast.success("Turma editada com sucesso.", {
                        position: "top-right"
                    });
                    setIsLoading(false);
                }
            } catch (error) {
                toast.error("Erro ao editar turma.", {
                    position: "top-right"
                });
                setIsLoading(false);
                console.log("erro")
                return ""
            }
        } else {
            toast.error("Erro ao editar turma.", {
                position: "top-right"
            });
            console.log("else")
        }
    }

    useEffect(() => {
        if (!!turmaId) {
            setTurma(name)
        }

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
                <div className="userAdminDoubleInputs flexc" style={{ gap: "30px" }}>
                    <h2>{!!turmaId ? `Editar turma: ${name}` : 'Adicione uma Turma'}</h2>
                    <TextField
                        onChange={(e) => setTurma(e.target.value)}
                        className="inputStyle"
                        label={!!turma ? '' : "Nome da Turma"}
                        value={turma}
                        id="outlined-size-normal"
                        placeholder={`Digite o Nome da Turma:'`}
                        type="text" />

                    <button
                        onClick={!!turmaId ? (e) => editTurma(e) : (e) => addTurma(e)}
                        style={{ minWith: "120px" }}
                        className="btnBlue">{!!isLoading ? <Loader></Loader> : 'Salvar'}</button>
                </div>
            </div>
        </div>
    )

}