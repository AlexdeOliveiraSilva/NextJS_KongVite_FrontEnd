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

export default function TurmaView() {
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

    const [turmaData, setTurmaData] = useState();


    async function getTurma() {
        let jwt = !!user?.jwt ? user.jwt : localStorage.getItem("user_jwt")
        let turmaId = !!eventEdit ? eventEdit : localStorage.getItem("event_edit");
        let x;

        if (!!jwt && !!turmaId) {
            setIsLoading(true);
            try {
                x = await (await fetch(`${KONG_URL}/companys/turma/get/${turmaId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': jwt
                    }
                })).json()
                if (!x?.message) {

                    setTurmaData(x);

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

                    setAddTurmasIsOpen(false);
                    getTurmas();
                    setIsLoading(false);
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
        setDeleteIdSelected(id);
        setDeleteModalIsOpen(true);
    }

    function closeDeleteModal() {
        setDeleteModalIsOpen(false);
    }

    function toEditTurma(e, id, name) {
        e.preventDefault();
        setTurmaEdit(id);
        setTurmaNameEdit(name)
        setAddTurmasIsOpen(true)
    }

    useEffect(() => {
        getTurma()
    }, [])


    return (
        <div className="clienteMain flexr">
            <ToastContainer></ToastContainer>
            {deleteModalIsOpen == true && <DeletModal close={() => closeDeleteModal()} func={() => deleteTurma()} word="confirmar" ></DeletModal>}
            <div className="clienteContent flexc">
                <div className="adminUsersHeader flexr">
                    <div className="adminUsersTitle flexr">
                        <h1>{!!turmaData ? `${turmaData?.name} - Usuários` : "Usuários da Turma"}</h1>
                    </div>
                    <div className="adminUsersAdd flexr" style={{ gap: "10px", width: "auto" }}>
                        <button
                            onClick={(e) => toOpenTurma(e)}
                            className="btnOrange">xxxxx</button>
                    </div>
                </div>
                <Separator color={"var(--grey-ligth)"} width="100%" height="1px"></Separator>
                <div className="clienteUl flexc">

                </div>
            </div>
        </div>
    );
}
