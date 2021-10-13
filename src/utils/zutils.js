import Axios from "axios"

export default {
	checkToken: async (callback) => {
		await Axios
			.post("/user/info")
			.then((response) => {
				callback(true);
			})
			.catch((err) => {
				callback(false);
			})
	},
	
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
						// 义工时间上限；2021届以后有变动
						var vim=24,vom=20,vlm=16;
						if(stus[i]["id"]>20210000){ vim=30;vom=16;vlm=18; }
						
                        var inside = stus[i]["inside"]/60.0;
                        var outside = stus[i]["outside"]/60.0;
                        var large = stus[i]["large"]/60.0;
                        var result = true;
                        if (outside < vom) { // 溢出判满机制：校内除二当校外
                            inside = inside - (vom - outside) * 2;
                            outside = vom;
                        }
                        if (large < vlm || inside < vim || outside < vom || inside + outside < vim+vom) {
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