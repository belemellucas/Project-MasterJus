"use client";
import { useState } from "react";
import { toast } from "react-toastify";

const Register = () => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("As senhas não coincidem!");
      return;
    }
    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', 
            },
            body: JSON.stringify(formData)
        });
        if (response.ok) {
            const data = await response.json(); 
    
            toast.success(`${data.message}`, {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
            });
          } else {
            toast.error("Ocorreu um erro. Tente novamente.", {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
            });
            
          }
    } catch (error) {
        console.error('Erro:', error);

    }
   }
  const [formData, setFormData] = useState({
    cpf: "",
    username: "",
    nome: "",
    email: "",
    celular: "",
    password: "",
    confirmPassword: "",
    cep: "",
    endereco: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   if (formData.password !== formData.confirmPassword) {
  //     alert("As senhas não coincidem!");
  //     return;
  //   }
  //   onRegister(formData);
  // };

  return (
    <div className="relative w-full max-w-[1200px] mx-auto p-4 mb-20">
      {/* Heading */}
      <h2 className="absolute w-full lg:w-[264.78px] h-[48px] left-1/2 transform -translate-x-1/2 top-[45px] font-poppins font-extrabold text-[32px] lg:text-[40px] leading-[48px] text-center text-[#0A0A0A]">
        Cadastre-se
      </h2>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="relative h-auto lg:h-[416px] mx-auto top-[111px]">
      
          <div className="relative w-full lg:w-[1170px] h-auto lg:h-[314px] mx-auto bg-[#929090] rounded-[10px] p-4 lg:p-0">
            {/* CPF/CNPJ */}
            <label className="block lg:absolute lg:w-[71.75px] lg:h-[21px] lg:left-[20px] lg:top-[22px] font-poppins font-bold text-[14px] leading-[21px] text-[#212529] mt-2 lg:mt-0">
              CPF/CNPJ
            </label>
            <input
              type="text"
              name="cpf"
              value={formData.cpf}
              onChange={handleChange}
              placeholder="CPF/CNPJ"
              className="block w-full lg:w-[23%] lg:absolute lg:top-[45px] lg:left-[21px] bg-white border border-[#CED4DA] rounded-[4px] p-2 mt-2 lg:mt-0"
            />

            {/* Nome */}
            <label className="block lg:absolute lg:w-[43.24px] lg:h-[21px] lg:left-[310px] lg:top-[22px] font-poppins font-bold text-[14px] leading-[21px] text-[#212529] mt-2 lg:mt-0">
              Nome
            </label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              placeholder="Nome"
              className="block w-full lg:w-[23%] lg:absolute lg:top-[45px] lg:left-[311px] bg-white border border-[#CED4DA] rounded-[4px] p-2 mt-2 lg:mt-0"
            />

            {/* Username */}
            <label className="block lg:absolute lg:w-[61.76px] lg:h-[21px] lg:left-[600px] lg:top-[22px] font-poppins font-bold text-[14px] leading-[21px] text-[#212529] mt-2 lg:mt-0">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
              className="block w-full lg:w-[23%] lg:absolute lg:top-[45px] lg:left-[601px] bg-white border border-[#CED4DA] rounded-[4px] p-2 mt-2 lg:mt-0"
            />

            {/* E-mail */}
            <label className="block lg:absolute lg:w-[48.65px] lg:h-[21px] lg:left-[890px] lg:top-[22px] font-poppins font-bold text-[14px] leading-[21px] text-[#212529] mt-2 lg:mt-0">
              E-mail
            </label>
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="E-mail"
              className="block w-full lg:w-[23%] lg:absolute lg:top-[45px] lg:left-[891px] bg-white border border-[#CED4DA] rounded-[4px] p-2 mt-2 lg:mt-0"
            />

            {/* Tel. Celular */}
            <label className="block lg:absolute lg:w-[80.76px] lg:h-[21px] lg:left-[20px] lg:top-[100px] font-poppins font-bold text-[14px] leading-[21px] text-[#212529] mt-2 lg:mt-0">
              Tel. Celular
            </label>
            <input
              type="text"
              name="celular"
              value={formData.celular}
              onChange={handleChange}
              placeholder="Tel. Celular"
              className="block w-full lg:w-[23%] lg:absolute lg:top-[123px] lg:left-[21px] bg-white border border-[#CED4DA] rounded-[4px] p-2 mt-2 lg:mt-0"
            />

            {/* Senha */}
            <label className="block lg:absolute lg:w-[45.97px] lg:h-[21px] lg:left-[310px] lg:top-[100px] font-poppins font-bold text-[14px] leading-[21px] text-[#212529] mt-2 lg:mt-0">
              Senha
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Senha"
              className="block w-full lg:w-[23%] lg:absolute lg:top-[123px] lg:left-[311px] bg-white border border-[#CED4DA] rounded-[4px] p-2 mt-2 lg:mt-0"
            />

            {/* Confirmar Senha */}
            <label className="block lg:absolute lg:w-[123.48px] lg:h-[21px] lg:left-[600px] lg:top-[100px] font-poppins font-bold text-[14px] leading-[21px] text-[#212529] mt-2 lg:mt-0">
              Confirmar Senha
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirmar Senha"
              className="block w-full lg:w-[23%] lg:absolute lg:top-[123px] lg:left-[601px] bg-white border border-[#CED4DA] rounded-[4px] p-2 mt-2 lg:mt-0"
            />

            {/* CEP */}
            <label className="block lg:absolute lg:w-[27.34px] lg:h-[21px] lg:left-[890px] lg:top-[100px] font-poppins font-bold text-[14px] leading-[21px] text-[#212529] mt-2 lg:mt-0">
              CEP
            </label>
            <input
              type="text"
              name="cep"
              value={formData.cep}
              onChange={handleChange}
              placeholder="CEP"
              className="block w-full lg:w-[23%] lg:absolute lg:top-[123px] lg:left-[891px] bg-white border border-[#CED4DA] rounded-[4px] p-2 mt-2 lg:mt-0"
            />

            {/* Endereço */}
            <label className="block lg:absolute lg:w-[67.46px] lg:h-[21px] lg:left-[20px] lg:top-[178px] font-poppins font-bold text-[14px] leading-[21px] text-[#212529] mt-2 lg:mt-0">
              Endereço
            </label>
            <input
              type="text"
              name="endereco"
              value={formData.endereco}
              onChange={handleChange}
              placeholder="Endereço"
              className="block w-full lg:w-[23%] lg:absolute lg:top-[201px] lg:left-[21px] bg-white border border-[#CED4DA] rounded-[4px] p-2 mt-2 lg:mt-0"
            />

            <div>
              {/* Número */}
              <label className="block lg:absolute lg:w-[58.71px] lg:h-[21px] lg:left-[310px] lg:top-[178px] font-poppins font-bold text-[14px] leading-[21px] text-[#212529] mt-2 lg:mt-0">
                Número
              </label>
              <input
                type="text"
                name="numero"
                value={formData.numero}
                onChange={handleChange}
                placeholder="Número"
                className="block w-full lg:w-[23%] lg:absolute lg:top-[201px] lg:left-[311px] bg-white border border-[#CED4DA] rounded-[4px] p-2 mt-2 lg:mt-0"
              />

              {/* Complemento */}
              <label className="block lg:absolute lg:w-[104.53px] lg:h-[21px] lg:left-[600px] lg:top-[178px] font-poppins font-bold text-[14px] leading-[21px] text-[#212529] mt-2 lg:mt-0">
                Complemento
              </label>
              <input
                type="text"
                name="complemento"
                value={formData.complemento}
                onChange={handleChange}
                placeholder="Complemento"
                className="block w-full lg:w-[23%] lg:absolute lg:top-[201px] lg:left-[601px] bg-white border border-[#CED4DA
            rounded-[4px] p-2 mt-2 lg:mt-0"
              />
            </div>

            {/* Estado */}
            <select
              name="estado"
              value={formData.estado}
              onChange={handleChange}
              className="block w-full lg:w-[23%] lg:absolute lg:top-[201px] lg:left-[891px] bg-white border border-[#CED4DA] rounded-[4px] p-2 mt-2 lg:mt-0"
            >
              <option value="Acre">Acre</option>
              {/* Add other states as options */}
            </select>

            {/* Cidade */}
            <select
              name="cidade"
              value={formData.cidade}
              onChange={handleChange}
              className="block w-full lg:w-[23%] lg:absolute lg:top-[256px] lg:left-[21px] bg-white border border-[#CED4DA] rounded-[4px] p-2 mt-2 lg:mt-0"
            >
              <option value="Acrelândia">Acrelândia</option>
              {/* Add other cities as options */}
            </select>

            {/* Bairro */}
            <select
              name="bairro"
              value={formData.bairro}
              onChange={handleChange}
              className="block w-full lg:w-[23%] lg:absolute lg:top-[256px] lg:left-[311px] bg-white border border-[#CED4DA] rounded-[4px] p-2 mt-2 lg:mt-0"
            >
              <option value="Centro">Centro</option>
              {/* Add other neighborhoods as options */}
            </select>

            {/* Deseja receber e-mail de ofertas e promoções? */}
            <div className="block lg:absolute w-full lg:w-[355.66px] lg:h-[21px] lg:left-[600px] lg:top-[256px] flex items-center mt-2 lg:mt-0">
              <input type="checkbox" className="mr-2" />
              <label className="font-poppins font-bold text-[14px] leading-[21px] text-[#212529]">
                Deseja receber e-mail de ofertas e promoções?
              </label>
            </div>
          </div>

          {/* Button */}
          <div className="flex justify-center mt-4 lg:mt-8">
            <button
              type="submit"
              className="w-full lg:w-[202.75px] h-[38px] bg-[#FF7200] rounded-[5px] flex items-center justify-center font-poppins font-extrabold text-[15px] leading-[23px] text-white"
            >
              CADASTRAR
            </button>
          </div>

        </div>
      </form>
    </div>
  );
};
export default Register;
