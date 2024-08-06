import React, {useState, useEffect, useRef} from "react";

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs, { Dayjs } from 'dayjs';
import {useForm} from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message'


function Modal(props){
    const {onClose} = props;
    const {content} = props;
    const {mode} = props;

    // 모달 배경 스크롤 막기
    useEffect(() => {
        document.body.style.cssText = `
            position: fixed; 
            top: -${window.scrollY}px;
            overflow-y: scroll;
            width: 100%;`;
        return () => {
            const scrollY = document.body.style.top;
            document.body.style.cssText = '';
            window.scrollTo(0, parseInt(scrollY || '0', 10) * -1);
        };
    }, []);


    // 저장버튼 클릭
    const {register, handleSubmit, setValue, formState:{errors}} = useForm();
    const onSubmit = (data) => {
        props.saveData(data);
    }
    

    // 삭제버튼 클릭
    const deleteData = () => {
        if(window.confirm("삭제하시겠습니까?")){
            props.deleteData();
        }
    }


    const [inputValue, setInputValue] = useState({});
    
    // 입력 값이 숫자만 포함되도록 제한하고 콤마를 추가
    const handleChange = (e, type) => {

        if( type !== 'number' ) return;

        const {name, value} = e.target;
        // 숫자와 콤마만 남기고 제거
        const numbersOnly = value.replace(/[^0-9]/g, '');
        // 3자리마다 콤마를 추가
        const formattedNumber = numbersOnly.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        
        setValue(name, formattedNumber); // react-hook-form 상태 업데이트
        setInputValue((preValues)=>({
            ...preValues,
            [name] : formattedNumber
        }));
    };


    useEffect(() => {
        if (mode === 'UPD') {
            content.forEach((obj) => {
            let value = obj.value || '';
            if (obj.element === 'input' && obj.type === 'number') {
                value = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            }
            setValue(obj.name, value); // react-hook-form 상태 업데이트
            setInputValue((prev) => ({ ...prev, [obj.name]: value }));
            });
        }
    }, [mode, content, setValue]);


    return (
        <div className="modal">
            <div className="modal_popup">
                <div style={{width:"100%",height:"10%"}}>
                    <button className="transper btn" style={{fontSize:"20px"}} onClick={()=>onClose(false)}>X</button>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} style={{width:"100%",height:"90%"}}>
                    <div style={{width:"100%",height:"90%",overflowY:"auto"}}>
                        
                        {content.map((item) => (
                            <div style={{display:"-webkit-inline-box", width:"100%"}}>
                                <div style={{width:"30%"}}>{item.label}</div>
                                <div style={{width:"70%"}}>
                                    {(() => {
                                        switch (item.element) {
                                            case "input":
                                                return <div>
                                                            <input 
                                                                name={item.name} 
                                                                value={inputValue[item.name]}
                                                                // defaultValue={item.value}
                                                                maxLength={item.maxLength}
                                                                {...register(item.name,
                                                                    { required: { value: item.required, message: "입력해주세요." } })}
                                                                onChange={(e) => handleChange(e, item.type)}
                                                            />
                                                            <ErrorMessage
                                                                errors={errors}
                                                                name={item.name}
                                                                render={({ message }) => <p style={{color:"red", fontSize:"10px", margin:"0"}}>{message}</p>}
                                                            />
                                                        </div>
                                            case "select":
                                                return (
                                                    <div>
                                                        <select name={item.name}
                                                                {...register(item.name,
                                                                    { required: { value: item.required, message: "선택해주세요." } })}>
                                                            {item.option.map((opt) => (
                                                                <option value={opt.code_id} selected={item.value === opt.code_id}>{opt.code_name}</option>
                                                            ))}
                                                        </select>
                                                        <ErrorMessage
                                                            errors={errors}
                                                            name={item.name}
                                                            render={({ message }) => <p style={{color:"red", fontSize:"10px", margin:"0"}}>{message}</p>}
                                                        />
                                                    </div>
                                                    );
                                            case "date":
                                                return (
                                                    <div>
                                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                            <DateTimePicker 
                                                                name={item.name}
                                                                value={dayjs(item.value)}
                                                                format="YYYY-MM-DD HH:mm:ss"
                                                                {...register(item.name,
                                                                    { required: { value: item.required, message: item.label + "을 입력해주세요" } })}
                                                            />
                                                        </LocalizationProvider>
                                                    </div>
                                                );    
                                            default:
                                                return null;
                                        }
                                    })()}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div style={{width:"100%",height:"10%"}}>
                        {
                            mode == 'REG'
                            ? <button type="submit" className="w-btn w-btn-green2" style={{width:"100%",bottom:"0"}}>저장</button>
                            : <div style={{display:"flex"}}>
                                <div onClick={deleteData} className="w-btn deleteBtn" style={{border:"solid 1px"}}></div>
                                <button type="submit" className="w-btn w-btn-green2" style={{width:"100%",bottom:"0"}}>저장</button>
                              </div>
                        }
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Modal;