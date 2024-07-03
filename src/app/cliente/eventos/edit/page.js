'use client'

import { useState, useEffect, useContext } from "react"
import { GlobalContext } from "@/context/global";
import { useRouter } from "next/navigation";
import Separator from "@/components/fragments/separatorLine";
import Loader from "@/components/fragments/loader";
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { FaLongArrowAltRight } from "react-icons/fa";
import ImageModal from "@/components/Modal/imageModal";
import { TiPlus } from "react-icons/ti";
import { FaImage } from "react-icons/fa";
import DeleteIcon from '@mui/icons-material/Delete';
import moment from "moment";


export default function EventsEdit() {
  const router = useRouter();
  const { KONG_URL, user, eventsType, eventsSubType, eventEdit, sendtos3 } = useContext(GlobalContext);
  const [name, setName] = useState();
  const [date, setDate] = useState();
  const [onlyDate, setOnlyDate] = useState();
  const [onlyHour, setOnlyHour] = useState();
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
  const [isFileUploading, setisFileUploading] = useState(false);

  const [eventData, setEventData] = useState();

  const colors = [
    '#0B192E',
    '#2E64AD',
    '#18A87C',
    '#00E1E2'
  ];

  const statesBR = [
    'AC',
    'AL',
    'AP',
    'AM',
    'BA',
    'CE',
    'DF',
    'ES',
    'GO',
    'MA',
    'MS',
    'MT',
    'MG',
    'PA',
    'PB',
    'PR',
    'PE',
    'PI',
    'RJ',
    'RN',
    'RS',
    'RO',
    'RR',
    'SC',
    'SP',
    'SE',
    'TO'
  ]

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
      let w = combineDateTime()



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
            date: w,
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
        setisFileUploading(true)
        setImageURL(res?.fileUrl)



        setPassType([...passType, {
          name: typeStack,
          image: res?.fileUrl
        }]);

        setPassTypeObject({ name: '', image: '' });

        setisFileUploading(false)
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
    setisLoading(true)
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
        console.log(formatDateToInput(x.date))
        if (!x?.message) {

          setEventData(x);
          setName(x.name);
          setType(x.type);
          setSubType(x.subType);
          setNotifyUsersAboutDeletingInvitations(x.notifyUsersAboutDeletingInvitations);
          splitDateTime(formatDateToInput(x.date));
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
    setisLoading(false)
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

    // data.setHours(data.getHours() - 3);

    // const ano = data.getFullYear();
    // const mes = String(data.getMonth() + 1).padStart(2, '0');
    // const dia = String(data.getDate()).padStart(2, '0');
    // const horas = String(data.getHours()).padStart(2, '0');
    // const minutos = String(data.getMinutes()).padStart(2, '0');

    return moment(dataString).utc().format("YYYY-MM-DD HH:mm");

  }

  const combineDateTime = () => {
    if (onlyDate && onlyHour) {
      return `${onlyDate}T${onlyHour}`;
    }
    return '';
  };

  const splitDateTime = (date) => {
    const [datePart, timePart] = date.split(' ');
    setOnlyDate(datePart);
    setOnlyHour(timePart);
  };

  useEffect(() => {
    dataVerify();
  }, [name, uf, address, neighborhood, zipcode, city])

  useEffect(() => {
    getEvent();
    getPassTypes();
  }, [])

  useEffect(() => {

  }, [passType, imageURL])
  console.log(notifyUsersAboutDeletingInvitations)
  return (
    <>
      <div className="clientEventMain flexc">
        <ToastContainer></ToastContainer>
        {!!imageToShow && <ImageModal close={() => setImageToShow('')} image={imageToShow}></ImageModal>}
        <div className="margin5percent" style={{ position: 'relative' }}>
          <div className="newTopSitemap flexc" style={{ alignItems: 'flex-start' }}>
            <h1 className=" flexr gap-2" style={{ fontWeight: 600, marginRight: 10 }}>
              <a
                href="/cliente/eventos/"
                style={{ cursor: 'pointer' }}>Eventos</a>
              <FaLongArrowAltRight />
              <span >Editar Evento</span>
            </h1>
            <p>Atualize as informações e tipos de ingresso do Evento.</p>
          </div>

          <div className="clientEventInputBox flexc">
            <div className="inputNewStyle flexr">
              <p>Nome do Evento</p>
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                type="text"
              ></input>
            </div>

            {!!nameError && <p className="errorP" style={{ margin: '-10px 0 10px 0' }}>* O Nome deve conter mais que 3 caracteres.</p>}

            <div className="inputNewStyle flexr">
              <p>Local do Evento</p>
              <input
                onChange={(e) => setPlace(e.target.value)}
                value={place}
                type="text"
              ></input>
            </div>

            <div className="inputNewStyleDouble flexr">
              <div className="inputNewStyle flexr">
                <p>Tipo do Evento</p>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  {!!eventsType && eventsType.map((e, y) => {
                    return (
                      <option key={y} value={e.toUpperCase()}>{e}</option>
                    )
                  })}
                </select>
              </div>
              <div className="inputNewStyle flexr">
                <p style={{ textAlign: 'center' }}>Periodo</p>
                <select
                  value={subType}
                  onChange={(e) => setSubType(e.target.value)}
                >
                  {!!eventsSubType && eventsSubType.map((e, y) => {
                    return (
                      <option key={y} value={e.toUpperCase()}>{e}</option>
                    )
                  })}
                </select>
              </div>
            </div>

            <div className="inputNewStyleDouble flexr">
              <div className="inputNewStyle flexr">
                <p>Data</p>
                <input
                  onChange={(e) => setOnlyDate(e.target.value)}
                  value={onlyDate}
                  type="date"
                />
              </div>
              <div className="inputNewStyle flexr">
                <p style={{ textAlign: 'center' }}>Horário</p>
                <input
                  onChange={(e) => setOnlyHour(e.target.value)}
                  value={onlyHour}
                  type="time"
                />
              </div>
            </div>
            {!!dateError && <p className="errorP" style={{ margin: '-10px 0 10px 0' }}>* Preencha uma Data.</p>}

            <div className="inputNewStyleDouble flexr" style={{ justifyContent: 'flex-start' }}>
              <div className="inputNewStyle DoubleUnique flexr">
                <p>CEP</p>
                <input
                  onChange={(e) => setZipcode(e.target.value)}
                  value={zipcode}
                  type="number"
                />
              </div>

            </div>
            {!!cepError && <p className="errorP" style={{ margin: '-10px 0 10px 0' }}>* Preencha um CEP válido.</p>}

            <div className="inputNewStyle flexr">
              <p>Endereço</p>
              <input
                onChange={(e) => setAddress(e.target.value)}
                value={address}
                type="text"
              ></input>
            </div>
            {!!adressError && <p className="errorP">* Preencha um Endereço.</p>}

            <div className="inputNewStyleDouble flexr">
              <div className="inputNewStyle flexr">
                <p>Número</p>
                <input
                  onChange={(e) => setNumberAdress(e.target.value)}
                  value={numberAdress}
                  type="number"
                />
              </div>
              <div className="inputNewStyle flexr">
                <p style={{ textAlign: 'center' }}>Bairro</p>
                <input
                  onChange={(e) => setNeighborhood(e.target.value)}
                  value={neighborhood}
                  type="text" />
              </div>
            </div>
            {!!adressNumberError && <p className="errorP" style={{ margin: '-10px 0 10px 0' }}>* Preencha um Numero.</p>}
            {!!neighborhoodError && <p className="errorP" style={{ margin: '-10px 0 10px 0' }}>* Preencha um Bairro.</p>}

            <div className="inputNewStyleDouble flexr">
              <div className="inputNewStyle flexr">
                <p>Cidade</p>
                <input
                  onChange={(e) => setCity(e.target.value)}
                  value={city}
                  type="text" />
              </div>
              <div className="inputNewStyle flexr">
                <p style={{ textAlign: 'center' }}>Estado</p>
                <select
                  onChange={(e) => setUf(e.target.value)}
                  value={uf}
                >
                  {statesBR.map((e, y) => {
                    return (
                      <option key={y}>{e}</option>
                    )
                  })}
                </select>
              </div>
            </div>
            {!!cityError && <p className="errorP" style={{ margin: '-10px 0 10px 0' }}>* Preencha uma Cidade.</p>}
            {!!ufError && <p className="errorP" style={{ margin: '-10px 0 10px 0' }}>* Preencha um Estado.</p>}

            <div className="inputNewStyle flexr">
              <p>Notificações</p>
              <div className="inputNotifyDiv flexr">
                <h6
                  style={notifyUsersAboutDeletingInvitations == 'SIM' ? { borderColor: '#00E1E2', borderRightWidth: '2px' } : { borderColor: 'var(--grey-ultra-ligth)', borderRightWidth: '1px' }}
                  onClick={notifyUsersAboutDeletingInvitations != 'SIM' ? (e) => setNotifyUsersAboutDeletingInvitations('SIM') : () => console.log('')}
                  className="inputNotifyDivFirst">Sim</h6>

                <h6
                  style={notifyUsersAboutDeletingInvitations == 'NAO' ? { borderColor: '#00E1E2', borderLeftWidth: '2px' } : { borderColor: 'var(--grey-ultra-ligth)', borderLeftWidth: '1px' }}
                  onClick={notifyUsersAboutDeletingInvitations != 'NAO' ? (e) => setNotifyUsersAboutDeletingInvitations('NAO') : () => console.log('')}
                  className="inputNotifyDivSecond">Não</h6>
              </div>
            </div>
          </div>
        </div>

        <div className='clientEventFilters mt-10'>
          <div className="newTopSitemap flexc" style={{ alignItems: 'flex-start' }}>
            <p style={{ color: 'var(--blue-primary)', fontWeight: '600' }}>Adicionar tipos de entrada</p>
          </div>

          <div className="clientEventInputBox flexc" style={{ paddingTop: '0' }}>
            <div className="inputNewStyleDouble flexr" style={{ justifyContent: 'flex-start' }}>
              <div className="inputNewStyle DoubleUnique flexr">
                <p>Nome do Ingresso</p>
                <input
                  onChange={(e) => setTypeStack(e.target.value)}
                  value={typeStack}
                  type="text"
                />
              </div>
            </div>

            <div className="inputNewStyleDouble flexr" style={{ justifyContent: 'flex-start' }}>
              <div className="inputNewStyle DoubleUnique flexr" style={{ width: '100%', paddingTop: '10px' }}>
                <p>Arte do Ingresso</p>
                <input
                  style={{ height: 'auto', backgroundColor: 'transparent', width: '100%' }}
                  onChange={(e) => setImageStack(e.target.files[0])}
                  value={imageStack[0]}
                  type="file"
                />
              </div>
            </div>
            <p style={{ fontSize: "12px", color: "red" }}>* Preferência de Imagem: 400px X 717px e até 2Mb</p>
            <div className="clientEventInputBox flexc" style={{ paddingTop: '0' }}>
              <div className="inputNewStyleDouble flexr" style={{ justifyContent: 'flex-start', paddingTop: '20px' }}>
                <div className="inputNewStyle DoubleUnique flexr ">
                  <p className="pNone"></p>
                  <button
                    onClick={(event) => addPassType(event)}
                    className="addPasstypeBtn flexr gap-2"><TiPlus /> {isFileUploading ? '...Loading' : 'Adicionar'}</button>
                </div>
              </div>
            </div>

            {alreadyPassType?.length > 0 &&
              alreadyPassType.map((e, y) => {
                return (
                  <div className="inputNewStyle flexr" key={y} >
                    <p className="pNone"></p>
                    <div className="typeLineCard flexr">
                      <div className=" flexr">
                        <p style={{ color: '#00A527' }}>Salvo</p>
                        <h6 style={{ backgroundColor: colors[y % colors.length] }}>{e.description}</h6>
                      </div>
                      <div className="userConfigbtns flexr">
                        <div
                          onClick={(event) => setImageToShow(e.image)}
                          className="userConfigbtn flexr">
                          <FaImage className="userConfigIcon"></FaImage></div>
                        <div
                          onClick={(event) => { event.stopPropagation(), deletePassType(e.description, event, e.id) }}
                          className="userConfigbtn flexr">
                          <DeleteIcon className="userConfigIcon"></DeleteIcon>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
            }
            {passType?.length > 0 &&
              passType.map((e, y) => {

                return (
                  <div className="inputNewStyle flexr" key={y}>
                    <p className="pNone"></p>
                    <div className="typeLineCard flexr">
                      <div className="flexr justify-start">
                        <p style={{ color: '#FFAC25' }}>Adicionado</p>
                        <h6 style={{ backgroundColor: colors[y % colors.length] }}>{e.name}</h6>
                      </div>
                      <div className="userConfigbtns flexr">
                        <div
                          onClick={(event) => setImageToShow(e.image)}
                          className="userConfigbtn flexr">
                          <FaImage className="userConfigIcon"></FaImage></div>
                        <div
                          onClick={(event) => deletePassType(e.name, event)}
                          className="userConfigbtn flexr">
                          <DeleteIcon className="userConfigIcon"></DeleteIcon>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
            }



          </div>
        </div>
        <div className="margin5percent" style={{ position: 'relative', padding: '0 !important' }}>
          <div className="clientEventInputBox flexc" style={{ padding: '50px 0' }}>
            <button
              onClick={(event) => editTheEvent(event)}
              style={{ maxHeight: '35px', minWidth: '120px' }}
              className="btnBlueThird flexr newEventBtn gap-4"
            >{!!isLoading ? <Loader></Loader> : "Salvar"}</button>
          </div>
        </div>
      </div>


    </>
  );
}


{/* <div className="clienteMain flexr">

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
//       <div className="adminUsersAdd flexr">
//         <button
//           onClick={(event) => editTheEvent(event)}
//           style={{ minWidth: "150px" }}
//           className="btnOrange">{!!isLoading ? <Loader></Loader> : "Salvar"}</button>
//       </div>
//     </div>
//   </div>
// </div > */}