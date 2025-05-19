import sampleData from "@/db/sample-data";
import ProductList from "../../components/shared/product/product-list";
export default function Home() {
  return (
    <>
     <ProductList data={sampleData.products} title="Newest Arrials" />
      <h1>Hello World</h1>
    </>
  );
}
