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
  const { KONG_URL, user } = useContext(GlobalContext);
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
  const [invitesAvaliableError, setInvitesAvaliableError] = useState(false);

  // USER DATA
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
  const [isLoading, setisLoading] = useState(false);

  function nameVerify() {
    if (name?.length > 0 && name?.length < 4) {
      setNameError(true)
    } else {
      setNameError(false)
    }
    if (nameCompany?.length > 0 && nameCompany?.length < 4) {
      setNameCompanyError(true)
    } else {
      setNameCompanyError(false)
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
    if ((phone?.length > 0 && phone?.length < 11) || phone?.length > 11) {
      setPhoneError(true)
    } else {
      setPhoneError(false)
    }
    if ((phoneCompany?.length > 0 && phoneCompany?.length < 11) || phoneCompany?.length > 11) {
      setPhoneCompanyError(true)
    } else {
      setPhoneCompanyError(false)
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

  async function addNewCompany(e) {
    e.preventDefault();

    let jwt = !!user?.jwt ? user.jwt : localStorage.getItem("user_jwt")

    let x;

    if (!!jwt && (
      nameCompanyError == false &&
      emailCompanyError == false &&
      phoneCompanyError == false &&
      documentCompanyError == false &&
      nameError == false &&
      documentError == false &&
      emailError == false &&
      phoneError == false &&
      passwordError == false &&
      confirmPasswordError == false
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
            name: nameCompany,
            document: documentCompany,
            phone: phoneCompany,
            email: emailCompany,
            invitesAvaliable: invitesAvaliable,
            users: {
              name: name,
              document: document,
              phone: phone,
              email: email,
              password: password
            }
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

  function changeStep(e) {
    e.preventDefault();
    console.log(nameCompany, documentCompany, emailCompany, phoneCompany)

    if (nameCompany?.length > 0 && documentCompany?.length > 0 && emailCompany?.length > 0 && phoneCompany?.length > 0) {
      if (nameCompanyError == false && emailCompanyError == false && phoneCompanyError == false && documentCompanyError == false) {
        setName("");
        setDocument("");
        setEmail("");
        setPhone("");
        setStep(2);
      } else {
        toast.error("Erro ao Cadastrar, tente novamente.", {
          position: "top-right"
        });
      }
    } else {
      nameVerify();
      documentVerify();
      emailVerify();
      phoneVerify();
      passwordVerify();
      confirmPasswordVerify();
      toast.error("Erro ao Cadastrar, tente novamente.", {
        position: "top-right"
      });
    }
  }


  useEffect(() => {
    nameVerify();
    documentVerify();
    emailVerify();
    phoneVerify();
    passwordVerify();
    confirmPasswordVerify();
  }, [name, email, document, phone, password, confirmPassword, nameCompany, documentCompany, emailCompany, phoneCompany])

  console.log(name, email, document, phone, password, confirmPassword, nameCompany, documentCompany, emailCompany, phoneCompany)

  return (
    <div className="adminUsersMain flexr">
      <ToastContainer></ToastContainer>
      <div className="adminUsersContent flexc">
        <div className="adminUsersHeader flexr">
          <div className="adminUsersTitle flexr">
            <h1>Nova Empresa</h1>
          </div>
          <div className="adminUsersAdd flexr">
            <button
              onClick={step == 1 ? (event) => changeStep(event) : (event) => addNewCompany(event)}
              style={{ minWidth: "150px" }}
              className="btnOrange">{!!isLoading ? <Loader></Loader> : step == 1 ? "Avançar" : "Salvar"}</button>
          </div>
        </div>
        <Separator color={"var(--grey-ligth)"} width="100%" height="1px"></Separator>
        <div className="adminUsersUl flexc">
          {step == 1 ?
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
            :
            <div className="adminUsersUl flexc">
              <div className="adminUsersUlTitle flexr"><h3>Dados do usuário</h3></div>
              <TextField
                onChange={(e) => setName(e.target.value)}
                value={name}
                className="inputStyle"
                label={!!name ? '' : "Nome do usuário"}
                id="outlined-size-normal" placeholder={`Digite o Nome:'`} type="text" />
              {!!nameError && <p className="errorP">* O Nome deve conter mais que 3 caracteres.</p>}
              <div className="userAdminDoubleInputs flexr">
                <TextField
                  onChange={(e) => setDocument(e.target.value)}
                  value={document}
                  className="inputStyle"
                  label={!!document ? '' : "Documento do usuário"}
                  id="outlined-size-normal"
                  placeholder={`Digite o Documento:'`}
                  type="number" />
                <TextField
                  onChange={(e) => setPhone(e.target.value)}
                  className="inputStyle"
                  label={!!phone ? '' : "Telefone do usuário"}
                  id="outlined-size-normal" placeholder={`Digite o Telefone:'`} type="number" />
              </div>
              {!!documentError && <p className="errorP">* O Documento deve ser valido.</p>}
              {!!phoneError && <p className="errorP" style={{ textAlign: "right" }}>* O Telefone deve ser valido.</p>}
              <TextField
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className="inputStyle"
                label={!!email ? '' : "E-mail do usuário"}
                id="outlined-size-normal" placeholder={`Digite o E-mail:'`} type="text" />
              {!!emailError && <p className="errorP">* O E-mail deve ser valido.</p>}
              <div className="userAdminDoubleInputs flexr">
                <TextField
                  onChange={(e) => setPassword(e.target.value)}
                  className="inputStyle"
                  value={password}
                  label={!!password ? '' : "Senha do usuário"}
                  id="outlined-size-normal" placeholder={`Digite a Senha:'`} type="password" />
                <TextField
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="inputStyle"
                  value={confirmPassword}
                  label={!!confirmPassword ? '' : "Confirmar Senha"}
                  id="outlined-size-normal" placeholder={`Confirme a Senha:'`} type="password" />
              </div>
              {!!passwordError && <p className="errorP">* Deve 8 ou mais caracteres, Letras Maiúsculas e Numeros.</p>}
              {!!confirmPasswordError && <p className="errorP" style={{ textAlign: "right" }}>* As senhas devem ser iguais.</p>}
            </div>
          }


        </div>
      </div>
    </div >
  );
}
