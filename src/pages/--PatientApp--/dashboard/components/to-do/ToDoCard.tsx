import { ROUTES } from "@/utils/routeConstants";
import { useNavigate } from "react-router";

const ToDoCard = () => {
  const navigate=useNavigate()
  return (
    <div className="bg-[#E8F9FF] rounded-3xl shadow-md  p-4 space-y-3 font-mona">
      <div className="flex items-center space-x-2">
        <img src="/../icons/todo-white-icon.svg" alt="todo" className="w-fit h-fit" />
        <div>
          <p className="font-semibold text-[#000000]">To-do List</p>
          <p className="text-sm font-normal text-[#000000] -mt-1">
            Tasks from your healthcare providers.
          </p>
        </div>
      </div>

      {/* Task Item */}
      {/* <div className="bg-[#F7FDFF] p-3 rounded-2xl flex justify-between">
        <div className="flex flex-col">
          <p className="text-sm font-medium text-[#000000]">
            X-Ray: Chest (New)
          </p>
          <p className="text-xs text-[#000000]">Nov 22, 2025</p>
        </div>
        <div className="mt-3">
          <p className="text-right text-xs font-medium text-[#009FB6] ">
            Assigned by Dr. Wilson
          </p>
        </div>
      </div> */}
      <button className="w-full mt-3 bg-[#009FB6] text-[#FFFFFF] text-sm py-3 rounded-2xl flex items-center justify-center space-x-1 cursor-pointer" onClick={()=>navigate(`/${ROUTES.role.patient}/${ROUTES.patient.todoList}`)}>
        <span>Open the To-do List Screen</span>
        <img
          src="/../icons/arrow-icon.svg"
          alt="arrow"
          className="w-fit h-fit"
        />
      </button>
    </div>
  );
};

export default ToDoCard;
