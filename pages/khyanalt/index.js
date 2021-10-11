import Admin from "../../components/Admin";
import shalgaltKhiikh from "../../services/shalgaltKhiikh";
function Khyanalt() {
  return <Admin title="Хяналт"></Admin>;
}

export const getServerSideProps = shalgaltKhiikh;

export default Khyanalt;
