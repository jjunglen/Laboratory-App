import { useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar"

export default function Landing() {
    const navigate = useNavigate();

    return (
        <div>
            <Navbar />
        </div>
    );
}