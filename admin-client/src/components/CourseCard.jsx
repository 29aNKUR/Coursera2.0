import { Card, Typography } from "@mui/material";
import { useRecoilValue } from "recoil";
import Price from "./Price";
import { courseImage, courseTitle } from "../store/selectors/course";


function CourseCard(props) {
    const title = useRecoilValue(courseTitle);
    // const imageLink = useRecoilValue(courseImage);

    return <div style={{display: "flex",  marginTop: 50, justifyContent: "center", width: "100%"}}>
        {/* {console.log(Object.values(props)[0].imageLink)} */}
     <Card style={{
        margin: 10,
        width: 350,
        minHeight: 200,
        borderRadius: 20,
        marginRight: 50,
        paddingBottom: 15,
        zIndex: 2
    }}>
        <img src={Object?.values(props)[0]?.imageLink} style={{width: 350}} ></img>
        <div style={{marginLeft: 10}}>
            <Typography variant="h5">{title}</Typography>
            <Price />
        </div>
    </Card>
    </div>
}

export default CourseCard;