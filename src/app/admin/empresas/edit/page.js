'use client'

import { useState, useEffect, useContext } from "react"
import { GlobalContext } from "@/context/global";
import { useRouter } from "next/navigation";
import Separator from "@/components/fragments/separatorLine";
import Loader from "@/components/fragments/loader";
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import TextField from '@mui/material/TextField';

export default function AdminCompanyAdd() {
  const router = useRouter();
  const { KONG_URL, user, companyNameEdit, companyEdit } = useContext(GlobalContext);
  const [step, setStep] = useState(1)

  // COMPANY DATA
  const [nameCompany, setNameCompany] = useState();
  const [documentCompany, setDocumentCompany] = useState();
  const [phoneCompany, setPhoneCompany] = useState();
  const [emailCompany, setEmailCompany] = useState();
  const [invitesAvaliable, setInvitesAvaliable] = useState(0);
  const [nameCompanyError, setNameCompanyError] = useState(false);
  const [documentCompanyError, setDocumentCompanyError] = useState(false);
  const [phoneCompanyError, setPhoneCompanyError] = useState(false);
  const [emailCompanyError, setEmailCompanyError] = useState(false);

  const [companyTitleName, setCompanyTitleName] = useState();
  const [isLoading, setisLoading] = useState(false);
  const [companyEdiData, setCompanyEditData] = useState();

  function nameVerify() {
    if (nameCompany?.length > 0 && nameCompany?.length < 4) {
      setNameCompanyError(true)
    } else {
      setNameCompanyError(false)
    }
  }

  function documentVerify() {
    if (documentCompany?.length > 0) {
      if (documentCompany?.length === 11 || documentCompany?.length === 14 || documentCompany?.length === 18) {
        setDocumentCompanyError(false)
      } else {
        setDocumentCompanyError(true)
      }
    } else {
      setDocumentCompanyError(false)
    }
  }

  function phoneVerify() {
    if ((phoneCompany?.length > 0 && phoneCompany?.length < 11) || phoneCompany?.length > 11) {
      setPhoneCompanyError(true)
    } else {
      setPhoneCompanyError(false)
    }
  }

  function emailVerify() {
    var regexEmail = /^[a-zA-Z]{4}[_a-zA-Z0-9]*@[a-zA-Z0-9]+([.]+[a-zA-Z]{2,})+$/;

    if (emailCompany?.length > 0) {
      if (regexEmail.test(emailCompany)) {
        setEmailCompanyError(false)
      } else {
        setEmailCompanyError(true)
      }
    } else {
      setEmailCompanyError(false)
    }
  }

  async function editNewCompany(e) {
    e.preventDefault();

    let jwt = !!user?.jwt ? user.jwt : localStorage.getItem("user_jwt")
    let cID = !!companyEdit ? companyEdit : localStorage.getItem("company_edit");

    let x;

    if (!!jwt && !!cID && (
      nameCompanyError == false &&
      emailCompanyError == false &&
      phoneCompanyError == false &&
      documentCompanyError == false
    )) {
      setisLoading(true)
      try {
        x = await (await fetch(`${KONG_URL}/companys/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': jwt
          },
          body: JSON.stringify({
            id: +cID,
            name: nameCompany,
            document: documentCompany,
            phone: phoneCompany,
            email: emailCompany
          })
        })).json()

        if (!x?.message) {
          toast.success("Empresa cadastrada.", {
            position: "top-right"
          });
          setisLoading(false)

          router.push('/admin/empresas/');
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
  }

  async function getCompany() {
    let x;
    let jwt = !!user?.jwt ? user.jwt : localStorage.getItem("user_jwt")
    let companyName = !!companyNameEdit ? companyNameEdit : localStorage.getItem("companyName_edit");

    try {

      x = await (await fetch(`${KONG_URL}/companys/1?name=${companyName}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': jwt
        }
      })).json()

      setCompanyEditData(x.data.filter((e) => e.name == companyName))

    } catch (error) {

      return ""
    }
  }

  function companyUsers(event) {
    event.preventDefault();
    router.push('/admin/empresas/usuarios')
  }

  useEffect(() => {
    if (companyEdiData != undefined) {
      setNameCompany(companyEdiData[0] && companyEdiData[0].name);
      setEmailCompany(companyEdiData[0] && companyEdiData[0].email);
      setDocumentCompany(companyEdiData[0] && companyEdiData[0].document);
      setPhoneCompany(companyEdiData[0] && companyEdiData[0].phone);
      setCompanyTitleName(companyEdiData[0].name)
    }
  }, [companyEdiData])


  useEffect(() => {
    nameVerify();
    documentVerify();
    emailVerify();
    phoneVerify();
  }, [nameCompany, documentCompany, emailCompany, phoneCompany])

  useEffect(() => {
    getCompany();
  }, [])


  return (
    <div className="adminUsersMain flexr">
      <ToastContainer></ToastContainer>
      <div className="adminUsersContent flexc" style={{ justifyContent: "flex-start" }}>
        <div className="adminUsersHeader flexr">
          <div className="adminUsersTitle flexr">
            <h1>Editar Empresa {!!companyTitleName && `- ${companyTitleName}`}</h1>
          </div>
          <div className="adminUsersAdd flexr">
            <button
              disabled={isLoading}
              onClick={(event) => editNewCompany(event)}
              style={{ minWidth: "150px" }}
              className="btnOrange">{!!isLoading ? <Loader></Loader> : "Salvar"}</button>
          </div>
        </div>
        <Separator color={"var(--grey-ligth)"} width="100%" height="1px"></Separator>
        <div className="adminUsersUl flexc" style={{ height: "auto", marginBottom: "30px" }}>
          < div className="adminUsersUl flexc">
            <div className="adminUsersUlTitle flexr"><h3>Dados da empresa</h3></div>
            <TextField
              onChange={(e) => setNameCompany(e.target.value)}
              className="inputStyle"
              value={nameCompany}
              label={!!nameCompany ? '' : "Nome da Empresa"}
              id="outlined-size-normal" placeholder={`Digite o Nome:'`} type="text" />
            {!!nameCompanyError && <p className="errorP">* O Nome deve conter mais que 3 caracteres.</p>}
            <div className="userAdminDoubleInputs flexr">
              <TextField
                onChange={(e) => setDocumentCompany(e.target.value)}
                className="inputStyle"
                value={documentCompany}
                label={!!documentCompany ? '' : "Documento da Empresa"}
                id="outlined-size-normal"
                placeholder={`Digite o Documento:'`}
                type="number" />
              <TextField
                onChange={(e) => setPhoneCompany(e.target.value)}
                value={phoneCompany}
                className="inputStyle"
                label={!!phoneCompany ? '' : "Telefone da Empresa"}
                id="outlined-size-normal" placeholder={`Digite o Telefone:'`} type="number" />
            </div>
            {!!documentCompanyError && <p className="errorP">* O Documento deve ser valido.</p>}
            {!!phoneCompanyError && <p className="errorP" style={{ textAlign: "right" }}>* O Telefone deve ser valido.</p>}
            <TextField
              onChange={(e) => setEmailCompany(e.target.value)}
              value={emailCompany}
              className="inputStyle"
              label={!!emailCompany ? '' : "E-mail da Empresa"}
              id="outlined-size-normal" placeholder={`Digite o E-mail:'`} type="text" />
            {!!emailCompanyError && <p className="errorP">* O E-mail deve ser valido.</p>}
          </div>
        </div>
        <div className="companyBtnDiv flexr" style={{ marginTop: "30px" }}>
          <button
            onClick={(event) => companyUsers(event)}
            className="btnBlue">Ver Usuários</button>
        </div>
      </div>
    </div >
  );
}
