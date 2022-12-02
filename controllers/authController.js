import prisma from "../constats/config.js";
import bcrypt from "bcrypt";
import { z } from "zod";

const auth_login = async (req, res) => {
  let user;
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ message: "Campos vazios" });
    return;
  }

  try {
    user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    //CHECK PW
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (isPasswordCorrect) {
      //ADD USER ID TO THE SESSION
      req.session.userId = user.id;
      res.status(200).send("Authed");
    } else {
      res.status(400).json({ message: "Dados invalidos" });
    }
  } catch (e) {
    if (!user) res.status(400).json({ message: "Dados invalidos" });
    else res.status(400).json({ message: "Algo deu errado" });
  }
};

const auth_register = async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  const schema = z.object({
    email: z.string().email({ message: "Email invalido" }),
    password: z
      .string()
      .min(3, { message: "Senha precisa ter no minimo 3 caracteres" }),
    firstName: z
      .string()
      .min(2, { message: "Nome precisa ter no minimo 2 caracteres" }),
    lastName: z
      .string()
      .min(2, { message: "Sobrenome precisa ter no minimo 2 caracteres" }),
  });

  const isValid = schema.safeParse(req.body);
  if (isValid?.error) {
    res.status(400).json({ errors: isValid?.error?.errors });
    return;
  }

  let emailCheck;
  try {
    emailCheck = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
  } catch {
    res.status(500).json({ message: "Algo deu errado" });
  }

  if (emailCheck) res.status(500).json({ message: "Uma conta com este email ja existe" });
  else {
    const saltRounds = 10;
    let salted_password = await bcrypt.hash(password, saltRounds);
    let newUser;

    try {
      newUser = await prisma.user.create({
        data: {
          email: email,
          password: salted_password,
          firstName: firstName,
          lastName: lastName,
        },
      });

      await prisma.transactionCategory.createMany({
        data: [
          {
            name: "Produtos",
            userId: newUser.id,
          },
          {
            name: "Entretenimento",
            userId: newUser.id,
          },
          {
            name: "Contas",
            userId: newUser.id,
          },
        ],
      });

      res.status(200).json({ userId: newUser.id });
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: "Algo deu errado" });
      return;
    }
  }
};

const auth_logout = async (req, res) => {
  req.session.destroy((err) => {
    if (err) res.status(500).send("Não foi possivel terminar a sessão");
    else res.status(200).send("Deleted");
  });
};

const auth_user = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.session.userId,
      },
    });
    if (!user) res.status(401).json("Usuario não encontrado");
    const data = {
      email: user.email,
      userId: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
    };
    res.status(200).json(data);
  } catch {
    res.status(500).json("Algo deu errado {auth}");
  }
};

export { auth_register, auth_login, auth_logout, auth_user };
