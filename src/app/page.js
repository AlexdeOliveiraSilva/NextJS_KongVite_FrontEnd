'use client'

import { useState, useEffect, useContext } from "react"
import { useRouter } from "next/navigation";
import { GlobalContext } from "@/context/global";
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import WavingHandIcon from '@mui/icons-material/WavingHand';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

export default function Login() {
  const router = useRouter();
  const { config, setConfig, theme, setTheme } = useContext(GlobalContext);
  const [passwordVisibble, setPasswordVisible] = useState(true)
  const [saveData, setSaveData] = useState(false)
  const [forgotPassword, setForgotPassword] = useState(false)
  const [emailSended, setEmailSended] = useState(false)

  const changeVisible = () => {
    setPasswordVisible(!passwordVisibble)
  }
  const changeSetData = () => {
    setSaveData(!saveData)
  }
  const changeSetForgotPassword = () => {
    setForgotPassword(!forgotPassword)
  }

  const checkboxLabel = { inputProps: { 'aria-label': 'Checkbox demo' } };
  return (
    <main>
      <div className="loginContent flexr" style={{ backgroundImage: "url(/images/image-kongvite-background.jpg)" }}>
        <div className="loginDiv flexc">
          <div className="flexr logoLoginDiv">
            <img src="/logos/logo-kongvite.png"></img>
          </div>
          {forgotPassword == false ?
            <>
              <div className="flexc titleLogin">
                <h1>Olá! <WavingHandIcon style={{ marginLeft: 20, color: "#EAAC03" }} fontSize="60px" color="#FFCE48" /></h1>
                <p>Insira suas credenciais para fazer o seu Login.</p>
              </div>
              <form className="flexc inputsDivLogin">
                <div className="flexr inputDiv">
                  <TextField className="inputStyle" label="E-mail" id="outlined-size-normal" placeholder="Digite seu E-mail" type="text" />
                </div>
                <div className="flexr inputDivPassword">
                  <TextField className="inputStyle" label="Senha" id="outlined-size-normal" placeholder="Digite sua Senha" type={passwordVisibble == true ? "text" : "password"} />
                  {passwordVisibble == true ? <VisibilityIcon onClick={changeVisible} style={{ color: "#00276E" }} className="passwordIcon" color="#00276E" /> : <VisibilityOffIcon style={{ color: "#00276E" }} onClick={changeVisible} className="passwordIcon" color="#00276E" />}
                </div>
                <div className="flexr forgotLoginDiv">
                  <FormControlLabel onClick={changeSetData} control={<Checkbox />} label="Lembrar-me" />
                  <p onClick={changeSetForgotPassword}>Esqueci minha senha</p>
                </div>
                <div
                  className="btnLoginDiv flexr">
                  <button
                    onClick={() => router.push('/abc')}
                    className="btnBlue"
                    style={{ width: "60%" }}>Entrar</button></div>
              </form>
            </>
            :
            forgotPassword == true && emailSended == true ?
              <>
                <div className="flexr titleRecover" onClick={changeSetForgotPassword}>
                  <h1><ArrowBackIcon style={{ marginRight: 20, color: "#00276E" }} fontSize="60px" color="#00276E" />Login </h1>
                </div>
                <form className="flexc inputsDivLogin">
                  <div className="flexr inputDiv">
                    <TextField className="inputStyle" label="E-mail" id="outlined-size-normal" placeholder="Digite seu E-mail" type="text" />
                  </div>

                  <div className="btnLoginDiv flexr"><button className="btnBlue" style={{ width: "60%", marginTop: "40px" }}>Recuperar Senha</button></div>
                </form>
              </>
              :
              <>
                <div className="flexr titleRecover" onClick={changeSetForgotPassword}>
                  <h1><ArrowBackIcon style={{ marginRight: 20, color: "#00276E" }} fontSize="60px" color="#00276E" />Login </h1>
                </div>
                <div className="flexr" onClick={changeSetForgotPassword}>
                  <h1 style={{ fontSize: "25px" }}>Verifique seu e-mail. <CheckBoxIcon style={{ marginLeft: 20, color: "#00AE0F" }} sx={{ fontSize: 40 }} color="#00AE0F" /></h1>
                </div>
              </>
          }
          <div className="flexr helpLoginDiv">
            <p>Precisa de ajuda? <a href="/">Fale Conosco</a></p>
          </div>
        </div>
      </div>
    </main>
  );
}
