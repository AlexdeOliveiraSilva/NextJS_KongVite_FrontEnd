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
import Loader from "@/components/fragments/loader";
import TextField from '@mui/material/TextField';

export default function Eventos() {
  const router = useRouter();
  const { KONG_URL, user, company, setEventEdit } = useContext(GlobalContext);
  const [eventList, setEventList] = useState([]);
  const [eventListCopy, setEventListCopy] = useState([]);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [deleteId, setDeleteId] = useState();
  const [isFetching, setisFetching] = useState(false);

  const [nameFilter, setNameFilter] = useState();
  const [dateStartFilter, setDateStartFilter] = useState();
  const [dateEndFilter, setDateEndFilter] = useState();

  async function getEvents() {
    let x;
    let theCompany = !!company?.id ? company?.id : localStorage.getItem('company_id');
    let theJwt = !!user?.jwt ? user?.jwt : localStorage.getItem('user_jwt');


    if (!!theJwt && !!theCompany) {
      setisFetching(true);
      try {
        x = await (await fetch(`${KONG_URL}/companys/events/1`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': theJwt
          }
        })).json()

        if (!x?.message) {
          setEventList(x.data)
          setEventListCopy(x.data)
        } else {
          setEventList([])
          setEventListCopy([])
        }
        setisFetching(false);
      } catch (error) {
        setisFetching(false);
        return error
      }
    }
  }

  function dateConvert(dataISO) {
    const data = new Date(dataISO);
    const dia = data.getDate().toString().padStart(2, '0');
    const mes = (data.getMonth() + 1).toString().padStart(2, '0');
    const ano = data.getFullYear();
    const hora = data.getHours().toString().padStart(2, '0');
    const minutos = data.getMinutes().toString().padStart(2, '0');
    const segundos = data.getSeconds().toString().padStart(2, '0');

    const brFormat = `${dia}/${mes}/${ano} ${hora}:${minutos}:${segundos}`;

    return brFormat;
  }

  function toNewEvent(e) {
    e.preventDefault();

    router.push('/cliente/novo-evento')
  }

  function toEditEvent(e, id) {
    e.preventDefault();
    e.stopPropagation();
    setEventEdit(id)
    localStorage.setItem("event_edit", id)

    router.push('/cliente/eventos/edit')
  }

  function toEvent(e, id) {
    e.preventDefault();
    setEventEdit(id)
    localStorage.setItem("event_edit", id)

    router.push('/cliente/event-view')
  }


  async function deleteEvent() {

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

          getEvents();
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

  function openDeleteModal(e, id) {
    e.preventDefault();
    e.stopPropagation();
    setDeleteId(id)
    setDeleteModalIsOpen(true)
  }

  function closeDeleteModal() {
    setDeleteModalIsOpen(false)
  }



  function filtrarEventos() {
    let x = eventList;
    setEventList(eventListCopy);

    let go = filterErrors();

    if (go === false) return "";

    if (!!nameFilter || (!!dateStartFilter && !!dateEndFilter)) {
      let filteredEvents = eventListCopy;

      if (!!nameFilter) {
        filteredEvents = filteredEvents.filter(e => e.name.toLowerCase().includes(nameFilter.toLowerCase()));
      }

      if (!!dateStartFilter && !!dateEndFilter) {
        filteredEvents = filteredEvents.filter(e => {
          const eventDate = new Date(e.date);
          const startDate = new Date(dateStartFilter);
          const endDate = new Date(dateEndFilter);

          eventDate.setHours(0, 0, 0, 0);
          startDate.setHours(0, 0, 0, 0);
          endDate.setHours(0, 0, 0, 0);

          return eventDate >= startDate && eventDate <= endDate;
        });
      }

      setEventList(filteredEvents);
    }
  }


  function filterErrors() {
    if ((!dateStartFilter && !!dateEndFilter) || (!!dateStartFilter && !dateEndFilter)) {
      toast.error("Para buscar por Data, é necessário definir tanto a data de início quanto a data de término.");
      return false;
    } else if (!!dateStartFilter && !!dateEndFilter) {
      const startDate = new Date(dateStartFilter);
      const endDate = new Date(dateEndFilter);

      if (startDate > endDate) {
        toast.error("A data de início deve ser anterior à data de término.");
        return false;
      } else {
        return true;
      }
    } else {

      return true;
    }
  }


  useEffect(() => {

    getEvents();
  }, [])


  return (
    <div className="clienteMain flexr">
      <ToastContainer></ToastContainer>
      {deleteModalIsOpen == true && <DeletModal close={() => closeDeleteModal()} func={() => deleteEvent()} word="confirmar" ></DeletModal>}
      <div className="clienteContent flexc">
        <div className="adminUsersHeader flexr">
          <div className="adminUsersTitle flexr">
            <h1>Lista de Eventos</h1>
          </div>
          <div className="adminUsersAdd flexr">
            <button
              onClick={(e) => toNewEvent(e)}
              className="btnOrange">Novo Evento!</button>
          </div>
        </div>


        <div className="searchEventsContainer flexr">
          <div className="flexr" style={{ padding: "0 20px", width: "100%" }}>
            <TextField
              onChange={(e) => setNameFilter(e.target.value)}
              style={{ width: "100%" }}
              type="text" id="nomeEvento"
              className="inputStyle" label="Buscar por Nome..." value={nameFilter}
            />
          </div>
          <Separator color={"#dadada"} width="1px" height="100%"></Separator>

          <div className="searchDateContainer flexr">
            <div className="flexr" style={{ padding: "0 20px", gap: "10px" }}>
              <label htmlFor="dataInicio">Entre:</label>
              <TextField
                onChange={(e) => {
                  const dateTimeValue = e.target.value;
                  const dateOnly = dateTimeValue.split('T')[0];
                  setDateStartFilter(dateOnly);
                }}
                type="date" id="nomeEvento"
                className="inputStyle" value={dateStartFilter}
              />
            </div>
            <div className="flexr" style={{ padding: "0 20px", gap: "10px" }}>
              <label htmlFor="dataFim">e:</label>
              <TextField
                onChange={(e) => {
                  const dateTimeValue = e.target.value;
                  const dateOnly = dateTimeValue.split('T')[0];
                  setDateEndFilter(dateOnly)
                }}
                type="date" id="nomeEvento"
                className="inputStyle" value={dateEndFilter}
              />
            </div>
          </div>

          <button className="btnBlue" onClick={filtrarEventos}>Buscar</button>
        </div>
        <Separator color={"var(--grey-ligth)"} width="100%" height="1px"></Separator>




        <div className="clienteUl flexc">
          <div className="clienteTitle flexr">
            <p className="eventNameLi">Nome do Evento</p>
            <Separator color={"var(--grey-ligth)"} width="1px" height="100%"></Separator>
            <p className="clienteTypeLi">Tipo</p>
            <Separator color={"var(--grey-ligth)"} width="1px" height="100%"></Separator>
            <p className="clienteAvaibleLi">Disponíveis</p>
            <div className="displayNone700">
              <Separator color={"var(--grey-ligth)"} width="1px" height="100%"></Separator>
            </div>
            <p className="clienteAvaibleLi">Cadastrados</p>
            <div className="displayNone700">
              <Separator color={"var(--grey-ligth)"} width="1px" height="100%"></Separator>
            </div>
            <p className="eventDateLi">Data</p>
          </div>
          <div className="clienteUl flexc" style={{ marginTop: "10px" }}>
            {isFetching == true
              ?
              <Loader></Loader>
              :

              !!eventList && eventList.map((e, y) => {
                return (
                  <div
                    onClick={(event) => toEvent(event, e.id)}
                    key={y} className="clienteLine flexr">
                    <p className="eventNameLi">{e.name}</p>
                    <Separator color={"var(--grey-ligth)"} width="1px" height="100%"></Separator>
                    <p className="clienteTypeLi">{e.type}</p>
                    <Separator color={"var(--grey-ligth)"} width="1px" height="100%"></Separator>
                    <p className="clienteAvaibleLi">{e.totalAvaliable - e.totalUsed}</p>
                    <div className="displayNone700">
                      <Separator color={"var(--grey-ligth)"} width="1px" height="100%"></Separator>
                    </div>
                    <p className="clienteAvaibleLi">{e.totalAvaliable}</p>
                    <div className="displayNone700">
                      <Separator color={"var(--grey-ligth)"} width="1px" height="100%"></Separator>
                    </div>
                    <p className="eventDateLi">{dateConvert(e.date)}</p>
                    <div className="userConfigbtns flexr">
                      <div
                        onClick={(event) => toEditEvent(event, e.id)}
                        className="userConfigbtn flexr"><EditIcon className="userConfigIcon"></EditIcon></div>
                      <div
                        onClick={(event) => { openDeleteModal(event, e.id) }}
                        className="userConfigbtn flexr">
                        <DeleteIcon className="userConfigIcon"></DeleteIcon>
                      </div>
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
      </div>
    </div>
  );
}
