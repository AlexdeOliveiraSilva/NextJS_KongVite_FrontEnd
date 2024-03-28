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
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import Loader from "@/components/fragments/loader";

export default function TurmaView() {
    const router = useRouter();
    const { KONG_URL, user, eventEdit, setGuestEditId, setGuestEditName } = useContext(GlobalContext);
    const [addTurmasIsOpen, setAddTurmasIsOpen] = useState(false);
    const [event, setEvent] = useState();
    const [isLoading, setIsLoading] = useState();
    const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
    const [deleteIdSelected, setDeleteIdSelected] = useState();
    const [turmaEdit, setTurmaEdit] = useState();
    const [turmaNameEdit, setTurmaNameEdit] = useState();
    const [otherGuestIsOpen, setOtherGuestIsOpen] = useState();
    const [search, setSearch] = useState("")
    const [turmaData, setTurmaData] = useState();
    const [turmaGuest, setTurmaGuest] = useState();
    const [turmaGuestCopy, setTurmaGuestCopy] = useState();
    const [isFetching, setisFetching] = useState(false);


    async function getTurma() {
        let jwt = !!user?.jwt ? user.jwt : localStorage.getItem("user_jwt")
        let turmaId = !!turmaEdit ? turmaEdit : localStorage.getItem("turma_edit");
        let x;

        if (!!jwt && !!turmaId) {
            setIsLoading(true);
            setisFetching(true);
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
                    setTurmaGuest(x.guests);
                    setTurmaGuestCopy(x.guests);
                    setIsLoading(false);
                    setisFetching(false);
                    return ""
                }
            } catch (error) {
                setIsLoading(false);
                setisFetching(false);
                return ""
            }
        } else {
            console.log("else")
            setisFetching(false);
        }
    }

    async function deleteGuest() {

        let jwt = !!user?.jwt ? user.jwt : localStorage.getItem("user_jwt")
        let event = !!eventEdit ? eventEdit : localStorage.getItem("event_edit")
        let turma = !!turmaEdit ? turmaEdit : localStorage.getItem("turma_edit")

        let x;

        if (!!jwt && !!event && !!turma && !!deleteIdSelected) {
            setIsLoading(true)
            try {
                x = await (await fetch(`${KONG_URL}/companys/turma/student/${event}/${turma}`, {
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
                    toast.success("Convidado deletado.", {
                        position: "top-right"
                    });

                    getTurma();
                    setDeleteModalIsOpen(false)
                    setIsLoading(false)

                    router.push('/cliente/turmas/turma-view/');
                } else {
                    toast.error("Erro ao Deletar, tente novamente.", {
                        position: "top-right"
                    });
                    setIsLoading(false)
                }


            } catch (error) {
                toast.error("Erro ao Deletar, tente novamente.", {
                    position: "top-right"
                });
                setIsLoading(false)
                return ""
            }
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

    function toEditGuest(e, id, name) {
        e.preventDefault();

        setGuestEditId(id);
        localStorage.setItem("guest_edit_id", id)

        router.push('/cliente/turmas/turma-view/edit/')
    }

    function toAddGuest(e) {
        e.preventDefault();

        router.push('/cliente/turmas/turma-view/add/')
    }

    useEffect(() => {
        getTurma()
    }, [])

    function onSearch() {

        let y = turmaGuestCopy?.filter((e) => e.name.toLowerCase().includes(search.toLowerCase()))

        setTurmaGuest(y)
    }


    useEffect(() => {
        onSearch();
    }, [search])


    return (
        <div className="clienteMain flexr">
            <ToastContainer></ToastContainer>
            {deleteModalIsOpen == true && <DeletModal close={() => closeDeleteModal()} func={() => deleteGuest()} word="confirmar" ></DeletModal>}
            <div className="clienteContent flexc">
                <div className="adminUsersHeader flexr">
                    <div className="adminUsersTitle flexr" style={{ gap: "30px" }}>
                        <h1>{!!turmaData ? `${turmaData?.name} - Formandos` : "Formandos da Turma"}</h1>
                        <div className=" flexr" style={{ gap: "30px" }}>
                            <Paper
                                className=" paperSize"
                                component="form"
                                sx={{ p: '2px 4px', display: 'flex', alignItems: 'center' }}
                            >
                                <InputBase
                                    sx={{ ml: 1, flex: 1 }}
                                    placeholder="Buscar Empresa..."
                                    inputProps={{ 'aria-label': 'buscar empresa...' }}
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                                <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                                <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
                                    <SearchIcon />
                                </IconButton>

                            </Paper>
                        </div>
                    </div>
                    <div className="adminUsersAdd flexr" style={{ gap: "10px", width: "auto" }}>
                        <button
                            onClick={(e) => toAddGuest(e)}
                            className="btnOrange">Add Formando</button>
                    </div>
                </div>
                <div className="userLineTitle flexr">
                    <p className="userNameLi">Nome</p>
                    <Separator color={"var(--grey-ligth)"} width="1px" height="100%"></Separator>
                    <p className="userPhoneLi">Telefone</p>
                    <Separator color={"var(--grey-ligth)"} width="1px" height="100%"></Separator>
                    <p className="guestLi">Ingresso</p>
                    <Separator color={"var(--grey-ligth)"} width="1px" height="100%"></Separator>
                    <p className="guestLi">Convidados</p>
                </div>
                <div className="clienteUl flexc" style={{ marginTop: "10px" }}>
                    {isFetching == true
                        ?
                        <Loader></Loader>
                        :

                        !!turmaGuest && turmaGuest?.length > 0 ? turmaGuest.map((e, y) => {

                            // *** RECEBER AVAIBLE AQUI
                            return (
                                <>
                                    <div key={y}
                                        style={{ cursor: "pointer" }}
                                        onClick={(event) => {
                                            event.preventDefault();
                                            if (otherGuestIsOpen != e.id) {
                                                setOtherGuestIsOpen(e.id);
                                            } else {
                                                setOtherGuestIsOpen();
                                            }

                                        }}
                                        className="clienteLine flexr">
                                        <p className="userNameLi">{e.name}</p>
                                        <Separator color={"var(--grey-ligth)"} width="1px" height="100%"></Separator>
                                        <p className="userPhoneLi">{e.phone}</p>
                                        <Separator color={"var(--grey-ligth)"} width="1px" height="100%"></Separator>
                                        <p className="guestLi">{e.tycketsType?.description}</p>
                                        <Separator color={"var(--grey-ligth)"} width="1px" height="100%"></Separator>
                                        <p className="guestLi">{e.other_guests?.length}</p>
                                        <div className="userConfigbtns flexr">
                                            <div
                                                onClick={(event) => toEditGuest(event, e.id, e.name)}
                                                className="userConfigbtn flexr"><EditIcon className="userConfigIcon"></EditIcon></div>
                                            <div
                                                onClick={(event) => openDeleteModal(event, e.id)}
                                                className="userConfigbtn flexr">
                                                <DeleteIcon className="userConfigIcon"></DeleteIcon>
                                            </div>
                                        </div>
                                    </div>

                                    {otherGuestIsOpen == e.id && (
                                        e.other_guests?.length > 0
                                            ?
                                            e.other_guests?.map((e, y) => {
                                                return (
                                                    <div key={y} style={{ width: "100%" }}>
                                                        <div className="flexr" style={{ width: "100%", justifyContent: "flex-end" }}>
                                                            <div className="otherGuestLine flexr">
                                                                <p>Convidado <span>{y + 1 < 10 ? `0${y + 1}` : y + 1}</span></p>
                                                                <p>Nome: <span>{!!e.name ? e.name : "Não preencheu"}</span></p>
                                                                <p>Ingresso: <span>{!!e.tycketsType?.description ? e.tycketsType?.description : "Não preencheu"}</span></p>
                                                            </div>
                                                        </div >
                                                        <div className="flexr" style={{ width: "100%", justifyContent: "flex-end" }}>
                                                        </div>
                                                        {y == e.other_guests?.length &&
                                                            <Separator color={"var(--grey-ligth)"} width="100%" height="1px"></Separator>
                                                        }
                                                    </div>
                                                )
                                            })
                                            :

                                            <div style={{ width: "100%", fontSize: " 14px", marginTop: "10px", marginBottom: "10px" }} className="flexr">
                                                Nenhum convidado adicionado...
                                            </div>
                                    )}
                                </>
                            )
                        })
                            :
                            <p style={{ marginTop: "30px" }}>Nenhum Convidado</p>
                    }
                </div>
            </div>
        </div >
    );
}