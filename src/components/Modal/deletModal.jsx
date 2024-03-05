'use client'

import Loader from "../fragments/loader"
import { useState } from "react"
import CloseIcon from '@mui/icons-material/Close';
import TextField from '@mui/material/TextField';

export default function DeletModal({ close, func, word }) {
    const [confirm, setConfirm] = useState();
    const [isLoading, setIsLoading] = useState(false);

    function Confirm(e) {
        setIsLoading(true);
        func(e);

        setTimeout(() => {
            setIsLoading(false);
            close();
        }, 2000)
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
                {!!word ?
                    <div className='deleteModalDiv flexc'>
                        <h2>Esta ação é irreversivel, digite &apos;<span>{!!word && word}</span>&apos; para prosseguir!</h2>
                        <div className="flexr inputDiv">
                            <TextField
                                onChange={(e) => setConfirm(e.target.value)}
                                className="inputStyle" id="outlined-size-normal" placeholder={`Digite '${word}'`} type="text" />
                        </div>
                        <div className='deleteModalBtnDiv flexr'>
                            <button
                                onClick={(e) => Confirm(e)}
                                disabled={confirm != word ? true : false}
                                className={confirm != word ? "btnDisabled" : "btnOrange"} style={{ minWidth: "100px" }}>{!!isLoading ? <Loader></Loader> : `Sim`}</button>
                            {!isLoading &&
                                <button
                                    onClick={close}
                                    className="btnBlueThird" style={{ minWidth: "100px" }}>Não</button>
                            }
                        </div>
                    </div>
                    :
                    <div className='deleteModalDiv flexc'>
                        <h2>Tem certeza que deseja Deletar este item?</h2>
                        <div className='deleteModalBtnDiv flexr'>
                            <button
                                onClick={(e) => Confirm(e)}
                                className="btnOrange" style={{ minWidth: "100px" }}>{!!isLoading ? <Loader></Loader> : `Sim`}</button>
                            {!isLoading &&
                                <button
                                    onClick={close}
                                    className="btnBlueThird" style={{ minWidth: "100px" }}>Não</button>
                            }
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}