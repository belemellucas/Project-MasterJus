"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { useRef, useState } from "react";

const RegisterPage = () => {
  const ref = useRef();

  const router = useRouter();

  const [userInfo, setUserInfo] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setUserInfo({
      ...userInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userInfo.username || !userInfo.email || !userInfo.password) {
      setError("Must provide all the Credentials!");
    }

    try {
      setPending(true);

      const res = await fetch("/api/auth/registerSimple", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userInfo),
      });

      if (res.ok) {
        setPending(false);
        ref?.current?.reset();
        router.push("/auth/login");
      } else {
        const errorData = await res.json();
        setError(errorData.message);
        setPending(false);
      }
    } catch (error) {
      setPending(false);
      setError("Something went wrong");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center flex-col">
      <div className="mb-6">
        <Image src="/logo/logo-master.png" alt="Logo" width={200} height={60} />
      </div>
      <form
        ref={ref}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        onSubmit={handleSubmit}
      >
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="username"
          >
            Username
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="username"
            type="text"
            placeholder="Username"
            name="username"
            value={userInfo.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            type="email"
            placeholder="Email"
            name="email"
            value={userInfo.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="password"
            type="password"
            placeholder="********"
            name="password"
            value={userInfo.password}
            required
            onChange={handleChange}
          />
        </div>
        <div className="flex items-center flex-col justify-content">
          <button
            disabled={pending === true}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            {pending ? "Registrando" : "Inscrever-se"}
          </button>
          {error && <span className="text-red-600 mx-2 pt-4 px-2">{error}</span>}

        </div>
      </form>
    </div>
  );
};

export default RegisterPage;
