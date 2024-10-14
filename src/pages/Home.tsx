import { Cpu } from 'lucide-react';
import "../styles/home.css";
import LogoCBTECH from "../components/LogoCBTECH.jpg";

export const Home = () => {
  return (
    <div className="home">
         <Cpu className="home-logo" />
         <h1>Serviços Técnicos de Informática</h1>
      <div className="home-CBTECH">
       <img src={LogoCBTECH} alt="Logo CBTECH" />
      </div>
    </div>
  );
};