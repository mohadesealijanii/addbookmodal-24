import React, { useEffect, useRef, useState } from "react"
import { PropagateLoader } from "react-spinners"
import toast, { Toaster } from "react-hot-toast"
import RowDropdown from "./RowDropdown"
import Pagination from "@mui/material/Pagination"
import Stack from "@mui/material/Stack"
import IsFree from "./books-list/IsFree"
import MultiFilter from "./books-list/MultiFilter"

function Table({
  data,
  columns,
  title,
  pagination,
  setPagination,
  totalData,
  loading,
  customHeaderContent,
  renderRow,
  searchRow,
  addButton,
}) {
  const totPages = Math.ceil(totalData / pagination.pageSize)
  const thisPage = pagination.pageNumber
  const [dropdown, setDropdown] = useState(false)
  const [jumpInput, setJumpInput] = useState("")
  const dropdownRef = useRef(null)
  const [searchFields, setSearchFields] = useState({
    title: "",
    authors: "",
    tags: "",
  })
  const handlePageChange = async (event, value) => {
    setPagination({ ...pagination, pageNumber: value })
  }

  const jumpHandler = async (e) => {
    const input = e.target.value
    setJumpInput(input)
    let targetPage = +input
    if (!input || targetPage < 1 || targetPage > totPages) {
      toast.error(`Page must be between 1 to ${totPages}`)
      targetPage = 1
    }
    setPagination({ ...pagination, pageNumber: targetPage })
  }

  const handleRowsChange = (newRows) => {
    setPagination({
      ...pagination,
      pageSize: newRows,
      pageNumber: 1,
    })
    setDropdown(false)
  }

  const dropdownHandler = () => setDropdown((prev) => !prev)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSearchFieldChange = (e) => {
    const { name, value } = e.target
    setSearchFields((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSearch = () => {
    setPagination({
      ...pagination,
      ...searchFields,
      pageNumber: 1,
    })
  }
  return (
    <div className="min-h-screen flex justify-center overflow-y-scroll overflow-x-scroll">
      <div className="w-full pb-10 max-h-fit rounded-b-2xl">
        <div className="flex flex-col  h-fit min-h-fit text-slate-700 bg-white shadow-md rounded-xl">
          <div className="flex justify-between mx-4 mt-4 text-slate-700 rounded-none">
            <h1 className="text-lg font-semibold text-slate-800">{title}</h1>
            {addButton}
          </div>
          <div className="mb-5">
            {customHeaderContent && (
              <div className="max-w-full flex">{customHeaderContent}</div>
            )}
          </div>

          <div className="p-0 w-full">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <PropagateLoader size={20} color="#023047" />
              </div>
            ) : data?.length > 0 ? (
              <div className="max-h-[500px] overflow-y-auto w-full">
                <table className="w-full">
                  <thead className="">
                    {searchRow && (
                      <tr className="h-50 ">
                        <td colSpan={9} className="z-50 shadow-lg">
                          <div className="flex mt-1 gap-3 rounded-md m-2">
                            {["title", "authors", "tags"].map((field, idx) => (
                              <div key={idx} className="relative flex-1 gap-3">
                                <input
                                  name={field}
                                  value={pagination[field]}
                                  placeholder=" "
                                  onChange={handleSearchFieldChange}
                                  className="peer w-full border border-grey/30 rounded-md pl-3 pr-3 pt-5 pb-1 text-sm
                  focus:outline-none focus:border-sea focus:ring-1 focus:ring-sea 
                  hover:border-sea transition-all"
                                />
                                <label
                                  className="absolute left-3 top-[0.5px] text-gray-500 text-xs transition-all duration-300 
                  peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm 
                  peer-placeholder-shown:text-gray-400
                  peer-focus:top-[-0.5rem] peer-focus:text-xs peer-focus:text-sea bg-white px-1 pointer-events-none"
                                >
                                  {field.charAt(0).toUpperCase() +
                                    field.slice(1)}
                                </label>
                              </div>
                            ))}
                            <div className="">
                              <MultiFilter setPagination={setPagination} />
                            </div>
                          </div>

                          <div className="w-full mt-5 flex">
                            <button
                              onClick={handleSearch}
                              className="w-full ml-2 py-1.5 text-sm bg-sea text-white rounded-md hover:bg-blue-700 transition-all"
                            >
                              Search
                            </button>
                            <IsFree
                              setPagination={setPagination}
                              pagination={pagination}
                            />
                          </div>
                        </td>
                      </tr>
                    )}

                    <tr className="top-0 sticky h-15 bg-slate-100 z-2">
                      {columns.map((col, idx) => (
                        <th key={idx} className="p-2 text-left">
                          {col.label}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {data.map((item) => (
                      <React.Fragment key={item.id}>
                        {renderRow(item)}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex flex-col justify-center items-center h-64">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/7486/7486809.png"
                  width="156"
                  height="156"
                  alt=""
                />
                <p className="text-lg text-gray-500">Nothing Found!</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          <div className="text-nowrap bg-ocean/10 bg-op border-[1px] border-blue-950/15 rounded-b-2xl shadow-xl">
            <div className="flex items-center justify-between px-5 py-4">
              {/* Jump to Page Input */}
              <div className="hidden lg:flex items-center gap-2">
                <p className="text-sm text-slate-600">Jump to page:</p>
                <input
                  type="number"
                  value={jumpInput}
                  onChange={jumpHandler}
                  className="w-16 px-2 py-1 focus:outline-0  border-[1px] brder-sea rounded-md border-slate-300 text-sm"
                  min={1}
                  // max={totPages}
                />
              </div>

              {/* Pagination UI */}
              <Stack spacing={2}>
                <Pagination
                  count={totPages}
                  page={thisPage}
                  siblingCount={1}
                  onChange={handlePageChange}
                  color="primary"
                />
              </Stack>

              {/* Rows Dropdown */}
              <div ref={dropdownRef} className="relative">
                <button
                  onClick={dropdownHandler}
                  className="text-sm text-slate-600 border px-3 py-1 rounded border-slate-300"
                >
                  Rows: {pagination.pageSize}
                </button>
                {dropdown && (
                  <div className="absolute bottom-0 left-0 z-5">
                    <RowDropdown onSelect={handleRowsChange} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* </div> */}
      <Toaster />
    </div>
  )
}

export default Table
