'use client'

import * as XLSX from 'xlsx';
import Loader from "../fragments/loader"
import { useEffect, useState, useContext } from "react"
import CloseIcon from '@mui/icons-material/Close';
import { GlobalContext } from "@/context/global";
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
import Separator from "@/components/fragments/separatorLine";
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

export default function UploadGuestModal({ close }) {
    const { KONG_URL, user, eventEdit, turmaEdit } = useContext(GlobalContext);
    const [isLoading, setIsLoading] = useState(false),
        [step, setStep] = useState(1),
        [passtype, setPassType] = useState(),
        [tycketsTypeId, setTycketsTypeId] = useState(),
        [invitesAvaible, setInvitesAvaible] = useState([]),
        [dataCopy, setDataCopy] = useState(),
        [data, setData] = useState(),
        [isFetching, setIsFetching] = useState(false),
        [selfPass, setSelfPass] = useState();


    const handleFileUpload = (event) => {
        const file = event.target.files[0];

        const reader = new FileReader();
        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });

            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];

            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            const mappedData = jsonData.map(row => {
                const mappedRow = {};

                row.forEach((value, index) => {
                    const columnName = jsonData[0][index];

                    if (columnName) {
                        const normalizedColumnName = columnName.toLowerCase().replaceAll("-", "").trim();


                        if (normalizedColumnName === "nome" || normalizedColumnName === "documento" ||
                            normalizedColumnName === "telefone" || normalizedColumnName === "email") {
                            mappedRow[normalizedColumnName] = value;
                        }
                    }
                });

                return mappedRow;
            });

            setData(mappedData);
            setDataCopy(mappedData);
            setStep(2);

        };

        reader.readAsArrayBuffer(file);
    };

    const handleFileDelete = (document) => {
        const newData = dataCopy.filter((e, y) => e.documento != document).filter((e, y) => e.Documento != document);
        setDataCopy(newData);
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

    async function addGuest(guest) {

        let jwt = !!user?.jwt ? user.jwt : localStorage.getItem("user_jwt")
        let event = !!eventEdit ? eventEdit : localStorage.getItem("event_edit")
        let turma = !!turmaEdit ? turmaEdit : localStorage.getItem("turma_edit")

        let x;

        if (!!jwt) {
            setIsLoading(true)
            try {
                x = await (await fetch(`${KONG_URL}/companys/turma/student/${event}/${turma}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': jwt
                    },
                    body: JSON.stringify({
                        name: guest.nome || guest.Nome,
                        document: guest.documento || guest.Documento,
                        phone: guest.telefone || guest.Telefone,
                        email: guest.email || guest.Email,
                        tycketsTypeId: tycketsTypeId,
                        guestsTicketsTypeNumber: invitesAvaible
                    })
                })).json()

                if (!!x) {

                    toast.success("Convidado cadastrado.", {
                        position: "top-right"
                    });
                    setIsLoading(false)
                    return true

                } else {

                    toast.error("Erro ao Cadastrar, tente novamente.", {
                        position: "top-right"
                    });
                    setIsLoading(false)

                    return false
                }


            } catch (error) {
                toast.error("Erro ao Cadastrar, tente novamente.", {
                    position: "top-right"
                });
                setIsLoading(false)
                return ""
            }
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

    async function confirmData(y) {

        if (!!data && y < 4) {
            setStep(y)
        } else if (!!data && y >= 4) {
            setIsFetching(true);
            setStep(y)

            for (let index = 0; index < data.length; index++) {
                if (index != 0) {

                    const returning = await addGuest(data[index])


                    if ((index == data.length - 1) && returning == true) {

                        setIsFetching(false);
                        close();
                    }
                }


            }

        }
    }

    useEffect(() => {
        getPassTypes()
    }, [])

    useEffect(() => {
        setData(dataCopy);
    }, [dataCopy]);

    return (
        <div
            onClick={close}
            className='mainModal flexr'>
            <div
                onClick={(e) => e.stopPropagation()}
                className='contentUploadModal flexc'>
                <div
                    onClick={close}
                    className='modalClose flexr'><CloseIcon></CloseIcon></div>
                <div className='flexc' style={{ width: "100%" }}>
                    <div style={{ justifyContent: "space-between", width: "80%" }}>
                        <div className='flexc' style={{ marginBottom: "20px" }}>
                            <h2>{step == 1 ? "Importar arquivos por Excel" : step == 2 ? "Dados Coletados" : step == 3 ? "Tipo de Ingressos" : ""}</h2>
                        </div>
                        {step == 1 ?
                            <div className='flexc contentUploadBox'>
                                <label htmlFor="fileInput" className="uploadLabel">
                                    <DriveFolderUploadIcon style={{ width: "100%", fontSize: "60px", color: "var(--blue-primary)" }} />
                                    <p style={{ fontSize: "18px", color: "var(--blue-primary)", marginTop: "20px" }}>Clique aqui...</p>
                                </label>
                                <input type="file" id="fileInput" className="fileInput" onChange={handleFileUpload} accept=".xls,.xlsx" />
                            </div>
                            : step == 2 ?
                                <div className='uploadList flexc'>
                                    {!!data && data.map((e, y) => {
                                        return (
                                            <div key={y} className={y == 0 ? 'uploadListFirstLine flexr' : 'uploadListLine flexr'}>
                                                <div className='uploadListItem flexr'>{e.nome || e.Nome}</div>
                                                <Separator color={"var(--grey-ligth)"} width="1px" height="100%"></Separator>
                                                <div className='uploadListItem flexr'>{e.documento || e.Documento}</div>
                                                <Separator color={"var(--grey-ligth)"} width="1px" height="100%"></Separator>
                                                <div className='uploadListItem flexr'>{e.telefone || e.Telefone}</div>
                                                {y != 0 &&
                                                    <Tooltip title="Deletar Formando">
                                                        <div
                                                            onClick={() => handleFileDelete(e.documento || e.Documento)}
                                                            className="uploadConfigbtn flexr">
                                                            <DeleteIcon className="userConfigIcon"></DeleteIcon>
                                                        </div>
                                                    </Tooltip>
                                                }
                                            </div>
                                        )
                                    })}
                                    <button
                                        onClick={() => confirmData(3)}
                                        className='btnOrange' style={{ height: "30px", marginTop: "20px" }}>Proximo</button>
                                </div>
                                : step == 3 ?
                                    <div >
                                        <div className="flexr" style={{ marginBottom: "20px" }}>
                                            <FormControl className="InputsTwoSelect" style={{ minWidth: "200px" }}>
                                                <InputLabel id="demo-simple-select-label">Tipo de Ingresso do Formando</InputLabel>
                                                <Select
                                                    style={{
                                                        minWidth: "200px"
                                                    }}
                                                    labelId="demo-simple-select-label"
                                                    id="demo-simple-select"
                                                    value={selfPass}
                                                    onChange={(e) => setTycketsTypeId(e.target.value)}
                                                >
                                                    {!!passtype ?
                                                        passtype.map((e, y) => (
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
                                        <div className="flexr" style={{ gap: "20px", justifyContent: "flex-start" }}>
                                            {passtype.map((e, y) => (
                                                <div className="invitesTypeDiv flexc" key={y}>
                                                    <p><span>{`Convidado - ${e.description}`}</span></p>
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
                                            }
                                        </div>
                                        <div className="flexr" style={{ width: "100%", paddingTop: "20px" }}>
                                            <button
                                                onClick={() => confirmData(4)}
                                                className='btnOrange' style={{ height: "30px", marginTop: "20px" }}>Concluir</button>
                                        </div>
                                    </div>
                                    : step == 4 &&
                                    <div >
                                        <div className="flexr" style={{ margin: "50px" }}>
                                            {!!isFetching
                                                ?
                                                <Loader></Loader>
                                                :
                                                <CheckBoxIcon color='#008D13' fontSize='50px'></CheckBoxIcon>
                                            }
                                        </div>
                                    </div>
                        }
                    </div>
                </div>

            </div>
        </div>
    )
}