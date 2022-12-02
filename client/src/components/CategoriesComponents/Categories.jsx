import { Title } from "../Titles/Titles";
import React, { useState } from "react";
import { useCategoriesGet } from "../../queries/category";
import { useTransactionsGet } from "../../queries/transaction";
import TransactionCard from "../Cards/TransactionCard";
import styles from "../../styles/CategoriesComponents/Categories.module.scss";
import { DateTime } from "luxon";
import { useEffect } from "react";
import Spinner from "../Spinner";

const Categories = () => {
  const [timeSpan, setTimeSpan] = useState(
    DateTime.now()
      .minus({
        days: 7,
      })
      .toISODate()
  );

  const [categories, setCategories] = useState("");
  const [sortingField, setSortingField] = useState("date");
  const [order, setOrder] = useState("asc");
  const {
    data: ctgs,
    isLoading: ctgsLoading,
    isSuccess: ctgsSuccess,
  } = useCategoriesGet();
  const [skip, setSkip] = useState(0);
  const [take] = useState(4);
  const {
    data: FilteredTransactions,
    refetch: fetchTransactions,
    isRefetching: FilteredTransactionsLoading,
  } = useTransactionsGet({
    firstDate: timeSpan,
    category: categories || undefined,
    [sortingField]: order,
    skip: skip,
    take: take,
    key: "CategoriesTrs",
  });

  useEffect(() => {
    console.log(sortingField, order);
  }, [order, sortingField]);

  useEffect(() => {
    fetchTransactions();
  }, [skip]);

  return (
    <div className={styles.container}>
      <Title>Categorias</Title>

      <div className={styles.filters}>
        <div className={styles.filterContainer}>
          <div className={styles.filter}>
            <label htmlFor="timeSpan">Periodo:</label>
            <select
              name="timeSpan"
              onChange={(e) => {
                setTimeSpan(e.target.value);
              }}
            >
              <option
                value={DateTime.now()
                  .minus({
                    days: 7,
                  })
                  .toISODate()}
              >
                Nos ultimos 7 dias
              </option>
              <option
                value={DateTime.now()
                  .minus({
                    days: 28,
                  })
                  .toISODate()}
              >
                Nos ultimos 28 dias
              </option>
              <option
                value={DateTime.now()
                  .minus({
                    days: 90,
                  })
                  .toISODate()}
              >
                Nos ultimos 90 dias
              </option>
              <option
                value={DateTime.now()
                  .minus({
                    days: 365,
                  })
                  .toISODate()}
              >
                Nos ultimos 365 dias
              </option>
            </select>
          </div>
        </div>

        <div className={styles.filterContainer}>
          <div className={styles.filter}>
            <label htmlFor="categories">Categorias :</label>
            {ctgs?.data?.ctgs?.length > 0 && ctgsSuccess ? (
              <select
                name="categories"
                onChange={(e) => {
                  setCategories(e.target.value);
                }}
              >
                {ctgs?.data?.ctgs?.map((category, index) => {
                  return (
                    <option key={index} value={category.id}>
                      {category.name}
                    </option>
                  );
                })}
                <option value="">Todas</option>
              </select>
            ) : ctgsLoading ? (
              <div
                style={{
                  padding: "0.61rem 1.5rem",
                  background: "#ececec",
                  fontSize: "0.9rem",
                }}
              >
                Carregando...
              </div>
            ) : (
              <div
                style={{
                  padding: "0.61rem 1.5rem",
                  background: "#ececec",
                  fontSize: "0.9rem",
                }}
              >
                Nenhuma categoria
              </div>
            )}
          </div>
        </div>

        <div className={styles.filterContainer}>
          <div className={styles.filter}>
            <label htmlFor="sortingField">Tipo :</label>
            <select
              name="sortingField"
              value={sortingField}
              onChange={(e) => {
                setSortingField(e.target.value);
              }}
            >
              <option value="dateSort">Data</option>
              <option value="priceSort">Preço</option>
            </select>
          </div>
        </div>

        <div className={styles.filterContainer}>
          <div className={styles.filter}>
            <label htmlFor="order">Ordem :</label>
            <select
              name="order"
              onChange={(e) => {
                setOrder(e.target.value);
              }}
            >
              <option value="asc">Crescente</option>
              <option value="desc">Decrescente</option>
            </select>
          </div>
        </div>
      </div>

      <div className={styles.results}>
        <div className={styles.btns}>
          {skip === 0 && (
            <button
              className={styles.btn}
              onClick={() => {
                fetchTransactions();
              }}
            >
              Mostrar Resultados
            </button>
          )}

          {skip !== 0 && !FilteredTransactionsLoading && (
            <button
              className={styles.btn}
              onClick={() => {
                setSkip(0);
              }}
            >
              Ir para pagina 0
            </button>
          )}

          {FilteredTransactions?.data?.hasMore && !FilteredTransactionsLoading && (
            <button
              className={styles.btn}
              onClick={() => {
                setSkip((prev) => prev + take);
              }}
            >
              Proxima pagina
            </button>
          )}
          {skip - take >= 0 && !FilteredTransactionsLoading && (
            <button
              className={styles.btn}
              onClick={() => {
                setSkip((prev) => prev - take);
              }}
            >
              Pagina anterior
            </button>
          )}
        </div>

        <div className={styles.inner}>
          {!FilteredTransactionsLoading &&
            FilteredTransactions?.data?.transactions?.map(
              (transaction, index) => {
                return (
                  <TransactionCard
                    key={index}
                    category={transaction?.category?.name}
                    money={transaction?.money}
                    date={DateTime.fromISO(transaction?.date).toISODate()}
                    description={transaction?.info}
                    title={transaction?.title}
                  />
                );
              }
            )}
          {FilteredTransactions?.data?.transactions?.length === 0 && (
            <div style={{ color: "red" }}>Sem resultados</div>
          )}

          {FilteredTransactionsLoading && (
            <div
              style={{
                marginTop: "2rem",
                height: "450px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Spinner />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Categories;
