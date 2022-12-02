import TabComponent from "../components/TabComponent";
import MainContainer from "../components/Containers/MainContainer";

const TransactionsRoot = () => {
  const tabs = [
    {
      name: "Adicionar",
      link: "create",
    },

    {
      name: "Excluir",
      link: "delete",
    },
  ];

  return (
    <MainContainer>
      <TabComponent Tabs={tabs} baseUrl='transactions' />
    </MainContainer>
  );
};

export default TransactionsRoot;
