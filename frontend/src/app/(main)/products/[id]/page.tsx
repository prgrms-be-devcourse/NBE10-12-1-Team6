import ProductDetailView from "../../../../../component/ProductDetailView";
import { getProduct } from "../../../api";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const productId = Number(id);
  const product = Number.isFinite(productId) ? await getProduct(productId) : null;

  return <ProductDetailView product={product} />;
}
