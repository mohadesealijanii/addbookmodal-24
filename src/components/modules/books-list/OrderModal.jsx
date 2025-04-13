import React, { useState } from "react";
import Input from "../Input";
import { changeOrder } from "../../../utils/services";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";

function OrderModal({ onClose, title, id, setModal, initialOrder }) {
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(initialOrder);

  const orderHandler = async (id, order) => {
    try {
      setLoading(true);
      const res = await changeOrder(id, order);
      console.log(res);

      if (res.status === 200) {
        setLoading(false);
        setModal(false);
        toast.success("Done!");
      }
      setLoading(false);
    } catch (error) {
      toast.error(error.message);
    }
  };
  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
      <div className="bg-white py-6 px-12 rounded-lg shadow-lg max-w-96 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
        >
          ✖
        </button>
        <h2 className="text-md mb-2 text-center ">
          please enter the view order of the "
          {<span className="text-sea">{title}</span>}" book
        </h2>
        <div className="flex justify-center">
          <Input
            label="type the order"
            value={order}
            onChange={(e) => setOrder(e.target.value)}
          />
        </div>
        <div className="flex justify-around gap-2 mt-12">
          <button
            onClick={onClose}
            className="px-7 py-2 border-blood/40 an border-2 text-ocean rounded hover:bg-blood/50 hover:text-white transition-colors duration-300"
          >
            cancel
          </button>
          {loading ? (
            <p className="flex items-center justify-center max-h-10 mb-[1px] px-9 bg-sea text-white rounded">
              <ClipLoader size={20} color="white" />
            </p>
          ) : (
            <button
              onClick={() => orderHandler(id, order)}
              className="px-9 py-2 bg-sea/45 rounded hover:bg-sea/70 hover:text-white transition-colors duration-300"
            >
              confirm
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default OrderModal;
