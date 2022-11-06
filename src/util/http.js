import axios from "axios";
import { store } from "../redux/store"


axios.defaults.baseURL = "http://localhost:5222"
axios.defaults.timeout = 5000

axios.interceptors.request.use((res) => {
    store.dispatch({
        type: "change_isLoading", playLoad: true
    })
    return res
}, (error) => {
    return Promise.reject(error);

})

axios.interceptors.response.use((res) => {
    store.dispatch({
        type: "change_isLoading", playLoad: false
    })
    return res
}, (error) => {
    store.dispatch({
        type: "change_isLoading", playLoad: false
    })
    return Promise.reject(error);

})