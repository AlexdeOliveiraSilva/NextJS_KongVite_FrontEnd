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

export default function Dashboard() {
  const router = useRouter();
  const { KONG_URL, user, setUserName, setUserEmail, setUserType, setUserJwt } = useContext(GlobalContext);


  return (
    <div className="dashboardMain flexr">
      <div className="dashboardContent flexc"></div>
    </div>
  );
}
