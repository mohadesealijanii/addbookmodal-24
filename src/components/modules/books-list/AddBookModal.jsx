import React, { useState, useEffect } from "react"
import toast from "react-hot-toast"
import MultiFilter from "./MultiFilter"

function InputField({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder = "",
  required = false,
  isFile = false,
}) {
  return (
    <div className="relative flex-1">
      {isFile ? (
        <input
          type="file"
          id={id}
          name={id}
          onChange={onChange}
          className="peer w-full border border-grey/30 rounded-md pl-3 pr-10 pt-6 text-sm 
                     focus:outline-none focus:border-sea focus:ring-1 focus:ring-sea 
                     hover:border-sea bg-white transition-all"
        />
      ) : (
        <input
          type={type}
          id={id}
          name={id}
          value={value}
          onChange={onChange}
          placeholder=" "
          className="peer w-full border border-grey/30 rounded-md pl-3 pr-10 pt-6 text-sm 
                     focus:outline-none focus:border-sea focus:ring-1 focus:ring-sea 
                     hover:border-sea bg-white transition-all"
          required={required}
        />
      )}
      <label
        htmlFor={id}
        className="absolute left-3 top-[0.9px] text-gray-500 text-sm transition-all duration-300 
                   peer-placeholder-shown:top-3 peer-placeholder-shown:text-base 
                   peer-placeholder-shown:text-gray-400
                   peer-focus:top-[-0.5rem] peer-focus:text-sm peer-focus:text-sea bg-white px-1 pointer-events-none"
      >
        {label}
      </label>
    </div>
  )
}

function AddBookModal({ setAddBookModal }) {
  const [categories, setCategories] = useState([])
  const [formData, setFormData] = useState({
    title: "",
    version: "",
    category: "",
    authors: "",
    tags: "",
    description: "",
    image: null,
  })
  const [pagination, setPagination] = useState({
    pageSize: 10,
    pageNumber: 1,
  })

  // Fetch categories from the related API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "https://stg-core.bpapp.net/api/categories"
        )
        const data = await response.json()
        setCategories(data) // Assuming data contains the list of categories
      } catch (error) {
        toast.error("Failed to fetch categories")
      }
    }

    fetchCategories()
  }, [])

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  // Handle file input change
  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0],
    })
  }

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(formData)
    toast.success("Book added successfully")
    setAddBookModal(false) // Close modal after successful submission
  }

  return (
    <div className="flex justify-center items-center fixed bg-black/60 inset-0 z-7">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-semibold text-center mb-4 text-sea">
          Add New Book Data
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Row 1: Title & Version */}
          <div className="flex gap-4">
            <div className="w-1/2">
              <InputField
                id="title"
                label="Title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="w-1/2">
              <InputField
                id="version"
                label="Version"
                value={formData.version}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          {/* Row 2: Authors & Tags */}
          <div className="flex gap-4">
            <div className="w-1/2">
              <InputField
                id="authors"
                label="Authors"
                value={formData.authors}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="w-1/2">
              <InputField
                id="tags"
                label="Tags"
                value={formData.tags}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          {/* Row 3: Category & Image */}
          <div className="flex gap-4">
            <div className="w-1/2">
              <MultiFilter
                categories={categories}
                setPagination={setPagination}
              />
            </div>
            <div className="w-1/2">
              <InputField
                id="image"
                label="Image"
                value={formData.image ? formData.image.name : ""}
                onChange={handleFileChange}
                isFile={true}
              />
            </div>
          </div>

          {/* Row 4: Description */}
          <div className="relative">
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder=" "
              className="peer w-full border border-grey/30 rounded-md pl-3 pr-10 pt-6 text-sm 
                 focus:outline-none focus:border-sea focus:ring-1 focus:ring-sea 
                 hover:border-sea bg-white transition-all"
              required
            />
            <label
              htmlFor="description"
              className="absolute left-3 top-[0.9px] text-gray-500 text-sm transition-all duration-300 
                 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base 
                 peer-placeholder-shown:text-gray-400
                 peer-focus:top-[-0.5rem] peer-focus:text-sm peer-focus:text-sea bg-white px-1 pointer-events-none"
            >
              Description
            </label>
          </div>

          {/* Submit Button */}
          <div className="mt-4 text-center">
            <button
              type="submit"
              className="w-full py-2 px-4 bg-orange text-white rounded-md hover:bg-sea-hover transition-colors duration-300"
            >
              Add Book
            </button>
          </div>
        </form>

        {/* Close Modal Button */}
        <button
          onClick={() => setAddBookModal(false)}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
        >
          X
        </button>
      </div>
    </div>
  )
}

export default AddBookModal
