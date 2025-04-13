import toast from "react-hot-toast"
import { getAllBooks, getBooksAny } from "../../../utils/services"
import Table from "../../modules/Table"
import { useEffect, useState } from "react"
import SearchAny from "../../modules/books-list/SearchAny"
import DetailRow from "../../modules/books-list/DetailRow"
import { MdOutlineExpandCircleDown, MdOutlineLocalOffer } from "react-icons/md"
import { TbCurrencyDollarOff } from "react-icons/tb"
import StarRating from "../../modules/StarRating"
import { FaCirclePlus } from "react-icons/fa6"
import AddBookModal from "../../modules/books-list/AddBookModal"

function BookListPage() {
  const [pagination, setPagination] = useState({
    pageSize: 10,
    pageNumber: 1,
    category: "",
    categoryList: [],
    title: "",
    authors: "",
    tags: "",
    isOffer: null,
  })
  const [data, setData] = useState({ data: [] })
  const [loading, setLoading] = useState(true)
  const [detailRow, setDetailRow] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(false)
  const [searchRow, setSearchRow] = useState(false)
  const [anyValue, setAnyValue] = useState("")
  const [addBookModal, setAddBookModal] = useState(false)
  const [searchAny, setSearchAny] = useState({
    pageSize: 10,
    pageNumber: 1,
    text: anyValue,
  })

  const handleAny = async () => {
    if (!anyValue.trim()) return

    const updatedSearchAny = {
      pageSize: 10,
      pageNumber: 1,
      text: anyValue.trim(),
    }

    setSearchAny(updatedSearchAny)
    setSearchRow(false)

    try {
      setLoading(true)
      const bookResponse = await getBooksAny(updatedSearchAny)
      setData(bookResponse || { data: [] })
    } catch (error) {
      toast.error("Error fetching search results")
      setData({ data: [] })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    async function fetchBooks() {
      try {
        setLoading(true)
        const bookResponse = await getAllBooks({ pagination })
        setData(bookResponse || { data: [] })
      } catch (error) {
        toast.error("Error fetching books")
        console.log(error)
        setData({ data: [] })
      } finally {
        setLoading(false)
      }
    }

    if (!anyValue.trim()) {
      fetchBooks()
    }
  }, [pagination, anyValue])

  const columns = [
    { key: "expand", label: " " },
    { key: "image", label: "Image" },
    { key: "id", label: "ID" },
    { key: "title", label: "Title" },
    { key: "category", label: "Category" },
    { key: "rate", label: "Rate" },
  ]

  const filters = (
    <div className="justify-between w-full">
      <div className="block">
        <SearchAny
          setPagination={setPagination}
          pagination={pagination}
          setLoading={setLoading}
          setSearchRow={setSearchRow}
          setSearchAny={setSearchAny}
          searchAny={searchAny}
          handleAny={handleAny}
          anyValue={anyValue}
          setAnyValue={setAnyValue}
        />
      </div>
    </div>
  )
  const BASE_URL = "https://stg-core.bpapp.net/"
  const THUMB = "Content/Images/Book/Thumb/"

  // https://stg-core.bpapp.net/Content/Images/Book/Thumb/75d7d25e33fb4a70b9ed9c51289c6d1e.jpg
  const renderBookRow = (item) => (
    <>
      {/* {console.log(${BASE_URL}${THUMB}${item.imageName})}{" "} */}
      <tr
        className={`w-full hover:bg-ocean/6 transition-colors duration-400 border-t border-slate-300 overflow-x-hidden cursor-pointer ${
          detailRow === item.id ? "bg-ocean/5 text-bold" : ""
        }`}
        onClick={() =>
          setDetailRow((prev) => (prev === item.id ? null : item.id))
        }
      >
        <td className="pl-4 text-sea-hover">
          <button className="">
            <MdOutlineExpandCircleDown
              size={20}
              className={`transform transition-transform duration-300 ${
                detailRow === item.id ? "rotate-180" : "rotate-0"
              }`}
            />
          </button>
        </td>
        <td className="pl-2">
          <img
            src={`${BASE_URL}${THUMB}${item.imageName}`}
            alt=" "
            className="w-16 h-auto p-2 "
          />
        </td>
        <td className="pl-2 pr-2 sm:pl-4 lg:pl-4 md:pl-4 border-slate-300">
          {item.id}
        </td>
        <td className=" p-4 border-slate-300">
          {item.isOffer && (
            <span className="p-1 bg-sea rounded text-white mr-1">
              <MdOutlineLocalOffer renderRow />
            </span>
          )}
          {item.isFree && (
            <span className="p-1 bg-green-400 rounded text-white mr-1">
              <TbCurrencyDollarOff />
            </span>
          )}
          {item.title}
        </td>
        <td className="p-4 border-slate-300">{item.category}</td>
        <td className="flex contnet-center">
          <StarRating score={item.score} />
        </td>
      </tr>
      {detailRow === item.id && (
        <tr className="transition-all duration-500 ease-in-out max-h-[500px] opacity-100 overflow-hidden">
          <td colSpan={6}>
            <DetailRow
              author={item.authors}
              tag={item.tags}
              description={item.description}
              end={item.end}
              start={item.start}
              id={item.id}
              title={item.title}
              offer={item.isOffer}
              initialOrder={item.order}
              free={item.isFree}
              version={item.version}
              imageSrc={`${BASE_URL}${THUMB}${item.imageName}`}
              renderRow={renderBookRow}
              setRefreshTrigger={setRefreshTrigger}
            />
          </td>
        </tr>
      )}
    </>
  )

  const addButton = () => (
    <button
      onClick={() => setAddBookModal((prev) => !prev)}
      className="flex bg-sun hover:bg-orange cursor-pointer transition-colors duration-300 px-[22px] py-2 rounded-md text-nowrap text-white relative overflow-visible"
    >
      <FaCirclePlus size={25} className="mr-4" />
      Add Book
    </button>
  )

  return (
    <div>
      {addBookModal && <AddBookModal setAddBookModal={setAddBookModal} />}
      <Table
        title="Books List"
        addButton={addButton()}
        data={data.data}
        setData={setData}
        columns={columns}
        totalData={data.totalCount}
        setPagination={setPagination}
        pagination={pagination}
        loading={loading}
        setLoading={setLoading}
        detailRow={detailRow}
        setDetailRow={setDetailRow}
        customHeaderContent={filters}
        renderRow={renderBookRow}
        searchRow={searchRow}
        setSearchRow={setSearchRow}
        setSearchAny={setSearchAny}
      />
    </div>
  )
}

export default BookListPage
