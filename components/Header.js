import Image from "next/image";
import { useRouter } from "next/router";

const Header = ({ children }) => {
  const router = useRouter();

  return (
    <header className="w-full bg-gray-200 flex gap-8 items-center px-8 py-2">
      <div
        className="flex items-center gap-4 cursor-pointer"
        onClick={() => router.push("/")}
      >
        <Image
          src="/static/images/logo.png"
          alt="Logo"
          width={70}
          height={70}
        />
        <span className="text-4xl">Shopping</span>
      </div>
      {children}
    </header>
  );
};

export default Header;
