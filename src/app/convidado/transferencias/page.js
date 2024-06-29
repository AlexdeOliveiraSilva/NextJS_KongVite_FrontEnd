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

export default function Dashboard() {
  const router = useRouter();
  const { KONG_URL, user, eventEdit, eventChoice, eventClasses, setRefreshPage, refreshPage } = useContext(GlobalContext);
  const [isLoading, setIsLoading] = useState(false);
  const [myData, setMyData] = useState();
  const [loadData, setLoadData] = useState(false);


  async function getGuests() {

    let x;
    let jwt = !!user?.jwt ? user.jwt : localStorage.getItem("user_jwt")
    let classId = !!eventChoice ? JSON.parse(eventChoice) : JSON.parse(localStorage.getItem("event_choice"))

    if (!!jwt && !!classId) {

      setLoadData(true)
      try {
        x = await (await fetch(`${KONG_URL}/student/transferInvites/${classId?.classEvent?.id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': jwt
          }
        })).json()

        if (!x.message) {
          setMyData(x)
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
    const data = new Date(dataString);

    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');
    const horas = String(data.getHours()).padStart(2, '0');
    const minutos = String(data.getMinutes()).padStart(2, '0');

    return `${dia}-${mes}-${ano}`;
  }

  useEffect(() => {
    getGuests();
  }, [])

  return (
    <div className="clientEventMain flexc" >
      <div className="margin5percent flexc gap-4" style={{ justifyContent: 'center', alignItems: 'flex-start', marginTop: '60px' }}>
        <div className="newTopSitemap flexr">
          <h1 style={{ fontWeight: 600, marginRight: 10 }}>Transferências</h1>
        </div>
        <div className="clientListTitle flexr">
          <h2 className="clienteTypeLi">Ingresso</h2>
          <h2 className="eventNameLi">Nome</h2>
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
                <p className="clienteTypeLi">{e.amount} - {e.tycketsType?.description}</p>
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
