import ProductItem from "./ProductItem";
import classes from "./Products.module.css";

const DUMMY_Products = [
  { id: 'x1', title: "Nike Shoes", price: 10, description: "Nike Continental" },
  { id: 'x2', title: "Reebok Shoes", price: 5, description: "Reebok Sports" },
];
const Products = (props) => {
  return (
    <section className={classes.products}>
      <h2>Buy your favorite products</h2>
      <ul>
        {DUMMY_Products.map((product)=>{
          return ( <ProductItem
            key={product.id}
            id={product.id}
            title={product.title}
            price={product.price}
            description={product.description}
          />)
         
        })}
        
      </ul>
    </section>
  );
};

export default Products;
