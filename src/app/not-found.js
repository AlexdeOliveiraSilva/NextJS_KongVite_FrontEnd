'use client'

import { useRouter } from "next/navigation"

export default function NotFound() {
    const router = useRouter();

    return (
        <div className="loginContent flexr" style={{ backgroundImage: "url(/images/image-kongvite-background.jpg)" }}>
            <div className="notFoundContent flexc">
                <h1>404</h1>
                <p>Desculpe, essa Pagina não foi encontrada!</p>
                <button
                    onClick={(e) => { e.preventDefault(), router.push('/') }}
                    className="btnBlue">Voltar</button>
            </div>
        </div>
    )
}