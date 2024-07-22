'use client'

import Loader from "../fragments/loader"
import CloseIcon from '@mui/icons-material/Close';
import { useState, useEffect, useContext } from "react"
import { GlobalContext } from "@/context/global";
import { toast } from "react-toastify";

export default function EditPassType({ typeToEdit, close }) {
    const { KONG_URL, user, eventEdit, sendtos3 } = useContext(GlobalContext);

    const [typeStack, setTypeStack] = useState(),
        [imageStack, setImageStack] = useState(),
        [imageURL, setImageURL] = useState(),
        [isLoading, setIsLoading] = useState();


    async function fileUpload(eventId) {
        let response;
        let x = await fileToBase64(imageStack);

        if (!!imageStack && !!eventId && x != undefined) {
            response = await sendtos3(eventId, imageStack?.type, x)

            if (!!response) {

                return response
            } else {
                toast.error('Erro ao importar esta imagem.')
            }

        } else {
            setIsLoading(false)
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

    console.log(imageStack)

    async function editPassTypes() {
        let eventId = !!eventEdit ? eventEdit : localStorage.getItem("event_edit");
        let jwt = !!user?.jwt ? user.jwt : localStorage.getItem("user_jwt")
        let x;
        let res;

        setIsLoading(true)

        if (!!imageStack) {
            res = await fileUpload(eventId)
            setImageURL(res?.fileUrl)
        }

        if (!!jwt && !!typeStack && !!eventId) {
            try {
                x = await fetch(`${KONG_URL}/companys/tycketsType/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': jwt
                    },
                    body: JSON.stringify({
                        id: +typeToEdit?.id,
                        description: typeStack,
                        image: !!imageURL ? imageURL : typeToEdit?.image
                    })
                })

                toast.success('Alterações salvas com sucesso!')
                setIsLoading(false)
                if (!!window) {
                    window.location.reload()
                }

                return x
            } catch (error) {
                setIsLoading(false)
            }
        } else {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (!!typeToEdit?.description) {
            setTypeStack(!!typeToEdit?.description ? typeToEdit?.description : '')
        }
    }, [typeToEdit])

    return (
        <div
            onClick={close}
            className='imageModalFull flexr'
        >
            <div onClick={(e) => e.stopPropagation()}
                className='imageModalContent flexr'>
                <CloseIcon onClick={close} className='imageModalContentClose'></CloseIcon>
                <div className='clientEventFilters mt-10'>
                    <div className="newTopSitemap flexc" style={{ alignItems: 'flex-start' }}>
                        <p style={{ color: 'var(--blue-primary)', fontWeight: '600' }}>Editar entrada</p>
                    </div>

                    <div className="clientEventInputBox flexc" style={{ paddingTop: '0' }}>
                        <div className="inputNewStyleDouble flexr" style={{ justifyContent: 'flex-start' }}>
                            <div className="inputNewStyle DoubleUnique flexr">
                                <p>Nome do Ingresso</p>
                                <input
                                    onChange={(e) => setTypeStack(e.target.value)}
                                    value={!!typeStack ? typeStack : ''}
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
                                    value={!!imageStack ? imageStack[0] : ''}
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
                                        onClick={(event) => editPassTypes(event)}
                                        className="addPasstypeBtn flexr gap-2"> {isLoading ? '...Loading' : 'Salvar'}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}