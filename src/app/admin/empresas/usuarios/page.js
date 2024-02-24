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

export default function CompanyUsers() {
  const router = useRouter();
  const { KONG_URL, user, setUserEdit, companyEdit, companyNameEdit } = useContext(GlobalContext);
  const [adminsList, setAdminsList] = useState([]);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [deleteIdSelected, setDeletedidSelected] = useState();
  const [pageTitle, setPageTitle] = useState('Lista de Usuários');
  const [isLoading, setIsLoading] = useState(false);

  async function getUsers() {
    let jwt = !!user?.jwt ? user.jwt : localStorage.getItem("user_jwt")
    let companyId = !!companyEdit ? companyEdit : localStorage.getItem("company_edit")

    let x;

    if (!!jwt && !!companyId) {
      try {
        x = await (await fetch(`${KONG_URL}/companys/user/${companyId}`, {
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
    router.push('/admin/empresas/usuarios/add')
  }

  function toEditUser(e, id) {
    e.preventDefault();
    setUserEdit(id)
    localStorage.setItem("user_edit", id)

    router.push('/admin/empresas/usuarios/edit')
  }

  async function deleteFunc(e) {
    if (!!deleteIdSelected) {
      e.preventDefault();

      let x;
      let jwt = !!user?.jwt ? user.jwt : localStorage.getItem("user_jwt")
      let cID = !!companyEdit ? companyEdit : localStorage.getItem("company_edit")


      if (!!jwt && !!cID) {
        setIsLoading(true)
        try {
          x = await (await fetch(`${KONG_URL}/companys/user/${cID}`, {
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
            toast.success("Usuário Deletado.", {
              position: "top-right"
            });
            setIsLoading(false);
            setDeleteModalIsOpen(false);

            getUsers();
          } else {
            toast.error(`${x?.message}`, {
              position: "top-right"
            });
            setIsLoading(false)
          }

        } catch (error) {
          toast.error("Erro ao Deletado, tente novamente.", {
            position: "top-right"
          });
          setIsLoading(false)
          return ""
        }
      } else {
        toast.error("Erro ao Deletado, tente novamente.", {
          position: "top-right"
        });
        setisLoading(false)
        return ""
      }
    } else {
      toast.error("Erro ao deletar item.", {
        position: "top-right"
      });
      setDeleteModalIsOpen(false)
    }
  }

  useEffect(() => {
    getUsers();
    setPageTitle(!!companyNameEdit ?
      `${companyNameEdit} - Usuários` :
      !!localStorage.getItem("companyName_edit") ?
        `${localStorage.getItem("companyName_edit")} - Usuários` :
        "Lista de Usuários")
  }, [])

  return (
    <div className="adminUsersMain flexr">
      <ToastContainer></ToastContainer>
      {deleteModalIsOpen == true && <DeletModal close={() => closeDeleteModal()} func={(e) => deleteFunc(e)} word="confirmar" ></DeletModal>}
      <div className="adminUsersContent flexc">
        <div className="adminUsersHeader flexr">
          <div className="adminUsersTitle flexr">
            {pageTitle}
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
