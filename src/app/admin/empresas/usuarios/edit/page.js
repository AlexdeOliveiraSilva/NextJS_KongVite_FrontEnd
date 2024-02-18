'use client'

import { useState, useEffect, useContext } from "react"
import { GlobalContext } from "@/context/global";
import { useRouter } from "next/navigation";
import Separator from "@/components/fragments/separatorLine";
import Loader from "@/components/fragments/loader";
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import TextField from '@mui/material/TextField';

export default function AdminUsersEdit() {
  const router = useRouter();
  const { KONG_URL, user, userEdit, companyEdit, companyNameEdit } = useContext(GlobalContext);
  const [name, setName] = useState();
  const [document, setDocument] = useState();
  const [phone, setPhone] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [nameError, setNameError] = useState(false);
  const [documentError, setDocumentError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const [userEditId, setUserEditId] = useState();
  const [userEditData, setUserEditData] = useState();
  const [userTitleName, setUserTitleName] = useState();
  const [isLoading, setisLoading] = useState(false);
  const [pageTitle, setPageTitle] = useState('Editar Usuário')

  async function editUser(e) {
    e.preventDefault();

    let x;
    let jwt = !!user?.jwt ? user.jwt : localStorage.getItem("user_jwt")
    let userId = !!userEdit?.length > 0 ? userEdit : localStorage.getItem("user_edit");
    let cID = !!companyEdit ? companyEdit : localStorage.getItem("company_edit")
    console.log("click", (password ? password == confirmPassword : true))
    if ((password ? password == confirmPassword : true) && !!jwt && !!userId && !!cID && (
      nameError == false &&
      documentError == false &&
      emailError == false &&
      phoneError == false &&
      passwordError == false &&
      confirmPasswordError == false
    )) {
      setisLoading(true)
      try {
        x = await (await fetch(`${KONG_URL}/companys/user/${cID}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': jwt
          },
          body: JSON.stringify({
            id: +userId,
            name: name,
            document: document,
            phone: phone,
            email: email,
            password: password
          })
        })).json()

        if (!x?.message) {
          toast.success("Usuário Editado.", {
            position: "top-right"
          });
          setisLoading(false)

          router.push('/admin/empresas/usuarios');
        } else {
          toast.error(`${x?.message}`, {
            position: "top-right"
          });
          setisLoading(false)
        }

      } catch (error) {
        toast.error("Erro ao Editar, tente novamente.", {
          position: "top-right"
        });
        setisLoading(false)
        return ""
      }
    } else {
      toast.error("Erro ao Editar, tente novamente.", {
        position: "top-right"
      });
      setisLoading(false)
      return ""
    }
  }

  function nameVerify() {
    if (name?.length > 0 && name?.length < 4) {
      setNameError(true)
    } else {
      setNameError(false)
    }
  }

  function documentVerify() {
    if (document?.length > 0) {
      if (document?.length === 11 || document?.length === 14 || document?.length === 18) {
        setDocumentError(false)
      } else {
        setDocumentError(true)
      }
    } else {
      setDocumentError(false)
    }
  }

  function phoneVerify() {
    if ((phone?.length > 0 && phone?.length < 11) || phone?.length > 11) {
      setPhoneError(true)
    } else {
      setPhoneError(false)
    }
  }

  function emailVerify() {
    var regexEmail = /^[a-zA-Z]{4}[_a-zA-Z0-9]*@[a-zA-Z0-9]+([.]+[a-zA-Z]{2,})+$/;

    if (email?.length > 0) {
      if (regexEmail.test(email)) {
        setEmailError(false)
      } else {
        setEmailError(true)
      }
    } else {
      setEmailError(false)
    }
  }

  function passwordVerify() {
    var regexSenha = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (password?.length > 0) {
      if (password?.length >= 8 && regexSenha.test(password)) {
        setPasswordError(false)
      } else {
        setPasswordError(true)
      }
    } else {
      setPasswordError(false)
    }
  }

  function confirmPasswordVerify() {

    if (confirmPassword?.length > 0) {
      if (confirmPassword === password) {
        setConfirmPasswordError(false)
      } else {
        setConfirmPasswordError(true)
      }
    } else {
      setConfirmPasswordError(false)
    }
  }

  function documentTransform(x) {
    let number = x?.replace(/\D/g, '');


    switch (number?.length) {
      case 11:
        return number?.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');

      case 14:
        return number?.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');

      default:
        return x;
    }
  }

  function phoneTranform(x) {
    number = x.replace(/\D/g, '');

    if (number.length >= 10) {
      // Formatar como (##) ####-####
      return number.replace(/(\d{2})(\d{4,5})(\d{4})/, '($1) $2-$3');
    } else {
      return number;
    }
  }

  async function getUser() {

    let x;
    let jwt = !!user?.jwt ? user.jwt : localStorage.getItem("user_jwt");
    let userId = !!userEdit?.length > 0 ? userEdit : localStorage.getItem("user_edit");
    let cID = !!companyEdit ? companyEdit : localStorage.getItem("company_edit");

    if (!!jwt && !!userId && !!cID) {
      try {

        x = await (await fetch(`${KONG_URL}/companys/user/${cID}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': jwt
          }
        })).json()

        setUserEditData(x.filter((e) => e.id == userId))

      } catch (error) {

        return ""
      }
    }
  }

  useEffect(() => {
    if (userEditData?.length > 0) {
      setName(userEditData[0] && userEditData[0].name);
      setEmail(userEditData[0] && userEditData[0].email);
      setDocument(userEditData[0] && userEditData[0].document);
      setPhone(userEditData[0] && userEditData[0].phone);
      setUserTitleName(userEditData[0] && userEditData[0].name);
    }

  }, [userEditData])


  useEffect(() => {
    getUser();
    setPageTitle(!!companyNameEdit ? `${companyNameEdit} - Usuários` :
      !!localStorage.getItem("companyName_edit") ? `${localStorage.getItem("companyName_edit")} - Editar Usuário` :
        'Editar Usuário')
  }, [])

  useEffect(() => {
    nameVerify();
    documentVerify();
    emailVerify();
    phoneVerify();
    passwordVerify();
    confirmPasswordVerify();
  }, [name, email, document, phone, password, confirmPassword])


  return (
    <div className="adminUsersMain flexr">
      <ToastContainer></ToastContainer>
      <div className="adminUsersContent flexc">
        <div className="adminUsersHeader flexr">
          <div className="adminUsersTitle flexr">
            {pageTitle}
          </div>
          <div className="adminUsersAdd flexr">
            <button
              onClick={(event) => editUser(event)}
              style={{ minWidth: "150px" }}
              className="btnOrange">{!!isLoading ? <Loader></Loader> : "Salvar"}</button>
          </div>
        </div>
        <Separator color={"var(--grey-ligth)"} width="100%" height="1px"></Separator>
        <div className="adminUsersUl flexc">
          <TextField
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="inputStyle" label={!!name ? '' : "Nome"} id="outlined-size-normal" placeholder={`Digite o Nome:`} type="text" />
          {!!nameError && <p className="errorP">* O Nome deve conter mais que 3 caracteres.</p>}
          <div className="userAdminDoubleInputs flexr">
            <TextField
              value={document}
              onChange={(e) => setDocument(e.target.value)}
              className="inputStyle"
              label={!!document ? '' : "Documento"}
              id="outlined-size-normal"
              placeholder={`Digite o Documento:'`}
              type="number" />
            <TextField
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="inputStyle" label={!!phone ? '' : "Telefone"} id="outlined-size-normal" placeholder={`Digite o Telefone:'`} type="number" />
          </div>
          {!!documentError && <p className="errorP">* O Documento deve ser valido.</p>}
          {!!phoneError && <p className="errorP" style={{ textAlign: "right" }}>* O Telefone deve ser valido.</p>}
          <TextField
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="inputStyle" label={!!email ? '' : "E-mail"} id="outlined-size-normal" placeholder={`Digite o E-mail:'`} type="text" />
          {!!emailError && <p className="errorP">* O E-mail deve ser valido.</p>}
          <div className="userAdminDoubleInputs flexr">
            <TextField
              onChange={(e) => setPassword(e.target.value)}
              className="inputStyle" label={!!password ? '' : "Senha"} id="outlined-size-normal" placeholder={`Digite a Senha:'`} type="password" />
            <TextField
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="inputStyle" label={!!confirmPassword ? '' : "Confirmar Senha"} id="outlined-size-normal" placeholder={`Confirme a Senha:'`} type="password" />
          </div>
          {!!passwordError && <p className="errorP">* Deve 8 ou mais caracteres, Letras Maiúsculas e Numeros.</p>}
          {!!confirmPasswordError && <p className="errorP" style={{ textAlign: "right" }}>* As senhas devem ser iguais.</p>}
        </div>
      </div>
    </div >
  );
}
