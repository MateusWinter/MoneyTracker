import MainContainer from "../components/Containers/MainContainer";

import { Title } from "../components/Titles/Titles";
import CategoryCard from "../components/Cards/CategoryCard";
import TransactionCard from "../components/Cards/TransactionCard";
import styles from "../styles/HomeComponents/Home.module.scss";
import HomeProfile from "../components/HomeComponents/HomeProfile";
import Spinner from "../components/Spinner";

import { DateTime } from "luxon";
import { useTransactionsGet } from "../queries/transaction";
import { useCategoriesSum } from "../queries/category";
import { useEffect } from "react";

const Home = () => {
  const {
    data: transactions,
    refetch: fetchTransactions,
    isLoading: transactionsLoading,
  } = useTransactionsGet({
    key: "Trs_Latest",
    skip: 0,
    take: 5,
  });

  const { data: categoriesSum, isLoading: categoriesSumLoading } =
    useCategoriesSum();
  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <MainContainer optionClass={styles.container}>
      <div className={styles.main}>
        <div className={styles.categories}>
          <Title>Categorias dos ultimos 30 dias</Title>
          {categoriesSumLoading ? (
            <Spinner />
          ) : (
            <div className={styles.content}>
              {categoriesSum?.data?.map((category, index) => {
                return (
                  <CategoryCard
                    key={index}
                    category={category?.name}
                    money={
                      category?.sum > 1000
                        ? `-$${(category.sum / 1000).toFixed(1)}k`
                        : category?.sum < 1000 && category?.sum > 0
                        ? `-$${category.sum}`
                        : "Nenhuma despesa"
                    }
                  />
                );
              })}
            </div>
          )}
        </div>

        <div className={styles.transactions}>
          <Title> Ultimas transações</Title>
          {transactionsLoading ? (
            <Spinner />
          ) : (
            <div className={styles.content}>
              {transactions?.data?.transactions?.map((transaction, index) => {
                return (
                  <TransactionCard
                    key={index}
                    category={transaction?.category?.name}
                    date={DateTime.fromISO(transaction?.date).toISODate()}
                    money={transaction?.money?.toFixed(2)}
                    description={transaction?.info}
                    title={transaction?.title}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
      <div className={styles.profile}>
        <HomeProfile />
      </div>
    </MainContainer>
  );
};

export default Home;
