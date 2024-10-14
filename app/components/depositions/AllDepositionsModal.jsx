import React, { useState } from "react";


const AllDepositionsModal = ({ isOpen, onClose, depositions }) => {
   const [expandedIndex, setExpandedIndex] = useState(null);

   const maxChars = 100;
    if (!isOpen) return null;

    const toggleExpand = (index) => {
        setExpandedIndex(expandedIndex === index ? null : index); 
    }; 

return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-3xl relative">
        <h2 className="text-xl font-bold mb-4 flex justify-center">Todos os Depoimentos</h2>
        <button
          className="absolute top-2 right-2"
          onClick={onClose}
        >
          <img
            src="/icones/x.png" // Adicione o ícone de fechar que você preferir
            alt="Fechar"
            className="w-4 h-4 cursor-pointer"
          />
        </button>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 overflow-y-auto max-h-[70vh]">
          {depositions.map((deposition, index) => (
            <div key={index} className="bg-gray-100 p-4 rounded-lg shadow-md flex flex-col items-center">
              <img
                loading="lazy"
                src={deposition.imageDep[0]}
                className="w-[120px] h-[160px] rounded-full object-cover mb-2"
                alt={deposition.autorDepo}
              />
               <p className={`text-black mb-2 text-center ${
                  expandedIndex === index ? "" : "h-[120px] overflow-hidden"
                }`}
              >
                {deposition.depoimento}
              </p>
              {deposition.depoimento.length > maxChars && (
                <button 
                   className="text-blue-500 text-sm mt-1"
                   onClick={() => toggleExpand(index)}
                   >
                    {expandedIndex === index ? "⬆️ Ver Menos" : "⬇️ Ver Mais"}
                   </button>
              )}
              
             <p className="text-gray-500 italic">— {deposition.autorDepo}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
)
}

export default AllDepositionsModal;