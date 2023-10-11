import Mock from 'mockjs'

// 随机生成 机器人
export function randomBot(num) {
    let data=[]
    for (var i = 0; i < num; i++) {
        data.push({
            account: Mock.Random.guid(),
            age: Mock.Random.integer(20, 50),
            face_url: "",
            gender: 1,
            login_ip: Mock.Random.ip(),
            nick_name: Mock.Random.cname(),
            phone_number: "",
            role: "bot",
            signatures: "",
            status: 1,
            user_id: Mock.Random.id(),
        })
    }
    return data
}