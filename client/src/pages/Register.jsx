import styles from "../styles/Auth.module.scss";
import MainContainer from "../components/Containers/MainContainer";
import { Title } from "../components/Titles/Titles";
import { useLoginUser } from "../queries/user";
import { useRegisterUser } from "../queries/user";
import { Link } from "react-router-dom";
import { queryClient } from "../constants/config";
import Spinner from "../components/Spinner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const Error = ({ error }) => {
  return (
    <span style={{ color: "red", marginBottom: "1rem" }}>{error && error}</span>
  );
};

const Register = () => {
  const { mutateAsync: loginHandler, isLoading: loggingIn } = useLoginUser();
  const { mutate: registerUser, isLoading: registering } = useRegisterUser();

  const schema = z.object({
    firstName: z
      .string()
      .min(2, { message: "Primeiro nome precisa ter no minimo 2 caracteres" })
      .max(20, { message: "Primeiro nome precisa ter no maximo 20 caracteres" }),
    lastName: z
      .string()
      .min(2, { message: "Sobrenome precisa ter no minimo 2 caracteres" })
      .max(20, { message: "Sobrenome nome precisa ter no maximo 20 caracteres" }),
    email: z.string().email({ message: "Email invalido" }),
    password: z
      .string()
      .min(4, { message: "Senha precisa ter no minimo 4 caracteres" }),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValidating: validating },
  } = useForm({
    resolver: zodResolver(schema),
  });

  return (
    <MainContainer>
      <form
        action="submit"
        onSubmit={handleSubmit((d) =>
          registerUser(d, {
            onSuccess: async () => {
              await loginHandler({
                email: d.email,
                password: d.password,
              });
              queryClient.invalidateQueries("user");
            },
          })
        )}
        className={styles.registerForm}
      >
        <div className={styles.container}>
          <Title>Register</Title>
          <span>Nome :</span>
          <input type="fname" {...register("firstName")} />
          <Error error={errors?.firstName?.message} />
          <span>Sobrenome :</span>
          <input type="lname" {...register("lastName")} />
          <Error error={errors?.lastName?.message} />
          <span>Email :</span>
          <input type="email" autoComplete="email" {...register("email")} />
          <Error error={errors?.email?.message} />
          <span>Senha :</span>
          <input type="password" {...register("password")} />
          <Error error={errors?.password?.message} />

          <button type="submit">Registre-se</button>
        </div>
        <Link to="/auth" style={{ textAlign: "center" }}>
          Já possui uma conta?
        </Link>
      </form>
      {(validating || registering || loggingIn) && <Spinner fullPage />}
    </MainContainer>
  );
};

export default Register;
