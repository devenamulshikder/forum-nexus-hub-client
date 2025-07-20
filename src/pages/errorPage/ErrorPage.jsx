import { Link } from "react-router";
import Lottie from "lottie-react";
import errorAnimation from "../../../public/errorLotties/errorLottie.json";
export const ErrorPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f9fafb] to-[#f3f4f6] px-4">
      <div className="text-center p-8 max-w-3xl mx-auto">
        <div className="w-72 h-72 mx-auto mb-2">
          <Lottie animationData={errorAnimation} loop={true} />
        </div>

        <h1 className="text-5xl font-bold mb-3 bg-gradient-to-br from-[#6D7CFF] to-[#A167FF] bg-clip-text text-transparent">
          404
        </h1>

        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Discussion Not Found!
        </h2>

        <p className="text-lg text-gray-600 mb-8">
          This thread seems to have vanished into the digital void.
          <br />
          Maybe it was moved or deleted?
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/"
            className="text-white font-bold text-lg px-6 py-3 cursor-pointer rounded-[15px] bg-gradient-to-br from-[#6D7CFF] to-[#A167FF] hover:opacity-90 transition-opacity"
          >
            Return to Forum
          </Link>
          <Link
            to={-1}
            className="text-[#6D7CFF] font-bold text-lg px-6 py-3 cursor-pointer rounded-[15px] border-2 border-[#6D7CFF] hover:bg-gray-50 transition-colors"
          >
            Back to Discussion
          </Link>
        </div>
      </div>
    </div>
  );
};
