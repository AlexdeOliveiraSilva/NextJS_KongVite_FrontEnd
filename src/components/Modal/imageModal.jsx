'use client'

import Loader from "../fragments/loader"
import CloseIcon from '@mui/icons-material/Close';

export default function ImageModal({ close, image }) {

    return (
        <div
            onClick={close}
            className='imageModalFull flexr'
        >
            <div onClick={(e) => e.stopPropagation()}
                className='imageModalContent flexr'>
                <CloseIcon onClick={close} className='imageModalContentClose'></CloseIcon>
                <img src={image}></img>
            </div>
        </div >
    )
}