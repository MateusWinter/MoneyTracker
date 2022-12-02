import styles from "../../styles/Navbar/Navbar.module.scss";

import ListItemLink from "./ListItemLink";

import { Link } from "react-router-dom";

import { useLogoutUser } from "../../queries/user";
import { queryClient } from "../../constants/config";

import { useNavigate } from "react-router-dom";

import logoImg from '../../assets/KDO$_logo.png';

const Navbar = () => {
  const navigate = useNavigate();
  const { mutate: logoutHandler } = useLogoutUser();

  return (
    <div className={styles.container}>
      <div >
        <Link to="/">
          <img className={styles.logo} src={logoImg} alt="" />
        </Link>
      </div>

      <nav>
        <ul>
          <ListItemLink url="">
            <h3>Home</h3>
          </ListItemLink>

          <ListItemLink url="categories">
            <h3>Categorias</h3>
          </ListItemLink>

          <ListItemLink url="transactions">
            <h3>Transações</h3>
          </ListItemLink>


          <div className={styles.mobileMenuLinks}>
            <ListItemLink url="profile">
              <h3>Perfil</h3>
            </ListItemLink>
          </div>

          <div className={styles.mobileMenuLinks}>
            <ListItemLink url="settings">
              <h3>Configurações</h3>
            </ListItemLink>
          </div>
          <button
            className={styles.logout}
            onClick={() => {
              logoutHandler(null, {
                onSuccess: () => {
                  queryClient.removeQueries();
                  queryClient.cancelQueries();
                  navigate("/auth");
                },
              });
            }}
          >
            <span>Sair</span>
          </button>
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
