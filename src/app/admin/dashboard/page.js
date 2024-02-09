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

export default function Dashboard() {
  const { adminSidebarItens, setAdminSidebarItens, theme, setTheme } = useContext(GlobalContext);

  return (
    <div className="dashboardMain flexr">
      <h1>dashboard</h1>
    </div>
  );
}
