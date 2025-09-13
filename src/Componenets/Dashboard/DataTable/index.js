import Button from "@/Componenets/ui/Button";

const DataTable = ({ headers, data, title, setIsModalOpen, btnLabel }) => {
  return (
    <div className="  bg-white shadow-md rounded-2xl text-sm  relative b px-5 pt-6 pb-2.5 shadow-default  dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="max-w-full overflow-x-auto">
        <div className="flex items-center justify-between mb-5 ">
          <h1 className=" text-lg  text-black font-bold mb-3">{title}</h1>
          {btnLabel && (
            <Button
              label={btnLabel}
              onClick={() => setIsModalOpen(true)}
              className={"absolute right-5 sm:right-8"}
            />
          )}
        </div>

        <table className="w-full table-auto">
          <thead className="bg-gray-2 uppercase h-10">
            <tr>
              {headers?.map((item, index) => (
                <th className=" min-w-52 cursor-pointer " key={index}>
                  <span
                    className="flex whitespace-nowrap  font-semibold px-5 text-xs"
                    style={{ justifyContent: item?.align }}
                  >
                    {item.label || item.attribute}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data?.length ? (
              data?.map((item, rowIndex) => (
                <tr className=" font-medium text-black text-xs " key={rowIndex}>
                  {headers?.map((header, colIndex) => (
                    <td className=" py-4 px-5 " key={colIndex}>
                      <span
                        style={{ justifyContent: header?.align }}
                        className="flex"
                      >
                        {header?.parseData
                          ? header.parseData(item)
                          : header?.attribute === "isActive"
                          ? item[header.attribute]
                            ? "Yes"
                            : "No"
                          : item[header.attribute]}
                      </span>
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={headers?.length || 1}
                  className="text-center py-10"
                >
                  <p>No Records Found</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
