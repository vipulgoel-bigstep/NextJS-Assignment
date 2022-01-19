import Head from "next/head";
import Image from "next/image";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/router";
import Header from "../../components/Header";

export default function Checkout({ cart }) {
  const router = useRouter();

  const [cartState, setCartState] = useState(cart);
  const [loading, setLoading] = useState(false);

  const handleUpdateCart = async (operation, id) => {
    try {
      setLoading(true);
      const {
        data: { cart },
      } = await axios.post("http://localhost:3000/api/cart", {
        operation,
        id,
      });
      setCartState(cart);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const ProductCard = ({ item }) => (
    <div className="w-full flex border-t border-gray-200">
      <div className="p-4 border-l border-gray-200">
        <Image src={item.icon} alt={item.title} width={30} height={30} />
      </div>
      <div className="w-auto flex items-center px-4 border-l border-gray-200">
        <span className="text-xl font-semibold">{item.title}</span>
      </div>
      <div className="ml-auto flex items-center px-4 border-l border-gray-200 text-xl">
        {`$${item.price} X ${item.quantity} = $${item.total_price}`}
      </div>
      <div className="flex items-center space-x-2 px-4 border-x border-gray-200">
        <button
          className="text-lg border bg-gray-100 border-gray-200 p-2"
          onClick={() => handleUpdateCart("REMOVE", item.id)}
        >
          -
        </button>
        <span className="text-xl font-semibold">{item.quantity}</span>
        <button
          className="text-lg border bg-gray-100 border-gray-200 p-2"
          onClick={() => handleUpdateCart("ADD", item.id)}
        >
          +
        </button>
      </div>
    </div>
  );

  if (loading) return <div>Loading ...</div>;

  return (
    <div>
      <Head>
        <title>NextJS Assignment | Checkout</title>
        <meta name="description" content="Created by Vipul Goel" />
        <link rel="icon" href="/static/images/logo.png" />
      </Head>

      <main className="flex flex-col justify-center items-center">
        <Header />

        {!cartState.total_items ? (
          <div className="py-32 flex justify-center items-center">
            <span className="text-2xl font-semibold text-gray-500">
              Your cart is empty
            </span>
          </div>
        ) : (
          <div className="w-full flex flex-col py-8 px-16">
            <div className="bg-gray-300 p-2"></div>
            {Object.values(cartState.items_list).map((item) => (
              <ProductCard key={item.id} item={item} />
            ))}
            <div className="bg-gray-300 p-4 flex justify-end items-center space-x-4">
              <Image
                src="/static/images/shopping-cart.svg"
                alt="cart logo"
                width={20}
                height={20}
              />
              <span className="text-xl">{`Total ${cartState.total_items} items`}</span>
              <span className="text-xl font-semibold">
                {"$" + cartState.cart_value}
              </span>
            </div>
            <div className="ml-auto my-4 space-x-4">
              <button
                className="text-lg text-white bg-gray-800 py-2 px-4"
                onClick={() => handleUpdateCart("REMOVE_ALL")}
              >
                Remove All
              </button>
              <button className="text-lg text-white bg-gray-800 py-2 px-4">
                Order now
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export async function getServerSideProps() {
  try {
    const {
      data: { cart },
    } = await axios.get("http://localhost:3000/api/cart");
    return { props: { cart } };
  } catch (err) {
    console.log(err);
  }
}
