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
import { MdDownloadForOffline } from "react-icons/md";

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
    const [isFetching, setisFetching] = useState(false);
    const [eventName, setEventName] = useState();
    const [eventPlace, setEventPlace] = useState();
    const [date, setDate] = useState("");
    const [hour, setHour] = useState("");
    const [alreadyPassType, setAlreadyPassType] = useState([]),
        [data, setData] = useState();;
    const [tabStep, setTabStep] = useState(1);

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
        const data = new Date(dataString);

        const ano = data.getFullYear();
        const mes = String(data.getMonth() + 1).padStart(2, '0');
        const dia = String(data.getDate()).padStart(2, '0');
        const horas = String(data.getHours()).padStart(2, '0');
        const minutos = String(data.getMinutes()).padStart(2, '0');

        return `${horas}:${minutos}`;
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
                }

            } catch (error) {

                return ""
            }
        } else {

        }
    }

    const jsonToExcel = (jsonData) => {
        setIsLoading(true)

        let fileName = new Date().toString();
        const rows = [];

        jsonData.forEach(item => {
            const { id, name, types } = item;
            types.forEach(type => {
                rows.push({
                    id,
                    name,
                    type_id: type.id,
                    description: type.description,
                    presente: type.presente,
                    ausente: type.ausente,
                    total: type.total,
                });
            });
        });

        const worksheet = XLSX.utils.json_to_sheet(rows);
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

    return (
        <div className="clientEventMain flexc">
            <ToastContainer></ToastContainer>
            {!!addTurmasIsOpen ? <AddTurmas close={() => toCloseTurma()} turmaId={turmaEdit} name={turmaNameEdit}></AddTurmas> : ""}
            {deleteModalIsOpen == true && <DeletModal close={() => closeDeleteModal()} func={() => deleteTurma()} word="confirmar" ></DeletModal>}
            <div className="margin5percent" style={{ position: 'relative' }}>
                <div className="newTopSitemap flexr">
                    <h1 style={{ fontWeight: 600, marginRight: 10 }}>Evento</h1>
                    {!!turma && turma?.length > 0 &&
                        <button
                            onClick={(e) => toOpenTurma(e)}
                            style={{ maxHeight: '40px' }}
                            className="btnBlueThird flexr newEventBtn gap-4">CRIAR NOVA TURMA
                        </button>
                    }
                    {!!data &&
                        <button
                            onClick={() => jsonToExcel(data)}
                            disabled={isLoading}
                            style={{ maxHeight: '40px' }}
                            className="TurmaDashButton btnBlue">
                            {!!isLoading ? <Loader></Loader> : 'BAIXAR DADOS'}
                        </button>
                    }
                </div>
            </div>
            <div className=" clientEventFilters flexr" style={{ position: 'relative', padding: '40px 5% 40px 5% !important' }}>
                {!!event ?
                    <>
                        <div
                            onClick={() => router.push('/cliente/eventos/edit/')}
                            className="iconEventContent flexr" style={{ border: '1px solid black' }}>
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
            {!!turma && turma?.length > 0 ?
                <div className="margin5percent flexc" style={{ paddingTop: '80px', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                    <div className="clientEventTabBar flexr">
                        <div
                            onClick={tabStep != 1 ? () => setTabStep(1) : () => console.log()}
                            className={tabStep == 1 ? "clientEventTabSelected flexr" : "clientEventTab flexr"}>
                            <p>Dashboard</p>
                        </div>
                        <div
                            onClick={tabStep != 2 ? () => setTabStep(2) : () => console.log()}
                            className={tabStep == 2 ? "clientEventTabSelected flexr" : "clientEventTab flexr"}>
                            <p>Turmas</p>
                        </div>
                    </div>
                    {tabStep == 1 ?
                        <div className="TurmaDash" style={{ marginTop: '40px' }}>

                            {!!data && data?.map((e, y) => {
                                return (
                                    <div key={y} className="TurmaCard flexc">
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
                </div>
                :
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
        </div>
    );
}