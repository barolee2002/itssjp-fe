import React from "react";
import {
  Row,
  Col,
  Input,
  Button,
  DatePicker,
  message,
  InputNumber,
} from "antd";
import dayjs from "dayjs";
import { useParams } from "react-router";
import axiosClient from "../../api/axiosClient";
import "./style.scss";
import { useNavigate } from "react-router";
import { Dayjs } from "dayjs";
import { NoticeType } from "antd/es/message/interface";
import { pays } from "../../utils/interface/interface";
import { ErrorMessage } from "../../components/ErrorMessage";
import { Detail } from "../../components/IncomeSpendingDetail";
import { useSelector } from "react-redux";
import { userLogin } from "../../redux/selector";
const initState = {
  spendingId: 0,
  name: "",
  amount: 0,
  time: "",
  userId: 0,
  category: "",
  key: 0,
};
function PaymentDetail() {
  const navigate = useNavigate();
  const param = useParams();
  const user = useSelector(userLogin)
  const [messageApi, contextHolder] = message.useMessage();
  const [listCategory, setListCategory] = React.useState<string[]>([])
  const [spending, setSpending] = React.useState<pays>(initState);
  const errorMessage = (typeMess: NoticeType, error: string) => {
    messageApi.open({
      type: `${typeMess}`,
      content: `${error}`,
    });
  };
  React.useEffect(() => {
    const fetchData = async () => {
      const response = await axiosClient.get(`/spending/detail/${param.id}`);
      setSpending(response.data);
    };
    fetchData();
  }, [param.id]);

  const handleAddSpending = async () => {
    const update = axiosClient.put(`spending/${spending.spendingId}`, {
      ...spending,
    });
    update.then(() => {
      errorMessage("success", "更新成功");
      navigate("/admin/payments");
    });
  };
  React.useEffect(() => {
    const getListCategory = async() => {
        try {
            const response = await axiosClient.get(`plan/${user.id}/category`)
            setListCategory(response.data)
        } catch(err) {
            console.log(err);
            
        }
    }
    getListCategory()
  },[])
  return (
    <div>
      {contextHolder}
      <Row className="page-name">収入を編集</Row>
      <Detail detail={spending} setDetail={setSpending} categories={listCategory}/>
      <Button
        type="primary"
        shape="round"
        className="add-button"
        onClick={handleAddSpending}
      >
        アップデート
      </Button>
    </div>
  );
}

export default PaymentDetail;
