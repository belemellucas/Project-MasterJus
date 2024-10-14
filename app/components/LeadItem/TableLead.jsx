'use client'
import React from 'react';
import { useTable } from 'react-table';
import dayjs from 'dayjs';

const LeadsTable = ({ infoleads }) => {
  // Garante que infoleads seja sempre um array
  const leadsArray = Array.isArray(infoleads) ? infoleads : [];


  const data = React.useMemo(
    () =>
      leadsArray.map((lead) => ({
        nome: lead.nome || 'N/A', // Tratando campos vazios
        email: lead.email || 'N/A',
        // createdAt: lead.createdAt
        createdAt: dayjs(lead.createdAt).format('DD/MM/YYYY'), // Formatando a data
      })),
    [leadsArray]
  );

  const columns = React.useMemo(
    () => [
      {
        Header: 'Nome', // Título da coluna
        accessor: 'nome', // Chave do objeto que será exibida nesta coluna
      },
      {
        Header: 'Email', // Título da coluna
        accessor: 'email', // Chave do objeto que será exibida nesta coluna
      },
       {
         Header: 'Data de Criação',
         accessor: 'createdAt',
       },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data });

  return (
    <div className="overflow-x-auto">
      <table {...getTableProps()} className="min-w-full bg-white border border-gray-300">
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()} className="bg-gray-100">
              {headerGroup.headers.map(column => (
                <th
                  {...column.getHeaderProps()}
                  className="px-4 py-2 text-left text-sm font-semibold text-gray-700"
                >
                  {column.render('Header')} {/* Renderiza o nome da coluna */}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} className="border-t">
                {row.cells.map(cell => (
                  <td {...cell.getCellProps()} className="px-4 py-2 text-sm text-gray-600">
                    {cell.render('Cell')}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default LeadsTable;
