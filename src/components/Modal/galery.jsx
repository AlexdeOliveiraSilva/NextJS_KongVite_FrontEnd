'use client'

import { useState } from "react"
import CloseIcon from '@mui/icons-material/Close';

export default function Galery({ close, data, image }) {
    const [images, setImages] = useState();

    if (!!image) {
        return (
            <div
                onClick={close}
                className='mainModal flexr'>
                <div
                    onClick={(e) => e.stopPropagation()}
                    className='contentGalery flexc'>
                    <div
                        onClick={close}
                        className='modalClose flexr'><CloseIcon></CloseIcon></div>
                    <img src={image}></img>
                </div>
            </div>
        )
    } else {
        return ""
    }
}