'use client'

import { useState, useEffect, useContext } from "react"
import { GlobalContext } from "@/context/global";
import { useRouter } from "next/navigation";
import DeletModal from "@/components/Modal/deletModal";
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import AddGuest from "@/components/Modal/addGuest";
import InvitesModal from "@/components/Modal/invitesDownload";
import ChangeModal from "@/components/Modal/chancgePassword";
import Loader from "@/components/fragments/loader";
import SplideCard from "@/components/fragments/splideCard";
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';
import '@splidejs/react-splide/css/skyblue';
import '@splidejs/react-splide/css/sea-green';
import '@splidejs/react-splide/css/core';

import BannerInfo from "@/components/BannerInfo";
import ClientInfo from "@/components/ClientInfo";
import GuestInfo from "@/components/GuestsInfo";
import { TiPlus } from "react-icons/ti";



export default function EventGuest() {
  const router = useRouter();
  const { KONG_URL, user, eventEdit, eventChoice, eventClasses, setRefreshPage, refreshPage } = useContext(GlobalContext);
  const [addGuestModalIsOpen, setAddGuestModalIsOpen] = useState(false);
  const [deleteGuestModalIsOpen, setDeleteGuestModalIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [getingGuests, setGetingGuests] = useState(false);
  const [invitesOpen, setInvitesOpen] = useState(false)

  const [eventName, setEventName] = useState();
  const [eventPlace, setEventPlace] = useState();
  const [className, setClassName] = useState();
  const [classGuestId, setClassGuestId] = useState();

  const [myId, setMyId] = useState();
  const [myData, setMyData] = useState();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const [date, setDate] = useState("");
  const [hour, setHour] = useState("");

  const [guests, setGuests] = useState([]);

  const [guestEditId, setGuestEditId] = useState();
  const [guestData, setGuestData] = useState();
  const [guestDeleteId, setGuestDeleteId] = useState();
  const [guestEditName, setGuestEditName] = useState();
  const [typesData, setTypesData] = useState([]),
    [totalInvites, setTotalInvites] = useState(0);

  const [newPasswordModal, setNewpasswordModal] = useState(false);

  const [infobannerCopy, setInforBannerCopy] = useState([]);

  async function getGuests(eventId) {

    let x;
    let jwt = !!user?.jwt ? user.jwt : localStorage.getItem("user_jwt")

    if (!!jwt && !!eventId) {

      setGetingGuests(true);
      try {
        x = await (await fetch(`${KONG_URL}/user/guests/${eventId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': jwt
          }
        })).json()

        if (!x.message) {
          setGetingGuests(false);
          setMyId(x.id)
          setGuests(x.other_guests)
          return ""
        }

      } catch (error) {
        setGetingGuests(false);
        return ""
      }
    } else {
      setGetingGuests(false);
      return ""
    }
  }

  async function getAllData() {

    let x;
    let jwt = !!user?.jwt ? user.jwt : localStorage.getItem("user_jwt")

    if (!!myId) {

      try {
        x = await (await fetch(`${KONG_URL}/student/${myId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': jwt
          }
        })).json()


        if (!x.message) {
          setMyData(x)
          return ""
        }

      } catch (error) {

        return ""
      }
    } else {

      return ""
    }
  }


  async function deleteGuest() {

    let jwt = !!user?.jwt ? user.jwt : localStorage.getItem("user_jwt")

    let x;

    if (!!jwt && !!classGuestId && !!guestDeleteId) {
      setIsLoading(true);
      try {
        x = await (await fetch(`${KONG_URL}/student/acompanhante/add/${classGuestId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': jwt
          },
          body: JSON.stringify({
            id: guestDeleteId,
            situation: 2
          })
        })).json()




        if (!!x?.guest) {
          toast.success("Convidado Deletado com sucesso.", {
            position: "top-right"
          });
          setDeleteGuestModalIsOpen(false);
          setGuestDeleteId("")
          f5();
          setIsLoading(false);
        }
      } catch (error) {
        toast.error("Erro ao Deletar Convidado.", {
          position: "top-right"
        });
        setIsLoading(false);
        console.log("erro")
        return ""
      }
    } else {
      toast.error("Erro ao Deletar Convidado.", {
        position: "top-right"
      });
      console.log("else")
    }
  }

  function openAddGuest() {
    setGuestData('')
    setAddGuestModalIsOpen(true)
  }

  function openEditGuest(e, data) {
    e.preventDefault();
    e.stopPropagation();
    setGuestData(data)
    setAddGuestModalIsOpen(true)
  }

  function closeAddGuest() {
    let x = !!eventChoice ? eventChoice : localStorage.getItem("event_choice");
    let y = JSON.parse(x)

    setGuestEditId("");
    setGuestEditName("");
    getGuests(y.classEvent.id);
    setRefreshPage(!refreshPage);
    f5();
    setAddGuestModalIsOpen(false);
  }

  function openDeleteGuest(e, id) {
    e.preventDefault();
    e.stopPropagation();
    setGuestDeleteId(id)
    setDeleteGuestModalIsOpen(true)
  }

  function closeDeleteGuest() {

    setGuestDeleteId("");
    setRefreshPage(!refreshPage);
    setDeleteGuestModalIsOpen(false);
  }



  function deleteChangePassword() {

    setNewpasswordModal(false)
  }



  async function getAvaibles() {
    let jwt = !!user?.jwt ? user.jwt : localStorage.getItem("user_jwt");
    let y = !!eventChoice ? JSON.parse(eventChoice) : JSON.parse(localStorage.getItem("event_choice"));

    let theClass = y?.classEvent.id

    let x;

    if (!!jwt && !!theClass) {
      try {
        x = await (await fetch(`${KONG_URL}/user/guests/${theClass}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': jwt
          }
        })).json()


        if (!x?.message) {
          setTypesData(x.guestsTicketsTypeNumber);
        } else {
          console.log("error", x)
        }


      } catch (error) {
        console.log("catch", error)
        return ""
      }
    }
  }



  function setInvitesOpenModal() {

    setInvitesOpen(true)
  }
  function setInvitesCloseModal() {
    setInvitesOpen(false)
  }

  useEffect(() => {
    let x = !!eventChoice ? eventChoice : localStorage.getItem("event_choice");
    let y = JSON.parse(x)

    let w = !!eventClasses ? eventClasses : localStorage.getItem("event_classes");
    let z = JSON.parse(w)



    if (!!y && !!z) {
      getGuests(y.classEvent.id);

      setClassGuestId(y.classEvent.id);
      setEventName(z.name);
      setEventPlace(z.place)
      setClassName(y?.classEvent?.name);
      setName(y?.user?.name);
      setPhone(y.user?.phone);
      setEmail(y.user?.email);
      setDate(formatDateToInput(z.date));
      setHour(formatHourToInput(z.date));
    }
  }, [eventChoice, eventClasses, refreshPage])


  useEffect(() => {
    getAvaibles();

  }, [addGuestModalIsOpen])

  useEffect(() => {
    getAllData()

  }, [myId])

  useEffect(() => {
    setGuestData('')
  }, [])

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

  function f5() {
    if (!!window) {
      window.location.reload();
    }
  }

  const textTeste = [
    {
      id: 1,
      cookie: 'breject001',
      text: "Entre, você está prestes a dar vida aos seus momentos especiais! Com a KongVite, cada convite é uma história. Vamos tornar cada convite uma experiência única!",
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

  useEffect(() => {
    let bannercopy = textTeste
    let x;

    textTeste.map((e, y) => {

      if (!!localStorage.getItem(`${e.cookie.toString()}`)) {
        x == !!bannercopy && bannercopy.filter((z) => +e.id != z.id)

        bannercopy = x
      }
    })

    setInforBannerCopy(bannercopy)

  }, [])


  useEffect(() => {

    setTimeout(() => {
      let x = 0;


      !!myData && myData?.mainConvidado?.guestsTicketsTypeNumber.map((e) => {
        if (e.available > 0) {
          x = (+x + +e.available)
        }
      })

      setTotalInvites(x)
    }, 1000)

  }, [typesData, myData])


  return (
    <div className="clientEventMain flexc" >
      <ToastContainer></ToastContainer>
      {!!newPasswordModal && <ChangeModal close={(event) => deleteChangePassword(event)}></ChangeModal>}
      {!!invitesOpen && <InvitesModal close={() => setInvitesCloseModal()} data={myData} jwt={!!user?.jwt ? user.jwt : localStorage.getItem("user_jwt")} url={KONG_URL} ></InvitesModal>}
      {!!deleteGuestModalIsOpen && <DeletModal close={() => closeDeleteGuest()} func={() => deleteGuest()} word={"confirmar"}></DeletModal>}
      {!!addGuestModalIsOpen && <AddGuest close={() => closeAddGuest()} classId={classGuestId} typesData={typesData} guestData={guestData}></AddGuest>}

      <div className="margin5percent">
        {!!infobannerCopy && infobannerCopy.map((e, y) => {
          if (y == 0) {
            return (
              <BannerInfo key={y} image='/images/kong-like.png' name={!!user?.name ? user?.name.split(' ')[0] : ""} banner={e} del={deleteInfo}></BannerInfo>
            )
          }
        })}
      </div>

      <ClientInfo
        eventName={eventName}
        place={eventPlace}
        invites={totalInvites}
        date={date} hour={hour}
        tickets={!!myData ? myData?.mainConvidado?.guestsTicketsTypeNumber : []}>

      </ClientInfo>

      <div className="margin5percent flexc" style={{ width: '100%', justifyContent: "flex-start", alignItems: "flex-start" }}>
        <button className="btnBlueThird flexr"
          onClick={() => openAddGuest()}
          style={{
            marginTop: "-20px",
            borderRadius: "7px",
            fontSize: "16px",
            fontWeight: "bold",
            gap: "15px"
          }}>
          <TiPlus size={20} />ADICIONAR CONVIDADO
        </button>

        <GuestInfo

          data={!!myData ? [myData?.mainConvidado, ...myData?.acompanhantes] : null}
          setGuestDeleteId={setGuestDeleteId}
          setDeleteGuestModalIsOpen={setDeleteGuestModalIsOpen}
          setGuestData={setGuestData}
          setAddGuestModalIsOpen={setAddGuestModalIsOpen}
          setNewpasswordModal={setNewpasswordModal}
        ></GuestInfo>
      </div>

    </div>
  );
}
