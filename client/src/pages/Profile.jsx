import MainContainer from "../components/Containers/MainContainer";
import { Title } from "../components/Titles/Titles";
import { useUser, useUserUpdate, useUserDelete } from "../queries/user";
import styles from "../styles/profileComponents/Profile.module.scss";
import { useState, useEffect } from "react";
import { queryClient } from "../constants/config";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const nav = useNavigate();
  const { data: user, isSuccess } = useUser();
  const {
    mutate: UserUpdate,
    isSuccess: userUpdated,
    isError: userNotUpdated,
    isLoading: userUpdating,
  } = useUserUpdate();

  const {
    mutate: UserDelete,
    isSuccess: userDeleted,
    isError: userNotDeleted,
    isLoading: userDeleting,
  } = useUserDelete();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  useEffect(() => {
    if (isSuccess) {
      try {
        setFirstName(user.data.firstName);
        setLastName(user.data.lastName);
      } catch {}
    }
  }, [isSuccess, user]);

  const body = {
    firstName: firstName,
    lastName: lastName,
  };

  return (
    <MainContainer>
      <div className={styles.container}>
        <Title>Profile</Title>
        <form action="submit" onSubmit={(e) => e.preventDefault()}>
          <div className={styles.formInner}>
            <div className={styles.firstName}>
              <label htmlFor="firstName">Nome :</label>
              <input
                type="text"
                name="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className={styles.lastName}>
              <label htmlFor="lastName">Sobrenome : </label>
              <input
                type="text"
                name="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <button onClick={() => UserUpdate(body)} disabled={userUpdating}>
              {userUpdating ? "Atualizando..." : "Atualizar"}
            </button>
            {userUpdated && (
              <div style={{ marginTop: "1rem", color: "green" }}>Sucesso</div>
            )}
            {userNotUpdated && (
              <div style={{ marginTop: "1rem", color: "red" }}>Erro</div>
            )}
          </div>
        </form>
        <button
          onClick={() =>
            UserDelete(null, {
              onSuccess: () => {
                queryClient.removeQueries();
                queryClient.cancelQueries();
                queryClient.cancelMutations();
                nav("/auth");
              },
            })
          }
          disabled={userDeleting}
          style={{ marginTop: "1rem" }}
        >
          {userDeleting ? "Excluindo..." : "Excluir conta"}
        </button>
      </div>
    </MainContainer>
  );
};

export default Profile;
