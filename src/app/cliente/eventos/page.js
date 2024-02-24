'use client'

import { useState, useEffect, useContext } from "react"
import { GlobalContext } from "@/context/global";
import { useRouter } from "next/navigation";
import Separator from "@/components/fragments/separatorLine";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DeletModal from "@/components/Modal/deletModal";
import { toast, ToastContainer } from 'react-toastify';

export default function Eventos() {
  const router = useRouter();
  const { KONG_URL, user, company, setUserName, setUserEmail, setUserType, setUserJwt } = useContext(GlobalContext);
  const [eventList, setEventList] = useState([]);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);

  async function getEvents() {
    let x;
    let theCompany = !!company?.id ? company?.id : localStorage.getItem('company_id');
    let theJwt = !!user?.jwt ? user?.jwt : localStorage.getItem('user_jwt');


    if (!!theJwt && !!theCompany) {

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
        } else {
          setEventList([])
        }
      } catch (error) {

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

  useEffect(() => {

    getEvents();
  }, [])

  return (
    <div className="clienteMain flexr">
      <ToastContainer></ToastContainer>
      {deleteModalIsOpen == true && <DeletModal close={() => closeDeleteModal()} func={(e) => deleteUser(e)} word="confirmar" ></DeletModal>}
      <div className="clienteContent flexc">
        <div className="adminUsersHeader flexr">
          <div className="adminUsersTitle flexr">
            <h1>Lista de Eventos</h1>
          </div>
          <div className="adminUsersAdd flexr">
            <button
              onClick={(e) => toNewUser(e)}
              className="btnOrange">Novo Evento!</button>
          </div>
        </div>
        <Separator color={"var(--grey-ligth)"} width="100%" height="1px"></Separator>
        <div className="clienteUl flexc">
          <div className="clienteTitle flexr">
            <p className="clienteIdLi">Id</p>
            <div className="displayNone700">
              <Separator color={"var(--grey-ligth)"} width="1px" height="100%"></Separator>
            </div>
            <p className="eventNameLi">Nome do Evento</p>
            <Separator color={"var(--grey-ligth)"} width="1px" height="100%"></Separator>
            <p className="eventDateLi">Tipo</p>
            <div className="displayNone700">
              <Separator color={"var(--grey-ligth)"} width="1px" height="100%"></Separator>
            </div>
            <p className="userTypeLi">Data</p>
          </div>
          <div className="clienteUl flexc" style={{ marginTop: "10px" }}>
            {!!eventList && eventList.map((e, y) => {
              return (
                <div key={y} className="clienteLine flexr">
                  <p className="clienteIdLi">{e.id}</p>
                  <div className="displayNone700">
                    <Separator color={"var(--grey-ligth)"} width="1px" height="100%"></Separator>
                  </div>
                  <p className="eventNameLi">{e.name}</p>
                  <Separator color={"var(--grey-ligth)"} width="1px" height="100%"></Separator>
                  <p className="eventDateLi">{e.type}</p>
                  <div className="displayNone700">
                    <Separator color={"var(--grey-ligth)"} width="1px" height="100%"></Separator>
                  </div>
                  <p className="userTypeLi">{dateConvert(e.date)}</p>
                  <div className="userConfigbtns flexr">
                    <div
                      // onClick={(event) => toEditUser(event, e.id)}
                      className="userConfigbtn flexr"><EditIcon className="userConfigIcon"></EditIcon></div>
                    <div
                      // onClick={(event) => openDeleteModal(event, e.id)}
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
