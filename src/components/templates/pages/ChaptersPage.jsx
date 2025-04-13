import React, { useEffect, useState } from "react";
import Table from "../../modules/Table";
import { getChapters } from "../../../utils/services";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { IoDocumentOutline } from "react-icons/io5";
import { RxQuestionMark } from "react-icons/rx";
import { MdOutlineSlowMotionVideo } from "react-icons/md";
import { LuFileAudio2 } from "react-icons/lu";
import { FiEdit } from "react-icons/fi";
import { BiSortAlt2 } from "react-icons/bi";
import { GoTrash } from "react-icons/go";
import ToolTip from "../../modules/Tooltip";

function ChaptersPage() {
  const { id } = useParams();
  const [pagination, setPagination] = useState({
    pageSize: 5,
    pageNumber: 1,
    bookId: id,
  });

  const [data, setData] = useState({ data: [] });
  const [loading, setLoading] = useState(true);
  const [expandedRowId, setExpandedRowId] = useState(null);

  useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      pageNumber: 1,
    }));
  }, []);

  useEffect(() => {
    async function fetchChapters() {
      try {
        setLoading(true);
        setData({ data: [] });

        const chapterResponse = await getChapters({ pagination });
        setData(chapterResponse || { data: [] });
      } catch (error) {
        toast.error("Error fetching chapters");
        console.error(error);
        setData({ data: [] });
      } finally {
        setLoading(false);
      }
    }

    fetchChapters();
  }, [pagination]);

  const columns = [
    { key: "image", label: "Image" },
    { key: "title", label: "Title" },
    { key: "order", label: "Order" },
  ];

  const handleRowClick = (id) => {
    setExpandedRowId((prev) => (prev === id ? null : id));
  };

  const renderChapterRow = (item) => {
    const firstGroup = [
      {
        id: "document",
        icon: <IoDocumentOutline />,
        text: "See Documents",
        onClick: () => console.log("View Document", item.id), // Replace with your desired action
      },
      {
        id: "question",
        icon: <RxQuestionMark />,
        text: "View Tests",
        onClick: () => console.log("View Question", item.id), // Replace with your desired action
      },
      {
        id: "video",
        icon: <MdOutlineSlowMotionVideo />,
        text: "Watch Video",
        onClick: () => console.log("Watch Video", item.id), // Replace with your desired action
      },
    ];

    const secondGroup = [
      {
        id: "sort",
        icon: <BiSortAlt2 />,
        text: "Sort",
        onClick: () => console.log("Listen to Audio", item.id), // Replace with your desired action
      },
      {
        id: "edit",
        icon: <FiEdit />,
        text: "Edit Chapter",
        onClick: () => console.log("Edit Chapter", item.id),
      },
      {
        id: "delete",
        icon: <GoTrash />,
        text: "Delete Chapter",
        onClick: () => console.log("Delete Chapter", item.id),
        className: "bg-red-200 text-red-900 hover:bg-red-900 hover:text-white",
      },
    ];
console.log(data.data)
    return (
      <>
        <tr
          key={item.id}
          onClick={() => handleRowClick(item.id)}
          className={`${
            expandedRowId === item.id ? "bg-ocean/15" : ""
          } hover:bg-ocean/6 transition-colors duration-300 border-t border-slate-300 cursor-pointer`}
        >
          <td className="pl-2 pr-2 sm:pl-4 lg:pl-4 md:pl-4 border-slate-300">
            {item.image ? (
              <img src={item.image} className="w-12 h-12 rounded-md" />
            ) : (
              "—"
            )}
          </td>
          <td className="p-4 border-slate-300">{item.title}</td>
          <td className="p-4 border-slate-300">{item.order}</td>
        </tr>

        {expandedRowId === item.id && (
          <tr
            key={`detail-${item.id}`}
            className="bg-ocean/15 border-b border-slate-300"
          >
            <td colSpan={columns.length} className="p-4">
              <div className="flex flex-col gap-4 items-end">
                {[firstGroup, secondGroup].map((group, index) => (
                  <div key={index} className="flex gap-1 p-1 rounded-md">
                    {group.map(({ id, icon, text, onClick, className }) => (

                        <div
                        key={id}
                          data-tooltip-id={id}
                          className={`p-2 cursor-pointer shadow-md rounded-lg transition-colors duration-400 ${
                            className ||
                            "bg-white hover:bg-ocean hover:text-white"
                          }`}
                          onClick={onClick}
                        >
                          {icon}
                          <ToolTip id={id} content={text} />
                        </div>
                    ))}
                  </div>
                ))}
              </div>
            </td>
          </tr>
        )}
      </>
    );
  };

  return (
    <div>
      <Table
        title="Chapters"
        data={data.data}
        setData={setData}
        columns={columns}
        totalData={data.totalCount}
        setPagination={setPagination}
        pagination={pagination}
        loading={loading}
        setLoading={setLoading}
        renderRow={renderChapterRow}
      />
    </div>
  );
}

export default ChaptersPage;
