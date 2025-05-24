import { getLatestProducts } from "../../lib/actions/product.action";
import ProductList from "../../components/shared/product/product-list";

export default async function Home() {
  const latestProducts = await getLatestProducts();
  return (
    <>
     <ProductList data={latestProducts} title="Newest Arrials" />
      <h1>Hello World</h1>
    </>
  );
}
