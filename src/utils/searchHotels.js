const removeAccents = (str) => {
    const AccentsMap = [
        "aàảãáạăằẳẵắặâầẩẫấậ",
        "AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬ",
        "dđ", "DĐ",
        "eèẻẽéẹêềểễếệ",
        "EÈẺẼÉẸÊỀỂỄẾỆ",
        "iìỉĩíị",
        "IÌỈĨÍỊ",
        "oòỏõóọôồổỗốộơờởỡớợ",
        "OÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢ",
        "uùủũúụưừửữứự",
        "UÙỦŨÚỤƯỪỬỮỨỰ",
        "yỳỷỹýỵ",
        "YỲỶỸÝỴ"
    ];
    for (let i = 0; i < AccentsMap.length; i++) {
        const regex = AccentsMap[i];
        for (let j = 1; j < regex.length; j++) {
            if (str.includes(regex[j])) {
                str = str.replace(regex[j], regex[0]);
            }
        }
        // var re = new RegExp('[' + AccentsMap[i].substr(1) + ']', 'g');
        // var char = AccentsMap[i][0];
        // str = str.replace(re, char);

    }
    return str;
}

exports.searchByArea = (area, hotels) => {
    if (area) {
        const resultHotels = hotels.filter((hotel) => {
            return removeAccents(area.toLowerCase().trim()) === removeAccents(hotel.area.name).toLowerCase();
        })
        return resultHotels
    }
    return hotels
}


exports.searchRoomByDate = (hotels, transactions, startDate, endDate) => {
    startDate = new Date(startDate)
    endDate = new Date(endDate)
    if (hotels.length <= 0) {
        return [];
    }

    let newResultHotels = [];

    // lăp qua từng khách sạn
    for (let hotelPosition = 0; hotelPosition < hotels.length; hotelPosition++) {
        let hotel = hotels[hotelPosition];

        // lây các transaction của Hotel
        const transactionOfHotel = transactions.filter((transaction) => {
            return transaction.hotelId.toString() === hotel._id.toString();
        })
        if (transactionOfHotel.length > 0) {
            // lấy transaction trong khoảng startDate  và endAte
            const transactionsHaveRoomInValid = transactions.filter((transaction) => {
                return startDate >= transaction.dateStart && startDate <= transaction.dateEnd
                    || endDate >= transaction.dateStart && endDate <= transaction.dateEnd
                    || transaction.dateStart >= endDate && transaction.dateEnd <= startDate
                    || transaction.dateEnd >= startDate && transaction.dateEnd <= endDate
            })
            // console.log(transactionsHaveRoomInValid)
            if (transactionsHaveRoomInValid.length > 0) {
                // lấy các số phòng đã được đặt
                const roomNumbersInTransaction = transactionsHaveRoomInValid.reduce((initArray, transaction) => {
                    return initArray = [...initArray, ...transaction.rooms]
                }, [])

                // cắt các phòng đã trong khách sạn
                // laays cac loại phòng
                let rooms = hotel.rooms;
                let roomFiltered = rooms.map((room, index) => {
                    let roomNumbers = rooms[index].roomNumbers; // số phòng trong room hiện tại;
                    for (let roomNumbersPosition = 0; roomNumbersPosition < roomNumbers.length; roomNumbersPosition++) {
                        if (roomNumbersInTransaction.includes(roomNumbers[roomNumbersPosition])) {
                            roomNumbers.splice(roomNumbersPosition, 1);
                            roomNumbersPosition--;
                        }
                    }
                    return {
                        ...room._doc,
                        ...roomNumbers
                    }

                })
                if (roomFiltered.length > 0) {
                    const filterRoomHaveRoomNumber = roomFiltered.filter((room) => {
                        return room.roomNumbers.length !== 0
                    })
                    console.log("fsdf")
                    hotel = {
                        ...hotel._doc,
                        rooms: filterRoomHaveRoomNumber
                    }
                } else {
                    hotel = {
                        ...hotel._doc,
                        rooms: roomFiltered
                    }
                }
            }
        }
        newResultHotels.push(hotel);
    }

    const hotelHaveRoom = newResultHotels.filter((hotel) => {
        return hotel.rooms.length !== 0
    })
    return hotelHaveRoom;
}