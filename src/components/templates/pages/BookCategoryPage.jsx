import Cookies from "js-cookie";
import { useEffect, useRef, useState } from "react";
import { ClipLoader, PropagateLoader } from "react-spinners";
import { GoTrash } from "react-icons/go";
import { CiEdit } from "react-icons/ci";
import { CiSearch } from "react-icons/ci";
import { MdArrowDropUp } from "react-icons/md";
import { IoMdAddCircleOutline } from "react-icons/io";
import toast, { Toaster } from "react-hot-toast";
import Sidebar from "../../modules/Sidebar";
import RowDropdown from "../../modules/RowDropdown";
import CategoryModal from "../../modules/CategoryModal";
import DeleteModal from "../../modules/DeleteModal";

function BookCategories() {
  const token = Cookies.get("authToken");

  const [allCategories, setAllCategories] = useState([]);
  const [info, setInfo] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState(info);
  const [currentPage, setCurrentPage] = useState(1);
  const [categoryPerPage, setCategoryPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [jumpInput, setJumpInput] = useState(false);
  const [check, setCheck] = useState(false);
  const [selecetedId, setSelectedId] = useState(null);
  const [selectedTitle, setSelectedTitle] = useState("");
  const [dropdown, setDropdown] = useState(false);
  const [editedCategory, setEditedCategory] = useState("");
  const [categoryModal, setCategoryModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);

  const indexOfLastCategory = currentPage * categoryPerPage;
  const indexOfFirstCategory = indexOfLastCategory - categoryPerPage;
  const totalPages = Math.ceil(
    (searchTerm ? filteredCategories.length : info.length) / categoryPerPage
  );
  const currentCategories = (searchTerm ? filteredCategories : info).slice(
    indexOfFirstCategory,
    indexOfLastCategory
  );

  const lastPage = indexOfLastCategory / categoryPerPage;

  const fetchData = async () => {
    try {
      if (!token) {
        toast.error("You're not logged in");
        return;
      }
      const res = await fetch(
        "https://stg-core.bpapp.net/api/BookCategory/GetAllBookCategories",
        {
          method: "GET",
          headers: {},
        }
      );

      const data = await res.json();
      // console.log("Data from API22222:", data);
      setInfo(data.data);
      setInfo([...new Set(data.data)]);
      setAllCategories(data.data);
      // console.log(allCategories)
      // console.log("Data from API:", data.data);
      return data.data;
    } catch (error) {
      console.log(error.message);
      toast.error("Error fetching data");
    }
  };

  useEffect(() => {
    fetchData();
  }, [allCategories]);

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(+currentPage + 1);
    }
    setEditingCategoryId(null);
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      setJumpInput("");
    }
  };

  const jumpHandler = (e) => {
    const input = e.target.value;
    setJumpInput(input);

    if (input > totalPages) {
      toast.error(`page must be between 1 to ${totalPages}`);
      setCurrentPage(1);
    } else if (input === "") {
      setCurrentPage(1);
    } else {
      setCurrentPage(input);
    }
    setEditingCategoryId(null);
  };

  const checkboxHandler = () => {
    setCheck((prev) => !prev);

    if (check === true) {
      console.log("first");
    } else {
      console.log("second");
    }
  };
  const searchHandler = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    if (!value) {
      setFilteredCategories(info);
    } else {
      const searchResult = info.filter((category) =>
        category.title.toLowerCase().includes(value)
      );
      setFilteredCategories(searchResult);
    }

    setCurrentPage(1);
    setJumpInput("");
  };

  const dropdownHandler = () => {
    setDropdown((prev) => !prev);
  };

  const handleRowsChange = (newRows) => {
    setCategoryPerPage(newRows);
    setCurrentPage(1);
    setDropdown(false);
  };

  const editHandler = async (id) => {
    const token = Cookies.get("authToken");
    try {
      setLoading(true);
      const res = await fetch(
        `https://stg-core.bpapp.net/api/BookCategory/GetBookCategoryForUpdate?id=${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLoading(false);
      const data = await res.json();
      setEditingCategoryId(data.id);
      setEditedTitle(data.title);
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  const saveHandler = async (id) => {
    const token = Cookies.get("authToken");
    setLoading(true);

    try {
      const updatedCategory = {
        id,
        title: editedTitle,
        parentId: editedCategory ? editedCategory.parentId : 5,
        categoryType: editedCategory ? editedCategory.categoryType : 0,
        hasBook: editedCategory ? editedCategory.hasBook : true,
      };

      const res = await fetch(
        "https://stg-core.bpapp.net/api/BookCategory/UpdateBookCategory",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedCategory),
        }
      );

      if (!res.ok) throw new Error("Failed to update category");

      const data = await res.json();
      console.log(data);
      toast.success("category updated successfully!");
      setEditingCategoryId("");
      fetchData();
      setLoading(false);
    } catch (error) {
      console.error(error.message);
      toast.error("error updating category");
    }
  };

  const cancelHandler = () => {
    setEditingCategoryId(null);
    setEditedTitle("");
  };

  const dropdownRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className="flex justify-self-start flex-1 min-w-0 max-w-full mx-auto px-4">
        <div className="shadow-md overflow-auto max-h-fit md:min-w-max max-w-[900px] mx-auto w-screen rounded-b-2xl">
          <div className="overflow-auto flex flex-col h-fit min-h-fit text-slate-700 bg-white shadow-t-2xl rounded-xl">
            <div className="flex mx-4 mt-4 text-slate-700 rounded-none">
              <h3 className="text-lg font-semibold text-slate-800">
                Book Categories
              </h3>
            </div>

            <div className="p-0">
              {info.length > 0 ? (
                <table className="w-full mt-4 text-left table-auto min-w-max">
                  <thead>
                    <tr>
                      <th className="p-4  border-slate-200">
                        <div className="flex justify-between items-center w-full">
                          <div className="flex">
                            <div className="flex border-1 border-solid border-slate-200 p-1 rounded">
                              <CiSearch size={30} />
                              <input
                                onChange={searchHandler}
                                placeholder="search categories"
                                className="pl-1 focus:outline-none"
                              />
                            </div>
                            <label className="mx-2 bg-slate-800/10 p-2 rounded">
                              <input
                                type="checkbox"
                                className="accent-sea"
                                onChange={checkboxHandler} // Correctly trigger the handler on change
                                checked={check}
                              />
                              <span> has book</span>
                            </label>
                          </div>
                          <button
                            onClick={() => setCategoryModal(true)}
                            className="cursor-pointer group flex items-center lg:border-2 md:border-2 sm:border-2 p-[1.9px] lg:border-sea md:border-sea sm:border-sea px-1 rounded lg:hover:bg-sea sm:hover:bg-sea md:hover:bg-sea hover:text-white transition-colors duration-400"
                          >
                            <IoMdAddCircleOutline
                              size={30}
                              className="group-hover:text-ocean text-ocean p-[1px] transition-colors duration-400"
                            />
                            <span className="hidden lg:inline md:inline sm:inline ml-1 text-ocean pr-1">
                              add
                            </span>
                          </button>
                          {categoryModal && (
                            <CategoryModal
                              onClose={() => setCategoryModal(false)}
                              setCategoryModal={setCategoryModal}
                              setCurrentPage={setCurrentPage}
                              fetchData={fetchData}
                              totalPages={totalPages}
                              allCategories={allCategories}
                              setAllCategories={setAllCategories}
                              setInfo={setInfo}
                            />
                          )}
                        </div>
                      </th>
                    </tr>
                    <tr>
                      <th className="flex justify-between border-b-[1px] border-slate-200 px-4 py-2 text-xl text-ocean">
                        <div>Title</div>
                        <div className="space-x-3">
                          <span>Edit</span>
                          <span>Delete</span>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentCategories.map((item) => (
                      <tr key={item.id} className="border-b border-slate-200">
                        <td className="p-4 flex justify-between items-center">
                          {editingCategoryId === item.id ? (
                            <input
                              type="text"
                              value={editedTitle}
                              onChange={(e) => setEditedTitle(e.target.value)}
                              className="border p-1 rounded"
                              autoFocus
                              // readOnly={loading}
                            />
                          ) : (
                            <span>{item.title}</span>
                          )}

                          <div className="flex space-x-2">
                            {editingCategoryId !== item.id && (
                              <button
                                onClick={() => editHandler(item.id)}
                                className="px-2 pt-1 flex hover:bg-blue-200 rounded"
                              >
                                <CiEdit size={20} className="m-1" />
                              </button>
                            )}

                            {editingCategoryId === item.id && (
                              <div className="flex gap-2">
                                <button
                                  onClick={() => saveHandler(item.id)}
                                  className="px-3 py-1 flex items-center justify-center hover:bg-green-200 rounded"
                                >
                                  {loading ? (
                                    <p>
                                      <ClipLoader className="-mb-2" size={20} />
                                    </p>
                                  ) : (
                                    <p>Save</p>
                                  )}
                                </button>
                                <button
                                  onClick={cancelHandler}
                                  className="px-7 py-2 border-blood/40 an border-2 text-ocean rounded hover:bg-blood/50 hover:text-white transition-colors duration-300"
                                >
                                  Cancel
                                </button>
                              </div>
                            )}

                            <button
                              onClick={() => {
                                setDeleteModal(true);
                                setSelectedId(item.id);
                                setSelectedTitle(item.title);
                              }}
                              className="px-3 py-1 flex items-center justify-center hover:bg-red-200 rounded"
                            >
                              <GoTrash className="m-1" />
                            </button>
                            {deleteModal && (
                              <DeleteModal
                                onClose={() => setDeleteModal(false)}
                                className="px-3 py-1 flex hover:bg-red-100 rounded"
                                setDeleteModal={setDeleteModal}
                                id={selecetedId}
                                fetchData={fetchData}
                                totalPages={totalPages}
                                selectedTitle={selectedTitle}
                                setInfo={setInfo}
                                categoryPerPage={categoryPerPage}
                                lastPage={lastPage}
                                setCurrentPage={setCurrentPage}
                              />
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="flex justify-center items-center h-64">
                  <PropagateLoader size={20} color="#023047" />
                </div>
              )}
            </div>

            {/* pagination */}

            <div className="text-nowrap bg-ocean/10 bg-op border-[1px] border-blue-950/15 rounded-b-2xl shadow-2xl">
              <div className="flex items-center justify-between p-3">
                <div className="flex relative">
                  <p className="text-sm text-slate-500 pr-3 pt-2.5">
                    Page {currentPage} of {totalPages}
                  </p>
                  <div className="group rounded border border-slate-300 pr-2 h-fit py-1 mt-1.5   pl-1 m-1 lg:px-3 text-center text-xs font-semibold text-slate-600 transition-all ">
                    <label className="group-hover:text-ocean group-focus-within:text-ocean text-sm text-slate-500">
                      jump to page
                      <input
                        type="number"
                        max={totalPages}
                        value={jumpInput}
                        placeholder=" "
                        className="pl-4 appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none w-10 outline-none bg-inherit"
                        onChange={jumpHandler}
                      />
                    </label>
                  </div>

                  <div
                    ref={dropdownRef}
                    className="relative flex group rounded border border-slate-300 text-nowrap h-fit py-1 mt-1 text-center text-xs font-semibold text-slate-600 transition-all hover:cursor-pointer"
                  >
                    <p
                      onClick={dropdownHandler}
                      className="group-hover:text-ocean group-focus-within:text-ocean text-sm text-slate-500 pl-1"
                    >
                      rows
                      <span> {categoryPerPage}</span>
                    </p>
                    <p>
                      <MdArrowDropUp size={20} />
                    </p>
                    {dropdown && (
                      <div className="absolute bottom-10 mx-auto left-6 shadow-lg rounded mt-1 z-50">
                        <RowDropdown onSelect={handleRowsChange} />
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    className="rounded border border-slate-300 py-2.5 px-3 text-center text-xs font-semibold text-slate-600 transition-all hover:opacity-75 focus:ring focus:ring-slate-300 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                    type="button"
                    disabled={currentPage === 1}
                    onClick={handlePrevious}
                  >
                    Previous
                  </button>
                  <button
                    className="rounded border border-slate-300 py-2.5 px-3 text-center text-xs font-semibold text-slate-600 transition-all hover:opacity-75 focus:ring focus:ring-slate-300 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                    type="button"
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </>
  );
}

export default BookCategories;
