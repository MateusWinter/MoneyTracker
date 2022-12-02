import styles from "./styles/App.module.scss";

import { Routes, Route } from "react-router-dom";

import PageContainer from "./components/Containers/PageContainer";
import MainContainer from "./components/Containers/MainContainer";
import PageLayout from "./components/PageLayout";
import AuthGuard from "./components/AuthGuard";
import Interceptor from "./components/Interceptor";

import Auth from "./pages/Auth";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import TransactionsRoot from "./pages/TransactionsRoot";

import TransactionCreate from "./components/TransactionComponents/TransactionCreate";
import TransactionDelete from "./components/TransactionComponents/TransactionDelete";

import CategoriesRoot from "./pages/CategoriesRoot";

import Categories from "./components/CategoriesComponents/Categories";
import CategoryCreate from "./components/CategoriesComponents/CategoryCreate";
import CategoryDelete from "./components/CategoriesComponents/CategoryDelete";

import { ReactQueryDevtools } from "react-query/devtools";
import { QueryClientProvider } from "react-query";
import { queryClient } from "./constants/config";

function App() {
  return (
    <div className={styles.App}>
      <QueryClientProvider client={queryClient}>
        <Interceptor />
        <AuthGuard>
          <PageContainer optionClass={styles.pageContainer}>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/register" element={<Register />} />
              <Route element={<PageLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="settings" element={<Settings />} />
                <Route path="profile" element={<Profile />} />
                <Route path="transactions" element={<TransactionsRoot />}>
                  <Route index element={<TransactionCreate />} />
                  <Route path="create" element={<TransactionCreate />} />
                  <Route path="delete" element={<TransactionDelete />} />
                </Route>
                <Route path="categories" element={<CategoriesRoot />}>
                  <Route index element={<Categories />} />
                  <Route path="results" element={<Categories />} />
                  <Route path="create" element={<CategoryCreate />} />
                  <Route path="delete" element={<CategoryDelete />} />
                </Route>

                <Route
                  path="/*"
                  element={
                    <MainContainer>
                      <span style={{ fontSize: "1.2rem" }}>
                        404 Pagina não encontrada
                      </span>
                    </MainContainer>
                  }
                />
              </Route>
            </Routes>
          </PageContainer>
        </AuthGuard>
        <ReactQueryDevtools />
      </QueryClientProvider>
    </div>
  );
}

export default App;
