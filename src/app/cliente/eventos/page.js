'use client'

import { useState, useEffect, useContext } from "react"
import { GlobalContext } from "@/context/global";
import { useRouter } from "next/navigation";
import { FaEdit } from "react-icons/fa";
import DeleteIcon from '@mui/icons-material/Delete';
import DeletModal from "@/components/Modal/deletModal";
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import Loader from "@/components/fragments/loader";
import TextField from '@mui/material/TextField';
import BannerInfo from "@/components/BannerInfo";
import { RiMapPinLine } from "react-icons/ri";
import { TiPlus } from "react-icons/ti";
import moment from "moment";
export default function Eventos() {
  const router = useRouter();
  const [infobannerCopy, setInforBannerCopy] = useState([]);


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

    // const data = new Date(dataISO);
    // const dia = data.getDate().toString().padStart(2, '0');
    // const mes = (data.getMonth() + 1).toString().padStart(2, '0');
    // const ano = data.getFullYear();
    // const hora = data.getHours().toString().padStart(2, '0');
    // const minutos = data.getMinutes().toString().padStart(2, '0');
    // const segundos = data.getSeconds().toString().padStart(2, '0');

    // const brFormat = `${dia}/${mes}/${ano} ${hora}:${minutos}:${segundos}`;

    return moment(dataISO).utc().format("DD/MM/YYYY HH:mm");
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

    router.push('/cliente/turmas')
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

  const textTeste = [
    {
      id: 1,
      cookie: 'breject001',
      text: "Entre, você está prestes a dar vida aos seus momentos especiais!",
      text2: "Você ainda não possui um evento cadastrado, bora começar?",
      action: 'Bora! Criar um novo evento.',
      token: 'tokenteste'
    }
  ]

  function deleteInfo(id, cookie) {

    let x = !!infobannerCopy && infobannerCopy.filter((e) => +e.id != +id)

    if (!!cookie) {
      localStorage.setItem(cookie, false)
    }

    setInforBannerCopy(x)
  }



  // useEffect(() => {

  //   getEvents();
  // }, [])

  // useEffect(() => {
  //   let bannercopy = textTeste
  //   let x;

  //   textTeste.map((e, y) => {

  //     if (!!localStorage.getItem(`${e.cookie.toString()}`)) {
  //       x == !!bannercopy && bannercopy.filter((z) => +e.id != z.id)

  //       bannercopy = x
  //     }
  //   })

  //   setInforBannerCopy(bannercopy)

  // }, [])


  return (
    <div className="clientEventMain flexc" >
      <ToastContainer></ToastContainer>
      {deleteModalIsOpen == true && <DeletModal close={() => closeDeleteModal()} func={() => deleteEvent()} word="confirmar" ></DeletModal>}
      <div className="margin5percent">
        <div className="newTopSitemap flexr">
          <h1 style={{ fontWeight: 600, marginRight: 10 }}>Eventos</h1>
          {!!eventList && eventList.length > 0 &&
            <button
              onClick={(e) => toNewEvent(e)}
              className="btnBlueThird flexr newEventBtn gap-4">CRIAR NOVO EVENTO
            </button>
          }
        </div>
      </div>
      <div className="margin5percent">
        {!!infobannerCopy && infobannerCopy.map((e, y) => {
          if (y == 0 && (!eventList || eventList.length == 0)) {
            return (
              <BannerInfo
                key={y}
                image='/images/kong-like.png'
                name={!!user?.name ? user?.name.split(' ')[0] : ""}
                banner={e} del={deleteInfo}
                doAction={(e) => toNewEvent(e)}
              ></BannerInfo>
            )
          }
        })}
      </div>

      <div className="clienteUl flexc" style={{ marginTop: "10px" }}>
        {isFetching == true
          ?
          <div style={{ width: '100%', height: 300 }} className="flexc">
            <Loader></Loader>
          </div>
          :

          !!eventList && eventList.length > 0 ?
            <div className="clientEventList flexc">
              <div className=" clientEventFilters flexr">
                <div className="flexr gap-2" style={{ justifyContent: 'flex-start' }}>
                  <label htmlFor="dataInicio" style={{ whiteSpace: 'nowrap' }}>Buscar Evento: </label>
                  <TextField
                    onChange={(e) => setNameFilter(e.target.value)}
                    type="text" id="nomeEvento"
                    className="inputClientEventStyleName" label="Buscar por Nome..." value={nameFilter}
                  />
                </div>
                <div className="flexr" style={{ padding: "0 20px", gap: "10px" }}>
                  <label htmlFor="dataInicio">Entre:</label>
                  <TextField
                    onChange={(e) => {
                      const dateTimeValue = e.target.value;
                      const dateOnly = dateTimeValue.split('T')[0];
                      setDateStartFilter(dateOnly);
                    }}
                    type="date" id="nomeEvento"
                    placeholder=""
                    className="inputClientEventStyle" value={dateStartFilter}
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
                    placeholder=""
                    className="inputClientEventStyle" value={dateEndFilter}
                  />
                </div>
                <button
                  onClick={filtrarEventos}
                  className="newEventBtnWhite flexr">Buscar</button>
              </div>


              <div className="margin5percent flexc gap-4" style={{ justifyContent: 'center', alignItems: 'flex-start', marginTop: '60px' }}>
                <div className="clientListTitle flexr">
                  <h2 className="eventNameLi">Nome do Evento</h2>
                  <h2 className="clienteTypeLi">Tipo do Evento</h2>
                  <h2 className="clienteAvaibleLi">Ingressos</h2>
                  <h2 className="eventDateLi">Data</h2>
                </div>
                {eventList.map((e, y) => {
                  return (
                    <div
                      onClick={(event) => toEvent(event, e.id)}
                      key={y} className="clienteLine flexr">
                      <p className="eventNameLi" style={{ fontWeight: 700, color: 'var(--blue-primary)' }}>{e.name}</p>

                      <p className="clienteTypeLi">{e.type}</p>

                      <p className="clienteAvaibleLi">{e.totalUsed}/{e.totalAvaliable}</p>


                      <p className="eventDateLi">{dateConvert(e.date)}</p>
                      <div className="userConfigbtns flexr">
                        <div
                          onClick={(event) => toEditEvent(event, e.id)}
                          className="userConfigbtn flexr"><FaEdit className="userConfigIcon"></FaEdit></div>
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

            :
            <div className="eventsBoxWhite flexc gap-6" style={{ position: 'relative' }}>
              <div className="noEventsIcon flexr" >
                <RiMapPinLine size={70} color="var(--blue-third)" />
              </div>
              <div className="noEventsContet">
                <h1>Para iniciar, crie um novo evento</h1>
                <p>Crie um evento para poder fazer as distribuições de seus ingressos de uma maneira descomplicada.</p>
              </div>
              <button
                onClick={(e) => toNewEvent(e)}
                className="btnBlueThird flexr newEventFloatBtn gap-4"><div className="flexr"><TiPlus /></div> CRIAR NOVO EVENTO</button>
            </div>
        }
      </div>

    </div>

  );
}
