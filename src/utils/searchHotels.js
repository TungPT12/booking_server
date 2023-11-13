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
    if (transactions.length <= 0) {
        return hotels
    }
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
            const transactionsHaveRoomInValid = transactionOfHotel.filter((transaction) => {
                return startDate >= transaction.dateStart && startDate <= transaction.dateEnd
                    || endDate >= transaction.dateStart && endDate <= transaction.dateEnd
                    || transaction.dateStart >= endDate && transaction.dateEnd <= startDate
                    || transaction.dateEnd >= startDate && transaction.dateEnd <= endDate
            })
            if (transactionsHaveRoomInValid.length > 0) {
                // lấy các số phòng đã được đặt
                let roomNumbersInTransaction = transactionsHaveRoomInValid.reduce((initArray, transaction) => {
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

exports.searchByPeople = (people, hotels) => {
    people = parseInt(people)
    if (people) {
        let resultHotels = []
        for (let index = 0; index < hotels.length; index++) {
            const hotel = hotels[index];
            const rooms = hotels[index].rooms;
            const roomAvailable = rooms.find((room) => {
                return people <= room.maxPeople;
            })
            if (roomAvailable) {
                resultHotels.push(hotel)
            }
        }
        // console.log()
        return resultHotels
    }
    return hotels
}
