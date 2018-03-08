export default function transform(csvDatapoint, csvHeaders){
    let jsonDatapoint = {};
    for(let i=0;i<csvDatapoint.length;i++){
        jsonDatapoint[csvHeaders[i]] = csvDatapoint[i];
    }

    return JSON.stringify(jsonDatapoint);
}