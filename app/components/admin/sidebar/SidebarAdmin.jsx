'use client';
import React from 'react';
import Link from 'next/link';

const SidebarAdmin = ({ isOpen, toggleSidebar }) => {
  return (
    <div className={`fixed top-0 left-0 h-full w-64 bg-gray-900 text-white z-50 mt-[3.9rem] shadow-lg transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
      <div className="p-4 text-2xl font-semibold flex justify-between items-center">
        <div className="pl-2"><h1>MasterJus Admin</h1></div>
        <button onClick={toggleSidebar} className="flex md:hidden">✕</button>
      </div>
      <nav className="mt-0">
        <ul>
          <li className="p-4 hover:bg-gray-800">
            <Link href="/admin/courses">Cursos</Link>
          </li>
          <li className="p-4 hover:bg-gray-800">
            <Link href="/admin/blogs">Blogs</Link>
          </li>
          <li className="p-4 hover:bg-gray-800">
            <Link href="/admin/infoSite">Imagens do Site</Link>
          </li>
          <li className="p-4 hover:bg-gray-800">
            <Link href="/admin/depositions">Depoimentos</Link>
          </li>
          <li className="p-4 hover:bg-gray-800">
            <Link href="/admin/categories">Categorias</Link>
          </li>
          <li className="p-4 hover:bg-gray-800">
            <Link href="/admin/menu">Menu</Link>
          </li>
          <li className="p-4 hover:bg-gray-800">
            <Link href="/admin/teachers">Professores</Link>
          </li>
          <li className="p-4 hover:bg-gray-800">
            <Link href="/admin/infoCourse">Informações do Curso</Link>
          </li>
          <li className="p-4 hover:bg-gray-800">
            <Link href="/admin/leads">Leads</Link>
          </li>
        
        </ul>
      </nav>
    </div>
  );
};

export default SidebarAdmin;
