'use client'

import * as XLSX from 'xlsx';
import React from 'react';
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
        [tycketsType, setTycketsType] = useState([]),
        [invitesAvaible, setInvitesAvaible] = useState([]),
        [dataCopy, setDataCopy] = useState(),
        [data, setData] = useState(),
        [isFetching, setIsFetching] = useState(false),

        [excelCopy, setExcelCopy] = useState(),

        [excelColumns, setExcelColumns] = useState(),

        [selfPass, setSelfPass] = useState();

    const [columnName, setColumnName] = useState({
        Nome: '',
        Documento: '',
        Email: '',
        Telefone: '',
    });

    const setFileColumn = (event) => {
        let file = event.target.files[0];

        setExcelCopy(file);

        const reader = new FileReader();
        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });

            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];

            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            const columnNames = jsonData[0];

            setExcelColumns(columnNames);

            setStep(2);
        };

        reader.readAsArrayBuffer(file);
    };




    const handleFileUpload = () => {
        let file = excelCopy

        const reader = new FileReader();
        reader.onload = (e) => {

            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });

            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];

            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            const mappedData = jsonData.map(row => {
                const mappedRow = { type: !!passtype ? passtype[0].id : undefined, guestsTicketsTypeNumber: [] };

                row.forEach((value, index) => {
                    const columnNamePrev = jsonData[0][index];

                    if (columnNamePrev) {

                        switch (columnNamePrev) {
                            case columnName.Nome:
                                mappedRow['Nome'] = value;
                                break;

                            case columnName.Documento:
                                mappedRow['Documento'] = value;
                                break;

                            case columnName.Email:
                                mappedRow['Email'] = value;
                                break;

                            case columnName.Telefone:
                                mappedRow['Telefone'] = value;
                                break;

                            default:
                                break;
                        }

                        !!passtype && passtype.map((w, z) => {
                            let key = w.description
                            let already = mappedRow.guestsTicketsTypeNumber
                            let data = {
                                tycketsTypeId: w.id,
                                number: value
                            }


                            if (tycketsType.hasOwnProperty(key)) {
                                if (tycketsType[key] == columnNamePrev) {
                                    mappedRow.guestsTicketsTypeNumber = [...already, data];
                                }
                            }
                        })


                    }
                });

                console.log('mappedRow', mappedRow)
                return mappedRow;
            });


            setData(mappedData);
            setDataCopy(mappedData);
            setStep(3);

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
                        name: guest.nome || guest.Nome.toString(),
                        document: guest.documento || guest.Documento.toString(),
                        phone: guest.telefone || guest.Telefone.toString(),
                        email: guest.email || guest.Email.toString(),
                        tycketsTypeId: guest.type || guest.Type,
                        guestsTicketsTypeNumber: guest.guestsTicketsTypeNumber
                            ? Object.values(guest.guestsTicketsTypeNumber).map((e) => ({
                                tycketsTypeId: e.tycketsTypeId,
                                number: e.number
                            }))
                            : []
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

    const handleSelectChange = (field) => (event) => {


        setColumnName(prevState => ({
            ...prevState,
            [field]: event.target.value,
        }));
    };

    const handleSelectTypeChange = (field) => (event) => {

        setTycketsType(prevState => ({
            ...prevState,
            [field]: event.target.value,
        }));
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


    useEffect(() => {

    }, [columnName])


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
                    <div style={{ justifyContent: "space-between", width: "95%" }}>
                        <div className='flexc' style={{ marginBottom: "20px" }}>
                            <h2>{
                                step == 1 ? "Importar arquivos por Excel" :
                                    step == 2 ? "Escolha de Colunas" :
                                        step == 3 ? "Tipo de Ingressos" :
                                            step == 4 ? "Enviando" :
                                                ""}</h2>
                        </div>
                        {step == 1 ?
                            <div className='flexc contentUploadBox'>
                                <label htmlFor="fileInput" className="uploadLabel">
                                    <DriveFolderUploadIcon style={{ width: "100%", fontSize: "60px", color: "var(--blue-primary)" }} />
                                    <p style={{ fontSize: "18px", color: "var(--blue-primary)", marginTop: "20px" }}>Clique aqui...</p>
                                </label>
                                <input type="file" id="fileInput" className="fileInput" onChange={setFileColumn} accept=".xls,.xlsx" />
                            </div>
                            : step == 2 ?
                                <div className='flexc'>
                                    <div className='flexc' style={{ minWidth: '90%', gap: 10, overflowY: 'auto' }}>
                                        <div className='flexr contentUploadLine'>
                                            <p>Nome</p>
                                            <select
                                                onChange={handleSelectChange('Nome')}
                                                className='flexr'
                                                style={{ padding: '5px 10px' }}
                                            >
                                                <option></option>
                                                {!!excelColumns && excelColumns.map((e, y) => {
                                                    return (
                                                        <option key={y} value={e}>{e}</option>
                                                    );
                                                })}
                                            </select>
                                        </div>
                                        <div className='flexr contentUploadLine'>
                                            <p>Documento</p>
                                            <select
                                                onChange={handleSelectChange('Documento')}
                                                className='flexr'
                                                style={{ padding: '5px 10px' }}
                                            >
                                                <option></option>
                                                {!!excelColumns && excelColumns.map((e, y) => {
                                                    return (
                                                        <option key={y} value={e}>{e}</option>
                                                    );
                                                })}
                                            </select>
                                        </div>
                                        <div className='flexr contentUploadLine'>
                                            <p>Telefone</p>
                                            <select
                                                onChange={handleSelectChange('Telefone')}
                                                className='flexr'
                                                style={{ padding: '5px 10px' }}
                                            >
                                                <option></option>
                                                {!!excelColumns && excelColumns.map((e, y) => {
                                                    return (
                                                        <option key={y} value={e}>{e}</option>
                                                    );
                                                })}
                                            </select>
                                        </div>
                                        <div className='flexr contentUploadLine'>
                                            <p>E-mail</p>
                                            <select
                                                onChange={handleSelectChange('Email')}
                                                className='flexr'
                                                style={{ padding: '5px 10px' }}
                                            >
                                                <option></option>
                                                {!!excelColumns && excelColumns.map((e, y) => {
                                                    return (
                                                        <option key={y} value={e}>{e}</option>
                                                    );
                                                })}
                                            </select>
                                        </div>
                                        {!!passtype && passtype.map((p, i) => (
                                            <div key={i} className='flexr contentUploadLine'>
                                                <p>{p.description}</p>
                                                <select
                                                    onChange={handleSelectTypeChange(`${p.description}`)}
                                                    className='flexr'
                                                    style={{ padding: '5px 10px' }}
                                                >
                                                    <option></option>
                                                    {!!excelColumns && excelColumns.map((e, y) => {
                                                        return (
                                                            <option key={y} value={e}>{e}</option>
                                                        );
                                                    })}
                                                </select>
                                            </div>
                                        ))}
                                    </div>
                                    <button
                                        onClick={() => {
                                            if (
                                                columnName.Nome != '' &&
                                                columnName.Documento != '' &&
                                                columnName.Email != '' &&
                                                columnName.Telefone != ''
                                            ) {
                                                handleFileUpload()
                                            } else {
                                                toast.error('Todos os campos devem ser preenchidos')
                                            }

                                        }}
                                        className='btnOrange' style={{ height: "30px", marginTop: "20px" }}>Confirmar</button>
                                </div>
                                : step == 3 ?
                                    <div className='uploadList flexc'>

                                        {!!data && data.map((e, y) => {
                                            return (
                                                <div key={y} className={y === 0 ? 'uploadListFirstLine flexr' : 'uploadListLine flexr'}>
                                                    <div className='uploadListItemName flexr'>{e.nome || e.Nome}</div>
                                                    <Separator color={"var(--grey-ligth)"} width="1px" height="100%" />
                                                    <div className='uploadListItemDoc flexr'>{e.documento || e.Documento}</div>
                                                    <Separator color={"var(--grey-ligth)"} width="1px" height="100%" />
                                                    {y === 0 ? (
                                                        <div className='uploadListItemDoc flexr'>Ingresso</div>
                                                    ) : (
                                                        <select
                                                            style={{ padding: '0px 10px' }}
                                                            className='uploadListItemDoc'
                                                            value={e.type || ''}
                                                            onChange={(event) => {
                                                                const newData = [...data];
                                                                newData[y] = { ...newData[y], type: +event.target.value };
                                                                setData(newData);
                                                            }}
                                                        >
                                                            {!!passtype ?
                                                                passtype.map((p, i) => (
                                                                    <option key={i} value={p.id}>
                                                                        {p.description}
                                                                    </option>
                                                                ))
                                                                :
                                                                <option value={999}>Sem opções</option>
                                                            }
                                                        </select>
                                                    )}

                                                    {/* {!!passtype && passtype.map((p, i) => {
                                                        (
                                                            <React.Fragment key={i}>
                                                                <Separator color={"var(--grey-ligth)"} width="1px" height="100%" />
                                                                {y === 0 ?
                                                                    (
                                                                        <div className='uploadListItemDoc flexr'>{p.description}</div>
                                                                    ) : (
                                                                        <input
                                                                            style={{ padding: '0px 10px' }}
                                                                            type='number'
                                                                            className='uploadListItemDoc'
                                                                            value={e.guestsTicketsTypeNumber && e.guestsTicketsTypeNumber[p.id] ? e.guestsTicketsTypeNumber[p.id].number : ''}
                                                                            onChange={(event) => {
                                                                                const newData = [...data];
                                                                                const guestsTicketsTypeNumber = {
                                                                                    ...e.guestsTicketsTypeNumber,
                                                                                    [p.id]: {
                                                                                        tycketsTypeId: p.id,
                                                                                        number: +event.target.value
                                                                                    }
                                                                                };
                                                                                newData[y] = { ...newData[y], guestsTicketsTypeNumber };
                                                                                setData(newData);
                                                                            }}
                                                                        />
                                                                    )}
                                                            </React.Fragment>
                                                        )
                                                    })} */}

                                                    {y !== 0 && (
                                                        <Tooltip title="Deletar Formando">
                                                            <div
                                                                onClick={() => handleFileDelete(e.documento || e.Documento)}
                                                                className="uploadConfigbtn flexr"
                                                            >
                                                                <DeleteIcon className="userConfigIcon" />
                                                            </div>
                                                        </Tooltip>
                                                    )}
                                                </div>
                                            );
                                        })}


                                        <button
                                            onClick={() => confirmData(4)}
                                            className='btnOrange' style={{ height: "30px", marginTop: "20px" }}>Proximo</button>
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


                            // <div >
                            //     <div className="flexr" style={{ gap: "20px", justifyContent: "flex-start" }}>
                            //         {passtype.map((e, y) => (
                            //             <div className="invitesTypeDiv flexc" key={y}>
                            //                 <p><span>{`Convidado - ${e.description}`}</span></p>
                            //                 <p>Quantidade</p>
                            //                 <TextField
                            //                     onChange={(event) => handleInputChange(event.target.value, e.id)}
                            //                     className="inputStyle"
                            //                     id="outlined-size-normal"
                            //                     placeholder={`Digite a Quantidade:'`}
                            //                     type="number"
                            //                     defaultValue={0}
                            //                 />
                            //             </div>
                            //         ))
                            //         }
                            //     </div>
                            //     <div className="flexr" style={{ width: "100%", paddingTop: "20px" }}>
                            //         <button
                            //             onClick={() => confirmData(5)}
                            //             className='btnOrange' style={{ height: "30px", marginTop: "20px" }}>Concluir</button>
                            //     </div>
                            // </div>
                        }
                    </div>
                </div>

            </div>
        </div>
    )
}