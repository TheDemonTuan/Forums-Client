import { ToastContainer } from "react-toastify";
import "@/styles/forums/globals.css";
import "react-toastify/dist/ReactToastify.css";
import Header from "@/components/forums/Header";
import Footer from "@/components/forums/Footer";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="flex-auto">{children}</main>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Footer />
    </>
  );
}
