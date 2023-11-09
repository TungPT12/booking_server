paging = (dataArray, dataPerPage, page = 1) => {
    const startIndex = dataPerPage * (page - 1);
    const endIndex = startIndex + dataPerPage;
    if (dataArray.length <= dataPerPage) {
        return dataArray
    }
    results = dataArray.slice(startIndex, endIndex)
    return results;
}

module.exports = paging