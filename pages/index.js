import Head from "next/head";
import Image from "next/image";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/router";
import Header from "../components/Header";

export default function Dashboard({ items, cart }) {
  const router = useRouter();

  const [itemsState, setItemsState] = useState(items);
  const [cartState, setCartState] = useState(cart);
  const [loading, setLoading] = useState(false);
  const [searchString, setSearchString] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const {
        data: { items },
      } = await axios.get("http://localhost:3000/api/dashboard", {
        params: { search_string: searchString },
      });
      setItemsState(items);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearch = async () => {
    try {
      setLoading(true);
      const {
        data: { items },
      } = await axios.get("http://localhost:3000/api/dashboard");
      setItemsState(items);
      setSearchString("");
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (id) => {
    try {
      setLoading(true);
      const {
        data: { cart },
      } = await axios.post("http://localhost:3000/api/cart", {
        operation: "ADD",
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
      <div className="w-auto flex flex-col items-start justify-center px-4 border-l border-gray-200">
        <span className="text-xl font-semibold">{item.title}</span>
        <span className="text-lg">{item.description}</span>
      </div>
      <div className="ml-auto flex items-center px-4 border-l border-gray-200 text-xl">
        {"$" + item.price}
      </div>
      <div className="flex items-center px-4 border-x border-gray-200">
        <button
          className="text-lg border bg-gray-100 border-gray-200 p-1"
          onClick={() => handleAddToCart(item.id)}
        >
          Add to cart
        </button>
      </div>
    </div>
  );

  if (loading) return <div>Loading ...</div>;

  return (
    <div>
      <Head>
        <title>NextJS Assignment | Dashboard</title>
        <meta name="description" content="Created by Vipul Goel" />
        <link rel="icon" href="/static/images/logo.png" />
      </Head>

      <main className="flex flex-col justify-center items-center">
        <Header>
          <form className="flex items-center space-x-4" onSubmit={handleSearch}>
            <input
              className="p-2 w-80"
              value={searchString}
              onChange={(e) => setSearchString(e.target.value)}
            />
            <button
              className="text-lg border bg-gray-100 border-gray-200 p-1"
              type="submit"
            >
              Search
            </button>
            {searchString ? (
              <button
                className="text-lg border bg-gray-100 border-gray-200 p-1"
                type="button"
                onClick={handleClearSearch}
              >
                clear
              </button>
            ) : null}
          </form>
        </Header>

        {!itemsState.length ? (
          <div className="py-32 flex justify-center items-center">
            <span className="text-2xl font-semibold text-gray-500">
              No product match the search
            </span>
          </div>
        ) : (
          <div className="w-full flex flex-col px-16 py-8">
            <div className="bg-gray-300 p-2"></div>
            {itemsState.map((item) => (
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
            <button
              className="ml-auto my-4 text-lg text-white bg-gray-800 py-2 px-4"
              onClick={() => router.push("/checkout")}
            >
              Proceed to checkout
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export async function getServerSideProps() {
  try {
    const {
      data: { items, cart },
    } = await axios.get("http://localhost:3000/api/dashboard");
    return { props: { items, cart } };
  } catch (err) {
    console.log(err);
  }
}
