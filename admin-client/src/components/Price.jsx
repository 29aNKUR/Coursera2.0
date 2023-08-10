import { Typography } from "@mui/material";
import { useRecoilValue } from "recoil";
import { coursePrice } from "../store/selectors/course";

function Price() {

    const price = useRecoilValue(coursePrice);
    return <>
        <Typography variant="subtitle2" style={{color: "gray"}}>
            Price
        </Typography>
        <Typography variant="subtitle1">
            <b>Rs {price} </b>
        </Typography>
    </>
}

export default Price