import Image from "next/image";
import Link from "next/link";

const chamados = [
  { name: "Neil Sims", email: "email@example.com", avatar: "/avatars/neil.png" },
  { name: "Bonnie Green", email: "email@example.com", avatar: "/avatars/bonnie.png" },
  { name: "Micheal Gough", email: "email@example.com", avatar: "/avatars/micheal.png" },
  { name: "Thomas Lean", email: "email@example.com", avatar: "/avatars/thomas.png" },
  { name: "Lana Byrd", email: "email@example.com", avatar: "/avatars/lana.png" },
  { name: "Karen Nelson", email: "email@example.com", avatar: "/avatars/karen.png" },
];

const acoes = [
  "Abrir chamado",
  "Acompanhar chamados",
  "Acessar o manual/FAQ inclusivo",
];

const resumoChamados = [
  { chamado: "Payment from Bonnie Green", date: "Apr 23, 2021", amount: "$2300", status: "Completed" },
  { chamado: "Payment refund to #00910", date: "Apr 23, 2021", amount: "-$670", status: "Completed" },
  { chamado: "Payment failed from #087651", date: "Apr 18, 2021", amount: "$234", status: "Cancelled" },
  { chamado: "Payment from Bonnie Green", date: "Apr 15, 2021", amount: "$5000", status: "In progress" },
  { chamado: "Payment from Jese Leos", date: "Apr 15, 2021", amount: "$2300", status: "In progress" },
  { chamado: "Payment from THEMSBERG LLC", date: "Apr 11, 2021", amount: "$280", status: "Completed" },
];

const statusColors = {
  Completed: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
  "In progress": "bg-blue-100 text-blue-700",
};

export default function Home() {
  return (
    <div className=" p-6 bg-gray-50 space-y-6">

      {/* Linha com dois cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card 1 - Últimos chamados */}
        <div className="bg-white rounded-xl shadow p-4 ">
          <h2 className="font-semibold text-lg mb-3">Últimos chamados</h2>
          <ul>
            {chamados.map(({ name, email, avatar }) => (
              <li key={name} className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 relative rounded-full overflow-hidden">
                  <Image
                    src={avatar}
                    alt={name}
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium">{name}</p>
                  <p className="text-sm text-gray-500">{email}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Card 2 - Ações rápidas */}
        <div className="bg-white rounded-xl shadow p-4 min-h-[280px]">
          <h2 className="font-semibold text-lg  mb-3">Ações rápidas</h2>
          <ul className=" list-inside  space-y-2 text-black cursor-pointer">
            {acoes.map((acao) => (
              <li className="border-b" key={acao}>
                <Link
                  href={`/${acao.toLowerCase().replace(/\s+/g, "-")}`}
                  className=""
                >
                  {acao}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Card 3 - Resumo dos chamados */}
      <div className="bg-white rounded-xl shadow p-6 min-h-[280px]">
        <h2 className="font-semibold text-lg mb-4">Resumo dos seus chamados</h2>
        <p className="text-gray-500 mb-6 text-sm">
          This is a list of latest transactions.
        </p>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-300">
              <th className="py-2">Chamados</th>
              <th className="py-2">Date & Time</th>
              <th className="py-2">Amount</th>
              <th className="py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {resumoChamados.map(({ chamado, date, amount, status }, i) => (
              <tr
                key={i}
                className={`border-b border-gray-200 ${
                  i % 2 === 0 ? "bg-gray-50" : "bg-white"
                }`}
              >
                <td className="py-2">{chamado}</td>
                <td className="py-2">{date}</td>
                <td className="py-2 font-mono">{amount}</td>
                <td className="py-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[status]}`}
                  >
                    {status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
