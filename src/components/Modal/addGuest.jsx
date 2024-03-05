'use client'

import { useState, useContext, useEffect } from "react"
import CloseIcon from '@mui/icons-material/Close';
import TextField from '@mui/material/TextField';
import Loader from "../fragments/loader";
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { GlobalContext } from "@/context/global";
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

export default function AddGuest({ close, classId, typesData, guestId, guestName }) {
    const { KONG_URL, user, eventEdit, eventChoice } = useContext(GlobalContext);

    const [isLoading, setIsLoading] = useState();
    const [guest, setGuest] = useState();
    const [event, setEvent] = useState();

    const [name, setName] = useState();
    const [document, setDocument] = useState();
    const [phone, setPhone] = useState();
    const [email, setEmail] = useState();
    const [selfPass, setSelfPass] = useState();


    async function addGuest(event) {
        event.preventDefault();

        let jwt = !!user?.jwt ? user.jwt : localStorage.getItem("user_jwt");
        let x;

        if (!!jwt && !!classId) {
            setIsLoading(true);
            try {

                x = await (await fetch(`${KONG_URL}/student/acompanhante/add/${classId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': jwt
                    },
                    body: JSON.stringify({
                        name: name,
                        document: document,
                        phone: phone,
                        email: email,
                        tycketsTypeId: selfPass
                    })
                })).json()

                if (!!x?.guests) {

                    close();

                    toast.success("Convidado cadastrada.", {
                        position: "top-right"
                    });
                    setIsLoading(false);
                    return ""
                }
            } catch (error) {
                console.log("erro")
                toast.error("Erro ao cadastrar Convidado.", {
                    position: "top-right"
                });
                setIsLoading(false);
                return ""
            }
        } else {
            toast.error("Erro ao cadastrar Convidado.", {
                position: "top-right"
            });
            console.log("else")
        }
    }

    async function editGuest(event) {
        event.preventDefault();

        let jwt = !!user?.jwt ? user.jwt : localStorage.getItem("user_jwt")

        let x;

        if (!!jwt && !!classId && !!guestId) {
            setIsLoading(true);
            try {
                x = await (await fetch(`${KONG_URL}/student/acompanhante/add/${classId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': jwt
                    },
                    body: JSON.stringify({
                        id: guestId,
                        name: name,
                        document: document,
                        phone: phone,
                        email: email,
                        tycketsTypeId: selfPass
                    })
                })).json()
                console.log("aaa", x)
                if (!!x?.message) {

                    close();

                    toast.success("Convidado editada com sucesso.", {
                        position: "top-right"
                    });
                    setIsLoading(false);
                }
            } catch (error) {
                toast.error("Erro ao editar Convidado.", {
                    position: "top-right"
                });
                setIsLoading(false);
                console.log("erro")
                return ""
            }
        } else {
            toast.error("Erro ao editar Convidado.", {
                position: "top-right"
            });
            console.log("else")
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
                    >{!!guestId ? `Convidado: ${guestName}` : 'Adicionar Convidado'}</h2>
                    <TextField
                        onChange={(e) => setName(e.target.value)}
                        className="inputStyle"
                        label={!!name ? '' : "Nome"}
                        value={name}
                        id="outlined-size-normal"
                        placeholder={`Digite o Nome:'`}
                        type="text" />
                    <TextField
                        onChange={(e) => setDocument(e.target.value)}
                        className="inputStyle"
                        label={!!document ? '' : "Documento"}
                        value={document}
                        id="outlined-size-normal"
                        placeholder={`Digite o Documento:'`}
                        type="text" />
                    <div className="userAdminDoubleInputs flexr">
                        <TextField
                            onChange={(e) => setPhone(e.target.value)}
                            className="inputStyle"
                            label={!!phone ? '' : "Telefone"}
                            value={phone}
                            id="outlined-size-normal"
                            placeholder={`Digite o Telefone:'`}
                            type="text" />
                        <FormControl className="InputsTwoSelect">
                            <InputLabel id="demo-simple-select-label">Tipo do Ingresso</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={selfPass}
                                onChange={(e) => setSelfPass(e.target.value)}
                            >
                                {!!typesData ?
                                    typesData.map((e, y) => {
                                        if (e.available > 0) {
                                            return (
                                                <MenuItem key={y} value={e.tycketsType.id}>
                                                    {e.tycketsType.description}
                                                </MenuItem>
                                            )
                                        }
                                    })
                                    :
                                    <MenuItem value={999}>Sem opções</MenuItem>
                                }
                            </Select>
                        </FormControl>
                    </div>
                    <TextField
                        onChange={(e) => setEmail(e.target.value)}
                        className="inputStyle"
                        label={!!email ? '' : "E-mail"}
                        value={email}
                        id="outlined-size-normal"
                        placeholder={`Digite o E-mail:'`}
                        type="text" />


                    <button
                        onClick={!!guestId ? (e) => editGuest(e) : (e) => addGuest(e)}
                        style={{ minWith: "120px", marginTop: "30px" }}
                        className="btnBlue">{!!isLoading ? <Loader></Loader> : !!guestId ? 'Salvar Alterações' : 'Salvar'}</button>
                </div>
            </div>
        </div>
    )

}