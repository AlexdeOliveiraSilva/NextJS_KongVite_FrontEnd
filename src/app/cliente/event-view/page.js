'use client'

import { useState, useEffect, useContext } from "react"
import { GlobalContext } from "@/context/global";
import { useRouter } from "next/navigation";
import Separator from "@/components/fragments/separatorLine";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DeletModal from "@/components/Modal/deletModal";
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";


export default function EventView() {
    const router = useRouter();
    const { KONG_URL, user, eventsType, eventsSubType, eventEdit, setEventEdit } = useContext(GlobalContext);
    const [name, setName] = useState();
    const [date, setDate] = useState();
    const [address, setAddress] = useState();
    const [zipcode, setZipcode] = useState();
    const [numberAdress, setNumberAdress] = useState();
    const [neighborhood, setNeighborhood] = useState();
    const [city, setCity] = useState();
    const [uf, setUf] = useState();
    const [notifyUsersAboutDeletingInvitations, setNotifyUsersAboutDeletingInvitations] = useState("NAO");
    const [type, setType] = useState("");
    const [subType, setSubType] = useState("");

    const [passType, setPassType] = useState([]);
    const [deleteModalIsOpen, setDeleteModalIsOpen] = useState();

    async function getEvent() {
        let x;
        let jwt = !!user?.jwt ? user.jwt : localStorage.getItem("user_jwt")
        let eventId = !!eventEdit ? eventEdit : localStorage.getItem("event_edit");

        if (!!jwt && !!eventId) {
            try {

                x = await (await fetch(`${KONG_URL}/companys/events/get/${eventId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': jwt
                    }
                })).json()

                if (!!x.name) {

                    setName(x.name);
                    setType(x.type);
                    setSubType(x.subType);
                    setNotifyUsersAboutDeletingInvitations(x.notifyUsersAboutDeletingInvitations);
                    setDate(x.date);
                    setZipcode(x.zipcode);
                    setAddress(x.address);
                    setNumberAdress(x.number);
                    setNeighborhood(x.neighborhood);
                    setCity(x.city)
                    setUf(x.uf)

                    getPassTypes(jwt, eventId)
                }

            } catch (error) {

                return ""
            }
        } else {

        }
    }

    async function getPassTypes(jwt, id) {
        let y = jwt
        let z = id;
        let x;

        if (!!y && !!z) {
            try {

                x = await (await fetch(`${KONG_URL}/companys/tycketsType/${z}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': y
                    }
                })).json()

                if (!x.message) {

                    setPassType(x)
                }
            } catch (error) {
                console.log("erro")
                return ""
            }
        } else {
            console.log("else")
        }
    }

    function toEditEvent(e) {
        e.preventDefault();
        e.stopPropagation();

        let eventId = !!eventEdit ? eventEdit : localStorage.getItem("event_edit");

        setEventEdit(eventId)
        localStorage.setItem("event_edit", eventId)

        router.push('/cliente/eventos/edit')
    }

    async function deleteEvent() {
        let deleteId = !!eventEdit ? eventEdit : localStorage.getItem("event_edit");
        let jwt = !!user?.jwt ? user.jwt : localStorage.getItem("user_jwt")
        let x;

        if (!!jwt && !!deleteId) {

            try {
                x = await (await fetch(`${KONG_URL}/companys/events/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': jwt
                    },
                    body: JSON.stringify({
                        id: deleteId,
                        situation: 2
                    })
                })).json()

                if (!x?.message) {
                    setDeleteModalIsOpen(false)
                    toast.success("Evento Deletado.", {
                        position: "top-right"
                    });
                    router.push('/cliente/eventos/')
                } else {
                    toast.error("Erro ao Deletar, tente novamente.", {
                        position: "top-right"
                    });
                }


            } catch (error) {
                toast.error("Erro ao Cadastrar, tente novamente.", {
                    position: "top-right"
                });
                setisLoading(false)
                return ""
            }
        }
    }

    function openDeleteModal(e) {
        e.preventDefault();
        setDeleteModalIsOpen(true)
    }

    function closeDeleteModal() {
        setDeleteModalIsOpen(false)
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
        getEvent();
    }, [])


    return (
        <div className="clienteMain flexr">
            <ToastContainer></ToastContainer>
            {deleteModalIsOpen == true && <DeletModal close={() => closeDeleteModal()} func={() => deleteEvent()} word="confirmar" ></DeletModal>}
            <div className="clienteContent flexc">
                <div className="adminUsersHeader flexr">
                    <div className="adminUsersTitle flexr">
                        <h1>{!!name && name}</h1>
                    </div>
                    <div className="adminUsersAdd flexr" style={{ gap: "10px", width: "auto" }}>
                        <button
                            onClick={(e) => toEditEvent(e,)}
                            className="btnBlue"><EditIcon></EditIcon></button>
                        <button
                            onClick={(e) => openDeleteModal(e)}
                            className="btnOrange"><DeleteIcon></DeleteIcon></button>
                    </div>
                </div>
                <Separator color={"var(--grey-ligth)"} width="100%" height="1px"></Separator>
                <div className="clienteUl clienteUlChange flexr" style={{ margin: "0px" }}>
                    <div className="clienteTitleDiv flexr">
                        {!!name &&
                            <div className="clienteEventDiv flexc">
                                <div className="clienteEventLineItem flexr">
                                    <h4>Nome: </h4><h4><span>{name || "-"}</span></h4>
                                </div>
                                <div className="clienteEventLineItem flexr">
                                    <h4>Tipo: </h4><h4><span>{type || "-"}</span></h4>
                                </div>
                                <div className="clienteEventLineItem flexr">
                                    <h4>Subtipo: </h4><h4><span>{subType || "-"}</span></h4>
                                </div>
                                <div className="clienteEventLineItem flexr">
                                    <h4>Data: </h4><h4><span>{formatDateToInput(date) || "-"}</span></h4>
                                </div>
                                <div className="clienteEventLineItem flexr">
                                    <h4>CEP: </h4><h4><span>{zipcode || "-"}</span></h4>
                                </div>
                                <div className="clienteEventLineItem flexr">
                                    <h4>Endereço: </h4><h4><span>{address}, {numberAdress} - {neighborhood}, {city}/{uf}</span></h4>
                                </div>
                                <div className="clienteEventLineItem flexr">
                                    <h4>Tipos de Ingresso: </h4><h4><span>{!!passType && passType.map((e, y) => {
                                        if (y != 0) {
                                            return (`, ${e.description}`)
                                        } else {
                                            return e.description
                                        }
                                    })}</span></h4>
                                </div>
                            </div>
                        }
                    </div>
                    {/* {!!name &&
                        <div className="clienteTitleDiv flexr" style={{ justifyContent: "flex-start" }}>
                            <img src="/images/logo-gazz-azul-preto.png"></img>
                        </div>
                    } */}
                </div>
                {!!name &&
                    <Separator color={"var(--grey-ligth)"} width="100%" height="1px"></Separator>
                }
                {!!name &&
                    <div className="clienteEventDiv flexc" style={{ padding: "20px 40px", height: "100%", justifyContent: "flex-start" }}>
                        {/* <div className="clienteEventLineItem flexr">
                            <h4>Tipos de Ingresso: </h4><h4><span>{!!passType && passType.map((e, y) => {
                                if (y != 0) {
                                    return (`, ${e.description}`)
                                } else {
                                    return e.description
                                }
                            })}</span></h4>
                        </div> */}
                        {/* <div className="clienteEventLineItem flexr" style={{ gap: "50px", flexWrap: "wrap" }}>
                            {!!passType && passType.map((e, y) => {
                                let image;
                                if (y % 2 == 0) {
                                    image = "/images/convite1.png"
                                } else {
                                    image = "/images/convite2.png"
                                }
                                return (
                                    <img key={y} src={image}></img>
                                )
                            })}
                        </div> */}
                    </div>
                }
            </div>
        </div>
    );
}
