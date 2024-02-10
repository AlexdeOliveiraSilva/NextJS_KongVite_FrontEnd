'use client'

import React, { useState, useEffect } from "react"
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { usePathname } from "next/navigation";
import TopbarAdmin from "../fragments/topbarAdmin";

export default function Topbar() {
    const path = usePathname();
    const [pageTitle, setPageTitle] = useState("");

    const changeTitle = (x) => {
        switch (x) {
            case "/admin/dashboard":
                return "Dashboard"
                break;

            default:
                break;
        }
    }

    useEffect(() => {
        setPageTitle(changeTitle(path))

    }, [path])

    return (
        <div className="topbarMain flexr">
            <div className="topbarContent flexr">
                <div className="topbarPageTitle flexr">
                    <ChevronRightIcon className="topbarTitleIcon"></ChevronRightIcon>
                    <h1>{pageTitle}</h1>
                </div>
                <div className="topbarPageMidle flexr">
                    <TopbarAdmin></TopbarAdmin>
                </div>
                <div className="topbarPageHello flexr">
                    <h2>Olá, <span>Rafael!</span></h2>
                </div>
            </div>
        </div>
    )
}