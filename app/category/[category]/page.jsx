import CategoryItems from "@/app/components/categoryItems/CategoryItems";
import { fetchCardsByCategory } from "@/actions/actions";
import { URLSearchParams } from 'url';

const CategoryPage = async ({ params, searchParams }) => {
  const { category } = params;
  const decodedCategory = decodeURIComponent(category).trim();
  const groupedCards = await fetchCardsByCategory(category);
  const queryParams = new URLSearchParams(searchParams);
  const showParams = queryParams.get("show");
  const show = showParams === "true" ? true : false;

  return (
    <CategoryItems category={decodedCategory} groupedCards={groupedCards} showParams={show}/>
  );
};

export default CategoryPage;
