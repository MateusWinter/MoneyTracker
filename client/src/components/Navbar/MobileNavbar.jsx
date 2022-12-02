import styles from "../../styles/Navbar/MobileNavbar.module.scss";
import { FaTimes, FaBars } from "react-icons/fa";

import ListItemLink from "./ListItemLink";
import { queryClient } from "../../constants/config";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLogoutUser } from "../../queries/user";

const MobileNavbar = () => {
  const [navOpen, setNavOpen] = useState(false);
  const navigate = useNavigate();

  const { mutate: logoutHandler } = useLogoutUser();

  const closeNav = () => {
    setNavOpen(false);
  };

  return (
    <>
      <div className={styles.container}>
        <div>
          <div
            className={`${styles.iconContainer} ${styles.bars}`}
            onClick={() => setNavOpen(true)}
          >
            <FaBars />
          </div>

          <nav className={navOpen ? styles.navActive : undefined}>
            <ul>
              <div
                className={`${styles.iconContainer} ${styles.times}`}
                onClick={() => setNavOpen(false)}
              >
                <FaTimes />
              </div>

              <ListItemLink
                url=''
                optionClass={styles.linkColor}
                clickHandler={closeNav}
              >
                <h3>Home</h3>
              </ListItemLink>

              <ListItemLink
                url='categories'
                optionClass={styles.linkColor}
                clickHandler={closeNav}
              >
                <h3>Categorias</h3>
              </ListItemLink>

              <ListItemLink
                url='transactions'
                optionClass={styles.linkColor}
                clickHandler={closeNav}
              >
                <h3>Transações</h3>
              </ListItemLink>


              <div className={styles.mobileMenuLinks}>
                <ListItemLink
                  url='profile'
                  optionClass={styles.linkColor}
                  clickHandler={closeNav}
                >
                  <h3>Perfil</h3>
                </ListItemLink>
              </div>

              <div className={styles.mobileMenuLinks}>
                <ListItemLink
                  url='settings'
                  optionClass={styles.linkColor}
                  clickHandler={closeNav}
                >
                  <h3>Configurações</h3>
                </ListItemLink>
              </div>

              <button
                url='logout'
                onClick={() => {
                  logoutHandler(null, {
                    onSuccess: () => {
                      queryClient.removeQueries();
                      queryClient.cancelQueries();

                      navigate("/auth");
                    },
                  });
                }}
                style={{
                  background: "transparent",
                  cursor: "pointer",
                  color: "whitesmoke",
                  fontWeight: "500",
                }}
              >
                <h3>Sair</h3>
              </button>
            </ul>
          </nav>
        </div>
      </div>

      <div
        onClick={() => setNavOpen(false)}
        className={styles.blackBg}
        style={navOpen ? { transform: "translateX(0)" } : undefined}
      />
    </>
  );
};

export default MobileNavbar;
