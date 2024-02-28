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
import CloseIcon from '@mui/icons-material/Close';

export default function EventsEdit() {
  const router = useRouter();
  const { KONG_URL, user, eventsType, eventsSubType, eventEdit } = useContext(GlobalContext);
  const [name, setName] = useState();
  const [date, setDate] = useState();
  const [address, setAddress] = useState();
  const [zipcode, setZipcode] = useState();
  const [numberAdress, setNumberAdress] = useState();
  const [neighborhood, setNeighborhood] = useState();
  const [city, setCity] = useState();
  const [uf, setUf] = useState();
  const [notifyUsersAboutDeletingInvitations, setNotifyUsersAboutDeletingInvitations] = useState("NAO");
  const [type, setType] = useState("");
  const [subType, setSubType] = useState("");
  const [nameError, setNameError] = useState(false);
  const [dateError, setDateError] = useState(false);
  const [cepError, setCepError] = useState(false);
  const [adressError, setAdressErrorError] = useState(false);
  const [adressNumberError, setAdressNumberError] = useState(false);
  const [neighborhoodError, setNeighborhoodError] = useState(false);
  const [cityError, setCityError] = useState(false);
  const [ufError, setUfError] = useState(false);
  const [passType, setPassType] = useState([]);
  const [passTypeObject, setPassTypeObject] = useState({
    name: "",
    image: ""
  });
  const [isLoading, setisLoading] = useState(false);

  const [eventData, setEventData] = useState();

  function dataVerify() {
    if (name?.length > 0 && name?.length < 2) {
      setNameError(true)
    } else {
      setNameError(false)
    }

    if (address?.length > 0 && address?.length < 2) {
      setAdressErrorError(true)
    } else {
      setAdressErrorError(false)
    }

    if (zipcode?.length > 0 && zipcode?.length < 6) {
      setCepError(true)
    } else {
      setCepError(false)
    }

    if (neighborhoodError?.length > 0 && neighborhoodError?.length < 4) {
      setNeighborhoodError(true)
    } else {
      setNeighborhoodError(false)
    }

    if (city?.length > 0 && city?.length < 4) {
      setCityError(true)
    } else {
      setCityError(false)
    }

    if (uf?.length > 0 && uf?.length < 2) {
      setUfError(true)
    } else {
      setUfError(false)
    }
  }

  async function editTheEvent(e) {
    e.preventDefault();
    let jwt = !!user?.jwt ? user.jwt : localStorage.getItem("user_jwt")
    let eventId = !!eventEdit ? eventEdit : localStorage.getItem("event_edit");


    let x;

    if (!!jwt && !!eventId && (
      nameError == false &&
      dateError == false &&
      cepError == false &&
      neighborhoodError == false &&
      cityError == false &&
      adressNumberError == false &&
      adressError == false
    )) {
      setisLoading(true)
      try {
        x = await (await fetch(`${KONG_URL}/companys/events/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': jwt
          },
          body: JSON.stringify({
            id: eventId,
            name: name,
            date: date,
            address: address,
            zipcode: zipcode,
            number: numberAdress,
            neighborhood: neighborhood,
            city: city,
            uf: uf,
            notifyUsersAboutDeletingInvitations: notifyUsersAboutDeletingInvitations,
            type: type,
            subType: subType
          })
        })).json()

        if (!x?.message) {
          toast.success("Evento Editado.", {
            position: "top-right"
          });


          for (let index = 0; index < passType.length; index++) {
            addPassTypes(jwt, eventId, passType[index]);
          }

          setisLoading(false)

          router.push('/cliente/eventos/');
        } else {
          toast.error("Erro ao Editar, tente novamente.", {
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

  async function addPassTypes(jwt, event, data) {

    if (!!jwt && !!event && !!data) {
      try {
        x = await (await fetch(`${KONG_URL}/companys/tycketsType/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': jwt
          },
          body: JSON.stringify({
            description: data.name,
            eventsId: event,
            image: ""
          })
        })).json()

        return x
      } catch (error) {
      }
    }
  }

  const addPassType = (event) => {
    event.preventDefault();

    if (passTypeObject.name.length != 0 && passTypeObject.image.length != 0) {
      setPassType([...passType, passTypeObject]);

      setPassTypeObject({ name: '', image: '' });
    }
  };

  const deletePassType = (name, event) => {
    event.preventDefault();

    const updatedPassType = passType.filter(item => item.name !== name);

    setPassType(updatedPassType);
  };

  async function getEvent() {
    let x;
    let jwt = !!user?.jwt ? user.jwt : localStorage.getItem("user_jwt")
    let eventId = !!eventEdit ? eventEdit : localStorage.getItem("event_edit");

    if (!!jwt && !!eventId) {
      try {

        x = await (await fetch(`${KONG_URL}/companys/events/get/${eventId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': jwt
          }
        })).json()

        if (!x?.message) {
          setEventData(x);
          setName(x.name);
          setType(x.type);
          setSubType(x.subType);
          setNotifyUsersAboutDeletingInvitations(x.notifyUsersAboutDeletingInvitations);
          setDate(x.date);
          setZipcode(x.zipcode);
          setAddress(x.address);
          setNumberAdress(x.number);
          setNeighborhood(x.neighborhood);
          setCity(x.city)
          setUf(x.uf)
        }

      } catch (error) {

        return ""
      }
    } else {
      console.log("else")
    }
  }

  async function getPassTypes() {
    let jwt = !!user?.jwt ? user.jwt : localStorage.getItem("user_jwt")
    let eventId = !!eventEdit ? eventEdit : localStorage.getItem("event_edit");
    let x;

    if (!!jwt && !!eventId) {
      try {

        x = await (await fetch(`${KONG_URL}/companys/tycketsType/${eventId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': jwt
          }
        })).json()

        if (!x?.message) {

          for (let index = 0; index < x.length; index++) {
            setPassType([...passType, {
              name: x[index].description,
              image: x[index].image
            }]);
          }
        }
      } catch (error) {
        console.log("erro")
        return ""
      }
    } else {
      console.log("else")
    }
  }

  useEffect(() => {
    dataVerify();
  }, [name, uf, address, neighborhood, zipcode, city])

  useEffect(() => {
    getEvent();
    getPassTypes();
  }, [])

  return (
    <div className="clienteMain flexr">
      <ToastContainer></ToastContainer>
      <div className="clienteContent flexc">
        <div className="adminUsersHeader flexr">
          <div className="adminUsersTitle flexr">
            <h1>Editar Evento{!!eventData && `- ${eventData.name}`}</h1>
          </div>
          <div className="adminUsersAdd flexr">
            <button
              onClick={(event) => editTheEvent(event)}
              style={{ minWidth: "150px" }}
              className="btnOrange">{!!isLoading ? <Loader></Loader> : "Salvar"}</button>
          </div>
        </div>
        <Separator color={"var(--grey-ligth)"} width="100%" height="1px"></Separator>
        <div className="clienteUl flexc">
          <div className="userAdminDoubleInputs flexr">
            <TextField
              onChange={(e) => setName(e.target.value)}
              value={name}
              className="inputStyle"
              label={!!name ? '' : "Nome do Evento"}
              id="outlined-size-normal"
              placeholder={`Digite o Nome:'`}
              type="text" />
            <div className="userAdminDoubleInputsTwo flexr">
              <Select
                className="InputsTwoSelect"
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                {!!eventsType && eventsType.map((e, y) => {
                  return (
                    <MenuItem key={y} value={e.toUpperCase()}>{e}</MenuItem>
                  )
                })}
              </Select>
              <Select
                className="InputsTwoSelect"
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={subType}
                onChange={(e) => setSubType(e.target.value)}
              >
                {!!eventsSubType && eventsSubType.map((e, y) => {
                  return (
                    <MenuItem key={y} value={e.toUpperCase()}>{e}</MenuItem>
                  )
                })}
              </Select>
              <Select
                className="InputsTwoSelect"
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={notifyUsersAboutDeletingInvitations}
                onChange={(e) => setNotifyUsersAboutDeletingInvitations(e.target.value)}
              >
                <MenuItem value={"SIM"}>Sim</MenuItem>
                <MenuItem value={"NAO"}>Não</MenuItem>
              </Select>
            </div>
          </div>
          {!!nameError && <p className="errorP">* O Nome deve conter mais que 3 caracteres.</p>}
          <div className="userAdminDoubleInputs flexr">
            <TextField
              onChange={(e) => setDate(e.target.value)}
              className="inputStyle"
              id="outlined-size-normal"
              value={date}
              placeholder={`Digite a Data:'`}
              type="datetime-local" />
            <TextField
              onChange={(e) => setZipcode(e.target.value)}
              className="inputStyle"
              value={zipcode}
              label={!!zipcode ? '' : "CEP"}
              id="outlined-size-normal"
              placeholder={`Digite o CEP:'`}
              type="number" />
          </div>
          {!!dateError && <p className="errorP">* Preencha uma Data.</p>}
          {!!cepError && <p className="errorP" style={{ textAlign: "right" }}>* Preencha um CEP.</p>}
          <TextField
            onChange={(e) => setAddress(e.target.value)}
            className="inputStyle"
            value={address}
            label={!!address ? '' : "Rua"}
            id="outlined-size-normal"
            placeholder={`Nome da Rua:'`}
            type="text" />
          <div className="userAdminDoubleInputs flexr">
            <TextField
              onChange={(e) => setNumberAdress(e.target.value)}
              className="inputStyle"
              value={numberAdress}
              label={!!numberAdress ? '' : "Numero"}
              id="outlined-size-normal"
              placeholder={`Digite o Numero:'`}
              type="number" />
            <TextField
              onChange={(e) => setNeighborhood(e.target.value)}
              className="inputStyle"
              value={neighborhood}
              label={!!neighborhood ? '' : "Bairro"}
              id="outlined-size-normal"
              placeholder={`Digite o Bairro:'`}
              type="text" />
            <TextField
              onChange={(e) => setCity(e.target.value)}
              className="inputStyle"
              value={city}
              label={!!city ? '' : "Cidade"}
              id="outlined-size-normal"
              placeholder={`Digite a Cidade:'`}
              type="text" />
            <TextField
              onChange={(e) => setUf(e.target.value)}
              className="inputStyle"
              value={uf}
              label={!!uf ? '' : "Estado"}
              id="outlined-size-normal"
              placeholder={`Digite o Estado:'`}
              type="text" />
          </div>

          {!!adressError && <p className="errorP">* Preencha um Endereço.</p>}
          {!!adressNumberError && <p className="errorP">* Preencha um Numero.</p>}
          {!!neighborhoodError && <p className="errorP">* Preencha um Bairro.</p>}
          {!!cityError && <p className="errorP">* Preencha uma Cidade.</p>}
          {!!ufError && <p className="errorP">* Preencha um Estado.</p>}
        </div>
        <Separator color={"var(--grey-ligth)"} width="100%" height="1px"></Separator>
        <div className="passTypeHeader flexr">
          <div className="passTypeTitle flexr">
            <h1>Tipo de Entrada</h1>
          </div>
          <div className="passTypeBlockFirts flexr">
            <TextField
              onChange={(e) => setPassTypeObject({ image: passTypeObject.image, name: e.target.value })}
              className="inputStyle"
              label={!!passTypeObject.name ? '' : "Tipo do Ingresso"}
              value={passTypeObject.name}
              id="outlined-size-normal"
              placeholder={`Tipo do Ingresso:`}
              type="text" />
            <TextField
              onChange={(e) => setPassTypeObject({ name: passTypeObject.name, image: e.target.files[0] })}
              className="inputStyle"
              value={passTypeObject.image[0]}
              id="outlined-size-normal"
              type="file" />
            <button
              onClick={(event) => addPassType(event)}
              style={{ minWidth: "110px", fontSize: "16px" }}
              className="btnBlue">Adicionar</button>
          </div>
        </div>
        <div className="passTypeFull flexc">
          <div className="passTypeBlock flexr">
            {passType?.length > 0 &&
              passType.map((e, y) => {
                return (
                  <div key={y} className="passTypeBlockItem flexr">
                    <p>{e.name}</p>
                    <CloseIcon
                      onClick={(event) => deletePassType(e.name, event)}
                      style={{ color: "#ffffff" }}></CloseIcon>
                  </div>
                )
              })
            }
          </div>
        </div >
      </div>
    </div >
  );
}
