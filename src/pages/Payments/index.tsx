import React from 'react';
import { PaginationProps, Row, Button, Col,Input } from 'antd';
import { useSelector } from 'react-redux';
import { getFormattedDate } from '../../utils/dateFormat';
import { useDispatch } from 'react-redux';
import './style.scss'
import TableContent from '../../components/Table';
import { chartType, metadata } from '../../utils/interface/interface';
import { useNavigate } from 'react-router';
import axiosClient from '../../api/axiosClient';
import { spendings, userLogin } from '../../redux/selector';
import { deleteSpending, updateSpending } from './paymentSlice';

function Payments() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const user = useSelector(userLogin)
    const spendingList = useSelector(spendings)

    const [openfilter, setOpenFilter] = React.useState(false)

    const [paymentHistory, setPaymentHistory] = React.useState<chartType[]>([])
    const [refesh, setRefesh] = React.useState(0)
    const [metadata, setMetadata] = React.useState<metadata>(
        {
            totalPages: 0,
            totalElements: 0,
            elements: 0,
        }
    )
    const handleOpenEdit = (item: chartType) => {
        navigate(`${item.key}`)

    }
    const handleDelete = (item: chartType) => {
        axiosClient.delete(`/spending/${item.key}`)
        dispatch(deleteSpending(item.key))
    }

    const handleShowSizeChange: PaginationProps['onShowSizeChange'] = (current, pageSize) => {
    };
    const handleChangePage: PaginationProps['onChange'] = (current, pageSize) => {
    }
    const handleOpenCreatePayment = () => {
        navigate(`create`)
    }
    React.useEffect(() => {
        const fetchData = async () => {
            const response = await axiosClient.get(`/spending/${user.id}`)
            dispatch(updateSpending(response.data.data))
            setMetadata({
                totalPages: response.data.totalPages,
                totalElements: response.data.totalElements,
                elements: response.data.elements
            })

        }
        fetchData()

    }, [refesh])
    React.useEffect(() => {
        setPaymentHistory(() => {
            return spendingList.map((item, index) => {
                let parseDay = new Date(item.time)
                return {
                    ...item,
                    key: item.spendingId,
                    id: index + 1,
                    date: getFormattedDate(parseDay),
                    amount: item.amount,
                    category: item.category
                }
            })
        })
    }, [spendingList])
    return (
        <div >
            <Row className='page-heading-income'>
                <Col className='page-heading-income-name'>支出</Col>
                <Col span={8}>
                    <Row gutter={[12, 24]} style={{ justifyContent: 'space-between' }}>
                        <Col span={12} offset={12}>
                            <Button
                                type='primary'
                                shape='round'
                                className='page-heading-income-button'
                                // size='large'
                                onClick={handleOpenCreatePayment}
                            >作成</Button>

                        </Col>
                    </Row>
                </Col>
            </Row>
           
            <TableContent
                dataSource={paymentHistory}
                onEdit={(item: chartType) => handleOpenEdit(item)}
                onDelete={(item: chartType) => handleDelete(item)}
                onChangePage={(current: number, pageSize: number) => handleChangePage(current, pageSize)}
                onShowSizeChange={(current: number, pageSize: number) => handleShowSizeChange(current, pageSize)}
                metadata={metadata}
            />
        </div>
    )
}

export default Payments;