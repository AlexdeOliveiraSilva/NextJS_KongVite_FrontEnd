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
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import DirectionsIcon from '@mui/icons-material/Directions';

export default function AdminUsers() {
  const router = useRouter();
  const { KONG_URL, user, setCompanyEdit, setCompanyNameEdit, companyEdit } = useContext(GlobalContext);
  const [estabList, setEstbList] = useState([])
  const [estabListCopy, setEstbListCopy] = useState([])
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false)
  const [deleteIdSelected, setDeleteIdSelected] = useState();
  const [isLoading, setisLoading] = useState(false)
  const [isFetching, setisFetching] = useState(false);
  const [search, setSearch] = useState(""),
    [listPage, setListPage] = useState(1),
    [totalListPages, setTotalListPages] = useState(1);

  async function getEstablishments() {
    let jwt = !!user?.jwt ? user.jwt : localStorage.getItem("user_jwt")

    let x;

    if (!!jwt) {
      setisFetching(true);
      try {
        x = await (await fetch(`${KONG_URL}/companys/${listPage}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': jwt
          }
        })).json()

        setTotalListPages(x.totalPages)
        setisFetching(false);
        setEstbList(x.data)
        setEstbListCopy(x.data)
      } catch (error) {
        setisFetching(false);
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

  function onSearch() {
    let y = estabListCopy.filter((e) => e.name.toLowerCase().includes(search.toLowerCase()))

    setEstbList(y)
  }


  useEffect(() => {
    getEstablishments();
  }, [listPage])

  useEffect(() => {
    onSearch();
  }, [search])

  return (
    <div className="adminUsersMain flexr">
      <ToastContainer></ToastContainer>
      {deleteModalIsOpen == true && <DeletModal close={() => closeDeleteModal()} func={(e) => deleteFunc(e)} word="confirmar" ></DeletModal>}
      <div className="adminUsersContent flexc">
        <div className="adminUsersHeader flexr">
          <div className="adminUsersTitle flexr" style={{ gap: "30px" }}>
            <h1>Lista de Empresas</h1>
            <div className=" flexr" style={{ gap: "30px" }}>
              <Paper
                className=" paperSize"
                component="form"
                sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400 }}
              >
                <InputBase
                  sx={{ ml: 1, flex: 1 }}
                  placeholder="Buscar Empresa..."
                  inputProps={{ 'aria-label': 'buscar empresa...' }}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
                  <SearchIcon />
                </IconButton>

              </Paper>
            </div>
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
            <p className="companyNameLi">Nome</p>
            <Separator color={"var(--grey-ligth)"} width="1px" height="100%"></Separator>
            <p className="adminInvitesLi">Convites Disponiveis</p>
          </div>
          <div className="adminUsersUl flexc" style={{ marginTop: "10px" }}>
            {isFetching == true
              ?
              <Loader></Loader>
              :
              !!estabList && estabList.sort((a, b) => a.name.localeCompare(b.name)).map((e, y) => {
                return (
                  <div
                    onClick={(event) => toEditCompany(event, e.id, e.name)}
                    key={y} className="userLine flexr" style={{ cursor: "pointer" }}>
                    <p className="companyNameLi">{e.name}</p>
                    <Separator color={"var(--grey-ligth)"} width="1px" height="100%"></Separator>
                    <p className="adminInvitesLi">{e.invitesAvaliable}</p>
                    <div className="userConfigbtns flexr">
                      <div
                        onClick={(event) => toEditCompany(event, e.id, e.name)}
                        className="userConfigbtn flexr"><EditIcon className="userConfigIcon"></EditIcon>
                      </div>
                      <div
                        onClick={(event) => openDeleteModal(event, e.id)}
                        className="userConfigbtn flexr">
                        <DeleteIcon className="userConfigIcon"></DeleteIcon>
                      </div>
                    </div>
                  </div>
                )
              })}
            <div className="flexr gap-6 paginationList">
              <h6>Páginas </h6>
              {totalListPages ?
                Array.from({ length: totalListPages }, (_, index) => (
                  <p key={index}
                    onClick={listPage == index + 1 ? () => console.log('') : () => setListPage(index + 1)}
                    style={listPage == index + 1 ? { fontWeight: 700, textDecoration: 'underline' } : { fontWeight: 400, cursor: 'pointer' }}>
                    {index + 1}
                  </p>
                ))
                : null}

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
