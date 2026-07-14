import { getAllProducts } from "@/lib/products";
import { ProductsView } from "@/components/dashboard/ProductsView";

export const dynamic = "force-dynamic";

export default async function GateauxPage() {
  const products = await getAllProducts();
  return <ProductsView products={products} />;
}
