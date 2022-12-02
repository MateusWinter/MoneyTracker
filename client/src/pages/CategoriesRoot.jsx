import TabComponent from "../components/TabComponent";
import MainContainer from "../components/Containers/MainContainer";

const CategoriesRoots = () => {
  const tabs = [
    {
      name: "Todas",
      link: "results",
    },
    {
      name: "Criar",
      link: "create",
    },
    {
      name: "Excluir",
      link: "delete",
    },
  ];

  return (
    <MainContainer>
      <TabComponent Tabs={tabs} baseUrl='categories' />
    </MainContainer>
  );
};

export default CategoriesRoots;
