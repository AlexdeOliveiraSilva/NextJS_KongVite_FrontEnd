'use client'

import { useState, useEffect, useContext } from "react"
import { GlobalContext } from "@/context/global";
import { useRouter } from "next/navigation";
import Separator from "@/components/fragments/separatorLine";
import Loader from "@/components/fragments/loader";
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import SendInviteModal from "@/components/Modal/sendInvites";

export default function GuestAdd() {
  const router = useRouter();
  const { KONG_URL, user, eventEdit, turmaEdit, setGuestEditId } = useContext(GlobalContext);

  const [passType, setPassType] = useState([])
  const [sendModalIsOpen, setSendModalIsOpen] = useState(false);
  const [name, setName] = useState();
  const [document, setDocument] = useState();
  const [phone, setPhone] = useState();
  const [email, setEmail] = useState();
  const [selfPass, setSelfPass] = useState();
  const [invitesAvaible, setInvitesAvaible] = useState([]);

  const [nameError, setNameError] = useState(false);
  const [documentError, setDocumentError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [emailError, setEmailError] = useState(false);



  const [isLoading, setisLoading] = useState(false);

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
    var regexEmail = /^[a-zA-Z][a-zA-Z0-9_\-.]*@[a-zA-Z0-9]+([.-][a-zA-Z0-9]+)*([.][a-zA-Z]{2,})+$/;

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

  async function addNewGuest(e) {
    e.preventDefault();

    if (!checkInputs()) {
      toast.error("Preencha todos os campos")
      return ""
    }

    let jwt = !!user?.jwt ? user.jwt : localStorage.getItem("user_jwt")
    let event = !!eventEdit ? eventEdit : localStorage.getItem("event_edit")
    let turma = !!turmaEdit ? turmaEdit : localStorage.getItem("turma_edit")

    let x;

    if (!!jwt && !!event && !!turma && (
      nameError == false &&
      documentError == false &&
      emailError == false &&
      phoneError == false
    )) {
      setisLoading(true)
      try {
        x = await (await fetch(`${KONG_URL}/companys/turma/student/${event}/${turma}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': jwt
          },
          body: JSON.stringify({
            name: name,
            document: document,
            phone: phone,
            email: email,
            tycketsTypeId: selfPass,
            guestsTicketsTypeNumber: invitesAvaible
          })
        })).json()

        if (!x?.message) {
          toast.success("Convidado cadastrado.", {
            position: "top-right"
          });
          setisLoading(false)

          openSendModal();

        } else {
          toast.error("Erro ao Cadastrar, tente novamente.", {
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

  async function getPassTypes() {
    let y = !!user?.jwt ? user.jwt : localStorage.getItem("user_jwt")
    let z = !!eventEdit ? eventEdit : localStorage.getItem("event_edit");
    let x;

    if (!!y && !!z) {
      try {

        x = await (await fetch(`${KONG_URL}/companys/tycketsType/${z}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': y
          }
        })).json()

        if (!x?.message) {
          setPassType(x)
          return x
        }
      } catch (error) {
        console.log("erro")
        return ""
      }
    } else {
      console.log("else")
    }
  }


  const handleInputChange = (value, typeId) => {
    let updatedInvites = [...invitesAvaible];


    const existingInvite = updatedInvites.find(invite => invite.tycketsTypeId === typeId);


    if (!existingInvite) {
      setInvitesAvaible([...updatedInvites, {
        tycketsTypeId: typeId,
        number: value
      }]);
    } else {

      const updatedInvitesCopy = updatedInvites.map(invite =>
        invite.tycketsTypeId === typeId ? { ...invite, number: value } : invite
      );
      setInvitesAvaible(updatedInvitesCopy);
    }
  };

  useEffect(() => {
    nameVerify();
    documentVerify();
    emailVerify();
    phoneVerify();

  }, [name, email, document, phone])

  useEffect(() => {
    getPassTypes();
  }, [])

  function checkInputs() {
    if (!!name && !!selfPass && !!document && !!email && !!phone) {
      return true
    } else {
      return false
    }
  }

  function openSendModal() {
    setSendModalIsOpen(true);
  }

  function closeSendModal() {
    setSendModalIsOpen(false);
  }


  return (
    <div className="adminUsersMain flexr">
      <ToastContainer></ToastContainer>
      {sendModalIsOpen == true && <SendInviteModal close={() => closeSendModal()} isAdd={true}></SendInviteModal>}
      <div className="adminUsersContent flexc">
        <div className="adminUsersHeader flexr">
          <div className="adminUsersTitle flexr">
            <h1>Novo Formando</h1>
          </div>
          <div className="adminUsersAdd flexr">
            <button
              onClick={(event) => addNewGuest(event)}
              style={{ minWidth: "150px" }}
              className="btnOrange">{!!isLoading ? <Loader></Loader> : "Salvar"}</button>
          </div>
        </div>
        <Separator color={"var(--grey-ligth)"} width="100%" height="1px"></Separator>
        <div className="adminUsersUl flexc" style={{ alignItems: "flex-start", padding: '10px 20px 0 20px' }}>
          <TextField
            focused={!!name ? true : false}
            onChange={(e) => setName(e.target.value)}
            className="inputStyle" label={"Nome"} id="outlined-size-normal" placeholder={`Digite o Nome:'`} type="text" />
          {!!nameError && <p className="errorP">* O Nome deve conter mais que 3 caracteres.</p>}
          <div className="userAdminDoubleInputs flexr">
            <TextField
              focused={!!document ? true : false}
              onChange={(e) => setDocument(e.target.value)}
              className="inputStyle"
              label={"Documento"}
              id="outlined-size-normal"
              placeholder={`Digite o Documento:'`}
              type="number" />
            <TextField
              focused={!!phone ? true : false}
              onChange={(e) => setPhone(e.target.value)}
              className="inputStyle" label={"Telefone"} id="outlined-size-normal" placeholder={`Digite o Telefone:'`} type="number" />
          </div>
          {!!documentError && <p className="errorP">* O Documento deve ser valido.</p>}
          {!!phoneError && <p className="errorP" style={{ textAlign: "right" }}>* O Telefone deve ser valido.</p>}


          <div className="userAdminDoubleInputs flexr">
            <TextField
              focused={!!email ? true : false}
              onChange={(e) => setEmail(e.target.value)}
              className="inputStyle" label={"E-mail"} id="outlined-size-normal" placeholder={`Digite o E-mail:'`} type="text" />

            <FormControl className="InputsTwoSelect" style={{ minWidth: "200px" }}>
              <InputLabel id="demo-simple-select-label">Tipo do Ingresso</InputLabel>
              <Select
                style={{
                  minWidth: "200px"
                }}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={selfPass}
                onChange={(e) => setSelfPass(e.target.value)}
              >
                {!!passType ?
                  passType.map((e, y) => (
                    <MenuItem key={y} value={e.id}>
                      {e.description}
                    </MenuItem>
                  ))
                  :
                  <MenuItem value={999}>Sem opções</MenuItem>
                }
              </Select>
            </FormControl>
          </div>
          {!!emailError && <p className="errorP">* O E-mail deve ser valido.</p>}
          <div className="userAdminDoubleInputs flexr" style={{ justifyContent: "flex-start" }}>
            {!!passType ?
              passType.map((e, y) => (
                <div className="invitesTypeDiv flexc" key={y}>
                  <p><span>{`Ingressos - ${e.description}`}</span></p>
                  <p>Quantidade</p>
                  <TextField
                    onChange={(event) => handleInputChange(event.target.value, e.id)}
                    className="inputStyle"
                    id="outlined-size-normal"
                    placeholder={`Digite a Quantidade:'`}
                    type="number"
                    defaultValue={0}
                  />
                </div>
              ))
              :
              <MenuItem value={999}>Sem opções</MenuItem>
            }
          </div>
        </div>
      </div>
    </div >
  );
}
