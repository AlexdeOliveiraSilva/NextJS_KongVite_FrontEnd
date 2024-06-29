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
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import ImageModal from "@/components/Modal/imageModal";

export default function EventsEdit() {
  const router = useRouter();
  const { KONG_URL, user, eventsType, eventsSubType, eventEdit, sendtos3 } = useContext(GlobalContext);
  const [name, setName] = useState();
  const [date, setDate] = useState();
  const [address, setAddress] = useState();
  const [place, setPlace] = useState();
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
  const [imageStack, setImageStack] = useState(false);
  const [typeStack, setTypeStack] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [imageToShow, setImageToShow] = useState("");

  const [alreadyPassType, setAlreadyPassType] = useState([]);
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
            place: place,
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
            image: data.image
          })
        })).json()

        return x
      } catch (error) {
      }
    }
  }

  async function deletePassTypes(passId) {
    let jwt = !!user?.jwt ? user.jwt : localStorage.getItem("user_jwt")
    let x;

    if (!!jwt && !!passId) {

      try {
        x = await fetch(`${KONG_URL}/companys/tycketsType/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': jwt
          },
          body: JSON.stringify({
            id: passId,
            situation: 2
          })
        })


        if (x.status == 200) {

          toast.success("Tipo de Convite Deletado.", {
            position: "top-right"
          });
          return x
        }
      } catch (error) {

        toast.error("Erro ao deletar Tipo de Convite.", {
          position: "top-right"
        });
      }
    }
  }

  async function addPassType(event) {
    event.preventDefault();

    let eventId = !!eventEdit ? eventEdit : localStorage.getItem("event_edit");
    let res;

    if (!!imageStack) {
      res = await fileUpload(eventId)

      if (!!res?.fileUrl && !!typeStack) {

        setImageURL(res?.fileUrl)



        setPassType([...passType, {
          name: typeStack,
          image: res?.fileUrl
        }]);

        setPassTypeObject({ name: '', image: '' });
      } else {
        if (!typeStack) {
          toast.error('Digite um nome para o Ingresso')
        }

        if (!res?.fileUrl) {
          toast.error('Erro ao fazer upload da Imagem')
        }
      }
    } else {
      toast.error('Adicione uma imagem')
    }
  };

  const deletePassType = (name, event, id) => {
    event.preventDefault();

    if (!!id) {
      deletePassTypes(id);
      const updatedPassType = alreadyPassType.filter(item => item.description !== name);
      setAlreadyPassType(updatedPassType);

    } else {

      const updatedPassType = passType.filter(item => item.name !== name);
      setPassType(updatedPassType);
    }
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
          setDate(formatDateToInput(x.date));
          setZipcode(x.zipcode);
          setAddress(x.address);
          setNumberAdress(x.number);
          setNeighborhood(x.neighborhood);
          setCity(x.city)
          setUf(x.uf)

          if (!!x.eventsClasses && x.eventsClasses.length > 0) {

            setPlace(x.eventsClasses[0]?.events?.place);
          }
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

        if (!x.message) {

          setAlreadyPassType(x)
        }
      } catch (error) {
        console.log("erro")
        return ""
      }
    } else {
      console.log("else")
    }
  }

  function fileToBase64(file) {

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result.split(',')[1];
        resolve(base64String);
      };
      reader.onerror = (error) => {
        reject('Erro ao converter arquivo para Base64: ' + error);
      };
    });
  }

  async function fileUpload(eventId) {
    let response;
    let x = await fileToBase64(imageStack);

    if (!!imageStack && !!eventId && x != undefined) {
      response = await sendtos3(eventId, 'png', x)

      return response
    } else {
      console.log("elsee")
    }

  }

  function formatDateToInput(dataString) {
    const data = new Date(dataString);

    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');
    const horas = String(data.getHours()).padStart(2, '0');
    const minutos = String(data.getMinutes()).padStart(2, '0');

    return `${ano}-${mes}-${dia}T${horas}:${minutos}`;
  }

  useEffect(() => {
    dataVerify();
  }, [name, uf, address, neighborhood, zipcode, city])

  useEffect(() => {
    getEvent();
    getPassTypes();
  }, [])

  useEffect(() => {

  }, [passType, imageURL])
  return (
    <div className="clienteMain flexr">
      <ToastContainer></ToastContainer>
      {!!imageToShow && <ImageModal close={() => setImageToShow('')} image={imageToShow}></ImageModal>}
      <div className="clienteContent flexc">

        <Separator color={"var(--grey-ligth)"} width="100%" height="1px"></Separator>
        <div className="clienteUl flexc" style={{ padding: "20px 0", height: "auto" }}>
          <div className="userAdminDoubleInputs flexr">
            <TextField
              onChange={(e) => setName(e.target.value)}
              value={name}
              focused={!!name ? true : false}
              className="inputStyle"
              label={"Nome do Evento"}
              id="outlined-size-normal"
              placeholder={`Digite o Nome:'`}
              type="text" />
            <div className="userAdminDoubleInputsTwo flexr">
              <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id="demo-simple-select-standard-label">Tipo</InputLabel>
                <Select
                  className="InputsTwoSelect"
                  label="Tipo"
                  labelId="demo-simple-select-label"
                  focused={!!type ? true : false}
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
              </FormControl>
              <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id="demo-simple-select-standard-label">Subtipo</InputLabel>
                <Select
                  className="InputsTwoSelect"
                  label="Subtipo"
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  focused={!!subType ? true : false}
                  value={subType}
                  onChange={(e) => setSubType(e.target.value)}
                >
                  {!!eventsSubType && eventsSubType.map((e, y) => {
                    return (
                      <MenuItem key={y} value={e.toUpperCase()}>{e}</MenuItem>
                    )
                  })}
                </Select>
              </FormControl>
              <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                <InputLabel id="demo-simple-select-standard-label">Notificar</InputLabel>
                <Select
                  className="InputsTwoSelect"
                  label="Notificar"
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={notifyUsersAboutDeletingInvitations}
                  onChange={(e) => setNotifyUsersAboutDeletingInvitations(e.target.value)}
                >
                  <MenuItem value={"SIM"}>Sim</MenuItem>
                  <MenuItem value={"NAO"}>Não</MenuItem>
                </Select>
              </FormControl>
            </div>
          </div>
          {!!nameError && <p className="errorP">* O Nome deve conter mais que 3 caracteres.</p>}
          <div className="userAdminDoubleInputs flexr">
            <TextField
              onChange={(e) => setDate(e.target.value)}
              focused={!!date ? true : false}
              label={"Data do Evento"}
              className="inputStyle"
              id="outlined-size-normal"
              value={date}
              placeholder={`Digite a Data:'`}
              type="datetime-local" />
            <TextField
              onChange={(e) => setZipcode(e.target.value)}
              className="inputStyle"
              value={zipcode}
              focused={!!zipcode ? true : false}
              label={"CEP"}
              id="outlined-size-normal"
              placeholder={`Digite o CEP:'`}
              type="number" />
          </div>
          {!!dateError && <p className="errorP">* Preencha uma Data.</p>}
          {!!cepError && <p className="errorP" style={{ textAlign: "right" }}>* Preencha um CEP.</p>}
          <div className="userAdminDoubleInputs flexr">
            <TextField
              onChange={(e) => setPlace(e.target.value)}
              className="inputStyle"
              value={place}
              focused={!!place ? true : false}
              label={"Local do evento"}
              id="outlined-size-normal"
              placeholder={`Local do evento:'`}
              type="text" />
            <TextField
              onChange={(e) => setAddress(e.target.value)}
              className="inputStyle"
              value={address}
              focused={!!address ? true : false}
              label={"Rua"}
              id="outlined-size-normal"
              placeholder={`Nome da Rua:'`}
              type="text" />
          </div>
          <div className="userAdminDoubleInputs flexr">
            <TextField
              onChange={(e) => setNumberAdress(e.target.value)}
              className="inputStyle"
              value={numberAdress}
              focused={!!numberAdress ? true : false}
              label={"Numero"}
              id="outlined-size-normal"
              placeholder={`Digite o Numero:'`}
              type="number" />
            <TextField
              onChange={(e) => setNeighborhood(e.target.value)}
              className="inputStyle"
              value={neighborhood}
              focused={!!neighborhood ? true : false}
              label={"Bairro"}
              id="outlined-size-normal"
              placeholder={`Digite o Bairro:'`}
              type="text" />
            <TextField
              onChange={(e) => setCity(e.target.value)}
              className="inputStyle"
              value={city}
              focused={!!city ? true : false}
              label={"Cidade"}
              id="outlined-size-normal"
              placeholder={`Digite a Cidade:'`}
              type="text" />
            <TextField
              onChange={(e) => setUf(e.target.value)}
              className="inputStyle"
              value={uf}
              focused={!!uf ? true : false}
              label={"Estado"}
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
        <div className="passTypeHeader flexc">
          <div className="passTypeTitle flexr">
            <h1>Tipo de Entrada</h1>
          </div>
          <div className="passTypeBlockFirts flexr">
            <TextField
              onChange={(e) => setTypeStack(e.target.value)}
              className="inputStyle"
              label={!!passTypeObject.name ? '' : "Tipo do Ingresso"}
              value={typeStack}
              id="outlined-size-normal"
              placeholder={`Tipo do Ingresso:`}
              type="text" />
            <TextField
              onChange={(e) => setImageStack(e.target.files[0])}
              className="inputStyle"
              value={imageStack[0]}
              id="outlined-size-normal"
              type="file" />
            <button
              onClick={(event) => addPassType(event)}
              style={{ minWidth: "110px", fontSize: "16px" }}
              className="btnBlue">Adicionar</button>
          </div>
          <div className="passTypeBlockFirts flexr" style={{ justifyContent: "flex-end" }}>
            <p style={{ fontSize: "12px", color: "red" }}>* Preferência de Imagem: 400px X 717px e até 2Mb</p>
          </div>
        </div>
        <div className="passTypeFull flexc">
          <div className="passTypeBlock flexr">
            {alreadyPassType?.length > 0 &&
              alreadyPassType.map((e, y) => {
                return (
                  <div
                    onClick={(event) => setImageToShow(e.image)}
                    key={y} className="passTypeBlockItem flexr">
                    <p>{e.description}</p>
                    <CloseIcon
                      onClick={(event) => { event.stopPropagation(), deletePassType(e.description, event, e.id) }}
                      style={{ color: "#ffffff" }}></CloseIcon>
                  </div>
                )
              })
            }
            {passType?.length > 0 &&
              passType.map((e, y) => {

                return (
                  <div
                    onClick={(event) => setImageToShow(e.image)}
                    key={y} className="passTypeBlockItem flexr">
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
        <div className="adminUsersHeader flexr" style={{ margin: "15px 0" }}>
          {/* <div className="adminUsersTitle flexr">
            <h1>Editar Evento{!!eventData && `- ${eventData.name}`}</h1>
          </div> */}
          <div className="adminUsersAdd flexr">
            <button
              onClick={(event) => editTheEvent(event)}
              style={{ minWidth: "150px" }}
              className="btnOrange">{!!isLoading ? <Loader></Loader> : "Salvar"}</button>
          </div>
        </div>
      </div>
    </div >
  );
}
