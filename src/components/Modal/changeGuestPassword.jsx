'use client'

import Loader from "../fragments/loader"
import { useEffect, useState, useContext } from "react"
import CloseIcon from '@mui/icons-material/Close';
import TextField from '@mui/material/TextField';
import { GlobalContext } from "@/context/global";
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

export default function ChangeGuestModal({ close, guestId }) {
    const { KONG_URL, user } = useContext(GlobalContext);
    const [password, setPassword] = useState();
    const [confirmPassword, setconfirmPassword] = useState();
    const [passwordError, setPasswordError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [enabledToChange, setEnabledToChage] = useState(false)

    async function ChangeGuestPassword(id) {
        let jwt = !!user?.jwt ? user.jwt : localStorage.getItem("user_jwt")
        let x;

        if (!!jwt && !!password) {
            setIsLoading(true);

            try {

                x = await fetch(`${KONG_URL}/companys/changePasswordStudent/${guestId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': jwt
                    },
                    body: JSON.stringify({
                        password: password
                    })
                })

                if (x.status == 200) {
                    toast.success("Senha alterada com sucesso!")
                    setTimeout(() => {
                        setIsLoading(false);
                        close();
                        return ""
                    }, 1000)
                }
            } catch (error) {
                toast.error("Falha ao atualizar senha...")
                setIsLoading(false);
                return ""
            }
        } else {
            console.log("else")
        }
    }

    function passwordCheck() {
        if (password?.length > 5) {
            if (password == confirmPassword) {
                setEnabledToChage(true)
                setPasswordError("")
            } else {
                setEnabledToChage(false)
                setPasswordError("* As senhas devem ser iguais.")
            }
        } else if (password?.length > 0) {
            setEnabledToChage(false)
            setPasswordError("* A senha deve conter mais que 6 digitos.")
        } else {
            setEnabledToChage(false)
            setPasswordError("")
        }
    }

    useEffect(() => {
        passwordCheck()
    }, [password, confirmPassword])

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
                <div className='deleteModalDiv flexc'>
                    <h2>Alteração de Senha.</h2>
                    <div className="flexc inputDiv" style={{ gap: "10px" }}>
                        <div className="flexr inputDiv">
                            <TextField
                                onChange={(e) => setPassword(e.target.value)}
                                className="inputStyle" id="outlined-size-normal" placeholder={`Digite a nova senha..`} type="text" />
                        </div>
                        <div className="flexr inputDiv">
                            <TextField
                                onChange={(e) => setconfirmPassword(e.target.value)}
                                className="inputStyle" id="outlined-size-normal" placeholder={`Confirme a nova senha..`} type="text" />
                        </div>
                        <p className="inputDivError">{passwordError}</p>
                    </div>
                    <div className='deleteModalBtnDiv flexr'>
                        <button
                            onClick={() => ChangeGuestPassword()}
                            disabled={!!isLoading || !enabledToChange ? true : false}
                            className={!!isLoading || !enabledToChange ? "btnDisabled" : "btnOrange"} style={{ minWidth: "100px" }}>
                            {!!isLoading ? <Loader></Loader> : `Salvar`}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}