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
import AddTurmas from "@/components/Modal/addTurma";

// GET { { URL_KONGVITE } } companys / turma / get / 1

export default function Turmas() {
    const router = useRouter();
    const { KONG_URL, user, eventEdit } = useContext(GlobalContext);
    const [addTurmasIsOpen, setAddTurmasIsOpen] = useState(false);
    const [turma, setTurma] = useState();
    const [event, setEvent] = useState();
    const [isLoading, setIsLoading] = useState();
    const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
    const [deleteIdSelected, setDeleteIdSelected] = useState();
    const [turmaEdit, setTurmaEdit] = useState();
    const [turmaNameEdit, setTurmaNameEdit] = useState();

    function toOpenTurma(e) {
        e.preventDefault();
        setAddTurmasIsOpen(true);
    }

    function toCloseTurma() {
        setAddTurmasIsOpen(false);
        setTurmaEdit();
        getTurmas();
    }

    async function getTurmas() {
        let jwt = !!user?.jwt ? user.jwt : localStorage.getItem("user_jwt")
        let eventId = !!eventEdit ? eventEdit : localStorage.getItem("event_edit");
        let x;

        if (!!jwt && !!eventId) {
            setIsLoading(true);
            try {
                x = await (await fetch(`${KONG_URL}/companys/events/get/${eventId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': jwt
                    }
                })).json()
                if (!x?.message) {
                    setEvent(x)
                    setTurma(x.eventsClasses);
                    setIsLoading(false);
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

    async function deleteTurma() {
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
                        id: deleteIdSelected,
                        situation: 2
                    })
                })).json()

                if (!x?.message) {
                    toast.success("Turma deletada com sucesso.", {
                        position: "top-right"
                    });

                    getTurmas();
                    setIsLoading(false);
                    setDeleteModalIsOpen(false);
                }
            } catch (error) {
                toast.error("Erro ao deletar turma.", {
                    position: "top-right"
                });
                setIsLoading(false);
                console.log("erro")
                return ""
            }
        } else {
            toast.error("Erro ao deletar turma.", {
                position: "top-right"
            });
            console.log("else")
        }
    }

    function openDeleteModal(e, id) {
        e.preventDefault();
        e.stopPropagation();
        setDeleteIdSelected(id);
        setDeleteModalIsOpen(true);
    }

    function closeDeleteModal() {
        setDeleteModalIsOpen(false);
    }

    function toEditTurma(e, id, name) {
        e.preventDefault();
        e.stopPropagation();
        setTurmaEdit(id);
        setTurmaNameEdit(name)
        setAddTurmasIsOpen(true)
    }

    function goView(e, id) {
        e.preventDefault();
        setTurmaEdit(id)
        localStorage.setItem('turma_edit', id)

        router.push('/cliente/turmas/turma-view')
    }

    useEffect(() => {
        getTurmas()
    }, [])


    return (
        <div className="clienteMain flexr">
            <ToastContainer></ToastContainer>
            {!!addTurmasIsOpen ? <AddTurmas close={() => toCloseTurma()} turmaId={turmaEdit} name={turmaNameEdit}></AddTurmas> : ""}
            {deleteModalIsOpen == true && <DeletModal close={() => closeDeleteModal()} func={() => deleteTurma()} word="confirmar" ></DeletModal>}
            <div className="clienteContent flexc">
                <div className="adminUsersHeader flexr">
                    <div className="adminUsersTitle flexr">
                        <h1>{!!event ? `Turmas de - ${event.name}` : "Turmas"}</h1>
                    </div>
                    <div className="adminUsersAdd flexr" style={{ gap: "10px", width: "auto" }}>
                        <button
                            onClick={(e) => toOpenTurma(e)}
                            className="btnOrange">Adicionar Turma</button>
                    </div>
                </div>
                <Separator color={"var(--grey-ligth)"} width="100%" height="1px"></Separator>
                <div className="clienteUl flexc">
                    <div className="clienteTitle flexr">
                        <p className="clienteIdLi">Id</p>
                        <Separator color={"var(--grey-ligth)"} width="1px" height="100%"></Separator>
                        <p className="eventNameLi">Nome da Turma</p>
                    </div>
                    <div className="clienteUl flexc" style={{ marginTop: "10px" }}>
                        {turma?.length > 0 ? turma.map((e, y) => {
                            return (
                                <div
                                    onClick={(event) => goView(event, e.id)}
                                    key={y} className="clienteLine flexr">
                                    <p className="clienteIdLi">{e.id}</p>
                                    <Separator color={"var(--grey-ligth)"} width="1px" height="100%"></Separator>
                                    <p className="eventNameLi">{e.name}</p>
                                    <div className="userConfigbtns flexr">
                                        <div
                                            onClick={(event) => toEditTurma(event, e.id, e.name)}
                                            className="userConfigbtn flexr"><EditIcon className="userConfigIcon"></EditIcon></div>
                                        <div
                                            onClick={(event) => openDeleteModal(event, e.id)}
                                            className="userConfigbtn flexr">
                                            <DeleteIcon className="userConfigIcon"></DeleteIcon>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                            :
                            <p style={{ marginTop: "30px" }}>Nenhuma Turma Encontrada</p>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}
