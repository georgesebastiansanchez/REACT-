import { Link } from "react-router-dom";
import "../css/Modulo.css"; // si quieres separar estilos

export default function Modulo({ imgSrc, alt, title, description, link, imgWidth }) {
  return (
    <div className="modulo-card">
      <img src={imgSrc} alt={alt} width={imgWidth} />
      <h3>{title}</h3>
      <p>{description}</p>
      <Link to={link}>Ir al módulo</Link>
    </div>
  );
}
