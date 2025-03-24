'use client'

import { useState, useEffect, useContext } from "react"
import { GlobalContext } from "@/context/global";
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import WavingHandIcon from '@mui/icons-material/WavingHand';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { useRouter } from "next/navigation";
import Separator from "@/components/fragments/separatorLine";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Loader from "@/components/fragments/loader";
import TransferModal from "@/components/Modal/transferModal";
import moment from "moment"
export default function Dashboard() {
  const router = useRouter();
  const { KONG_URL, user, eventEdit, eventChoice, eventClasses, setRefreshPage, refreshPage } = useContext(GlobalContext);
  const [isLoading, setIsLoading] = useState(false);
  const [myData, setMyData] = useState();
  const [loadData, setLoadData] = useState(false),
    [transferIsOpen, setTransferIsOpen] = useState(false);
  const [transferHistoricId, setTranferHistoricId] = useState();

  function openTransferModal(e, id) {
    e.preventDefault();
    setTransferIsOpen(true);
  }

  function closeTransferModal() {
    setTransferIsOpen(false);
  }

  async function getGuests() {

    let x;
    let userId = !!user.id ? JSON.parse(user.id) : JSON.parse(localStorage.getItem("user_id"))
    let classId = !!eventChoice ? JSON.parse(eventChoice) : JSON.parse(localStorage.getItem("event_choice"))

    if (user && !!classId) {

      setLoadData(true)
      try {
        x = await (await fetch(`${KONG_URL}/student/transferInvites/${classId?.classEvent?.id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': user.jwt
          }
        })).json()

        if (!x.message) {
          setMyData(x)
          setTranferHistoricId(+userId)
          setLoadData(false)
          return ""
        }

      } catch (error) {
        setLoadData(false)
        return ""
      }
    } else {
      setLoadData(false)
      return ""
    }
  }

  function formatDateToInput(dataString) {
    return moment(dataString).format("DD/MM/YYY HH:mm")
  }

  useEffect(() => {
    getGuests();
  }, [])


  return (
    <div className="clientEventMain flexc" >
      {transferIsOpen == true && <TransferModal close={() => closeTransferModal()}></TransferModal>}
      <div className="margin5percent flexc gap-4" style={{ justifyContent: 'center', alignItems: 'flex-start', marginTop: '60px' }}>
        <div className="newTopSitemap flexr justify-between" style={{ width: '100%' }}>
          <h1 style={{ fontWeight: 600, marginRight: 10 }}>Transferências</h1>
          <button
            onClick={(e) => openTransferModal(e)}
            className="btnBlueThird flexr newEventBtn gap-4">TRANSFERIR INGRESSO</button>
        </div>

        <div className="clientListTitle flexr">
          <h2 className="clienteTypeLi"></h2>
          <h2 className="clienteTypeLi">Ingresso</h2>
          <h2 className="eventNameLi">De</h2>
          <h2 className="eventNameLi">Para</h2>
          <h2 className="eventDateLi">Data</h2>
        </div>
        {loadData == true ?
          <div style={{ width: '100%', height: '300px' }}>
            <Loader></Loader>
          </div>
          :
          myData?.length > 0 ? myData.map((e, y) => {
            return (
              <div
                onClick={(event) => goView(event, e.id)}
                key={y} className="clienteLine flexr">
                <p className="clienteTypeLi">{e.direction == "Envio" ? <span style={{ color: "red" }}>Enviou</span> : <span style={{ color: "green" }}>Recebeu</span>}</p>
                <p className="clienteTypeLi">{e.amount} - {e.tycketsType?.description}</p>
                <p className="eventNameLi">{e.guests_guestsTransfers_guestsIdOrigenToguests?.name}</p>
                <p className="eventNameLi">{e.guests_guestsTransfers_guestIdDestinyToguests?.name}</p>
                <p className="eventNameLi">{formatDateToInput(e.createdAt)}</p>
              </div>
            )
          })
            :
            <p style={{ marginTop: "30px" }}>Nenhuma Tranferência</p>
        }

      </div>
    </div>
  );
}
