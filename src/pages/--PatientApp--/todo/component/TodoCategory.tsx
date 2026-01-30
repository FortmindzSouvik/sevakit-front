import { ROUTES } from "@/utils/routeConstants";
import { useNavigate } from "react-router";

const TodoCategory = ({ title, type }: { title: string; type: string }) => {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-between bg-[#F7FDFF] rounded-2xl p-4 ">
      <p className="text-base font-medium">{title}</p>
      <img
        src="/../icons/right-arrow-icon.svg"
        alt="right arrow"
        className="w-fit h-fit cursor-pointer"
        onClick={() =>
          navigate(
            `/${ROUTES.role.patient}/${ROUTES.patient.todoList}/${ROUTES.patient.toDodetails}?type=${type}`,
          )
        }
      />
    </div>
  );
};

export default TodoCategory;
