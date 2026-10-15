import { notFound } from "next/navigation";
import { getProductIndex, products } from "@/data/products";

// The carousel UI lives in TheApp, which stays mounted. Next remounts anything
// under this segment each time the product id changes, so this page renders
// nothing: it only makes /<product id> a valid route.
export function generateStaticParams() {
  return products.map((product) => ({ productId: product.id }));
}

export default function ProductPage({
  params,
}: {
  params: { productId: string };
}) {
  // The middleware redirects unknown ids, so this is only a safety net.
  if (getProductIndex(params.productId) === -1) notFound();
  return null;
}
