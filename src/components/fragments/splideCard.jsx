import { FcInvite } from "react-icons/fc";

export default function SplideCard() {
    return (
        <div className="splideCard flexr" >
            <div className="splideCardContent flexr">
                <div>
                    <h1>1/2</h1>
                    <p>Ingressos</p>
                </div>
                <div><FcInvite size={40}></FcInvite></div>
            </div>
        </div>
    )
}