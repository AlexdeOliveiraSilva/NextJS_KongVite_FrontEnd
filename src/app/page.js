'use client'

import { useState, useEffect, useContext } from "react"
import { usePathname, useRouter } from "next/navigation";
import { GlobalContext } from "@/context/global";
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import WavingHandIcon from '@mui/icons-material/WavingHand';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import Loader from "@/components/fragments/loader";
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
  const router = useRouter();
  const path = usePathname();

  const { KONG_URL, setEventClasses, setUser, user } = useContext(GlobalContext);
  const [passwordVisibble, setPasswordVisible] = useState(true)
  const [saveData, setSaveData] = useState(false)
  const [forgotPassword, setForgotPassword] = useState(false)
  const [emailSended, setEmailSended] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [loginError, setLoginError] = useState("")
  const [isError, setIsError] = useState(false)

  const changeVisible = () => {
    setPasswordVisible(!passwordVisibble)
  }
  const changeSetData = () => {
    setSaveData(!saveData)
  }
  const changeSetForgotPassword = () => {
    setForgotPassword(!forgotPassword)
  }
  const sendEmail = async () => {
    setIsLoading(true)
    await fetch(`${KONG_URL}/forgetPassword`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email
      })
    })

    setEmailSended(true)
    setIsLoading(false)
  }
  const resetRecoverFlow = () => {
    setEmailSended(false);
    setForgotPassword(false);
  }

  async function SignUp(e) {
    e.preventDefault()
    let x;

    if (!!email && !!password) {
      setIsError(false)
      setIsLoading(true);

      try {
        x = await (await fetch(`${KONG_URL}/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email,
            password: password
          })
        })).json()

        if (!!x.message) {
          setIsLoading(false);
          setLoginError(`${x.message}`)
          setIsError(true)
          toast.error(`${x.message}`, {
            position: "top-right"
          });
        } else {
          setLoginError("");
          setIsError(false);

          if (x.usersType?.id === 3) {
            if (!!x.eventsClasses) {
              const eventsClassesString = JSON.stringify(x.eventsClasses);
              setEventClasses(eventsClassesString);
              localStorage.setItem("event_classes", eventsClassesString);
            }
          }


          localStorage.setItem("user", JSON.stringify(x));
          setUser(x)
          toast.success("Login Efetuado com Sucesso!", {
            autoClose: 2000,
            position: "top-right"
          });
        }

      } catch (error) {
        setLoginError("* Erro ao fazer Login, tente novamente.")
        toast.error("Erro ao fazer Login, tente novamente.", {
          position: "top-right"
        });
        setIsLoading(false);
        setIsError(true)
        return ""
      }
    } else {
      setLoginError("* Preencha os campos antes de prosseguir.")
      toast.error("Preencha os campos antes de prosseguir.", {
        position: "top-right"
      });
      setIsLoading(false);
      setIsError(true)
      return ""
    }
  }

  useEffect(() => {

    if (email?.length < 2) {
      setLoginError("* Preencha o Email corretamente.")
    } else if (password?.length < 2) {
      setLoginError("* Preencha a Senha corretamente.")
    } else {
      setLoginError("")
    }

  }, [email, password])


  useEffect(() => {
    if (user) {
      let data = localStorage.getItem("user", null)
      if (data) {
        if (user.usersType.id == 1) {
          router.push('/admin/evento/');
        } else if (user.usersType.id == 2) {
          router.push('/cliente/eventos/');
        } else if (user.usersType.id === 3) {
          router.push('/convidado/evento/');
        }
      }
      setUser(null)
    }
  }, [user])


  const checkboxLabel = { inputProps: { 'aria-label': 'Checkbox demo' } };
  return (
    <div>
      <ToastContainer />
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
              <div className="flexc titleLoginLitle">
                <p>Insira suas credenciais.</p>
              </div>
              <form className="flexc inputsDivLogin">
                <div className="flexr inputDiv">
                  <TextField
                    onChange={(e) => setEmail(e.target.value)}
                    className="inputStyle" label="E-mail/CPF" id="outlined-size-normal" placeholder="Digite seu E-mail/CPF" type="text" />
                </div>
                <div className="flexr inputDivPassword">
                  <TextField
                    onChange={(e) => setPassword(e.target.value)}
                    className="inputStyle" label="Senha" id="outlined-size-normal" placeholder="Digite sua Senha" type={passwordVisibble == true ? "text" : "password"} />
                  {passwordVisibble == true ? <VisibilityIcon onClick={changeVisible} style={{ color: "#00276E" }} className="passwordIcon" color="#00276E" /> : <VisibilityOffIcon style={{ color: "#00276E" }} onClick={changeVisible} className="passwordIcon" color="#00276E" />}
                </div>
                <p className="errorP">{!!isError && loginError}</p>
                <div className="flexr forgotLoginDiv">
                  <FormControlLabel onClick={changeSetData} control={<Checkbox />} label="Lembrar-me" />
                  <p onClick={changeSetForgotPassword}>Esqueci minha senha</p>
                </div>
                <div
                  className="btnLoginDiv flexr">
                  <button
                    onClick={(e) => SignUp(e)}
                    className="btnBlue"
                    style={{ width: "60%" }}>{isLoading == false ? "Entrar" : <Loader></Loader>}</button></div>
              </form>
            </>
            :
            forgotPassword == true && emailSended == false ?
              <>
                <div className="flexr titleRecover" onClick={changeSetForgotPassword}>
                  <h1><ArrowBackIcon style={{ marginRight: 20, color: "#00276E" }} fontSize="60px" color="#00276E" />Login </h1>
                </div>
                <form className="flexc inputsDivLogin">
                  <div className="flexr inputDiv">
                    <TextField onChange={(e) => setEmail(e.target.value)} className="inputStyle" label="E-mail" id="outlined-size-normal" placeholder="Digite seu E-mail" type="text" />
                  </div>

                  <div className="btnLoginDiv flexr">
                    <button
                      type="button"
                      onClick={() => sendEmail()}
                      className="btnBlue btnRecoverPassword" style={{ width: "60%", marginTop: "40px" }}>{isLoading == false ? "Recuperar Senha" : <Loader></Loader>}</button>
                  </div>
                </form>
              </>
              :
              <>
                <div className="flexr titleRecover" onClick={changeSetForgotPassword}>
                  <h1 onClick={() => resetRecoverFlow()} style={{ cursor: "pointer" }}><ArrowBackIcon style={{ marginRight: 20, color: "#00276E" }} fontSize="60px" color="#00276E" />Login </h1>
                </div>
                <div className="flexr verifyEmail" onClick={changeSetForgotPassword}>
                  <h1 style={{ fontSize: "25px" }}>Verifique seu e-mail. <CheckBoxIcon className="verifyEmail" style={{ marginLeft: 20, color: "#00AE0F" }} sx={{ fontSize: 40 }} color="#00AE0F" /></h1>
                </div>
              </>
          }
          <div className="flexr helpLoginDiv">
            <p>Precisa de ajuda? <a href="/">Fale Conosco</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}
