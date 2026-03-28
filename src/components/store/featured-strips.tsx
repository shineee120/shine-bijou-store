import { Product } from "@/types/store";
import { formatCurrency } from "@/lib/utils";

export function FeaturedStrips({ products }: { products: Product[] }) {
  const featured = products.filter((product) => product.featured);
  const newArrivals = products.filter((product) => product.newArrival);

  return (
    <section className="section subtle-section">
      <div className="container strip-layout">
        <div>
          <p className="eyebrow">Destacados</p>
          <h2>Elegidos para regalar o combinar</h2>
          <div className="mini-list">
            {featured.map((product) => (
              <div key={product.id} className="mini-product">
                <span>{product.name}</span>
                <small>{formatCurrency(product.price)}</small>
              </div>
            ))}
          </div>
        </div>
        <div>
          <p className="eyebrow">Nuevos ingresos</p>
          <h2>Lo ultimo que llego a Shine</h2>
          <div className="mini-list">
            {newArrivals.map((product) => (
              <div key={product.id} className="mini-product">
                <span>{product.name}</span>
                <small>{formatCurrency(product.price)}</small>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
