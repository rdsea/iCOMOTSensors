export default function transform(jsonDatapoint){
    let headers = Object.keys(jsonDatapoint);
    let values = Object.values(jsonDatapoint);

    return `${headers.join(',')}\n${values.join(',')}`
}