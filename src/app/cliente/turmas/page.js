'use client'

import { useState, useEffect, useContext } from "react"
import { GlobalContext } from "@/context/global";
import { useRouter } from "next/navigation";
import { FaRegStar } from "react-icons/fa";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DeletModal from "@/components/Modal/deletModal";
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import AddTurmas from "@/components/Modal/addTurma";
import Loader from "@/components/fragments/loader";
import { IoCalendarClearOutline } from "react-icons/io5";
import { LuMapPin } from "react-icons/lu";
import { TiPlus } from "react-icons/ti";
import Separator from "@/components/fragments/separatorLine";
import * as XLSX from 'xlsx';
import { FaLongArrowAltRight } from "react-icons/fa";
import SendInviteModal from "@/components/Modal/sendInvites";
import TransferHistoric from "@/components/Modal/transferHistoric";
import InvitesAddModal from "@/components/Modal/invitesAddForClient";
import UploadGuestModal from "@/components/Modal/uploadGuest";
import { Tooltip } from "@mui/material";
import ReplyIcon from '@mui/icons-material/Reply';
import TransformIcon from '@mui/icons-material/Transform';
import AddIcon from '@mui/icons-material/Add';
import moment from "moment"

export default function Turmas() {
    const router = useRouter();
    const { KONG_URL, user, eventEdit, setGuestEditId } = useContext(GlobalContext);
    const [addTurmasIsOpen, setAddTurmasIsOpen] = useState(false);
    const [turma, setTurma] = useState();
    const [turmaCopy, setTurmaCopy] = useState();
    const [event, setEvent] = useState();
    const [isLoading, setIsLoading] = useState();
    const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
    const [deleteIdSelected, setDeleteIdSelected] = useState();
    const [turmaEdit, setTurmaEdit] = useState();
    const [turmaNameEdit, setTurmaNameEdit] = useState();
    const [isFetching, setisFetching] = useState(false);
    const [oppenedGuest, setOppenedGuest] = useState();
    const [eventName, setEventName] = useState();
    const [eventPlace, setEventPlace] = useState();
    const [date, setDate] = useState("");
    const [hour, setHour] = useState("");
    const [alreadyPassType, setAlreadyPassType] = useState([]),
        [data, setData] = useState(),
        [dataCopy, setDataCopy] = useState();
    const [tabStep, setTabStep] = useState(1);
    const [pageStep, setPageStep] = useState(1);
    const [namefilter, setNameFilter] = useState("");

    const [deleteIdGuestSelected, setDeleteIdGuestSelected] = useState();
    const [deleteGuestModalIsOpen, setDeleteGuestModalIsOpen] = useState(false);
    const [transferModalIsOpen, setTransferModalIsOpen] = useState(false);
    const [addInvitesModalIsOpen, setAddInvitesModalIsOpen] = useState(false);
    const [uploadModalIsOpen, setUploadModalIsOpen] = useState(false);
    const [sendModalIsOpen, setSendModalIsOpen] = useState(false);
    const [otherGuestIsOpen, setOtherGuestIsOpen] = useState();
    const [search, setSearch] = useState("");
    const [turmaData, setTurmaData] = useState();
    const [turmaGuest, setTurmaGuest] = useState();
    const [guestfilter, setGuestFilter] = useState("");
    const [turmaGuestCopy, setTurmaGuestCopy] = useState();
    const [transferHistoricId, setTranferHistoricId] = useState();
    const [addUser, setAddUser] = useState(false)
    const [nameUser, setNameUser] = useState("")
    const [passwordUser, setPasswordUser] = useState("")
    const [idUser, setIdUser] = useState(null)

    const [usersEvent, setUsersEvent] = useState([])

    function toOpenTurma(e) {
        e.preventDefault();
        setAddTurmasIsOpen(true);
    }

    function toCloseTurma() {
        setAddTurmasIsOpen(false);
        setTurmaEdit();
        getTurmas();
        if (!!window) {
            window.location.reload()
        }
    }

    async function getTurmas() {
        let jwt = !!user?.jwt ? user.jwt : localStorage.getItem("user_jwt")
        let eventId = !!eventEdit ? eventEdit : localStorage.getItem("event_edit");
        let x;

        if (!!jwt && !!eventId) {
            setIsLoading(true);
            setisFetching(true);
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
                    setTurmaCopy(x.eventsClasses);
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

    async function getPassTypes() {
        let jwt = !!user?.jwt ? user?.jwt : localStorage.getItem("user_jwt")
        let eventId = !!event?.id ? event?.id : localStorage.getItem("event_edit");
        let x;

        if (!!jwt && !!eventId) {
            try {

                x = await (await fetch(`${KONG_URL}/companys/tycketsType/${eventId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': jwt
                    }
                })).json()

                if (!x.message) {

                    setAlreadyPassType(x)
                }
            } catch (error) {
                console.log("erro")
                return ""
            }
        } else {
            console.log("else")
        }
    }

    async function getUserTurmas() {
        setIsLoading(true)
        let jwt = !!user?.jwt ? user.jwt : localStorage.getItem("user_jwt");
        let eventId = !!eventEdit ? eventEdit : localStorage.getItem("event_edit");

        setUsersEvent(await (await fetch(`${KONG_URL}/companys/userTurmas/${eventId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': jwt
            }
        })).json())
        setIsLoading(false)

    }
    async function saveNewUser() {
        let jwt = !!user?.jwt ? user.jwt : localStorage.getItem("user_jwt");
        let eventId = !!eventEdit ? eventEdit : localStorage.getItem("event_edit");
        setIsLoading(true)
        let body = {
            id: idUser ? idUser : undefined,
            name: nameUser,
            email: nameUser,
            password: passwordUser ? passwordUser : undefined
        }
        let res = await fetch(`${KONG_URL}/companys/userTurmas/${eventId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': jwt
            },
            body: JSON.stringify(body)
        })

        if (res.status !== 200) {
            let x = await res.json()
            toast.error(`${x?.message}`, {
                position: "top-right"
            });
        } else {
            toast.success("Usuário deletado com sucesso.", {
                position: "top-right"
            });
            setIdUser(null)
            setNameUser(null)
            setPasswordUser(null)
            setAddUser(false)
        }

        setIsLoading(false)
        getUserTurmas()
    }

    async function deleteUser() {
        let jwt = !!user?.jwt ? user.jwt : localStorage.getItem("user_jwt");
        let eventId = !!eventEdit ? eventEdit : localStorage.getItem("event_edit");
        setIsLoading(true)
        let res = await fetch(`${KONG_URL}/companys/userTurmas/${eventId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': jwt
            },
            body: JSON.stringify({ situation: 2, id: idUser })
        })

        if (res.status !== 200) {
            let x = await res.json()
            toast.error(`${x?.message}`, {
                position: "top-right"
            });
        } else {
            toast.success("Usuário deletado com sucesso.", {
                position: "top-right"
            });
            setIdUser(null)
            setNameUser(null)
            setPasswordUser(null)
            setAddUser(false)
        }

        setIsLoading(false)
        getUserTurmas()
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
        setTabStep(2)
        setPageStep(2)
    }
    function backView(e) {
        e.preventDefault();


        setPageStep(1)
    }

    function formatDateFull(dataString) {
        const data = new Date(dataString);

        const ano = data.getFullYear();
        const mes = String(data.getMonth() + 1).padStart(2, '0');
        const dia = String(data.getDate()).padStart(2, '0');
        const horas = String(data.getHours()).padStart(2, '0');
        const minutos = String(data.getMinutes()).padStart(2, '0');

        return `${dia}-${mes}-${ano}-${horas}-${minutos}`;
    }

    function formatDateToInput(dataString) {
        const data = new Date(dataString);

        const ano = data.getFullYear();
        const mes = String(data.getMonth() + 1).padStart(2, '0');
        const dia = String(data.getDate()).padStart(2, '0');
        const horas = String(data.getHours()).padStart(2, '0');
        const minutos = String(data.getMinutes()).padStart(2, '0');

        return `${dia}/${mes}/${ano}`;
    }

    function formatHourToInput(dataString) {
        return moment(dataString).utc().format("HH:mm")
    }
    const colors = [
        '#0B192E',
        '#2E64AD',
        '#18A87C',
        '#00E1E2'
    ];

    async function getEventDashData() {
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
                    setDataCopy(x.turmas)
                }

            } catch (error) {

                return ""
            }
        } else {

        }
    }



    const jsonToExcel = async () => {
        setIsLoading(true)
        let eventId = !!eventEdit ? eventEdit : localStorage.getItem("event_edit");
        let jwt = !!user?.jwt ? user.jwt : localStorage.getItem("user_jwt")
        let x = await (await fetch(`${KONG_URL}/companys/events/export/${eventId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': jwt
            }
        })).json()
        let fileName = new Date().toString();
        const worksheet = XLSX.utils.json_to_sheet(x);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

        const data = new Blob([excelBuffer], { type: 'application/octet-stream' });

        const url = window.URL.createObjectURL(data);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `data-import-${formatDateFull(fileName)}.xlsx`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setTimeout(() => {
            toast.success('Dados Baixados com sucesso!')
            setIsLoading(false)
        }, 2000)
    };


    useEffect(() => {
        getTurmas()
        getEventDashData()
    }, [])

    useEffect(() => {
        if (!!event) {
            getPassTypes()
        }
    }, [event])

    useEffect(() => {

        if (namefilter && namefilter.length > 0) {

            const filteredData = dataCopy.filter((e) => e.name.toLowerCase().includes(namefilter.toLowerCase()));
            const filteredTurma = turmaCopy.filter((e) => e.name.toLowerCase().includes(namefilter.toLowerCase()));

            setData(filteredData);
            setTurma(filteredTurma);
        } else {
            setData(dataCopy);
            setTurma(turmaCopy);
        }

    }, [namefilter])


    // ******************** TURMAS GUEST FUNC

    async function deleteGuest() {

        let jwt = !!user?.jwt ? user.jwt : localStorage.getItem("user_jwt")
        let event = !!eventEdit ? eventEdit : localStorage.getItem("event_edit")
        let turma = !!turmaEdit ? turmaEdit : localStorage.getItem("turma_edit")

        let x;

        if (!!jwt && !!event && !!turma && !!deleteIdGuestSelected) {
            setIsLoading(true)
            try {
                x = await (await fetch(`${KONG_URL}/companys/turma/student/${event}/${turma}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': jwt
                    },
                    body: JSON.stringify({
                        id: deleteIdGuestSelected,
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

                    if (!!window) {
                        window.location.reload()
                    }
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
    function openSendModal(e) {
        e.preventDefault();
        setSendModalIsOpen(true);
    }

    function closeSendModal() {
        setSendModalIsOpen(false);
    }
    function openUploadModal(e) {
        e.preventDefault();
        setUploadModalIsOpen(true);
    }

    function closeUploadModal() {
        setUploadModalIsOpen(false);
        window.location.reload()
    }

    function openTransferModal(e, id) {
        e.preventDefault();
        setTranferHistoricId(+id)
        setTransferModalIsOpen(true);
    }

    function closeTransferModal() {
        setTransferModalIsOpen(false);
    }

    function openInvitesAdddModal(e) {
        e.preventDefault();
        setAddInvitesModalIsOpen(true);
    }

    function openDeleteGuestModal(e, id) {
        e.preventDefault();
        setDeleteIdGuestSelected(id);
        setDeleteGuestModalIsOpen(true);
    }

    function closeDeleteGuestModal() {
        setDeleteGuestModalIsOpen(false);
    }

    useEffect(() => {
        getTurma()
    }, [turmaEdit])

    useEffect(() => {

        if (guestfilter && guestfilter.length > 0) {

            const filteredData = turmaGuestCopy.filter((e) => e.name.toLowerCase().includes(guestfilter.toLowerCase()));

            setTurmaGuest(filteredData);
        } else {
            setTurmaGuest(turmaGuestCopy);
        }

    }, [guestfilter])

    return (
        <div className="clientEventMain flexc">
            <ToastContainer></ToastContainer>
            {!!addTurmasIsOpen ? <AddTurmas close={() => toCloseTurma()} turmaId={turmaEdit} name={turmaNameEdit}></AddTurmas> : ""}
            {deleteModalIsOpen == true && <DeletModal close={() => closeDeleteModal()} func={() => deleteTurma()} word="confirmar" ></DeletModal>}

            {addInvitesModalIsOpen == true && <InvitesAddModal close={() => setAddInvitesModalIsOpen()} id={1}></InvitesAddModal>}
            {transferModalIsOpen == true && <TransferHistoric close={() => closeTransferModal()} id={transferHistoricId}></TransferHistoric>}
            {sendModalIsOpen == true && <SendInviteModal close={() => closeSendModal()} isAdd={false}></SendInviteModal>}
            {uploadModalIsOpen == true && <UploadGuestModal close={() => closeUploadModal()}></UploadGuestModal>}
            {deleteGuestModalIsOpen == true && <DeletModal close={() => closeDeleteGuestModal()} func={() => deleteGuest()} word="confirmar" ></DeletModal>}
            <div className="margin5percent" style={{ position: 'relative' }}>
                <div className="newTopSitemap flexr">
                    <h1 className=" flexr gap-2" style={{ fontWeight: 600, marginRight: 10 }}>
                        <a
                            href="/cliente/eventos/"
                            style={{ cursor: 'pointer' }}>Eventos</a>
                        <FaLongArrowAltRight />
                        <span >Turmas</span></h1>

                </div>
            </div>
            <div className=" clientEventFilters flexr" style={{ position: 'relative', padding: '40px 5% 40px 5% !important' }}>
                {!!event ?
                    <>
                        <div
                            onClick={() => router.push('/cliente/eventos/edit/')}
                            className="iconEventContent flexr" >
                            <div className="iconEvent flexr"><LuMapPin size={40} /></div>
                            <div className="iconEventData flexc">
                                <h6>EVENTO</h6>
                                <h1>{event?.name}</h1>
                                <p>{event?.address}, {event?.number} - {event?.neighborhood}</p>
                                <p>{event?.city}, {event?.uf}</p>
                            </div>
                            <div className="iconEvent flexr"><IoCalendarClearOutline size={40} /></div>
                            <div className="iconEventData flexc">
                                <h6>DATA</h6>
                                <h1>{formatDateToInput(event?.date)}</h1>
                                <p>às {formatHourToInput(event?.date)} horas</p>
                            </div>
                        </div>
                        <div className="ticketsEventContent flexr" style={{ overflowX: 'auto' }}>
                            <p>Tipos de Ingresso: </p>
                            {!!alreadyPassType && alreadyPassType.map((e, y) => {
                                return (
                                    <h6
                                        style={{ backgroundColor: colors[y % colors.length] }}
                                        key={y}>{e.description}</h6>
                                )
                            })}
                        </div>
                    </>
                    :
                    <div style={{ width: '100%' }} className="flexc"><Loader></Loader></div>
                }
            </div>
            {!!turmaCopy && turmaCopy?.length > 0 ?



                // ******************* LISTA TURMAS
                <div className="margin5percent flexc" style={{ paddingTop: '80px', paddingBottom: '80px', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                    <div className="clientEventTabBar flexr">
                        <div
                            onClick={
                                tabStep == 1
                                    ?
                                    pageStep == 2
                                        ?
                                        () => setPageStep(1)
                                        :
                                        () => console.log('')
                                    :
                                    tabStep == 2
                                        ?
                                        pageStep == 2
                                            ?
                                            () => { setPageStep(1), setTabStep(1) }
                                            :
                                            () => setTabStep(1)
                                        :
                                        () => console.log('')
                            }
                            className={tabStep == 1 ? "clientEventTabSelected flexr" : "clientEventTab flexr"}>
                            <p>Dashboard</p>
                        </div>
                        <div
                            onClick={tabStep != 2 && pageStep != 2 ? () => setTabStep(2) : () => console.log()}
                            className={tabStep == 2 ? "clientEventTabSelected flexr" : "clientEventTab flexr"}>
                            <p>Turmas</p>
                        </div>
                        <div
                            onClick={tabStep != 3 && pageStep != 3 ? () => { setTabStep(3); getUserTurmas() } : () => console.log()}
                            className={tabStep == 3 ? "clientEventTabSelected flexr" : "clientEventTab flexr"}>
                            <p>Usuários</p>
                        </div>
                    </div>
                    {pageStep == 1 && tabStep != 3 &&
                        <>
                            <div className="flex flex-row justify-between items-center searchTurmaDiv gap-2" style={{ marginTop: '20px' }}>
                                <div className="flex flex-row justify-start items-center searchTurmaDiv gap-3" >
                                    <p htmlFor="dataInicio" style={{ whiteSpace: 'nowrap' }}>Buscar Turma: </p>
                                    <input
                                        onChange={(e) => setNameFilter(e.target.value)}
                                        value={namefilter}
                                        style={{ maxHeight: '30px' }}
                                        type="text" id="nomeTurma"
                                        className="inputClientEventStyleName px-2"

                                    />
                                </div>
                                {!!turmaCopy && turmaCopy?.length > 0 &&
                                    <button
                                        onClick={(e) => toOpenTurma(e)}
                                        style={{ maxHeight: '30px', whiteSpace: 'nowrap', fontSize: '13px', width: 'auto' }}
                                        className="btnBlueThird flexr newEventBtn gap-4">CRIAR TURMA
                                    </button>
                                }
                                {!!data &&
                                    <button
                                        onClick={() => jsonToExcel()}
                                        disabled={isLoading}
                                        style={{ maxHeight: '30px', whiteSpace: 'nowrap', border: 'none', fontSize: '13px', width: '120px' }}
                                        className="TurmaDashButton btnBlue">
                                        {!!isLoading ? <Loader></Loader> : 'BAIXAR'}
                                    </button>
                                }
                            </div>
                            {tabStep == 1 ?
                                <div className="TurmaDash" style={{ marginTop: '20px' }}>

                                    {!!data && data?.map((e, y) => {
                                        return (
                                            <div
                                                style={{ cursor: 'pointer' }}
                                                onClick={(event) => goView(event, e.id)}
                                                key={y} className="TurmaCard flexc">
                                                <h1>{!!e.name && e.name}</h1>
                                                <div className="clientListDashMain flexc">
                                                    <div className="clientListDash flexr">
                                                        <h2 className="clientedashBigLi">Tipo da entrada</h2>
                                                        <h2 className="clientedashLitLi">Ausentes</h2>
                                                        <h2 className="clientedashLitLi">Presentes</h2>
                                                        <h2 className="clientedashLitLi">Total</h2>
                                                    </div>
                                                    <Separator color={"#BEBEBE"} width="100%" height="1px"></Separator>
                                                    <div className="clientListOver flexc">
                                                        {e.types?.map((x, z) => {

                                                            return (
                                                                <>
                                                                    <div className="clientListDash flexr">
                                                                        <h2 className="clientedashBigLi"
                                                                            style={{
                                                                                backgroundColor: colors[z % colors.length],
                                                                                color: '#ffffff',
                                                                                fontWeight: '600'
                                                                            }}>{x.description}</h2>
                                                                        <h2 className="clientedashLitLi">{x.ausente}</h2>
                                                                        <h2 className="clientedashLitLi">{x.presente}</h2>
                                                                        <h2 className="clientedashLitLi">{x.total}</h2>
                                                                    </div>
                                                                    <Separator color={"#BEBEBE"} width="100%" height="1px"></Separator>

                                                                </>
                                                            )
                                                        }
                                                        )
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}

                                </div>
                                : tabStep == 2 &&
                                <div className="TurmaList flexc gap-4" style={{ justifyContent: 'center', alignItems: 'flex-start', marginTop: '60px' }}>

                                    <div className="clientListTitle flexr">
                                        <h2 className="eventNameLi">Nome da Turma</h2>
                                        <h2 className="clienteTypeLi" style={{ textAlign: 'start' }}>Formandos</h2>
                                    </div>

                                    {isFetching == true
                                        ?
                                        <div style={{ width: '100%' }} className="flexc"><Loader></Loader></div>
                                        :


                                        turma.map((e, y) => {
                                            return (
                                                <div
                                                    onClick={(event) => goView(event, e.id)}
                                                    key={y} className="clienteLine flexr">
                                                    <p className="eventNameLi">{e.name}</p>
                                                    <p className="clienteTypeLi" style={{ textAlign: 'start' }}>{e.totalMainGuests}</p>
                                                    <div className="turmaSpacator"></div>
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
                                    }
                                </div>
                            }
                        </>
                    }
                    {pageStep == 2 &&
                        <>
                            <div className="flex flex-row justify-between items-center searchTurmaDiv gap-2" style={{ marginTop: '20px' }}>
                                <div className="flex flex-row justify-start items-center searchTurmaDiv gap-3" >
                                    <p htmlFor="dataInicio" style={{ whiteSpace: 'nowrap' }}>Buscar Formando: </p>
                                    <input
                                        onChange={(e) => setGuestFilter(e.target.value)}
                                        value={guestfilter}
                                        style={{ maxHeight: '30px' }}
                                        type="text" id="nomeTurma"
                                        className="inputClientEventStyleName px-2"

                                    />
                                </div>
                                {!!turmaCopy && turmaCopy?.length > 0 &&
                                    <button
                                        onClick={(e) => toAddGuest(e)}
                                        style={{ maxHeight: '30px', whiteSpace: 'nowrap', fontSize: '13px', width: 'auto' }}
                                        className="btnBlueThird flexr newEventBtn gap-4">NOVO FORMANDO
                                    </button>
                                }
                                {!!data &&
                                    <button
                                        onClick={(e) => openUploadModal(e)}
                                        disabled={isLoading}
                                        style={{ maxHeight: '30px', whiteSpace: 'nowrap', border: 'none', fontSize: '13px', width: '120px' }}
                                        className="TurmaDashButton btnDisabled">
                                        {!!isLoading ? <Loader></Loader> : 'IMPORTAR'}
                                    </button>
                                }
                            </div>
                            <div className="turmasSitemap flex flex-row justify-start gap-2 items-center my-6">
                                <h6 onClick={(e) => backView(e)}>Turmas</h6>
                                <FaLongArrowAltRight />
                                <p>Editar Turma</p>
                            </div>

                            <div className="TurmaList flexc gap-4" style={{ justifyContent: 'center', alignItems: 'flex-start', marginTop: '20px' }}>

                                <div className="clientListTitle flexr" style={{ overflowX: 'auto', overflowY: 'hidden' }}>
                                    <h2 className="clienteNameLi">Nome</h2>
                                    <h2 className="clientePhoneLi" style={{ textAlign: 'start' }}>Telefone</h2>
                                    {!!turmaGuest && turmaGuest.length > 0 && turmaGuest[0].guestsTicketsTypeNumber?.map((e, y) => {
                                        return (
                                            <h2 key={y} className="clientePhoneLi" style={{ textAlign: 'center' }}>{e.tycketsType?.description}</h2>
                                        )
                                    })}
                                </div>

                                {isFetching == true
                                    ?
                                    <div style={{ width: '100%' }} className="flexc"><Loader></Loader></div>
                                    :


                                    !!turmaGuest && turmaGuest.map((e, y) => {

                                        return (
                                            <>
                                                <div
                                                    style={{ overflowX: 'auto', overflowY: 'hidden', }}
                                                    onClick={() => setOppenedGuest(y == oppenedGuest ? undefined : y)}
                                                    key={y} className="guestLine flex flex-row justify-between items-center"
                                                >
                                                    <div className=' flexr'>
                                                        <p className="clienteNameLi" style={{ fontWeight: 600, color: '#000000' }}>{e.name}</p>
                                                        <p className="clientePhoneLi" style={{ textAlign: 'start' }}>{e.phone}</p>
                                                        {e.guestsTicketsTypeNumber?.map((e, y) => {
                                                            return (
                                                                <p key={y} className="clientePhoneLi" style={{ textAlign: 'center' }}>{e.number}</p>
                                                            )
                                                        })}
                                                    </div>
                                                    <div className="userConfigbtns flexr" style={{ gap: '5px', width: 'auto' }}>
                                                        <Tooltip title="Encaminhar Ingresso por E-mail">
                                                            <div
                                                                onClick={(event) => openSendModal(event)}
                                                                className="userConfigbtn flexr"><ReplyIcon className="userConfigIcon"></ReplyIcon></div>
                                                        </Tooltip>
                                                        <Tooltip title="Adicionar mais Convites">
                                                            <div
                                                                onClick={(event) => openInvitesAdddModal(event)}
                                                                className="userConfigbtn flexr"><AddIcon className="userConfigIcon"></AddIcon></div>
                                                        </Tooltip>
                                                        <Tooltip title="Histórico de Tranferências">
                                                            <div
                                                                onClick={(event) => openTransferModal(event, e.id)}
                                                                className="userConfigbtn flexr"><TransformIcon className="userConfigIcon"></TransformIcon></div>
                                                        </Tooltip>
                                                        <Tooltip title="Editar Formando">
                                                            <div
                                                                onClick={(event) => toEditGuest(event, e.id, e.name)}
                                                                className="userConfigbtn flexr"><EditIcon className="userConfigIcon"></EditIcon>
                                                            </div>
                                                        </Tooltip>
                                                        <Tooltip title="Deletar Formando">
                                                            <div
                                                                onClick={(event) => openDeleteGuestModal(event, e.id)}
                                                                className="userConfigbtn flexr">
                                                                <DeleteIcon className="userConfigIcon"></DeleteIcon>
                                                            </div>
                                                        </Tooltip>
                                                    </div>
                                                </div>
                                                {
                                                    y == oppenedGuest
                                                    &&
                                                    e.other_guests?.length > 0
                                                    &&
                                                    e.other_guests?.map((j, w) => {
                                                        return (
                                                            <div key={w} className="clienteOtherLine flexr gap-5" style={w == e.other_guests?.length - 1 ? { marginBottom: '10px' } : { marginBottom: '0px' }}>
                                                                <h6 className="clienteTypeLi">Convidado <span>{w + 1 < 10 ? `0${w + 1}` : w + 1}</span></h6>
                                                                <h6 className="clienteNameLi">Nome: <span>{!!j.name ? j.name : "Não preencheu"}</span></h6>
                                                                <h6 className="clienteTypeLi">Ingresso: <span>{!!j.tycketsType?.description ? j.tycketsType?.description : "Não preencheu"}</span></h6>
                                                            </div >
                                                        )
                                                    })
                                                }
                                            </>
                                        )
                                    })
                                }
                            </div>
                        </>
                    }

                    {tabStep == 3 &&
                        <div style={{ marginTop: '20px', flexDirection: "column", width: '100%' }}>

                            {addUser && <div style={{ display: "flex", flexDirection: "column", borderStyle: 'solid', borderWidth: 1, borderRadius: 10, padding: 10, }}>
                                <div style={{ display: "flex", flexDirection: "column", marginBottom: 10, }}>
                                    <label>Nome</label>
                                    <input type="text"
                                        style={{ paddingLeft: 6, paddingRight: 6, paddingBottom: 3, paddingTop: 3 }}
                                        value={nameUser}
                                        onChange={(e) => setNameUser(e.target.value)}
                                    />
                                </div>
                                <div style={{ display: "flex", flexDirection: "column" }}>
                                    <label>Senha</label>
                                    <input type="password"
                                        style={{ paddingLeft: 6, paddingRight: 6, paddingBottom: 3, paddingTop: 3 }}
                                        value={passwordUser}
                                        onChange={(e) => setPasswordUser(e.target.value)}
                                    />
                                </div>
                                <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-evenly", marginTop: 10, }}>
                                    {idUser &&
                                        <button
                                            onClick={(e) => { deleteUser() }}
                                            style={{ maxHeight: '30px', whiteSpace: 'nowrap', fontSize: '13px', width: 'auto' }}
                                            className="btnBlue flexr newEventBtn gap-4">Apagar
                                        </button>
                                    }
                                    <button
                                        onClick={(e) => { setIdUser(null); setAddUser(false); setNameUser(""); setPasswordUser("") }}
                                        style={{ maxHeight: '30px', whiteSpace: 'nowrap', fontSize: '13px', width: 'auto' }}
                                        className="btnOrange flexr newEventBtn gap-4">Cancelar
                                    </button>

                                    <button
                                        onClick={(e) => { saveNewUser() }}
                                        style={{ maxHeight: '30px', whiteSpace: 'nowrap', fontSize: '13px', width: 'auto' }}
                                        className="btnBlueThird flexr newEventBtn gap-4">Salvar
                                    </button>
                                </div>
                            </div>
                            }


                            {!addUser && <div style={{ display: "flex", justifyContent: "flex-end", width: '100%' }}>
                                <button
                                    onClick={(e) => { setAddUser(true) }}
                                    style={{ maxHeight: '30px', whiteSpace: 'nowrap', fontSize: '13px', width: 'auto' }}
                                    className="btnBlueThird flexr newEventBtn gap-4">ADICIONAR USUÁRIO
                                </button>
                            </div>}

                            <div className="clientListTitle flexr" style={{ marginTop: 16, flexDirection: "column", alignItems: 'flex-start' }}>
                                <div className="clientListTitle flexr">
                                    {/* <h2 className="eventNameLi">Id</h2> */}
                                    <h2 className="clienteTypeLi" style={{ textAlign: 'start' }}>Usuário</h2>
                                </div>
                                {isLoading && <div style={{ width: '100%' }} className="flexc"><Loader></Loader></div>}
                                {usersEvent.map((e, y) => {
                                    return (
                                        <div
                                            onClick={() => { setIdUser(e.id); setNameUser(e.name); setAddUser(true); }}
                                            key={y} className="clienteLine flexr">
                                            {/* <p className="eventNameLi">{e.id}</p> */}
                                            <p className="clienteTypeLi" style={{ textAlign: 'start' }}>{e.name}</p>
                                        </div>
                                    )
                                })
                                }
                            </div>
                        </div>
                    }


                </div>
                :

                // ******************* SEM TURMA
                <div className="margin5percent flexc">
                    <div className="eventsBoxWhite flexc gap-6" style={{ position: 'relative', boxShadow: 'var(shad-ligth)' }}>
                        <div className="noEventsIcon flexr" >
                            <FaRegStar size={70} color="var(--blue-third)" />
                        </div>
                        <div className="noEventsContet">
                            <h1>Crie uma nova turma</h1>
                            <p>Para facilitar a organização, você pode criar turmas de formandos para distribuição das entradas.</p>
                        </div>
                        <button
                            onClick={(e) => toOpenTurma(e)}
                            className="btnBlueThird flexr newEventFloatBtn gap-4"><div className="flexr"><TiPlus /></div> CRIAR NOVA TURMA</button>
                    </div>
                </div>
            }
        </div >
    );
}