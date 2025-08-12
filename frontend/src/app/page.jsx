import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <>
    <div className=" m-16 p-10  bg-gray-50 ">
      <div className="flex space-x-6">
        {/* Card 1 */}
        <div className="bg-white rounded-lg shadow p-4 w-1/3 min-h-[200px]">
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-lg shadow p-4 flex-1 min-h-[200px]">

        </div>
      </div>

      {/* Card tabela */}
      <div className="bg-white rounded-lg shadow p-4 min-h-[280px]"></div>
      </div>
    </>
  );
}
