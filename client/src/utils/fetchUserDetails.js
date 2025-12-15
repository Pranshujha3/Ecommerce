import Axios from "./Axios"
import SummaryApi from "../common/summaryApi"

const fetchUserDetails = async()=>{
    try {
        const response = await Axios({
            ...SummaryApi.userDetails,
            withCredentials: true
        })
        return response.data
    } catch (error) {
        console.log(error)
    }
}

export default fetchUserDetails 

//end