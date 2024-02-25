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
  const { KONG_URL, user, setUserEdit } = useContext(GlobalContext);
  const [adminsList, setAdminsList] = useState([]);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [deleteIdSelected, setDeletedidSelected] = useState();
  const [isLoading, setisLoading] = useState(false);

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

  async function deleteUser() {

    let jwt = !!user?.jwt ? user.jwt : localStorage.getItem("user_jwt")

    let x;

    if (!!jwt && !!deleteIdSelected) {

      try {
        x = await (await fetch(`${KONG_URL}/user/`, {
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
          toast.success("Usuário deletado com sucesso.", {
            position: "top-right"
          });
          setisLoading(false);
          setDeleteModalIsOpen(false);
          getAdmins();
        } else {
          toast.error(`${x?.message}`, {
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

    router.push('/admin/administradores/add')
  }

  function toEditUser(e, id) {
    e.preventDefault();
    setUserEdit(id)
    localStorage.setItem("user_edit", id)

    router.push('/admin/administradores/edit')
  }


  useEffect(() => {
    getAdmins();
  }, [])

  return (
    <div className="adminUsersMain flexr">
      <ToastContainer></ToastContainer>
      {deleteModalIsOpen == true && <DeletModal close={() => closeDeleteModal()} func={(e) => deleteUser(e)} word="confirmar" ></DeletModal>}
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
            <div className="userLine1150">
              <Separator color={"var(--grey-ligth)"} width="1px" height="100%"></Separator>
            </div>
            <p className="userNameLi">Username</p>
            <Separator color={"var(--grey-ligth)"} width="1px" height="100%"></Separator>
            <p className="userDocLi">Documento</p>
            <Separator color={"var(--grey-ligth)"} width="1px" height="100%"></Separator>
            <p className="userPhoneLi">Telefone</p>
            <div className="userLine650">
              <Separator color={"var(--grey-ligth)"} width="1px" height="100%"></Separator>
            </div>
            <p className="userEmailLi">Email</p>
          </div>
          <div className="adminUsersUl flexc" style={{ marginTop: "10px" }}>
            {!!adminsList && adminsList.map((e, y) => {
              return (
                <div key={y} className="userLine flexr">
                  <p className="userIdLi">{e.id}</p>
                  <div className="userLine1150">
                    <Separator color={"var(--grey-ligth)"} width="1px" height="100%"></Separator>
                  </div>
                  <p className="userNameLi">{e.name}</p>
                  <Separator color={"var(--grey-ligth)"} width="1px" height="100%"></Separator>
                  <p className="userDocLi">{e.document}</p>
                  <div className="userLine1150">
                    <Separator color={"var(--grey-ligth)"} width="1px" height="100%"></Separator>
                  </div>
                  <p className="userPhoneLi">{e.phone}</p>
                  <div className="userLine650">
                    <Separator color={"var(--grey-ligth)"} width="1px" height="100%"></Separator>
                  </div>
                  <p className="userEmailLi">{e.email}</p>
                  <div className="userConfigbtns flexr">
                    <div
                      onClick={(event) => toEditUser(event, e.id)}
                      className="userConfigbtn flexr"><EditIcon className="userConfigIcon"></EditIcon></div>
                    {y != 0 &&
                      <div
                        onClick={(event) => openDeleteModal(event, e.id)}
                        className="userConfigbtn flexr">
                        <DeleteIcon className="userConfigIcon"></DeleteIcon>
                      </div>
                    }
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
