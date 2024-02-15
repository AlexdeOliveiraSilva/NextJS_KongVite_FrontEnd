import CircularProgress from '@mui/material/CircularProgress';

export default function Loading() {
    return (
        <div className="loginContent flexr" style={{ backgroundImage: "url(/images/image-kongvite-background.jpg)" }}>
            <CircularProgress size={80} />
        </div>
    )
}