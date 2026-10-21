import { Navigate } from "react-router-dom";
import ManageExamPrices from "./ManageExamPrices";

const ExamPricesAccess = () => {
  if (!localStorage.getItem("uc_admin_token")) {
    return <Navigate to="/school/login" replace />;
  }

  return <ManageExamPrices />;
};

export default ExamPricesAccess;
