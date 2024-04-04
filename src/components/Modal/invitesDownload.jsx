'use client'

import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';
import Loader from "@/components/fragments/loader";
import { useState } from 'react';

export default function InvitesModal({ close, data, jwt, url }) {

    const [isLoading, setIsLoading] = useState()
    const [isDownloaded, setIsDownloaded] = useState([])

    async function toDownload(uuid, load) {

        if (!!jwt && !!uuid && !!url) {
            setIsLoading(load);

            try {
                let response = await fetch(`${url}/invite/${uuid}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': jwt
                    }
                });

                if (response.ok) {
                    let blob = await response.blob();
                    let url = window.URL.createObjectURL(blob);

                    let a = document.createElement('a');
                    a.href = url;
                    a.download = 'image.jpg'; // Nome do arquivo que será baixado
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);

                    let y = [...isDownloaded, uuid]

                    setIsDownloaded(y)

                    setIsLoading("");
                } else {
                    console.log("erro else")
                    setIsLoading("");
                }


            } catch (error) {
                console.log("error:", error)
                setIsLoading("");
            }
        }
    }


    return (
        <div
            onClick={close}
            className='mainModal flexr'>
            <div
                onClick={(e) => e.stopPropagation()}
                className='contentModal flexc'>
                <div
                    onClick={close}
                    className='modalClose flexr'><CloseIcon></CloseIcon></div>

                {!!data ?
                    <div className='inviteList flexc'>
                        <h1>Download de Ingressos</h1>
                        <div className='inviteLine flexr'>
                            <p>Nome: {data.mainConvidado.name}</p>
                            <button
                                disabled={isDownloaded.includes(data.mainConvidado.uuid) ? true : false}
                                onClick={(e) => toDownload(data.mainConvidado.uuid, "9999")}
                                className={isDownloaded.includes(data.mainConvidado.uuid) ? 'downBtnDisabled' : 'downBtn'}
                            >
                                {isLoading == "9999" ? <Loader></Loader> : <DownloadIcon style={{ color: "#ffffff" }}></DownloadIcon>}
                            </button>
                        </div>
                        {!!data?.acompanhantes && data?.acompanhantes.map((e, y) => {
                            return (
                                <div key={y} className='inviteLineOther flexr'>
                                    <p>Nome: {e.name}</p>
                                    <button
                                        disabled={isDownloaded.includes(e.uuid) ? true : false}
                                        onClick={() => toDownload(e.uuid, y.toString())}
                                        className={isDownloaded.includes(e.uuid) ? 'downBtnDisabled' : 'downBtn'}
                                    >
                                        {isLoading == y.toString() ? <Loader></Loader> : <DownloadIcon style={{ color: "#ffffff" }}></DownloadIcon>}
                                    </button>
                                </div>
                            )
                        })}
                    </div>
                    :
                    <div className='inviteList flexc' style={{ width: "100%", height: "200px", alignItems: "center" }}>
                        <h1>Download de Ingressos</h1>
                        <Loader></Loader>
                    </div>
                }
            </div>
        </div>
    )
}