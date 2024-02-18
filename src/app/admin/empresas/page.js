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
  const { KONG_URL, user, setCompanyEdit, setCompanyNameEdit, companyEdit } = useContext(GlobalContext);
  const [estabList, setEstbList] = useState([])
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false)
  const [deleteIdSelected, setDeleteIdSelected] = useState();
  const [isLoading, setisLoading] = useState(false)

  async function getEstablishments() {
    let jwt = !!user?.jwt ? user.jwt : localStorage.getItem("user_jwt")

    let x;

    if (!!jwt) {
      try {
        x = await (await fetch(`${KONG_URL}/companys/1?name=`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': jwt
          }
        })).json()

        setEstbList(x.data)
      } catch (error) {
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
    setDeleteModalIsOpen(false)
  }

  function toNewCompany(e) {
    e.preventDefault();
    setCompanyEdit("")
    localStorage.setItem("company_edit", "")

    router.push('/admin/empresas/add')
  }

  function toEditCompany(e, id, name) {
    e.preventDefault();
    setCompanyEdit(id)
    localStorage.setItem("company_edit", id)
    setCompanyNameEdit(name)
    localStorage.setItem("companyName_edit", name)

    router.push('/admin/empresas/edit')
  }

  async function deleteFunc(e) {
    e.preventDefault();
    if (!!deleteIdSelected) {

      let jwt = !!user?.jwt ? user.jwt : localStorage.getItem("user_jwt")

      let x;

      if (!!jwt) {
        setisLoading(true)
        try {
          x = await (await fetch(`${KONG_URL}/companys/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': jwt
            },
            body: JSON.stringify({
              id: deleteIdSelected,
              situation: 2,
            })
          })).json()

          if (!x?.message) {
            toast.success("Empresa Deletada com Sucesso.", {
              position: "top-right"
            });
            setisLoading(false);
            setDeleteModalIsOpen(false);

            getEstablishments();
          } else {
            toast.error(`${x?.message}`, {
              position: "top-right"
            });
            setisLoading(false)
          }


        } catch (error) {
          toast.error("Erro ao Cadastrar, tente novamente.", {
            position: "top-right"
          });
          setisLoading(false)
          return ""
        }
      }

    } else {
      toast.error("Erro ao deletar item...", {
        position: "top-right"
      });
      setDeleteModalIsOpen(false)
    }
  }


  useEffect(() => {
    getEstablishments();
  }, [])

  return (
    <div className="adminUsersMain flexr">
      <ToastContainer></ToastContainer>
      {deleteModalIsOpen == true && <DeletModal close={() => closeDeleteModal()} func={(e) => deleteFunc(e)} word="confirmar" ></DeletModal>}
      <div className="adminUsersContent flexc">
        <div className="adminUsersHeader flexr">
          <div className="adminUsersTitle flexr">
            <h1>Lista de Empresas</h1>
          </div>
          <div className="adminUsersAdd flexr">
            <button
              onClick={(e) => toNewCompany(e)}
              className="btnOrange">Nova Empresa!</button>
          </div>
        </div>
        <Separator color={"var(--grey-ligth)"} width="100%" height="1px"></Separator>
        <div className="adminUsersUl flexc">
          <div className="userLineTitle flexr">
            <p className="userIdLi">Id</p>
            <Separator color={"var(--grey-ligth)"} width="1px" height="100%"></Separator>
            <p className="companyNameLi">Nome</p>
            <Separator color={"var(--grey-ligth)"} width="1px" height="100%"></Separator>
            <p className="userIdLi">Convites Disponiveis</p>
          </div>
          <div className="adminUsersUl flexc" style={{ marginTop: "10px" }}>
            {!!estabList && estabList.map((e, y) => {
              return (
                <div key={y} className="userLine flexr">
                  <p className="userIdLi">{e.id}</p>
                  <div className="userLine1150">
                    <Separator color={"var(--grey-ligth)"} width="1px" height="100%"></Separator>
                  </div>
                  <p className="companyNameLi">{e.name}</p>
                  <Separator color={"var(--grey-ligth)"} width="1px" height="100%"></Separator>
                  <p className="userIdLi">{e.invitesAvaliable}</p>
                  <div className="userConfigbtns flexr">
                    <div
                      onClick={(event) => toEditCompany(event, e.id, e.name)}
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
    </div>
  );
}
