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

export default function AdminUsers() {
  const router = useRouter();
  const { KONG_URL, user, setUserName, setUserEmail, setUserType, setUserJwt, userEdit, setUserEdit } = useContext(GlobalContext);
  const [adminsList, setAdminsList] = useState([])
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false)
  const [deleteIdSelected, setDeletedidSelected] = useState()

  async function getAdmins() {
    let jwt = !!user?.jwt ? user.jwt : localStorage.getItem("user_jwt")

    let x;

    if (!!jwt) {
      try {
        x = await (await fetch(`${KONG_URL}/users`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': jwt
          }
        })).json()

        setAdminsList(x)

      } catch (error) {

        return ""
      }
    }
  }

  function openDeleteModal(e, id) {
    e.preventDefault();
    setDeletedidSelected(id)
    setDeleteModalIsOpen(true)
  }

  function closeDeleteModal() {
    setDeleteModalIsOpen(false)
  }

  function toNewUser(e) {
    e.preventDefault();
    setUserEdit("")
    localStorage.setItem("user_edit", "")

    router.push('/admin/admin-users/add')
  }

  function toEditUser(e, id) {
    e.preventDefault();
    setUserEdit(id)
    localStorage.setItem("user_edit", id)

    router.push('/admin/admin-users/edit')
  }

  function deleteFunc() {
    if (!!deleteIdSelected) {
      toast.success("Usuário Deletado com Sucesso.", {
        position: "top-right"
      });
      setDeleteModalIsOpen(false)
    } else {
      toast.error("Erro ao deletar item.", {
        position: "top-right"
      });
      setDeleteModalIsOpen(false)
    }
  }

  useEffect(() => {
    getAdmins();
  }, [])

  return (
    <div className="adminUsersMain flexr">
      <ToastContainer></ToastContainer>
      {deleteModalIsOpen == true && <DeletModal close={() => closeDeleteModal()} func={() => deleteFunc()} word="confirmar" ></DeletModal>}
      <div className="adminUsersContent flexc">
        <div className="adminUsersHeader flexr">
          <div className="adminUsersTitle flexr">
            <h1>Lista de Usuários</h1>
          </div>
          <div className="adminUsersAdd flexr">
            <button
              onClick={(e) => toNewUser(e)}
              className="btnOrange">Novo usuário!</button>
          </div>
        </div>
        <Separator color={"var(--grey-ligth)"} width="100%" height="1px"></Separator>
        <div className="adminUsersUl flexc">
          <div className="userLineTitle flexr">
            <p className="userIdLi">Id</p>
            <Separator color={"var(--grey-ligth)"} width="1px" height="100%"></Separator>
            <p className="userNameLi">Username</p>
            <Separator color={"var(--grey-ligth)"} width="1px" height="100%"></Separator>
            <p className="userDocLi">Documento</p>
            <Separator color={"var(--grey-ligth)"} width="1px" height="100%"></Separator>
            <p className="userPhoneLi">Telefone</p>
            <Separator color={"var(--grey-ligth)"} width="1px" height="100%"></Separator>
            <p className="userEmailLi">Email</p>
          </div>
          <div className="adminUsersUl flexc" style={{ marginTop: "10px" }}>
            {!!adminsList && adminsList.map((e, y) => {
              return (
                <div key={y} className="userLine flexr">
                  <p className="userIdLi">{e.id}</p>
                  <Separator color={"var(--grey-ligth)"} width="1px" height="100%"></Separator>
                  <p className="userNameLi">{e.name}</p>
                  <Separator color={"var(--grey-ligth)"} width="1px" height="100%"></Separator>
                  <p className="userDocLi">{e.document}</p>
                  <Separator color={"var(--grey-ligth)"} width="1px" height="100%"></Separator>
                  <p className="userPhoneLi">{e.phone}</p>
                  <Separator color={"var(--grey-ligth)"} width="1px" height="100%"></Separator>
                  <p className="userEmailLi">{e.email}</p>
                  <div className="userConfigbtns flexr">
                    <div
                      onClick={(event) => toEditUser(event, e.id)}
                      className="userConfigbtn flexr"><EditIcon className="userConfigIcon"></EditIcon></div>
                    <div
                      onClick={(event) => openDeleteModal(event, e.id)}
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
    </div >
  );
}
