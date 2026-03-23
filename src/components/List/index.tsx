import {useCallBack, useState} from "react";

export const List = () => {
    const [list, setList] = useState<number[]>([]);

    return (
        <div>
            {
            list.map((item)=>(
                <div key={item}>{item}</div>
            ))
            }
            <button onClick={()=>{
                setList([...list, list.length]);
            }}>
                追加元素
            </button>
        </div>
    );

}