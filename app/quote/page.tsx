import { getAllProducts } from "@/src/infrastructure/repositories/ProductRepository";
import { QuoteController } from "./_components/QuoteController";

export const metadata = {
  title: "Dynamic Pricing — lab-nextjs",
  description: "Backend-driven quote calculation demo for US and CA.",
};

export default function QuotePage() {
  const products = getAllProducts();
  return <QuoteController products={products} />;
}
