import ProductDetailView from "../../../../../component/ProductDetailView";
import { getProduct, getProductSalesBetween } from "../../../api";
import {
  getDefaultDateRange,
  toEndDateTime,
  toStartDateTime,
} from "@/lib/dateRange";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const productId = Number(id);
  const product = Number.isFinite(productId) ? await getProduct(productId) : null;
  const defaultDateRange = getDefaultDateRange();
  const productSales = Number.isFinite(productId)
    ? await getProductSalesBetween(
        toStartDateTime(defaultDateRange.startDate),
        toEndDateTime(defaultDateRange.endDate),
      )
    : [];
  const monthlySales =
    productSales.find((productSale) => productSale.id === productId)?.sales ?? 0;

  return <ProductDetailView product={product} monthlySales={monthlySales} />;
}
