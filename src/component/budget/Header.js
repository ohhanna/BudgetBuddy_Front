import React, {useState, useEffect, forwardRef, useImperativeHandle} from "react";
import axios from "axios";

const Header = forwardRef((props, ref) => {

    useImperativeHandle(ref, () => ({
        getMonthlyTotal
    }));


    // 지출, 수입
    const [expend, setExpend] = useState(0);
    const [income, setIncome] = useState(0);

    useEffect(() => {
        getMonthlyTotal();
    }, [props.curDate]);    

    const getMonthlyTotal = () => {
        axios({
            method: 'get',
            url: '/budget/monthly/total',
            params: {
                userId: 'hue9404',
                recordDt : props.curDate.getFullYear() + '-' + ("00"+(props.curDate.getMonth()+1).toString()).slice(-2)
            }
        })
        .then((res) => {
            console.log("getMonthly");

            let monthly_expend_sum = res.data.monthly_expend_sum.toLocaleString('ko-KR');
            let monthly_income_sum = res.data.monthly_income_sum.toLocaleString('ko-KR');

            setExpend(monthly_expend_sum);
            setIncome(monthly_income_sum);
        })
        .catch((err) => {
            console.error(err);
        });
    }



    return (
        <div className="Header">
            <div className="recordsContent">
                <div className="expendContent">
                    지출<br/>
                    <span className="amount">- {expend}</span>
                </div>
                <div className="incomeContent">
                    수입<br/>
                    <span className="amount">+ {income}</span>
                </div>                    
                {/* <button className="w-btn w-btn-green" style={{marginLeft:"25px"}}>분석</button> */}
            </div>
            <div>
                <button className="w-btn w-btn-green2" style={{width:"450px"}}>자산 분석하기</button>
            </div>
        </div>
    )
})

export default Header;