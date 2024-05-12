import { FcInvite } from "react-icons/fc";

export default function SplideCard({ name, f, s }) {
    return (
        <div className="splideCard flexr" >
            <div className="splideCardContent flexr">
                <div>
                    <h1>{f}/{s}</h1>
                    <p>Ingressos {name}</p>
                </div>
                <div><FcInvite size={40}></FcInvite></div>
            </div>
        </div>
    )
}