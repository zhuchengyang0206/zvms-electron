import Axios from "axios"

export default {
    fetchClassList: async (callback) => {
        await Axios
            .get("/class/list")
            .then((response) => {
                callback(response.data.class)
            })
            .catch((err) => {
                console.error(err)
            })
    },

    fetchStudentList: async (classid, callback) => {
        await Axios
            .get("/class/stulist/" + classid)
            .then((response) => {
                console.log(response.data)
                let stus = response.data.student
                if (stus)
                    for (var i = 0; i < stus.length; i++) {
                        var inside = stus[i]["inside"]/60.0;
                        var outside = stus[i]["outside"]/60.0;
                        var large = stus[i]["large"]/60.0;
                        var result = true;
                        if (outside < 20) {
                            inside = inside - (20 - outside) * 2;
                            outside = 20;
                        }
                        if (large < 16 || inside < 20 || outside < 20 || inside + outside < 44) {
                            result = false;
                        }
                        result ? stus[i].finished = "是" : stus[i].finished = "否"
                    }
                callback(stus)
            })
            .catch((err) => {
                console.error(err)
            })
    },

    fetchClassVolunter: async (classid, callback) => {
        let url = classid ? "/class/volunteer/"+classid : "/volunteer/list/";
        await Axios
            .get(url).then((response) => {
                console.log(response.data);
                callback(response.data.volunteer);
            })
            .catch((err) => { console.error(err) })
    },

    fetchAllVolunter: async (callback) => {
        await Axios
            .get("/volunteer/list").then((response) => {
                console.log(response.data);
                callback(response.data.volunteer);
            })
            .catch((err) => { console.error(err) })
    }
}