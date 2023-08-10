import { Grid } from "@mui/material";
import { useEffect } from "react"
import { useParams } from "react-router-dom";
import axios from "axios";
import {Loading} from "./Loading";
import { BASE_URL } from "../config.js";
import { courseState } from "../store/atoms/course";
import { useRecoilValue, useSetRecoilState} from "recoil";
import {  isCourseLoading } from "../store/selectors/course";
import CourseHeader from "./CourseHeader";
import UpdateCourseCard from "./UpdateCourseCard";
import CourseCard from "./CourseCard";


function Course() {
    let { courseId } = useParams();
    const course = useRecoilValue(courseState);
    const  setCourse = useSetRecoilState(courseState);
    const courseLoading = useRecoilValue(isCourseLoading);

    useEffect(() => {
        axios.get(`${BASE_URL}/admin/course/${courseId}`, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        }).then(res => {
            setCourse({isLoading: false, course: res.data.course});
        })
        .catch(e => {
            setCourse({isLoading: false, course: null});
        });
    }, []);

    if (courseLoading) {
        return <Loading />
    }

    return <div>
        <CourseHeader />
        <Grid container>
            <Grid item lg={8} md={12} sm={12}>
                <UpdateCourseCard />
            </Grid>
            <Grid item lg={4} md={12} sm={12}>
                <CourseCard props = {course.course}/>
            </Grid>
        </Grid>
    </div>
}


export default Course;